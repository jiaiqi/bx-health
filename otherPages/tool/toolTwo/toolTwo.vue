<template>
	<view class="wrap">
		<view class="cu-form-group ">
			<view class="title">体重(公斤)</view>
			<input placeholder="请输入你的体重" v-model="info.weight" @blur="change()" />
		</view>
		<view class="cu-form-group ">
			<view class="title">身高(cm)</view>
			<input placeholder="请输入你的身高" v-model="info.age" @blur="change()" />
		</view>
		<view class="cu-form-group ">
			<view class="title">年龄</view>
			<input placeholder="请输入你的年龄" v-model="info.newAge" @blur="change()" />
		</view>
		<view class="cu-form-group">
			<view class="title">性别</view>
			<input placeholder="请选择你的性别" @click="show = true" v-model="info.sex" />
		</view>
		<!-- <u-select v-model="show" :list="merchantList" @confirm="confirmMerchant"></u-select> -->
		<view class="contents">
			<view class="" v-if="BMI">
				<view class="titlec">你的BMI为：</view>
				<view class="number">{{ BMI ? BMI : 0 }}</view>
				<view class="nubox">
					<view class="ele-item">
						<view class="ele-item-wrap">
							<view class="padding bg-white probar">
								<view class="cu-progress radius pro-rad">
									<view :num="18.5" class="bg-grey low" :style="[{ width: '33%' }]"></view>
									<view class="bg-olive regular" :style="[{ width: '33%' }]"></view>
									<view :num="24" class="bg-red risk" :style="[{ width: '33%' }]"></view>
									<view
										:class="{
											'min-low': BMI < 18.5,
											'loa-st': BMI <= 24 && BMI >= 18.5,
											'max-risk': BMI > 24
										}"
										class="tootio-item-wrap"
									>
										<view class="tootio-item">{{ healthStyle }}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="tipText">温馨提示：您的{{ healthText }}，请注意合理饮食</view>
					</view>
				</view>
			</view>
			<view class="" v-if="metabolism">
				<view class="titlec twotitle">你的基础代谢热量为：</view>
				<view class="nubox">
					<view class="number">{{ metabolism ? metabolism : 0 }}</view>
					<text style="">千卡</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			merchantList: [
				{
					value: '1',
					label: '男'
				},
				{
					value: '2',
					label: '女'
				}
			],
			info: {
				weight: null,
				age: null,
				sex: null,
				newAge: null
			},
			mask: false,
			radioList: [
				{
					name: '男',
					disabled: false
				},
				{
					name: '女',
					disabled: false
				}
			],
			radio: '',
			healthText: '',
			healthStyle: '',
			BMI: 0,
			show: false,
			metabolism: ''
		};
	},
	watch: {
		BMI: {
			handler: function(newdata, olddata) {
				if (newdata < 18.5) {
					this.healthStyle = '过低';
					this.healthText = '体重过轻';
				} else if (18.5 < newdata && newdata < 24) {
					this.healthStyle = '正常';
					this.healthText = '体重正常';
				} else if (newdata > 24) {
					this.healthStyle = '过高';
					this.healthText = '体重过重';
				}
			}
		},
		info: {
			handler: function(newdata, olddata) {
				this.calculate();
			},
			deep: true
		}
	},
	methods: {
		typesele(val) {
			this.imglistIndex = val;
		},
		change() {},
		confirmMerchant(e) {
			this.info.sex = e[0].label;
		},
		calculate() {
			if (Number(this.info.weight) > 0 && Number(this.info.age) > 0 && Number(this.info.newAge) > 0 && this.info.sex) {
				this.metabolism = this.basicOut();
				this.BMI = (this.info.weight / ((this.info.age / 100) * (this.info.age / 100))).toFixed(2);
			} else {
				// uni.showToast({
				// 	title: '请填写正确完整的数值后再计算',
				// 	icon: 'none'
				// })
			}
		},
		basicOut() {
			if (this.sex === '男') {
				if (this.info.newAge >= 60) {
					return this.info.weight * 13.4 + 490;
				} else if (this.info.newAge >= 31 && this.info.newAge < 60) {
					return this.info.weight * 11.5 + 830;
				} else {
					return this.info.weight * 15.2 + 600; //<31
				}
			} else {
				if (this.info.newAge >= 60) {
					return this.info.weight * 10.4 + 600;
				} else if (this.info.newAge >= 31 && this.info.newAge <= 60) {
					return this.info.weight * 8.6 + 830;
				} else {
					return this.info.weight * 14 + 450; //<31
				}
			}
		},
		cancel() {
			this.mask = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	background-color: #fff;
	min-height: 100vh;

	.title {
		color: #3287f3;
		font-size: 27upx;
		font-weight: bold;
	}

	.list-wrap {
		.fenlei {
			display: flex;
			flex-wrap: wrap;

			.card {
				width: 46%;
				background-color: #fff;
				margin-bottom: 4%;
				color: #454c54;

				.sportImg {
					height: 230upx;
					box-shadow: 3px 7px 8px 1px rgba(0, 0, 0, 0.13);
					border-radius: 32upx;
				}

				border-radius: 32upx;
				box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);

				.titles {
					text-align: center;
					font-size: 32upx;
					font-weight: 700;
					padding: 8upx 0;
				}
			}
		}

		.fenlei > .card:nth-child(odd) {
			margin-right: 8%;
		}
	}

	input,
	.input {
		height: 45px;
		border-radius: 8px;
		border: 2px solid #d9d9d9;
		display: block;
		width: 100%;
		padding: 8px 15px;
		font-size: 13px;
		font-weight: 600;
		color: grey !important;
		background-color: #fff;
		outline: none;
	}
}

