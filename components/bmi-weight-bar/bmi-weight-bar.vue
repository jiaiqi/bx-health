<template>
	<view class="bmi-bar-box">
		<view class="bmi-bar">
			<view class="bar1 bar-box">
				<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi < 18.5">
					<text class="cuIcon-locationfill text-blue">
						<text class="tip-bmi">
							{{ bmi }}
						</text>
					</text>
				</view>
				<view class="bar">偏瘦</view>
			</view>
			<view class="bar2 bar-box">
				<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi >= 18.5 && bmi <= 24">
					<text class="cuIcon-locationfill text-cyan">
						<text class="tip-bmi">
							{{ bmi }}
						</text>
					</text>
				</view>
				<view class="bar">正常</view>
			</view>
			<view class="bar3 bar-box">
				<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi <= 28 && bmi > 24">
					<text class="cuIcon-locationfill text-yellow">
						<text class="tip-bmi">
							{{ bmi }}
						</text>
					</text>
				</view>
				<view class="bar">超重</view>
			</view>
			<view class="bar4 bar-box">
				<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi > 28">
					<text class="cuIcon-locationfill text-orange">
						<text class="tip-bmi">
							{{ bmi }}
						</text>
					</text>
				</view>
				<view class="bar">肥胖</view>
			</view>
		</view>
		<view class="bmi-label" v-if="isArray(weightForBmi)">
			<view class="label text-bold">体重:</view>
			<view class="value" v-for="item in weightForBmi" :key="item.bmi">
				<text v-if="item.weight && isString(item.weight)">{{ item.weight }}</text>
			</view>
		</view>
		<view class="bmi-label" v-if="isArray(weightForBmi)">
			<view class="label text-bold">BMI:</view>
			<view class="value" v-for="item in weightForBmi" :key="item.bmi">{{ item.bmi }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			weight: {
				type: Number,
				default: 0
			},
			height: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			};
		},
		computed: {
			bmi() {
				// 体重（kg）/身高*身高（m）
				if (this.weight && this.height) {
					return Number(((this.weight * 10000) / this.height ** 2).toFixed(1));
				}
			},
			bmiScale() {
				let result = 0;
				if (this.bmi) {
					let bmi = Number(this.bmi);
					if (bmi < 18.5) {
						result = bmi / 18.5;
					} else if (bmi >= 18.5 && bmi <= 24) {
						result = (bmi - 18.5) / 5.5;
					} else if (bmi > 24 && bmi <= 28) {
						result = (bmi - 24) / 4;
					} else if (bmi > 28) {
						result = (bmi - 28) / 18.5;
					}
					result = result * 150 - 24;
				}
				if (result > 100) {
					result = 100;
				}
				return `${result}rpx`;
			},
			weightForBmi() {
				let bmiList = [18.5, 24, 28];
				let weightList = [];
				if (this.bmi && this.height) {
					bmiList.forEach(bmi => {
						let weight = ((bmi * this.height ** 2) / 10000).toFixed(1) + 'kg';
						weightList.push({
							bmi,
							weight
						});
					});
				}
				return weightList;
			},
		},
	}
</script>

<style scoped lang="scss">
	.bmi-box {
		width: 100%;
		display: flex;
		padding: 0 20rpx;
		background-color: #fff;
		margin: 20rpx 0 50px;
		border-radius: 20rpx;

		.bmi-box-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			margin: 20rpx 0;
			height: 100rpx;

			.title {
				color: #999;
				font-size: 24rpx;
				font-weight: normal;
			}

			.digit {
				color: #333;
				font-weight: 700;
				font-size: 30rpx;

				&.bmi {
					font-size: 60rpx;
				}
			}
		}

	}

	.bmi-bar-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		font-weight: normal;

		.last-data {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;

			.create-time {
				width: 100%;
			}

			.unit {
				font-size: 32rpx;
				color: #666;
				margin-left: 5rpx;
			}
		}

		.bmi-label {
			display: flex;
			position: relative;
			width: 500rpx;
			height: 40rpx;
			line-height: 40rpx;
			color: #666;
			font-size: 24rpx;

			.label {
				position: absolute;
				left: -80rpx;
			}

			.value {
				flex: 1;
			}
		}

		.bmi-bar {
			padding: 40rpx 0 20rpx;
			display: flex;
			width: 100%;
			justify-content: center;

			.bar-box {
				width: 150rpx;
				position: relative;
				margin-top: 10rpx;

				.scale {
					position: absolute;
					top: -25px;
					font-size: 50rpx;
					left: 0;
					transition: left 2s ease;

					.tip-bmi {
						font-size: 14px;
						position: absolute;
						font-weight: bold;
						// top: -5px;
						// left: 0;
					}
				}

				.bar {
					height: 60rpx;
					line-height: 60rpx;
					color: #f1f1f1;
				}
			}

			.bar1 {
				margin-right: 4rpx;

				.bar {
					background-color: #40c0fd;
					border-top-left-radius: 50rpx;
					border-bottom-left-radius: 50rpx;
				}

				.active-label {
					background-color: #40c0fd;
				}
			}

			.bar2 {
				margin-right: 4rpx;

				.bar {
					background-color: #4acdba;
				}

				.active-label {
					background-color: #4acdba;
				}
			}

			.bar3 {
				margin-right: 4rpx;

				.bar {
					background-color: #fad650;
				}

				.active-label {
					background-color: #fad650;
				}
			}

			.bar4 {
				.bar {
					background-color: #f7b235;
					border-top-right-radius: 50rpx;
					border-bottom-right-radius: 50rpx;
				}

				.active-label {
					background-color: #f7b235;
				}
			}
		}
	}
</style>
