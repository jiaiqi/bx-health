// 把所有api的url统一在一起并挂在到vue对象上
// 所有接口都在一个文件里会比较大
let remoteAddress = {
	ssourl: 'http://www.100xsys.cn', // 微信登陆sso 端口
	ssoAddress: 'http://sso.100xsys.cn',
	// serviceAddress: 'https://192.168.0.155:8106', // http://login.100xsys.cn 接口地址srvms.100xsys.cn
	serviceAddress: 'https://srvms.100xsys.cn', // http://login.100xsys.cn 接口地址srvms.100xsys.cn
	// serviceAddress: 'http://192.168.0.121:8101', // http://login.100xsys.cn 接口地址srvms.100xsys.cn
	// serviceAddress: 'https://srvms.100xsys.cn', // http://login.100xsys.cn 接口地址srvms.100xsys.cn
	frontEndAddress: 'https://wx2.100xsys.cn',
	singleApp: true, // 是否单应用， true 时 所有请求均使用 appName 配置
	appName: "health", //singleApp 为 true 时 必须配置
	bx_auth_ticket: "e2cc16a3-6a87-42da-ae5f-99a6af84c5f8",
	onTicket: false, // 是否使用配置的静态 bx_auth_ticket
	// homePath:"/pages/public/homePage/homePage?website_no=WS2020031216030001",
	isThirdParty: true, // 是否必须第三方认证登录
	thirdPartyType: ['WeChat'], // 第三方类型
	// homePath:"/pages/home/home", // 首页路径， 配置完整路径
	homePath: "/pages/pedia/pedia", // 首页路径，配置完整路径
}
let ENV = {
	backEndAddress: "https://login.100xsys.cn", //后台管理系统地址
	frontEndAddress: remoteAddress.frontEndAddress, //前端线上地址
	appNo: {
		wxmp: 'APPNO20210420103005', // 百想健康
		// wxmp: 'APPNO20201124160702', // 百想首页
		// wxmp: 'APPNO20200214122021', // 百想软件ai平台
		// wxmp: 'APPNO20200731153421' //生活能力评估

		wxh5: 'APPNO20200107181133', //微信公众号
	},
	appID: {
		// wxmp: 'wx8e6f993081f6e979', // 百想软件ai平台
		wxmp: 'wxa8574a1e93d8e8d0', // 百想健康
		// wxmp: 'wxa3c50c8177ef6739', // 百想首页
		wxh5: 'wx78d1d4139f97ffca', //百想助理公众号
		// wxmp: "wx08876efb5760ca75" //生活能力评估
	},
	isThirdParty: remoteAddress.isThirdParty,
	homePath: remoteAddress.homePath, // 应用业务的入口页面 首页。
	singleApp: remoteAddress.singleApp, // 是否单应用
	appName: remoteAddress.appName, // 服务 app
	getAuthorization: { //获取公众号授权
		url: remoteAddress.serviceAddress + '/wx/operate/srvwx_public_page_authorization',
		serviceName: 'srvwx_public_page_authorization'
	},
	verifyLogin: { //公众号/小程序验证登录
		url: remoteAddress.serviceAddress + '/wx/operate/srvwx_app_login_verify',
		serviceName: 'srvwx_app_login_verify'
	},
	accountLogin: { //公众号/小程序账号登录
		url: remoteAddress.serviceAddress + '/wx/operate/srvwx_app_login',
		serviceName: 'srvwx_app_login'
	},
	getSignature: remoteAddress.serviceAddress + '/wx/select/srvwx_app_signature_select', //获取js-sdk签名
	getUserInfo: remoteAddress.serviceAddress + '/wx/select/srvwx_basic_user_info_select', //获取用户信息
	saveShareRecord: remoteAddress.serviceAddress + '/daq/add/srvdaq_record_share_add', //保存微信分享记录
	downloadFile: remoteAddress.serviceAddress + '/file/download?fileNo=', // 根据fileNo直接下载图片，不用查找filePath

	/**
	 * 新旧api 分割线—————————————————————————————————————————————————————————— old 
	 * */
	backUrl: remoteAddress.ssourl, // 授权域名
	serverURL: remoteAddress.serviceAddress, // 后台地址
	refuseCode: '0111', // 后台拒绝识别码
	byCode: '1111', // 后台通过码
	byState: 'SUCCESS', // 状态码
	srvHost: remoteAddress.serviceAddress,
	bindLogin: 'bind_login', // 授权成功,请登录绑定账号
	authorizedLoginSuccess: 'authorized_login_success', // 授权成功,可以直接请求业务数据
	ssoAuthor: remoteAddress.serviceAddress + '/wx/operate/', // sso授权地址
	savewxuser: remoteAddress.ssoAddress + '/wx/savewxuser', // sso保存微信用户

	getOpendId: remoteAddress.ssoAddress + '/wx/getOpendId', // sso保存微信用户 /wx/getOpendId
	// 测试地址
	testssoAuthor: remoteAddress.testUrl + '/wx/authorize', // sso授权地址
	testsavewxuser: remoteAddress.testUrl + '/wx/savewxuser', // sso保存微信用户
	testgetOpendId: remoteAddress.testUrl + '/wx/getOpendId', // sso保存微信用户 /wx/getOpendId
	testgetSignature: remoteAddress.testUrl + '/wx/getSignature', // sso保存微信用户 /wx/getSignature ,
	untied: remoteAddress.ssoAddress + '/wx/untied', // 微信解绑 http://Ip:port/wx/untied
	loginAuthor: remoteAddress.ssoAddress + '/bindlogin', // 微信绑定登录地址http://Ip:port/bindlogin
	getImg: remoteAddress.assetsUrl + '/main/', // 图片地址
	downloadImg: remoteAddress.serviceAddress + '/download?filePath=', // 图片地址
	getFilePath: remoteAddress.serviceAddress + '/file/download?filePath=', // 文件路径地址
	select: remoteAddress.serviceAddress + '/bxsys/select', // 查询接口
	toLogin: remoteAddress.ssoAddress + '/bxsyslogin', // 用户相关接口
	selectByUser: remoteAddress.serviceAddress + '/bxsys/srvms.100xsys.cn', // 用户菜单
	selectOne: remoteAddress.serviceAddress + '/bxsys/selectOne', // 产品相关接口
	startProc: remoteAddress.serviceAddress + '/bxsys/startProc', // 流程开启
	approval: remoteAddress.serviceAddress + '/bxsys/approval', // 流程开启
	startDataProc: remoteAddress.serviceAddress + '/bxsys/startDataProc', // 流程子开启
	add: remoteAddress.serviceAddress + '/bxsys/operate', // 新增
	update: remoteAddress.serviceAddress + '/bxsys/operate', // 修改
	delete: remoteAddress.serviceAddress + '/bxsys/operate', // 删除
	saveDraft: remoteAddress.serviceAddress + '/bxsys/saveDraft', // 保存草稿
	upload: remoteAddress.serviceAddress + '/file/upload',
	file: remoteAddress.serviceAddress + '/file/',
	deleteFile: remoteAddress.serviceAddress + '/file/delete', // 删除文件
	onTicket: remoteAddress.onTicket,
	ticket: remoteAddress.bx_auth_ticket,
	bindWxUser: remoteAddress.serviceAddress + "/wx/operate/srvwx_user_bind" // 绑定已有帐号
}
export default ENV
