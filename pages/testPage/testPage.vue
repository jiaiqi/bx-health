<template>
	<view class="test">
<!-- 		<bx-radio-group v-model="radioValue">
			<bx-radio v-for="item in options" :key="item.id" :name="item.value" :serial-char="item.option_view_no">{{ item.label }}</bx-radio>
		</bx-radio-group>
		<bx-checkbox-group v-model="vaL" checkboxMode="button">
			<bx-checkbox v-for="item in options" v-model="item.checked" :key="item.id" :name="item.value">{{ item.label }}</bx-checkbox>
		</bx-checkbox-group> -->
		<view class="charts"><bx-echart @click-chart="clickCharts" class="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="nutrientsChartOption"></bx-echart></view>
		<view class="detail-desc" v-if="nodeDetail && nodeDetail.node_desc"><view v-html="nodeDetail.node_desc"></view></view>
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
			nutrientsChartOption: {
				option: {}
			},
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
					label: '没有或很少时间'
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
					label: '小部分时间'
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
					label: '相当多时间'
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
					label: '绝大部分或全部时间'
				}
			],
			nodeDetail: null
		};
	},
	created() {
		this.geteChartsData();
		this.getNodeDetail(this.currentNodeNo);
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
					data: [{ colName: 'source_name', ruleType: 'eq', value: this.currentNodes }, { colName: 'target_name', ruleType: 'eq', value: this.currentNodes }]
				},
				page: { pageNo: 1, rownumber: 999 }
			};
			let res = await this.$http.post(url, req);

			let data = res.data.data;
			if (!res.data.data || !Array.isArray(res.data.data) || res.data.data.length == 0) {
				return;
			}
			let nameArr = [];
			let nodes = [];
			data.forEach((item, index) => {
				if (!nameArr.includes(item.target_name)) {
					if (item.target_name === this.currentNodes) {
						nodes.push({
							name: item.target_name,
							nodeNo: item.target_node_no,
							category: 1,
							x: 10,
							y: 10
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
						// symbol:self.getImageInfo({name:'大脑',url:'https://tse2-mm.cn.bing.net/th/id/OIP.7LO7HWiD7HGGkBHMMMseyAHaHa?pid=Api&rs=1'}), //'image://https://tse2-mm.cn.bing.net/th/id/OIP.7LO7HWiD7HGGkBHMMMseyAHaHa?pid=Api&rs=1',
						// symbol:'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
						// #ifdef H5
						symbol: 'image://https://tse2-mm.cn.bing.net/th/id/OIP.SaoRSpQ1Ff9hc-F2U6dI3QHaHa?pid=Api&rs=1',
						// #endif
						name: item.source_name,
						nodeNo: item.source_node_no,
						target_node_no: item.target_node_no,
						source_node_no: item.source_node_no,
						category: 0,
						label: `${item.path_name ? item.path_name : ''} ${item.path_value ? `(${item.path_value})` : ''}`
					});
					nameArr.push(item.source_name);
				}
			});
			let links = data.map(item => {
				return {
					value: `  ${item.path_name ? item.path_name : ''} (${item.path_value ? item.path_value : '0'})`,
					label: { show: true },
					source: item.source_name,
					target: item.target_name
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
					text: this.currentNodes
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
						roam: 'scale', //是否开启鼠标缩放和平移漫游 默认false,可配置scale -缩放 move -移动 true
						// focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
						categories: categories,
						edgeSymbol: ['circle', 'arrow'],
						edgeSymbolSize: [4, 10],
						// animationDurationUpdate: 5000,
						edgeLabel: {
							normal: {
								position: 'middle',
								show: true,
								textStyle: {
									fontSize: 10
								},
								formatter: '{c}'
							}
						},
						lineStyle: {
							color: 'target',
							width: 2,
							type: 'solid', //'solid','dashed','dotted'
							curveness: 0 //曲率
						},
						autoCurveness: 10,
						label: {
							show: true
						},
						force: {
							// layoutAnimation: false,
							gravity: 0.1, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢
							repulsion: nodes.length < 5 ? 1000 : 800, // 节点之间的斥力因子,值越大斥力越大
							edgeLength: [20, 150] //边的两个节点之间的距离，这个距离也会受 repulsion影响，支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长
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
			} else {
				this.nodeDetail = null;
			}
		},
		clickCharts(e) {
			if (e.name !== this.currentNodes) {
				this.currentNodes = e.name;
				if (e.data.nodeNo) {
					this.getNodeDetail(e.data.nodeNo);
				}
				this.geteChartsData();
			}
		},
		checkboxChange(e) {}
	},

	onLoad(options){
		if(options.currentNode&&options.currentNodeNo){
			this.currentNodes = options.currentNode
			this.currentNodeNo = options.currentNodeNo
		}
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
	.charts {
		width: calc(100% - 40rpx);
		height: 700rpx;
		margin: 0 20rpx;
	}
	.detail-desc {
		padding: 20rpx;
		text-indent: 40rpx;
	}
}
</style>
