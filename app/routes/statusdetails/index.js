import Ember from 'ember';

export default Ember.Route.extend({
  ajaxService: Ember.inject.service('ajax-service'),
	model(){
   		return [];
  	},

  setupController(controller, model) {
    this._super(controller, model);
    console.log("setup controller",controller,model);
    let attuid = localStorage.getItem("attuid");
    if(attuid == null){
        this.transitionTo('home');
    }
    
    console.log(attuid);
    controller.send('getBizopsContacts',attuid);
  

  },
   actions: {

    addComment(){
      /*if(item.isAddComment){
        item.set('isAddComment', false);
      } else {
        //tinymce.init({ selector:'#comment_editor_'+item.id });
        item.set('isAddComment', true);
      }*/
    },
    showComments(item){
      if(item.isShowComment){
        //item.set('isShowComment', false);
        Ember.set(item,'isShowComment',false);
      } else {
        //item.set('isShowComment', true);
        Ember.set(item,'isShowComment',true);
      }
    }
    
  }
});

