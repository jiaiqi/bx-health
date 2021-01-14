<template>
	<view class="cascader">
		<cascader
			@tag-click="clickTag"
			:areaList="areaList"
			:oldeItemList="oldeItemList"
			@line-click="clickLine"
			@show-more="showMore"
			:showSelect="showSelect"
			:column="srvInfo.column"
			:showCol="srvInfo.showCol"
			:topVal="topVal"
			:isShowMore="isShowMore"
			:lineDataDefault="lineDataDefault"
		></cascader>
		<view class="button-box">
			<button class="cu-btn bg-blue" @click="emitSelectVal">{{ lineDataDefault[lineDataDefault.length - 1] ? '确 定' : '取 消' }}</button>
			<button class="cu-btn bg-green" @click="resetData">重 置</button>
		</view>
	</view>
</template>

<script>
import cascader from './cascader.vue';
export default {
	name: 'cascaderSelector', //层叠选择器外层，处理数据
	components: { cascader },
	data() {
		return {
			areaList: [],
			oldeItemList: [],
			total: 0,
			confirmText: '',
			parent_no: '',
			page: { total: 0, pageNo: 1, rownumber: 50 },
			showSelect: true,
			isShowMore: false, //是否显示‘更多’按钮
			outputData: {},
			lineDataDefault: [] //线数据默认值
		};
	},
	methods: {
		resetData() {
			// this.oldeItemList = []
			this.clickLine();
		},
		showMore() {
			// 点击了‘更多’按钮
			this.page.pageNo++;
			let condition = [];
			if (this.parent_no) {
				condition = [
					{
						colName: 'parent_no',
						ruleType: 'eq',
						value: this.parent_no
					}
				];
			} else if (this.srvInfo.isTree === false) {
				condition = [];
			} else {
				condition = [
					{
						colName: 'parent_no',
						ruleType: 'isnull'
					}
				];
			}
			this.getAreaData(condition, true);
		},
		async getAreaData(cond, ismore, defaultVal, index, lastListIndex) {
			const srvInfo = this.srvInfo;
			const serviceName = srvInfo.serviceName;
			const appName = srvInfo.appNo;
			const that = this;
			let url = this.getServiceUrl(appName, serviceName, 'select');
			let condition = [];
			if (cond && !ismore) {
				condition = cond;
			} else if (cond && ismore) {
				condition = cond;
			} else if (srvInfo.isTree === false) {
				condition = [];
			} else {
				condition = [
					{
						colName: 'parent_no',
						ruleType: 'isnull'
					}
				];
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
			const res = await this.$http.post(url, req);
			if (res && res.data && res.data.state === 'SUCCESS') {
				if (res.data.data.length === 0) {
					this.showSelect = false;
				}
				if (this.outputData && this.outputData.no) {
					this.oldeItemList.push({
						no: this.outputData.no,
						data: this.deepClone(this.areaList)
					});
				}
				if (!defaultVal) {
					const page = res.data.page;
					that.page.pageNo = page.pageNo;
					that.page.total = page.total;
					if (ismore) {
						// 展示更多
						that.areaList = that.areaList.concat(res.data.data);
					} else {
						that.areaList = res.data.data;
					}
					if (page.total > page.pageNo * page.rownumber) {
						that.isShowMore = true;
					} else {
						that.isShowMore = false;
					}
				} else {
					const data = res.data.data;
					that.$set(this.lineDataDefault, index, data[0]);
					if (index === lastListIndex) {
						that.areaList = res.data.data;
					}
					return data;
				}
			}
		},
		clickTag(e) {
			console.log('click-tag', e);
			if (this.srvInfo.isTree === false) {
				this.$emit('getCascaderValue', e, 'sure');
				this.areaList = [];
				this.showSelect = false;
				return;
			}
			if (e.no) {
				if(this.parent_no&&e.no===this.parent_no){
					return
				}
				this.outputData = e;
				this.$emit('clickTag', e);
				this.page.pageNo = 1;
				let condition = [
					{
						colName: 'parent_no',
						ruleType: 'eq',
						value: e.no
					}
				];
				debugger
				// let lineDataDefault = [...this.lineDataDefault, e];
				let lineDataDefault = this.deepClone(this.lineDataDefault)
				this.lineDataDefault =  [...lineDataDefault, e];
				this.parent_no = e.no;
				console.log('parent_no', e);
				if (e.is_leaf === '是') {
					this.showSelect = false;
				} else {
					this.showSelect = true;
				}
				this.getAreaData(condition);
			}
		},
		clickLine(e, index) {
			this.page.pageNo = 1;
			if (index < this.lineDataDefault.length - 1) {
				this.lineDataDefault = this.lineDataDefault.slice(0, index + 1);
			}
			if (e && e.no) {
				if(this.outputData&&this.outputData.no&&e.no===this.outputData.no){
					return
				}
				this.outputData = e;
				this.$emit('clickLine', e);
				let condition = [
					{
						colName: 'parent_no',
						ruleType: 'eq',
						value: e.no
					}
				];
				console.log('parent_no', e);
				this.parent_no = e.no;
				this.getAreaData(condition);
				if (e.is_leaf === '是') {
					this.showSelect = false;
				} else {
					this.showSelect = true;
				}
			} else if (!e) {
				this.lineDataDefault = [];
				this.getAreaData();
				this.showSelect = true;
			}
		},
		emitSelectVal() {
			this.$emit('getCascaderValue', this.lineDataDefault[this.lineDataDefault.length - 1], 'sure');
			// this.$emit('getCascaderValue', this.outputData);
		},
		setLineData() {
			const value = this.defaultLineVal;
			if (value) {
				this.lineDataDefault = [];
				let condition = [
					{
						colName: 'path_name',
						ruleType: 'eq',
						value: value
					}
				];
				//通过path_name查询path
				this.getAreaData(condition, false, true).then(data => {
					if (data) {
						console.log('lineDataDefault', data);
						let path_no = data[0].path;
						let arr = path_no.split('/');
						// 将path分割为地区编号的数组
						arr = arr.filter(item => item && item.trim());
						arr.forEach((pathNo, index) => {
							condition = [
								{
									colName: 'no',
									ruleType: 'eq',
									value: pathNo
								}
							];
							const lastListIndex = arr.length - 1;
							this.getAreaData(condition, false, true, index, lastListIndex).then(datas => {
								let parent_no = datas[datas.length - 1].parent_no;
								condition = [
									{
										colName: 'parent_no',
										ruleType: 'eq',
										value: pathNo
									}
								];
								this.getAreaData(condition);
							});
						});
					}
				});
			}
		}
	},
	created() {
		if (this.srvInfo && this.srvInfo.serviceName) {
			this.getAreaData();
		}
	},
	watch: {
		defaultLineVal(newValue, oldValue) {
			this.setLineData();
		}
	},
	props: {
		topVal: {
			type: String,
			default: '全国'
		},
		defaultLineVal: {
			type: String,
			default: ''
		},
		srvInfo: {
			type: Object,
			default: () => {
				return {
					serviceName: 'srvdaq_check_area_select',
					appNo: 'daq'
				};
			}
		}
	}
};
</script>

<style lang="scss">
.cascader {
	width: 100%;
	background-color: #fff;
	min-height: 900upx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 99999;
	overflow: scroll;
	.button-box {
		width: 100%;
		padding-bottom: 40rpx;
		display: flex;
		justify-content: center;
		.cu-btn {
			width: 45%;
			& + .cu-btn {
				margin-left: 20rpx;
			}
		}
	}
}
</style>
