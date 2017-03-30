import Ember from 'ember';

export default Ember.Component.extend({
  filter: null,
  filteredList: null,
  actions: {
    autoComplete() {
      this.get('autoComplete')(this.get('filter'));
    },
    search() {
      this.get('search')(this.get('filter'));
    },
    clearFocus() {
      let _this = this;
      setTimeout(function(){ _this.get('filteredList').clear(); }, 300);
      
      //this.get('clearFocus')();
    },
    choose(entry) {
      this.set('filter',entry);      
      this.get('filteredList').clear();
      this.get('choose')(entry);

    },
    showCreateWizard() {
      
        console.log(this.get('filter'));
        
     
    },
  }
});