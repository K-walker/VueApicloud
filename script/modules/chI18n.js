/**
 * 加载系统语言
 */
define(function () {
	var lang = (navigator.language || navigator.browserLanguage).toLowerCase() ;
	var data = api.readFile({ 
		sync: true ,
		path: 'widget://res/lang/' +lang+ '.js'
	});
    return eval(data) || {} ;
})
