(function() {

  /*
  # config
  */

  var addItem, addTraining, createConfig, createTableItems, createTableTrainings, db, debugSelectItems, debugSelectTrainings, dropTableItems, dropTableTrainings, getConfig, getYYYYMMDD, insertData, insertItem, insertTraining, obj2insertSet, obj2upateSet, order, renderItems, renderPastTrainingsDate, renderTodaysTrainings, renderTrainingByDate, selectItems, selectTrainingsByDate, setConfig, setUp, wrapHtmlList, xxx, _failure_func, _obj2keysAndVals, _renderPastTrainingsDate, _res2Date, _res2ItemAll, _res2NameValues, _res2TrainingAll, _setConfig, _success_func;

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
    SELECT_TRAININGS_BY_DATE = 'SELECT tr.item_id AS item_id, it.name AS name, tr.value AS value, it.attr AS attr, tr.created_at AS created_at FROM trainings AS tr LEFT JOIN items AS it ON tr.item_id = it.id WHERE tr.created_at = ? ORDER BY tr.id ';
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

  renderTrainingByDate = function(ev) {
    var date, _renderTrainingByDate;
    if (typeof console !== "undefined" && console !== null) {
      console.log('renderTrainingByDate');
    }
    date = ev.target.textContent;
    _renderTrainingByDate = function(tx) {
      var SELECT_TRAININGS_BY_DATE, config;
      console.log('_renderTrainingByDate');
      config = getConfig();
      SELECT_TRAININGS_BY_DATE = 'SELECT * FROM trainings t LEFT JOIN items i ON t.item_id = i.id WHERE t.created_at = ? ORDER BY t.id ';
      return tx.executeSql(SELECT_TRAININGS_BY_DATE, [date], function(tx, res) {
        $('#trainingsubtitle').text(date);
        return $('#pasttraininglist').empty().append(wrapHtmlList(_res2NameValues(res), 'li').join(''));
      }, _failure_func);
    };
    return db.transaction(_renderTrainingByDate, _failure_func);
  };

  renderPastTrainingsDate = function() {
    return db.transaction(_renderPastTrainingsDate, _failure_func);
  };

  _renderPastTrainingsDate = function(tx) {
    var SELECT_TRAININGS_DATE, config;
    if (typeof console !== "undefined" && console !== null) {
      console.log('_renderPastTrainingsDate');
    }
    config = getConfig();
    if (typeof console !== "undefined" && console !== null) console.log(config);
    SELECT_TRAININGS_DATE = 'SELECT created_at FROM trainings t LEFT JOIN items i ON t.item_id = i.id GROUP BY t.created_at ORDER BY t.created_at ' + order[config['past_trainings_order']] + ' LIMIT 10';
    return tx.executeSql(SELECT_TRAININGS_DATE, [], function(tx, res) {
      $('#trainingsubtitle').text('');
      return $('#pasttraininglist').empty().append(wrapHtmlList(_res2Date(res), 'li').join(''));
    }, _failure_func);
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

  _res2ItemAll = function(res) {
    var i, len, _results;
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(res.rows.item(i).id + ' ' + res.rows.item(i).name + ' ' + res.rows.item(i).user + ' ' + res.rows.item(i).attr + ' ' + res.rows.item(i).is_saved);
    }
    return _results;
  };

  _res2TrainingAll = function(res) {
    var i, len, _results;
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push(res.rows.item(i).id + ' ' + res.rows.item(i).item_id + ' ' + res.rows.item(i).value + ' ' + res.rows.item(i).created_at + ' ' + res.rows.item(i).is_saved);
    }
    return _results;
  };

  _res2Date = function(res) {
    var i, len, _results;
    len = res.rows.length;
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push('<span>' + res.rows.item(i).created_at + '</span>');
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

  setUp = function() {
    if (typeof console !== "undefined" && console !== null) console.log('setUp');
    db.transaction(function(tx) {
      createTableItems(tx);
      createTableTrainings(tx);
      renderItems(tx);
      return renderTodaysTrainings(tx);
    });
    return createConfig();
  };

  getConfig = function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log('getConfig');
    }
    return JSON.parse(localStorage['config']);
  };

  setConfig = function(change_config) {
    var config;
    config = getConfig();
    return _setConfig($.extend(config, change_config));
  };

  _setConfig = function(json) {
    if (typeof console !== "undefined" && console !== null) {
      console.log('_setConfig');
    }
    return localStorage['config'] = JSON.stringify(json);
  };

  createConfig = function() {
    console.log('createConfig');
    if (localStorage['config'] != null) return;
    return _setConfig({
      db_version: 0,
      localstrage_version: 0,
      todays_trainings_order: 1,
      past_trainings_order: 1
    });
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

  debugSelectItems = function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log('debugSelectItems');
    }
    return db.transaction(function(tx) {
      return tx.executeSql('select * from items', [], function(tx, res) {
        return $('#showdb').append(wrapHtmlList(_res2ItemAll(res), 'li').join(''));
      });
    });
  };

  debugSelectTrainings = function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log('debugSelectTrainings');
    }
    return db.transaction(function(tx) {
      return tx.executeSql('select * from trainings', [], function(tx, res) {
        return $('#showdb').append(wrapHtmlList(_res2TrainingAll(res), 'li').join(''));
      });
    });
  };

  dropTableItems = function() {
    if (!confirm('itemsテーブルをdropして良いですか？')) return;
    return db.transaction(function(tx) {
      return tx.executeSql('DROP TABLE items', [], function() {
        return alert('error: dropTableItems');
      }, function() {
        return alert('success: dropTableItems');
      });
    });
  };

  dropTableTrainings = function() {
    if (!confirm('trainingsテーブルをdropして良いですか？')) return;
    alert('iii');
    return db.transaction(function(tx) {
      return tx.executeSql('DROP TABLE trainings', [], function() {
        return alert('error: dropTableTrainings');
      }, function() {
        return alert('success: dropTableTrainings');
      });
    });
  };

  $(function() {
    setUp();
    $('#itemstitle').on('click touch', function() {
      return $('#itemadd').toggle();
    });
    $('#itemadd button').on('click touch', addItem);
    $(document).on('blur', '#itemlist li input', addTraining);
    $('#pasttrainingstitle').click(renderPastTrainingsDate);
    $(document).on('touchstart', '#pasttraininglist li span', renderTrainingByDate);
    $(document).on('click', '#pasttraininglist li span', renderTrainingByDate);
    $('#debug').on('click touch', function() {
      $('#showdb').toggle();
      return $('#clear').toggle();
    });
    $('#showdb').click(function() {
      debugSelectItems();
      return debugSelectTrainings();
    });
    $('#clear').click(function() {
      dropTableItems();
      return dropTableTrainings();
    });
    $('#test1').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) console.log('test1');
      return db.transaction(function(tx) {
        return tx.executeSql('select * from items left join trainings on items.id = trainings.item_id', [], function(tx, res) {
          return xxx(res, function(x) {
            return x.attr + ':' + x.created_at + ':' + x.item_id + ':' + x.name;
          });
        });
      });
    });
    $('#test2').on('click touch', function() {
      if (typeof console !== "undefined" && console !== null) {
        console.log('test2!');
      }
      return db.transaction(function(tx) {
        return selectTrainingsByDate(tx, function(tx, res) {
          return xxx(res, function(x) {
            return x.attr + ':' + x.created_at + ':' + x.item_id + ':' + x.name;
          });
        });
      });
    });
    return $('#test3').on('click touch', renderPastTrainingsDate);
  });

}).call(this);
