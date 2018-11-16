define(["promise" , 'chI18n'] , function (Promise , chI18n) {
    var FS = function () {
        this.fs = api.require("fs");
    }

    // 复制  文件的父级路径要一致
    FS.prototype.copyTo = function (from , to) {
    	var that = this ;
        return new Promise(function (resolve , reject) {
        	that.fs.copyTo({oldPath:from , newPath:to} , function (ret , err) {
	            if(ret && ret.status) {
	                resolve(ret);
	            } else if(err) {
	                reject(err);
	                alert(err.msg);
	            }
        	})
        })
    }

    // 剪切 文件的父级路径要一致
    FS.prototype.moveTo = function (from , to) {
    	var that = this ;
    	return new Promise(function (resolve , reject) {
    		that.fs.moveTo({oldPath:from , newPath:to} , function (ret , err) {
	            if(ret && ret.status) {
	                resolve(ret);
	            } else if(err) {
	                reject(err);
	                alert(err.msg+err.code);
	            }
	        })
    	})
    }

    // 删除文件
    FS.prototype.delete = function (path) {
    	var that = this ;
    	return new Promise(function (resolve , reject) {
	    	that.fs.remove({path:path} , function (ret , err) {
	            if(ret && ret.status) {
	                resolve(ret);
	            } else if(err) {
	                reject(err);
	                alert(err.msg);
	            }
	        });
    	})
    }

    // 判断文件是否存在（不包括文件夹）
    FS.prototype.isExist = function (path) {
        var ret = this.fs.existSync({ path: path });
        if(ret.exist) {
        	if(ret.directory) return 0 ;// 文件夹
        	else return 1 ;	// 文件
        } else {
        	return -1 ; // 路径不存在
        }
    }

    /**
     * 读取文件
     * @param {object} params
     *      path:文件路径
     *      length:读取内容长度
     *      offset:文件偏移量，以 byte 为单位
     *      codingType:文本的编码格式，取值范围: gbk、utf8(默认)
     */
    FS.prototype.read = function (params) {
        var ret = this.fs.openSync({path:params.path});
        var readParams = {
            fd:ret.fd,
            offset:params.offset || 0
        }
		
        if(params.hasOwnProperty("length")) {
            Object.defineProperty(readParams , "length" , {
              value: params.length,
              writable: true,
              enumerable: true,
              configurable: true
            });
        }

		var that = this ;
		return new Promise(function (resolve , reject) {
			that.fs.read(readParams , function (ret , err) {
				if(ret) {
					resolve(ret);
				} else {
					reject(err);
					alert(result);
				}
	        })
		})
    }
	
	
	/**
	 * 同步读取文件  （请更新fs模块到最新版）
	 * @param {string} path 
	 */
	FS.prototype.readSync = function (path) {
		var ret = this.fs.openSync({path:path});
		var result = this.fs.readSync({ fd:ret.fd });
		if (result.status) {
			return result.data ; 
		} else {
		    return null ;
		}
	}
	
    // 压缩文件
    // params.files 被压缩文件路径组成的数组
    FS.prototype.gzip = function (params) {
        var zip = api.require("zip");
        return new Promise(function (resolve , reject) {
        	zip.archive({
	            files: params.files ,
	            toPath:params.toPath ,
	            password:params.password
	        }, function(ret, err) {
	            if( ret.status ) {
	            	resolve(ret);
	            } else {
	            	reject(err);
	            	alert(err.msg);
	            }
	        });
        })
    }

    // 解压文件
    FS.prototype.ungzip = function (path , password) {
        var that = this ;
        var zip = api.require("zip");
        return new Promise(function (resolve , reject) {
        	zip.unarchive({
	            file: path ,
	            password: password
	        }, function(ret, err) {
	            if( ret.status ) {
	                that.delete(path).then(function () {
	                	api.toast({msg:chI18n.UNZIP_SUCCESS_MSG});
	                	resolve();
	                }).catch(reject);
	            } else {
	            	reject(err);
	                alert(chI18n.UNZIP_FAILURE_MSG);
	            }
	        });
        })
    }
    
    /**
     * 获取文件md5值
     */
    FS.prototype.md5 = function (path) {
        var that = this ;
        return new Promise(function (resolve , reject) {
            that.fs.getMD5({path:path} , function (ret) {
                if(ret.status) {
                    resolve(ret.md5Str);
                } else {
                    reject();
                }
            });
        });
    }

    return new FS();
})
