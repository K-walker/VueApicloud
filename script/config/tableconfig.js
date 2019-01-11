/**
 * 数据库表的配置
 */
define(function () {
    return {
        tb_user:{
            _id:'INTEGER PRIMARY KEY AUTOINCREMENT',
            userId:'VARCHAR(32) NOT NULL UNIQUE',
            uname:'VARCHAR(20) NOT NULL',
            passwd:'VARCHAR(50)',
            age:'TINYINT',
            sex:'BOOLEAN DEFAULT true',
            desc:'TEXT'
        }
    }
})
