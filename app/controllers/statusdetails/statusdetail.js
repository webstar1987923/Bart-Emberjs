import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({

	ajaxService: Ember.inject.service('ajax-service'),

	isShowComment : false,
	isAddComment : false,
	logNotAvailable : true,
	logs : [],

	logSortField : ['LogDate:desc'],

	sortedLogs : Ember.computed.sort('logs','logSortField'),

	bizopContacts : [],

	actions : {
		addComment(item){
			this.toggleProperty('isAddComment');
			console.log(item);
		},
		showComments(item){
			this.toggleProperty('isShowComment');
			console.log(item);
		},
		getLog(item){
		console.log(item);
		this.toggleProperty('isShowComment');
		let that = this;
	      if(this.get('logs').length === 0){
	        
	        let url = "/api/log/get?ticket="+item.requestNumber;
		      
		      
		      return this.get('ajaxService').request(url).then((response) => 
		          {
		            console.log(response);
		            let data    = response.data;

		            if(data.length > 0){
		            	that.set("logs",data[0]);
		            	that.set('logNotAvailable',false);
		            	that.set('isShowComment',true);
		            } else {
		            	this.log[0] = {LogText : "No Logs."};
		            }

		            console.log(data);

		            return response;
		          }
		        ).catch(function(error) {
		          throw error;
		        });
	        
	      } 
	      
	    },

	    addLog(item){
			let that = this;
			let comment = $('#comment_editor').val();
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
	                	that.set("logs",[]);
	                  	that.send('getLog',item);
	                } else {
	                  
	                }

	                return response;
	              }
	            ).catch(function(error) {
	              throw error;
	            });
	          
		},

		cancel(){
			$('#commentEditor textarea').val('');
			$('#commentEditor').collapse('hide');
		},

		getBizopsContacts(attuid,requestNumber){
	    	let that = this;
	        let url = "/api/contacts/get";
	          
	          
	          return this.get('ajaxService').request(url).then((response) => 
	              {
	                console.log(response);
	                let data    = response.data;
	                if(data){
	                	that.set('bizopContacts',data);
	                	that.send('getTicket',attuid,requestNumber);
	                	return response;
	            	}
	              }
	            ).catch(function(error) {
	              throw error;
	            });
	    },

		getTicket(attuid,requestNumber){

			let that = this;
			let url = "/api/tickets/get?sorting=requestNumber&attuid="+attuid+"&ticketnum=";
      	
			return this.get('ajaxService').request(url+requestNumber).then((response) => 
	          {
			   let data    = response.data;
	            let jira    = data.jira;

	            let row       = {};
	            let reporterId = jira[0].issue.customfield_10102;
	            row.id       = jira[0]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
	            row.requestNumber = jira[0]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
	            row.isShowComment = true;
	            row.status      = jira[0].issue.status.name;
	            row.requestType   = jira[0].issue.issuetype.name;
	            row.application   = jira[0].issue.project.name;
	            row.summary     = jira[0].issue.summary;
	            row.opened        = jira[0].issue.created.toString().substring(0,10);
	            row.reportedBy    = jira[0].issue.customfield_10102;
	            row.reporterName  = jira[0].issue.customfield_10103;
	            
	            if(jira[0].issue.comment !== undefined){
	            	row.commentNotAvailable = (jira[0].issue.comment.comments.length > 0);
				   	row.comments = jira[0].issue.comment.comments;
				} else {
					row.commentNotAvailable = true;
				   	row.comments = [];
				}

				if(reporterId === attuid || row.reporterName === attuid){
		            row.canAddLog = true;
		        }

		        if(jira[0].activeOrg){
	              	let bizops = that.get('bizopContacts');
	              	let text = '';
	              	$.each(bizops[jira[0].activeOrg].contacts,function(i,ele){
	              		text += '<p>'+ele.contactName + '(' + ele.contactATTUID + ')</p>';
	              	});
	              	row.watcher = text;
	            }

	            console.log(row);
	           	that.set('model', row);
	            return row;
			 }
	        ).catch(function(error) {
	          throw error;
	        });
		}

	}
});
