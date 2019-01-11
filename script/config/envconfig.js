define(function () {
    return {
    	// 配置当前环境 true 线上， false 开发
        production:false,
        // 线上地址
        releaseUrl:'http://www.it3315.com',
        // 开发地址  
        devUrl:'http://192.168.220.178:8080',
        // 网路请求超时时间
        timeout:180,
        // 数据库配置
        dbName:'apicloud',
        dbPath:'fs://res/db/apicloud.db'
    }
})
