(function() {

  /*
  # config
  */

  var addItem, createTableItems, db, insertItem, obj2insertSet, obj2upateSet, renderItems, selectItems, setUp, wrapHtmlList, xxx, _failure_func, _obj2keysAndVals, _success_func;

  db = window.openDatabase("gymmemo", "", "GYMMEMO", 1048576);

  _success_func = function(tx) {
    if (typeof console !== "undefined" && console !== null) console.log('OK');
    return typeof console !== "undefined" && console !== null ? console.log(tx) : void 0;
  };

  _failure_func = function(tx) {
    if (typeof console !== "undefined" && console !== null) console.log('NG');
    return typeof console !== "undefined" && console !== null ? console.log(tx) : void 0;
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

  createTableItems = function(tx, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('createTableItems');
    }
    return tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, attr TEXT, is_saved INT DEFAULT 0 NOT NULL, ordernum INT DEFAULT 0)', [], success_func, failure_func);
  };

  selectItems = function(tx, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('selectItems');
    }
    return tx.executeSql('select * from items order by ordernum asc', [], success_func, failure_func);
  };

  insertItem = function(tx, obj, success_func, failure_func) {
    var params, set, _ref;
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('insertItem');
    }
    _ref = obj2insertSet(obj), set = _ref[0], params = _ref[1];
    if (typeof console !== "undefined" && console !== null) console.log(set);
    if (typeof console !== "undefined" && console !== null) console.log(params);
    return tx.executeSql('insert into items ' + set, params, success_func, failure_func);
  };

  addItem = function(ev) {
    db.transaction(function(tx) {
      return insertItem(tx, {
        name: $('#itemname').attr('value') || null,
        attr: $('#itemattr').attr('value')
      }, function(tx) {
        renderItems(tx);
        $('#itemname').attr('value', '');
        return $('#itemattr').attr('value', '');
      });
    });
    return false;
  };

  renderItems = function(tx) {
    var _renderItems;
    if (typeof console !== "undefined" && console !== null) {
      console.log('renderItems');
    }
    _renderItems = function(res) {
      var _res2inputElems;
      _res2inputElems = function(res) {
        var i, len, _results;
        len = res.rows.length;
        _results = [];
        for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
          _results.push(res.rows.item(i).name + '<input type="number" id="item' + res.rows.item(i).id + '" size="3" />' + res.rows.item(i).attr);
        }
        return _results;
      };
      return $('#itemlist').empty().append(wrapHtmlList(_res2inputElems(res), 'li').join(''));
    };
    return selectItems(tx, function(tx, res) {
      return _renderItems(res);
    });
  };

  wrapHtmlList = function(list, tag) {
    var l, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      l = list[_i];
      _results.push('<' + tag + '>' + l + '</' + tag + '>');
    }
    return _results;
  };

  xxx = function(res) {
    var i, len, _results;
    if (typeof console !== "undefined" && console !== null) console.log('xxx');
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(typeof console !== "undefined" && console !== null ? console.log(res.rows.item(i)) : void 0);
    }
    return _results;
  };

  setUp = function() {
    return db.transaction(function(tx) {
      createTableItems(tx);
      return renderItems(tx);
    });
  };

  setUp();

  $(function() {
    $('#itemstitle').on('click touch', function() {
      return $('#itemadd').toggle();
    });
    $('#itemadd button').on('click touch', addItem);
    $('#test1').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test1');
      return db.transaction(function(tx) {
        return renderItems(tx);
      });
    });
    $('#test2').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test2');
      return typeof console !== "undefined" && console !== null ? console.log(wrapHtmlList([1, 2, 3, 4, 5], 'li')) : void 0;
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
        return insertItem(tx, {
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
