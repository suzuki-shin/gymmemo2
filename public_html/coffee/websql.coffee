###
# config
###
db = window.openDatabase "gymmemo","","GYMMEMO", 1048576

###
# 汎用関数
###
# execSqlのsuccess_callbackのdefault
successLog = (mes) ->
  console.log '[success]'
  console.log mes

# execSqlのfailure_callbackのdefault
failureLog = (mes) ->
  console.log '[failure]'
  console.log mes

# executeSqlのラッパー
execSql = (tx, sql, params = [], success_callback = successLog, failure_callback = failureLog) ->
  console.log 'execSql start'
  console.log sql
  console.log params
  tx.executeSql sql, params, success_callback, failure_callback

# CREATE TABLE文を返す(**カラムの型は全部TEXT**)
createTableSql = (name, cols = []) ->
  "CREATE TABLE IF NOT EXISTS '" + name + "' (" + (" #{c} TEXT " for c in cols) + ")"

# 0番目の要素がカラム名のカンマ区切り、それ以降がデータのカンマ区切りであるようなdataをとり、指定テーブルにインサートする
insertData = (tx, name, data = []) ->
  console.log 'insertData'
#   console.log name
#   console.log data
  for d in data.splice 1
    quoted = ("'" + d_ + "'" for d_ in d.split ',')
    execSql tx, "INSERT INTO '" + name + "' (#{data[0]}) VALUES (#{quoted})"

# select結果のtxとresを受け取り(自由変数のcolsのカラムの値を)、console.logに出力する関数を返す
selectToConsoleLog = (cols) ->
  (tx, res) ->
    len = res.rows.length
    for i in [0...len]
      console.log (cols[j] + ': ' +  res.rows.item(i)[cols[j]] for j in [0...cols.length])

# selectした結果のtxとresを受け取ってそれをHTMLのテーブルにして追加する関数を返す
# args
#   cols: カラム名のリスト
#   jqobj: HTMLテーブルのタグを追加したい対象のjQueryオブジェクト
# return
#   FUNCTION: txとresを受け取ってHTMLのテーブルを追加する関数
selectToTable = (table_name, cols, jqobj) ->
  (tx, res) ->
    len = res.rows.length
    items = (res.rows.item(i) for i in [0...len])
    console.log items
#     names = (console.log col.name for col in items[0])
#     console.log names
    jqobj.empty().append '<table class="table001"><caption>' + table_name + '</caption><tr>' + ('<th>' + c + '</th>' for c in cols).join('') + '</tr>' + ('<tr>' + ('<td>' + it[c] + '</td>' for c in cols) + '</tr>' for it in items) + '</table>'

# 指定したテーブルの中身をselectしてconsole.logに出力する
# args
#   tx:
#   table_name: 対象のテーブル名
#   cols: カラム名のリスト
execSelectAndLog = (tx, table_name) ->
  getColsOf tx, table_name,
            (cols) -> execSql tx, "SELECT * FROM #{table_name}", [], selectToConsoleLog(cols)

# 指定したテーブルの中身をselectして、funcで処理する
# args
#   tx:
#   table_name: 対象のテーブル名
#   cols:       カラム名のリスト
#   jqobj:      操作対象のjQueryオブジェクト
#   func FUNCTION: table_nameとcolsとjqueryオブジェクトを受け取りごにょごにょする2引数の関数
selectTables = (tx, table_name, jqobj, func) ->
  getColsOf tx, table_name,
            (cols) -> execSql tx, "SELECT * FROM #{table_name}", [], func(table_name, cols, jqobj)

# テーブルのカラムを取得してそれを使用してごにょごにょする
# args
#   tx
#   table_name : 対象テーブル名
#   callback   : colsを引数にとる1引数の関数。colsを使ってしたい実処理。
getColsOf = (tx, table_name, callback = (x) -> console.log x) ->
  console.log 'getColsOf'
  execSql tx, "SELECT sql FROM sqlite_master WHERE name = ?", [table_name],
          (tx, res) ->
            cols_with_type = (res.rows.item(0).sql.match /\((.+)\)/)[1].split ','
            cols = ((c.match /(\w+)\s+(.+)/)[1] for c in cols_with_type)
            callback cols

createTableHoge =->
  console?.log 'createTableHoge'
  db.transaction (tx) ->
    execSql tx, 'create table hoge (age int, name text)'

insertHoge =->
  console?.log 'insertHoge'
  db.transaction (tx) ->
    execSql tx, 'insert into hoge (age, name) values (?,?)', [10, 'suzuk']
    execSelectAndLog tx, 'hoge'


$ ->
  $('#debug').on 'click', createTableHoge
  $('#debug').on 'touch', createTableHoge
  $('#itemstitle').on 'click', insertHoge
  $('#itemstitle').on 'touch', insertHoge
  $('#recordstitle').on 'click', (ev) ->
    db.transaction (tx) ->
      execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))
  $('#recordstitle').on 'touch', (ev) ->
    db.transaction (tx) ->
      execSql tx, 'select * from hoge', [], selectToTable('hoge', ['age','name'], $('#recordstitle'))