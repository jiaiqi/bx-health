<template>
	<view class="test">
		<view class="node-path">
			<view class="path-item" v-for="(item, index) in linkPath" :key="item.no" @click="toPath(item)">
				<view class="name">{{ item.name }}</view>
				<view class="separator" v-if="index + 1 < linkPath.length"><view class="line"></view></view>
			</view>
		</view>
		<view class="charts" v-if="nodeDetail && nutrientsChartOption.option && nutrientsChartOption.option.title">
			<bx-echart @click-chart="clickCharts" class="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="nutrientsChartOption"></bx-echart>
		</view>
		<view class="detail-desc" v-if="nodeDetail">
			<!-- 		<txv-video
				:vid="nodeDetail.video_link"
				:playerid="nodeDetail.video_link"
				:autoplay="false"
				:poster="nodeDetail.video_link"
				:usePoster="true"
				v-if="nodeDetail.video_link"
			></txv-video> -->
			<view class="video-box">
				<video class="video-player" :src="txv_path" :usePoster="true" controls object-fit="contain"></video>
			</view>
			<view v-html="nodeDetail.node_desc" v-if="nodeDetail.node_desc" class="rich-text"></view>
		</view>
		<view class="data-empty" v-else-if="!nodeDetail || !nodeDetail.kn_no"><u-empty :text="emptyText"></u-empty></view>
	</view>
</template>

