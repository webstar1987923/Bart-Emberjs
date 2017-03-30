import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function (value) {
    if (!Ember.$.isPlainObject(value)) {
      return Ember.Object.create({});
    } else {
      return Ember.Object.create(value);
    }
  },
  serialize: function (value) {
    if (!Ember.$.isPlainObject(value)) {
      return Ember.Object.create({});
    } else {
      return Ember.Object.create(value);
    }
  }
});
