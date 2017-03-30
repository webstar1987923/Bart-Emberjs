import Ember from 'ember';

export default Ember.Component.extend({
	appSearch:'',
	reqSearch:'',
	actions:{
		createRequest:function(){
			this.get('appSearch');
		},
		getStatus:function(){
			this.get('router').transitionTo('statusdetail', this.get('reqSearch'));
			//alert(this.get('reqSearch'));
		}
	}
});
