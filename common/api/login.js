import http from './http.js'
import Vue from 'vue'
// import http from '@/common/http.js'
import store from '@/store/index.js'
const mpAppNo = 'APPNO20201124160702'
// 检测是否关注公众号
const checkIsAttention = async () => {
	let url = '/wx/select/srvwx_user_app_attention_select'
	let req = {
		"serviceName": "srvwx_user_app_attention_select",
		"colNames": [
			"*"
		],
		"condition": [{
			"colName": "app_no",
			"ruleType": "eq",
			"value": "APPNO20200107181133"
		}]
	}
	let res = await http.post(url, req)
	if (Array.isArray(res.data.data) && res.data.data.length > 0) {
		let result = res.data.data[0]
		if (result.isAttention === true) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}

// 小程序获取微信用户信息
// const getUserInfo = async () => {
// 	// let infoRes = await uni.getUserInfo({
// 	// 	provider: 'weixin'
// 	// })
// 	let infoRes = await wx.getUserProfile({
// 		desc: '用于完善会员资料',
// 	})
// 	// if (Array.isArray(infoRes) && infoRes.length >= 2 && infoRes[1].errMsg && infoRes[1].errMsg ===
// 	// 	'getUserInfo:ok' &&
// 	// 	infoRes[1].userInfo) {
// 	// 	let rawData = {
// 	// 		nickname: infoRes[1].userInfo.nickName,
// 	// 		sex: infoRes[1].userInfo.gender,
// 	// 		country: infoRes[1].userInfo.country,
// 	// 		province: infoRes[1].userInfo.province,
// 	// 		city: infoRes[1].userInfo.city,
// 	// 		headimgurl: infoRes[1].userInfo.avatarUrl,
// 	// 	};
// 	// 	store.commit('SET_WX_USERINFO', rawData);
// 	// 	store.commit('SET_AUTH_USERINFO', true)
// 	// 	return {
// 	// 		success: true,
// 	// 		userInfo: rawData,
// 	// 		response: infoRes[1]
// 	// 	};
// 	// } 

// 	if (infoRes && infoRes.userInfo) {
// 		let rawData = {
// 			nickname: infoRes.userInfo.nickName,
// 			sex: infoRes.userInfo.gender,
// 			country: infoRes.userInfo.country,
// 			province: infoRes.userInfo.province,
// 			city: infoRes.userInfo.city,
// 			headimgurl: infoRes.userInfo.avatarUrl,
// 		};
// 		store.commit('SET_WX_USERINFO', rawData);
// 		store.commit('SET_AUTH_USERINFO', true)
// 		return {
// 			success: true,
// 			userInfo: rawData,
// 			response: infoRes
// 		};
// 	} else {
// 		if (store.state.app.currentPage.indexOf('publicPages/accountExec/accountExec') === -1) {
// 			// 跳转到授权页面
// 			store.commit('SET_CURRENT_PAGE', 'publicPages/accountExec/accountExec')
// 			let pageStack = getCurrentPages()
// 			if (Array.isArray(pageStack) && pageStack.length >= 1) {
// 				let currentPage = pageStack[pageStack.length - 1]
// 				store.commit('SET_PRE_PAGE_URL', currentPage.$page.fullPath)
// 			}
// 		}
// 	}
// 	return false;
// }

// 小程序验证登陆
const wxVerifyLogin = async () => {
	// #ifdef MP-WEIXIN
	// const userInfo = await getUserInfo()
	// if ((!userInfo || !userInfo.response)) {
	// 	// 只有有获取微信用户信息权限的才能继续登录
	// 	store.commit('SET_AUTH_USERINFO', false)
	// 	// return false
	// }
	if (store?.state?.user?.userInfo?.nick_name) {
		store.commit('SET_AUTH_USERINFO', true)
	}
	if (store.state.app.isLogin) {
		return true
	}
	const result = await wx.login();
	if (result.code) {
		let url = '/wx/operate/srvwx_app_login_verify'
		let req = [{
			data: [{
				code: result.code,
				app_no: mpAppNo
			}],
			serviceName: 'srvwx_app_login_verify'
		}]
		let res = await http.post(url, req)

		if (res.data.resultCode === 'SUCCESS') {
			// 登录成功
			uni.setStorageSync('isLogin', true);
			store.commit('SET_LOGIN_STATE', true)
			let resData = res.data.response[0].response;
			if (resData&&resData.bx_open_code) {
				// 后端未获取到unionid 需要通过开放登录接口给后端发送wx.getUserInfo获取到的数据
				return await wxOpenLogin(userInfo.response, resData.bx_open_code)
			}
			store.commit('SET_TICKET', resData.bx_auth_ticket)
			uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
			if (resData && resData.login_user_info.user_no) {
				uni.setStorageSync('login_user_info', resData.login_user_info);
				store.commit('SET_LOGIN_USER', resData.login_user_info)
			}
			if (resData && resData.login_user_info.data) {
				uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
			}
			return true
		}
	}
	// #endif
}

// 小程序开户登录
const wxOpenLogin = async (e, openCode) => {
	let {
		encryptedData,
		iv,
		userInfo,
		signature,
		cloudID,
		rawData
	} = e
	let url = '/wx/operate/srvwx_mini_open_account_login?openCode=' + openCode
	let req = [{
		"serviceName": "srvwx_mini_open_account_login",
		"data": [{
			"app_no": mpAppNo,
			"avatarUrl": userInfo.avatarUrl,
			"nickname": userInfo.nickName,
			"headimgurl": userInfo.avatarUrl,
			"sex": userInfo.gender,
			"country": userInfo.country,
			"province": userInfo.province,
			"city": userInfo.city,
			"encryptedData": encryptedData,
			"cloudID": cloudID,
			"rawData": rawData,
			"iv": iv,
			"signature": signature
		}]
	}]

	let res = await http.post(url, req)
	if (res.data.resultCode === 'SUCCESS') {
		// 登录成功
		uni.setStorageSync('isLogin', true);
		store.commit('SET_LOGIN_STATE', true)
		let resData = res.data.response[0].response;
		store.commit('SET_TICKET', resData.bx_auth_ticket)
		if (resData.login_user_info.user_no) {
			uni.setStorageSync('login_user_info', resData.login_user_info);
			store.commit('SET_LOGIN_USER', resData.login_user_info)
		}
		uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
		if (resData.login_user_info.data) {
			uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
		}
		return true
	} else {
		return false
	}
}

const selectPersonInfo = async () => {
	const user_no = uni.getStorageSync('login_user_info').user_no
	try {
		if (store.state.user.loginUserInfo) {
			user_no = store.state.user.loginUserInfo.user_no
		}
	} catch (e) {
		//TODO handle the exception
	}
	let url = '/health/select/srvhealth_person_info_select'
	let req = {
		"serviceName": "srvhealth_person_info_select",
		"colNames": ["*"],
		order: [{
			colName: 'create_time',
			orderType: 'asc'
		}],
		"condition": [{
			"colName": "create_user",
			"ruleType": "eq",
			"value": user_no
		}],
		"page": {
			"pageNo": 1,
			"rownumber": 2
		},
	}
	let res = await http.post(url, req)
	store.commit('SET_USERINFO', res.data.data[0])
	if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
		let info = res.data.data.find(item => item.no === uni.getStorageSync('cur_user_no'))
		if (info && info.no) {
			store.commit('SET_USERINFO', info)
		}
		store.commit('SET_USERLIST', res.data.data)
		uni.setStorageSync('current_user_info', info || res.data.data[0]);
		uni.setStorageSync('current_user', info && info.name ? info.name : res.data.data[0].name);
		// #ifdef MP-WEIXIN
		if (res.data.data[0].home_store_no && !store.state.app.hasIntoHospital) {
			// 有home_store 此次打开小程序未进入过医院/餐馆主页
			let pageInfo = Vue.prototype.getShareParams()
			// console.log(store.state.app.inviterInfo)
			let pageStack = getCurrentPages()
			let currentPage = ''
			if (Array.isArray(pageStack) && pageStack.length >= 1) {
				currentPage = pageStack[pageStack.length - 1]?.$page?.fullPath
			}
			// 暂时去掉
			if (['诊所', '医院', '健康服务'].includes(store.state
					.user.userInfo.home_store_type) && (!currentPage || (currentPage && currentPage
					.indexOf(
						'/pediaPages/hospitalOverview/hospitalOverview') == -1 && currentPage
					.indexOf(
						'/personalPages/chat/chat') == -1 && currentPage.indexOf(
						'personalPages/gropDetail/gropDetail') == -1)) && pageStack.length ===
				1) {
				// 通过分享医院主页加入的用户
				uni.redirectTo({
					url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + res
						.data
						.data[0].home_store_no,
					success() {
						// 标记 已进入过医院主页
						store.commit('SET_INTO_HOSPITAL_STATUS', true)
					}
				})
			} else if ((['饭馆'].includes(store.state
						.user.userInfo.home_store_type) && store.state.user
					.userInfo.home_store_no)) {
				// 通过分享饭馆主页加入的用户
				uni.redirectTo({
					url: '/otherPages/shop/shopHome?type=find&store_no=' + store.state
						.user
						.userInfo.home_store_no,
					success() {
						// 标记 已进入过餐馆主页
						store.commit('SET_INTO_HOSPITAL_STATUS', true)
					}
				})
			}
		}
		// #endif
		store.commit('SET_AUTH_USERINFO', true);
		return res.data.data[0]
	} else {
		// store.commit('SET_AUTH_USERINFO', false);
		return false
	}
}

export {
	checkIsAttention,
	wxVerifyLogin,
	wxOpenLogin,
	selectPersonInfo
}
