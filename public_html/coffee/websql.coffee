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

createTableItems = (tx, success_func, failure_func) ->
  console?.log 'createTableItems'
  tx.executeSql 'create table if not exists items (id int, name text, user text, attr text, is_saved int default 0, ordernum int)',
  #tx.executeSql 'create table if not exists items (id int, name text)',
                [],
                success_func,
                failure_func

selectItems = (tx, success_func, failure_func) ->
  console?.log 'selectItemsCount'
  tx.executeSql 'select * from items', [],
                success_func,
                failure_func

insertItems = (tx, obj, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'insertItems'
  [set, params] = obj2insertSet obj
  console?.log set
  console?.log params
  tx.executeSql 'insert into items ' + set, params,
                success_func,
                failure_func

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

hoge = (res) ->
  len = res.rows.length
  for i in [0...len]
    console?.log res.rows.item(i)
  #     console.log (cols[j] + ': ' +  res.rows.item(i)[cols[j]] for j in [0...cols.length])


$ ->
  $('#test1').on 'click', ->
    console?.log 'test1'
    db.transaction (tx) ->
      createTableItems tx,
                       -> console?.log('suxx'),
                       -> console?.log('faixx')

  $('#test2').on 'click', ->
    console?.log 'test2'
    db.transaction (tx) ->
      selectItems tx,
                  (tx, res) -> hoge res
                  (tx, res) -> console?.log 'faixx'

  $('#test3').on 'click',
                 ->
                   console?.log _obj2keysAndVals {id:1, name:'hoge', age:30}
                   console?.log obj2insertSet {id:1, name:'hoge', age:30}
                   db.transaction (tx) ->
                     insertItems tx, {id:3, name:'abxkdjsk', user:'suzuki@', attr:'', ordernum:5}

  $('#test1').on 'touch', ->
    console?.log 'test1'
    db.transaction (tx) ->
      createTableItems tx,
                       -> console?.log('suxx'),
                       -> console?.log('faixx')

  $('#test2').on 'touch', ->
    console?.log 'test2'
    db.transaction (tx) ->
      selectItems tx,
                  (tx, res) -> hoge res
                  (tx, res) -> console?.log 'faixx'

  $('#test3').on 'touch',
                 ->
                   console?.log _obj2keysAndVals {id:1, name:'hoge', age:30}
                   console?.log obj2insertSet {id:1, name:'hoge', age:30}
                   db.transaction (tx) ->
                     insertItems tx, {id:3, name:'abxkdjsk', user:'suzuki@', attr:'', ordernum:5}


#   $('#test1').on 'touch', createTableHoge
#   $('#test2').on 'click', insertHoge
#   $('#test2').on 'touch', insertHoge
#   $('#test3').on 'click', (ev) ->
#     db.transaction (tx) ->
#       execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))
#   $('#test3').on 'touch', (ev) ->
#     db.transaction (tx) ->
#       execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))