<script>
import bxEchart from '@/components/uni-ec-canvas/uni-echart.vue';
export default {
	components: {
		bxEchart
	},
	data() {
		return {
			txv_path: '',
			nutrientsChartOption: {
				option: {}
			},
			emptyText: '数据加载中...',
			radioValue: '',
			vaL: '',
			currentNodes: '健康',
			currentNodeNo: 'KN202011211458080001',
			options: [
				{
					id: 1646,
					option_no: '20201117095322001311',
					option_seq: 1,
					option_value: '没有或很少时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'A',
					value: '没有或很少时间',
					showimg: false,
					label: '没有或很少时间',
					checked: false
				},
				{
					id: 1647,
					option_no: '20201117095322001312',
					option_seq: 2,
					option_value: '小部分时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'B',
					value: '小部分时间',
					showimg: false,
					label: '小部分时间',
					checked: false
				},
				{
					id: 1648,
					option_no: '20201117095322001313',
					option_seq: 3,
					option_value: '相当多时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'C',
					value: '相当多时间',
					showimg: false,
					label: '相当多时间',
					checked: false
				},
				{
					id: 1649,
					option_no: '20201117095322001314',
					option_seq: 4,
					option_value: '绝大部分或全部时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'D',
					value: '绝大部分或全部时间',
					showimg: false,
					label: '绝大部分或全部时间',
					checked: false
				}
			],
			nodeDetail: null,
			linkPath: []
		};
	},
	methods: {
		async getCurrentNodeInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_graph_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_graph_select',
				colNames: ['*'],
				condition: [],
				page: { pageNo: 1, rownumber: 10 },
				order: [],
				draft: false
			};
		},
		async geteChartsData() {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_graph_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_graph_select',
				colNames: ['*'],
				relation_condition: {
					relation: 'OR',
					data: [{ colName: 'source_node_no', ruleType: 'eq', value: this.currentNodeNo }, { colName: 'target_node_no', ruleType: 'eq', value: this.currentNodeNo }]
				},
				page: { pageNo: 1, rownumber: 999 }
			};
			let res = await this.$http.post(url, req);
			let data = res.data.data;
			if (!res.data.data || !Array.isArray(res.data.data) || res.data.data.length == 0) {
				this.emptyText = '数据为空';
				return;
			}
			await this.getNodeDetail(this.currentNodeNo);
			let nameArr = [];
			let nodes = [];
			data.forEach((item, index) => {
				if (!nameArr.includes(item.target_name)) {
					if (item.target_name === this.currentNodes) {
						nodes.push({
							// symbol:
							// 	data.length === 4
							// 		? 'path://M512 0.310115l511.689885 511.689885-511.689885 511.689885-511.689885-511.689885z'
							// 		: data.length === 5
							// 		? 'path://M512 51.146296 1023.462964 422.744598 828.099456 1024.005115 195.900544 1024.005115 0.537036 422.744598Z'
							// 		: data.length === 6
							// 		? 'path://M512.024475 0l445.413275 255.984641V768.015359l-445.413275 255.984641L66.508806 768.015359V256.046077z'
							// 		: data.length == 7
							// 		? 'path://M522.666667 0l416.981333 200.810667 102.976 451.2-288.554667 361.834666H291.264L2.709333 652.010667l102.976-451.2z'
							// 		: data.length === 8
							// 		? 'path://M1024 512l-149.9648 362.0352L512 1024 149.9648 874.0352 0 512 149.9648 149.9648 512 0l362.0352 149.9648z'
							// 		: data.length > 8
							// 		? 'circle'
							// 		: 'diamond',
							symbol: 'diamond', //中间的节点
							name: item.target_name,
							nodeNo: item.target_node_no,
							category: 1
						});
					} else {
						nodes.push({
							name: item.target_name,
							nodeNo: item.target_node_no,
							category: 2
						});
					}
					nameArr.push(item.target_name);
				}
			});
			data.forEach((item, index) => {
				if (!nameArr.includes(item.source_name)) {
					nodes.push({
						name: item.source_name,
						nodeNo: item.source_node_no,
						category: 0,
						label: `${item.path_name ? item.path_name : ''} ${item.path_value ? `(${item.path_value})` : ''}`
					});
					nameArr.push(item.source_name);
				}
			});
			let links = data.map(item => {
				return {
					value: `  ${item.path_name ? item.path_name : ''} ${item.path_value ? `(${item.path_value})` : ''}`,
					label: { show: true },
					source: item.source_name,
					target: item.target_name,
					lineStyle: {
						color: item.source_name === self.currentNodes ? '#10a050' : '#006acc'
					}
				};
			});
			const color1 = '#006acc';
			const color2 = '#ff7d18';
			const color3 = '#10a050';

			nodes.forEach(node => {
				if (node.category === 0) {
					node.itemStyle = {
						color: color1
					};
				} else if (node.category === 1) {
					(node.x = 10), (node.y = 10);
					node.itemStyle = {
						color: color2
					};
				} else if (node.category === 2) {
					node.itemStyle = {
						color: color3
					};
				}
			});

			// links.forEach(link => {
			// 	link.label = {
			// 		align: 'center',
			// 		fontSize: 12
			// 	};
			// 	if (link.name === '参股') {
			// 		link.lineStyle = {
			// 			color: color2
			// 		};
			// 	} else if (link.name === '董事') {
			// 		link.lineStyle = {
			// 			color: color1
			// 		};
			// 	} else if (link.name === '法人') {
			// 		link.lineStyle = {
			// 			color: color3
			// 		};
			// 	}
			// });

			let categories = [
				{
					name: '源',
					itemStyle: {
						color: color1
					}
				},
				{
					name: '当前',
					itemStyle: {
						color: color2
					}
				},
				{
					name: '目标',
					itemStyle: {
						color: color3
					}
				}
			];
			let option = {
				title: {
					show: false
					// text: this.currentNodes
				},
				legend: [
					{
						show: false,
						// selectedMode: 'single',
						data: categories.map(x => {
							return x.name;
						}),
						icon: 'circle'
					}
				],
				series: [
					{
						type: 'graph',
						layout: 'force', // circular -环形布局 force -力引导布局 none -使用节点的x,y坐标作为节点的位置
						symbolSize: 58,
						// zoom: 0.5, //当前视角的缩放比例
						draggable: false, //可拖拽
						roam: true, //是否开启鼠标缩放和平移漫游 默认false,可配置scale -缩放 move -移动 true
						// focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
						categories: categories,
						edgeSymbol: ['circle', 'arrow'],
						edgeSymbolSize: [4, 10],
						// animationDurationUpdate: 5000,
						edgeLabel: {
							normal: {
								show: true,
								textStyle: {
									fontSize: 10
								},
								formatter: '{c}'
							}
						},
						lineStyle: {
							// color: 'source', //target
							width: 2,
							type: 'solid', //'solid','dashed','dotted'
							curveness: 0 //曲率
						},
						label: {
							show: true
						},
						force: {
							// layoutAnimation: false,
							initLayout: 'circular',
							// gravity: 0.1, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢
							repulsion:
								nodes.length <= 2
									? 900
									: nodes.length < 5 && nodes.length > 2
									? 800
									: nodes.length >= 5 && nodes.length < 10
									? 700
									: nodes.length > 15 && nodes.length <= 20
									? 600
									: 500, // 节点之间的斥力因子,值越大斥力越大
							edgeLength:
								nodes.length <= 2
									? 150
									: nodes.length < 5 && nodes.length > 2
									? 120
									: nodes.length >= 5 && nodes.length < 7
									? 100
									: nodes.length >= 7 && nodes.length < 10
									? 70
									: nodes.length >= 10 && nodes.length < 13
									? 70
									: nodes.length >= 10 && nodes.length < 13
									? 60
									: nodes.length >= 13 && nodes.length <= 15
									? 60
									: nodes.length > 15 && nodes.length <= 18
									? 30
									: 20 //边的两个节点之间的距离，这个距离也会受 repulsion影响，支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长
						},
						data: nodes,
						links: links
					}
				]
			};
			this.nutrientsChartOption.option = option;
		},
		async getNodeDetail(no) {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_node_select',
				colNames: ['*'],
				relation_condition: {
					relation: 'OR',
					data: [{ colName: 'kn_no', ruleType: 'eq', value: no }]
				},
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.nodeDetail = res.data.data[0];
				if (this.nodeDetail && this.nodeDetail.video_link) {
					this.getVideoInfo(this.nodeDetail.video_link);
				}
				this.currentNodes = this.nodeDetail.node_name;
				// this.linkPath.push({
				// 	no: this.nodeDetail.kn_no,
				// 	name: this.nodeDetail.node_name
				// });
				this.changeLinkPath({
					no: this.nodeDetail.kn_no,
					name: this.nodeDetail.node_name
				});
			} else {
				this.nodeDetail = null;
			}
		},
		toPath(e) {
			if (e.no && e.name && this.currentNodeNo !== e.no) {
				this.currentNodeNo = e.no;
				this.currentNodes = e.name;
				// this.getNodeDetail(e.no);
				this.geteChartsData();
				this.changeLinkPath(e);
			}
		},
		changeLinkPath(e) {
			let arr = this.linkPath;
			if (arr.length > 0) {
				let hasNode = false;
				let nodeIndex = -1;
				arr.forEach((item, index) => {
					if (e.no === item.no) {
						hasNode = true;
						nodeIndex = index;
					}
				});
				if (!hasNode) {
					this.linkPath.push({
						name: e.name,
						no: e.no
					});
				} else if (hasNode && nodeIndex >= 0) {
					this.linkPath = this.linkPath.splice(0, nodeIndex + 1);
				}
			} else {
				this.linkPath.push({
					name: e.name,
					no: e.no
				});
			}
		},
		clickCharts(e) {
			if (e.data && e.data.nodeNo && e.data.nodeNo !== this.currentNodeNo) {
				this.currentNodes = e.name;
				this.currentNodeNo = e.data.nodeNo;
				this.geteChartsData();
				// this.getNodeDetail(e.data.nodeNo);
				this.changeLinkPath({ name: e.name, no: e.data.nodeNo });
			}
		},
		getVideoInfo: function(vid) {
			var that = this;
			var urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
			wx.request({
				url: urlString,
				success: function(res) {
					var dataJson = res.data.replace(/QZOutputJson=/, '') + 'qwe';
					var dataJson1 = dataJson.replace(/;qwe/, '');
					var data = JSON.parse(dataJson1);
					var fn_pre = data.vl.vi[0].lnk;
					var host = data['vl']['vi'][0]['ul']['ui'][0]['url'];
					var streams = data['fl']['fi'];
					var seg_cnt = data['vl']['vi'][0]['cl']['fc'];
					if (parseInt(seg_cnt) == 0) {
						seg_cnt = 1;
					}
					var best_quality = streams[streams.length - 1]['name'];
					var part_format_id = streams[streams.length - 1]['id'];
					var pageArr = [];
					for (var i = 1; i < seg_cnt + 1; i++) {
						var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
						console.log(filename);
						pageArr.push(i);
						that.requestVideoUrls(part_format_id, vid, filename, 'index' + i, host);
					}
				}
			});
		},
		requestVideoUrls: function(part_format_id, vid, fileName, index, host) {
			var keyApi = 'https://vv.video.qq.com/getkey?otype=json&platform=11&format=' + part_format_id + '&vid=' + vid + '&filename=' + fileName + '&appver=3.2.19.333';
			var that = this;
			wx.request({
				url: keyApi,
				success: function(res) {
					var dataJson = res.data.replace(/QZOutputJson=/, '') + 'qwe';
					var dataJson1 = dataJson.replace(/;qwe/, '');
					var data = JSON.parse(dataJson1);
					var part_urls = new Array();
					if (data.key != undefined) {
						var vkey = data['key'];
						var url = host + fileName + '?vkey=' + vkey;
						part_urls[index] = String(url);
						that.txv_path = part_urls.index1;
						// that.setData({
						// 	videoUrl: part_urls.index1
						// });
					}
				}
			});
		}
	},

	onLoad(options) {
		if (options.currentNodeNo) {
			this.currentNodeNo = options.currentNodeNo;
		}
		this.geteChartsData();
		// uni.setNavigationBarTitle({
		// 	title: this.currentNodes
		// });
	},
	onReady() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	}
};
</script>

