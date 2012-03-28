###
# config
###
db = window.openDatabase "gymmemo","","GYMMEMO", 1048576
order = [' ASC ', ' DESC ']

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
  [keys, vals] = _obj2keysAndVals(obj)
  [' set ' + (k + ' = ?' for k in keys).join(','), vals]

createTableItems = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'createTableItems'
  tx.executeSql 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, attr TEXT, is_saved INT DEFAULT 0 NOT NULL, ordernum INT DEFAULT 0, is_active INTEGER DEFAULT 1)', [],
                success_func,
                failure_func

createTableTrainings = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'createTableTrainings'
  tx.executeSql 'CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, item_id INTEGER NOT NULL, value INTEGER NOT NULL, created_at TEXT, is_saved INT DEFAULT 0 NOT NULL)', [],
                success_func,
                failure_func

selectItems = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'selectItems'
  tx.executeSql 'select * from items order by ordernum asc', [],
                success_func,
                failure_func

selectTrainingsByDate = (tx, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'selectTrainingsByDate'
  SELECT_TRAININGS_BY_DATE = 'SELECT tr.item_id AS item_id, it.name AS name, tr.value AS value, it.attr AS attr, tr.created_at AS created_at FROM trainings AS tr LEFT JOIN items AS it ON tr.item_id = it.id WHERE tr.created_at = ? ORDER BY tr.id '# + order[config['todays_training_order']]
  tx.executeSql SELECT_TRAININGS_BY_DATE, [getYYYYMMDD()],
                success_func,
                failure_func

insertItem = (tx, obj, success_func = _success_func, failure_func = _failure_func) ->
  insertData tx, 'items', obj, success_func, failure_func

insertTraining = (tx, obj, success_func = _success_func, failure_func = _failure_func) ->
  insertData tx, 'trainings', obj, success_func, failure_func

insertData = (tx, table, obj, success_func = _success_func, failure_func = _failure_func) ->
  console?.log 'insertData'
  [set, params] = obj2insertSet obj
  console?.log table
  console?.log set
  console?.log params
  tx.executeSql 'insert into ' + table + ' ' + set, params,
                success_func,
                failure_func


addItem = (ev) ->
  db.transaction (tx) ->
    insertItem tx, {name: $('#itemname').attr('value') or null, attr: $('#itemattr').attr('value')},
               (tx) ->
                 renderItems tx
                 $('#itemname').attr('value', '')
                 $('#itemattr').attr('value', '')
  false

# addTraining = (ev) ->
#   db.transaction (tx) ->
#     insertTraining tx {item_id:


renderItems = (tx) ->
  console?.log 'renderItems'
  _renderItems = (res) ->
    _res2inputElems = (res) ->
      len = res.rows.length
      (res.rows.item(i).name + '<input type="number" id="item' + res.rows.item(i).id + '" size="3" />' + res.rows.item(i).attr for i in [0...len])
    $('#itemlist').empty().append wrapHtmlList(_res2inputElems(res), 'li').join('')
  selectItems tx, (tx, res) -> _renderItems res


renderTodaysTrainings = (tx) ->
  console?.log 'renderTodaysTrainings'
  selectTrainingsByDate tx, (tx, res) -> $('#todaystraininglist').empty().append wrapHtmlList(_res2NameValues(res), 'li').join('')

renderTrainingByDate = (ev) ->
    console?.log 'renderTrainingByDate'
    date = ev.target.textContent
    _renderTrainingByDate = (tx) ->
        console.log('_renderTrainingByDate')
        config = getConfig()
        SELECT_TRAININGS_BY_DATE = 'SELECT * FROM trainings t LEFT JOIN items i ON t.item_id = i.id WHERE t.created_at = ? ORDER BY t.id '# + order[config['todays_training_order']]
        tx.executeSql SELECT_TRAININGS_BY_DATE, [date],
                      (tx, res) ->
                          $('#trainingsubtitle').text date
                          $('#pasttraininglist').empty().append wrapHtmlList(_res2NameValues(res), 'li').join('')
                      _failure_func
    db.transaction _renderTrainingByDate, _failure_func


renderPastTrainingsDate =->
    db.transaction _renderPastTrainingsDate, _failure_func

_renderPastTrainingsDate = (tx) ->
    console?.log('_renderPastTrainingsDate')
    config = getConfig()
    console?.log config
    SELECT_TRAININGS_DATE = 'SELECT created_at FROM trainings t LEFT JOIN items i ON t.item_id = i.id GROUP BY t.created_at ORDER BY t.created_at ' + order[config['past_trainings_order']] + ' LIMIT 10'
    tx.executeSql SELECT_TRAININGS_DATE, [],
                  (tx, res) ->
                      $('#trainingsubtitle').text ''
                      $('#pasttraininglist').empty()
                                          .append wrapHtmlList(_res2Date(res), 'li').join('')
                  _failure_func


_res2NameValues = (res) ->
    len = res.rows.length
    (res.rows.item(i).name + ' ' + res.rows.item(i).value + res.rows.item(i).attr for i in [0...len])

_res2ItemAll= (res) ->
    len = res.rows.length
    (res.rows.item(i).id + ' ' + res.rows.item(i).name + ' ' + res.rows.item(i).user + ' ' + res.rows.item(i).attr + ' ' + res.rows.item(i).is_saved for i in [0...len])

_res2TrainingAll= (res) ->
    len = res.rows.length
    (res.rows.item(i).id + ' ' + res.rows.item(i).item_id + ' ' + res.rows.item(i).value + ' ' + res.rows.item(i).created_at + ' ' + res.rows.item(i).is_saved for i in [0...len])

_res2Date = (res) ->
    len = res.rows.length
    ('<span>' + res.rows.item(i).created_at + '</span>' for i in [0...len])



wrapHtmlList = (list, tag) ->
    ('<' + tag + '>' + l + '</' + tag + '>' for l in list)


addTraining = (ev) ->
  console?.log 'addTraining'
  return if not ev.target.value

  item_id = ev.target.id.slice(4,8)
  db.transaction (tx) ->
    insertTraining tx, {item_id: item_id, value: ev.target.value, created_at: getYYYYMMDD()},
                   (tx, res) ->
                     renderTodaysTrainings tx
                     $(ev.target).attr('value', '')
  false

getYYYYMMDD =->
  dt = new Date()
  yyyy = dt.getFullYear()
  mm = dt.getMonth() + 1
  mm = '0' + mm if mm < 10
  dd = dt.getDate()
  dd = '0' + dd if dd.length < 10
  return yyyy + '/' + mm + '/' + dd


setUp =->
  console?.log 'setUp'
  db.transaction (tx) ->
    createTableItems tx
    createTableTrainings tx
    renderItems tx
    renderTodaysTrainings tx
  createConfig()

getConfig =->
  console?.log 'getConfig'
  JSON.parse(localStorage['config'])

setConfig = (change_config) ->
  config = getConfig()
  _setConfig($.extend(config, change_config))

_setConfig = (json) ->
  console?.log '_setConfig'
  localStorage['config'] = JSON.stringify(json)

createConfig =->
  console.log 'createConfig'
  return if localStorage['config']?
  _setConfig(
    db_version: 0
    localstrage_version: 0
    todays_trainings_order: 1
    past_trainings_order: 1
  )

##
## for test
##
xxx = (res, func = (x) -> x) ->
  console?.log 'xxx'
  len = res.rows.length
  for i in [0...len]
    console?.log func(res.rows.item(i))

debugSelectItems =->
  console?.log 'debugSelectItems'
  db.transaction (tx) ->
    tx.executeSql 'select * from items', [],
                  (tx, res) ->
                    $('#showdb').append wrapHtmlList(_res2ItemAll(res), 'li').join('')

debugSelectTrainings =->
  console?.log 'debugSelectTrainings'
  db.transaction (tx) ->
    tx.executeSql 'select * from trainings', [],
                  (tx, res) ->
                    $('#showdb').append wrapHtmlList(_res2TrainingAll(res), 'li').join('')

dropTableItems =->
  if not confirm 'itemsテーブルをdropして良いですか？'
    return

  db.transaction (tx) ->
    tx.executeSql 'DROP TABLE items', [],
                  -> alert 'error: dropTableItems',
                  -> alert 'success: dropTableItems',

dropTableTrainings =->
  if not confirm 'trainingsテーブルをdropして良いですか？'
    return
  alert 'iii'
  db.transaction (tx) ->
    tx.executeSql 'DROP TABLE trainings', [],
                  -> alert 'error: dropTableTrainings',
                  -> alert 'success: dropTableTrainings',



$ ->
  setUp()

  $('#itemstitle').on 'click touch', -> $('#itemadd').toggle()
  $('#itemadd button').on 'click touch', addItem
  $(document).on 'blur', '#itemlist li input', addTraining

  $('#pasttrainingstitle').on 'click touch' renderPastTrainingsDate

  $(document).on 'touchstart', '#pasttraininglist li span', renderTrainingByDate
  $(document).on 'click', '#pasttraininglist li span', renderTrainingByDate


  $('#debug').on 'click touch',
                 ->
                   $('#showdb').toggle()
                   $('#clear').toggle()

  $('#showdb').click ->
    debugSelectItems()
    debugSelectTrainings()
  $('#clear').click ->
    dropTableItems()
    dropTableTrainings()

  $('#test1').on 'click touch', ->
    console?.log 'test1'
    db.transaction (tx) ->
      tx.executeSql 'select * from items left join trainings on items.id = trainings.item_id', [],
                    (tx, res) -> xxx(res, (x) -> x.attr + ':' + x.created_at + ':' + x.item_id + ':' + x.name)
#       renderTodaysTrainings tx
#       renderItems tx
#       createTableItems tx,
#                        -> console?.log('suxx'),
#                        -> console?.log('faixx')

  $('#test2').on 'click touch', ->
    console?.log 'test2!'
    db.transaction (tx) ->
      selectTrainingsByDate tx,
                            (tx, res) -> xxx(res, (x) -> x.attr + ':' + x.created_at + ':' + x.item_id + ':' + x.name)
#     console?.log getYYYYMMDD()
#     console?.log wrapHtmlList [1..5], 'li'
#     db.transaction (tx) ->
#       selectItems tx,
#                   (tx, res) -> xxx res
#                   (tx, res) -> console?.log 'faixx'

  $('#test3').on 'click touch',
    renderPastTrainingsDate
#                  -> setConfig({db_version:10})
#                    console?.log _obj2keysAndVals {id:1, name:'hoge', age:30}
#                    console?.log obj2insertSet {id:1, name:'hoge', age:30}
#                    db.transaction (tx) ->
#                      insertItem tx, {id:3, name:'abxkdjsk', user:'suzuki@', attr:'', ordernum:5}
