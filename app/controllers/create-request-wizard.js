import Ember from 'ember';
//import ENV from 'bart/config/environment';
import $ from 'jquery';

export default Ember.Controller.extend({
    ajaxService: Ember.inject.service('ajax-service'),
    toast: Ember.inject.service(),
    requestType: [

        { title: 'Support Issue', value: 'support_issue' },
        { title: 'Enhancement', value: 'enhancement' },
        { title: 'User Testing (UAT)', value: 'uat' },
    ],
    selectedRequestType: {},
    reqQuery: '',
    createRequestForm: {
        creatingForSomeoneElse: false,
        addWatchers: false,
        summary: '',
        description: '',
        selectedRequestType: '',
        createAnotherRequest: false

    },

    issuetype: "",

    init() {
       /* this.set('selectedRequestType', this.requestType[0]);
        $(document).on('click', '.steps-container .step-trigger', function() {
            var container = $(this).parents('.steps-container:first');
            var trigger = $(this);
            container.find('.step').fadeOut(300, function() {
                container.find(trigger.attr('data-target')).fadeIn();
            });
        });*/
    },

    isValide: Ember.computed('model.requestNumber', function() {
        return true;
    }),

    actions: {
        appQuery: function() {
            var appQuery = this.get('appSearch');
            console.log(appQuery);
        },
        reqQuery: function() {
            var reqQuery = this.get('reqSearch');
            console.log(reqQuery);
        },

        requestTypeChanged: function(value) {
            this.set('createRequestForm.selectedRequestType', value);
            this.set('selectedRequestType', value);
            console.log('------', this.model);
            let templateCd = null;

            if (value === 'break_fix') {
                templateCd = this.model.appDetails.template_BF;
                this.model.issuetype = "Bug";
                this.set('issuetype', 'Break Fix');
            } else if (value === 'enhancement') {
                templateCd = this.model.appDetails.template_ER;
                this.model.issuetype = "Improvement";
                this.set('issuetype', 'Enhancement');
            } else if (value === 'uat') {
                templateCd = this.model.appDetails.template_UAT;
                this.model.issuetype = "Defect";
                this.set('issuetype', 'User Testing (UAT)');
            }

            if (templateCd !== null) {
                this.send('populateTemplate', templateCd);
            }

            /*$(".step-1").addClass("hide");*/
            //$(".step-2").removeClass("hide");
            //this.nextStep();
        },

        viewStatus(key) {
            if (this.get('isValide')) {
                this.transitionToRoute('statusdetails.statusdetail', key);
            }
        },

        requestType() {
            this.router.transitionTo('request-type');
        },
        getRequestData(searchKey, event) {
            console.log([searchKey, event, arguments]);
        },

        populateTemplate(templateCd) {

            let url = "/api/templates/get?templateID=" + templateCd;
            var tempHtml = '<tr id="ticketsSummary" class="templateClass">' +
                '<td width="" align="right">&nbsp;<b><font color=red>*</font></b>' +
                '&nbsp;Summary :&nbsp;</td>' +
                '<td><input class="templateClass" name="summary" aotsfield="" ></td></tr>';

            this.get('ajaxService').request(url).then((response) => {
                //console.log(response);
                let data = response.data;

                $('#createForm').html(tempHtml + data.html);
                this.model.template = data;

                console.log(data);
                $(".step-2").removeClass("hide");
                $('#createForm').html(data.html);
                return data;
            }).catch(function(error) {
                throw error;
            });
        },

        cancle() {
            this.set('issuetype', '');
            localStorage.removeItem("shortDesc");
            this.transitionToRoute('home');
        },

        submit() {
            if($('#files').val().length > 0){
                this.toast.warning('Please upload the file before creating the ticket.');
            }
            var ticket = {};
            ticket.projectKey = this.model.appDetails.project_key;
            ticket.summary = $('form input[name="summary"]').val();
            ticket.projectName = this.model.shortDesc;
            ticket.appID = this.model.appDetails.newClientID;
            ticket.targetSystem = this.model.appDetails.target_system;
            ticket.issuetype = this.model.issuetype;
            ticket.description = "";

            var issueFields = {};
            issueFields.customfield_10102 = localStorage.getItem('attuid');

            ticket.issueFields = issueFields;


            let files = $('#attachments').val();
            if(files.length > 0){
                ticket.attachments = files;
            }
            let ids = this.model.template.ids;
            console.log(ids);
            let idArray = ids.split(',');
            console.log(idArray);

            $.each(idArray, function(index, value) {
                let name = $('#' + value).attr('name');
                let val = $('#' + value).val();
                if (name.indexOf('Request Details') > -1) {
                    ticket.log = val;
                } else {
                    //ticket[name] = val;
                }
            });

            console.log(ticket);
            this.send('createTicket', ticket);
        },

        createTicket(ticket) {
            let url = '/api/ticket/create';
            this.get('ajaxService').post(url, { data: { args: JSON.stringify(ticket) } }).then((response) => {
                console.log(response);
                let data = response.data;
                this.toast.success("Your request has been entered in BizOps JIRA as " + data.key + " Transaction ID" + data.MSRP_Number);
                this.send('addAttachemntToTicket',data.key);
                this.send('viewStatus', data.key);

                return data;
            }).catch(function(error) {
                throw error;
            });
        },

        nextStep() {
            if (this.steps.current <= this.steps.max) {
                this.set('steps.current', this.steps.current++);
            }
        },
        prevStep() {
            if (this.steps.current > 0) {
                this.set('steps.current', this.steps.current--);

            }
        },

        showReportedBy() {
            this.toggleProperty('createRequestForm.creatingForSomeoneElse');
            if(this.get('createRequestForm.creatingForSomeoneElse')){
                /*var url= ENV.APP.ajaxServiceHost + '/UserProfileV5/UserProfileV5Service?WSDL';
                this.get('ajaxService').request(url).then((response) => {
                    console.log(response);
                    
                }).catch(function(error) {
                    throw error;
                });*/
                $('#myModal').modal('show');
            } else {
                let userInfo = localStorage.getItem("userInfo");
                if(userInfo == null){
                    this.transitionTo('home');
                }
                let user = JSON.parse(userInfo);

                let model = this.get('model');

                Ember.set(model,'attuid',user.ATTUID);
                Ember.set(model,'fullName',user.FULLNAME);
                Ember.set(model,'phone',user.PHONE);
            }
            
        },

        uploadFile(){
            let data = new FormData();
                $.each($('#files')[0].files, function(i, file) {
                    data.append('file', file);
                });

            let url='/upload';
                this.get('ajaxService').request(url,{
                    method: "POST",
                    data : data,
                    cache: false,
                    contentType: false,
                    processData: false
                }).then((response) => {
                    console.log(response);
                    $('#files').val('');
                    let file = $('#attachments').val();
                    if(file.length > 0) {file += ',';}
                    file += response.data.name;
                    $('#attachments').val(file);
                    let html = '<li class="list-group-item">'+response.data.name+'</li>';
                    $('#attachmentsList').append(html);
                    if($('#attachmentsList li').length > 1){
                        $('#attachmentsList').removeClass('hidden');
                    } else {
                        $('#attachmentsList').addClass('hidden');
                    }
                    
                }).catch(function(error) {
                    console.log(error);
                    throw error;
                });

                return false;
        },

        addAttachemntToTicket(ticketid){
            let that = this;
            $('#attachmentsList li').each(function(index,ele){
                var url='/api/attachment/add?tt='+ticketid+'&files='+$(ele).text()+'&slotList=1';
                that.get('ajaxService').request(url).then((response) => {
                    console.log(response);
                    
                }).catch(function(error) {
                    throw error;
                });
            });
            
        },

        updateReportedBy(){
                let fullName = $('#fullName').val();
                let attuid = $('#attuid').val();
                let phone = $('#phone').val();
                let model = this.get('model');

                Ember.set(model,'attuid',attuid);
                Ember.set(model,'fullName',fullName);
                Ember.set(model,'phone',phone);

                /*model.attuid = attuid;
                model.fullName = fullName;
                model.phone = phone;
                this.set('model' ,model);*/
                $('#myModal').modal('hide');
        },

        clearForm(){
            $("input[type=text], textarea").val(""); 
            $('#myModal').modal('hide');
        }
    }
});
