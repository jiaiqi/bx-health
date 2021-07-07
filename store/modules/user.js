import {
	getItem,
	setItem
} from '../utils.js'

const state = {
	loginUserInfo: getItem('loginUserInfo') ? getItem('loginUserInfo') : {}, //账号信息
	wxUserInfo: getItem('wxUserInfo') ? getItem('wxUserInfo') : {}, //微信用户信息
	profileInfo:{}, // 
	userInfo: {}, // 当前用户基础信息
	// userInfo: getItem('userInfo') ? getItem('userInfo') : {}, // 当前用户基础信息
	userList: {}, // 当前登录账号下的用户列表
	// userList: getItem('userList') ? getItem('userList') : {}, // 当前登录账号下的用户列表
	patientInfo: getItem('patientInfo') ? getItem('patientInfo') : {},
	hasSaveUserInfo: false,
	storeUserInfo: {},
	bx_open_code:"",
	needOpenLogin: false, //初次登录当前小程序的微信号需要调开放登录接口
}

const mutations = {
	$setUserState(state, payload) {
		// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
		let nameArr = payload.name.split('.');
		let saveKey = '';
		let len = nameArr.length;
		if (len >= 2) {
			let obj = state[nameArr[0]];
			for (let i = 1; i < len - 1; i++) {
				obj = obj[nameArr[i]];
			}
			obj[nameArr[len - 1]] = payload.value;
			saveKey = nameArr[0];
		} else {
			// 单层级变量，在state就是一个普通变量的情况
			state[payload.name] = payload.value;
			saveKey = payload.name;
		}
	},
	SET_LOGIN_USER: (state, loginUserInfo) => {
		state.loginUserInfo = loginUserInfo
		setItem('loginUserInfo', loginUserInfo)
	},
	SET_USERINFO: (state, userInfo) => {
		state.userInfo = userInfo
		// setItem('userInfo', userInfo)
	},
	SET_WX_USERINFO: (state, wxUserInfo) => {
		state.wxUserInfo = wxUserInfo
		setItem('wxUserInfo', wxUserInfo)
	},
	SET_USERLIST: (state, userList) => {
		state.userList = userList
		// setItem('userList', userList)
	},
	SET_PATIENT_INFO: (state, patientInfo) => {
		state.patientInfo = patientInfo
		setItem('patientInfo', patientInfo)
	},
	SET_SAVE_USER_STATUS: (state, hasSaveUserInfo) => {
		state.hasSaveUserInfo = hasSaveUserInfo
	},
	SET_STORE_USER: (state, storeUserInfo) => {
		state.storeUserInfo = storeUserInfo
	}
}

const actions = {
	// get user info
	setUserInfo({
		commit
	}, userInfo) {
		commit('SET_USERINFO', userInfo)
	},
	setWxUserInfo({
		commit
	}, wxUserInfo) {
		commit('SET_WX_USERINFO', wxUserInfo)
	},
	setUserList({
		commit
	}, userList) {
		commit('SET_USERLIST', userList)
	}
}

export default {
	// namespaced: true,
	state,
	mutations,
	actions
}
