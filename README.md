# VueApicloud
这是一个基于AMD规范，封装的一个vue+apicloud的移动端框架模板，内置了很多常用模块: db , http , crypto , fs , i18n 等，另外还提供了一些公共方法

# 项目结构 (以下为主要目录结构)
```
VueApicloud
    |-css
    |-html
    |-image
    |-res
        |-lang
          |-en-us.js
          |-zh-cn.js
    |-script
        |-components
          |-env.config.js
        |-config
          |-api.config.js
          |-env.config.js
          |-require.config.js
          |-table.config.js
        |-lib
        |-modules
    config.xml
```

> res/lang : 存放国际化语言文件
> script/components : 存放一些公共组件
> script/config :  这个目录下有三个配置文件，分别为 :
    > env.config.js: 项目环境配置
    > require.config.js: 模块加载的配置
    > table.config.js: 数据库表的配置
> script/lib :  第三方包
> script/modules : 项目中常用的公共模块  

# 使用

> 首先需要在 require.config.js 文件中配置好，项目中所需要用的js库和模块 （如何配置请阅读requirejs了解）
> env.config.js 中包含一些关于项目的配置，如:开发环境，数据库，模拟账号等配置。
> table.config.js 则是用来定义表结构，具体定义方式，参考 table.config.js 中示例代码
> 在项目中如何使用:
    
```
    <script src="../script/config/require.config.js"></script>
    <script src="../script/lib/require.js"></script>
    <script>
        apiready = function () {
            // 加载require配置 参数 requireConfig
            require.config(requireConfig);
            // 加载当前页面所需模块
            require(['vue' , 'db'] , function (Vue , db) {
                new Vue({
                    el:'#app',
                    data:{

                    },
                    created:function () {
                        // 初始化数据库，且仅需在项目中只调用这一次
                        db.open();
                    }
                })
            })
        }
    </script>  
```
# 开发中需要注意的细节

> 在使用数据库之前，一定要先调用 db.open() 初始化数据库（且仅需在项目中只调用这一次）
> 向数据库表中插入数据的时候要先初始化表(详见db.html)
> 后台返回的需要存储的字段需与表字段一一对应
> 如果后台接口中新增了字段，记得在插入数据之前检查一下是否有新增字段(详见db.html)
> 由于每个项目组接口返回的格式可能不一样，在确定好返回格式之后，
    要修改下httpPromise.js 文件中 handleResponse 中的处理方式
    以及在发送请求时的配置设置，已我当前项目为例：
    接口返回格式:
    {
        msg:'success',   // msg 为success则成功，其他则失败
        data:[]          // 接口返回的具体数据Array或Object
    }
    当前请求方式(非表单提交):
        `Content-Type:'appplication/json'`
    body为json对象或字符串
    详细配置请参考apicloud [ajax配置](https://docs.apicloud.com/Client-API/api#3)
   注意，这里的请求方式需与后台协商好，本项目中只是一个示例，根据你自己实际情况进行修改


