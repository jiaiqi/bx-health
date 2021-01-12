import {
	getItem,
	setItem
} from '../utils.js'

let env = ''
// #ifdef MP-WEIXIN
env = 'wxmp'
// #endif
// #ifdef H5
env = 'h5'
// #endif

const state = {
	env: env,
	globalTextFontSize: 16,
	globalLabelFontSize: 16,
	srvCol: [], // 组件共享的srv_col
	isLogin: getItem('isLogin') ? getItem('isLogin') : false, //登录状态
	bx_auth_ticket: getItem('bx_auth_ticket') ? getItem('bx_auth_ticket') : "", //登录token
	backUrl: "", //当前页面的上一级页面
	authSetting: getItem('authSetting') ? getItem('authSetting') : {}, //微信授权信息
	authBoxDisplay: getItem('authBoxDisplay') ? getItem('authBoxDisplay') : '',
	sickItem: "",
	symptomArr: [],
	doctorInfo: getItem('doctorInfo') ? getItem('doctorInfo') : {},
	dietRecord: getItem('dietRecord') ? getItem('dietRecord') : [],
	pageInfo:getItem('pageInfo') ? getItem('pageInfo') : {},
	inviterInfo:getItem('inviterInfo') ? getItem('inviterInfo') : {} //邀请人
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
		setItem('srvCol', state.srvCol)
	},
	delSrvCol: (state, data) => {
		let fils = state.srvCol.filter(item => item.service_name !== data)
		state.srvCol = fils
	},
	SET_AUTH_SETTING: (state, data) => {
		if (data.type) {
			state.authSetting[data.type] = data.value
			setItem('authSetting', state.authSetting)
			if (data.value === true) {
				state.authBoxDisplay = false // 不显示授权组件
			} else if (data.value === false) {
				state.authBoxDisplay = true //显示授权组件
			}
		}
	},
	SET_LOGIN_STATE: (state, loginState) => {
		state.isLogin = loginState
		setItem('isLogin', loginState)
	},
	SET_BACK_URL: (state, url) => {
		state.backUrl = url
		setItem('backUrl', url)
	},
	SET_SICK_ITEM: (state, sick) => {
		state.sickItem = sick
	},
	SET_SYMPTOM_ARR: (state, symptom) => {
		state.symptomArr = symptom
	},
	SET_DOCTOR_INFO: (state, info) => {
		state.doctorInfo = info
		setItem('doctorInfo', info)
	},
	SET_DIET_RECORD: (state, record) => {
		state.dietRecord = record
		setItem('dietRecord', record)
	},
	SET_PAGE_INFO: (state, pageInfo) => {
		state.pageInfo = pageInfo
		setItem('pageInfo', pageInfo)
	},
	SET_INVITER_INFO: (state, inviterInfo) => {
		state.inviterInfo = inviterInfo
		setItem('inviterInfo', inviterInfo)
	}
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
	setGlobalTextSize: ({
		commit
	}, fontSize) => {
		commit('SET_GLOBAL_TEXT_SIZE', fontSize)
	},
	setGloballabelSize: ({
		commit
	}, fontSize) => {
		commit('SET_GLOBAL_LABEL_SIZE', fontSize)
	},
}

export default {
	// namespaced: true, //开启命名空间 dispatch/commit要加`app/前缀`
	state,
	mutations,
	actions
}
