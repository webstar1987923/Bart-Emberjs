import DS from 'ember-data';

export default DS.Model.extend({
  ticketNum: DS.attr('string'),
  activeOrg: DS.attr('string'),
  time: DS.attr('string'),
  issue: DS.attr('object'),
  reporter: DS.attr('string')
});
