
define(['promise', 'crypto' , 'chI18n'] , function (Promise , Crypto , chI18n) {
	
	var CryptoUtils = function () {
		this.AESkey = null ;
	}
	
	CryptoUtils.prototype.encrypt = function (publicKey , params) {
		var that = this ;
		return new Promise(function (resolve , reject) {
			try {
				var key = Crypto.AES.getKey() ;
				that.AESkey = Crypto.RSA.encrypt(key , publicKey);
				var encryptStr = Crypto.AES.encrypt(JSON.stringify(params) , key);
				resolve(encryptStr);
			} catch(e) {
				alert(chI18n.DATA_ENCRYPTION_FAILURE);
				reject(e);
			}
		});
	}
	
	return new CryptoUtils();
});