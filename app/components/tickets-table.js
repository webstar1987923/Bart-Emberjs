import Ember from 'ember';
import TableCommon from '../mixins/table-common';

const {
  computed
} = Ember;

export default Ember.Component.extend(TableCommon, {
  columns: computed(function() {
    return [{
            label: 'Request',
            valuePath: 'requestNumber',
            width: '100px'
        }, {
            label: 'Status',
            valuePath: 'status',
            width: '100px'
        }, {
            label: 'Request Type',
            valuePath: 'requestType',
            width: '100px'
        }, {
            label: 'Application',
            valuePath: 'application',
            sortable: true
        }, {
            label: 'Summary',
            valuePath: 'summary'
        }, {
            label: 'Opened',
            valuePath: 'opened'
        }, {
            label: 'Reported By',
            valuePath: 'reportedBy'
        }, {
            label: 'Watcher',
            valuePath: 'watcher'
    }];
  })
});