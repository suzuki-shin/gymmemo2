(function() {

  /*
  # config
  */

  var createTableItems, db, hoge, insertItems, obj2insertSet, obj2upateSet, selectItems, _failure_func, _obj2keysAndVals, _success_func;

  db = window.openDatabase("gymmemo", "", "GYMMEMO", 1048576);

  _success_func = function(tx) {
    if (typeof console !== "undefined" && console !== null) console.log('OK');
    return typeof console !== "undefined" && console !== null ? console.log(tx) : void 0;
  };

  _failure_func = function(tx) {
    if (typeof console !== "undefined" && console !== null) console.log('NG');
    return typeof console !== "undefined" && console !== null ? console.log(tx) : void 0;
  };

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
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('insertItems');
    }
    _ref = obj2insertSet(obj), set = _ref[0], params = _ref[1];
    if (typeof console !== "undefined" && console !== null) console.log(set);
    if (typeof console !== "undefined" && console !== null) console.log(params);
    return tx.executeSql('insert into items ' + set, params, success_func, failure_func);
  };

  _obj2keysAndVals = function(obj) {
    var k, keys, v, vals;
    keys = [];
    vals = [];
    for (k in obj) {
      v = obj[k];
      keys.push(k);
      vals.push(v);
    }
    return [keys, vals];
  };

  obj2insertSet = function(obj) {
    var keys, v, vals, _ref;
    _ref = _obj2keysAndVals(obj), keys = _ref[0], vals = _ref[1];
    return [
      '(' + keys.join(',') + ') values (' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = vals.length; _i < _len; _i++) {
          v = vals[_i];
          _results.push('?');
        }
        return _results;
      })()).join(',') + ')', vals
    ];
  };

  obj2upateSet = function(obj) {
    var k, keys, vals, _ref;
    _ref = _obj2keysAndVals(obj), keys = _ref[0], vals = _ref[1];
    return [
      ' set ' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          k = keys[_i];
          _results.push(k + ' = ?');
        }
        return _results;
      })()).join(','), vals
    ];
  };

  hoge = function(res) {
    var i, len, _results;
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(typeof console !== "undefined" && console !== null ? console.log(res.rows.item(i)) : void 0);
    }
    return _results;
  };

  $(function() {
    $('#itemstitle').on('click touch', function() {
      return $('#itemadd').toggle();
    });
    $('#test1').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test1');
      return db.transaction(function(tx) {
        return createTableItems(tx, function() {
          return typeof console !== "undefined" && console !== null ? console.log('suxx') : void 0;
        }, function() {
          return typeof console !== "undefined" && console !== null ? console.log('faixx') : void 0;
        });
      });
    });
    $('#test2').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test2');
      return db.transaction(function(tx) {
        return selectItems(tx, function(tx, res) {
          return hoge(res);
        }, function(tx, res) {
          return typeof console !== "undefined" && console !== null ? console.log('faixx') : void 0;
        });
      });
    });
    return $('#test3').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) {
        console.log(_obj2keysAndVals({
          id: 1,
          name: 'hoge',
          age: 30
        }));
      }
      if (typeof console !== "undefined" && console !== null) {
        console.log(obj2insertSet({
          id: 1,
          name: 'hoge',
          age: 30
        }));
      }
      return db.transaction(function(tx) {
        return insertItems(tx, {
          id: 3,
          name: 'abxkdjsk',
          user: 'suzuki@',
          attr: '',
          ordernum: 5
        });
      });
    });
  });

}).call(this);
