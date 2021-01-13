<template>
	<view class="handler-bar">
		<view class="cook-type-box" v-if="dietInfo&& dietInfo.diret_type!=='mixed_food'">
			<view class="title">烹调方式:</view>
			<view
				class="cook-type"
				:class="{ 'current-cook-type': item.value === cook_method }"
				@click="changeCookMethod(true, item.value)"
				v-for="item in defaultCookTypes"
				:key="item.value"
			>
				{{ item.value }}
			</view>
			<text class="cook-type" @click="showTypeSelector = true">更多</text>
			<text class="lg text-gray cuIcon-right" v-if="cookTypes.length > 0"></text>
		</view>
		<view class="dinner-time unit-box" v-if="dietInfo.food_no || dietInfo.diet_record_no">
			<view class="title">时间:</view>
			<view class="unit-item" :class="{ 'active-unit': dining_type === u.value }" v-for="(u, index) in dinnerTime" :key="index" @click="changeDiningType(u, index)">
				{{ u.value }}
			</view>
		</view>
		<view class="dinner-time unit-box">
			<view class="title">单位:</view>
			<view class="unit-item" :class="{ 'active-unit': dietInfo.unit === u.unit }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">{{ getUnit(u) }}</view>
		</view>
		<view class="amount">
			<view class="title">数量:</view>
			<view class="number-box">
				<text @click="changeAmount('minus', 0.1)" class="symbol" :class="{ disabled: dietInfo.amount - 0.1 <= 0 }">-0.1</text>
				<text @click="changeAmount('minus')" class="symbol" :class="{ disabled: dietInfo.amount - 1 <= 0 }">-1</text>
				<input class="input" v-model.number="dietInfo.amount" type="number" />
				<text @click="changeAmount('plus')" class="symbol">+1</text>
				<text @click="changeAmount('plus', 0.1)" class="symbol">+0.1</text>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showTypeSelector }">
			<view class="cu-dialog" @tap.stop="">
				<view class="bg-white cook-top"><text>常见烹调方式</text></view>
				<view class="cooktype-wrap" v-if="dietInfo">
					<bx-radio-group v-model="cook_method" mode="button">
						<bx-radio v-for="item in cookTypes" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
					</bx-radio-group>
					<view class="button-box">
						<button class="cu-btn button" @tap="changeCookMethod(false)">取消</button>
						<button class="cu-btn button" @tap="changeCookMethod(true)">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTypeSelector: false,
			dining_type: '早餐',
			cook_method: '',
			cookTypes: [],
			defaultCookTypes: [],
			unitList: [],
			dinnerTime: [
				{
					value: '早餐',
					type: 'cereal'
				},
				{
					value: '中餐',
					type: 'lunch'
				},
				{
					value: '晚餐',
					type: 'dinner'
				},
				{
					value: '夜宵',
					type: 'midnight'
				},
				{
					value: '加餐',
					type: 'extra'
				},
				{
					value: '其他',
					type: 'other'
				}
			],
			oldDefaultCOokTypes: []
		};
	},
	props: {
		dietInfo: {
			type: Object
		},
		cookMethod: {
			type: String
		}
	},
	watch: {
		dietInfo: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				if (!this.cook_method) {
					this.cook_method = newValue.cook_method_default ? newValue.cook_method_default : '';
					if (this.cookMethod) {
						this.cook_method = this.cookMethod;
					}
				}
				// if (this.cookTypes.length === 0) {
				this.getCookTypes();
				// }
				if (this.unitList.length === 0) {
					this.getFoodUnit();
				}
			}
		}
	},
	methods: {
		getUnit(item) {
			if (item && item.unit && item.unit === 'g') {
				if (item.unit_amount && item.unit_amount > 1) {
					return item.unit_amount + 'g';
				} else if (item.unit_weight_g && item.unit_weight_g > 1) {
					return item.unit_weight_g + 'g';
				}
			} else {
				return item.unit;
			}
		},
		async getFoodUnit() {
			// 查找当前食物的单位
			if (!this.dietInfo.diet_record_no && !this.dietInfo.food_no && !this.dietInfo.meal_no) {
				return;
			}
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [{ colName: 'food_no', ruleType: 'eq', value: this.dietInfo.diet_contents_no ? this.dietInfo.diet_contents_no : this.dietInfo.food_no }],
				page: { pageNo: 1 }
			};
			let res = await this.$http.post(url, req);
			let unitList = [];
			let self = this;
			let basicUnit = this.deepClone(this.dietInfo);
			if (basicUnit.unit !== 'g' && basicUnit.unit.indexOf('g') !== -1) {
				basicUnit.unit = 'g';
				basicUnit.amount = 1;
				basicUnit.energy = (basicUnit.energy * 100) / basicUnit.unit_weight_g;
				basicUnit.unit_weight_g = 100;
				unitList.push(basicUnit);
			} else if (basicUnit.unit !== 'g') {
				basicUnit.amount = 1;
				unitList.push(basicUnit);
			} else {
				unitList.push(basicUnit);
			}
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				unitList = [...unitList, ...res.data.data];
			}

			this.unitList = this.deepClone(unitList).map(item => {
				item.label = item.unit_weight_g && item.unit === 'g' ? item.unit_weight_g + item.unit : item.unit_amount && item.unit === 'g' ? item.unit_amount + item.unit : item.unit;
				item.value = item.label;
				return item;
			});

			return this.unitList;
		},
		async getCookTypes() {
			if (this.dietInfo.cook_method_default && this.defaultCookTypes.length === 0) {
				this.defaultCookTypes = this.dietInfo.cook_method_default.split(',').map(item => {
					return {
						label: item,
						value: item,
						checked: true
					};
				});
			}

			if (this.dietInfo.cook_method) {
				if (!this.defaultCookTypes.find(item => item.value === this.dietInfo.cook_method)) {
					let arr = this.dietInfo.cook_method.split(',');
					if (arr.length > 0) {
						arr.forEach(item => {
							if (!this.defaultCookTypes.find(type => type.value === item)) {
								let obj = {
									label: item,
									value: item,
									checked: false
								};
								this.defaultCookTypes.push(obj);
							}
						});
					}
				}
			}
			if (this.oldDefaultCOokTypes.length === 0) {
				this.oldDefaultCOokTypes = this.deepClone(this.defaultCookTypes);
			}
			let colVs = await this.getServiceV2('srvhealth_diet_contents_select', 'list', 'list', 'health');
			let colData = colVs.srv_cols;
			colData.forEach(item => {
				if (item.columns === 'cook_method') {
					this.cookTypes = item.option_list_v2;
				}
			});
		},
		changeCookMethod(isChange, method) {
			if (method) {
				this.cook_method = method;
			}
			if (isChange) {
				this.$emit('changeCookMethod', this.cook_method);
			} else {
				this.cook_method = this.cookMethod;
			}
			let defaultCookTypes = this.deepClone(this.oldDefaultCOokTypes);
			let typeArr = defaultCookTypes.map(item => item.value);
			if (this.dietInfo.cook_method_default) {
				let index = this.defaultCookTypes.findIndex(
					item => item.value !== this.dietInfo.cook_method && !typeArr.includes(item.value) && this.dietInfo.cook_method_default.indexOf(item.value) === -1
				);
				if (index !== -1) {
					this.defaultCookTypes.splice(index, 1);
				}
			} else {
				let index = this.defaultCookTypes.findIndex(item => item.value !== this.dietInfo.cook_method && !typeArr.includes(item.value));
				this.defaultCookTypes.splice(index, 1);
			}
			if (!this.defaultCookTypes.find(item => item.value === this.dietInfo.cook_method)) {
				let arr = this.dietInfo.cook_method.split(',');
				if (arr.length > 0) {
					arr.forEach(item => {
						if (!this.defaultCookTypes.find(type => type.value === item)) {
							this.defaultCookTypes.push({
								label: item,
								value: item,
								checked: false
							});
						}
					});
				}
			}
			this.showTypeSelector = false;
		},
		changeDiningType(item) {
			this.dining_type = item.value;
			this.$emit('changeDiningType', this.dining_type);
		},
		checkUnit(item, index) {
			// 切换单位
			let currentUnit = this.unitList[index];
			this.$emit('checkUnit', currentUnit);
		},
		changeAmount(e, step = 1) {
			this.$emit('changeAmount', e, step);
		}
	},
	mounted() {}
};
</script>

