/**
 * 加载系统语言
 */
define(function () {
	var lang = (navigator.language || navigator.browserLanguage).toLowerCase() ;
	var data = api.readFile({
		sync: true ,
		path: 'widget://res/lang/' +lang.replace(/-/g,'')+ '.json'
	});
	if(data == '') throw Error('not found ' + lang + '.json');
    return eval(data);
})
