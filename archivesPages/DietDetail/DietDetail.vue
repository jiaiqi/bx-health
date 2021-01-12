<template>
	<view class="current-diet-detail" v-if="dietInfo">
		<view class="title-bar">
			<view class="date" v-if="dietInfo.hdate && dietInfo.htime">{{ dietInfo.hdate + ' ' + dietInfo.htime.slice(0, 5) }}</view>
			<view class="date" v-else-if="chooseDate">{{ chooseDate }}</view>
			<view class="delete-icon" @click="deleteItem(dietInfo)" v-if="diet_record_no">
				<text class="text">删除记录</text>
				<text class="cuIcon-delete"></text>
			</view>
		</view>
		<diet-info :dietInfo="dietInfo"></diet-info>
		<element-detail ref="elementDetail" :dietInfo="dietInfo" :dietList="dietRecordList" :userInfo="userInfo"></element-detail>
		<handler-bar
			:dietInfo="dietInfo"
			:cook-method="cook_method"
			@checkUnit="checkUnit"
			@changeCookMethod="chooseCookType"
			@changeDiningType="changeDiningType"
			@changeAmount="changeAmount"
		></handler-bar>
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
			planNo: '', //计划编号
			chartData: {
				option: {}
			},
			chooseDate: '',
			diet_record_no: '', //饮食记录编号 有此编号则此页面是饮食记录详情，否则为食物库中的食物详情
			food_no: '', //食物编号
			meal_no: '', //混合食物编号
			dietInfo: {},
			cook_method: '',
			dietRecordList: [],
			backUrl: '',
			dining_type: '早餐'
		};
	},
	methods: {
		cancel() {
			//取消
			uni.navigateBack();
		},
		async addDietRecord() {
			let self = this;
			this.dietRecordList = [this.dietInfo];
			if (this.dietRecordList.length > 0) {
				let arr = [];
				this.dietRecordList.forEach(item => {
					let obj = {
						cook_method: this.cook_method,
						userno: uni.getStorageSync('login_user_info').user_no,
						hdate: this.formateDate(new Date(), 'date'),
						htime: this.formateDate(new Date(), 'time'),
						name: item.name,
						person_info_no: this.userInfo.no,
						person_name: this.userInfo.name,
						amount: item.amount,
						unit: item.unit,
						energy: (item.unit_amount * item.unit_energy) / 100,
						user_name: this.userInfo.name,
						image: item.image,
						unit_weight_g: 100,
						dining_type: this.dining_type,
						protein: Number(this.dietInfo.protein) * item.amount,
						axunge: Number(this.dietInfo.axunge) * item.amount,
						carbohydrate: Number(this.dietInfo.carbohydrate) * item.amount,
						cholesterol: Number(this.dietInfo.cholesterol) * item.amount,
						vitamin_a: Number(this.dietInfo.vitamin_a) * item.amount,
						vitamin_d: Number(this.dietInfo.vitamin_d) * item.amount,
						vitamin_e: Number(this.dietInfo.vitamin_e) * item.amount,
						vitamin_k: Number(this.dietInfo.vitamin_k) * item.amount,
						vitamin_b1: Number(this.dietInfo.vitamin_b1) * item.amount,
						vitamin_b2: Number(this.dietInfo.vitamin_b2) * item.amount,
						vitamin_b3: Number(this.dietInfo.vitamin_b3) * item.amount,
						vitamin_b6: Number(this.dietInfo.vitamin_b6) * item.amount,
						vitamin_b12: Number(this.dietInfo.vitamin_b12) * item.amount,
						folic_acid: Number(this.dietInfo.folic_acid) * item.amount,
						vitamin_c: Number(this.dietInfo.vitamin_c) * item.amount,
						element_ca: Number(this.dietInfo.element_ca) * item.amount,
						element_p: Number(this.dietInfo.element_p) * item.amount,
						element_mg: Number(this.dietInfo.element_mg) * item.amount,
						element_k: Number(this.dietInfo.element_k) * item.amount,
						element_na: Number(this.dietInfo.element_na) * item.amount,
						element_fe: Number(this.dietInfo.element_fe) * item.amount,
						element_zn: Number(this.dietInfo.element_zn) * item.amount,
						element_se: Number(this.dietInfo.element_se) * item.amount,
						element_cu: Number(this.dietInfo.element_cu) * item.amount,
						element_mn: Number(this.dietInfo.element_mn) * item.amount
					};
					if (item.meal_no) {
						obj.energy = item.unit_amount * item.unit_energy;
					}
					if (this.planNo) {
						obj.ps_no = this.planNo;
					}
					// if (this.searchArg.type === 'food') {
					if (item.meal_no) {
						obj['mixed_food_no'] = item.meal_no;
						obj['diret_type'] = 'mixed_food';
						if (this.dietInfo.dish_type && this.dietInfo.dish_type.indexOf('自选') > -1) {
							if (this.minceListChoose && this.minceListChoose.length > 0) {
								this.minceListChoose.forEach(m => {
									obj.energy = (Number(obj.energy) + m.unit_energy * item.amount).toFixed(1);
									obj.protein = (Number(obj.protein) + Number(m.protein) * item.amount).toFixed(1);
									obj.axunge = (Number(obj.axunge) + Number(m.axunge) * item.amount).toFixed(1);
									obj.carbohydrate = (Number(obj.carbohydrate) + Number(m.carbohydrate) * item.amount).toFixed(1);
									obj.cholesterol = (Number(obj.cholesterol) + Number(m.cholesterol) * item.amount).toFixed(1);
									obj.vitamin_a = (Number(obj.vitamin_a) + Number(m.vitamin_a) * item.amount).toFixed(1);
									obj.vitamin_d = (Number(obj.vitamin_d) + Number(m.vitamin_d) * item.amount).toFixed(1);
									obj.vitamin_e = (Number(obj.vitamin_e) + Number(m.vitamin_e) * item.amount).toFixed(1);
									obj.vitamin_k = (Number(obj.vitamin_k) + Number(m.vitamin_k) * item.amount).toFixed(1);
									obj.vitamin_b1 = (Number(obj.vitamin_b1) + Number(m.vitamin_b1) * item.amount).toFixed(1);
									obj.vitamin_b2 = (Number(obj.vitamin_b2) + Number(m.vitamin_b2) * item.amount).toFixed(1);
									obj.vitamin_b3 = (Number(obj.vitamin_b3) + Number(m.vitamin_b3) * item.amount).toFixed(1);
									obj.vitamin_b6 = (Number(obj.vitamin_b6) + Number(m.vitamin_b6) * item.amount).toFixed(1);
									obj.vitamin_b12 = (Number(obj.vitamin_b12) + Number(m.vitamin_b12) * item.amount).toFixed(1);
									obj.folic_acid = (Number(obj.folic_acid) + Number(m.folic_acid) * item.amount).toFixed(1);
									obj.vitamin_c = (Number(obj.vitamin_c) + Number(m.vitamin_c) * item.amount).toFixed(1);
									obj.element_ca = (Number(obj.element_ca) + Number(m.element_ca) * item.amount).toFixed(1);
									obj.element_p = (Number(obj.element_p) + Number(m.element_p) * item.amount).toFixed(1);
									obj.element_mg = (Number(obj.element_mg) + Number(m.element_mg) * item.amount).toFixed(1);
									obj.element_k = (Number(obj.element_k) + Number(m.element_k) * item.amount).toFixed(1);
									obj.element_na = (Number(obj.element_na) + Number(m.element_na) * item.amount).toFixed(1);
									obj.element_fe = (Number(obj.element_fe) + Number(m.element_fe) * item.amount).toFixed(1);
									obj.element_zn = (Number(obj.element_zn) + Number(m.element_zn) * item.amount).toFixed(1);
									obj.element_se = (Number(obj.element_se) + Number(m.element_se) * item.amount).toFixed(1);
									obj.element_cu = (Number(obj.element_cu) + Number(m.element_cu) * item.amount).toFixed(1);
									obj.element_mn = (Number(obj.element_mn) + Number(m.element_mn) * item.amount).toFixed(1);
								});
							}
							if (this.chooseBurdening && this.chooseBurdening.length > 0) {
								this.chooseBurdening.forEach(n => {
									obj.energy = (Number(obj.energy) + n.unit_energy * item.amount).toFixed(1);
									obj.protein = (Number(obj.protein) + Number(n.protein) * item.amount).toFixed(1);
									obj.axunge = (Number(obj.axunge) + Number(n.axunge) * item.amount).toFixed(1);
									obj.carbohydrate = (Number(obj.carbohydrate) + Number(n.carbohydrate) * item.amount).toFixed(1);
									obj.cholesterol = (Number(obj.cholesterol) + Number(n.cholesterol) * item.amount).toFixed(1);
									obj.vitamin_a = (Number(obj.vitamin_a) + Number(n.vitamin_a) * item.amount).toFixed(1);
									obj.vitamin_d = (Number(obj.vitamin_d) + Number(n.vitamin_d) * item.amount).toFixed(1);
									obj.vitamin_e = (Number(obj.vitamin_e) + Number(n.vitamin_e) * item.amount).toFixed(1);
									obj.vitamin_k = (Number(obj.vitamin_k) + Number(n.vitamin_k) * item.amount).toFixed(1);
									obj.vitamin_b1 = (Number(obj.vitamin_b1) + Number(n.vitamin_b1) * item.amount).toFixed(1);
									obj.vitamin_b2 = (Number(obj.vitamin_b2) + Number(n.vitamin_b2) * item.amount).toFixed(1);
									obj.vitamin_b3 = (Number(obj.vitamin_b3) + Number(n.vitamin_b3) * item.amount).toFixed(1);
									obj.vitamin_b6 = (Number(obj.vitamin_b6) + Number(n.vitamin_b6) * item.amount).toFixed(1);
									obj.vitamin_b12 = (Number(obj.vitamin_b12) + Number(n.vitamin_b12) * item.amount).toFixed(1);
									obj.folic_acid = (Number(obj.folic_acid) + Number(n.folic_acid) * item.amount).toFixed(1);
									obj.vitamin_c = (Number(obj.vitamin_c) + Number(n.vitamin_c) * item.amount).toFixed(1);
									obj.element_ca = (Number(obj.element_ca) + Number(n.element_ca) * item.amount).toFixed(1);
									obj.element_p = (Number(obj.element_p) + Number(n.element_p) * item.amount).toFixed(1);
									obj.element_mg = (Number(obj.element_mg) + Number(n.element_mg) * item.amount).toFixed(1);
									obj.element_k = (Number(obj.element_k) + Number(n.element_k) * item.amount).toFixed(1);
									obj.element_na = (Number(obj.element_na) + Number(n.element_na) * item.amount).toFixed(1);
									obj.element_fe = (Number(obj.element_fe) + Number(n.element_fe) * item.amount).toFixed(1);
									obj.element_zn = (Number(obj.element_zn) + Number(n.element_zn) * item.amount).toFixed(1);
									obj.element_se = (Number(obj.element_se) + Number(n.element_se) * item.amount).toFixed(1);
									obj.element_cu = (Number(obj.element_cu) + Number(n.element_cu) * item.amount).toFixed(1);
									obj.element_mn = (Number(obj.element_mn) + Number(n.element_mn) * item.amount).toFixed(1);
								});
							}
						} else {
							console.log(obj);
						}
					} else {
						obj['diet_contents_no'] = item.food_no;
						obj['diret_type'] = 'diet_contents';
					}
					arr.push(obj);
				});
				let serviceName = 'srvhealth_diet_record_add';
				let url = this.getServiceUrl('health', serviceName, 'operate');
				let req = [{ serviceName: serviceName, colNames: ['*'], data: arr }];
				console.log('this.userInfo', self.userInfo);
				if (self.userInfo && self.userInfo.sex && self.userInfo.weight && self.userInfo.birthday) {
					let res = await self.$http.post(url, req);
					if (res.data.state === 'SUCCESS') {
						console.log('-------添加---', res);
						// self.addRecodChildData(res.data.response[0].response.effect_data[0].diet_record_no);
						// 通知健康追踪页面，饮食记录已改变，需要刷新数据
						uni.$emit('dietUpdate');
						uni.navigateBack({
							delta: 0
						});
						// }
					}
				} else {
					uni.showModal({
						title: '提示',
						content: '当前没有进行登记年龄、性别和体重，是否去登记?',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/otherPages/chooseFood/myFoodsInfo'
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			}
		},
		async addRecodChildData(id) {
			let chooseBurdening = [];
			let minceListChoose = [];
			if (this.chooseBurdening.length > 0) {
				this.chooseBurdening.forEach(item => {
					let obj = {
						item_form_type: item.item_form_type,
						choose_type: item.choose_type,
						food_no: item.food_no,
						unit: item.unit,
						name: item.name,
						unit_amount: item.unit_amount,
						diet_record_no: id
					};
					chooseBurdening.push(obj);
				});
			}
			if (this.minceListChoose.length > 0) {
				this.minceListChoose.forEach(alone => {
					let obj1 = {
						item_form_type: alone.item_form_type,
						item_mixed_food_no: alone.item_mixed_food_no,
						choose_type: alone.choose_type,
						unit: alone.unit,
						name: item.name,
						unit_amount: alone.unit_amount,
						diet_record_no: id
					};
					minceListChoose.push(obj1);
				});
			}
			let data = [...chooseBurdening, ...minceListChoose];
			let serviceName = 'srvhealth_diet_record_item_add';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [{ serviceName: serviceName, colNames: ['*'], condition: [{ colName: 'diet_record_no', ruleType: 'eq', value: id }], data: data }];
			let res = await this.$http.post(url, req);
		},
		async UpdateDietInfo() {
			if ((this.dietInfo.food_no || this.dietInfo.meal_no) && !this.dietInfo.diet_record_no) {
				this.addDietRecord();
				return;
			}
			let self = this;
			let dietInfo = this.deepClone(this.dietInfo);
			let serviceName = 'srvhealth_diet_record_update';
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
							cook_method: this.cook_method
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
			let serviceName = 'srvhealth_diet_record_select';
			let condition = [
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
			];
			if (this.food_no) {
				serviceName = 'srvhealth_diet_contents_select';
				condition = [
					{
						colName: 'food_no',
						ruleType: 'like',
						value: this.food_no
					}
				];
			}
			if (this.meal_no) {
				serviceName = 'srvhealth_mixed_food_nutrition_contents_select';
				condition = [
					{
						colName: 'meal_no',
						ruleType: 'like',
						value: this.meal_no
					}
				];
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: condition,
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				if (this.diet_record_no) {
					res.data.data.map(item => {
						if (item.diet_record_no === this.diet_record_no) {
							item.unit_energy = item.energy / item.amount;
							if (!item.amount) {
								item.amount = 1;
							}
							this.dietInfo = item;
						}
					});
					this.$store.commit('SET_DIET_RECORD', res.data.data);
					this.dietRecordList = res.data.data;
				} else if ((this.food_no || this.meal_no) && res.data.data.length > 0) {
					if (!res.data.data[0].amount) {
						res.data.data[0].amount = 1;
					}
					this.dietInfo = res.data.data[0];
					this.dietRecordList = res.data.data;
				}
				if (this.dietInfo.cook_method_default) {
					this.cook_method = this.dietInfo.cook_method_default;
				}
				if (this.dietInfo.diet_record_no && this.dietInfo.cook_method) {
					this.cook_method = this.dietInfo.cook_method;
				}
			}
		},
		changeAmount(e, step = 1) {
			if (!this.dietInfo.amount) {
				this.dietInfo.amount = 1;
			}
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
		changeDiningType(e) {
			this.dining_type = e;
		},
		chooseCookType(e) {
			// 选择食物烹调方式
			this.cook_method = e;
		},
		checkUnit(currentUnit) {
			// 切换单位
			// let currentUnit = this.unitList[index];
			this.dietInfo.unit_weight_g = currentUnit.unit_weight_g ? currentUnit.unit_weight_g : currentUnit.amount;
			if (currentUnit.unit === 'g') {
				this.dietInfo.unit_energy = currentUnit.unit_energy;
			} else {
				this.dietInfo.unit_energy = (currentUnit.amount * this.dietInfo.unit_energy) / this.dietInfo.unit_weight_g;
			}
			this.dietInfo.unit = currentUnit.unit;
			this.dietInfo.energy = this.dietInfo.unit_energy * this.dietInfo.amount;
			setTimeout(() => {
				this.$refs.elementDetail.buildChartOption(this.dietInfo);
			}, 200);
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
							uni.$emit('dietUpdate');
							if (res.data.resultCode === 'SUCCESS') {
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
	onShareAppMessage(res) {
		let path = '';
		let title = '百想健康';
		if (this.userInfo && this.userInfo.no) {
			let no = this.dietInfo.food_no ? this.dietInfo.food_no : this.dietInfo.diet_record_no ? this.dietInfo.diet_record_no : this.dietInfo.diet_contents_no;
			if (no) {
				path = `/archivesPages/DietDetail/DietDetail?chooseDate=${this.formateDate()}&no=${no}&from=share&option.invite_user_no=${this.userInfo.userno}`;
			} else {
				return;
			}
			title = `【${this.dietInfo.name}】`;
		}
		return {
			title: title,
			path: path
		};
	},
	onLoad(option) {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
		if (option.planNo) {
			this.planNo = option.planNo;
		}
		if (option.chooseDate && option.no) {
			this.chooseDate = option.chooseDate;
			if (option.no.indexOf('DR') !== -1) {
				this.diet_record_no = option.no;
			} else if (option.no.indexOf('FD') !== -1) {
				uni.setNavigationBarTitle({
					title: '食材信息'
				});
				this.food_no = option.no;
			} else if (option.no.indexOf('ML') !== -1) {
				// 混合食物
				uni.setNavigationBarTitle({
					title: '食物信息'
				});
				this.meal_no = option.no;
			}
			this.getDietRecordDetail(this.chooseDate);
		}
	}
};
</script>

<style lang="scss">
.current-diet-detail {
	width: 100vw;
	height: 100vh;
	// overflow-x: hidden;
	background-color: #f9f9f9;
	.title-bar {
		display: flex;
		justify-content: center;
		min-height: 80rpx;
		align-items: center;
		background-color: #fff;
		position: relative;
		border-bottom: #eee 1rpx solid;
		.date {
			font-size: 32rpx;
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
