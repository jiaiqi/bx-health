<template>
	<view class="test">
		<!-- 		<bx-radio-group v-model="radioValue">
			<bx-radio v-for="item in options" :key="item.id" :name="item.value" :serial-char="item.option_view_no">{{ item.label }}</bx-radio>
		</bx-radio-group>
		<bx-checkbox-group v-model="vaL">
			<bx-checkbox v-for="item in options" v-model="item.checked" :key="item.id" :name="item.value">{{ item.label }}</bx-checkbox>
		</bx-checkbox-group> -->
		<view class="detail-desc" v-if="nodeDetail && nodeDetail.node_desc"><view v-html="nodeDetail.node_desc"></view></view>
		<view class="charts"><bx-echart @click-chart="clickCharts" class="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="nutrientsChartOption"></bx-echart></view>
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
			currentNodeNo:'KN202011211458080001',
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
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_graph_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_graph_select',
				colNames: ['*'],
				relation_condition: {
					relation: 'OR',
					data: [{ colName: 'source_name', ruleType: 'eq', value: this.currentNodes }, { colName: 'target_name', ruleType: 'eq', value: this.currentNodes }]
				},
				page: { pageNo: 1, rownumber: 10 }
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
							nodeNo:item.target_node_no,
							category: 1,
							label: `${item.path_name?item.path_name:''} (${item.path_value ? item.path_value : '0'})`
						});
					} else {
						nodes.push({
							name: item.target_name,
							nodeNo:item.target_node_no,
							category: 2,
							label: `${item.path_name?item.path_name:''} (${item.path_value ? item.path_value : '0'})`
						});
					}
					nameArr.push(item.target_name);
				}
			});
			data.forEach((item, index) => {
				if (!nameArr.includes(item.source_name)) {
					nodes.push({
						name: item.source_name,
						nodeNo:item.source_node_no,
						target_node_no: item.target_node_no,
						source_node_no: item.source_node_no,
						category: 0,
						label: `${item.path_name?item.path_name:''} (${item.path_value ? item.path_value : '0'})`
					});
					nameArr.push(item.source_name);
				}
			});
			let links = data.map(item => {
				return {
					value: `${item.path_name?item.path_name:''} (${item.path_value ? item.path_value : '0'})`,
					label: { show: true },
					source: item.source_name,
					target: item.target_name,
					name: `${item.path_name?item.path_name:''} (${item.path_value ? item.path_value : '0'})`
				};
			});
			const color1 = '#006acc';
			const color2 = '#ff7d18';
			const color3 = '#10a050';

			nodes.forEach(node => {
				if (node.category === 0) {
					node.symbolSize = 80;
					node.itemStyle = {
						color: color1
					};
				} else if (node.category === 1) {
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
					text: '关系图'
				},
				legend: [
					{
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
						layout: 'force',
						symbolSize: 58,
						draggable: true,
						roam: true, //是否开启鼠标缩放和平移漫游
						// focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
						categories: categories,
						edgeSymbol: ['', 'arrow'],
						edgeSymbolSize: [4, 10],
						edgeLabel: {
							normal: {
								show: true,
								textStyle: {
									fontSize: 10
								},
								formatter: '{c}'
							}
						},
						label: {
							show: true
						},
						force: {
							repulsion: nodes.length < 5 ? 1000 : 700,
							edgeLength: nodes.length < 5 ? 200 : 120
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
				this.geteChartsData()
			}
		},
		checkboxChange(e) {
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
		width: 100%;
		height: 1000rpx;
	}
	.detail-desc {
		padding: 20rpx;
		text-indent: 40rpx;
	}
}
</style>
