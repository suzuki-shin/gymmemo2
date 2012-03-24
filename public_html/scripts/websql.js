(function() {

  /*
  # config
  */

  var addItem, addTraining, createTableItems, createTableTrainings, db, getYYYYMMDD, insertData, insertItem, insertTraining, obj2insertSet, obj2upateSet, order, renderItems, renderTodaysTrainings, selectItems, selectTrainingsByDate, setUp, wrapHtmlList, xxx, _failure_func, _obj2keysAndVals, _res2NameValues, _success_func;

  db = window.openDatabase("gymmemo", "", "GYMMEMO", 1048576);

  order = [' ASC ', ' DESC '];

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
    return tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, attr TEXT, is_saved INT DEFAULT 0 NOT NULL, ordernum INT DEFAULT 0, is_active INTEGER DEFAULT 1)', [], success_func, failure_func);
  };

  createTableTrainings = function(tx, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('createTableTrainings');
    }
    return tx.executeSql('CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, item_id INTEGER NOT NULL, value INTEGER NOT NULL, created_at TEXT, is_saved INT DEFAULT 0 NOT NULL)', [], success_func, failure_func);
  };

  selectItems = function(tx, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('selectItems');
    }
    return tx.executeSql('select * from items order by ordernum asc', [], success_func, failure_func);
  };

  selectTrainingsByDate = function(tx, success_func, failure_func) {
    var SELECT_TRAININGS_BY_DATE;
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('selectTrainingsByDate');
    }
    SELECT_TRAININGS_BY_DATE = 'SELECT tr.item_id AS item_id, it.name AS name, tr.value AS value, it.attr AS attr, tr.created_at AS created_at FROM trainings tr LEFT JOIN items it ON tr.item_id = it.id WHERE tr.created_at = ? ORDER BY tr.id ';
    return tx.executeSql(SELECT_TRAININGS_BY_DATE, [getYYYYMMDD()], success_func, failure_func);
  };

  insertItem = function(tx, obj, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    return insertData(tx, 'items', obj, success_func, failure_func);
  };

  insertTraining = function(tx, obj, success_func, failure_func) {
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    return insertData(tx, 'trainings', obj, success_func, failure_func);
  };

  insertData = function(tx, table, obj, success_func, failure_func) {
    var params, set, _ref;
    if (success_func == null) success_func = _success_func;
    if (failure_func == null) failure_func = _failure_func;
    if (typeof console !== "undefined" && console !== null) {
      console.log('insertData');
    }
    _ref = obj2insertSet(obj), set = _ref[0], params = _ref[1];
    if (typeof console !== "undefined" && console !== null) console.log(table);
    if (typeof console !== "undefined" && console !== null) console.log(set);
    if (typeof console !== "undefined" && console !== null) console.log(params);
    return tx.executeSql('insert into ' + table + ' ' + set, params, success_func, failure_func);
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

  renderTodaysTrainings = function(tx) {
    if (typeof console !== "undefined" && console !== null) {
      console.log('renderTodaysTrainings');
    }
    return selectTrainingsByDate(tx, function(tx, res) {
      return $('#todaystraininglist').empty().append(wrapHtmlList(_res2NameValues(res), 'li').join(''));
    });
  };

  _res2NameValues = function(res) {
    var i, len, _results;
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(res.rows.item(i).name + ' ' + res.rows.item(i).value + res.rows.item(i).attr);
    }
    return _results;
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

  addTraining = function(ev) {
    var item_id;
    if (typeof console !== "undefined" && console !== null) {
      console.log('addTraining');
    }
    if (!ev.target.value) return;
    item_id = ev.target.id.slice(4, 8);
    db.transaction(function(tx) {
      return insertTraining(tx, {
        item_id: item_id,
        value: ev.target.value,
        created_at: getYYYYMMDD()
      }, function(tx, res) {
        renderTodaysTrainings(tx);
        return $(ev.target).attr('value', '');
      });
    });
    return false;
  };

  getYYYYMMDD = function() {
    var dd, dt, mm, yyyy;
    dt = new Date();
    yyyy = dt.getFullYear();
    mm = dt.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    dd = dt.getDate();
    if (dd.length < 10) dd = '0' + dd;
    return yyyy + '/' + mm + '/' + dd;
  };

  xxx = function(res, func) {
    var i, len, _results;
    if (func == null) {
      func = function(x) {
        return x;
      };
    }
    if (typeof console !== "undefined" && console !== null) console.log('xxx');
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(typeof console !== "undefined" && console !== null ? console.log(func(res.rows.item(i))) : void 0);
    }
    return _results;
  };

  setUp = function() {
    return db.transaction(function(tx) {
      createTableItems(tx);
      createTableTrainings(tx);
      renderItems(tx);
      return renderTodaysTrainings(tx);
    });
  };

  $(function() {
    setUp();
    $('#itemstitle').on('click touch', function() {
      return $('#itemadd').toggle();
    });
    $('#itemadd button').on('click touch', addItem);
    $(document).on('change', '#itemlist li input', addTraining);
    $('#test1').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test1');
      return db.transaction(function(tx) {
        return renderTodaysTrainings(tx);
      });
    });
    $('#test2').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test2');
      return db.transaction(function(tx) {
        return selectTrainingsByDate(tx, function(tx, res) {
          return xxx(res, function(x) {
            return x.attr + ':' + x.created_at + ':' + x.item_id + ':' + x.name;
          });
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
