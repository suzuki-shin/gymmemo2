(function() {

  /*
  # config
  */

  var createTableHoge, createTableSql, db, execSelectAndLog, execSql, failureLog, getColsOf, insertData, insertHoge, selectTables, selectToConsoleLog, selectToTable, successLog;

  db = window.openDatabase("gymmemo", "", "GYMMEMO", 1048576);

  /*
  # 汎用関数
  */

  successLog = function(mes) {
    console.log('[success]');
    return console.log(mes);
  };

  failureLog = function(mes) {
    console.log('[failure]');
    return console.log(mes);
  };

  execSql = function(tx, sql, params, success_callback, failure_callback) {
    if (params == null) params = [];
    if (success_callback == null) success_callback = successLog;
    if (failure_callback == null) failure_callback = failureLog;
    console.log('execSql start');
    console.log(sql);
    console.log(params);
    return tx.executeSql(sql, params, success_callback, failure_callback);
  };

  createTableSql = function(name, cols) {
    var c;
    if (cols == null) cols = [];
    return "CREATE TABLE IF NOT EXISTS '" + name + "' (" + ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cols.length; _i < _len; _i++) {
        c = cols[_i];
        _results.push(" " + c + " TEXT ");
      }
      return _results;
    })()) + ")";
  };

  insertData = function(tx, name, data) {
    var d, d_, quoted, _i, _len, _ref, _results;
    if (data == null) data = [];
    console.log('insertData');
    _ref = data.splice(1);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      quoted = (function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = d.split(',');
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          d_ = _ref2[_j];
          _results2.push("'" + d_ + "'");
        }
        return _results2;
      })();
      _results.push(execSql(tx, "INSERT INTO '" + name + ("' (" + data[0] + ") VALUES (" + quoted + ")")));
    }
    return _results;
  };

  selectToConsoleLog = function(cols) {
    return function(tx, res) {
      var i, j, len, _results;
      len = res.rows.length;
      _results = [];
      for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
        _results.push(console.log((function() {
          var _ref, _results2;
          _results2 = [];
          for (j = 0, _ref = cols.length; 0 <= _ref ? j < _ref : j > _ref; 0 <= _ref ? j++ : j--) {
            _results2.push(cols[j] + ': ' + res.rows.item(i)[cols[j]]);
          }
          return _results2;
        })()));
      }
      return _results;
    };
  };

  selectToTable = function(table_name, cols, jqobj) {
    return function(tx, res) {
      var c, i, it, items, len;
      len = res.rows.length;
      items = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
          _results.push(res.rows.item(i));
        }
        return _results;
      })();
      console.log(items);
      return jqobj.empty().append('<table class="table001"><caption>' + table_name + '</caption><tr>' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cols.length; _i < _len; _i++) {
          c = cols[_i];
          _results.push('<th>' + c + '</th>');
        }
        return _results;
      })()).join('') + '</tr>' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          it = items[_i];
          _results.push('<tr>' + ((function() {
            var _j, _len2, _results2;
            _results2 = [];
            for (_j = 0, _len2 = cols.length; _j < _len2; _j++) {
              c = cols[_j];
              _results2.push('<td>' + it[c] + '</td>');
            }
            return _results2;
          })()) + '</tr>');
        }
        return _results;
      })()) + '</table>');
    };
  };

  execSelectAndLog = function(tx, table_name) {
    return getColsOf(tx, table_name, function(cols) {
      return execSql(tx, "SELECT * FROM " + table_name, [], selectToConsoleLog(cols));
    });
  };

  selectTables = function(tx, table_name, jqobj, func) {
    return getColsOf(tx, table_name, function(cols) {
      return execSql(tx, "SELECT * FROM " + table_name, [], func(table_name, cols, jqobj));
    });
  };

  getColsOf = function(tx, table_name, callback) {
    if (callback == null) {
      callback = function(x) {
        return console.log(x);
      };
    }
    console.log('getColsOf');
    return execSql(tx, "SELECT sql FROM sqlite_master WHERE name = ?", [table_name], function(tx, res) {
      var c, cols, cols_with_type;
      cols_with_type = (res.rows.item(0).sql.match(/\((.+)\)/))[1].split(',');
      cols = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cols_with_type.length; _i < _len; _i++) {
          c = cols_with_type[_i];
          _results.push((c.match(/(\w+)\s+(.+)/))[1]);
        }
        return _results;
      })();
      return callback(cols);
    });
  };

  createTableHoge = function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log('createTableHoge');
    }
    return db.transaction(function(tx) {
      return execSql(tx, 'create table hoge (age int, name text)');
    });
  };

  insertHoge = function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log('insertHoge');
    }
    return db.transaction(function(tx) {
      execSql(tx, 'insert into hoge (age, name) values (?,?)', [10, 'suzuk']);
      return execSelectAndLog(tx, 'hoge');
    });
  };

  $(function() {
    $('#debug').on('click', createTableHoge);
    $('#debug').on('touch', createTableHoge);
    $('#itemstitle').on('click', insertHoge);
    $('#itemstitle').on('touch', insertHoge);
    $('#recordstitle').on('click', function(ev) {
      return db.transaction(function(tx) {
        return execSql(tx, 'select * from hoge', [], selectToTable('hoge', ['age', 'name'], $('#recordstitle')));
      });
    });
    return $('#recordstitle').on('touch', function(ev) {
      return db.transaction(function(tx) {
        return execSql(tx, 'select * from hoge', [], selectToTable('hoge', ['age', 'name'], $('#recordstitle')));
      });
    });
  });

}).call(this);
