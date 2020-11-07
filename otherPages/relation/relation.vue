<template>
	<view class="health-relation">
		<!-- 疾病与病症、病因关系 -->
		<view class="relation">
			<!-- <relationCharts class="relation-charts"></relationCharts> -->
			<bx-graph-chart class="relation-charts"></bx-graph-chart>
			<view class="illness-box content-box">
				<view class="title">{{ illness.label }}</view>
				<view class="illness content-item">{{ illness.name }}</view>
			</view>
			<view class="symptom-box content-box">
				<view class="title">{{ illness.symptom.label }}</view>
				<view class="symptom content-item" v-for="(item, index) in illness.symptom.list" :key="item">{{ item }}</view>
			</view>
			<view class="cause-box content-box">
				<view class="title">{{ illness.cause.label }}</view>
				<view class="cause content-item" v-for="(item, index) in illness.cause.list" :key="item">{{ item }}</view>
			</view>
			<view class="cause-box content-box">
				<view class="title">简介</view>
				<view class="description">
					感冒，习惯上分为病毒性感冒和细菌性感冒。或者普通感冒和流行性感冒 病毒性感冒有:普通感冒，流行性感冒和病毒性咽炎等。 细菌性感冒有:细菌性咽扁桃体炎。
					其主要不同是致病因素不同,病毒性感冒是由于病毒所致，而细菌性感冒是由细菌所致。
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import bxGraphChart from '@/otherPages/components/bx-graph-chart/bx-graph-chart.vue';
export default {
	components: {
		bxGraphChart
	},
	data() {
		return {
			ill:[
				{
					label:"疾病",
				}
			],
			illness: {
				label: '疾病',
				name: '高血压',
				symptom: {
					label: '病症',
					list: ['头痛', '疲倦不安', '心律失常', '心悸', '耳鸣']
				}, //症状
				cause: {
					label: '病因',
					list: ['病毒', '细菌']
				} //病因
			}
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.health-relation {
	display: flex;
	flex-direction: column;
	background-color: #f1f1f1;
	height: 100vh;
	overflow-y: scroll;
	.content-box {
		margin: 10rpx;
		display: flex;
		border-radius: 5rpx;
		background-color: #fff;
		flex-wrap: wrap;
		padding: 10rpx;
		.title {
			width: 100%;
			font-weight: 700;
		}
		.description {
			padding: 10rpx;
			line-height: 24px;
		}
		.content-item {
			background-color: #f1f1f1;
			color: #333;
			width: calc(33.33333% - 20rpx);
			height: 150rpx;
			margin: 10rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
