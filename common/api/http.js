import Vue from 'vue'
import api from '@/common/api.js'
import request from '@/common/utils/request.js'
import store from '@/store/index.js'

const fly = request({
	timeout: 20 * 1000,
	baseURL: 'https://srvms.100xsys.cn'
})
let FormateDate = function(date) {
	let o = {
		'yy': date.getFullYear(),
		'MM': date.getMonth() + 1,
		'dd': date.getDate(),
		'HH': date.getHours(),
		'mm': (() => {
			let mm = date.getMinutes()
			if (mm < 10) {
				mm = '0' + mm
			}
			return mm
		})(),
		'ss': date.getSeconds()
	};
	return o.yy + '-' + o.MM + '-' + o.dd + ' ' + o.HH + ':' + o.mm + ':' + o.ss;
};
let ignoreServiceName = (url) => {
	let ignoreUrlList = []
	let result = true
	ignoreUrlList.forEach(srv => {
		if (url.indexOf(srv) !== -1) {
			result = false
		}
	})
	return result
}
//添加请求拦截器
fly.interceptors.request.use(async (request) => {
	//给所有请求添加自定义header
	console.log("request: ", request)
	if (request.url && request.url.indexOf('srvwx_app_login_verify') == -1 && request.url.indexOf(
			'rvuser_login') == -1) {
		if (store && store.getters && store.getters.isLogin === false) {
			// request.cancel = true
			// #ifdef H5
			uni.navigateTo({
				url: '/publicPages/accountExec/accountExec'
			});
			request.cancel = true
			// #endif
			// #ifdef MP-WEIXIN
			// Vue.prototype.toAddPage()
			// const result = await wx.login();
			// if (result.code) {
			// 	let res = await Vue.prototype.wxLogin({
			// 		code: result.code
			// 	});
			// }
			// #endif
		}
	}
	if (request.url && ignoreServiceName(request.url)) {
		console.log(store.state.app.xhrNum, store.state.app.xhrTimestamp - new Date().getTime(), '11111111')
		if (store.state.app.xhrNum === 0 && new Date().getTime() - store.state.app.xhrTimestamp > 1000) {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			})
		}
	}
	store.commit('SET_XHR_NUM', store.state.app.xhrNum + 1)
	console.log(store.state.app.xhrNum)
	// 如果是浏览器运行的记录 请求的页面path和参数
	if (uni.getStorageSync('client_env') === 'wxh5' || uni.getStorageSync('client_env') === 'web') {
		request.headers["requrl"] = window.location.pathname + window.location.search
		console.log("requrl", window.location.pathname + window.location.search, window.location)
	}
	let bxAuthTicket = uni.getStorageSync("bx_auth_ticket")
	if (store.state.app.bx_auth_ticket) {
		bxAuthTicket = store.state.app.bx_auth_ticket
	}
	// console.log('api.onTicket', api.onTicket, api.ticket, bxAuthTicket)
	if (api.onTicket) {
		request.headers["bx_auth_ticket"] = api.ticket
	} else {
		if (bxAuthTicket && request.url.indexOf('srvwx_app_login_verify') === -1) {
			request.headers["bx_auth_ticket"] = bxAuthTicket
		} else if (request.headers["bx_auth_ticket"]) {
			delete request.headers["bx_auth_ticket"]
		}
	}
	if (request.url.indexOf('?openCode=') !== -1) {
		request.headers["bx_open_code"] = request.url.split('?openCode=')[1]
		delete request.headers.bx_auth_ticket

	}
	const outTime = uni.getStorageSync("expire_timestamp") //过期时间
	const date = parseInt(new Date().getTime() / 1000)
	if (outTime) {
		const isExpired = outTime < date
		console.log('登录是否过期:', isExpired, '\n过期时间:', FormateDate(new Date(outTime * 1000)), outTime, date)
		if (isExpired) {
			uni.setStorageSync('isLogin', false)
			request.headers["USERlOGIN"] = "noneLogin" // normal || noneLogin
			return request
		} else {
			request.headers["USERlOGIN"] = "normal" // normal || noneLogin
			return request
		}
	} else {
		request.USERlOGIN = "normal"
		return request
	}

})
//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
	(res) => {
		store.commit('SET_XHR_NUM', store.state.app.xhrNum - 1)
		console.log(store.state.app.xhrNum)
		if (store.state.app.xhrNum === 0) {
			uni.hideLoading()
		}
		//只将请求结果的data字段返回
		if (res.data.resultCode === "0011") { //未登录
			uni.setStorageSync('isLogin', false)
			uni.setStorageSync('stophttp', true)
			if (store && store.commit) {
				store.commit('SET_LOGIN_STATE', false)
			}
			// 后端返回 无效登录时，需要进行的跳转处理
			if (uni.getStorageSync("isLogin")) {
				// 登录状态记录 为 true 时暂时不处理
				uni.showToast({
					title: "用户异常，请退出后，清理缓存重试"
				})
			} else {
				// 确认未登录时再进行自动跳转到登录页面
				let requestUrl = decodeURIComponent(res.request.headers.requrl)
				if (requestUrl) {
					console.log('请求失败::', requestUrl)
					if (requestUrl && requestUrl !== '/' && requestUrl.indexOf("code") ===
						-1 && requestUrl.indexOf('/accountExec/accountExec') === -1) {
						//  过滤无效的url
						let index = requestUrl.indexOf('/pages/')
						requestUrl = requestUrl.slice(index)
						uni.setStorageSync("backUrl", requestUrl)
					}
					try {
						console.log("backUrl:", requestUrl, encodeURIComponent(requestUrl))
						// #ifdef H5
						uni.navigateTo({
							url: '/publicPages/accountExec/accountExec'
						});
						// #endif
						// #ifdef MP-WEIXIN
						Vue.prototype.toAddPage()
						// wx.login({
						// 	success(res) {
						// 		if (res.code) {
						// 			//发起网络请求
						// 			Vue.prototype.wxLogin({
						// 				code: res.code
						// 			});
						// 		} else {
						// 			console.log('登录失败！' + res.errMsg)
						// 		}
						// 	}
						// })
						// #endif
					} catch (e) {
						console.error('请求失败', e)
						//TODO handle the exception
					}
				} else {
					// #ifdef H5
					uni.navigateTo({
						url: '/publicPages/accountExec/accountExec'
					})
					// #endif
				}
			}
		} else if (res.data.resultCode === '0000' && res.data.state === 'FAILURE') {
			// 没有访问权限
			uni.setStorageSync('isLogin', false)
			uni.showToast({
				title: res.data.resultMessage,
				icon: "none"
			})
		} else {
			uni.setStorageSync('stophttp', false)
		}
		return res
	},
	(err) => {
		uni.hideLoading()
		//发生网络错误后会走到这里
		if (err.status === 429) {
			// too many request
			uni.showToast({
				title: '当前使用人数过多，请稍后再试',
				icon: "none"
			})
		}
	}
)
export default fly
