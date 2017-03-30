import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('home');
  this.route('request-type');
  this.route('create-request-wizard', { path: '/Create' });
  this.route('statusdetails', { path: '/Details' }, function() {
    this.route('statusdetail', { path: '/:requestNumber' });
  });

  /*this.route('admin');
   this.route('about');*/
  /* this.route('contact');
   this.route('statusdetail', {path: '/statusdetail/:statusDetailId'});
   this.route('statusdetails', {path: '/statusdetails'});*/

  this.route('view-request');

  this.route('release-calendar');
  this.route('bizops-tools');
  this.route('known-outages');
  this.route('feedback');
  this.route('test-route');
  this.route('search', { path: '/Search' });
});

export default Router;
