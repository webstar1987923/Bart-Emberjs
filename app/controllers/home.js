import Ember from 'ember';

export default Ember.Controller.extend({
	//Attribute as a component for your template
	appSearch: '',
	ajaxService: Ember.inject.service('ajax-service'),
  createRequestData: Ember.A([
    Ember.Object.create({description: 'oprion 1'}),
    Ember.Object.create({description: 'oprion 2'}),
    Ember.Object.create({description: 'oprion 3'}),
    Ember.Object.create({description: 'oprion 4'})
  ]),
	reqQuery: '',
  filter: null,
  filteredList: null,

	isValide: Ember.computed('requestNumber', function() {
			return (typeof this.get('requestNumber') !== undefined) && this.get('requestNumber') != null;
	}),

	actions: {
    appQuery: function() {
        var appQuery = this.get('appSearch');
        console.log(appQuery);
        //do something ...
        //this.transitionToRoute('search', { query: query });
    },
    reqQuery: function() {
        var reqQuery = this.get('reqSearch');
        console.log(reqQuery);
        //do something ...
        //this.transitionToRoute('search', { query: query });
    },



    autoComplete(term){
      let url = "/api/autocomplete?term=";
      var _this = this;
      if(term !== ""){
        this.get('ajaxService').request(url+term).then((response) => {
            console.log(response);
            let data    = response.data;
            this.set('filteredList', data);
            _this.set('filteredList', data);
            console.log(response);
            return response;
          }).catch(function(error) {
            throw error;
          });
      } else {
        this.get('filteredList').clear();
      }
    },

    choose(option){
      this.set('filter', option);
      console.log('option',option);
      this.get('filteredList').clear();
    },

    search(param) {
      console.log(param);
      /*return param;
      if(param !== "") {
        this.store.query('rental', {city: param}).then((result) => {
          this.set('model',result);
        });
      }
      else {
        this.set('model').clear();
      }*/
    },

    

		viewStatus() {
			if (this.get('isValide')) {
				console.log(this.get('requestNumber'));
				this.transitionToRoute('/Details/'+ this.get('requestNumber'));
			}
		},

		requestType(){
			this.router.transitionTo('request-type');
		},
		getRequestData(searchKey, event){
			console.log([searchKey, event,arguments]);
		},
    showCreateWizard() {
        let shortDesc = this.get('filter');
        if(shortDesc !== undefined || shortDesc !== null) {
          console.log(shortDesc);
          localStorage.setItem("shortDesc",shortDesc);
          this.transitionToRoute('create-request-wizard');
        }
        
     
    }
	}
});
