<template>
	<view class="qiun-charts"><canvas :canvas-id="canvasId" :id="canvasId" class="charts"></canvas></view>
</template>

<script>
import uCharts from '@/publicPages/components/u-charts/u-charts.js';
var _self;
var canvaGauge = null;
export default {
	props: {
		canvasId: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			chartData: {
				categories: [
					{
						value: 0.2,
						color: 'rgb(141, 198, 63)'
					},
					{
						value: 0.8,
						color: 'rgb(255, 179, 71)'
					},
					{
						value: 1,
						color: '#00c2ff'
					}
				],
				series: [
					{
						// name: '完成率',
						data: 0.5
					}
				]
			},
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			gaugeWidth: 15
		};
	},
	methods: {
		getServerData() {
			this.showGauge(this.canvasId, this.chartData);
		},
		showGauge(canvasId, chartData) {
			let _self = this;
			canvaGauge = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'gauge',
				fontSize: 11,
				legend: false,
				title: {
					name: Math.round(chartData.series[0].data * 100) + '%',
					color: chartData.categories[1].color,
					fontSize: 16 * _self.pixelRatio,
					offsetY: 50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
				},
				subtitle: {
					name: chartData.series[0].name,
					color: '#666666',
					fontSize: 16 * _self.pixelRatio,
					offsetY: -50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
				},
				extra: {
					gauge: {
						type: 'default',
						width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
						startAngle: 0.75,
						endAngle: 0.25,
						startNumber: 0,
						endNumber:80,
						splitLine: {
							fixRadius: 0,
							splitNumber: 10,
							width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
							color: '#FFFFFF',
							childNumber: 5,
							childWidth: _self.gaugeWidth * 0.4 * _self.pixelRatio //仪表盘背景的宽度
						},
						pointer: {
							width: _self.gaugeWidth * 0.8 * _self.pixelRatio, //指针宽度
							color: 'auto'
						}
					}
				},
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				categories: chartData.categories,
				series: chartData.series,
				animation: true,
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				dataLabel: true
			});
		}
	},
	mounted() {
		_self = this;
		this.cWidth = uni.upx2px(230);
		this.cHeight = uni.upx2px(250);
		this.getServerData();
	}
};
</script>

<style lang="scss" scoped>
.qiun-charts {
	width: 230upx;
	height: 250upx;
	background-color: #ffffff;
}
.charts {
	width:230upx;
	height: 250upx;
	background-color: #ffffff;
}
</style>
