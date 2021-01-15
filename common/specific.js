import store from '@/store'
import api from '@/common/api.js'
import _http from '@/common/http.js'

export default {
	install(Vue, options) {
		Vue.prototype.checkSubscribeStatus = async (userInfo) => {
			// 检查是否关注过公众号
			if (!userInfo) {
				userInfo = store.state.user.userInfo
			}
			let url = Vue.prototype.getServiceUrl('wx', 'srvwx_app_user_select', 'select');
			let req = {
				"serviceName": "srvwx_app_user_select",
				"colNames": ["*"],
				// "condition": [{
				// 	"colName": "app_no",
				// 	"ruleType": "like",
				// 	"value": "APPNO20200107181133"
				// }, {
				// 	"colName": "unionid",
				// 	"ruleType": "like",
				// 	"value": userInfo.userno
				// }],
				"page": {
					"pageNo": 1,
					"rownumber": 5
				}
			}
			req.relation_condition = {
				"relation": "AND",
				"data": [{
						"colName": "app_no",
						"ruleType": "like",
						"value": "APPNO20200107181133"
					},
					{
						"relation": "OR",
						"data": [{
								"colName": "unionid",
								"value": userInfo.userno,
								"ruleType": "eq"
							},
							{
								"colName": "user_no",
								"value": userInfo.userno,
								"ruleType": "eq"
							},
						]
					}
				]
			}
			let res = await _http.post(url, req)
			let result = true
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0 && res.data.data[0].subscribe ===
				'关注') {
				result = true
			} else {
				result = false
			}
			store.commit('SET_SUBSCRIBE_STATUS', result)
			return result
		}
		Vue.prototype.saveSharerInfo = async (userInfo, share_url) => {
			// 分享前保存分享人信息
			if (!userInfo) {
				userInfo = store.state.user.userInfo
			}
			let pageInfo = Vue.prototype.getShareParams()
			if (pageInfo && pageInfo.add_url) {
				share_url = pageInfo.add_url
			}
			let url = Vue.prototype.getServiceUrl('health', 'srvhealth_share_record_add', 'operate');
			let req = [{
				"serviceName": "srvhealth_share_record_add",
				"condition": [],
				"data": [{
					"share_user_no": userInfo.userno,
					"share_person_no": userInfo.no,
					"share_url": share_url
				}],
			}]
			let res = await _http.post(url, req)
			if (res.data.state === 'SUCCESS') {
				return res.data
			} else {
				return false
			}
		}
		Vue.prototype.getPayParams = async () => {
			// 获取微信支付需要的参数（签名等）
			let url = Vue.prototype.getServiceUrl('wx', 'srvwx_app_pay_sign_select', 'select');
			let req = {
				"serviceName": "srvwx_app_pay_sign_select",
				"colNames": [
					"*"
				],
				"condition": [{
						"colName": "app_no",
						"ruleType": "eq",
						"value": api.appNo.wxmp
					},
					{
						"colName": "wx_mch_id",
						"ruleType": "eq",
						"value": "1485038452"
					}
				]
			}
			let res = await _http.post(url, req)
			if (res.data.state === 'SUCCESS') {
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					store.commit('SET_PAY_PARAMS', res.data.data[0])
					return res.data.data[0]
				}
			}
		}

		Vue.prototype.toPlaceOrder = async () => {
			// 下单
			let url = Vue.prototype.getServiceUrl('wx', 'srvwx_order', 'operate');
			let req = [{
				"serviceName": "srvwx_order",
				"data": [{
					"app_no": api.appNo.wxmp,
					"wx_mch_id": "1485038452",
					"out_trade_no": "20210115163311",
					"total_fee": 1,
					"spbill_create_ip": "192.168.0.21",
					"notify_url": "http://wx2.100xsys.cn/notifytest",
					"body": "test producet",
					"user_no": "jiaqi",
					"login_user_type": "内部用户"

				}]
			}]
			let res = await _http.post(url, req)
			debugger
			if (res.data.state === 'SUCCESS') {
				if (Array.isArray(res.data.response) && res.data.response.length > 0) {
					let info = res.data.response[0]
					if (info.response) {
						info = info.response
						debugger
						store.commit('SET_PREPAY_INFO'.info)
						return info
					}
				}
			}
		}
		Vue.prototype.onshareParams = (userInfo) => {
			let path = '';
			let title = '百想健康'
			if (userInfo && userInfo.no) {
				title = `${userInfo.name}邀请你体验【百想健康】小程序`
				let pageInfo = Vue.prototype.getShareParams()
				if (pageInfo && pageInfo.add_url) {
					path = `/${pageInfo.add_url}?from=share&invite_user_no=${userInfo.userno}`;
				}
			}
			return {
				title: title,
				path: path
			};
		}

		Vue.prototype.checkOptionParams = (option) => {
			// option中如果有邀请信息 则存储到vuex
			if (option.from === 'share' && option.invite_user_no) {
				let pageInfo = Vue.prototype.getShareParams()
				if (pageInfo && pageInfo.add_url) {
					store.commit('SET_INVITER_INFO', {
						add_url: pageInfo.add_url,
						invite_user_no: option.invite_user_no
					});
				}
			}
		}
		Vue.prototype.getShareParams = () => {
			let userInfo = ''
			try {
				userInfo = store.state.user.userInfo
			} catch (e) {
				//TODO handle the exception
			}
			if (userInfo) {
				let pageStack = getCurrentPages()
				if (Array.isArray(pageStack) && pageStack.length >= 1) {
					let currentPage = pageStack[pageStack.length - 1]
					store.commit('SET_CURRENT_PAGE', currentPage.route)
					// store.commit('SET_PAGE_INFO', currentPage)
					return {
						add_url: currentPage.route ? currentPage.route : '未知页面',
						invite_user_no: userInfo.no ? userInfo.no : '未知邀请人'
					}
				}
			}
		}

		Vue.prototype.getFoodsDetail = async (dietRecord) => {
			// 根据饮食记录得到食物编号查找食物详细数据
			if (Array.isArray(dietRecord) && dietRecord.length > 0) {
				let mixDietList = dietRecord.filter(item => item.diret_type === 'mixed_food');
				let basicDietList = dietRecord.filter(item => item.diret_type === 'diet_contents');
				let condition1 = [{
					colName: 'meal_no',
					ruleType: 'in',
					value: mixDietList.map(item => item.mixed_food_no).toString()
				}];
				let condition2 = [{
					colName: 'food_no',
					ruleType: 'in',
					value: basicDietList.map(item => item.diet_contents_no).toString()
				}];
				let mix = await Vue.prototype.getFoodType(condition1, 'srvhealth_mixed_food_nutrition_contents_select');
				let basic = await Vue.prototype.getFoodType(condition2);
				let foodType = [...mix, ...basic];
				return foodType;
			}
		}
		Vue.prototype.getFoodType = async (cond, serv) => {
			// 食物类型
			let serviceName = 'srvhealth_diet_contents_select';
			if (serv) {
				serviceName = serv;
			}
			let url = Vue.prototype.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				order: []
			};
			if (cond) {
				req.condition = cond;
			}
			let res = await Vue.prototype.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0 && !serv) {
				console.log(res.data.data);
			}
			return res.data.data ? res.data.data : [];
		}

		Vue.prototype.updateUserProfile = async (profile_url, user_no) => {
			// 更新用户微信头像
			const url = Vue.prototype.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			const req = [{
				serviceName: 'srvhealth_person_info_update',
				condition: [{
					colName: 'no',
					ruleType: 'eq',
					value: user_no
				}],
				data: [{
					profile_url: profile_url
				}]
			}];
			let res = await Vue.prototype.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showToast({
					title: '头像更新成功！'
				});
				return true
			}
		}

		Vue.prototype.getUserImage = (item) => {
			// 查找用户头像
			if (item) {
				if (item.user_image) {
					return Vue.prototype.getImagePath(item.user_image);
				} else if (item.profile_url) {
					return Vue.prototype.getImagePath(item.profile_url);
				}
			}
		}
	}
}
