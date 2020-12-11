let env = ''
// #ifdef MP-WEIXIN
env = 'wxmp'
// #endif
// #ifdef H5
env = 'h5'
// #endif

const state = {
	env: env,
	globalTextFontSize: 18,
	globalLabelFontSize: 16,
	srvCol: [], // 组件共享的srv_col
	isLogin: false, //登录状态
	bx_auth_ticket: "", //登录token
	backUrl: "", //当前页面的上一级页面
	authSetting: {}, //微信授权信息
	authBoxDisplay: '',
	sickItem: "",
	symptomArr: []
}
let persistData = {}; //持久化数据
const mutations = {
	SET_GLOBAL_TEXT_SIZE: (state, size) => {
		state.globalTextFontSize = size
	},
	SET_GLOBAL_LABEL_SIZE: (state, size) => {
		state.globalLabelFontSize = size
	},
	setSrvCol: (state, data) => {
		state.srvCol.push(data)
		persistData['srvCol'] = state.srvCol
		uni.setStorageSync('persistData', persistData)
	},
	delSrvCol: (state, data) => {
		let fils = state.srvCol.filter(item => item.service_name !== data)
		state.srvCol = fils
	},
	SET_AUTH_SETTING: (state, data) => {
		if (data.type) {
			state.authSetting[data.type] = data.value
			if (data.value === true) {
				state.authBoxDisplay = false
			} else if (data.value === false) {
				state.authBoxDisplay = true
			}
		}
	},
	SET_LOGIN_STATE: (state, loginState) => {
		state.isLogin = loginState
	},
	SET_BACK_URL: (state, url) => {
		state.backUrl = url
	},
	SET_SICK_ITEM: (state, sick) => {
		state.sickItem = sick
	},
	SET_SYMPTOM_ARR: (state, symptom) => {
		state.symptomArr = symptom
	},

}

const actions = {
	setSrvCol: ({
		commit
	}, srvCol) => {
		commit('setSrvCol', srvCol)
	},
	setBackUrl: ({
		commit
	}, url) => {
		commit('SET_BACK_URL', url)
	},
	setGlobalTextSize:({commit},fontSize)=>{
		commit('SET_GLOBAL_TEXT_SIZE', fontSize)
	},
	setGloballabelSize:({commit},fontSize)=>{
		commit('SET_GLOBAL_LABEL_SIZE', fontSize)
	},
}

export default {
	// namespaced: true, //开启命名空间 dispatch/commit要加`app/前缀`
	state,
	mutations,
	actions
}
