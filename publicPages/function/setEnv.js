function isWeixinClient() {
	// #ifdef H5
	let ua = navigator.userAgent.toLowerCase()
	// 微信公众号环境
	let isWeixin = ua.indexOf('micromessenger') !== -1
	if (isWeixin) {
		return true
	} else {
		return false
	}
	// #endif
	// #ifdef MP-WEIXIN
	// 微信小程序环境
	return true
	// #endif
};

function setEnv() {
	let client_env = '';
	let client_type = '';
	// #ifdef H5
	const isWeixin = isWeixinClient();
	console.log('isWeixin', isWeixin);
	client_env = isWeixin ? 'wxh5' : 'web';
	// #endif
	// #ifdef MP-WEIXIN
	client_env = 'wxmp';
	//#endif
	// #ifdef APP-PLUS
	client_env = 'app';
	// #endif
	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			console.log('运行在Android上');
			client_type = 'android';
			break;
		case 'ios':
			console.log('运行在iOS上');
			client_type = 'ios';
			break;
		default:
			client_type = 'web';
	}
	uni.setStorageSync('client_env', client_env);
	uni.setStorageSync('client_type', client_type);
	return {
		env: client_env,
		type: client_type
	}
}
export default setEnv
