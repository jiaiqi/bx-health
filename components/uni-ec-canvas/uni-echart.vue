<template>
	<!-- #ifdef H5 -->
	<uni-echarts class="uni-ec-canvas" :ec="ec" :canvasId="canvasId" v-if="clientEnv === 'web' && ec && ec.option" @click-chart="clickChart"></uni-echarts>
	<!-- #endif -->
	<!-- #ifdef MP-WEIXIN -->
	<uni-ec-canvas class="uni-ec-canvas" :ec="ec" :canvasId="canvasId" v-else-if="clientEnv === 'wxmp' && ec && ec.option" @click-chart="clickChart"></uni-ec-canvas>
	<!-- #endif -->
</template>

<script>
// #ifdef MP-WEIXIN
import uniEcCanvas from './uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from './uni-echarts.vue';
// #endif
export default {
	components: {
		// #ifdef MP-WEIXIN
		uniEcCanvas,
		// #endif
		// #ifdef H5
		uniEcharts
		// #endif
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
	computed: {
		clientEnv() {
			let env = uni.getStorageSync('client_env');
			return env;
		}
	},
	watch: {
		'ec.option': {
			deep: true,
			handler(val, oldVal) {}
		}
	},
	methods: {
		clickChart(e) {
			this.$emit('click-chart', e);
		}
	}
};
</script>

<style>
.uni-ec-canvas {
	width: 100%;
	height: 100%;
}
</style>