<style scoped lang="scss">
.handler-bar {
	display: flex;
	flex-direction: column;
	.cook-type-box {
		width: 100%;
		display: flex;
		padding: 0 20rpx;
		flex-wrap: wrap;
		align-items: center;
		.cook-type {
			box-sizing: border-box;
			margin: 10rpx 5rpx;
			background-color: #f8f8f8;
			color: #999;
			border-radius: 20px;
			border: 1px solid #999;
			padding: 0px 8px;
			min-height: 27px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			min-width: 80rpx;
		}
		.current-cook-type {
			border: 1px solid #f37b1d;
			background-color: #f37b1d;
			color: #fff;
			// color: #f37b1d;
			// border: 1px solid #f37b1d;
			// background-color: rgba($color: #ffaf0e, $alpha: 0.3);
		}
	}
	.unit-box {
		width: 100%;
		display: flex;
		padding: 0 20rpx;
		padding-right: 0;
		flex-wrap: wrap;
		min-height: 100rpx;
		align-items: center;
		.title {
			margin-right: 20rpx;
		}
		.unit-item {
			margin: 10rpx 5rpx;
			background-color: #f8f8f8;
			color: #999;
			border-radius: 20px;
			border: 1px solid #999;
			padding: 0px 8px;
			min-height: 27px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			min-width: 80rpx;
		}
		.active-unit {
			border: 1px solid #f37b1d;
			background-color: #f37b1d;
			color: #fff;
		}
	}
	.amount {
		display: flex;
		align-items: center;
		padding: 20rpx;
		.number-box {
			display: flex;
			justify-content: center;
			color: #009688;

			.title {
				margin-right: 20rpx;
			}
			.input {
				width: 120rpx;
				height: 70rpx;
				color: rgb(50, 50, 51);
				font-size: 14px;
				background: rgb(242, 243, 245);
				text-align: center;
				position: relative;
				padding: 10rpx 0;
				margin: 0 3px;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #dcdfe6;
				border-radius: 10rpx;
			}
			.disabled {
				color: rgba($color: #009688, $alpha: 0.5);
				&.symbol {
					background: rgba($color: #d6e2eb, $alpha: 0.5);
				}
			}
			.symbol {
				border-radius: 10rpx;
				margin: 0 5rpx;
				padding: 10rpx 0;
				background: #d6e2eb;
				width: 120rpx;
				display: flex;
				justify-content: center;
				align-content: center;
				font-size: 20px;
				&:active {
					transform: scale(1.2);
				}
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}

	.cook-top {
		justify-content: center;
		font-weight: bold;
		padding: 10rpx;
	}
	.cooktype-wrap {
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		padding: 50rpx 20rpx;
		.cook-item {
			background-color: #f1f1f1;
			padding: 5rpx 30rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			transition: all 1s;
			letter-spacing: 2rpx;
			&:active {
				transform: scale(1.2);
			}
			&.active-cook-item {
				background-color: #007aff;
				color: #fff;
			}
		}
	}
	.dinner-time {
		display: flex;
		padding-left: 20rpx;
		align-items: center;
		flex-wrap: wrap;
		.title {
			margin-right: 20rpx;
		}
		.bx-radio.button-mode {
			margin-right: 5rpx;
			margin-bottom: 5rpx;
			padding: 0;
			/deep/.bx-radio__label {
				padding: 5rpx 20rpx;
				border: 1px solid #999;
				color: #999;
				background-color: #fff;
				letter-spacing: 0;
				font-size: 20rpx;
				&.checked {
					border: 1px solid #f37b1d;
					background-color: #f37b1d;
					color: #fff;
				}
			}
		}
	}
	.button-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin: 50rpx 0 20rpx;
		.button {
			background-color: #11c5bd;
			color: #fff;
			margin-right: 30rpx;
			flex: 1;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}
</style>
