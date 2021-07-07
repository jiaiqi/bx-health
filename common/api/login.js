import http from './http.js'
import Vue from 'vue'
// import http from '@/common/http.js'
import store from '@/store/index.js'
import api from '@/common/api.js'

const mpAppNo = api.appNo.wxmp
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

// 小程序验证登陆
const wxVerifyLogin = async () => {
	// #ifdef MP-WEIXIN
	if (store?.state?.user?.userInfo?.nick_name) {
		store.commit('SET_AUTH_USERINFO', true)
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
			if (resData && resData.bx_open_code) {
				// 后端未获取到unionid 需要通过开放登录接口给后端发送wx.getUserInfo获取到的数据
				store.commit('$setUserState', {
					name: 'needOpenLogin',
					value: true
				})
				store.commit('$setUserState', {
					name: 'bx_open_code',
					value: resData.bx_open_code
				})
				// return await wxOpenLogin(userInfo.response, resData.bx_open_code)
			}
			store.commit('SET_TICKET', resData.bx_auth_ticket)
			uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
			if (resData && resData.login_user_info.user_no) {
				uni.setStorageSync('login_user_info', resData.login_user_info);
				// store.commit('SET_LOGIN_USER', resData.login_user_info)
				store.commit('$setUserState', {
					name: 'loginUserInfo',
					value: resData.login_user_info
				})
				selectPersonInfo(resData.login_user_info.user_no)
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
			store.commit('$setUserState', {
				name: 'needOpenLogin',
				value: false
			})
			uni.setStorageSync('login_user_info', resData.login_user_info);
			store.commit('SET_LOGIN_USER', resData.login_user_info)
			selectPersonInfo(resData.login_user_info.user_no)
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

const selectPersonInfo = async (userNo) => {
	let user_no = userNo || uni.getStorageSync('login_user_info').user_no
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
			"colName": "userno",
			"ruleType": "eq",
			"value": user_no
		}],
		"page": {
			"pageNo": 1,
			"rownumber": 1
		},
	}
	let res = await http.post(url, req)
	if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
		// store.commit('SET_USERINFO', res.data.data[0])
		store.commit('$setUserState', {
			name: "userInfo",
			value: res.data.data[0]
		})
		let info = res.data.data.find(item => item.no === uni.getStorageSync('cur_user_no'))
		if (info && info.no) {
			store.commit('SET_USERINFO', info)
		}
		store.commit('SET_USERLIST', res.data.data)
		uni.setStorageSync('current_user_info', info || res.data.data[0]);
		uni.setStorageSync('current_user', info && info.name ? info.name : res.data.data[0].name);
		store.commit('SET_AUTH_USERINFO', true);
		store.commit('$setState', {
			name: "authUserInfo",
			value: true
		})
		return res.data.data[0]
	} else {
		store.commit('$setState', {
			name: "authBoxDisplay",
			value: true
		})
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
