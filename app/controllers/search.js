import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({

	filterField : 'requestNumber:asc',

	sortedTickets : Ember.computed.sort('model','sortedDefinition'),

	sortedDefinition : Ember.computed('sortBy', function() {
	  return [ this.get('filterField') ];
	}),
	actions : {
		/* For future use. Not used currently */
		sortProducts(field){

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

		gotoCreate(shortDesc){
			//alert(shortDesc);
			if(shortDesc !== undefined || shortDesc !== null) {
	          console.log(shortDesc);
	          localStorage.setItem("shortDesc",shortDesc);
	          this.transitionToRoute('create-request-wizard');
	        }
		},
	}
});
