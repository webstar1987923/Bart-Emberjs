import Ember from 'ember';
import Table from 'ember-light-table';

const {
  inject,
  isEmpty
} = Ember;

export default Ember.Mixin.create({
  store: inject.service(),
  ajaxService: Ember.inject.service('ajax-service'),
  page: 0,
  limit: 10,
  dir: 'asc',
  sort: 'firstName',

  isLoading: false,
  canLoadMore: true,

  model: null,
  columns: null,
  table: null,

  init() {
    this._super(...arguments);
    console.log('--------model-table---------',this.get('model'));
    console.log('--------column-list---------',this.get('columns'));
    let table = new Table(this.get('columns'), this.get('model'), { enableSync: true });
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));

    // Setup initial sort column
    if (sortColumn) {
      sortColumn.set('sorted', true);
    }

    this.set('table', table);
  },

  fetchRecords() {
    this.set('isLoading', true);
    let params = {};
    params.page = this.get('page');
    params.limit = this.get('limit');
    params.sort = this.get('sort');
    params.dir = this.get('dir');


    let url = "/tickets/get?sorting=MyTickets&attuid=ga4892";
    let that = this;

    console.log('--------light-table---------');
    this.get('ajaxService').request(url).then((response) => {
       let data    = response.data;
        let jira    = data.jira;

        let result = [];
         for(let i=0;i<jira.length;i++){
            let row = {};
            row.id       = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
              row.requestNumber = jira[i]['ticketNum'];  // Not Sure about it, so you can modify it accordingly.;
              row.isShowComment = false;
              row.isAddComment = false;
              row.status      = jira[i].issue.status.name;
              row.requestType   = jira[i].issue.issuetype.name;
              row.application   = jira[i].issue.project.name;
              row.summary     = jira[i].issue.summary;
              row.opened        = jira[i].issue.created.toString().substring(0,10);
              row.reportedBy    = jira[i].issue.customfield_10102;
              row.watcher       = jira[i].issue.customfield_10102;
              if(jira[i].issue.comment !== undefined){
                  row.commentNotAvailable = (jira[i].issue.comment.comments.total > 0);
                  row.comments = jira[i].issue.comment.comments;
              } else {
                  row.commentNotAvailable = true;
                  row.comments = [];
              }

              result.push(row);
            }
            this.table.addRows(result);
            console.log('--------load-table---------',result);
        that.set('model',result);
      that.get('model').pushObjects(result);
      that.set('canLoadMore', !isEmpty(result));
    }).finally(() => {
      that.set('isLoading', false);
      console.log('---loading---',this.get('model'));
    });
  },

  actions: {
    onScrolledToBottom() {
      console.log('--------scroll-table---------');
      if (this.get('canLoadMore')) {
        this.incrementProperty('page');
        this.fetchRecords();
      }
    },

    onColumnClick(column) {
      console.log('--------column-click---------');
      if (column.sorted) {
        this.setProperties({
          dir: column.ascending ? 'asc' : 'desc',
          sort: column.get('valuePath'),
          canLoadMore: true,
          page: 0
        });
        this.get('model').clear();
        this.fetchRecords();
      }
    }
  }
});