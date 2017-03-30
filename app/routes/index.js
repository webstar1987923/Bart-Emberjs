import Ember from 'ember';

//const { Route } = Ember;

export default Ember.Route.extend({
  beforeModel: function() {
    this.replaceWith('home');
  }
});
