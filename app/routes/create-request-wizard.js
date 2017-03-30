import Ember from 'ember';

export default Ember.Route.extend({
	ajaxService: Ember.inject.service('ajax-service'),
	queryParams: {
    app: {
      refreshModel: true
    }
  },
	model(params,transition) {
		console.log([params,transition]);
		let shortDesc = localStorage.getItem('shortDesc');

		if(shortDesc == null || shortDesc == 'null'){
			this.transitionTo('search');
		}
		localStorage.removeItem("shortDesc");
		localStorage.removeItem('app');
			return {"shortDesc" : shortDesc};
	},
	setupController(controller, model) {
	// Call _super for default behavior
		this._super(controller, model);
		let _this = this;
		console.log('---model---',model);

		controller.set('issuetype','');

		let userInfo = localStorage.getItem("userInfo");
		if(userInfo == null){
			_this.transitionTo('home');
		}
		let user = JSON.parse(userInfo);

		model.attuid =user.ATTUID;
		model.fullName = user.FULLNAME;
		model.phone = user.PHONE;	
		controller.set('model',model);

		let url = "/api/details/get?descr="+model.shortDesc;

		_this.get('ajaxService').request(url).then((response) => {
            console.log(response);
            let data    = response.data;
            model.appDetails = data;
            
            console.log(data);
            return data;
          }).catch(function(error) {
            throw error;
          });


	}

});
