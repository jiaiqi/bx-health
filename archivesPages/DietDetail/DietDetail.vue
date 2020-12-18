<template>
	<view class="current-diet-detail" v-if="dietInfo">
		<view class="title-bar">
			<view class="date" v-if="dietInfo.hdate && dietInfo.htime">{{ dietInfo.hdate + ' ' + dietInfo.htime.slice(0, 5) }}</view>
			<view class="delete-icon" @click="deleteItem(dietInfo)">
				<text class="text">删除记录</text>
				<text class="cuIcon-delete"></text>
			</view>
		</view>
		<diet-info :dietInfo="dietInfo"></diet-info>
		<element-detail ref="elementDetail" :dietInfo="dietInfo" :dietList="dietRecordList" :userInfo="userInfo"></element-detail>
		<handler-bar :dietInfo="dietInfo" @checkUnit="checkUnit" @changeCookMethod="chooseCookType" @changeAmount="changeAmount"></handler-bar>
		<view class="button-box">
			<view class="btn bg-grey" @click="cancel">取消</view>
			<view class="btn bg-blue" @click="UpdateDietInfo">确认</view>
		</view>
	</view>
</template>

<script>
import DietInfo from './diet-info.vue';
import elementDetail from './element-detail.vue';
import HandlerBar from './handler-bar.vue';
import energyListWrap from './data.js';
import { mapState } from 'vuex';
export default {
	components: {
		DietInfo,
		elementDetail,
		HandlerBar
	},
	computed: {
		...mapState({
			is_login: state => state.app['isLogin'],
			wxUserInfo: state => state.user['wxUserInfo'],
			userInfo: state => state.user['userInfo'],
			dietRecord: state => state.app['dietRecord']
		})
	},
	data() {
		return {
			chartData: {
				option: {}
			},
			chooseDate: '',
			diet_record_no: '',
			dietInfo: {},
			dietRecordList: [],
			backUrl: ''
		};
	},
	methods: {
		cancel() {
			//取消
			uni.navigateBack();
			// uni.redirectTo({
			// 	url: this.backUrl
			// });
		},
		async UpdateDietInfo() {
			let self = this;
			let dietInfo = this.deepClone(this.dietInfo);
			let serviceName = 'srvhealth_diet_record_update';
			debugger;
			dietInfo.energy = dietInfo.amount * dietInfo.unit_energy;
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: serviceName,
					condition: [{ colName: 'id', ruleType: 'eq', value: dietInfo.id }],
					data: [
						{
							amount: dietInfo.amount,
							energy: dietInfo.energy,
							unit_weight_g: dietInfo.unit_weight_g,
							unit: dietInfo.unit,
							cook_method: dietInfo.cook_method
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.$emit('dietUpdate');
				uni.navigateBack();
			}
		},
		async getDietRecordDetail() {
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.userInfo.userno
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: this.chooseDate.trim()
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				res.data.data.map(item => {
					if (item.diet_record_no === this.diet_record_no) {
						item.unit_energy = item.energy / item.amount;
						this.dietInfo = item;
					}
				});
				this.$store.commit('SET_DIET_RECORD', res.data.data);
				this.dietRecordList = res.data.data;
			}
		},
		changeAmount(e, step = 1) {
			if (e === 'minus') {
				if (this.dietInfo.amount - step > 0) {
					this.dietInfo.amount = Number((this.dietInfo.amount - step).toFixed(1));
				} else {
					return;
				}
			} else {
				this.dietInfo.amount = Number((this.dietInfo.amount + step).toFixed(1));
			}
			this.dietInfo.energy = this.dietInfo.unit_energy * this.dietInfo.amount;
			setTimeout(() => {
				this.$refs.elementDetail.buildChartOption(this.dietInfo);
			}, 200);
		},
		chooseCookType(e) {
			// 选择食物烹调方式
			this.dietInfo.cook_method = e;
		},
		checkUnit(currentUnit) {
			// 切换单位
			// let currentUnit = this.unitList[index];
			//TODO 动态改变热量
			if (currentUnit.unit === 'g') {
				this.dietInfo.unit_energy = currentUnit.unit_energy;
			} else {
				this.dietInfo.unit_energy = (currentUnit.amount * this.dietInfo.unit_energy) / this.dietInfo.unit_weight_g;
			}
			// this.amount  =
			this.dietInfo.unit_weight_g = currentUnit.unit_weight_g ? currentUnit.unit_weight_g : currentUnit.amount;
			this.dietInfo.unit = currentUnit.unit;
			this.dietInfo.energy = this.dietInfo.unit_energy * this.dietInfo.amount;
			setTimeout(() => {
				this.$refs.elementDetail.buildChartOption(this.dietInfo);
			}, 200);
			this.$refs.elementDetail.buildChartOption(this.dietInfo);
			// this.buildCurrenDietChartOption();
		},
		deleteItem(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '确定删除此条记录?',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						self.cancel();
						let serviceName = '';
						let url = '';
						serviceName = 'srvhealth_diet_record_delete';
						url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						let req = [
							{
								serviceName: serviceName,
								condition: [{ colName: 'id', ruleType: 'in', value: item.id }]
							}
						];
						self.$http.post(url, req).then(res => {
							uni.hideLoading();
							if (res.data.resultCode === 'SUCCESS') {
								debugger;
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '删除失败!',
									icon: 'none'
								});
							}
						});
					} else if (res.cancel) {
						uni.showToast({
							title: '取消删除',
							icon: 'none'
						});
					}
				}
			});
		}
	},
	onLoad(option) {
		if (option.chooseDate && option.no) {
			this.chooseDate = option.chooseDate;
			this.diet_record_no = option.no;
			this.getDietRecordDetail(this.chooseDate);
		}
	}
};
</script>

<style lang="scss">
.current-diet-detail {
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	.title-bar {
		display: flex;
		justify-content: center;
		min-height: 80rpx;
		align-items: center;
		background-color: #fff;
		position: relative;
		.date {
			font-size: 28rpx;
			font-weight: bold;
		}
		.btn {
			padding: 030rpx;
			color: #0081ff;
			font-size: 28rpx;
		}
		.delete-icon {
			position: absolute;
			right: 0;
			padding: 10rpx 20rpx;
			background-color: #fff;
			font-size: 24rpx;
			border-radius: 60rpx;
			text-align: center;
			transition: all 0.5s;
			color: #0081ff;
			&:active {
				background-color: #0081ff;
				color: #fff;
				transform: scale(1.1);
				box-shadow: 0 0 10px #6eb4ff;
			}
			.text {
			}
		}
	}
	.button-box {
		padding: 30rpx 20rpx 60rpx;
		color: #999;
		border-top: 1px solid #f1f1f1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 50rpx;
		.btn {
			padding: 15rpx 30rpx;
			letter-spacing: 2px;
			border-radius: 10rpx;
			font-size: 28rpx;
			flex: 1;
			margin-right: 40rpx;
			text-align: center;
			&:last-child {
				margin-right: 0rpx;
			}
		}
	}
}
</style>
