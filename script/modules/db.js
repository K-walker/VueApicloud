/**
 * 数据库模块
 */
define(["utils",'config' , 'promise' , 'tbConfig'] ,
function (utils , config , Promise , tbConfig) {

    var DBUtils = function () {
        this.dbName = config.dbName;
        this.dbPath = config.dbPath;
        this.db = api.require("db");
    }

    /**
     * 打开数据库 （整个应用只需打开一次即可）
     */
    DBUtils.prototype.open = function () {
        this.db.openDatabase({
            name: this.dbName,
            path: this.dbPath
        }, function(ret, err) {
            if(!ret.status) {
                alert(err.msg);
            }
        });
    }

    /**
     * 关闭数据库
     */
    DBUtils.prototype.close = function (callback) {
        this.db.closeDatabase({
            name: this.dbName
        }, function(ret, err) {
            if( !ret.status ) {
                alert(err.msg);
            } else {
                callback && callback();
            }
        });
    }

    /**
     * 删除所有表 (仅测试使用)
     */
    DBUtils.prototype.clear = function () {
        if(!config.production) {
            var that = this ;
            return that.select('sqlite_master' , ['name'] , 'type="table" and name like "tb_%"')
            .then(function (result) {
                var clearTablePromise = [];
                result.forEach(function (table) {
                    clearTablePromise.push(that.executeSql('drop table '+table.name));
                });
                if(clearTablePromise.length == 0) {
                    return Promise.resolve();
                } else {
                    return Promise.all(clearTablePromise);
                }
            });
        }
    }

    /**
     * 初始化表（tableconfig.js）
     */
    DBUtils.prototype.initTable = function () {
        var that = this ;
        var createTableSqlObj = utils.initCreateTbSql(tbConfig);
        var createPromises = [];
        for(var tbName in createTableSqlObj) {
            createPromises.push(that.createTable(tbName , createTableSqlObj[tbName] , null));
        }
        return Promise.all(createPromises);
    }

    /**
     * 检查是否有新增的列
     * @param {string} tbName  表名
     * @param {string} tbProperties 表的属性
     */
    DBUtils.prototype.checkTbColumn = function (tbName , tbProperties) {
        var checkTbColumnPromise = [] , that = this ;
        var tbObj = tbConfig ;
        if(!utils.isEmpty(tbName) && !utils.isEmpty(tbProperties)) {
            tbObj[tbName] = tbProperties ;
        }
        for(var key in tbObj) {
            var f = (function (key) {
                return that.getAllColumnName(key)
                    .then(function (columnNames) {
                        var addFields = utils.getNewTbFields(tbObj[key] , columnNames);
                        return that.addColumnList(key , addFields);
                    });
            })(key);
            checkTbColumnPromise.push(f);
        }
        return Promise.all(checkTbColumnPromise);
    }

    /**
     * 建表
     * tbName 表名
     * des 表字段描述
     */
    DBUtils.prototype.createTable = function (tbName , des) {
        var sql = "CREATE TABLE IF NOT EXISTS "+tbName+" "+des+"";
        return this.executeSql(sql);
    }

    /**
     * 添加多个列
     */
    DBUtils.prototype.addColumnList = function (tbName , columns) {
        if(columns.length == 0) return Promise.resolve();
        var addColumnPromise = []  , self = this ;
        columns.forEach(function (columnName) {
            addColumnPromise.push(self.addColumn(tbName , columnName));
        });
        return Promise.all(addColumnPromise);
    }

    /**
     * 添加列 ALTER TABLE tbName ADD COLUMN columnName VARCHAR(20)
     */
    DBUtils.prototype.addColumn = function (tbName , columnName , type) {
        type = type || 'TEXT' ;
        var sql = "ALTER TABLE "+tbName+" ADD COLUMN "+columnName+" "+type+"";
        return this.executeSql(sql);
    }

    /**
     * 查询
     * @param tbName
     * @param selectColumn: 查询列，数组类型
     * @param where 查询条件
     * @param callback
     */
    DBUtils.prototype.select = function (tbName , selectColumn , where) {
        var that = this ;
        if(utils.isEmpty(selectColumn)) selectColumn = "*" ;
        else if(utils.getType(selectColumn) != "Array") throw "selectColumn must be a Array";
        else selectColumn = selectColumn.join(",");
        var sql = "SELECT "+selectColumn+" FROM "+tbName+" ";
        if(!utils.isEmpty(where)) sql = sql.concat("where " , where);
        return new Promise(function (resolve , reject) {
            that.db.selectSql({
                name: that.dbName ,
                sql:sql
            }, function(ret , err) {
                if( ret.status ) {
                    resolve(ret.data);
                } else {
                    reject(err);
                }
            });
        })
    }


    /**
     * 插入单条数据
     * @param tbName
     * @param obj 被插入的数据对象（对象字段名称需与表列名相同）
     * @param callback
     */
    DBUtils.prototype.insert = function (tbName , obj) {
        var params = utils.separate(obj);
        var sql  = "insert into "+tbName+" ("+params.keys.join(",")+") values ("+params.values.join(",")+")";
        return this.executeSql(sql);
    }

    /**
     * 批量插入数据
     * @param tbName
     * @param list
     * @param callback
     */
    DBUtils.prototype.insertAll = function (tbName , list) {
        var that = this ;
        var insertPromises = [];
        list.forEach( function (obj) {
            insertPromises.push(that.insert(tbName , obj ));
        })
        return Promise.all(insertPromises);
    }

    /**
     * 删除数据
     * @param tbName
     * @param where 删除条件
     * @param callback
     */
    DBUtils.prototype.delete = function (tbName , where) {
        var sql = "DELETE FROM "+tbName+" ";
        if(where && where != "") sql = sql.concat("where " , where);
        return this.executeSql(sql);
    }

    /**
     * 更新
     * @param tbName
     * @param obj   被更新的数据对象（对象字段名称需与要更新的列名相同）
     * @param where 更新条件
     * @param callback
     */
    DBUtils.prototype.update = function (tbName , obj , where) {
        var params = utils.separate(obj);
        var columns = [] ;
        params.keys.forEach( function (key , index) {
            columns.push(key +"="+ params.values[index]);
        })
        var sql = "UPDATE "+tbName+" SET "+columns.join(",")+" ";
        if(where && where != "") sql = sql.concat("where " , where);
        return this.executeSql(sql);
    }

    /**
     * 获取表的所有列名
     */
    DBUtils.prototype.getAllColumnName = function (tbName) {
        var that = this ;
        return new Promise(function (resolve , reject) {
            that.db.selectSql({
                name: that.dbName,
                sql: "PRAGMA table_info("+tbName+")"
            }, function(ret , err) {
                if( ret.status ) {
                    var result = ret.data.reduce(function (columns , item) {
                        columns.push(item.name);
                        return columns;
                    },[]);
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });

    }

    /**
     *  执行sql语句
     */
    DBUtils.prototype.executeSql = function (sql) {
        var that = this ;
        return new Promise(function (resolve , reject) {
            that.db.executeSql({
                name: that.dbName ,
                sql: sql
            }, function(ret, err) {
                if( ret.status ) {
                    resolve(ret);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 开启事务
     * @param method 事务开启后执行的代码块
     * @param callback
     */
    DBUtils.prototype.beginTransaction = function (method , callback) {
        try {
            // 开启事务
            this.db.transactionSync({name: this.dbName , operation: 'begin'});
            method.call(this);
            // 提交事务
            this.db.transactionSync({name: this.dbName , operation: 'commit'});
        } catch (e) {
            this.db.transactionSync({name: this.dbName , operation: 'rollback'});
        } finally {
            if(callback) callback.call(this);
        }
    }

    return new DBUtils() ;
})
