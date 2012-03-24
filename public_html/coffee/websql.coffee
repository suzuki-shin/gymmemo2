###
# config
###
db = window.openDatabase "gymmemo","","GYMMEMO", 1048576

_success_func = (tx) ->
  console?.log 'OK'
  console?.log tx
_failure_func = (tx) ->
  console?.log 'NG'
  console?.log tx

# obj = {'id' : 1, 'name':'hoge', 'user':'xxx@mail.com', 'attr':'minutes', 'ordernum':1}
# のようなデータを受け取り
# [('id', 'name', 'user', 'attr', 'ordernum'), (1,'hoge','xxx@mail.com','minutes',1)]
# のようなデータにして返す
_obj2keysAndVals = (obj) ->
  keys = []
  vals = []
  for k,v of obj
    keys.push(k)
    vals.push(v)
  [keys, vals]

# obj = {'id' : 1, 'name':'hoge', 'user':'xxx@mail.com', 'attr':'minutes', 'ordernum':1}
# のようなデータを受け取り
# ['(id, name, user, attr, ordernum) values (?,?,?,?,?)', (1,'hoge','xxx@mail.com','minutes',1)]
# のようなデータにして返す
obj2insertSet = (obj) ->
  [keys, vals] = _obj2keysAndVals(obj)
  ['(' + keys.join(',') + ') values (' + ('?' for v in vals).join(',') + ')', vals]

# obj = {'id' : 1, 'name':'hoge', 'user':'xxx@mail.com', 'attr':'minutes', 'ordernum':1}
# のようなデータを受け取り
# ['set id = ?, name = ?, user = ?, attr = ?, ordernum = ?', (1,'hoge','xxx@mail.com','minutes',1)]
# のようなデータにして返す
obj2upateSet = (obj) ->
  # obj = {'id' : 1, 'name':'hoge', 'user':'xxx@mail.com', 'attr':'minutes', 'ordernum':1}
  [keys, vals] = _obj2keysAndVals(obj)
  [' set ' + (k + ' = ?' for k in keys).join(','), vals]

createTableItems = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'createTableItems'
  tx.executeSql 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, attr TEXT, is_saved INT DEFAULT 0 NOT NULL, ordernum INT)', [],
                success_func,
                failure_func

selectItems = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'selectItems'
  tx.executeSql 'select * from items', [],
                success_func,
                failure_func

insertItem = (tx, obj, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'insertItem'
  [set, params] = obj2insertSet obj
  console?.log set
  console?.log params
  tx.executeSql 'insert into items ' + set, params,
                success_func,
                failure_func


addItem = (ev) ->
  db.transaction (tx) ->
    insertItem tx, {name: $('#itemname').attr('value') or null, attr: $('#itemattr').attr('value') or null}
  false

xxx = (res) ->
  console?.log 'xxx'
  len = res.rows.length
  for i in [0...len]
    console?.log res.rows.item(i)

setUp =->
  db.transaction (tx) ->
    createTableItems tx

setUp()

$ ->
  $('#itemstitle').on 'click touch', -> $('#itemadd').toggle()
  $('#itemadd button').on 'click touch', addItem




  $('#test1').on 'click touch', ->
    console?.log 'test1'
    db.transaction (tx) ->
      createTableItems tx,
                       -> console?.log('suxx'),
                       -> console?.log('faixx')

  $('#test2').on 'click touch', ->
    console?.log 'test2'
    db.transaction (tx) ->
      selectItems tx,
                  (tx, res) -> xxx res
                  (tx, res) -> console?.log 'faixx'

  $('#test3').on 'click touch',
                 ->
                   console?.log _obj2keysAndVals {id:1, name:'hoge', age:30}
                   console?.log obj2insertSet {id:1, name:'hoge', age:30}
                   db.transaction (tx) ->
                     insertItem tx, {id:3, name:'abxkdjsk', user:'suzuki@', attr:'', ordernum:5}

