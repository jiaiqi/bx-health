// // 创建基本状态
// import getters from './getters'

// const state = {
// 	openid: null,
// 	is_login: false, //登录状态 Boolean
// 	bx_auth_ticket: "", // token String
// 	expire_timestamp: 0, // 过期截止时间 Number
// 	login_user_info: null, // 登录用户信息 Object
// 	visiter_user_info: null, // 匿名用户信息 Object
// 	author_state: false, // 微信授权状态 Boolean
// 	user_type: '游客', // 用户类型 String 游客(浏览器环境)/登录用户/匿名用户(微信环境)
// 	client_type: 'browser', //客户端类型 android||ios||browser
// 	client_env: 'web', // 客户端所在环境 wxmp(微信小程序)||wxh5(公众号)||web(网页)||app
// 	// 原有分割线
// 	loading: true, // 是否显示loading
// 	isWeixinCient: false, // 是否在微信
// 	userInfo: {
// 		logined: false, // 授权登陆状态
// 		user_info: {
// 			user_no: '',
// 			dept_no: '',
// 			email: '',
// 			mobile: '',
// 			user_disp: '',
// 			real_name: ''
// 		}
// 	},
// 	appInfo: [{
// 		appId: 'wx78d1d4139f97ffca',
// 		secret: '3271e13ac4246495d982dc5b6f50f749'
// 	}],
// 	sysViewCfg: Object, // 系统基本配置信息 logo | 名称
// 	srvCol: [], // 组件共享的srv_col
// 	templateCfg: {}, //
// }

// const mutations = {
// 	setSrvCol(state, data) {
// 		state.srvCol.push(data)
// 	},
// 	delSrvCol(state, data) {
// 		let fils = state.srvCol.filter(item => item.service_name !== data)
// 		state.srvCol = fils
// 	}
// }

// export default {
// 	state,
// 	mutations,
// 	getters
// }
