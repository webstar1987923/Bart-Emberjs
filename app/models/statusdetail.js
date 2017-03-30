import DS from 'ember-data';

export default DS.Model.extend({
	"requestNumber": DS.attr('string'),
	"isShowComment": DS.attr('boolean'),
	"status": DS.attr('string'),
	"requestType": DS.attr('string'),
	"application": DS.attr('string'),
	"summary": DS.attr('string'),
	"opened": DS.attr('string'),
	"reportedBy": DS.attr('string'),
	"watcher": DS.attr('string')
});
