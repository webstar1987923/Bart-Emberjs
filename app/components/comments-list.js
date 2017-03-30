import Ember from 'ember';

export default Ember.Component.extend({
	filterField : 'requestNumber:asc',

	sortedLogs : Ember.computed.sort('model','sortedDefinition'),

	sortedDefinition : Ember.computed('sortBy', function() {
	  return [ this.get('filterField') ];
	}),

	actions: {
		
	}
});
