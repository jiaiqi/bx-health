<template>
	<div>
		<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
		<div :id="canvasId" style="width: 100%;height:100%;"></div>
	</div>
</template>

<script>
import * as echarts from "./echarts.mini.js";
// import * as echarts from './echarts.min.js';
export default {
	data() {
		return {
			chartInstance: null
		};
	},
	props: {
		canvasId: {
			type: String,
			default: () => {
				return 'ec-canvas';
			}
		},
		ec: {
			type: Object
		}
	},
	methods: {
		setOption(val) {
			if (this.chartInstance) {
				this.chartInstance.clear();
				this.chartInstance.setOption(val);
				// this.chartInstance.setOption(val);
			} else {
				this.initChart();
			}
		},
		initChart() {
			this.chartInstance = echarts.init(document.getElementById(this.canvasId));
			this.chartInstance.on('click', e => {
				console.log(e); // 这里就可以收到echart发来的事件了
				this.$emit('click-chart', e);
			});
			this.setOption(this.ec.option);
		}
	},
	watch: {
		'ec.option': {
			deep: true,
			handler(val, oldVal) {
				if (val) {
					this.setOption(val);
				}
			}
		}
	},
	mounted() {
		if (!this.ec) {
			console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
			return;
		}
		this.initChart();
	}
};
</script>

<style scoped></style>
