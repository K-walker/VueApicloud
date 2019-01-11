(function () {
    window.requireConfig = {
        baseUrl:"../script/modules",
        paths:{
            // 第三方库
            vue:"../lib/vue",
            fastclick:"../lib/fastclick",
            jquery:"../lib/jquery180min",
            promise:"../lib/es6promisemin",
            $api:"../lib/api",
            crypto:"../lib/cryptomin",

            // 项目环境配置
            config:'../config/envconfig',
            // 数据库表配置
            tbConfig:'../config/tableconfig',
            // api 接口配置
            apiConfig:'../config/apiconfig',
            // 工具
            utils:"utils",

            // 公共功能模块
            chI18n:"chi18n",
            apiHttp:"http",
            db:"db",
            fs:"fs",
            // 加解密模块
            cryptoUtils:"cryptoutils",

            // 组件 (请根据自己的需求添加)
            chDropdown:'../components/dropdown'
        },
        shim:{
            $api:{
                exports:"$api"
            }
        }
    }
})();