::v-deep .cu-form-group + .cu-form-group {
	border: none;
}

::v-deep.cu-form-group uni-input .uni-input-input {
	border: none;
}

.boxbtn {
	width: 100vw;
	margin-top: 40upx;

	.btns {
		margin: 5px auto;
		height: 40px;
		width: 90%;
		background: linear-gradient(to right, #5184ef, #348ef1);
		font-size: 16px;
		color: #ffffff;
		text-align: center;
		line-height: 40px;
		border-radius: 30px;
	}
}

.checkSty {
	box-shadow: 0 2px 10px 0 #c1dbfc !important;
	color: #3287f3 !important;
	background-color: #e1edfe !important;
}

.poupbox {
	.mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 888;
	}

	.boxpou {
		z-index: 999;
		width: 88%;
		// box-shadow: 0px 2px 6px 0px #d6d4d4;
		position: fixed;
		background: #ffffff;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 5px;
		animation: 0.3s opacity2;
		max-height: 550upx;
		min-height: 300upx;

		.contentpop {
			height: 600upx;
			overflow: scroll;
		}

		.select {
			width: 100%;
			text-align: center;
			font-size: 34upx;
			line-height: 80upx;
		}

		.contYes {
			display: flex;
			justify-content: space-around;
			position: absolute;
			bottom: 0;
			width: 100%;

			.btn {
				width: 50%;
				text-align: center;
				color: rgb(0, 122, 255);
				border-top: 1px solid #d5d5d6;
				line-height: 100upx;
				font-weight: bold;
			}

			.concel {
				border-right: 1px solid #d5d5d6;
			}
		}
	}
}
.twotitle {
	margin-top: 50upx;
}
.contents {
	padding: 0 50upx;

	.titlec {
		font-size: 36upx;
		font-weight: bold;
		line-height: 40px;
	}

	.nubox {
		// box-shadow: -1px 1px 14px 0px #c5c5c5;
		// border-radius: 8px;
		// margin-top: 48upx;
		display: flex;
		align-items: baseline;
		text {
			font-size: 13px;
			font-weight: bold;
			color: #e85350;
		}
		image {
			display: inline-block;
			width: 80upx;
			height: 80upx;
		}
	}
}

.number {
	font-size: 60upx;
	font-weight: bold;
	color: #e85350;
	text-align: center;
}

.ele-item {
	width: 100%;

	.ele-item-wrap {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		// justify-content: center;
		.probar {
			width: 100%;
			padding: 40upx 20upx;
			position: relative;
		}

		.ele-item-name {
			font-size: 14px;
			font-weight: 700;
			min-width: 20%;
			text-align: right;
		}

		.ele-item-num {
			text-align: center;
			background: #39b54a;
			// background-image: linear-gradient(45deg, #39b54a, #8dc63f);
			padding: 4px 5px;
			border-radius: 4px;
			font-size: 12px;
			min-width: 75px;

			:nth-child(2) {
				font-size: 14px;
				font-weight: 700;
			}
		}

		.max {
			// background-image: linear-gradient(45deg, #f43f3b, #ec008c);
			background-color: #e54d42;
		}
	}
}

