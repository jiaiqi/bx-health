<template>
	<view class="cascader-wrap">
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @confirm="searchWithKey" v-model="searchKey" :adjust-position="false" type="text" placeholder="根据关键词进行搜索" confirm-type="search" />
			</view>
			<view class="action"><button class="cu-btn bg-green shadow-blur round" @click="searchWithKey">搜索</button></view>
		</view>
		<cascader
			@tag-click="clickTag"
			:areaList="oldAreaList"
			:currentNo="current_no"
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
			<button type="primary" class="cu-btn bg-blue" @click="emitSelectVal">{{ lineDataDefault[lineDataDefault.length - 1] ? '确 定' : '取 消' }}</button>
			<button type="primary" class="cu-btn bg-blue" @click="resetData">重 置</button>
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
			total: 0,
			confirmText: '',
			parent_no: '',
			page: { total: 0, pageNo: 1, rownumber: 50 },
			showSelect: true,
			isShowMore: false, //是否显示‘更多’按钮
			outputData: {},
			currentClick:null,
			lineDataDefault: [], //线数据默认值
			searchKey: '', // 搜索关键词
			oldAreaList:[],
			current_no:''
		};
	},
	methods: {
		resetData() {
			this.clickLine();
			this.parent_no = '';
		},
		showMore() {
			// 点击了‘更多’按钮
			// uni.showLoading()
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
			this.showSelect = true;
		},
		searchWithKey() {
			let condition = [];
			if (this.srvInfo.isTree) {
				condition.push({
					colName: 'parent_no',
					ruleType: this.parent_no ? 'eq' : 'isnull',
					value: this.parent_no
				});
			}
			if (this.searchKey) {
				condition.push({
					colName: this.srvInfo.key_disp_col,
					ruleType: 'like',
					value: this.searchKey
				});
			}
			this.getAreaData(condition).then(_ => {
				// uni.hideLoading()
			});
			this.showSelect = true;
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
					return that.areaList;
				} else {
					const data = res.data.data;
					// this.lineDataDefault[index] = data[0]
					that.$set(this.lineDataDefault, index, data[0]);
					if (index === lastListIndex) {
						that.areaList = res.data.data;
					}
					// console.log('lineDataDefault',this.lineDataDefault)
					return data;
				}				
			}
		},
		clickTag(e) {
			console.log('click-tag', e);
			this.currentClick = e
			this.current_no = e.no
			if (this.srvInfo.isTree === false) {
				this.$emit('getCascaderValue', e, 'sure');
				this.areaList = [];
				this.showSelect = false;
				return;
			}
			if (e.no) {
				this.outputData = e;
				this.$emit('clickTag', e);
				if (this.srvInfo.isTree === false) {
					this.$emit('getCascaderValue', this.lineDataDefault[this.lineDataDefault.length - 1], 'sure');
					this.areaList = [];
					this.showSelect = false;
					return;
				}
				this.page.pageNo = 1;
				let condition = [
					{
						colName: 'parent_no',
						ruleType: 'eq',
						value: e.no
					}
				];
				let lineDataDefault = [...this.lineDataDefault, e];
				this.lineDataDefault = lineDataDefault;
				this.parent_no = e.no;
				console.log('parent_no', e);
				if (e.is_leaf === '是') {
					this.showSelect = false;
				} else {
					this.showSelect = true;
				}
				this.getAreaData(condition).then(data=>{					
					let oldAreaList = this.oldAreaList
					this.valuationChild(oldAreaList,data,e)
					// if(oldAreaList.length > 0){
					// 	oldAreaList.forEach(item=>{
					// 		if(item.no === e.no){
					// 			this.$set(item,'child',data)
					// 		}
					// 	})
					// }else{
					// 	this.oldAreaList = data
					// }
					
					// if(){
						
					// }
				})
			}
		},
		valuationChild(oldAreaList,child,e){
			if(oldAreaList.length > 0){
				oldAreaList.forEach(item=>{
					if(item.no === e.no){
						this.$set(item,'child',child)
					}
					if(item.child){
						this.valuationChild(item.child,child,e)
					}
				})
			}else{
				// this.oldAreaList = data
			}
		},
		clickLine(e, index) {
			console.log('click-line:', e, index);
			debugger
			this.page.pageNo = 1;
			if (index < this.lineDataDefault.length - 1) {
				this.lineDataDefault = this.lineDataDefault.slice(0, index + 1);
			}

			if (e && e.no) {
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
				this.getAreaData().then(data=>{
					this.oldAreaList = this.deepClone(data)
				});
				this.showSelect = true;
			}
		},
		emitSelectVal() {
			if (this.lineDataDefault[this.lineDataDefault.length - 1]) {
				// 确定
				this.$emit('getCascaderValue', this.lineDataDefault[this.lineDataDefault.length - 1], 'sure');
			} else {
				// 取消
				this.$emit('getCascaderValue',false);
			}
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
			this.getAreaData().then(data=>{
				this.oldAreaList = this.deepClone(data)
			})
		}
		// if(this.defaultLineVal){
		// 	this.setLineData()
		// }
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
.cascader-wrap {
	width: 100%;
	background-color: #fff;
	// min-height: 1100rpx;
	// height: 100%;
	// height: calc(90vh - 90rpx);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	// z-index: 99999;
	overflow: scroll;
	.button-box {
		width: 100%;
		padding: 20rpx 0 40rpx;
		display: flex;
		justify-content: center;
		.cu-btn {
			width: 45%;
			margin-right: 20rpx;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}
</style>
