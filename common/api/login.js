import http from './http.js'
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
const getUserInfo = async () => {
	let infoRes = await uni.getUserInfo({
		provider: 'weixin'
	})
	if (Array.isArray(infoRes) && infoRes.length >= 2 && infoRes[1].errMsg && infoRes[1].errMsg === 'getUserInfo:ok' &&
		infoRes[1].userInfo) {
		let rawData = {
			nickname: infoRes[1].userInfo.nickName,
			sex: infoRes[1].userInfo.gender,
			country: infoRes[1].userInfo.country,
			province: infoRes[1].userInfo.province,
			city: infoRes[1].userInfo.city,
			headimgurl: infoRes[1].userInfo.avatarUrl,
		};
		store.commit('SET_WX_USERINFO', rawData);
		store.commit('SET_AUTH_USERINFO', true)
		return {
			success: true,
			userInfo: rawData,
			response: infoRes[1]
		};
	} else {
		if (store.state.app.currentPage.indexOf('publicPages/accountExec/accountExec') === -1) {
			// 跳转到授权页面
			store.commit('SET_CURRENT_PAGE', 'publicPages/accountExec/accountExec')
			let pageStack = getCurrentPages()
			if (Array.isArray(pageStack) && pageStack.length >= 1) {
				let currentPage = pageStack[pageStack.length - 1]
				store.commit('SET_PRE_PAGE_URL', currentPage.$page.fullPath)
			}
		}
	}
	return false;
}

// 小程序验证登陆
const wxVerifyLogin = async (dontCheckAuth=false) => {
	// #ifdef MP-WEIXIN
	const userInfo = await getUserInfo(dontCheckAuth)
	if ((!userInfo || !userInfo.response)&&!dontCheckAuth) {
		// 只有有获取微信用户信息权限的才能继续登录
		return false
	}
	// #endif
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
			if (resData.bx_open_code) {
				// 后端未获取到unionid 需要通过开放登录接口给后端发送wx.getUserInfo获取到的数据
				return await wxOpenLogin(userInfo.response, resData.bx_open_code)
			}
			store.commit('SET_TICKET', resData.bx_auth_ticket)
			if (resData && resData.login_user_info.user_no) {
				uni.setStorageSync('login_user_info', resData.login_user_info);
				store.commit('SET_LOGIN_USER', resData.login_user_info)
			}
			uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
			if (resData && resData.login_user_info.data) {
				uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
			}
			return true
		}
	}
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


export {
	checkIsAttention,
	wxVerifyLogin,
	wxOpenLogin
}
