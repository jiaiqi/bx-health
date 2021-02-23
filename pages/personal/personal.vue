<template>
	<personal v-if="!authBoxDisplay"></personal>
	<bx-auth v-else-if="authBoxDisplay" @getuserinfo="getuserinfo"></bx-auth>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({
			authSetting: 'authSetting',
			is_login: 'isLogin',
			wxUserInfo: 'wxUserInfo',
			login_user_info: 'loginUserInfo',
			client_env: 'env',
			authBoxDisplay: 'authBoxDisplay'
		})
	},
	methods: {
		async getuserinfo(e) {
			// #ifdef MP-WEIXIN
			const user = e.mp.detail;
			if (user && user.userInfo) {
				let rawData = {
					nickname: user.userInfo.nickName,
					sex: user.userInfo.gender,
					country: user.userInfo.country,
					province: user.userInfo.province,
					city: user.userInfo.city,
					headimgurl: user.userInfo.avatarUrl
				};
				this.setWxUserInfo(rawData);
				this.$store.commit('SET_WX_USERINFO', rawData);
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
				this.$store.commit('SET_AUTH_USERINFO', true);
				this.toAddPage();
			}
			// #endif
		}
	},
	async created() {
		let res = await wx.getSetting();
		if (!res.authSetting['scope.userInfo']) {
			this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: false });
			this.$store.commit('SET_AUTH_USERINFO', false);
			// 没有获取用户信息授权
			return;
		} else {
			// this.updateUserInfo();
		}
	},
	onLoad(option) {
		this.checkOptionParams(option);
		// this.toAddPage();
	}
};
</script>
