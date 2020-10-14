<template>
	<view class="element-wrap">
		<view class="element-box">
			<view class="element-name">
				<text class="text">{{ elementData.label }}({{ elementData.units }})</text>
			</view>
			<view class="ele-item-wrap" v-if="elementData.label !== '钠'">
				<text class="ele-item-name">{{ elementData.name }}</text>
				<view class="probar">
					<view class="cu-progress progress-bar radius">
						<view
							v-if="elementData.value_left || elementData.value_left === 0"
							class="pointer"
							:text="elementData.value === 0 ? '0' : elementData.value.toFixed(2)"
							:style="{ left: elementData.value_left * 2 + 'px' }"
						>
							<view class="after">{{ elementData.value === 0 ? '0' : elementData.value.toFixed(2) }}</view>
						</view>
						<view class="bg-grey EAR" :style="{ width: elementData.left_width ? elementData.left_width * 2 + 'px' : '33%' }">
							<view class="after">{{ elementData.left_width ? elementData.EAR : '' }}</view>
						</view>
						<view
							class="bg-olive regular"
							:style="{
								width: elementData.center_width ? elementData.center_width * 2 + 'px' : '33%',
								'border-top-right-radius': !elementData.UL ? '5px' : '',
								'border-bottom-right-radius': !elementData.UL ? '5px' : ''
							}"
						></view>
						<view
							class="risk"
							:style="{
								width: elementData.UL && elementData.right_width ? elementData.right_width * 2 + 'px' : !elementData.UL ? 0 : '33%'
							}"
						>
							<view class="after">{{ elementData.right_width && elementData.UL ? elementData.UL : '' }}</view>
							<view
								class="before"
								:class="{
									lack: elementData.value < elementData.EAR,
									normal: elementData.value >= elementData.EAR && (elementData.value <= elementData.UL || !elementData.UL),
									over: elementData.UL && elementData.value > elementData.UL
								}"
							>
								{{ elementData.value < elementData.EAR ? '不足' : elementData.UL && elementData.value > elementData.UL ? '过多' : '正常' }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="qiun-charts qiun-rows"><canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie" @touchstart="touchPie"></canvas></view>
		</view>
		<view class="element-box">
			<view class="element-name title">
				<text class="text">饮食记录</text>
				<button class="cu-btn bg-white text-blue" @click="toAddDiet">
					<text class="cuIcon-add margin-right-xs"></text>
					选餐
				</button>
			</view>
			<view class="cu-list">
				<view class="diet-item column-name">
					<view class="column">食物名称</view>
					<view class="column">质量</view>
					<view class="column">{{ elementData.label }}</view>
					<view class="column">热量</view>
				</view>
				<view
					@touchstart="ListTouchStart"
					@touchmove="ListTouchMove"
					@touchend="ListTouchEnd"
					@click="clickDietItem"
					:data-target="'move-box-' + index"
					class="diet-item cu-item"
					v-for="(item, index) in dietRecord"
					:key="index"
					:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
				>
					<view class="column diet-name">{{ item.name }}</view>
					<view class="column">{{ item.amount * item.unit_weight_g + item.unit }}</view>
					<view class="column">{{ (item.amount * item[elementData.key]).toFixed(1) + elementData.units }}</view>
					<view class="column">{{ item.amount * item.unit_energy }}千卡</view>
					<view class="move column"><view class="" @click="deleteItem(item)">删除</view></view>
				</view>
				<view class="diet-item total" v-if="dietRecord.length > 0">
					<view class="column">共计:</view>
					<view class="column">{{ totalWeight }}g</view>
					<view class="column">{{ totalNutrient + elementData.units }}</view>
					<view class="column heat">{{ totalCalories }}千卡</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showEditModal }" @click.self="showEditModal = false">
			<view class="cu-dialog" v-if="currentDiet">
				<view class="title-bar">
					<view class="btn" @click="showEditModal = false">取消</view>
					<view class="date">{{ currentDiet.hdate + ' ' + currentDiet.htime }}</view>
					<view class="btn" @click="UpdateDietInfo">确认</view>
				</view>
				<view class="diet-info">
					<view class="img"><u-image width="100%" height="100%" :src="currentDietImgUrl"></u-image></view>
					<view class="info">
						<view class="name">{{ currentDiet.name }}</view>
						<view class="weight">
							<text class="label">热量:</text>
							<text class="heat">
								{{ currentDiet.amount * currentDiet.unit_energy }}
								<text class="unit">千卡</text>
							</text>
							/{{ currentDiet.amount * currentDiet.unit_weight_g }}
							<text class="unit">{{ currentDiet.unit }}</text>
						</view>
						<view class="element">{{ elementData.label }}:{{ (currentDiet.amount * currentDiet[elementData.key]).toFixed(1) }}{{ elementData.units }}</view>
						<view class="amount">
							数量:
							<view class="number-box">
								<text @click="changeCurrentVal('minus')" class="symbol">-</text>
								<input @change="changeValue" v-model="currentDiet.amount" type="digit" disabled />
								<text @click="changeCurrentVal('plus')" class="symbol">+</text>
							</view>
						</view>
					</view>
				</view>
				<view class="delete-bar">
					<text class="cuIcon-delete" @click="deleteItem(currentDiet)"></text>
					<!-- 删除此条记录 -->
				</view>
				<view class="number-bar"></view>
				<view class="unit-bar"></view>
			</view>
		</view>
	</view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvaPie = null;
