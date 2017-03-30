import Ember from 'ember';
//import Table from 'ember-light-table';

export default Ember.Controller.extend({
    Filter: '',

    applicationController: Ember.inject.controller("application"),

    page: 0,
    limit: 10,
    dir: 'asc',

    isLoading: false,
    canLoadMore: true,
    showOptions: true,
    columns: [{
            label: 'Req. Number',
            valuePath: 'requestNumber',
            width: '100px'
        }, {
            label: 'Status',
            valuePath: 'status',
            width: '100px'
        }, {
            label: 'Req. Type',
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
    }],

    init() {
        this.get('applicationController').set('showOptions', true);
    },

    actions: {
        addComment(item) {
            item.set('isShowComment', true);
        },
        getLog(item){
      if(item.log === undefined){
        
        let url = "/api/log/get?ticket="+item.get('requestNumber');
          // isShowLog = true;
          return this.get('ajaxService').request(url).then((response) => 
              {
                console.log(response);
                let data    = response.data;
                console.log(data);
                return response;
              }
            ).catch(function(error) {
              throw error;
            });
          
      } 
    }
    }
});
