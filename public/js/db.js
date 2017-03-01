/* globals PouchDB */
(function(fj) {
  'use strict';

  fj.DataBase = function() {
    this.db = new PouchDB('FoodJournal');
  };
  


})(window.fj = window.fj || {});
