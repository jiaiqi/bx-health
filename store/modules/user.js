const state = {
	loginUserInfo:{}, //账号信息
	wxUserInfo: {}, //微信用户信息
	userInfo: {}, // 当前用户基础信息
	userList: {}, // 当前登录账号下的用户列表
}

const mutations = {
	SET_LOGIN_USER:(state, loginUserInfo)=>{
		state.loginUserInfo = loginUserInfo
	},
	SET_USERINFO: (state, userInfo) => {
		state.userInfo = userInfo
	},
	SET_WX_USERINFO: (state, wxUserInfo) => {
		state.wxUserInfo = wxUserInfo
	},
	SET_USERLIST: (state, userList) => {
		state.userList = userList
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
