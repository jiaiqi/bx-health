<template>
	<view class="info-wrap">
		<view class="info">
			<view class="info-item">
				<view class="form-item">
					<label class="form-item-label">
						<text class="text-red is-required">*</text>
						<text class="label">出生日期</text>
					</label>
					<view class="form-item-content_value picker">
						<picker class="uni-picker" :mode="pickerMode" :value="info.birthday" @change="bindTimeChange">
							<view class="picker-content">
								<view class="place-holder" v-if="!info.birthday">请选择</view>
								<view class="value" v-else>{{ info.birthday }}</view>
								<text class="cuIcon-calendar"></text>
							</view>
						</picker>
					</view>
				</view>
				<view class="form-item">
					<label class="form-item-label">
						<text class="text-red is-required">*</text>
						<text class="label">性别</text>
					</label>
					<view class="form-item-content_value picker">
						<bx-radio-group class="form-item-content_value radio-group" mode="button" v-model="info.sex" @change="radioChange">
							<bx-radio class="radio" color="#2979ff" v-for="item in sexOption" :key="item" :name="item">{{ item }}</bx-radio>
						</bx-radio-group>
					</view>
				</view>

				<view class="form-item">
					<label class="form-item-label">
						<text class="text-red is-required">*</text>
						<text class="label">体重</text>
					</label>
					<view class="form-item-content_value slider">
						<input class="form-item-content_value" type="digit" placeholder="请输入体重" max="400" min="0" v-model.number="info.weight" />
					</view>
				</view>
			</view>
		</view>
		<view class="info-bot">
			<uni-view class="button-box">
				<view @click="submitData" class="cancel">提交</view>
				<view @click="cancel" class="cancel">取消</view>
			</uni-view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'myFoodsInfo',
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	data() {
		return {
			info: {
				birthday: '',
				sex: '',
				weight: ''
			},
			pickerMode: 'date',
			radio: '男',
			dateIsShow: false,
			sexOption: ['男', '女']
		};
	},
	created() {
		if (this.userInfo) {
			if (this.userInfo.sex) {
				this.info.sex = this.userInfo.sex;
			}
			if (this.userInfo.weigth) {
				this.info.weigth = this.userInfo.weigth;
			}
			if (this.userInfo.birthday) {
				this.info.birthday = this.userInfo.birthday;
			}
		}
	},
	methods: {
		numberChange(type) {
			let step = 0.5;
			if (type === 'add') {
				if (this.fieldData.value + step <= this.fieldData.max) {
					this.fieldData.value = this.fieldData.value + step;
				}
			} else if (type === 'minus') {
				if (this.fieldData.value - step >= this.fieldData.min) {
					this.fieldData.value = this.fieldData.value - step;
				}
			}
		},
		bindTimeChange(e) {
			this.info.birthday = e.detail.value;
			console.log('出生日期', e);
		},
		radioChange(e) {
			console.log('性别', e);
		},
		DateChange(e) {
			this.info.birthday = e.detail.value;
		},
		RadioChange(e) {
			this.radio = e.detail.value;
			this.info.sex = e.detail.value;
		},
		onConfirm(e) {
			this.info.birthday = e.result;
		},
		cancel() {
			uni.redirectTo({
				url:this.$store.state.app.previousPageUrl,
				fail() {
					uni.navigateBack({
						delta: 1
					});
				}
			})
		},
		async submitData() {
			if (!this.info.birthday || !this.info.weight || !this.info.sex) {
				uni.showToast({
					title: '请完善信息',
					icon: 'none'
				});
				return;
			}
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_person_info_update',
					colNames: ['*'],
					condition: [
						{
							colName: 'id',
							ruleType: 'eq',
							value: uni.getStorageSync('current_user_info').id
						}
					],
					data: [
						{
							birthday: this.info.birthday,
							weight: this.info.weight,
							sex: this.info.sex
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				});
				let user = uni.getStorageSync('current_user_info');
				user.birthday = this.info.birthday;
				user.weight = this.info.weight;
				user.sex = this.info.sex;
				uni.setStorageSync('current_user_info', user);
				uni.setStorageSync('cur_user_no', user.no);
				this.$store.commit('SET_USERINFO', user);
				setTimeout(() => {
					this.cancel()
				}, 1000);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.button-box {
	width: 100%;
	display: flex;
	justify-content: space-around;
	display: flex;
	.cancel {
		width: 45%;
		background-color: #007aff;
		color: #ffffff;
		text-align: center;
		padding: 8rpx 10rpx;
		border-radius: 8rpx;
	}
}
.form-item {
	display: flex;
	flex-wrap: wrap;
	min-height: 100rpx;
	align-items: center;
	// background-color: #fff;
	padding: 10rpx;
	position: relative;
	&.form-detail {
		min-height: 80rpx;
		align-items: center;
	}
	.valid_msg {
		width: 100%;
		color: #f76260;
		text-indent: 220rpx;
		font-size: 32rpx;
	}
	&::after {
		position: absolute;
		box-sizing: border-box;
		content: ' ';
		pointer-events: none;
		right: 16px;
		bottom: 0;
		left: 16px;
		border-bottom: 1px solid #ebedf0;
		transform: scaleY(0.5);
	}
	.form-item-label {
		display: flex;
		min-width: 200rpx;
		padding: 20rpx 10rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: #666;
		font-size: 32rpx;
		white-space: normal;
		line-height: 1.8;
		&.form-detail {
			padding: 0 10rpx;
		}
		&.label-top {
			width: 100%;
			padding: 20rpx 10rpx 0;
		}
		.is-required {
			display: inline-flex;
			align-items: center;
			width: 20rpx;
		}
	}
	.form-item-content_value.checkbox-group {
		margin-top: 50rpx;
	}
	.form-item-content {
		flex: 1;
		display: flex;
		flex-wrap: nowrap;
		padding: 20rpx 0;
		padding-left: 20rpx;
		color: #000;
		font-size: var(--global-text-font-size);
		&.form-detail {
			padding: 0;
		}
		&.valid_error {
			border: 1rpx dashed #f37b1d;
			margin-bottom: 10rpx;
		}
		.form-item-content_detail {
			&.image {
				width: 100rpx;
				height: 100rpx;
			}
		}
		// .form-item-content_value {
		// 	line-height: 1.4em;
		// 	min-height: 1.4em;
		// 	position: relative;
		// 	height: 100%;
		// 	font: inherit;
		// 	display: flex;
		// 	flex: 1;
		// 	&.slider {
		// 		display: flex;
		// 		height: 80rpx;
		// 		align-items: center;
		// 		.operate {
		// 			display: inline-block;
		// 			padding: 5rpx 20rpx;
		// 			background-color: #f1f1f1;
		// 			position: relative;
		// 			font-size: 40rpx;
		// 			&.active {
		// 				transition: all 0.2s;
		// 				transform: scale(1.2);
		// 			}
		// 			&::before {
		// 				content: '';
		// 				width: 130%;
		// 				height: 130%;
		// 				top: -15%;
		// 				left: -15%;
		// 				position: absolute;
		// 			}
		// 		}
		// 		.uni-slider {
		// 			flex: 1;
		// 		}
		// 	}
		// 	&.picker {
		// 		.uni-picker {
		// 			width: 100%;
		// 			.picker-content {
		// 				width: 100%;
		// 				display: flex;
		// 				justify-content: space-between;
		// 			}
		// 		}
		// 		.value {
		// 			width: 400rpx;
		// 			text-overflow: ellipsis;
		// 			overflow: hidden;
		// 			white-space: nowrap;
		// 		}
		// 		&:active {
		// 			background-color: #f1f1f1;
		// 			transition: all 0.5s ease-out;
		// 		}
		// 	}
		// 	.place-holder {
		// 		color: grey;
		// 		overflow: hidden;
		// 		text-overflow: clip;
		// 		word-break: keep-all;
		// 		pointer-events: none;
		// 		padding: 0 10rpx;
		// 	}
		// 	.value {
		// 		padding: 0 10rpx;
		// 	}
		// }
	}
	.icon-area {
		display: inline-flex;
		align-content: center;
		text-align: left;
		margin-right: 20rpx;
		padding: 20rpx 0;
		font-size: 40rpx;
	}
	.tree-selector {
		height: calc(90vh - var(--window-top) - var(--window-bottom));
		display: flex;
		flex-direction: column;
		.content {
			flex: 1;
			background-color: #fff;
			.bx-radio-group {
				margin: 0 20rpx;
			}
			.button-mode {
				margin-bottom: 10rpx;
			}
		}
	}
}
.form-item-label {
	display: flex;
	min-width: 100px;
	padding: 10px 5px;
	text-overflow: ellipsis;
	// white-space: nowrap;
	overflow: hidden;
	color: #666;
	font-size: 32rpx;
	white-space: normal;
	line-height: 1.8;
}
.info-wrap {
	height: 100vh;
	background-color: #fff;
	.info {
		min-height: 70vh;
		.info-item {
			padding: 30rpx;
			.info-item-top {
				margin-bottom: 10rpx;
				font-weight: 700;
				font-size: 30rpx;
			}
			.info-item-bot {
				border: 1px solid #ccc;
				padding: 10rpx;
			}
		}
	}
	.info-bot {
		display: flex;
		justify-content: space-around;
		margin-top: 100rpx;
		text {
			padding: 0 30rpx;
			height: 64rpx;
			background-color: #0081ff;
			color: #fff;
			line-height: 64rpx;
		}
	}
	.info-item-bot-radio {
		/deep/ uni-radio::before,
		uni-checkbox::before {
			right: 90rpx;
		}
		/deep/ .uni-radio-wrapper {
			margin-right: 50rpx;
		}
	}
}
.form-item-content_value {
	line-height: 1.4em;
	min-height: 1.4em;
	position: relative;
	height: 100%;
	font: inherit;
	display: flex;
	flex: 1;
	font-size: 32rpx;
	&.slider {
		display: flex;
		height: 80rpx;
		align-items: center;
		.operate {
			display: inline-block;
			padding: 5rpx 20rpx;
			background-color: #f1f1f1;
			position: relative;
			font-size: 40rpx;
			&.active {
				transition: all 0.2s;
				transform: scale(1.2);
			}
			&::before {
				content: '';
				width: 130%;
				height: 130%;
				top: -15%;
				left: -15%;
				position: absolute;
			}
		}
		.uni-slider {
			flex: 1;
		}
	}
	&.picker {
		.uni-picker {
			width: 100%;
			.picker-content {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
		.value {
			width: 400rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		&:active {
			background-color: #f1f1f1;
			transition: all 0.5s ease-out;
		}
	}
	.place-holder {
		color: grey;
		overflow: hidden;
		text-overflow: clip;
		word-break: keep-all;
		pointer-events: none;
		padding: 0 10rpx;
	}
	.value {
		padding: 0 10rpx;
	}
}
</style>
