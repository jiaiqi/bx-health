<script>
import Vue from 'vue';
// if (window.innerWidth > 750) {
//   window.innerWidth = 750;
// }
export default {
	onLaunch: function() {
		this.judgeClientEnviroment();
		uni.setStorageSync('isThirdParty', this.$api.isThirdParty);
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
	},
	onShow: function() {
		if (this.$api.singleApp) {
			uni.setStorageSync('activeApp', this.$api.appName);
		}
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="less">
@import 'colorui/main.css';
@import 'colorui/icon.css';
/*每个页面公共css */
#app,
uni-page-body,
uni-page-wrapper {
	background: #f1f1f1 !important;
}
html,
body {
	height: auto;
	background: #f1f1f1 !important;
}
uni-page-body > uni-view {
	height: 100%;
}
.cu-modal {
	text-align: left;
}
.cu-card.article > .cu-item .title {
	padding: 0;
}
.uni-input-placeholder,
.uni-textarea-placeholder {
	box-sizing: border-box;
	padding: 10upx;
}
.cu-form-group {
	background-color: #ffffff;
	padding: 1upx 30upx;
	display: flex;
	flex-direction: column;
	align-items: self-start;
	flex-grow: 1;
	min-height: 140upx;
	justify-content: space-between;
	.flex_row_c {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	> uni-view {
		width: 100%;
		box-sizing: border-box;
		display: block;
	}
	uni-input {
		line-height: 2.8em;
		height: 2.8em;
		min-height: 2.8em;
		overflow: hidden;
		margin: 0upx;
		width: 100%;
		padding: 0;
		.uni-input-input {
			flex: 1;
			font-size: 32upx;
			color: #555;
			box-sizing: border-box;
			padding: 10upx;
			text-indent: 0;
			background: transparent;
			border: 1rpx solid #d0d4d6;
			resize: none;
			border-radius: 4upx;
			outline: none; /*清除选中效果的默认蓝色边框 */
			-webkit-appearance: none; /*清除浏览器默认的样式 */
			line-height: normal; /*光标问题*/
		}
		.uni-input-input:focus,
		.uni-textarea-textarea:focus {
			border: 1upx solid #0055ff;
			color: #333333;
			// background-color: #e9eef0;
			border-bottom-left-radius: 1px;
			border-bottom-right-radius: 1px;
		}
		&.valid_error {
			.uni-input-input {
				border: 1rpx solid #ff0000;
			}
		}
		&.date-input {
			.uni-input-wrapper {
				.uni-input-input {
					padding-right: 60upx !important;
				}
			}
		}
	}
	.title.valid_error {
		color: #ff0000;
	}
	radio.radio[checked]::after,
	radio.radio .uni-radio-input-checked::after {
		content: '';
		background-color: transparent;
		display: block;
		position: absolute;
		width: 8px;
		height: 8px;
		z-index: -99 !important;
		top: 0upx;
		left: 0upx;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 200upx;
		/* #ifndef MP */
		border: 7px solid #ffffff !important;
		/* #endif */

		/* #ifdef MP */
		border: 8px solid #ffffff !important;
		/* #endif */
	}

	uni-textarea {
		margin: 0;
		.uni-textarea-textarea {
			flex: 1;
			font-size: 32upx;
			color: #555;
			box-sizing: border-box;
			padding: 10upx;
			text-indent: 0;
			background: transparent;
			border: 1rpx solid #d0d4d6;
			resize: none;
			border-radius: 4upx;
			outline: none; /*清除选中效果的默认蓝色边框 */
			-webkit-appearance: none; /*清除浏览器默认的样式 */
			line-height: normal; /*光标问题*/
		}
		&.valid_error {
			.uni-textarea-textarea {
				border: 1rpx solid #ff0000;
			}
		}
		.uni-input-input:focus,
		.uni-textarea-textarea:focus {
			border: 1upx solid #0055ff;
			color: #333333;
			// background-color: #e9eef0;
			border-bottom-left-radius: 1px;
			border-bottom-right-radius: 1px;
		}
	}
}
/* #ifdef H5 */
.uni-checkbox-input-checked {
	background-color: #007aff !important;
}
/* #endif */

radio.radio[checked]::after,
radio.radio .uni-radio-input-checked::after {
	content: '';
	position: absolute;
	width: 8px;
	height: 8px;
	z-index: 999;
	top: 0upx;
	left: 0upx;
	right: 0;
	bottom: 0;
	border-radius: 200upx;
	/* #ifdef MP */
	border: 8px solid #ffffff !important;
	/* #endif */
}
</style>
