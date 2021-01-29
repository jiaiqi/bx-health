import {
	getItem,
	setItem
} from '../utils.js'

let env = ''
// #ifdef MP-WEIXIN
env = 'wxmp'
// #endif
// #ifdef H5
env = 'h5'
// #endif

const state = {
	env: env,
	homePath:'',//默认主页
	globalTextFontSize: 16,
	globalLabelFontSize: 16,
	srvCol: [], // 组件共享的srv_col
	isLogin: getItem('isLogin') ? getItem('isLogin') : false, //登录状态
	bx_auth_ticket: getItem('bx_auth_ticket') ? getItem('bx_auth_ticket') : "", //登录token
	backUrl: "", //当前页面的上一级页面
	authSetting: {}, //微信授权信息
	authUserInfo: getItem('authUserInfo') ? getItem('authUserInfo') : {}, //微信授权信息
	authBoxDisplay: getItem('authBoxDisplay') ? getItem('authBoxDisplay') : '',
	sickItem: "",
	symptomArr: [],
	doctorInfo: {},
	hospitalInfo: {},
	storeList: [], //当前账号所在单位机构的列表
	dietRecord: getItem('dietRecord') ? getItem('dietRecord') : [],
	pageInfo: getItem('pageInfo') ? getItem('pageInfo') : {},
	currentPage: '',
	inviterInfo: getItem('inviterInfo') ? getItem('inviterInfo') : {}, //邀请人
	areRegistering: false, //是否正在注册
	payParams: {}, //支付相关参数
	prePayInfo: {}, //预支付信息
	subscsribeStatus: false, //是否关注公众号
	shareType: '', //分享页面的类型 seeDoctor-邀请就诊登记 bindOrganization-邀请成为诊所用户
	xhrNum: 0, //正在发送的请求的数量
	xhrTimestamp: 0,
	previousPageUrl:"",
}
let persistData = {}; //持久化数据
const mutations = {
	SET_HOME_PATH:(state,path)=>{
		state.homePath = path
	}
	SET_XHR_NUM: (state, num) => {
		state.xhrNum = num
		state.xhrTimestamp = new Date().getTime()
	},
	SET_TICKET: (state, ticket) => {
		state.bx_auth_ticket = ticket
		setItem('bx_auth_ticket', state.bx_auth_ticket)
	},
	SET_GLOBAL_TEXT_SIZE: (state, size) => {
		state.globalTextFontSize = size
	},
	SET_GLOBAL_LABEL_SIZE: (state, size) => {
		state.globalLabelFontSize = size
	},
	setSrvCol: (state, data) => {
		state.srvCol.push(data)
		setItem('srvCol', state.srvCol)
	},
	delSrvCol: (state, data) => {
		let fils = state.srvCol.filter(item => item.service_name !== data)
		state.srvCol = fils
	},
	SET_AUTH_SETTING: (state, data) => {
		if (data.type) {
			state.authSetting[data.type] = data.value
			// setItem('authSetting', state.authSetting)
			if (data.value === true) {
				state.authBoxDisplay = false // 不显示授权组件
			} else if (data.value === false) {
				state.authBoxDisplay = true //显示授权组件
			}
		}
	},
	SET_REGIST_STATUS: (state, status) => {
		state.areRegistering = status
	},
	SET_CURRENT_PAGE: (state, url) => {
		state.currentPage = url
	},
	SET_AUTH_USERINFO: (state, isAuth) => {
		state.authUserInfo = isAuth
		state.authBoxDisplay = !isAuth
		setItem('authUserInfo', state.authUserInfo)
	},
	SET_LOGIN_STATE: (state, loginState) => {
		state.isLogin = loginState
		setItem('isLogin', loginState)
	},
	SET_BACK_URL: (state, url) => {
		state.backUrl = url
		setItem('backUrl', url)
	},
	SET_SICK_ITEM: (state, sick) => {
		state.sickItem = sick
	},
	SET_SYMPTOM_ARR: (state, symptom) => {
		state.symptomArr = symptom
	},
	SET_DOCTOR_INFO: (state, info) => {
		state.doctorInfo = info
		// setItem('doctorInfo', info)
	},
	SET_HOSPITAL_INFO: (state, info) => {
		state.hospitalInfo = info
		// setItem('doctorInfo', info)
	},
	SET_STORE_LIST: (state, list) => {
		state.storeList = list
		// setItem('doctorInfo', info)
	},
	SET_DIET_RECORD: (state, record) => {
		state.dietRecord = record
		// setItem('dietRecord', record)
	},
	SET_PAGE_INFO: (state, pageInfo) => {
		state.pageInfo = pageInfo
		// setItem('pageInfo', pageInfo)
	},
	SET_INVITER_INFO: (state, inviterInfo) => {
		state.inviterInfo = inviterInfo
		setItem('inviterInfo', inviterInfo)
	},
	SET_PAY_PARAMS: (state, payParams) => {
		state.payParams = payParams
		setItem('payParams', payParams)
	},
	SET_PREPAY_INFO: (state, prePayInfo) => {
		state.prePayInfo = prePayInfo
		setItem('prePayInfo', prePayInfo)
	},
	SET_SUBSCRIBE_STATUS: (state, subscsribeStatus) => {
		state.subscsribeStatus = subscsribeStatus
		setItem('subscsribeStatus', subscsribeStatus)
	},
	SET_SHARE_TYPE: (state, shareType) => {
		state.shareType = shareType
	},
	SET_PRE_PAGE_URL:(state,previousPageUrl)=>{
		state.previousPageUrl= previousPageUrl
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
	},
	setGlobalTextSize: ({
		commit
	}, fontSize) => {
		commit('SET_GLOBAL_TEXT_SIZE', fontSize)
	},
	setGloballabelSize: ({
		commit
	}, fontSize) => {
		commit('SET_GLOBAL_LABEL_SIZE', fontSize)
	},
}

export default {
	// namespaced: true, //开启命名空间 dispatch/commit要加`app/前缀`
	state,
	mutations,
	actions
}