.main-content-t {
	background: #00c2ff;
	color: white;
	margin: 0 10rpx;
	padding: 0 10rpx;

	.number {
		.units {
			color: #fff;
		}
	}
}

.ele-content {
	flex-wrap: wrap;
	justify-content: end;
}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;

	input {
		// border: 2px solid #999;
		// height: 60upx;
		// border-radius: 10upx;
	}

	.title {
		width: auto;
	}

	.cu-form-group + .cu-form-group {
		border-top: none;
	}
}

.uni-tip-title {
	margin-bottom: 10px;
	text-align: center;
	font-weight: bold;
	font-size: 16px;
	color: #333;
}

.uni-tip-content {
	// padding: 15px;
	font-size: 14px;
	color: #666;
}

.uni-tip-group-button {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	margin-top: 20px;
	background-color: #fff;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #3b4144;
}

.cu-form-group {
	background-color: #fff;
	width: 100%;
	height: 150upx;
}

.radioModal {
	display: flex;
	justify-content: center;
	align-items: center;

	.cu-dialog {
		height: 15vh;
	}
}

.radioModal /deep/ uni-radio::before,
uni-checkbox::before {
	right: 9px;
}

.pro-rad {
	overflow: inherit;
	height: 10px;
	background-color: transparent;
}

.tootio-item-wrap {
	position: absolute;
	width: 80rpx;
	top: -50rpx;
	right: 104rpx;

	.tootio-item {
		background-color: #8dc63f;
		border-color: #8dc63f;
		color: #ffffff;

		&::before {
			border-color: #8dc63f transparent transparent;
		}
	}
}

.regular {
	position: relative;

	// &::after {
	// 	position: absolute;
	// 	content: attr(num);
	// right: 33%;
	// 	top: -15px;
	// 	color: #8dc63f;
	// }
}

.max-risk {
	// &::after {
	right: 8%;

	.tootio-item {
		background-color: #ffb347;
		border-color: #ffb347;
		color: #ffffff;

		&::before {
			border-color: #ffb347 transparent transparent;
		}
	}

	// align-content: ;: #ffb347;
	// }
}

.min-low {
	// &::after {
	left: 30rpx;

	.tootio-item {
		background-color: #00c2ff;
		border-color: #00c2ff;
		color: #ffffff;

		&::before {
			border-color: #00c2ff transparent transparent;
		}
	}

	// 	color: #00c2ff;
	// }
}

.loa-st {
	left: calc(50% - 20upx);
	.tootio-item {
		background-color: #8dc63f;
		border-color: #8dc63f;
		color: #ffffff;

		&::before {
			border-color: #8dc63f transparent transparent;
		}
	}
}

.low,
.risk {
	position: relative;
	background-color: rgb(0, 194, 255);
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-right: 1px solid #ffffff;

	&::after {
		position: absolute;
		content: attr(num);
		right: -8px;
		bottom: -20px;
		color: #999999;
	}
}

.risk {
	border-radius: 0;
	border: none;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: rgb(255, 179, 71);

	&::after {
		position: absolute;
		content: attr(num);
		left: -10px;
		bottom: -20px;
		color: #999999;
	}
}

.tipText {
	text-align: center;
	margin-top: 40upx;
	color: #888888;
}

.tootio-item {
	position: relative;
	width: 100%;
	height: 25px;
	border: 2px solid #3377aa;
	top: 0px;
	border-radius: 12rpx;
	color: #000000;
	font-size: 12px;

	&::before {
		position: absolute;
		content: '';
		width: 0;
		height: 0;
		border-width: 5px 5px;
		border-style: solid;
		border-color: #3377aa transparent transparent;
		bottom: -12px;
		left: 12px;
	}
}

.nubox {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20upx;

	.number {
		font-size: 60upx;
		font-weight: bold;
		color: #e85350;
	}

	image {
		display: inline-block;
		width: 80upx;
		height: 80upx;
	}
}
</style>
