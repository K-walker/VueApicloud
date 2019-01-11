/**
 * Created by 004928 on 2017/9/27.
 */
define(['config' , 'chI18n'] , function (config , chI18n) {

    var Utils = function () {

    }

    /**
     * 格式化日期
     * @param dateStr:  date or datestring
     * @param format
     */
    Utils.prototype.dateFormat = function (date , format) {
        if(this.getType(date) === "String") date = new Date(date.replace(/-/g , "/")) ;
        var o = {
            "M+":date.getMonth() + 1 ,
            "d+":date.getDate(),
            "h+":date.getHours(),
            "m+":date.getMinutes(),
            "s+":date.getSeconds(),
            "q+":Math.floor(date.getMonth() / 3 + 1), //季度
            "S+":date.getMilliseconds()
        }

        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
    }

    /**
     * 获取value的类型
     */
    Utils.prototype.getType = function (value) {
    	var type = Object.prototype.toString.call(value);
    	if( type === "[object String]") return "String" ;
    	if( type === "[object Number]") return "Number" ;
    	if( type === "[object Null]") return "Null" ;
    	if( type === "[object Boolean]") return "Boolean" ;
    	if( type === "[object Object]") return "Object" ;
    	if( type === "[object Array]") return "Array" ;
    	if( type === "[object Undefined]") return "Undefined" ;
    	if( type === "[object Date]") return "Date" ;
    }

    /**
     * 分离对象的key和value，并对value值转化为string
     */
    Utils.prototype.separate = function (obj) {
        var keys = [] , values = [] ;
    	for(key in obj) {
            keys.push(key);
    		var value = obj[key] ;
    		var type = this.getType(value) ;
    		if(type === "String") {
                value = value.replace(/'/g,"''");
    			value = "'"+value+"'";
    		} else if (type === "Undefined" || type === "Null") {
    			value = "null" ;
    		} else if(type === "Array") {
    			value = value.length == 0 ? "null" : "'"+JSON.stringify(value).replace(/'/g,"''")+"'";
    		} else if(type === "Object") {
                value = JSON.stringify(value).replace(/'/g,"''");
    			value = "'"+value+"'";
    		} else if(type === "Boolean") {
    			value = value ? 1 : 0 ;
    		}
    		values.push(value);
    	}
        return {
            keys:keys,
            values:values
        }
    }

    /**
     * 判断值是否为空
     * 包括 null 、 undefined 、 空字符串 、数组长度为 0，空对象 {}
     */
    Utils.prototype.isEmpty = function (value) {
        var type = this.getType(value) ;
        if(type === "Undefined" || type === "Null") return true ;
        if(type === "Array") return value.length === 0 ;
        if(type === "String") return value === "" ;
        if(type === "Object") return Object.keys(value).length === 0 ;
        return false ;
    }

    /**
     * 扩展对象
     * @param o 需要扩展的目标对象
     * @param t
     */
    Utils.prototype.extend = function (o , t) {
        for(key in t) {
            if(o.hasOwnProperty(key)) {
                o[key] = t[key];
            } else {
                this.addProperty(o , key , t[key]);
            }
        }
    }

    /**
     * 给对象添加属性
     */
    Utils.prototype.addProperty = function (obj , propertyName , value) {
        Object.defineProperty(obj , propertyName , {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        });
    }

    /**
     *  比较时间大小
     */
    Utils.prototype.compareTime = function (pre , next) {
        var preDate = new Date(pre.replace(/-/g , "/"));
        var nextDate = new Date(next.replace(/-/g , "/"));
        return preDate.getTime() - nextDate.getTime() ;
    }


    /**
     * 打开系统相册
     */
    Utils.prototype.openSysAlbum = function (callback) {
        var that = this ;
        var uiMediaScanner = api.require("UIMediaScanner");
        uiMediaScanner.open({
            type: 'picture',
            column: 4,
            classify: true,
            max: 6,
            sort: {
                key: 'time',
                order: 'desc'
            },
            texts: {
                stateText: chI18n.ALBUM_SELECT_NUM,
                cancelText: chI18n.ALBUM_SELECT_CANCEL,
                finishText: chI18n.ALBUM_SELECT_SUCCESS,
            },
            styles: {
                bg: '#fff',
                mark: {
                    icon: '',
                    position: 'bottom_left',
                    size: 20
                },
                nav: {
                    bg: '#eee',
                    stateColor: '#000',
                    stateSize: 18,
                    cancelBg: 'rgba(0,0,0,0)',
                    cancelColor: '#000',
                    cancelSize: 18,
                    finishBg: 'rgba(0,0,0,0)',
                    finishColor: '#000',
                    finishSize: 18
                }
            },
            scrollToBottom:{
               intervalTime: -1,
               anim: true
            },
            exchange: true,
            rotation: true
        }, function( ret ) {
            if( ret ) {
                var pathList = [] ;
                if(ret.eventType == "confirm") {
                    ret.list.forEach(function (item) {
                        pathList.push(item.path);
                    });
                    pathList.forEach(function (imgpath , index) {
                        that.transPathToCache(uiMediaScanner , imgpath , callback);
                    })
                }
            }
        });
    }

    /**
     * 对相册返回的路径进行转换
     * @param imgPath 图片路径
     */
    Utils.prototype.transPathToCache = function (ums , imgPath , callback) {
        ums.transPath({
            path:imgPath
        } , function (ret , err) {
            if(ret) {
                if(callback) callback(ret.path);
            }
        })
    }

    /**
     * 获取操作系统类型
     * mac , windows , linux , ios , android , windowsPhone
     */
    Utils.prototype.getOS = function () {
        var userAgent = 'navigator' in window
                    && 'userAgent' in navigator
                    && navigator.userAgent.toLowerCase() || '';
        var appVersion = 'navigator' in window
                    && 'appVersion' in navigator
                    && navigator.appVersion.toLowerCase() || '';

        if(/mac/i.test(appVersion)) return "mac";
        if(/win/i.test(appVersion)) return "windows";
        if(/linux/i.test(appVersion)) return "linux";
        if(/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) return "ios";
        if(/android/i.test(userAgent)) return "android";
        if(/win/i.test(appVersion) && /phone/i.test(userAgent)) return "windowsPhone"
    }

    /**
     * 构建建表sql语句
     * @params {Object} tbConfig 数据表配置
     */
     Utils.prototype.initCreateTbSql = function (tbConfig) {
         var sqlObj = {} ;
         for(var tbName in tbConfig) {
             var tbProperties = tbConfig[tbName] ;
             var tbSql = [] ;
             for(var field in tbProperties) {
                 tbSql.push(field + ' ' +tbProperties[field]);
             }
             this.addProperty(sqlObj , tbName , '('+tbSql.join(',')+')');
         }
         return sqlObj ;
     }

     /**
      * 获取对象所有的key
      */
     Utils.prototype.getKeys = function (obj) {
         var keys = [];
         for(key in obj) {
             keys.push(key);
         }
         return keys ;
     }

     /**
      * 获取表新增的字段
      */
     Utils.prototype.getNewTbFields = function (t , o) {
         if(this.isEmpty(t)) return [];
         var newFields = this.getKeys(t);
         var addFields = [] ;
         newFields.forEach(function (field) {
             if(o.indexOf(field) == -1) {
                 addFields.push(field);
             }
         });
         return addFields ;
     }

     /**
      * 获取系统语言
      */
     Utils.prototype.getLanguage = function () {
         return (navigator.language || navigator.browserLanguage).toLowerCase();
     }

     return new Utils();
})
