<template>
	<view class="authorization">
		<view class="container">
			<!-- <view class="container" v-if="isBindUser || client_env === 'web' || client_env === 'app'"> -->
			<view class="right-top-sign"></view>
			<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
			<view class="wrapper">
				<!-- <view class="left-top-sign">LOGIN</view> -->
				<view class="welcome">
					<!-- #ifdef H5 -->
					欢迎回来！
					<!-- #endif -->
					<!-- <text v-if="(client_env === 'wxh5' || client_env === 'wxmp') && !isShowUserLogin">请授权微信登录</text> -->
				</view>
				<view class="input-content" v-if="client_env === 'web' || client_env === 'app' || isShowUserLogin">
					<view class="input-item">
						<text class="tit">帐号</text>
						<input type="text" v-model="user.user_no" placeholder="请输入帐号" maxlength="50" data-key="mobile" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input
							type="mobile"
							v-model="user.pwd"
							placeholder="请输入密码"
							placeholder-class="input-empty"
							maxlength="50"
							password
							data-key="password"
							@input="inputChange"
							@confirm="userLogined"
						/>
					</view>
				</view>
				<button
					v-if="(client_env === 'web' || client_env === 'app' || client_env === 'wxh5') && isShowUserLogin"
					class="confirm-btn bg-gradual-green text-green"
					@click="userLogined"
				>
					{{ isBindUser ? '提交绑定' : '登录' }}
				</button>
				<button v-if="(client_env === 'web' || client_env === 'app' || client_env === 'wxh5') && isShowUserLogin" class="confirm-btn bg-gradual-orange text-green" @click="toBack">
					暂不，继续使用
				</button>
				<!-- 		<view class="wx-login" v-if="(client_env === 'wxh5' || client_env === 'wxmp') && !isShowUserLogin">
					<view class="tips">个人信息保护指引</view>
					<button class="confirm-btn" type="primary" lang="zh_CN" open-type="getUserInfo" @getuserinfo="saveWxUser" :withCredentials="false" :disabled="disabled">
						同意并授权访问用户信息
					</button>
				</view> -->
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="cu-modal show">
			<view class="cu-dialog">
				<view class="auth-explain">
					<view class="title">隐私保护说明</view>
					<view class="content">1. 我们会遵循用户协议与隐私政策手机、使用信息，但不会仅因同意本隐私政策而采取强制捆绑的方式收集信息。</view>
					<view class="content">2. 为保障服务所必须，我们需要访问您的微信昵称、性别等基本信息。</view>
					<view class="content">3. 为了记录您的活动与体能训练记录，我们需要访问您的微信运动数据。</view>
					<view class="tip">
						您可以查看完整版
						<text class="text-cyan" @click="toArticle('CT2021012816330102')">用户协议</text>
						和
						<text class="text-cyan" @click="toArticle('CT2021012816470103')">隐私政策</text>
					</view>
					<view class="button-box">
						<button type="primary" class="cu-btn bg-cyan" lang="zh_CN" open-type="getUserInfo" @getuserinfo="saveWxUser" :withCredentials="false">同意(授权微信用户信息)</button>
						<!-- <button class="cu-btn bg-white text-grey" @click="disagree">不同意</button> -->
						<navigator class="cu-btn bg-grey" open-type="exit" target="miniProgram" @click="disagree">不同意(退出小程序)</navigator>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	// 账号授权页面
	name: 'AccountExec',
	computed: {
		...mapState({
			previousPageUrl: state => state.app.previousPageUrl
		})
	},
	data() {
		return {
			code: '',
			disabled: !this.isWeixinClient(),
			backUrl: '',
			user: {
				user_no: '',
				pwd: ''
			},
			isShowUserLogin: true,
			client_env: uni.getStorageSync('client_env'),
			isThirdParty: uni.getStorageSync('isThirdParty'), // 是否需要第三方认证
			isBindUser: false
		};
	},
	onShow() {
		// #ifdef H5
		if (navigator.userAgent.indexOf('iPhone') !== -1) {
			let linkUrl = window.location + '';
			uni.setStorageSync('linkUrl', linkUrl);
		}
		// #endif
	},
	onLoad(option) {
		this.judgeClientEnviroment();
		let self = this;
		// #ifdef MP-WEIXIN
		this.getWxCode();
		// #endif
		if (uni.getStorageSync('isLogin')) {
			console.log('已登录，不进行初始化授权', uni.getStorageSync('isLogin'));
			// #ifdef H5
			if (uni.getStorageSync('backUrl') && uni.getStorageSync('backUrl') !== '/') {
				if (uni.getStorageSync('backUrl').indexOf('/pages/') !== -1) {
					uni.switchTab({
						url: uni.getStorageSync('backUrl')
					});
				} else {
					uni.redirectTo({
						url: uni.getStorageSync('backUrl')
					});
				}
			} else {
				if (self.$api.homePath === '/pages/pedia/pedia') {
					uni.switchTab({
						url: self.$api.homePath
					});
				} else {
					if (self.$api.homePath.indexOf('/pages/') !== -1) {
						uni.switchTab({
							url: self.$api.homePath
						});
					} else {
						uni.redirectTo({
							url: self.$api.homePath,
							fail(err) {
								uni.showModal({
									title: '提示',
									content: err.errMsg,
									showCancel: false
								});
							}
						});
					}
				}
			}
			// #endif
		} else {
			console.log('未登录，进行初始化授权', uni.getStorageSync('isLogin'));
			// #ifdef H5
			this.initLogin();
			// #endif
		}
		// #ifdef H5
		if (navigator.userAgent.indexOf('iPhone') !== -1) {
			let linkUrl = window.location + '';
			uni.setStorageSync('linkUrl', linkUrl);
		}
		// #endif
	},
	methods: {
		toArticle(no) {
			uni.navigateTo({
				url: `/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=${no}`
			});
		},
		disagree() {
			uni.showToast({
				title: '您需要同意用户协议和隐私政策才能继续使用百想健康小程序',
				icon: 'none'
			});
		},
		toBack() {
			if (uni.getStorageSync('isLogin')) {
				if (uni.getStorageSync('backUrl')) {
					if (uni.getStorageSync('backUrl').indexOf('/pages/') !== -1) {
						uni.switchTab({
							url: uni.getStorageSync('backUrl')
						});
					} else {
						uni.redirectTo({
							url: uni.getStorageSync('backUrl')
						});
					}
				} else {
					if (this.$api.homePath.indexOf('/pages/') !== -1) {
						uni.switchTab({
							url: self.$api.homePath
						});
					} else {
						uni.redirectTo({
							url: this.$api.homePath
						});
					}
				}
			} else {
				this.initLogin();
			}
		},
		navBack() {
			uni.navigateBack({
				animationDuration: 200
			});
		},
		inputChange(e) {
			// console.log(e)
		},
		initLogin() {
			let that = this;
			let code = null;
			// 公众号环境
			// #ifdef H5
			code = this.$route.query.code;
			// #endif
			console.log('code:', code);
			let isLogin = uni.getStorageSync('isLogin');
			console.log('是否绑定账号:', isLogin);
			let isWeixinClient = this.isWeixinClient();
			const client_env = uni.getStorageSync('client_env');
			console.log('是否微信环境', isWeixinClient);
			if (!isLogin) {
				if (isWeixinClient) {
					//微信环境(小程序或者公众号)
					if (code || client_env === 'wxmp') {
						// 已经得到code,进行验证登录
						console.log('已获取到code,即将进行验证登录');
						this.saveWxUser();
					} else if (!code) {
						//公众号 未授权 -> 获取授权
						console.log('未发现code,尝试获取重定向链接');
						that.getAuthorized();
					}
				} else if (!isWeixinClient) {
					// 非微信环境(H5或APP)
					uni.showToast({
						title: '请在微信中访问此页面',
						icon: 'none',
						duration: 3000
					});
				}
			} else {
				let url = uni.getStorageSync('backUrl');
				console.log('that.backUrl', that.backUrl, '===', url);
				if (url) {
					url = that.getDecodeUrl(url);
					if (url && url.lastIndexOf('backUrl=') !== -1) {
						url = url.substring(url.lastIndexOf('backUrl=') + 8, url.length);
					}
					if (url.indexOf('/pages/') !== -1) {
						uni.switchTab({
							url: url
						});
					} else {
						uni.reLaunch({
							url: url
						});
					}
				} else {
					if (that.$api.homePath.indexOf('/pages/') !== -1) {
						uni.switchTab({
							url: that.$api.homePath
						});
					} else {
						uni.reLaunch({
							url: that.$api.homePath
						});
					}
				}
			}
		},
		async getAuthorized() {
			let self = this;
			// 公众号环境获取回调地址(在回调地址中获取code)
			let url = self.getServiceUrl('wx', 'srvwx_public_page_authorization', 'operate');
			let req = [
				{
					data: [
						{
							app_no: self.$api.appNo.wxh5,
							redirect_uri: self.$api.frontEndAddress
						}
					],
					serviceName: 'srvwx_public_page_authorization'
				}
			];
			let burl = uni.getStorageSync('backUrl');
			this.$http.post(url, req).then(response => {
				if (response.data.response[0].response.authUrl) {
					window.location.href = response.data.response[0].response.authUrl;
				} else {
					uni.showToast({
						title: response.data.resultMessage,
						icon: 'none'
					});
				}
			});
		},
		async getWxCode() {
			const result = await wx.login();
			if (result.code) {
				this.code = result.code;
			}
		},

		async saveWxUser(e) {
			// 静默登录(验证登录)
			const self = this;
			const isWeixinClient = this.isWeixinClient();
			// self.getUserInfo();
			if (isWeixinClient) {
				const url = this.getServiceUrl('wx', 'srvwx_app_login_verify', 'operate');
				// #ifdef MP-WEIXIN
				const user = e.mp.detail;
				const result = await self.wxVerifyLogin();
				if (result) {
					// 登录成功，返回上一页面
					uni.$emit('loginStatusChange', true);
					self.$store.commit('SET_LOGIN_STATE', true);
					if (this.$store.state.app.shareType === 'seeDoctor') {
						this.toAddPage();
						return;
					}
					let num = getCurrentPages();
					if (Array.isArray(num) && num.length === 1) {
						if (self.previousPageUrl && self.previousPageUrl.indexOf('/accountExec') == -1) {
							//
							uni.reLaunch({
								url: self.previousPageUrl,
								fail() {
									uni.switchTab({
										url: self.previousPageUrl,
										fail(e) {
											uni.showModal({
												title: '提示',
												content: e
											});
										}
									});
								}
							});
						} else {
							if (self.$api.homePath.indexOf('/pages/') !== -1) {
								uni.switchTab({
									url: self.$api.homePath
								});
							} else {
								uni.redirectTo({
									url: self.$api.homePath
								});
							}
						}
					} else {
						if (self.previousPageUrl && self.previousPageUrl.indexOf('/account') == -1) {
							//
							uni.redirectTo({
								url: self.previousPageUrl
							});
						} else {
							uni.navigateBack({
								animationDuration: 500,
								fail: function(err) {
									if (err.errMsg && err.errMsg.indexOf('cannot navigate back at first page') !== -1) {
										// 当前页面在页面栈中为第一页
										if (self.$api.homePath.indexOf('/pages/') !== -1) {
											uni.switchTab({
												url: self.$api.homePath
											});
										} else {
											uni.redirectTo({
												url: self.$api.homePath
											});
										}
									}
								}
							});
						}
					}
				}
				// #endif
				// #ifdef H5
				// 公众号环境
				let req = [
					{
						data: [
							{
								code: that.$route.query.code,
								app_no: that.$api.appNo.wxh5
							}
						],
						serviceName: 'srvwx_app_login_verify'
					}
				];
				that.$http.post(url, req).then(response => {
					if (response.data.resultCode === 'SUCCESS' && response.data.response[0].response) {
						console.log('授权成功', response);
						let resData = response.data.response[0].response;
						let loginMsg = {
							bx_auth_ticket: resData.bx_auth_ticket,
							expire_time: resData.expire_time
						};
						uni.setStorageSync('isLogin', true);
						console.log('登录成功', uni.getStorageSync('isLogin'), resData);
						let expire_timestamp = parseInt(new Date().getTime() / 1000) + loginMsg.expire_time; //过期时间的时间戳(秒)
						uni.setStorageSync('expire_time', resData.expire_time); // 有效时间
						uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
						uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间

						if (resData.login_user_info && resData.login_user_info.user_no) {
							uni.setStorageSync('login_user_info', resData.login_user_info);
							console.log('resData.login_user_info', resData.login_user_info);
						}
						if (resData.login_user_info && resData.login_user_info.data) {
							uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
						}
						// 获取回调前记录的url 并再回调后 再次进入该url，没有该url时 进入 home
						let url = uni.getStorageSync('backUrl');
						console.log('that.backUrl', that.backUrl, '===', url);
						uni.hideToast();
						uni.hideLoading();
						if (url && url !== '/') {
							url = that.getDecodeUrl(url);
							// alert("2::" + url + uni.getStorageSync('bx_auth_ticket'))
							if (url && url.lastIndexOf('backUrl=') !== -1) {
								url = url.substring(url.lastIndexOf('backUrl=') + 8, url.length);
								// console.log("授权成功，准备返回用户界面url",url)
							}
							uni.reLaunch({
								url: url
							});
						} else {
							uni.reLaunch({
								url: that.$api.homePath
							});
						}
						// uni.showModal({
						//     title: '提示',
						//     content: '是否继续绑定已有百想系统帐号？',
						// 	cancelText: "不用了",
						// 	confirmText: "是",
						//     success: function (res) {
						//         if (res.confirm) {
						//             that.isBindUser = true
						//         } else if (res.cancel) {
						//             console.log('用户点击取消');
						// 			if (url) {
						// 				url = that.getDecodeUrl(url)
						// 				// alert("2::" + url + uni.getStorageSync('bx_auth_ticket'))
						// 				if(url && url.lastIndexOf("backUrl=") !== -1){
						// 					url = url.substring(url.lastIndexOf("backUrl=")+8,url.length)
						// 					console.log("授权成功，准备返回用户界面url",url)
						// 				}
						// 				uni.reLaunch({
						// 					url:url
						// 				})
						// 			} else {
						// 				uni.reLaunch({
						// 					url:that.$api.homePath
						// 				})
						// 			}
						//         }
						//     }
						// });
					} else {
						uni.setStorageSync('isLogin', false);
						console.log('授权失败');
					}
				});

				// #endif
			}
		},
		getUserInfo: function(loginType, cb) {
			let self = this;
			wx.login({
				success: function() {
					wx.getUserInfo({
						success: function(res) {
							self.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
							self.$store.commit('SET_AUTH_USERINFO', true);
							uni.setStorageSync('wxuserinfo', res.userInfo);
							let rawData = {
								nickname: res.userInfo.nickName,
								sex: res.userInfo.gender,
								country: res.userInfo.country,
								province: res.userInfo.province,
								city: res.userInfo.city,
								headimgurl: res.userInfo.avatarUrl
							};
							uni.setStorageSync('wxUserInfo', rawData);
							self.$store.commit('SET_WX_USERINFO', rawData);
							rawData = JSON.stringify(rawData);
							self.setWxUserInfo(rawData);
							console.log(res);
						},
						fail: function() {
							//3.授权友好提示
							wx.showModal({
								title: '提示',
								content: '您还未授权登陆，部分功能将不能使用，是否重新授权？',
								showCancel: true,
								cancelText: '不用了',
								confirmText: '是',
								success: function(res) {
									//4.确认授权调用wx.openSetting
									if (res.confirm) {
										if (wx.openSetting) {
											//当前微信的版本 ，是否支持openSetting
											wx.openSetting({
												success: res => {
													if (res.authSetting['scope.userInfo']) {
														//如果用户重新同意了授权登录
														wx.getUserInfo({
															success: function(res) {
																uni.setStorageSync('wxuserinfo', res.userInfo);
																console.log(res);
																let rawData = {
																	nickname: res.userInfo.nickName,
																	sex: res.userInfo.gender === 0 ? '男' : '女',
																	country: res.userInfo.country,
																	province: res.userInfo.province,
																	city: res.userInfo.city,
																	headimgurl: res.userInfo.avatarUrl
																};
																rawData = JSON.stringify(rawData);
																self.setWxUserInfo(rawData);
															}
														});
													} else {
														//用户还是拒绝
														console.log(res);
													}
												},
												fail: function() {
													//调用失败，授权登录不成功
												}
											});
										} else {
											console.log(res);
										}
									} else {
										console.log(res);
									}
								}
							});
						}
					});
				}
			});
		},
		judgeClientEnviroment() {
			let client_env = '';
			// #ifdef H5
			const isWeixin = this.isWeixinClient();
			console.log('isWeixin', isWeixin);
			client_env = isWeixin ? 'wxh5' : 'web';
			if (client_env === 'web') {
				this.isShowUserLogin = true;
			}
			// #endif
			// #ifdef MP-WEIXIN
			client_env = 'wxmp';
			this.isShowUserLogin = false;
			//#endif
			// #ifdef APP-PLUS
			client_env = 'app';
			this.isShowUserLogin = true;
			// #endif
			let client_type = '';
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					console.log('运行Android上');
					client_type = 'android';
					break;
				case 'ios':
					console.log('运行iOS上');
					client_type = 'ios';
					break;
				default:
					client_type = 'web';
			}
			this.client_type = client_type;
			this.client_env = client_env;
			uni.setStorageSync('client_env', client_env);
			uni.setStorageSync('client_type', client_type);
			this.client_env = client_env;
			return {
				client_env: client_env,
				client_type: client_type
			};
		},
		async userLogined(e) {
			console.log('srvuser_login', e);
			let that = this;
			let url = that.getServiceUrl('sso', 'srvuser_login', 'operate');
			let req = [
				{
					serviceName: 'srvuser_login',
					data: [that.user]
				}
			];
			if (that.isBindUser) {
				url = that.$api.bindWxUser;
				req = [
					{
						serviceName: 'srvwx_user_bind',
						data: [that.user]
					}
				];
			}
			if (that.isInvalid(that.user.user_no) && that.isInvalid(this.user.pwd)) {
				let response = await that.$http.post(url, req);
				console.log('srvuser_login', response);
				if (response.data.state === 'SUCCESS' && response.data.response[0].response) {
					let res = response.data.response[0].response;
					let expire_timestamp = parseInt(new Date().getTime() / 1000) + res.expire_time; //过期时间的时间戳(秒)
					uni.setStorageSync('bx_auth_ticket', res.bx_auth_ticket);
					uni.setStorageSync('expire_time', res.expire_time); // 有效时间
					uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间
					if (res&& res.login_user_info.user_no) {
						uni.setStorageSync('login_user_info', res.login_user_info);
						console.log('res.login_user_info', res.login_user_info);
						that.$store.commit('SET_LOGIN_USER', res.login_user_info);
					}
					if (res.login_user_info.data) {
						uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
					}
					uni.setStorageSync('isLogin', true);
					that.$store.commit('SET_LOGIN_STATE', true);
					console.log('that.backUrl', that.backUrl);

					console.log('userLogined', response.data);
					let backUrl = uni.getStorageSync('backUrl');
					if (backUrl && backUrl !== '/') {
						backUrl = that.getDecodeUrl(backUrl);
						if (backUrl && backUrl.lastIndexOf('backUrl=') !== -1) {
							backUrl = backUrl.substring(backUrl.lastIndexOf('backUrl=') + 8, backUrl.length);
						}
						if (backUrl.indexOf('/pages/') !== -1) {
							uni.switchTab({
								url: backUrl
							});
						} else {
							uni.redirectTo({
								url: backUrl,
								fail() {
									uni.navigateBack({
										animationType: 'zoom-fade-in'
									});
								}
							});
						}
					} else {
						if (that.$api.homePath.indexOf('/pages/') !== -1) {
							uni.switchTab({
								url: that.$api.homePath
							});
						} else {
							uni.reLaunch({
								url: that.$api.homePath
							});
						}
					}
				} else {
					uni.showToast({
						title: response.data.resultMessage,
						duration: 2000
					});
				}
			} else {
				this.user.pwd = '';
				uni.showToast({
					title: '帐号或密码错误',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="scss">
.authorization {
	width: 100%;
	height: 100%;
	background-color: #fff;
	.images {
		width: 100%;
		margin: 50upx 0;
	}
	.text {
		width: 90%;
		display: block;
		text-align: center;
		padding: 20upx 5%;
	}
}
</style>
<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 115px;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
	text-align: center;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	/* padding-top: var(--status-bar-height); */
	top: 40upx;
	font-size: 40upx;
	/* color: $font-color-dark; */
}
.left-top-sign {
	font-size: 120upx;
	/* color: $page-color-base; */
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: #f8f6fc;
	height: 120upx;
	text-align: left;
	border-radius: 4px;
	margin-bottom: 50upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
	}
	input {
		height: 60upx;
		width: 100%;
	}
}
.wx-login {
	margin-top: 70upx;
	.tips {
		text-align: center;
		color: #999;
	}
	.confirm-btn {
		margin-top: 30rpx;
	}
}
.confirm-btn {
	min-width: 300px;
	display: inline-block;
	border-radius: 10px;
	margin: 30px auto 0;
	padding: 0;
	text-align: center;
	background-color: #02d199;
	/* background: $uni-color-primary; */
	color: #fff;
	/* font-size: $font-lg; */
}
.auth-explain {
	padding: 30rpx;
	background-color: #fff;
	.title {
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}
	.content {
		text-align: left;
		margin-bottom: 10px;
	}
	.tip {
		font-size: 14px;
		margin: 40px 0 20px;
	}
	.button-box {
		height: 100px;
		.cu-btn {
			width: 75%;
			border-radius: 5px;
		}
	}
}
</style>
