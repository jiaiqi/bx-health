<template>
	<view class="login">
		<view class="t-login">
			<view class="t-a">
				<text class="cuIcon-people image"></text>
				<input name="account" placeholder="请输入账号" v-model="user.user_no" />
			</view>
			<view class="t-a">
				<text class="cuIcon-attention image"></text>
				<input name="pwd" placeholder="请输入密码" v-model="user.pwd" />
			</view>
			<!-- #ifdef H5 -->
			<button type="primary" class="cu-btn bg-green flex round" @click="accountLogin">立即登录</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary" class="cu-btn bg-green flex round" @getuserinfo="accountLogin" open-type="getUserInfo" lang="zh_CN">立即登录</button>
			<!-- #endif -->
			<view class="wx-login">
				<view class="button-box">
					<view class="back-btn" @click="navBack"><text class="cuIcon-back"></text></view>
					<view class="text">返回</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="button-box">
					<button class="wxlogin-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="userLogin" shape="circle"><text class="cuIcon-weixin"></text></button>
					<view class="text">微信登录</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				user_no: '',
				pwd: ''
			}
		};
	},
	onLoad() {},
	methods: {
		async accountLogin(e) {
			let that = this;
			let url = that.getServiceUrl('sso', 'srvuser_login', 'operate');
			let req = [
				{
					serviceName: 'srvuser_login',
					data: [that.user]
				}
			];
			if (that.isInvalid(that.user.user_no) && that.isInvalid(this.user.pwd)) {
				// #ifdef MP-WEIXIN
				console.log(e);
				let userInfo = e.detail.userInfo;
				if (!userInfo) {
					uni.showToast({
						title: '取消授权',
						icon: 'none'
					});
					return;
				}
				// #endif
				let response = await that.$http.post(url, req);
				if (response.data.state === 'SUCCESS' && response.data.response[0].response) {
					let res = response.data.response[0].response;
					let expire_timestamp = parseInt(new Date().getTime() / 1000) + res.expire_time; //过期时间的时间戳(秒)
					uni.setStorageSync('bx_auth_ticket', res.bx_auth_ticket);
					uni.setStorageSync('expire_time', res.expire_time); // 有效时间
					uni.setStorageSync('expire_timestamp', expire_timestamp); // 过期时间
					if (res.login_user_info.user_no) {
						uni.setStorageSync('login_user_info', res.login_user_info);
						console.log('res.login_user_info', res.login_user_info);
					}
					if (res.login_user_info.data) {
						uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
					}
					uni.setStorageSync('isLogin', true);
					// #ifdef MP-WEIXIN
					let rawData = {
						nickname: userInfo.nickName,
						sex: userInfo.gender,
						country: userInfo.country,
						province: userInfo.province,
						city: userInfo.city,
						headimgurl: userInfo.avatarUrl
					};
					this.setWxUserInfo(rawData);
					uni.setStorageSync('wxUserInfo', rawData);
					// #endif
					thia.navBack()
				} else {
					uni.showToast({
						title: response.data.resultMessage,
						duration: 2000
					});
				}
			} else {
				this.user.pwd = '';
				uni.showToast({
					icon: 'none',
					title: '账号或密码输入有误,请检查后重新输入',
					duration: 3000
				});
			}
		},
		userLogin(e) {
			let userInfo = e.detail.userInfo;
			if (!userInfo) {
				uni.showToast({
					title: '取消授权',
					icon: 'none'
				});
				return;
			}
			this.wxLogin(userInfo);
		},
		async getWxCode() {
			const result = await wx.login();
			if (result.code) {
				// this.code = result.code;
				return result.code;
			}
		},
		async wxLogin(user) {
			// 使用code向后端发送登录请求
			let that = this;
			let userInfo = await uni.getUserInfo({
				provider: 'weixin'
			});
			if (Array.isArray(userInfo) && userInfo[1] && userInfo[1].userInfo) {
				user = userInfo[1];
			}
			let code = await this.getWxCode();
			let url = this.$api.verifyLogin.url;
			let req = [
				{
					data: [
						{
							code: code,
							app_no: this.$api.appNo.wxmp
						}
					],
					serviceName: this.$api.verifyLogin.serviceName
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.resultCode === 'SUCCESS') {
				// 登录成功
				let resData = res.data.response[0].response;
				if (resData.login_user_info.user_no) {
					uni.setStorageSync('login_user_info', resData.login_user_info);
				}
				uni.setStorageSync('bx_auth_ticket', resData.bx_auth_ticket);
				// 保存用户微信信息
				let rawData = {
					nickname: user.userInfo.nickName,
					sex: user.userInfo.gender,
					country: user.userInfo.country,
					province: user.userInfo.province,
					city: user.userInfo.city,
					headimgurl: user.userInfo.avatarUrl
				};
				this.setWxUserInfo(rawData);
				uni.setStorageSync('wxUserInfo', rawData);
				if (resData.login_user_info.data) {
					uni.setStorageSync('visiter_user_info', resData.login_user_info.data[0]);
				}
				uni.setStorageSync('isLogin', true);
				this.$store.commit('SET_LOGIN_STATE',true)
				return {
					status: 'success',
					response: resData
				};
			} else {
				// 登录失败，显示提示信息
				uni.showToast({
					title: res.data.resultMessage
				});
				return false;
			}
		},
		navBack() {
			const that = this
			let backUrl = uni.getStorageSync('backUrl');
			if (backUrl && backUrl !== '/') {
				backUrl = that.getDecodeUrl(backUrl);
				if (backUrl && backUrl.lastIndexOf('backUrl=') !== -1) {
					backUrl = backUrl.substring(backUrl.lastIndexOf('backUrl=') + 8, backUrl.length);
				}
				uni.redirectTo({
					url: backUrl,
					fail() {
						uni.switchTab({
							url: backUrl
						});
					}
				});
			} else {
				uni.redirectTo({
					url: that.$api.homePath,
					fail() {
						uni.reLaunch({
							url: that.$api.homePath
						});
					}
				});
			}
			// uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
@import './login.scss';
.login {
	display: flex;
	flex-direction: column;
	padding: 100rpx;
	.bg-green {
		background-color: #1aad19;
		color: #fff;
	}
	.logo {
		width: 230rpx;
		height: 230rpx;
		margin: 50rpx auto;
		border-radius: 50%;
	}
	.txt1 {
		margin-bottom: 10rpx;
		.name {
			font-weight: bold;
			margin-right: 20rpx;
		}
	}
	.txt2 {
		color: #999;
		margin-bottom: 50rpx;
	}
	.back-btn {
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 50rpx;
		color: #a2a2a2;
		background-color: #fff;
		border-radius: 50%;
		// margin: 100rpx auto;
		&:active {
			background-color: #f8f8f8;
			transition: all 0.2s;
		}
	}

	.wx-login {
		display: flex;
		justify-content: center;
		margin-top: 100rpx;
		.button-box {
			&:nth-child(2) {
				margin-left: 50rpx;
			}
		}
		.wxlogin-btn {
			border-radius: 100%;
			width: 100rpx;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 50rpx;
			text-align: center;
			overflow: hidden;
			padding: 0;
			color: #fff;
			background-color: #1aad19;
			&:active {
				background-color: #f8f8f8;
				transition: all 0.2s;
			}
		}
		.text {
			text-align: center;
			margin-top: 10rpx;
		}
	}
}
</style>
