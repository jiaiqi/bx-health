<template>
	<view class="pathogen-wrap">
		<view class="uni-ec-canvas-bot">
			<!-- #ifdef MP-WEIXIN -->
				<uniEcCanvas class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcCanvas>
			<!-- #endif -->
			<!-- #ifdef H5 -->
				<uniEcharts @click-chart="test" class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcharts>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import uniEcCanvas from '@/disease/components/uni-ec-canvas/uni-ec-canvas.vue';
	// #endif
	// #ifdef H5
	import uniEcharts from '@/disease/components/uni-ec-canvas/uni-echarts.vue';
	// #endif
	export default {
		name:'pathogen',
		data(){
			return {
				stepData: {
					option: {
						title: {
						        text: '病因展示'
						    },
						    tooltip: {},
							clickable :true,
						    animationDurationUpdate: 1500,
						    animationEasingUpdate: 'quinticInOut',
						    series: [
						        {
						            type: 'graph',
						            layout: 'none',
						            // layout: 'circular',
									symbol:'roundRect',//diamond---菱形、triangle---三角形、circle---圆形、rect---方形、roundRect---圆角方形
						            symbolSize: '50',
						            roam: false,
						            label: {
						                show: true
						            },
						            edgeSymbol: ['circle', 'arrow'],
						            edgeSymbolSize: [4, 10],
						            edgeLabel: {
						                fontSize: 12
						            },
						            data: [{
						                name: '家族史1、家族史2',
						                x: 20,
						                y: 40,
										label:{
											fontSize:10,
											lineHeight:10,
											padding:[0,0,0,0],
											 formatter:(val)=>{
												 let str = val.name
												let endstr = str.split('、').join('\n')
												 return [`{a|${endstr}}`]
											 },
											 rich:{
												  a: {
													 color: 'white',
													 lineHeight: 15,
												 },
											 }
										},
										
						            }, {
						                name: '高盐饮食',
						                x: 20,
						                y: 350
						            }, {
						                name: '肥胖',
						                x: 20,
						                y: 450
						            }, {
						                name: '情绪',
						                x: 20,
						                y: 570
						            }, {
						                name: '紧张',
						                x: 250,
						                y: 570
						            }, {
						                name: '血压升高',
						                x: 480,
						                y: 200
						            }],
						            // links: [],
						            links: [
									// {
						   //              source: 0,
						   //              target: 1,
						   //              symbolSize: [5, 20],
						   //              label: {
						   //                  show: true
						   //              },
						   //              lineStyle: {
						   //                  width: 5,
						   //                  curveness: 0.2
						   //              }
						   //          },
									{
										source:0,
										target:5,
										label: {
										    show: true,
											formatter:'30%'
										},
									},
									 {
						                source: '高盐饮食',
						                target: '血压升高',
										label: {
										    show: true,
											formatter:'20%'
										},
						            }, {
						                source: '肥胖',
						                target: '血压升高',
										label: {
										    show: true,
											formatter:'25%'
										},
						            }, {
						                source: '情绪',
						                target: '紧张'
						            }, {
						                source: '紧张',
						                target: '血压升高',
										label: {
										    show: true,
											formatter:'20%'
										},
						            }],
						            lineStyle: {
						                opacity: 0.9,
						                width: 1,
						                curveness: 0,
										type:'dashed'
						            }
						        }
						    ]
					}
				},
			}
		},
		components:{
			// #ifdef MP-WEIXIN
			uniEcCanvas,
			// #endif
			// #ifdef H5
			uniEcharts
			// #endif
		},
		
		methods:{
			test(e){
				uni.navigateTo({
					url:'/disease/pathogen/pathogenDetail?detail=' + encodeURIComponent(JSON.stringify(e.data))
				})
				console.log("e------1212--",e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pathogen-wrap{
		height: 100vh;
		background-color: white;
		overflow-x: hidden;
		.uni-ec-canvas-bot{
			padding: 20rpx 0 0 20rpx;
			width: 750rpx;
			height: 100vh;
			.uni-ec-canvas {
				width: 750rpx;
				height: 900rpx;
			}
		}
	}
</style>
