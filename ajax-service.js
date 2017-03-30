import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
 host: 'http://m5labbizops01.gcsc.att.com:28122', 
 namespace: '/api/log/' 
});