export default {
	computed: {
		totalWeight() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total = total + item.amount * item.unit_weight_g;
			});
			return Number(total.toFixed(1));
		},
		totalNutrient() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total = total + item.amount * item[this.elementData.key];
			});
			return Number(total.toFixed(1));
		},
		totalCalories() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total += item.energy;
			});
			return Number(total.toFixed(1));
		},
		currentDietImgUrl() {
			let currentDiet = this.currentDiet;
			if (currentDiet && currentDiet.image) {
				return this.$api.downloadFile + currentDiet['image'] + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		}
	},
	data() {
		return {
			currentDiet: null,
			showEditModal: false,
			showAddDiet: false,
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			chartData: {
				series: []
			},
			elementData: {},
			copyElementData: {},
			user_no: '',
			date: '',
			dietRecord: [],
			listTouchStart: 0,
			modalName: null,
			piearr: []
		};
	},
	methods: {
		buildElemetBarData(e) {
			_self.elementData.value = 0;
			_self.dietRecord.forEach(item => {
				_self.elementData.value += item.amount * item[_self.elementData.key];
			});
			let dietInfo = this.deepClone(e);
			/**
			 * 共计 dietInfo.EAR*2 + dietInfo.UL-dietInfo.EAR --> dietInfo.EAR+dietInfo.UL
			 * 左/右： dietInfo.EAR
			 * 中间： dietInfo.UL-dietInfo.EAR
			 */
			if (dietInfo.UL && dietInfo.value && dietInfo.value > (dietInfo.UL - dietInfo.EAR) * 4) {
				dietInfo['value_left'] = (120 * 0.9) / 2;
				dietInfo['left_width'] = (dietInfo.EAR * 120) / ((dietInfo.value * 2) / 0.9);
				dietInfo['center_width'] = ((dietInfo.UL - dietInfo.EAR) * 120) / ((dietInfo.value * 2) / 0.9);
				dietInfo['right_width'] = 120 - dietInfo['left_width'] - dietInfo['center_width'];
			} else {
				if (!dietInfo.UL) {
					dietInfo['right_width'] = 0;
					dietInfo['left_width'] = 50;
					dietInfo['center_width'] = 70;
					if (dietInfo.value <= dietInfo.EAR) {
						dietInfo['value_left'] = (dietInfo['left_width'] * dietInfo.value) / dietInfo.EAR;
					} else {
						dietInfo['value_left'] = (dietInfo['left_width'] * dietInfo.value) / dietInfo.EAR;
					}
					if (dietInfo['value_left'] > 110) {
						dietInfo['value_left'] = 110;
					}
					return dietInfo;
				}
				if (dietInfo.value === 0 || dietInfo.value === '0') {
					dietInfo['value_left'] = 0;
					dietInfo['right_width'] = 30;
					dietInfo['left_width'] = (90 * dietInfo.EAR) / dietInfo.UL;
					dietInfo['center_width'] = 90 - (90 * dietInfo.EAR) / dietInfo.UL;
				} else {
					dietInfo['value_left'] = (40 * dietInfo.value) / (dietInfo.UL - dietInfo.EAR);
					dietInfo['left_width'] = (120 * dietInfo.EAR) / (dietInfo.EAR + dietInfo.UL);
					dietInfo['right_width'] = (120 * dietInfo.EAR) / (dietInfo.EAR + dietInfo.UL) > 30 ? (120 * dietInfo.EAR) / (dietInfo.EAR + dietInfo.UL) : 30;
					// dietInfo['center_width'] = (120 * (dietInfo.UL - dietInfo.EAR)) / (dietInfo.EAR + dietInfo.UL);
					if (dietInfo['left_width'] + dietInfo['right_width'] > 80) {
						dietInfo['right_width'] = 20;
						dietInfo['left_width'] = (100 * dietInfo.EAR) / dietInfo.UL;
					}
					dietInfo['center_width'] = 120 - dietInfo['left_width'] - dietInfo['right_width'];
					if (dietInfo.value < dietInfo.EAR) {
						dietInfo['value_left'] = (dietInfo['left_width'] * dietInfo.value) / dietInfo.EAR;
					}
					if (dietInfo.value >= dietInfo.EAR && dietInfo.value <= dietInfo.UL) {
						dietInfo['value_left'] = dietInfo['left_width'] + (dietInfo['center_width'] * (dietInfo.value - dietInfo.EAR)) / (dietInfo.UL - dietInfo.EAR);
					}
					if (dietInfo.value > dietInfo.UL) {
						dietInfo['value_left'] = dietInfo['left_width'] + dietInfo['center_width'] + (dietInfo['right_width'] * (dietInfo.value - dietInfo.UL)) / dietInfo.EAR;
					}
				}
				if (dietInfo['value_left'] > 110) {
					dietInfo['value_left'] = 110;
				}
			}
			// this.elementData = dietInfo;
			return dietInfo;
		},
		clickDietItem(item) {
			this.showEditModal = true;
			this.currentDiet = item;
		},
		async UpdateDietInfo() {
			let self = this;
			let dietInfo = this.deepClone(this.currentDiet);
			let serviceName = 'srvhealth_diet_record_update';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: 'srvhealth_diet_record_update',
					condition: [{ colName: 'id', ruleType: 'eq', value: dietInfo.id }],
					data: [
						{
							amount: dietInfo.amount
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await self.getDietRecord();
				console.log(self.elementData);
				self.showEditModal = false;
			}
		},
		changeCurrentVal(e) {
			if (e === 'minus') {
				if (this.currentDiet.amount >= 1) {
					this.currentDiet.amount = this.currentDiet.amount - 0.5;
				}
			} else {
				this.currentDiet.amount = this.currentDiet.amount + 0.5;
			}
		},
		toAddDiet() {
			// 跳转到选餐页面
			let elementData = this.deepClone(this.elementData);
			const condType = {
				type: 'food',
				serviceName: 'srvhealth_diet_contents_select',
				colName: 'name',
				imgCol: 'image',
				wordKey: {
					title: 'name',
					unit: 'unit',
					energy: 'unit_energy'
				},
				lackEle: elementData
			};
			if (elementData.value < elementData.EAR) {
				condType.order = [
					{
						colName: this.elementData.key,
						orderType: 'desc' // asc升序  desc降序
					}
				];
			} else if (elementData.UL && elementData.value > elementData.UL) {
			}
			const url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
			uni.navigateTo({
				url: url
			});
		},
		deleteItem(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除吗?',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						let req = [{ serviceName: 'srvhealth_diet_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.showToast({
									title: '删除成功'
								});
								self.showEditModal = false;
								self.getDietRecord();
							}
						});
					}
				}
			});
		},
		async getDietList(foodNameStr) {
			// 食物列表
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [{ colName: 'name', ruleType: 'in', value: foodNameStr }]
			};
			if (this.elementData.key) {
				req.order = [
					{
						colName: this.elementData.key,
						orderType: 'desc' // asc升序  desc降序
					}
				];
			}
			let res = await this.$http.post(url, req);
			return res.data.data;
		},
		async getDietRecord() {
			// 饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') },
					{ colName: 'hdate', ruleType: 'like', value: this.date.trim() }
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let foodNameList = res.data.data.map(item => {
					return item.name;
				});

				let foodNameStr = foodNameList.toString();
				let foodList = await this.getDietList(foodNameStr);
				res.data.data.forEach(item => {
					foodList.forEach(food => {
						if (food.name === item.name) {
							item[this.elementData.key] = food[this.elementData.key];
							item['unit_energy'] = food.unit_energy;
							if (food.image) {
								item['image'] = food['image'];
							}
						}
					});
				});
				let resultData = this.deepClone(res.data.data);
				this.dietRecord = resultData.sort((a, b) => {
					return b[this.elementData.key] * b.amount - a[this.elementData.key] * a.amount;
				});
				let dietNameList = [];
				let dietList = [];
				res.data.data.forEach(item => {
					if (dietNameList.indexOf(item.name) !== -1) {
						dietList[dietNameList.indexOf(item.name)].amount += item.amount;
					} else {
						dietNameList.push(item.name);
						dietList.push(item);
					}
				});
				this.chartData.series = dietList.map(item => {
					return {
						name: item.name,
						data: item[this.elementData.key]
					};
				});
				_self.elementData = _self.buildElemetBarData(_self.elementData);
				_self.showPie('canvasPie', this.chartData);
				return this.dietRecord;
			}
		},
		showPie(canvasId, chartData) {
			canvaPie = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'pie',
				fontSize: 11,
				legend: {
					show: true,
					position: 'bottom',
					float: 'center',
					itemGap: 10,
					padding: 5,
					lineHeight: 26,
					margin: 5,
					borderWidth: 1
				},
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				series: chartData.series,
				animation: true,
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				dataLabel: {
					show: true,
					format: function(item) {
						return item.data;
					}
				},
				extra: {
					pie: {
						labelWidth: 15
					}
				}
			});

			this.piearr = canvaPie.opts.series;
		},
		touchPie(e) {
			canvaPie.showToolTip(e, {
				format: function(item) {
					let amount = 0;
					let unit = '';
					let unit_weight_g = 0;
					_self.dietRecord.forEach(diet => {
						if (item.name === diet.name) {
							amount += diet.amount;
							unit = diet.unit;
							unit_weight_g = diet.unit_weight_g;
						}
					});
					return (
						amount * unit_weight_g + unit + item.name + '提供:' + Number(amount * item.data).toFixed(1) + _self.elementData.units.split('/')[0] + ' ' + _self.elementData.label
					);
				}
			});
			canvaPie.touchLegend(e);
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},
		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},
		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	},
	created() {
		uni.$on('dietUpdate', () => {
			this.getDietRecord();
		});
	},
	onLoad(e) {
		_self = this;
		this.cWidth = uni.upx2px(710);
		this.cHeight = uni.upx2px(500);
		// _self.showPie("canvasPie",this.chartData);
		if (e.data) {
			try {
				this.elementData = JSON.parse(e.data);
				this.copyElementData = JSON.parse(e.data);
				if (this.elementData.value < this.elementData.EAR) {
					this.showAddDiet = true;
				}
			} catch (e) {
				//TODO handle the exception
			}
		}
		if (e.user_no && e.date) {
			this.user_no = e.user_no;
			this.date = e.date;
			this.getDietRecord();
		}
	}
};
</script>

