<template>
	<view class="tree-selector-wrap">
		<view class="selected-node-wrap">
			<view class="selected-node-list">
				<view class="selected-node" :class="{'active':curNode==item[srvInfo.column||'no']}"
					v-for="item in selectedList" @click="clickSelected(item)">
					<text class="" v-if="item[srvInfo.showCol||'name']">{{item[srvInfo.showCol||'name']}}</text>
				</view>
				<view class="selected-node text-orange" v-if="!curNode||curNodeInfo&&curNodeInfo.is_leaf!=='是'">
					请选择
				</view>
			</view>
		</view>
		<view class="node-list-wrap">
			<view class="node-list">
				<view class="node-item round shadow-blur  cu-btn bg-white" v-for="item in nodeList"
					@click="clickNode(item)">
					<text class="" v-if="item[srvInfo.showCol||'name']">{{item[srvInfo.showCol||'name']}}</text>
				</view>
			</view>
		</view>
		<view class="foot-button" v-if="!hideButton">
			<button class="cu-btn bg-green" @click="reset">重置</button>
			<button class="cu-btn bg-blue" @click="confirm" v-if="curNode">确定</button>
			<button class="cu-btn bg-grey" @click="cancel" v-else>取消</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tree-selector",
		data() {
			return {
				selectedList: [],
				curNode: '', //当前节点
				curNodeInfo: {},
				page: {
					pageNo: 1,
					rownumber: 999
				},
				nodeList: []
			};
		},
		created() {
			if (!this.current && this.srvInfo && this.srvInfo.column && this.srvInfo.appNo && this.srvInfo.serviceName) {
				this.getData()
			}
		},
		methods: {
			clickSelected(e) {
				let index = this.selectedList.findIndex(item => item[this.srvInfo.column] === e[this.srvInfo.column])
				if (index !== -1) {
					this.selectedList = this.selectedList.slice(0, index)
				}
				if (index > 0) {
					this.curNode = this.selectedList[index - 1][this.srvInfo.column]
					this.curNodeInfo = this.selectedList[index - 1]
				} else {
					this.curNode = ''
					this.curNodeInfo = {}
				}
				this.getData()
			},
			clickNode(e) {
				this.curNode = e[this.srvInfo.column]
				this.curNodeInfo = e
				this.selectedList.push(e)
				if (e.is_leaf === '是') {
					// if (!this.needConfirm) {
					this.$emit('confirm', e)
					// }
				}
				this.getData()
			},
			cancel() {
				this.$emit('cancel', this.curNodeInfo)
			},
			confirm() {
				// 确认
				this.$emit('confirm', this.curNodeInfo)
			},
			reset() {
				// 重置
				this.curNode = ''
				this.curNodeInfo = ''
				this.selectedList = []
				this.getData()
			},
			async getData(cond) {
				// 查找节点数据
				const srvInfo = this.srvInfo;
				const serviceName = srvInfo.serviceName;
				const appName = srvInfo.appNo;
				const that = this;
				let url = this.getServiceUrl(appName, serviceName, 'select');
				let condition = [];
				if (cond) {
					condition = cond;
				} else if (srvInfo.isTree === false) {
					condition = [];
				} else {
					if (this.curNode) {
						condition = [{
							colName: this.srvInfo?.parentCol || 'parent_no',
							ruleType: 'eq',
							value: this.curNode
						}];
					} else {
						condition = [{
							colName: this.srvInfo?.parentCol || 'parent_no',
							ruleType: 'isnull'
						}];
					}
				}
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: condition,
					page: {
						pageNo: this.page.pageNo,
						rownumber: this.page.rownumber
					}
				};
				if (this.order) {
					req.order = this.order
				}
				const res = await this.$http.post(url, req);
				if (res && res.data && res.data.state === 'SUCCESS') {
					const page = res.data.page;
					that.page.pageNo = page.pageNo;
					that.page.total = page.total;
					that.nodeList = res.data.data;
					return that.nodeList;
				}
			}
		},
		watch: {
			current: {
				immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					this.curNodeInfo = this.deepClone(this.current)
					this.curNode = this.curNodeInfo[this.srvInfo.column] || ''
					if (!this.curNode) {
						this.selectedList = []
					}
					if (this.srvInfo && this.srvInfo.column && this.srvInfo.appNo && this.srvInfo.serviceName) {
						this.getData()
					}
				}
				// if (this.current && this.current[this.srvInfo.column]) {

				// }else{
				// 	this.curNodeInfo = {}
				// 	this.curNode = ''
				// }
			}
		},
		props: {
			order: { //排序
				type: [Array, Object]
			},
			hideButton: {
				type: Boolean,
				default: false
			},
			needConfirm: {
				type: Boolean,
				default: true
			},
			current: {
				type: Object,
			},
			srvInfo: {
				type: Object,
				default: () => {
					return {
						serviceName: 'srvdaq_check_area_select',
						appNo: 'daq',
						showCol: 'name'
					};
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tree-selector-wrap {
		width: 100vw;
		height: 80vh;
		display: flex;
		flex-direction: column;
		background-color: #f1f1f1;

		.selected-node-wrap {
			background-color: #fff;
			display: flex;
			align-items: center;
			margin: 20rpx 20rpx 10rpx;
			border-radius: 20rpx;
			padding: 20rpx;
		}

		.selected-node-list {
			display: flex;
			flex-wrap: wrap;

			.selected-node {
				display: flex;
				align-items: center;

				&+.selected-node {
					&::before {
						content: '';
						display: inline-block;
						width: 5px;
						height: 5px;
						border-top: 2px solid #656565;
						border-right: 2px solid #656565;
						-webkit-transform: rotate(45deg);
						transform: rotate(45deg);
						border-color: #007aff;
						margin: 20rpx;
					}
				}

				&.active {
					text {
						position: relative;

						&::after {
							position: absolute;
							bottom: -10rpx;
							left: 0;
							content: '';
							width: 100%;
							height: 2px;
							background-color: #0081FF;
						}

						// border-bottom: 2px solid #0081FF;
					}

					color: #007aff;
				}
			}
		}

		.node-list-wrap {
			flex: 1;
			overflow-y: scroll;

			.node-list {
				display: flex;
				flex-wrap: wrap;
				padding: 20rpx 10rpx;
				padding-right: 0;
				align-items: flex-start;

				.node-item {
					margin-right: 10rpx;
					margin-bottom: 10rpx;
				}
			}
		}

		.foot-button {
			display: flex;
			justify-content: center;
			padding-bottom: 50rpx;
			padding-top: 20rpx;
			background-color: #fff;

			.cu-btn {
				min-width: 40%;

				&+.cu-btn {
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
