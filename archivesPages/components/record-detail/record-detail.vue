<template>
	<view class="cu-dialog current-diet-detail" v-if="recordDetail">
		<view class="title-bar" v-if="recordDetail.hdate && recordDetail.htime">
			<view class="date">{{ recordDetail.hdate + ' ' + recordDetail.htime.slice(0, 5) }}</view>
		</view>
		<view class="diet-info">
			<view class="img"><image width="100%" height="100%" :src="imgPath"></image></view>
			<view class="info">
				<view class="name">
					{{ recordDetail.name }}
					<view class="delete-icon" @click="deleteItem(recordDetail)">
						<text class="text">删除记录</text>
						<text class="cuIcon-delete"></text>
					</view>
				</view>
				<view class="weight">
					<text class="label margin-right-xs">热量:</text>
					<text class="heat">
						{{ recordDetail.energy }}
						<text class="unit">千卡</text>
					</text>
				</view>
				<view class="">
					<text class="label text-bold margin-right-xs">单位:</text>
					<text class="unit">{{ recordDetail.unit }}</text>
				</view>
			</view>
			<view class="chart-box"><uni-ec-canvas class="uni-ec-canvas" canvas-id="uni-ec-canvas2" :ec="currentDietChartData"></uni-ec-canvas></view>
			<view class="unit-box" v-if="type === 'food'">
				<view class="title">单位:</view>
				<view class="unit-item" :class="{ 'active-unit': currentUnitIndex === index }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">
					{{ u.unit_weight_g && u.unit === 'g' ? u.unit_weight_g + u.unit : u.unit }}
				</view>
			</view>
			<view class="amount">
				<view class="title">数量:</view>
				<view class="number-box">
					<text @click="changeCurrentVal('minus', 0.1)" class="symbol">-0.1</text>
					<text @click="changeCurrentVal('minus')" class="symbol">-1</text>
					<input class="input" @change="changeValue" v-model.number="recordDetail.amount" type="number" />
					<text @click="changeCurrentVal('plus')" class="symbol">+1</text>
					<text @click="changeCurrentVal('plus', 0.1)" class="symbol">+0.1</text>
				</view>
			</view>
		</view>
		<view class="delete-bar">
			<view class="btn bg-grey" @click="cancel">取消</view>
			<view class="btn bg-blue" @click="confirm">确认</view>
		</view>
	</view>
</template>

<script>
import uniEcCanvas from '../uni-ec-canvas/uni-echart.vue';
export default {
	components: {
		uniEcCanvas
	},
	props: {
		type: {
			type: String,
			default: 'food'
		},
		recordDetail: {
			type: Object
		},
		chartData: {
			type: Object
		},
		unitList: {
			type: Array
		}
	},
	computed: {
		imgPath() {
			let currentDiet = this.recordDetail;
			if (currentDiet && currentDiet.image) {
				return this.$api.downloadFile + currentDiet['image'] + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		}
	},
	methods: {
		changeValue(e){
			this.$emit('valueChange', e);
		},
		deleteItem(e) {
			this.$emit('delete', e);
		},
		checkUnit(item, index) {
			this.$emit('changeUnit', { unit: item, index });
		},
		changeAmount(type = 'plus', step = '1') {
			this.$emit('changeAmount', { type, step });
		},
		cancel() {
			this.$emit('cancel');
		},
		confirm() {
			this.$emit('confirm');
		}
	}
};
</script>

<style scoped lang="scss">
.uni-ec-canvas {
	height: 550rpx;
	width: 100%;
}
</style>