<style scoped lang="scss">
.element-wrap {
	width: 100%;
	background-color: #fff;
	min-height: 100vh;
	padding: 20rpx 0;
	.element-box {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		margin: 0 20rpx 20rpx;
	}
	.qiun-charts {
		width: 100%;
		height: 500rpx;
		background-color: #ffffff;
	}
	.charts-pie {
		width: 100%;
		height: 500upx;
		background-color: #ffffff;
	}

	.cu-list {
		margin-bottom: 20rpx;
		overflow: hidden;
	}
	.cu-modal {
		z-index: 666;
	}
	.cu-dialog {
		width: 100vw;
		.title-bar {
			display: flex;
			justify-content: space-between;
			min-height: 80rpx;
			align-items: center;
			.btn {
				padding: 030rpx;
				color: #0081ff;
				font-size: 28rpx;
			}
		}
		.diet-info {
			display: flex;
			padding: 20rpx;
			justify-content: space-around;
			.img {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				overflow: hidden;
				// padding: 2px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			}
			.info {
				min-width: 400rpx;
				padding-left: 50rpx;
				display: flex;
				flex-direction: column;
				.name {
					font-weight: 700;
					font-size: 16px;
				}
				.element {
					color: #8dc63f;
				}
				.weight {
					padding: 10rpx 0;
					// color: #999;
					color: #ffb347;
					.heat {
						color: #ffb347;
						font-size: 16px;
					}
					.unit {
						font-size: 12px;
					}
				}
				.amount {
					display: flex;
					align-items: center;
					.number-box {
						display: flex;
						justify-content: center;
						padding: 20rpx;
						text {
							background: rgb(242, 243, 245);
							color: rgb(50, 50, 51);
							width: 30px;
							height: 27px;
							line-height: 27px;
							display: flex;
							justify-content: center;
							align-content: center;
							font-size: 20px;
						}
						input {
							width: 100rpx;
							color: rgb(50, 50, 51);
							font-size: 14px;
							background: rgb(242, 243, 245);
							height: 27px;
							width: 43px;
							text-align: center;
							position: relative;
							padding: 0;
							margin: 0 3px;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.symbol {
							&:active {
								// box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
								transform: scale(1.5);
							}
						}
					}
				}
			}
		}
		.delete-bar {
			flex: 1;
			padding: 10rpx 20rpx;
			color: #999;
			border-top: 1px solid #f1f1f1;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 50rpx;
			height: 150rpx;
			.cuIcon-delete {
				display: inline-block;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				width: 80rpx;
				border-radius: 100%;
				border: #666 1px solid;
				color: #666;
				&:active {
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
					transform: scale(1.1);
				}
			}
		}
	}
}
.element-name {
	font-size: 34upx;
	font-weight: 600;
	position: relative;
	padding: 20rpx 0;
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	border-bottom: 0.5px solid #f1f1f1;
	.cu-btn {
		border-radius: 0;
		height: auto;
	}
	.text {
		position: relative;
		text-indent: 45rpx;
		&::before {
			content: '';
			width: 8rpx;
			height: 30rpx;
			border-radius: 10rpx;
			background-color: #0081ff;
			position: absolute;
			left: 20rpx;
			top: 10rpx;
		}
	}
}

.ele-item-wrap {
	width: 100%;
	display: flex;
	align-items: center;
	// justify-content: center;
	background-color: #fff;
	padding: 40rpx 0 10rpx;
	padding-left: 20rpx;
	.probar {
		padding: 0 10rpx;
		position: relative;
		.pointer {
			position: absolute;
			width: 8rpx;
			height: 50rpx;
			bottom: 0;
			background-color: rgba(250, 65, 65, 0.6);
			z-index: 20;
			border-radius: 20rpx;
			transition: left 1s;
			.after {
				position: absolute;
				font-size: 14px;
				top: -35rpx;
				color: red;
			}
		}
		.EAR {
			.after {
				position: absolute;
				right: -8px;
				color: #333;
				z-index: 2;
			}
		}
		.risk {
			.after {
				position: absolute;
				left: -10px;
				color: #333;
				z-index: 2;
			}
			.before {
				width: auto;
				position: absolute;
				right: -26px;
				color: #333;
				font-size: 12px;
				z-index: 2;
				&.lack {
					color: #333;
				}
				&.normal {
					color: #8dc63f;
				}
				&.over {
					color: #ffb347;
				}
			}
		}
		.progress-bar {
			height: 40rpx;
			position: relative;
			width: auto;
			overflow: inherit;
			background-color: #fff;
		}
	}
	.ele-item-name {
		font-size: 14px;
		font-weight: 700;
		min-width: 30px;
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
.diet-item {
	display: flex;
	position: relative;
	&.cu-item {
		&:active {
			transform: scale(1.2);
			background-color: #999;
		}
	}
	&.column-name {
		color: #9c9c9c;
	}
	&.total {
		background-color: #f1f1f1;
		font-weight: 700;
		// color: #fff;
		.column {
			background-color: transparent;
		}
		.heat {
			color: #ffb347;
		}
	}
	.column {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		min-height: 80rpx;
		border-top: 1rpx solid #f1f1f1;

		&:first-child {
			text-indent: 20px;
			justify-content: flex-start;
		}
		&:last-child {
			// flex: 0.5;
			// background-color: #fa3534;
			// color: #fff;
		}
		&.move {
			flex: 0.5;
			background-color: #fa3534;
			color: #fff;
		}
	}
}

.regular {
	position: relative;
}
.max-risk {
	right: 8%;
	.tootio-item {
		background-color: #ffb347;
		border-color: #ffb347;
		color: #ffffff;
		&::before {
			border-color: #ffb347 transparent transparent;
		}
	}
}
.min-low {
	left: 30rpx;
	.tootio-item {
		background-color: #00c2ff;
		border-color: #00c2ff;
		color: #ffffff;
		&::before {
			border-color: #00c2ff transparent transparent;
		}
	}
}
.EAR,
.risk {
	position: relative;
	background-color: #cfcfcf;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.risk {
	border-radius: 0;
	border: none;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: rgb(255, 179, 71);
}
</style>
