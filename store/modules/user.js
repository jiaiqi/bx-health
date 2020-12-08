import {
	getItem,
	setItem
} from '../utils.js'
try {
	// 尝试获取本地是否存在persistData变量，第一次启动APP时是不存在的
	persistData = uni.getStorageSync('persistData') ? uni.getStorageSync('persistData') : {};
} catch (e) {

}

const state = {
	loginUserInfo: getItem('loginUserInfo') ? getItem('loginUserInfo') : {}, //账号信息
	wxUserInfo: getItem('wxUserInfo') ? getItem('wxUserInfo') : {}, //微信用户信息
	userInfo: getItem('userInfo') ? getItem('userInfo') : {}, // 当前用户基础信息
	userList: getItem('userList') ? getItem('userList') : {}, // 当前登录账号下的用户列表
}

const mutations = {
	SET_LOGIN_USER: (state, loginUserInfo) => {
		state.loginUserInfo = loginUserInfo
		setItem('loginUserInfo', loginUserInfo)
	},
	SET_USERINFO: (state, userInfo) => {
		state.userInfo = userInfo
		setItem('userInfo', userInfo)
	},
	SET_WX_USERINFO: (state, wxUserInfo) => {
		state.wxUserInfo = wxUserInfo
		setItem('wxUserInfo', wxUserInfo)
	},
	SET_USERLIST: (state, userList) => {
		state.userList = userList
		setItem('userList', userList)
	},
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
