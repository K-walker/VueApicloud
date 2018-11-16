
/**
 * API 接口配置 
 * 说明:每个接口都对应一个RSA公钥（公钥由后台生成）
 */ 
define(function () {
	return {
		login:{
			url:'/amd/login',  
			key:'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHyVXPxTORri1ognuINuzz12ZbniYCSsRluJ4b9XV1jKD1T2Ga+gKg5haxLTjDH+Zha+LWeC+u7paHfIVtwA6tnmNWwUBXPcIPl6YxlqBuOPbPGLzm6uhKVr7yRppB6gfebFYRSseANM5TD0wQZwGUY2F6Eer4NoCX0X6wzr2NS7AgMBAAE='
		},
		getUsers:{
			url:'/amd/users'
		},
		insert:{
			url:'/amd/insert'
		},
		upload:{
			url:'/amd/upload'
		},
		download:{
			url:'/amd/download'
		}
	}
})