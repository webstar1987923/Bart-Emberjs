import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError} from 'ember-ajax/errors';

export default Ember.Route.extend({
  ajaxService: Ember.inject.service('ajax-service'),
  model() {
    // return Ember.RVSP.hash({
    //   statusdetail: this.store.findAll('statusdetail'),
    // });
    // return this.store.findAll('statusdetail');
  },
  setupController(controller, model) {
    this._super(controller, model);
    console.log("setup controller",controller,model);
    let requestNumber = this.get("requestNumber");
    console.log(requestNumber);

    if(typeof(Storage) !== "undefined"){
      localStorage.removeItem("shortDesc");
      localStorage.removeItem("attuid");
      localStorage.removeItem("userInfo");
    }

    let url = "/api/cookie/get";
    //let that = this;
        
    return this.get('ajaxService').request(url).then((response) => 
         {

             let data    = response.data;
             let user = JSON.stringify(data);

            // if(response.errcode){
             // window.location = 'http://uam.it.att.com';
             //}

            // Check browser support
            if (typeof(Storage) !== "undefined") {
                // Store
                localStorage.setItem("userInfo", user);
                localStorage.setItem("attuid",data.ATTUID);
                // Retrieve
               console.log(localStorage.getItem("userInfo"));
            } else {
                document.cookie = "user="+user;
                console.log(document.cookie);
            }
            console.log(data);
            controller.set('model', data);
            return data;
     }
        ).catch(function(error) {

          throw error;
        });


    
  },

  handleSuccess(data) {
    console.log('----cookie-----',data);
  },

  actions: {
    testGetLog() {
      this.get('ajaxService').raw('get?ticket=APICAT-11', {
        method: 'GET',
      }).then((response) => 
        this.handleSuccess(response)
      ).catch(function(error) {
        if (isNotFoundError(error)) {
          // handle 404 errors here
          return;
        }

        if (isForbiddenError(error)) {
          // handle 403 errors here
          return;
        }

        if(isAjaxError(error)) {
          // handle all other AjaxErrors here
          return;
        }

        // other errors are handled elsewhere
        throw error;
      });
    },
    getRequestData(searchKey, event){
      console.log([searchKey, event,arguments]);
    }
  }
});
