import Vue from 'vue'
import api from '@/common/api.js'
import request from '@/common/utils/request.js'
import store from '@/store/index.js'

const fly = request({
	timeout: 20 * 1000
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
	let ignoreUrlList = [
		// "srvsys_service_columnex_v2_select",
		// "srvfile_attachment_select",
		// "srvdaq_page_item_buttons_select",
		// "srvdaq_record_reply_select",
		// "srvhealth_diet_record_select",
		// "srvhealth_diet_contents_select",
		// "srvhealth_mixed_food_nutrition_contents_select",
		// "srvhealth_nutrient_values_recommended_select",
		// "srvhealth_body_activity_record_select",
		// "srvhealth_sleep_record_select",
		// "srvhealth_person_relation_select",
		"srvhealth_consultation_chat_record_update",
		"srvhealth_consultation_chat_record_select"
		// "srvwx_app_user_select" //检测是否关注公众号
	]
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
		if (Vue.prototype.$store && Vue.prototype.$store.getters && Vue.prototype.$store.getters.isLogin ===
			false) {
			// request.cancel = true
			// #ifdef H5
			uni.navigateTo({
				url: '/publicPages/accountExec/accountExec'
			});
			request.cancel = true
			// #endif
			// #ifdef MP-WEIXIN
			let option = wx.getLaunchOptionsSync()
			if (option && option.scene !== 1154) {
			}
			// #endif
		}
	}
	if (request.url && ignoreServiceName(request.url)) {
		if (store.state.app.xhrNum === 0 && new Date().getTime() - store.state.app.xhrTimestamp > 1000) {
			uni.showLoading({
				// mask: true,
				title: '加载中...'
			})
		}
	}
	store.commit('SET_XHR_NUM', store.state.app.xhrNum + 1)
	console.log(store.state.app.xhrNum)
	// 如果是浏览器运行的记录 请求的页面path和参数
	if (uni.getStorageSync('client_env') === 'wxh5' || uni.getStorageSync('client_env') === 'web') {
		request.headers["requrl"] = window.location.pathname + window.location.search
	}
	let bxAuthTicket = uni.getStorageSync("bx_auth_ticket")
	// if (store.state.app.bx_auth_ticket) {
	// 	bxAuthTicket = store.state.app.bx_auth_ticket
	// }
	if (api.onTicket) {
		request.headers["bx_auth_ticket"] = api.ticket
	} else {
		if (bxAuthTicket && request.url.indexOf('srvwx_app_login_verify') === -1) {
			request.headers["bx_auth_ticket"] = bxAuthTicket
		} else if (request.headers["bx_auth_ticket"]) {
			delete request.headers["bx_auth_ticket"]
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
	async (res) => {
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
				// if (uni.getStorageSync("isLogin")) {
				// 	// 登录状态记录 为 true 时暂时不处理
				// 	uni.showToast({
				// 		title: "用户异常，请退出后，清理缓存重试"
				// 	})
				// } else {
				// 确认未登录时再进行自动跳转到登录页面
				let requestUrl = decodeURIComponent(res.request.headers.requrl)
        console.log('(res.request.headers:',res.request.headers);
        savePreviousPage()
				if (requestUrl) {
					console.log('请求失败::', requestUrl)
					if (requestUrl && requestUrl !== '/' && requestUrl.indexOf("code") ===
						-1 && requestUrl.indexOf('/accountExec/accountExec') === -1) {
						//  过滤无效的url
						let index = requestUrl.indexOf('/pages/')
						requestUrl = requestUrl.slice(index)
            console.log('requestUrl1:',requestUrl);
            if(requestUrl?.includes('bx_auth_ticket')){
              requestUrl = removeQueryParamManual(requestUrl, 'bx_auth_ticket')
            }
            console.log('requestUrl2:',requestUrl);
						uni.setStorageSync("backUrl", requestUrl)
					}
					try {
						console.log("backUrl:", requestUrl, encodeURIComponent(requestUrl))
						// #ifdef H5
						uni.navigateTo({
							url: '/publicPages/accountExec/accountExec'
						});
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
				// }
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
// 记录路由地址
const savePreviousPage = () => {
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curRoute = routes[routes.length - 1].route //获取当前页面路由
	let curParam = routes[routes.length - 1].options; //获取路由参数
	// 拼接参数
	let param = ''
	for (let key in curParam) {
    if(key !== 'bx_auth_ticket'){
      if (!param) {
      	param += key + '=' + curParam[key]
      } else {
      	param += '&' + key + '=' + curParam[key]
      }
    }
	}	
	if (curRoute === 'pages/login/login') return
	if (param) {
		uni.setStorageSync('redirect_page', '/' + curRoute + '?' + param)
	} else {
		uni.setStorageSync('redirect_page', '/' + curRoute)
	}
}

export function removeQueryParamManual(url, paramToRemove) {
  // 解析基础 URL 和查询字符串
  const urlParts = url.split('?');
  let baseUrl = urlParts[0];
  let queryString = urlParts[1] || '';

  // 如果没有查询字符串，则直接返回原始 URL
  if (!queryString) return url;

  // 将查询字符串分割成键值对数组
  const paramsArray = queryString.split('&').filter(pair => {
    const [key] = pair.split('=');
    return key !== paramToRemove;
  });

  // 重构查询字符串
  const newQueryString = paramsArray.length > 0 ? '?' + paramsArray.join('&') : '';

  // 返回修改后的完整 URL
  return baseUrl + newQueryString;
}

export default fly
