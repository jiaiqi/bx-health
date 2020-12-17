<template>
	<view class="handler-bar">
		<view class="cook-type-box" v-if="dietInfo">
			<view class="title">烹调方式:</view>
			<view class="current-cook-type" v-if="dietInfo.cook_method" @click="showTypeSelector = true">{{ dietInfo.cook_method }}</view>
			<text class="" v-if="!dietInfo.cook_method" @click="showTypeSelector = true">(点击选择烹调方式)</text>
			<text class="lg text-gray cuIcon-right" v-if="cookTypes.length > 0"></text>
		</view>
		<view class="unit-box">
			<view class="title">单位:</view>
			<view class="unit-item" :class="{ 'active-unit': dietInfo.unit === u.unit }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">
				{{ u.unit_weight_g && u.unit === 'g' ? u.unit_weight_g + u.unit : u.unit }}
			</view>
		</view>
		<view class="amount">
			<view class="title">数量:</view>
			<view class="number-box">
				<text @click="changeAmount('minus', 0.1)" class="symbol">-0.1</text>
				<text @click="changeAmount('minus')" class="symbol">-1</text>
				<input class="input" @change="changeValue" v-model.number="dietInfo.amount" type="number" />
				<text @click="changeAmount('plus')" class="symbol">+1</text>
				<text @click="changeAmount('plus', 0.1)" class="symbol">+0.1</text>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showTypeSelector }">
			<view class="cu-dialog">
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
			cook_method: this.dietInfo && this.dietInfo.cook_method ? this.dietInfo.cook_method : '',
			cookTypes: [],
			unitList: []
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
				this.cook_method = newValue.cook_method
				if(this.unitList.length===0){
					this.getFoodUnit()
				}
			}
		}
	},
	methods: {
		async getFoodUnit() {
			// 查找当前食物的单位
			if (!this.dietInfo.diet_record_no) {
				return;
			}
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [{ colName: 'food_no', ruleType: 'eq', value: this.dietInfo.diet_contents_no ? this.dietInfo.diet_contents_no : this.dietInfo.mixed_food_no }],
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
			this.unitList = this.deepClone(unitList);
			return unitList;
		},
		async getCookTypes() {
			let colVs = await this.getServiceV2('srvhealth_diet_contents_select', 'list', 'list', 'health');
			let colData = colVs.srv_cols;
			colData.forEach(item => {
				if (item.columns === 'cook_method') {
					this.cookTypes = item.option_list_v2;
				}
			});
		},
		changeCookMethod(isChange) {
			if (isChange) {
				this.$emit('changeCookMethod', this.cook_method);
			} else {
				this.cook_method = this.dietInfo.cook_method;
			}
			this.showTypeSelector = false;
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
	created() {
		this.getCookTypes();
		
	}
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
		.current-cook-type {
			margin: 0 10rpx;
			border-radius: 50rpx;
			padding: 4rpx 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 5px;
			min-width: 100rpx;
			border: 1px solid #f37b1d;
			background-color: #f37b1d;
			color: #fff;
		}
	}
	.unit-box {
		width: 100%;
		display: flex;
		padding: 0 20rpx;
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
			min-width: 100rpx;
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
				color: rgb(50, 50, 51);
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
		padding: 20rpx;
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
	.button-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin: 30rpx 0;
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
