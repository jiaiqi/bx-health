import Vue from 'vue'
const $fetch = Vue.prototype.$fetch
import dayjs from '@/static/js/dayjs.min.js'
/**
 * @description  查找在线客服对应会话信息
 * @param {string} storeNo 店铺编码
 * @param {string} personNo 人员编码
 */
const getKefuSession = async (storeNo, personNo) => {
	let req = {
		"serviceName": "srvhealth_dialogue_session_select",
		"colNames": ["*"],
		"condition": [{
			"colName": "session_type",
			"ruleType": "in",
			"value": "机构用户客服"
		}, {
			"colName": "store_no",
			"ruleType": "like",
			"value": storeNo
		}, {
			"colName": "store_person_no",
			"ruleType": "like",
			"value": personNo
		}],
		"page": {
			"pageNo": 1,
			"rownumber": 1
		}
	}
	let res = await $fetch('select', 'srvhealth_dialogue_session_select', req, 'health')
	if (res.success && res.data.length > 0) {
		return res.data[0]
	}
}

/**
 * @description 查找当前登录用户在店铺中的用户信息
 * @param {string} storeNo  店铺编码
 * @param {string} personNo  人员编码
 */
const getStoreUser = async (storeNo, personNo) => {
	let req = {
		serviceName: 'srvhealth_store_user_select',
		condition: [{
			colName: 'person_no',
			ruleType: 'eq',
			value: personNo
		}, {
			colName: 'store_no',
			ruleType: 'eq',
			value: storeNo
		}]
	};
	let res = await $fetch('select', 'srvhealth_store_user_select', req, 'health')
	if (Array.isArray(res.data) && res.data.length > 0) {
		return res.data.data[0];
	}
}

/**
 * @description  根据店铺编码查找店铺关联群组列表
 * @param {string} storeNo 店铺编码
 */
const getGroupList = async (storeNo) => {
	let req = {
		condition: [{
			colName: 'store_no',
			ruleType: 'eq',
			value: storeNo
		}]
	};
	let res = await $fetch('select', 'srvhealth_group_circle_select', req, 'health')
	if (res.success) {
		return res.data
	}
}

/**
 * @description  查找用户在店铺关联群组中的信息
 * @param {string} personNo 用户编码
 * @param {string} storeNo 店铺编码
 */
const getGroupListUser = async (storeNo, personNo) => {
	let groupList = await getGroupList(storeNo)
	if (Array.isArray(groupList) && groupList.length > 0) {
		let groupNoList = groupList.map(item => item.gc_no)
		let req = {
			"condition": [{
				"colName": "gc_no",
				"ruleType": "in",
				"value": groupNoList.toString(),
			}, {
				"colName": "person_no",
				"value": personNo,
				"ruleType": "eq"
			}]
		}
		let res = await $fetch('select', 'srvhealth_person_group_circle_select', req, 'health')
		if (res.success) {
			groupList.forEach(item => {
				let userInfo = res.data.find(data => data.gc_no === item.gc_no)
				item.unreadNum = 0
				if (userInfo) {
					item.userInfo = userInfo
					item.latest_sign_in_time = userInfo.latest_sign_in_time
				}
			})
		}
		return groupList
	}
}

/**
 * @description 查找店铺用户列表
 * @param {string} storeNo 店铺编码 
 * @param {array} condition 其他条件  
 */
const getUserList = async (storeNo,condition) => {
	let req = {
		page: {
			rownumber: 99999
		},
		"condition": [{
			"colName": "store_no",
			"ruleType": "eq",
			"value": storeNo
		}],
	}
	if(condition){
		req.condition = [...req.condition,...condition]
	}
	let res = await $fetch('select', 'srvhealth_store_user_select', req, 'health')
	if (res.success && res.data.length > 0) {
		return res.data
	}
}

/**
 * @description  查找可预约疫苗列表
 */
const getVaccineList = async () => {
	let req = {
		"page": {
			"pageNo": 1,
			"rownumber": 100
		},
	}
	let res = await $fetch('select', 'srvhealth_store_vaccine_stocks_select', req, 'health')
	if (res.success) {
		return res.data
	}
}
// const getVaccineList = async () => {
// 	let req = {
// 		"condition": [{
// 			"colName": "app_date",
// 			"ruleType": "ge",
// 			"value": dayjs().format('YYYY-MM-DD')
// 		}],
// 		"page": {
// 			"pageNo": 1,
// 			"rownumber": 20
// 		},
// 	}
// 	let res = await $fetch('select', 'srvhealth_store_vaccination_appointment_select', req, 'health')
// 	if (res.success) {
// 		let data = res.data.reduce((pre, cur) => {
// 			if (!pre[cur.appoint_name]||!pre[cur.appoint_name].data||!Array.isArray(pre[cur.appoint_name].data)) {
// 				pre[cur.appoint_name] = {
// 					label:cur.appoint_name,
// 					desc:cur.app_desc,
// 					data:[cur]
// 				}
// 			} else {
// 				pre[cur.appoint_name].data.push(cur)
// 			}
// 			return pre
// 		}, {})
// 		return data
// 	}
// }

export {
	getKefuSession,
	getGroupListUser,
	getUserList,
	getVaccineList
}
