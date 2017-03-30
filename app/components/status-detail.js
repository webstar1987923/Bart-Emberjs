import Ember from 'ember';

export default Ember.Component.extend({
	ajaxService: Ember.inject.service('ajax-service'),
	Filter:'',
	isShowComment : false,
	isAddComment : false,
	logNotAvailable : true,
	logs : [],
	actions:{
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
	      if(this.get('logs').length === 0){
	        
	        let url = "/log/get?ticket="+item.requestNumber;
		      
		      
		      return this.get('ajaxService').request(url).then((response) => 
		          {
		            console.log(response);
		            let data    = response.data;

		            if(data.length > 0){
		            	this.set("logs",data[0]);
		            	this.toggleProperty('logNotAvailable');
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
	      
	    }
	}
});
