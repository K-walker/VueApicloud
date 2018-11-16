(function () {
    window.requireConfig = {
        baseUrl:"../script/modules",
        paths:{
            // 第三方库
            vue:"../lib/vue.min",
            fastclick:"../lib/fastclick",
            jquery:"../lib/jquery-1.8.0.min",
            promise:"../lib/es6-promise.min",
            $api:"../lib/api",
            crypto:"../lib/crypto.min",

            // 项目环境配置
            config:'../config/env.config',
            // 数据库表配置
            tbConfig:'../config/table.config',
            // api 接口配置
            apiConfig:'../config/api.config',
            // 工具
            utils:"utils",
            
            // 公共功能模块
            chI18n:"chI18n",
            apiHttp:"http",
            db:"db",
            fs:"fs",
            // 加解密模块
            cryptoUtils:"cryptoUtils",

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
