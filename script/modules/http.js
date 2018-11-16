/**
 * http请求模块
 */
define(["cryptoUtils" , 'promise' , 'config' , 'chI18n'] , 
function (cryptoUtils , Promise , config , chI18n) {
	
    var ApiHttp = function () {
        this.HOST = config.production ? config.releaseUrl : config.devUrl;
        this.TIME_OUT = config.timeout ;               // 超时时间
    }
	
    /**
     * get 请求
     * @param {object} chApi 	api接口对象
     * @param {boolean} loading 是否显示loading框，默认显示
     */
    ApiHttp.prototype.get = function (chApi , loading) {
        return this.sendRequest({
            url:this.HOST + chApi.url,
            method:'get',
            timeout:this.TIME_OUT,
            loading:loading
        });
    }
	
    /**
     * post 加密请求
     * @param {object} chApi api接口对象
     * @param {object} params 请求参数 
     * @param {boolean} loading 是否显示loading框，默认显示
     */
    ApiHttp.prototype.post = function (chApi , params , loading) {
        var self = this ;
        return cryptoUtils.encrypt(chApi.key , params).then(function (encryptParams) {
            return self.sendPost(chApi , encodeURIComponent(encryptParams) , loading);
        });
    }
	
    /**
     * 无加密参数的post请求
     */
    ApiHttp.prototype.sendPost = function (chApi , params , loading) {
        var self = this ;
        return self.sendRequest({
            url:self.HOST + chApi.url,
            method:'post',
            timeout:self.TIME_OUT,
            loading:loading,
            dataType:"json",
            headers:{
                'Content-Type':'application/json'
            },
            data:{
                body:{
                	data:params,
                	aeskey:encodeURIComponent(cryptoUtils.AESkey)
                }
            }
        });
    }

    /**
     * ajax 请求
     * @param {object} params 请求配置
     */
    ApiHttp.prototype.sendRequest = function (options) {
        var self = this ;
        return new Promise(function (resolve , reject) {
            if(!options.loading) self.showLoading();
            api.ajax(options , function(ret , err) {
                self.hideLoading();
                self.handleResponse(ret , err , resolve , reject);
            });
        });
    }
	
	/**
	 * 文件上传 
	 */
	ApiHttp.prototype.upload = function (chApi , params , callback) {
        var that = this ;
        var filePath = params.files ;
        delete params.files ;
        api.ajax({
            url: that.HOST + chApi.url,
            method: 'post',
            report:true,
            timeout:that.TIME_OUT,
            data: {
                values: params ,
                files: {
                    file:filePath
                }
            }
        },function (ret, err) {
             that.handleFileResponse(ret , err , callback);
        });
    }
	
	/**
	 * callback(ret) 
	 * 上传
	 * 	progress: 100,          //上传进度，0.00-100.00
	 *  status: '',             //上传状态，数字类型。（0：上传中、1：上传完成、2：上传失败）
	 *  body: ''                //上传完成时，服务器返回的数据。若dataType为json，那么body为JSON对象，否则为字符串
	 * ================
	 * 下载
	 * 	fileSize:0,             //文件大小，数字类型
	 * 	percent:0,              //下载进度（0-100），数字类型
	 * 	state:0,                //下载状态，数字类型。（0：下载中、1：下载完成、2：下载失败）
	 * 	savePath:''  
	 */
	ApiHttp.prototype.download = function (chApi , savePath , callback) {
		var that = this ;
		api.download({
	        url:that.HOST + chApi.url,
	        savePath:savePath,
	        encode:true,
	        report:true,
	        cache:true,
	        allowResume:true
        },function(ret,err){
        	that.handleFileResponse(ret , err , callback);
        });
	}
	
	/**
     * 文件请求同一处理
     */
    ApiHttp.prototype.handleFileResponse = function (ret , err , callback) {
        var result = null ;
        if (ret) {
        	callback && callback(ret);
        	if(ret.state == 2 || ret.status == 2) {
        		alert(ret.body ? chI18n.UPLOAD_ERROR_MSG : chI18n.DOWNLOAD_ERROR_MSG);
        	}
        } else {
        	callback && callback(null);
        	err.msg = err.code == 0 ? chI18n.NET_ERROR :
                      err.code == 1 ? chI18n.NET_TIME_OUT :
                      err.code == 3 ? chI18n.NET_DATA_TYPE_ERROR :
                      chI18n.SERVER_ERROR ;
            alert(err.msg);
        }
    } 
	
    /**
     * 处理统一请求结果
     * @param {object} ret 请求成功结果,json格式如下:
     *  {
     *      msg:'success',
     *      data:object/array
     *  }
     * @param {object} err 请求失败结果
     * @param {function} resolve 请求成功回调
     * @param {function} reject 请求失败回调
     */
    ApiHttp.prototype.handleResponse = function (ret , err , resolve , reject) {
        var result = null ;
        if (ret) {
            if(ret.msg == 'success') {
                result = ret ;
            } else {
                api.toast({msg:ret.msg,duration:2500});
            }
            resolve(result);
        } else {
            reject(err);
            err.msg = err.code == 0 ? chI18n.NET_ERROR :
                      err.code == 1 ? chI18n.NET_TIME_OUT :
                      err.code == 3 ? chI18n.NET_DATA_TYPE_ERROR :
                      chI18n.SERVER_ERROR ;
            alert(err.msg);
        }
    }

    ApiHttp.prototype.showLoading = function () {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: chI18n.LOADING_TITLE_INFO,
            text: chI18n.LOADING_TEXT_INFO,
            modal: false
        });
    }

    ApiHttp.prototype.hideLoading = function () {
        api.hideProgress();
    }

    return new ApiHttp();
});
