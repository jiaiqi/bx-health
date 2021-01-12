<template>
	<view
		class="relation-graph"
		:style="{
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<view class="serach-bar">
			<view class="cu-bar search bg-white">
				<view class="search-form round" @click="toSearchPage"><text class="cuIcon-search"></text></view>
			</view>
		</view>
		<view class="node-path">
			<view class="path-item" v-for="(item, index) in linkPath" :key="item.no" @click="toPath(item)">
				<view class="name">{{ item.name }}</view>
				<view class="separator" v-if="index + 1 < linkPath.length"><text class="cuIcon-right"></text></view>
				<!-- <view class="separator" v-if="index + 1 < linkPath.length"><view class="line"></view></view> -->
			</view>
		</view>
		<view class="charts" v-if="nodeDetail && nutrientsChartOption.option && nutrientsChartOption.option.title">
			<bx-echart @click-chart="clickCharts" class="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="nutrientsChartOption"></bx-echart>
		</view>
		<view class="node-img"><image class="image" :src="item" :key="item" mode="aspectFit" v-for="item in nodeImageList"></image></view>
		<view class="detail-desc" v-if="nodeDetail">
			<!-- 		<txv-video
				:vid="nodeDetail.video_link"
				:playerid="nodeDetail.video_link"
				:autoplay="false"
				:poster="nodeDetail.video_link"
				:usePoster="true"
				v-if="nodeDetail.video_link"
			></txv-video> -->
			<view class="video-box" v-if="txv_path"><video class="video-player" :src="txv_path" :usePoster="true" controls object-fit="contain"></video></view>
			<view v-html="nodeDetail.node_desc" v-if="nodeDetail.node_desc" class="rich-text"></view>

			<view class="link-box">
				<view class="node-link">
					<!-- <view class="link-title">内部页面</view> -->
					<view class="link-item-box" v-for="item in nodesLinkList['inPage']" @click="toLink(item)">
						<view class="title">{{ item.link_name }}</view>
						<view class="origin">来源：{{ item.external_link_src }}</view>
					</view>
				</view>
				<view class="node-link">
					<!-- <view class="link-title">外部页面</view> -->
					<view class="link-item-box" v-for="item in nodesLinkList['outPage']" @click="toLink(item)">
						<view class="title">
							<text class="cuIcon-text margin-right-xs"></text>
							{{ item.link_name }}
						</view>
						<view class="origin">来源：{{ item.external_link_src }}</view>
					</view>
				</view>
				<view class="node-link">
					<!-- <view class="link-title">外部视频</view> -->
					<view class="link-item-box" v-for="item in nodesLinkList['outVideo']" @click="toLink(item)">
						<view class="title">
							<text class="cuIcon-video margin-right-xs"></text>
							{{ item.link_name }}
						</view>
						<view class="origin">来源：{{ item.external_link_src }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="data-empty" v-else-if="!nodeDetail || !nodeDetail.kn_no"><u-empty :text="emptyText"></u-empty></view> -->
	</view>
</template>

<script>
import bxEchart from '@/components/uni-ec-canvas/uni-echart.vue';
import { mapState } from 'vuex';
export default {
	components: {
		bxEchart
	},
	computed: {
		...mapState({
			loginUserInfo: state => state.user.loginUserInfo,
			wxUserInfo: state => state.user.wxUserInfo,
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize
		})
	},
	data() {
		return {
			txv_path: '',
			nutrientsChartOption: {
				option: {}
			},
			emptyText: '数据加载中...',
			currentNodes: '健康',
			currentNodeNo: 'KN202011211458080001',
			linkPath: [],
			graphData: [],
			nodeData: [],
			nodeDetail: null,
			nodeImageList: [],
			nodesLinkList: {
				outPage: [],
				inPage: [],
				outVideo: []
			} //节点链接列表
		};
	},
	methods: {
		getNodeImagePath(nodetail) {
			if (this.nodeDetail.node_image) {
				let url = this.getServiceUrl('file', 'srvfile_attachment_select', 'select');
				let req = {
					serviceName: 'srvfile_attachment_select',
					colNames: ['*'],
					condition: [{ colName: 'file_no', value: this.nodeDetail.node_image, ruleType: 'eq' }, { colName: 'is_delete', value: '1', ruleType: 'eq' }]
				};
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						this.nodeImageList = res.data.data.map(item => {
							return this.$api.getFilePath + item.fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						});
					}
				});
			}
		},
		toLink(item) {
			let url = '';
			switch (item && item.link_type) {
				case '外部页面':
					if (item.external_page_link_url) {
						url = '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(this.getResultUrl(item.external_page_link_url));
					}
					break;
				case '外部视频':
					url = '/archivesPages/VideoPlayer/VideoPlayer?src=' + encodeURIComponent(item.video_url);
					break;
				case '内部页面':
					url = item.page_link_url;
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		toSearchPage() {
			uni.navigateTo({
				url: '/archivesPages/GraphSearch/GraphSearch'
			});
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
			this.graphData = this.deepClone(data);

			let nodeData = [];
			if (Array.isArray(data)) {
				let nodeNoArr = data.reduce((pre, cur) => {
					if (!pre.includes(cur.source_node_no)) {
						pre.push(cur.source_node_no);
					}
					if (!pre.includes(cur.target_node_no)) {
						pre.push(cur.target_node_no);
					}
					if (!pre.includes(this.currentNodeNo)) {
						pre.push(this.currentNodeNo);
					}
					return pre;
				}, []);
				await this.getNodeDetail(nodeNoArr.toString(), 'total');
				nodeData = this.nodeData;
			}

			if (!res.data.data || !Array.isArray(res.data.data) || res.data.data.length == 0) {
				this.emptyText = '关系数据为空';
				data = await this.getNodeDetail(this.currentNodeNo, 'total');
				nodeData = [data];
				data = nodeData.map(item => {
					item.relation = 'source';
					return item;
				});
			}

			let nameArr = [];
			let nodes = [];
			nodeData = nodeData.map(node => {
				data.forEach(item => {
					if (item.target_node_no === node.kn_no) {
						node.relation = 'target';
					}
					if (item.source_node_no === node.kn_no) {
						node.relation = 'source';
					}
				});
				return node;
			});
			nodeData.forEach(node => {
				nodes.push({
					// #ifdef H5
					symbol: node && node.node_icon ? `image://${node.node_icon}` : node.kn_no === this.currentNodeNo ? 'diamond' : 'circle', //中间的节点
					// #endif
					// #ifdef MP-WEIXIN
					symbol: node.kn_no === this.currentNodeNo ? 'diamond' : 'circle', //中间的节点
					// #endif
					// symbol: 'diamond', //中间的节点
					name: node.node_name,
					nodeNo: node.kn_no,
					category: this.currentNodeNo === node.kn_no ? 1 : node.relation === 'source' ? 0 : 2,
					label: {
						// #ifdef H5
						position: node && node.node_icon ? 'bottom' : 'inside'
						// #endif
					}
				});
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
							show: true,
							position: 'inside',
							distance: 0
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
		async getNodesLink() {
			// 查找节点链接列表
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_link_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_node_link_select',
				colNames: ['*'],
				condition: [{ colName: 'kn_no', ruleType: 'eq', value: this.currentNodeNo }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				res.data.data = res.data.data.filter(item => item.display === '是');
				for (let item of res.data.data) {
					if (item.link_type === '外部视频' && item.external_link_src === '腾讯视频') {
						item.video_url = await this.getVideoInfo(item.video_link);
					}
					// return item;
				}
				let list = res.data.data.reduce((pre, cur) => {
					let key = '';
					if (cur && cur.link_type) {
						switch (cur.link_type) {
							case '外部页面':
								key = 'outPage';
								if (cur.external_page_link_url && cur.external_page_link_url.indexOf('https://view.inews.qq.com/a/') !== -1) {
									cur.external_page_link_url = cur.external_page_link_url.replace('https://view.inews.qq.com/a/', 'https://xw.qq.com/cmsid/');
								}
								break;
							case '内部页面':
								key = 'inPage';
								break;
							case '外部视频':
								key = 'outVideo';
								break;
						}
					}
					if (pre[key] && Array.isArray(pre[key]) === true) {
						pre[key].push(cur);
					} else {
						pre[key] = [cur];
					}
					return pre;
				}, {});
				this.nodesLinkList = list;
				// res.data.data.map(item => {

				// });
			}
		},
		async getNodeDetail(no, type) {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_node_select',
				colNames: ['*'],
				// relation_condition: {
				// 	relation: 'OR',
				// 	// data: [{ colName: 'kn_no', ruleType: 'eq', value: no }]
				// },
				condition: [{ colName: 'kn_no', ruleType: 'in', value: no }],
				page: { pageNo: 1 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				let nodeDetail = res.data.data.find(item => item.kn_no === this.currentNodeNo);
				if (nodeDetail.node_desc) {
					if (nodeDetail.node_desc.indexOf('<img') !== -1) {
						nodeDetail.node_desc = nodeDetail.node_desc.replace(/<img/, '<img style="width:90%;height:90%;margin:0;padding:0;text-indent:0;"');
					}
				}
				this.nodeDetail = nodeDetail;
				this.getNodeImagePath(nodeDetail);
				// if (this.nodeDetail && this.nodeDetail.video_link) {
				// 	// this.getVideoInfo(this.nodeDetail.video_link);
				// } else {
				// 	this.txv_path = '';
				// }
				if (nodeDetail) {
					this.currentNodes = this.nodeDetail.node_name;
					this.getNodesLink();
					this.changeLinkPath({
						no: this.nodeDetail.kn_no,
						name: this.nodeDetail.node_name
					});
				}
				if (type === 'total') {
					this.nodeData = res.data.data;
				}
				return nodeDetail;
			} else {
				this.nodeDetail = null;
			}
		},
		async toPath(e) {
			this.currentNodes = e.name;
			this.currentNodeNo = e.no;
			let nodetail = await this.getNodeDetail(e.no, false);
			if ((nodetail.link_type && nodetail.link_type.indexOf('本节点') !== -1) || !nodetail.link_type) {
				// if (e.no !== this.currentNodeNo) {
				this.currentNodes = e.name;
				this.currentNodeNo = e.no;
				this.geteChartsData();
				this.changeLinkPath({ name: e.name, no: e.no });
				// }
			} else if (nodetail.link_type) {
				let url = '';
				if (nodetail.link_type.indexOf('内部页面') !== -1) {
					url = nodetail.page_link_url;
				} else if (nodetail.link_type.indexOf('外部页面') !== -1) {
					let resultUrl = this.getResultUrl(nodetail.external_page_link_url);
					url = '/publicPages/webviewPage/webviewPage?webUrl=' + resultUrl;
					if (!resultUrl) {
						return;
					}
				}
				if (url) {
					uni.navigateTo({
						url: url
					});
				}
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
		async clickCharts(e) {
			if (e.data && e.data.nodeNo) {
				this.currentNodes = e.name;
				this.currentNodeNo = e.data.nodeNo;
				let nodetail = await this.getNodeDetail(e.data.nodeNo, false);
				if ((nodetail && nodetail.link_type && nodetail.link_type.indexOf('本节点') !== -1) || !nodetail.link_type) {
					// if (e.data.nodeNo !== this.currentNodeNo) {
					this.geteChartsData();
					this.changeLinkPath({ name: e.name, no: e.data.nodeNo });
					// }
				} else if (nodetail.link_type) {
					let url = '';
					if (nodetail.link_type.indexOf('内部页面') !== -1) {
						url = nodetail.page_link_url;
					} else if (nodetail.link_type.indexOf('外部页面') !== -1) {
						let resultUrl = this.getResultUrl(nodetail.external_page_link_url);
						url = '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(resultUrl);
						if (!resultUrl) {
							return;
						}
					}
					if (url) {
						uni.navigateTo({
							url: url
						});
					}
				}
			}
		},
		getResultUrl(url) {
			if (url) {
				return this.$api.srvHost + '/health/remote/getPage?address=' + url;
			}
		},
		async getVideoInfo(vid) {
			var that = this;
			var urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
			let res = await uni.request({
				url: urlString
			});
			if (Array.isArray(res) && res.length > 1 && res[1].data) {
				res = res[1];
				if (res) {
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
					let url = '';
					for (var i = 1; i < seg_cnt + 1; i++) {
						var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
						console.log(filename);
						pageArr.push(i);
						url = await that.requestVideoUrls(part_format_id, vid, filename, 'index' + i, host);
					}
					return url;
				}
			}
		},
		async requestVideoUrls(part_format_id, vid, fileName, index, host) {
			var keyApi = 'https://vv.video.qq.com/getkey?otype=json&platform=11&format=' + part_format_id + '&vid=' + vid + '&filename=' + fileName + '&appver=3.2.19.333';
			var that = this;
			let res = await uni.request({
				url: keyApi
			});
			if (Array.isArray(res) && res.length > 1 && res[1].data) {
				res = res[1];
				if (res) {
					var dataJson = res.data.replace(/QZOutputJson=/, '') + 'qwe';
					var dataJson1 = dataJson.replace(/;qwe/, '');
					var data = JSON.parse(dataJson1);
					var part_urls = new Array();
					if (data.key != undefined) {
						var vkey = data['key'];
						var url = host + fileName + '?vkey=' + vkey;
						part_urls[index] = String(url);
						return part_urls.index1;
					}
				}
			}
		}
	},
	onShareAppMessage() {
		let path = '';
		let title = '百想健康';
		if (this.loginUserInfo && this.loginUserInfo.user_no && this.nodeDetail && this.nodeDetail.kn_no) {
			path = `/archivesPages/RelationGraph/RelationGraph?currentNodeNo=${this.nodeDetail.kn_no}&from=share&option.invite_user_no=${this.loginUserInfo.userno}`;
			title = `【${this.nodeDetail.node_name ? this.nodeDetail.node_name : '健康'}】知识图谱`;
		}
		return {
			title: title,
			path: path
		};
	},
	onLoad(option) {
		this.checkOptionParams(option);
		if (option.currentNodeNo) {
			this.currentNodeNo = option.currentNodeNo;
		}
		this.geteChartsData();
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
.relation-graph {
	width: 100%;
	min-height: 100vh;
	background-color: #fff;
	padding: 20rpx;
	.serach-bar {
		.input-box {
		}
	}

	.data-empty {
		width: 100%;
		margin-top: 30vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.charts {
		width: 100%;
		height: 700rpx;
		margin-bottom: 20rpx;
	}
	.node-img {
		padding: 20rpx;
		display: flex;
		.image {
			width: 200rpx;
			height: 200rpx;
			& + .image {
				margin-left: 10rpx;
			}
		}
	}
	.detail-desc {
		padding: 20rpx;
		// text-indent: 20rpx;
		.video-box {
			text-indent: 0;
			width: 100%;
			.video-player {
				width: 100%;
			}
		}
		.rich-text {
			width: 100%;
			overflow: hidden;
			font-size: var(--global-text-font-size);
			line-height: 1.5;
		}
		.link-box {
			margin-top: 20rpx;
			.node-link {
				width: 100%;
				display: flex;
				flex-direction: column;
				.link-title {
					font-weight: bold;
					width: 100%;
				}
				.link-item-box {
					display: flex;
					overflow: hidden;
					padding: 20rpx;
					margin-bottom: 10rpx;
					border-radius: 4px;
					border: 1px solid #ebeef5;
					background-color: #fff;
					box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
					color: #303133;
					flex-direction: column;
					transition: 0.1s all;
					&:active {
						background-color: #f8f8f8;
					}
					.title {
						font-size: 32rpx;
						word-break: break-all;
						display: -webkit-box;
						-webkit-line-clamp: 2; /**指定行数*/
						-webkit-box-orient: vertical;
						overflow: hidden;
						// color: #007AFF;
					}
					.origin {
						color: #999;
						font-size: 24rpx;
						padding: 10rpx 0;
						text-align: right;
					}
				}
			}
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
