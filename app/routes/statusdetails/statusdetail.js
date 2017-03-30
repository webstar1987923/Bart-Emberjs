import Ember from 'ember';

export default Ember.Route.extend({
	ajaxService: Ember.inject.service('ajax-service'),
	model(params){
		console.log("status details model");
		let requestNumber = params.requestNumber;
		this.set("requestNumber",requestNumber);
		let model = {};
		
		return model;
		
		
	},

	setupController(controller, model) {
		this._super(controller, model);
		console.log("setup controller",controller,model);
		let requestNumber = this.get("requestNumber");
		console.log(requestNumber);
		let attuid = localStorage.getItem("attuid");
	    if(attuid === null){
	        this.transitionTo('home');
	    }

		controller.send('getBizopsContacts',attuid,requestNumber);
		

		
	}
});
