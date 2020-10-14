import Vue from 'vue'
import api from '@/common/api.js'
import flyio from '@/common/wx.js' // 引入flyio
let fly = new flyio
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
//添加请求拦截器
fly.interceptors.request.use((request) => {
	//给所有请求添加自定义header
	console.log("request: ", request)
	if (request.url.indexOf('srvfile_attachment_select') === -1&&request.url.indexOf('srvdaq_page_item_buttons_select') === -1) {
		uni.showLoading({
			mask: true
		})
	}
	// 如果是浏览器运行的记录 请求的页面path和参数
	if (uni.getStorageSync('client_env') === 'wxh5' || uni.getStorageSync('client_env') === 'web') {
		request.headers["requrl"] = window.location.pathname + window.location.search
		console.log("requrl", window.location.pathname + window.location.search, window.location)
	}
	const bxAuthTicket = uni.getStorageSync("bx_auth_ticket")
	// console.log('api.onTicket', api.onTicket, api.ticket, bxAuthTicket)
	if (api.onTicket) {
		request.headers["bx_auth_ticket"] = api.ticket
	} else {
		if (bxAuthTicket) {
			request.headers["bx_auth_ticket"] = bxAuthTicket
		}
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
		uni.hideLoading()
		//只将请求结果的data字段返回
		if (res.data.resultCode === "0011" || (res.request.headers.USERlOGIN && res.request.headers.USERlOGIN ===
				"noneLogin")) { //未登录
			uni.setStorageSync('isLogin', false)
			uni.setStorageSync('stophttp', true)
			// uni.setStorageSync('backUrl',window.location.pathname + window.location.search)
			// 后端返回 无效登录时，需要进行的跳转处理
			if (uni.getStorageSync("isLogin")) {
				// 登录状态记录 为 tree 时暂时不处理
				uni.showToast({
					title: "用户异常，请退出后，清理缓存重试"
				})
			} else {
				// 确认未登录时再进行自动跳转到登录页面
				if (res.request.headers.requrl) {
					console.log('请求失败::', res.request.headers.requrl)
					// uni.setStorageSync('backUrl',res.request.headers.requrl)
					let requestUrl = decodeURIComponent(res.request.headers.requrl)
					if (res.request.headers.requrl && res.request.headers.requrl !== '/' && res.request.headers.requrl.indexOf("code") ===
						-1) {
						//  过滤无效的url
						uni.setStorageSync("backUrl", requestUrl)
					}
					try {
						console.log("backUrl:", requestUrl, encodeURIComponent(requestUrl))
						uni.redirectTo({
							url: '/pages/accountExec/accountExec'
						})
					} catch (e) {
						console.error('请求失败', e)
						//TODO handle the exception
					}
				} else {
					uni.redirectTo({
						url: '/pages/accountExec/accountExec'
					})
				}
			}
		} else if (res.data.resultCode === '0000' && res.data.state === 'FAILURE') {
			// 没有访问权限
			uni.setStorageSync('isLogin', false)
			uni.showToast({
				title: data.resultMessage
			})
		} else {
			uni.setStorageSync('stophttp', false)
			// uni.removeStorageSync("backUrl")	
		}
		// return res.data
	},
	(err) => {
		if (err.status === 429) {
			// too many request
			uni.showToast({
				title: '当前使用人数过多，请稍后再试',
				icon: "none"
			})
		}
		//发生网络错误后会走到这里
		//return Promise.resolve("ssss")
	}
)
export default fly
