
/*
# config
*/

(function() {
  var createTableItems, db, insertItems, selectItems, _obj2set;

  db = window.openDatabase("gymmemo", "", "GYMMEMO", 1048576);

  createTableItems = function(tx, success_func, failure_func) {
    if (typeof console !== "undefined" && console !== null) {
      console.log('createTableItems');
    }
    return tx.executeSql('create table if not exists items (id int, name text, user text, attr text, is_saved int default 0, ordernum int)', [], success_func, failure_func);
  };

  selectItems = function(tx, success_func, failure_func) {
    if (typeof console !== "undefined" && console !== null) {
      console.log('selectItemsCount');
    }
    return tx.executeSql('select * from items', [], success_func, failure_func);
  };

  insertItems = function(tx, obj, success_func, failure_func) {
    var params, set, _ref;
    if (typeof console !== "undefined" && console !== null) {
      console.log('insertItems');
    }
    _ref = _obj2set(obj), set = _ref[0], params = _ref[1];
    return tx.executeSql('insert into items set ' + set, vals, success_func, failure_func);
  };

  _obj2set = function(obj) {
    var k, keys, v, vals, _len;
    keys = [];
    vals = [];
    for (v = 0, _len = obj.length; v < _len; v++) {
      k = obj[v];
      keys.append(k);
      vals.append(v);
    }
    return [keys, vals];
  };

  $(function() {
    $('#test1').on('click', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test1');
      return db.transaction(function(tx) {
        return createTableItems(tx, function() {
          return typeof console !== "undefined" && console !== null ? console.log('suxx') : void 0;
        }, function() {
          return typeof console !== "undefined" && console !== null ? console.log('faixx') : void 0;
        });
      });
    });
    return $('#test2').on('click', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test2');
      return db.transaction(function(tx) {
        return selectItems(tx, function(tx, res) {
          return typeof console !== "undefined" && console !== null ? console.log(res.rows.length) : void 0;
        }, function(tx, res) {
          return typeof console !== "undefined" && console !== null ? console.log('faixx') : void 0;
        });
      });
    });
  });

}).call(this);
