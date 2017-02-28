(function(fj) {
  'use strict';

  fj.DataBase = function() {
    let db;

    this.Init = function() {

      let request = window.indexedDB.open("FoodJournal");
      request.onerror = function(event) {
        console.log("Indexed DB cannot open.", event);
      };
      request.onsuccess = function(event) {
        db = event.target.result;
        db.onerror = function(event) {
          console.log("IndexedDB error.", event);
        };
      };

    };
  };
  


})(window.fj = window.fj || {});
