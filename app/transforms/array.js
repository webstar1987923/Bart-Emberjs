import Em from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function (value) {
    if (Em.isArray(value)) {
      return Em.A(value);
    } else {
      return Em.A();
    }
  },
  serialize: function (value) {
    if (Em.isArray(value)) {
      return Em.A(value);
    } else {
      return Em.A();
    }
  }
});
