import Ember from 'ember';

export default Ember.Route.extend({
	ajaxService: Ember.inject.service('ajax-service'),
	beforeModel() {
		let attuid = "";
		try {
			attuid = localStorage.getItem("attuid");
		}catch(error){

		}
		if(attuid.length === 0){
			this.replaceWith('home');
		}
	},
	model(){
		return {};
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

		let url = "/api/products/get";
      	
		return this.get('ajaxService').request(url).then((response) => 
          {
		   	let data    = response.data;
           	controller.set('model', data);
            return data;
		 }
        ).catch(function(error) {
          throw error;
        });
		
	}
});
