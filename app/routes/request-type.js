import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    createRequest(){
      this.router.transitionTo('create-request');
    }
  }
});