<style lang="scss">
.test {
	width: 100%;
	min-height: 100vh;
	background-color: #fff;
	padding: 20rpx;
	.data-empty {
		width: 100%;
		margin-top: 30vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.charts {
		width: calc(100% - 40rpx);
		height: 700rpx;
		margin-bottom: 20rpx;
	}
	.detail-desc {
		padding: 20rpx;
		text-indent: 20rpx;
		.video-box{
			text-indent: 0;
			width: 100%;
			.video-player{
				width: 100%;
			}
		}
		.rich-text {
			width: 100%;
			overflow: hidden;
		}
	}
	.node-path {
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
		.path-item {
			display: flex;
			line-height: 40rpx;
			margin-bottom: 20rpx;
			.name {
				background-color: #0081ff;
				border-radius: 50rpx;
				padding: 5rpx 20rpx;
				font-size: 24rpx;
				color: #fff;
			}
			.separator {
				display: inline-flex;
				align-items: center;
				position: relative;
				margin-right: 5rpx;
				.line {
					display: inline-block;
					height: 5rpx;
					width: 40rpx;
					background-color: #0081ff;
					&::after {
						content: '';
						border: 10rpx solid transparent;
						border-left-color: #0081ff;
						position: absolute;
						right: -15rpx;
						top: calc(50% - 10rpx);
					}
				}
			}
		}
	}
}
</style>
