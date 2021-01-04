<template>
	<view class="handler-bar">
		<view class="cook-type-box" v-if="dietInfo">
			<view class="title">烹调方式:</view>
			<!-- <view class="current-cook-type cook-type" v-if="dietInfo.cook_method" @click="showTypeSelector = true">{{ dietInfo.cook_method }}</view> -->
			<view
				class="cook-type"
				:class="{ 'current-cook-type': item.value === cook_method || item.value === dietInfo.cook_method }"
				@click="changeCookMethod(true, item.value)"
				v-for="item in defaultCookTypes"
				:key="item.value"
			>
				{{ item.value }}
			</view>
			<text class="cook-type" v-if="!dietInfo.cook_method || !dietInfo.diet_record_no" @click="showTypeSelector = true">更多</text>
			<text class="lg text-gray cuIcon-right" v-if="cookTypes.length > 0"></text>
		</view>
		<view class="dinner-time unit-box">
			<view class="title">时间:</view>
			<!-- 			<bx-radio-group v-model="dining_type" mode="button">
				<bx-radio v-for="item in dinnerTime" :key="item.value" :name="item.value">{{ item.value }}</bx-radio>
			</bx-radio-group> -->
			<view class="unit-item" :class="{ 'active-unit': dining_type === u.value }" v-for="(u, index) in dinnerTime" :key="index" @click="changeDiningType(u, index)">
				{{ u.value }}
			</view>
		</view>
		<view class="dinner-time unit-box">
			<view class="title">单位:</view>
			<!-- <bx-radio-group v-model="dietInfo.unit" mode="button" v-if="unitList.length > 0">
				<bx-radio :key="item.value" :name="item.value" v-for="(item, index) in unitList" @change="checkUnit(item, index)">{{ item.value }}</bx-radio>
			</bx-radio-group> -->
			<view class="unit-item" :class="{ 'active-unit': dietInfo.unit === u.unit }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">
				{{ u.unit_weight_g && u.unit === 'g' ? u.unit_weight_g + u.unit : u.unit_amount && u.unit === 'g' ? u.unit_amount + u.unit : u.unit }}
			</view>
		</view>
		<view class="amount">
			<view class="title">数量:</view>
			<view class="number-box">
				<text @click="changeAmount('minus', 0.1)" class="symbol">-0.1</text>
				<text @click="changeAmount('minus')" class="symbol">-1</text>
				<input class="input" v-model.number="dietInfo.amount" type="number" />
				<text @click="changeAmount('plus')" class="symbol">+1</text>
				<text @click="changeAmount('plus', 0.1)" class="symbol">+0.1</text>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showTypeSelector }">
			<view class="cu-dialog" @tap.stop="">
				<view class=" bg-white cook-top"><text>常见烹调方式</text></view>
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
			cook_method: this.dietInfo && this.dietInfo.cook_method ? this.dietInfo.cook_method : '',
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
			]
		};
	},
	props: {
		dietInfo: {
			type: Object
		}
	},
	watch: {
		dietInfo: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				this.cook_method = newValue.cook_method;
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
		async getFoodUnit() {
			// 查找当前食物的单位
			if (!this.dietInfo.diet_record_no && !this.dietInfo.food_no) {
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
			if (this.dietInfo.unit !== 'g') {
				let basicUnit = this.deepClone(this.dietInfo);
				basicUnit.unit = 'g';
				basicUnit.amount = 1;
				basicUnit.energy = (this.dietInfo.energy * 100) / this.dietInfo.unit_weight_g;
				basicUnit.unit_weight_g = 100;
				unitList.push(basicUnit);
			} else {
				unitList.push(this.dietInfo);
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
			if (this.dietInfo.cook_method_default) {
				this.defaultCookTypes = this.dietInfo.cook_method_default.split(',').map(item => {
					return {
						label: item,
						value: item,
						checked: false
					};
				});
			}
			if (this.dietInfo.cook_method) {
				if (!this.defaultCookTypes.find(item => item.value === this.dietInfo.cook_method)) {
					this.defaultCookTypes.push({
						label: this.dietInfo.cook_method,
						value: this.dietInfo.cook_method,
						checked: true
					});
				}
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
				this.cook_method = this.dietInfo.cook_method;
			}
			let index = this.defaultCookTypes.findIndex(item => item.value !== this.dietInfo.cook_method && this.dietInfo.cook_method_default.indexOf(item.value) === -1);
			this.defaultCookTypes.splice(index, 1);
			if (!this.defaultCookTypes.find(item => item.value === this.dietInfo.cook_method)) {
				this.defaultCookTypes.push({
					label: this.dietInfo.cook_method,
					value: this.dietInfo.cook_method,
					checked: true
				});
			}
			this.showTypeSelector = false;
		},
		changeDiningType(item) {
			this.dining_type = item.value;
			this.$emit('changeDiningType',this.dining_type)
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
			margin: 0 10rpx;
			border-radius: 50rpx;
			padding: 4rpx 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 5px;
			color: #fff;
			border: 1px solid #f1f1f1;
			background-color: #f1f1f1;
			color: #333;
		}
		.current-cook-type {
			color: #f37b1d;
			border: 1px solid #f37b1d;
			background-color: rgba($color: #ffaf0e, $alpha: 0.3);
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
			font-size: 20rpx;
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
