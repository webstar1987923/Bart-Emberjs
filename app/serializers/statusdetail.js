import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
	  let response 	= [];
	  let data 		= payload.data;
	  let jira 		= data.jira;

	   	for(let i=0;i<jira.length;i++){
	   		let row = {};
	   		row.id 			 = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
		   row.requestNumber = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
		   row.isShowComment = false;
		   row.isAddComment = false;
		   row.status 		 = jira[i].issue.status.name;
		   row.requestType 	 = jira[i].issue.issuetype.name;
		   row.application 	 = jira[i].issue.project.name;
		   row.summary 	 	 = jira[i].issue.summary;
		   row.opened 	  	 = jira[i].issue.created.toString().substring(0,10);
		   row.reportedBy    = jira[i].issue.customfield_10102;
		   row.watcher       = jira[i].issue.customfield_10102;
		   if(jira[i].issue.comment !== undefined){
		   	row.commentNotAvailable = (jira[i].issue.comment.comments.total > 0);
		   	row.comments = jira[i].issue.comment.comments;
		   } else {
		   	row.commentNotAvailable = true;
		   	row.comments = [];
		   }

		 response.push(row);
	   	}
	   	

      return this._super(store, primaryModelClass, response, id, requestType);
  }});
