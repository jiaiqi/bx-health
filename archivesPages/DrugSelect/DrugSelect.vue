<template>
	<view class="drug-select">
		<view class="search-bar cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @confirm="searchVal" :adjust-position="false" type="text" :placeholder="`搜索${dataType}名称`" confirm-type="search" v-model="keywords" />
			</view>
			<view class="action"><button class="cu-btn bg-blue shadow-blur round">搜索</button></view>
		</view>
		<view class="drug-list">
			<view class="drug-item" v-for="item in drugList" @click="toAdd(item)">
				<text v-if="dataType === '用药'">{{ item.medicine_name }}</text>
				<text v-if="dataType === '运动'">{{ item.name }}</text>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
		<view class="cu-modal" :class="{ show: showModal }">
			<view class="cu-dialog">
				<drug-info :planNo="ds_no" type="add" :drugDetail="drugDetail" @hideModal="hideModal" @addSuccess="addSuccess"></drug-info>
				<!-- 		<view class="sport-info" v-if="drugDetail.sport_no">
					<view class="info-item">
						<view class="label">
						 名称：
						</view>
						<view class="value">
							{{drugDetail.name}}
						</view>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import DrugInfo from '../components/DrugInfo/DrugInfo.vue';
export default {
	components: {
		DrugInfo
	},
	data() {
		return {
			showModal: false,
			keywords: '', //搜索关键词
			drugList: [],
			page: {
				pageNo: 1,
				rownumber: 27
			},
			ds_no: '',
			more: 'more', //more,loading,noMore
			drugDetail: {},
			dataType: ''
		};
	},
	watch: {
		keywords(newValue, oldValue) {
			this.getDrugList('', newValue);
		}
	},
	onLoad(option) {
		if (option.ds_no) {
			this.ds_no = option.ds_no;
			if (option.type) {
				this.dataType = option.type;
			}
			uni.startPullDownRefresh();
		} else {
			uni.navigateBack();
		}
	},
	methods: {
		addSuccess() {
			this.hideModal();
			uni.navigateBack();
		},
		hideModal() {
			this.showModal = false;
		},
		toAdd(e) {
			let ds_no = this.ds_no;
			this.showModal = true;
			this.drugDetail = this.deepClone(e);
			if (e.medicine_name) {
				e.take_times = 3; //每天次数55
				e.dosage_each_time = 1; // 每次用量
				e.dosage_unit = '片'; // 用量单位
			} else if (e.sport_no) {
				// debugger
			}
		},
		searchVal(e) {
			let val = this.keywords;
			this.getDrugList('', this.keywords);
		},
		async getDrugList(isMore, val) {
			let serviceName = 'srvhealth_medicine_info_select';
			if (this.dataType === '运动') {
				serviceName = 'srvhealth_body_activity_contents_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				page: { pageNo: this.page.pageNo, rownumber: this.page.rownumber }
			};
			if (val) {
				if (this.dataType === '用药') {
					req.relation_condition = {
						relation: 'OR',
						data: [
							{
								colName: 'medicine_goods_name',
								value: val,
								ruleType: 'like'
							},
							{
								colName: 'medicine_instruction',
								value: val,
								ruleType: 'like'
							},

							{
								colName: 'medicine_name',
								value: val,
								ruleType: 'like'
							}
						]
					};
				} else if (this.dataType === '运动') {
					req.relation_condition = {
						relation: 'OR',
						data: [
							{
								colName: 'classify',
								value: val,
								ruleType: 'like'
							},
							{
								colName: 'name',
								value: val,
								ruleType: 'like'
							}
						]
					};
				}
			}
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				if (isMore) {
					this.drugList = [...this.drugList, ...res.data.data];
				} else {
					this.drugList = res.data.data;
				}
			}
			if (res.data.page) {
				this.page = res.data.page;
			}
			if (this.page.total && this.page.total > this.page.rownumber) {
				this.more = 'more';
			} else {
				this.more = 'noMore';
			}
			return res.data.data;
		}
	},
	onPullDownRefresh() {
		// 刷新
		this.page = {
			pageNo: 1,
			rownumber: 27
		};
		this.getDrugList('', this.keywords).then(_ => {
			uni.stopPullDownRefresh();
		});
	},
	onReachBottom() {
		if (this.page.total && this.page.total > this.page.rownumber) {
			// 加载更多
			this.page.pageNo++;
			this.more = 'loading';
			this.getDrugList('more', this.keywords);
		} else {
			// 没有更多
			this.more = 'noMore';
		}
	}
};
</script>

<style scoped lang="scss">
.drug-select {
	background-color: #fff;
}
.cu-modal {
	z-index: 800;
	.sport-info {
		padding: 20rpx;
		.info-item {
			display: flex;
		}
	}
}
.drug-list {
	/* #ifdef H5 */
	// height: ;
	/* #endif */
	/* #ifndef H5 */
	height: calc(100vh - var(--window-top) - var(--window-bottom) - 100rpx);
	/* #endif */
	padding: 20rpx;
	.drug-item {
		display: inline-flex;
		width: calc(33.33% - 40rpx / 3);
		min-height: 100rpx;
		max-height: 200rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 10rpx;
		&:nth-child(3n) {
			margin-right: 0;
		}
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		&:active {
			transition: all 0.2s;
			transform: scale(1.2);
			border: 1rpx solid #0bc99d;
		}
	}
}
</style>
