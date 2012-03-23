###
# config
###
db = window.openDatabase "gymmemo","","GYMMEMO", 1048576

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

insertItems = (tx, obj, success_func, failure_func) ->
  console?.log 'insertItems'
  [set, params] = _obj2set obj
  tx.executeSql 'insert into items set '+ set, vals, success_func, failure_func

_obj2set = (obj) ->
  # obj = {'id' : 1, 'name':'hoge', 'user':'xxx@mail.com', 'attr':'minutes', 'ordernum':1}
  keys = []
  vals = []
  for k,v in obj
    keys.append(k)
    vals.append(v)

  [keys, vals]

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
                  (tx, res) -> console?.log res.rows.length
                  (tx, res) -> console?.log 'faixx'

#   $('#test1').on 'touch', createTableHoge
#   $('#test2').on 'click', insertHoge
#   $('#test2').on 'touch', insertHoge
#   $('#test3').on 'click', (ev) ->
#     db.transaction (tx) ->
#       execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))
#   $('#test3').on 'touch', (ev) ->
#     db.transaction (tx) ->
#       execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))
