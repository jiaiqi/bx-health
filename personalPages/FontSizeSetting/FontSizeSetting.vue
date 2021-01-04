<template>
	<view
		class="font-setting"
		:style="{
			'--global-text-font-size': textSize ? textSize + 'px' : globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<view class="preview-box">
			<view class="preview-item">
				<view class="label">示例标题</view>
				<view class="text">健康是指一个人在身体、精神和社会等方面都处于良好的状态</view>
			</view>
			<view class="preview-item">
				<view class="label">示例标题</view>
				<view class="text">人体各器官系统发育良好、功能正常、体质健壮、精力充沛并具有良好劳动 健康食物 健康食物 效能的状态。通常用人体测量、体格检查和各种生理指标来衡量</view>
			</view>
		</view>
		<view class="setting-box">
			<!-- 	<view class="setting-item">
				<view class="label">粗细</view>
				<slider value="100" @change="sliderChange" min="100" max="900" step="100" show-value />
			</view> -->
			<!-- 			<view class="setting-item">
				<view class="label">标题字体大小</view>
				<view class="item">
					<text class="operate" :class="{ disabled: globalLabelFontSize - 2 < 12 }" @click="labelSizeChange(-2)">-</text>
					<slider class="slider" :value="globalLabelFontSize" @change="changeLabelFontSize" step="2" min="12" max="28" />
					<text class="operate" :class="{ disabled: globalLabelFontSize + 2 > 28 }" @click="labelSizeChange(2)">+</text>
				</view>
			</view> -->
			<view class="setting-item">
				<view class="label">正文字体大小</view>
				<view class="item">
					<text class="operate" :class="{ disabled: globalTextFontSize - 2 < 14 }" @click="textSizeChange(-2)">-</text>
					<!-- <text class="operate" :class="{ disabled: globalTextFontSize - 2 < 12 }" @click="textSizeChange(-2)">-</text> -->
					<slider class="slider" :value="textSize" @change="changeTextFontSize" step="2" min="14" max="18" />
					<text class="margin-right-xs text-gray">{{ fontSize || '' }}</text>
					<text class="operate" :class="{ disabled: globalTextFontSize + 2 > 18 }" @click="textSizeChange(2)">+</text>
					<!-- <text class="operate" :class="{ disabled: globalTextFontSize + 2 > 24 }" @click="textSizeChange(2)">+</text> -->
				</view>
			</view>
		</view>
		<view class="button-box"><button class="cu-btn bg-cyan" @click="saveSetting">保存设置</button></view>
	</view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data() {
		return {
			textSize: 0
		};
	},
	computed: {
		...mapState({
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize,
			userInfo: state => state.user.userInfo
		}),
		fontSize() {
			let textSize = this.textSize;
			if (textSize) {
				if (textSize === 14) {
					return '小';
				}
				if (textSize === 16) {
					return '中';
				}
				if (textSize === 18) {
					return '大';
				}
			}
		}
	},
	onLoad() {
		if (!this.textSize) {
			this.textSize = this.globalTextFontSize;
		}
	},
	methods: {
		saveSetting() {
			if (this.fontSize && this.userInfo && this.userInfo.no) {
				const url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
				const req = [
					{ serviceName: 'srvhealth_person_info_update', condition: [{ colName: 'no', ruleType: 'eq', value: this.userInfo.no }], data: [{ font_size: this.fontSize }] }
				];
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						this.$store.commit('SET_GLOBAL_TEXT_SIZE', this.textSize);
						uni.showModal({
							title: '提示',
							content: '保存成功，即将返回上一级页面',
							showCancel: false,
							success(res) {
								if (res.confirm) {
									uni.switchTab({
										url: '/pages/personal/personal'
									});
								}
							}
						});
					}
				});
			}
		},
		labelSizeChange(val) {
			if (this.globalLabelFontSize + val >= 12 && this.globalLabelFontSize + val <= 28) {
				this.changeLabelFontSize({ detail: { value: this.globalLabelFontSize + val } });
			}
		},
		textSizeChange(val) {
			if (!this.textSize) {
				this.textSize = this.globalTextFontSize;
			}
			let textSize = this.textSize;

			if (textSize + val >= 14 && textSize + val <= 18) {
				this.textSize = textSize + val;
				// if (this.globalTextFontSize + val >= 12 && this.globalTextFontSize + val <= 24) {
				// this.changeTextFontSize({ detail: { value:textSize + val } });
			}
		},
		changeLabelFontSize(e) {
			this.$store.commit('SET_GLOBAL_LABEL_SIZE', e.detail.value);
		},
		changeTextFontSize(e) {
			this.textSize = e.detail.value
			// this.$store.commit('SET_GLOBAL_TEXT_SIZE', e.detail.value);
			// this.$store.commit('SET_GLOBAL_LABEL_SIZE', e.detail.value);
		}
	}
};
</script>

<style lang="scss">
.font-setting {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	background-color: #fff;
}
.preview-box {
	padding: 20rpx;
	flex: 1;
	.preview-item {
		margin-bottom: 30rpx;
	}
	.label {
		// font-size: var(--global-label-font-size);
		font-size: var(--global-text-font-size);
		margin-bottom: 10rpx;
	}
	.text {
		letter-spacing: 0.1em;
		font-size: var(--global-text-font-size);
		color: #666;
	}
}
.setting-box {
	padding: 20rpx;
	.item {
		display: flex;
		align-items: center;
		.slider {
			flex: 1;
		}
		.operate {
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			display: inline-block;
			width: 50rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: 40rpx;
			transition: all 0.2s ease-in;
			&:active {
				transform: scale(1.12);
			}
			&.disabled {
				background-color: rgba($color: #f1f1f1, $alpha: 0.2);
				color: #ccc;
				pointer-events: none;
			}
		}
	}
}
.button-box {
	display: flex;
	padding: 20rpx 0 40rpx;
	justify-content: center;
	width: 100%;
	.cu-btn {
		width: 45%;
	}
}
</style>
