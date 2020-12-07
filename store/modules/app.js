const state = {
	env: 'mpwx',
	srvCol: [], // 组件共享的srv_col
	isLogin: false, //登录状态
	bx_auth_ticket: "", //登录token
	backUrl: "", //当前页面的上一级页面
}

const mutations = {
	setSrvCol: (state, data) => {
		state.srvCol.push(data)
	},
	delSrvCol: (state, data) => {
		let fils = state.srvCol.filter(item => item.service_name !== data)
		state.srvCol = fils
	},
	SET_LOGIN_STATE: (state, loginState) => {
		state.isLogin = loginState
	},
	SET_BACK_URL: (state, url) => {
		state.backUrl = url
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
	}
}

export default {
	// namespaced: true, //开启命名空间 dispatch/commit要加`app/前缀`
	state,
	mutations,
	actions
}
