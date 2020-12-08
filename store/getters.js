const getters = {
	isLogin:state=>state.app.isLogin,
	srvCol: state => state.app.srvCol,
	userInfo: state => state.user.userInfo,
	userList: state => state.user.userList,
	wxUserInfo: state => state.user.wxUserInfo,
	loginUserInfo: state => state.user.loginUserInfo,
	authSetting:state=>state.app.authSetting,
	env:state=>state.app.env,
	authBoxDisplay:state=>state.app.authBoxDisplay
}
export default getters
