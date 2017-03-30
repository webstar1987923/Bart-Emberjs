import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({

	ajaxService: Ember.inject.service('ajax-service'),

	filterField : 'requestNumber:asc',

	sortedTickets : Ember.computed.sort('model','sortedDefinition'),

	sortedDefinition : Ember.computed('sortBy', function() {
	  return [ this.get('filterField') ];
	}),

	logs : {},

	logSortField : ['LogDate:desc'],

	sortedLogs : Ember.computed.sort('logs','logSortField'),

	bizopContacts : [],

	actions : {
		sortTickets(field){

			var order = '';
			if($('#'+field).hasClass('asc')){
				$('#'+field).removeClass('asc');
				$('#'+field).addClass('desc');
				order = 'desc';
			} else if($('#'+field).hasClass('desc')){
				$('#'+field).removeClass('desc');
				$('#'+field).addClass('asc');
				order = 'asc';
			} else {
				$('#'+field).addClass('asc');
				order = 'asc';
			}
			this.set('filterField',field+':'+order);
			
			this.set('sortedDefinition',[field+':'+order]);

			console.log(this.get('sortedDefinition'));
			
		    this.set('model',this.get('sortedTickets')); 
		},

		addLog(item){
			let that = this;
			let comment = $('#comment_editor_'+item.id).val();
			if(!comment && comment.length === 0){
				return;
			}
			let url = "/api/log/update?logmessage="+comment+"&ticketnumber="+item.requestNumber;
	          
	          
	          return this.get('ajaxService').request(url).then((response) => 
	              {
	                console.log(response);
	                let data    = response.data;
	                if(data.status === "success"){
	                	that.send('cancel', item.id);
	                	item.logs = undefined;
	                  	that.send('getLog',item);
	                } else {
	                  
	                }
	                console.log(data);

	                return response;
	              }
	            ).catch(function(error) {
	              throw error;
	            });
	          
		},

		cancel(itemId){
			$('#comment_editor_'+itemId).val('');
			$('#commentEditor-'+itemId).collapse('hide');
		},

		getLog(item){
		console.log(item);
	      if(item.logs === undefined){
	        let that = this;
	        let url = "/api/log/get?ticket="+item.requestNumber;
	          
	          
	          return this.get('ajaxService').request(url).then((response) => 
	              {
	                console.log(response);
	                let data    = response.data;
	                if(data.length > 0){
	                	that.set('logs',data[0]);
	                	
	                 	item.logs = that.get('sortedLogs');
	                  	console.log(item.logs);
		                let tempHtml = '';
		                $.each(item.logs,function(index,log){
		                    tempHtml += '<tr><td>'+log.CreatedBy+log.UserName+'</td> <td>'+log.LogText+'</td>';
		                    tempHtml += '<td>'+ log.LogDate +'</td></tr>';
		                });
		                $('#collapseComments-'+item.id+' .comment_container_body').html(tempHtml);
	                } else {
	                  $('#collapseComments-'+item.id+' .comment_container_body').html('<p>No Logs</p>');
	                }
	                this.send('showComments',item);
	                console.log(data);

	                return response;
	              }
	            ).catch(function(error) {
	              throw error;
	            });
	          
	        //isShowLog = true;
	      } 
	    },

	    getBizopsContacts(attuid){
	    	let that = this;
	        let url = "/api/contacts/get";
	          
	          
	          return this.get('ajaxService').request(url).then((response) => 
	              {
	                console.log(response);
	                let data    = response.data;
	                if(data){
	                	that.set('bizopContacts',data);
	                	that.send('getTickets',attuid);
	                	return response;
	            	}
	              }
	            ).catch(function(error) {
	              throw error;
	            });
	    },

	    getTickets(attuid){
	    	let controller = this;
	    	//attuid = "ga4892";
	    	let url = "/api/tickets/get?sorting=MyTickets&attuid="+attuid;
        
    		return this.get('ajaxService').request(url).then((response) => 
	         {
	            let result = [];
	            let data    = response.data;
	            if(data.length === 0){
	              controller.set('model', result);
	              return result;
	            }
	                  let jira    = data.jira;

	                      	let text = '';
                  	let formatContact = function(i,ele){
                  		text += '<p>'+ele.contactName + '(' + ele.contactATTUID + ')</p>';
                  	};
	                  
	                 for(let i=0;i<jira.length;i++){
	                    if(jira[i].issue.customfield_10102 && jira[i].issue.customfield_10102.trim().length > 0){
	                      let row = {};
	                      let reporterId = jira[i].issue.customfield_10102;
	                      row.id       = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
	                      row.requestNumber = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
	                      row.isShowComment = false;
	                      row.isAddComment = false;
	                      row.status      = jira[i].issue.status.name;
	                      row.requestType   = jira[i].issue.issuetype.name;
	                      row.application   = jira[i].issue.project.name;
	                      row.summary     = jira[i].issue.summary;
	                      row.opened        = jira[i].issue.created.toString().substring(0,10);
	                      row.reportedBy    = jira[i].issue.customfield_10102;
	                      
	                      row.reporterName  = jira[i].issue.customfield_10103;
	                      //Here we should map the  Contact column which needs to be shown like:
	                      //row.contact  = jira[i].contact;
	                      if(jira[i].issue.comment !== undefined){
	                          row.commentNotAvailable = (jira[i].issue.comment.comments.total > 0);
	                          row.comments = jira[i].issue.comment.comments;
	                      } else {
	                          row.commentNotAvailable = true;
	                          row.comments = [];
	                      }

	                      if(reporterId === attuid){
	                        row.canAddLog = true;
	                      }

	                      if(jira[i].activeOrg){
	                      	let bizops = controller.get('bizopContacts');
	                      	$.each(bizops[jira[i].activeOrg].contacts, formatContact);
	                      	row.watcher = text;
	                      }

	                      result.push(row);
	                    }
	                  }

	            console.log(result);
	            controller.set('model', result);
	            return result;
	     	}
	        ).catch(function(error) {
	          throw error;
	    
		    });
	    }
	}
});
