<template>
	<view class="health-archive-wrap" v-if="(is_login && authSetting && authSetting.userInfo) || (is_login && client_env === 'h5')">
		<view class="health-archive-item ">
			<view class="subtitle">
				<text class="title-text">健康记录</text>
				<view class="title-action" @click="navPages('history')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">查看历史</text>
				</view>
			</view>
			<view class="content grid-layout">
				<view class="grid-item" @click="toPages('diet')">
					<view class="title">
						饮食
						<text class="ratio">[50%]</text>
					</view>
					<view class="data text-green">{{ dietScore ? dietScore : '0' }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sport')">
					<view class="title">
						运动
						<text class="ratio">[20%]</text>
					</view>
					<view class="data text-red">{{ sportScore ? sportScore : 0 }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('weight')">
					<view class="title">
						体重
						<text class="ratio">[5%]</text>
					</view>
					<view class="data text-gray">{{ weightScore ? weightScore : 0 }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('bp')">
					<view class="title">
						血压
						<text class="ratio">[5%]</text>
					</view>
					<view class="data text-gray">{{ BPScore ? BPScore : 0 }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sleep')">
					<view class="title">
						睡眠
						<text class="ratio">[10%]</text>
					</view>
					<view class="data text-blue">{{ sleepScore ? sleepScore : 0 }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('symptom')">
					<view class="title">
						症状
						<text class="ratio">[10%]</text>
					</view>
					<view class="data text-orange">10</view>
					<view class="action"></view>
				</view>
			</view>
		</view>
		<view class="health-advice">
			<view class="health-advice-item bg-orange light" v-if="weightAdvice">
				<text class="cuIcon-info">{{ weightAdvice }}</text>
			</view>
			<view class="health-advice-item bg-blue light" v-if="sportScoreAdvice">
				<text class="cuIcon-info">{{ sportScoreAdvice }}</text>
			</view>
			<view class="health-advice-item bg-yellow light" v-if="sleepAdvice">
				<text class="cuIcon-info">{{ sleepAdvice }}</text>
			</view>
			<view class="health-advice-item bg-green light" v-if="dietAdvice">
				<text class="cuIcon-info">{{ dietAdvice }}</text>
			</view>
		</view>
	</view>
	<bx-auth v-else-if="authBoxDisplay" @getuserinfo="getuserinfo"></bx-auth>
</template>

<script>
	import energyListWrap from '@/static/js/element_info.js';
	import {
		mapGetters,
		mapState
	} from 'vuex';
	import dayjs from '@/static/js/dayjs.min.js';
	export default {
		data() {
			return {
				isLogin: false,
				userList: [],
				userInfo: {},
				loginUserInfo: {},
				energyListWrap: energyListWrap,
				dietScore: false,
				sportScore: false,
				sleepScore: false,
				BPScore: false,
				isLoad: false,
				dietAdvice: '',
			};
		},
		computed: {
			...mapState({
				inviterInfo: state => state.app.inviterInfo,
				vuex_userInfo: state => state.user.userInfo,
				vuex_userList: state => state.user.userList
			}),
			...mapGetters({
				authSetting: 'authSetting',
				is_login: 'isLogin',
				wxUserInfo: 'wxUserInfo',
				client_env: 'env',
				authBoxDisplay: 'authBoxDisplay'
			}),
			todayScore() {
				if (this.todayTotalScore && typeof this.todayTotalScore === 'number') {
					let score = this.todayTotalScore;
					let obj = {};
					if (Number(score) !== parseInt(score)) {
						// 小数
						let arr = score.toString().split('.');
						if (arr.length == 2) {
							return {
								number: arr[0],
								digit: arr[1].toString()
							};
						}
					} else {
						return {
							number: this.todayTotalScore,
							digit: 0
						};
					}
				}
			},
			bmi() {
				if (this.vuex_userInfo.weight && this.vuex_userInfo.height) {
					return Number((Number(this.vuex_userInfo.weight) / Math.pow(Number(this.vuex_userInfo.height) / 100, 2)).toFixed(1));
				}
			},
			age() {
				if (this.vuex_userInfo.birthday) {
					let age = new Date().getFullYear() - new Date(this.vuex_userInfo.birthday).getFullYear();
					return age;
				}
			},
			todayTotalScore() {
				let result = this.dietScore + this.sportScore + this.weightScore + this.BPScore + this.sleepScore + 10;
				return Number(result.toFixed(1));
			},
			sleepAdvice() {
				let result = '';
				let score = this.sleepScore;
				if (score || score === 0) {
					if (score < 7) {
						result = '睡眠时间不足，若想提高您的睡眠分数，您需要尽量保持每日至少七小时睡眠时间，避免熬夜，最好每天在23:00之前入睡';
					}
				}
				return result;
			},
			sportScoreAdvice() {
				let result = '';
				if (typeof this.sportScore === 'number') {
					let score = this.sportScore;
					if (score <= 10) {
						result = '近期的运动量过少，若想提高运动分数，您需要增加运动量';
					} else if (score > 10 && score <= 20) {
						result = '近期运动情况良好，若想提高运动分数，可适当增加运动量';
					}
				}
				return result;
			},
			weightAdvice() {
				let bmi = this.bmi;
				let result = '';
				if (bmi) {
					if (bmi <= 28 && bmi >= 24) {
						//0-2.5
						result = '您的体重过高，若想提高体重分数,您需要适当进行运动并减少热量摄入';
					} else if (bmi >= 21 && bmi < 24) {
						// 5-2.5
						result = '您的体重略高于标准范围，若想提高体重分数,您需要适当进行运动，减少热量摄入';
					} else if (bmi >= 18.5 && bmi < 21) {
						//2.5-5
						result = '您的体重在标准范围之内，若想提高体重分数,您可以适当进行运动，增加热量摄入';
					} else if (bmi < 18.5 && bmi >= 10) {
						//2.5-0
						result = '您的体重过低，若想提高体重分数,您需要适当进行运动并从食物中补充足够的蛋白质。';
					}
				}
				return result;
			},
			weightScore() {
				// 计算体重分数
				if (this.bmi) {
					let bmi = this.bmi;
					let result = 0;
					// >28 及<10 都是0
					if (bmi <= 28 && bmi >= 24) {
						//0-2.5
						result = (2.5 * (28 - bmi)) / 4;
					} else if (bmi >= 21 && bmi < 24) {
						// 5-2.5
						result = 5 - (bmi - 21) / 3;
					} else if (bmi >= 18.5 && bmi < 21) {
						//2.5-5
						result = 2.5 + bmi - 18.5;
					} else if (bmi < 18.5 && bmi >= 10) {
						//2.5-0
						result = (Math.abs(10 - bmi) * 2.5) / 8.5;
					}
					return Number(result.toFixed(1));
				} else {
					return 0;
				}
			}
		},
		methods: {
			async calcDietScore() {
				// 满分 50
				let result = 0;
				let bmi = this.bmi;
				// bmi 占10分
				// >28 及<10 都是0
				if (bmi <= 28 && bmi >= 24) {
					//0-5
					result = (5 * (28 - bmi)) / 4;
				} else if (bmi >= 21 && bmi < 24) {
					//10-5
					result = 10 - ((bmi - 21) * 5) / 3;
				} else if (bmi >= 18.5 && bmi < 21) {
					//5-10
					result = 5 + (bmi - 18.5) * 2;
				} else if (bmi < 18.5 && bmi >= 10) {
					result = (Math.abs(10 - bmi) * 5) / 8.5;
				}
				let energyInfo = await this.getDietRecord();
				let advice = '您需要增加';
				if (Array.isArray(energyInfo) && energyInfo.length > 0) {
					energyInfo.forEach(ele => {
						if (ele.key === 'protein') {
							if (ele.EAR < ele.value && ele.value < ele.EAR * 2) {
								result += 10;
							} else if (ele.EAR > ele.value) {
								result += (ele.value * 10) / ele.EAR;
								advice += '、蛋白质';
							}
						} else {
							if (ele.EAR < ele.value && ele.value < ele.EAR * 2) {} else if (ele.EAR > ele.value) {
								result += (ele.value * 2) / ele.EAR;
								advice += `、${ele.label}`;
							}
						}
					});
				}
				if (advice.split('、').length > 1) {
					if (advice.split('、').length > 4) {
						advice =
							advice
							.split('、')
							.slice(0, 4)
							.reduce((pre, cur) => pre + cur + ',', '') + '等元素的摄入';
					} else {
						advice = advice + '的摄入';
					}
				}
				this.dietAdvice = advice;
				return Number(result.toFixed(1));
			},
			async calcSportScore() {
				// 满分20
				let sportRecord = await this.getSportRecord();
				if (Array.isArray(sportRecord)) {
					let result = sportRecord.reduce((a, b) => a + b.amount * b.energy, 0);
					if (result > 200) {
						result = 200;
					}
					result = (result * 20) / 200;
					return Number(result.toFixed(1));
				} else {
					return 0;
				}
			},
			async calcSleepScore() {
				// 满分10分 睡觉时间：7小时以内每小时1分;11点前2分，12点1分
				let record = await this.getSleepRecord('sleep');
				let result = 0;
				if (record && record.id) {
					let sleep_time = (new Date(record.getup_time) - new Date(record.retire_time)) / 1000; // 秒数
					if (sleep_time > 25200) {
						// 大于七小时;
						result += 7;
					} else {
						result += Number((sleep_time / 3600).toFixed(1));
					}
					if (record.sleepy_daytime === '很少') {
						result += 3;
					} else if (record.sleepy_daytime === '从不') {
						result += 2;
					} else if (record.sleepy_daytime === '经常') {
						result += 1;
					} else if (record.sleepy_daytime === '严重') {
						result += 0;
					}
				}
				return result;
			},
			async calcBPScore() {
				let item = await this.getSleepRecord('bloodPressure');
				let result = 0;
				if (item && item.no) {
					// diastolic_pressure
					if (item.diastolic_pressure < 80) {
						result += 2.5;
					} else if (item.diastolic_pressure < 90 && item.diastolic_pressure >= 80) {
						result += 1;
					} else if (item.diastolic_pressure >= 90) {}
					if (item.systolic_pressure < 120) {
						result += 2.5;
					} else if (item.systolic_pressure >= 120 && item.systolic_pressure < 140) {
						result += 1;
					} else if (item.systolic_pressure >= 140) {}
				}
				return result;
			},
			async getSleepRecord(type = 'sleep') {
				let serviceObj = {
					weight: 'srvhealth_body_fat_measurement_record_select', // 体重体脂
					bloodPressure: 'srvhealth_blood_pressure_record_select', // 血压
					sleep: 'srvhealth_sleep_record_select' //
				};
				let serviceName = serviceObj[type];
				let url = this.getServiceUrl('health', serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: [],
					order: [{
						colName: 'create_time',
						orderType: 'desc' // asc升序  desc降序
					}],
					page: {
						pageNo: 1,
						rownumber: 2
					}
				};
				if (type === 'sleep') {
					req.condition = [{
							colName: 'user_info_no',
							ruleType: 'like',
							value: this.vuex_userInfo.no
						},
						{
							colName: 'getup_time',
							ruleType: 'like',
							value: this.formateDate(new Date(), 'date').trim()
						}
					];
				} else if (type === 'bloodPressure') {
					req.condition = [{
						colName: 'create_user',
						ruleType: 'like',
						value: this.vuex_userInfo.userno
					}, {
						colName: 'name',
						ruleType: 'like',
						value: this.vuex_userInfo.name
					}];
				}
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					return res.data.data[0];
				} else {
					return false;
				}
			},
			async getSportRecord() {
				// 运动记录
				let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_body_activity_record_select',
					colNames: ['*'],
					condition: [{
							colName: 'userno',
							ruleType: 'like',
							value: this.vuex_userInfo.userno
						},
						{
							colName: 'user_name',
							ruleType: 'like',
							value: this.vuex_userInfo.name
						},
						{
							colName: 'hdate',
							ruleType: 'like',
							value: this.formateDate(new Date(), 'date').trim()
						}
					],
					order: [{
						colName: 'create_time',
						orderType: 'desc'
					}]
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					return res.data.data;
				}
			},
			async getDietRecord() {
				// 查找饮食记录
				let self = this;
				let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_diet_record_select',
					colNames: ['*'],
					condition: [{
							colName: 'userno',
							ruleType: 'like',
							value: this.vuex_userInfo.userno
						},
						{
							colName: 'user_name',
							ruleType: 'like',
							value: this.vuex_userInfo.name
						},
						{
							colName: 'hdate',
							ruleType: 'like',
							value: this.formateDate(new Date(), 'date').trim()
						}
					],
					order: [{
						colName: 'create_time',
						orderType: 'desc'
					}]
				};
				let res = await this.$http.post(url, req);
				let dietRecord = [];
				let foodType = [];
				if (Array.isArray(res.data.data)) {
					dietRecord = res.data.data;
					if (Array.isArray(dietRecord) && dietRecord.length > 0) {
						foodType = await this.getFoodsDetail(dietRecord);
					}
				}
				let eleArr = [];
				let energyListWrap = await this.getNutrientRecommended();
				energyListWrap = this.energyListWrap.map(item => {
					item.matterList = item.matterList.map(ele => {
						energyListWrap.forEach(ene => {
							if (ene.nutrient === ele.name || ene.nutrient.indexOf(ele.name) !== -1) {
								ele.UL = ene.val_ul ? ene.val_ul : ele.UL;
								ele.EAR = ene.val_rni ? ene.val_rni : ele.EAR;
								if (item.title !== '水溶性维生素') {
									ele.UL = ene.val_ul ? ene.val_ul : ele.UL;
								} else {
									ele.UL = 0;
								}
								if (ele.name === '蛋白') {
									ele.EAR = ene.val_rni ? ene.val_rni * self.vuex_userInfo.weight : ene.val_ear ? ene.val_ear * self.vuex_userInfo
										.weight : ele.EAR * self.vuex_userInfo.weight;
									ele.UL = 0;
								}
							} else {
								if (ele.name === '脂肪') {
									ele.EAR = Number((self.vuex_userInfo.weight * 50 * 0.2) / 9).toFixed(2);
									ele.UL = 0;
								}
								if (ele.name === '碳水') {
									ele.EAR = self.vuex_userInfo.weight * 4;
									ele.UL = 0;
								}
							}
						});
						return ele;
					});
					return item;
				});
				energyListWrap.forEach(ele => {
					eleArr = this.deepClone([...eleArr, ...ele.matterList]);
				});
				eleArr = eleArr.map(ele => {
					dietRecord.forEach(diet => {
						foodType.forEach(food => {
							if ((food.food_no && food.food_no === diet.diet_contents_no) || (food.meal_no && food.meal_no === diet.mixed_food_no)) {
								let ratio = 1;
								if (food['unit'] === 'g') {
									ratio = (diet.unit_weight_g * diet.amount) / food.unit_amount;
								}
								ele.value = ele.value + food[ele['key']] * ratio;
							}
						});
					});
					return ele;
				});
				return eleArr;
			},
			async getNutrientRecommended() {
				let self = this;
				let url = this.getServiceUrl('health', 'srvhealth_nutrient_values_recommended_select', 'select');
				let req = {
					serviceName: 'srvhealth_nutrient_values_recommended_select',
					colNames: ['*'],
					order: [{
						colName: 'nutrient',
						orderType: 'desc' // asc升序  desc降序
					}]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					let result = res.data.data.filter(item => {
						if ((item.sex && item.sex.indexOf(self.vuex_userInfo.sex) !== -1) || !item.sex) {
							if (item.age_start && item.age_end) {
								return self.age >= item.age_start && self.age < item.age_end;
							} else if (item.age_start && !item.age_end) {
								return self.age >= item.age_start;
							} else if (!item.age_start && !item.age_end) {
								return true;
							} else {
								return false;
							}
						}
					});
					result.forEach(item => {
						self.energyListWrap.forEach(energy => {
							energy.matterList.forEach(mat => {
								if (item.nutrient === mat.name || item.nutrient.indexOf(mat.name) !== -1) {
									mat.UL = item.val_ul ? item.val_ul : mat.UL;
									mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
									if (energy.title !== '水溶性维生素') {
										mat.UL = item.val_ul ? item.val_ul : mat.UL;
									} else {
										mat.UL = 0;
									}
									if (mat.name === '蛋白') {
										mat.EAR = item.val_rni ? item.val_rni * self.vuex_userInfo.weight : item.val_ear ? item.val_ear * self
											.vuex_userInfo.weight : mat.EAR * self.vuex_userInfo.weight;
										mat.UL = 0;
									}
								} else {
									if (mat.name === '脂肪') {
										mat.EAR = Number((self.vuex_userInfo.weight * 50 * 0.2) / 9).toFixed(2);
										mat.UL = 0;
									}
									if (mat.name === '碳水') {
										mat.EAR = self.vuex_userInfo.weight * 4;
										mat.UL = 0;
									}
								}
							});
						});
					});
					return result;
				}
			},

			toPages(e) {
				let condType = {};
				let url = '';
				switch (e) {
					case 'diet':
					case 'sport':
					case 'sleep':
					case 'weight':
					case 'bp':
					case 'symptom':
						url = `/archivesPages/archives-history/archives-history?pageType=${e}`;
						break;
					case 'basic-info':
						url = '/questionnaire/couple/couple';
						break;
					case 'score-compose':
						url = '/archivesPages/healthCompose/healthCompose';
						break;
					case 'test':
						url = '/pages/testPage/testPage';
						break;
				}
				if (!url) {
					// uni.navigateTo({
					// 	url: '/otherPages/otherIndicator/otherIndicator?type=' + e
					// });
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			navPages(type = 'history') {
				if (type === 'history') {
					uni.navigateTo({
						url: '/archivesPages/archives-history/archives-history?isAll=true'
					});
				} else if (type === 'plan') {
					let fieldsCond = [{
							column: 'create_manager_no',
							display: false
						},
						{
							column: 'owner_type',
							display: false,
							value: '个人'
						},
						{
							column: 'store_no',
							display: false
						},
						{
							column: 'sdr_no',
							display: false
						},
						{
							column: 'owner_person_no',
							display: false,
							value: this.vuex_userInfo.no
						}
					];
					let params = {
						to: '/archivesPages/DrugPlan/DrugPlan', //提交后要跳转的页面
						idCol: 'ds_no' // 跳转时携带的参数
					};
					uni.navigateTo({
						url: `/publicPages/newForm/newForm?serviceName=srvhealth_plan_schedule_add&type=add&fieldsCond=${encodeURIComponent(
						JSON.stringify(fieldsCond)
					)}&params=${encodeURIComponent(JSON.stringify(params))}`
					});
				}
			},
			// 查找当前帐号建立的用户列表
			async selectUserList() {
				const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_info_select',
					colNames: ['*'],
					condition: [{
						colName: 'create_user',
						ruleType: 'eq',
						value: uni.getStorageSync('login_user_info').user_no
					}],
					order: [{
						colName: 'create_time',
						orderType: 'asc'
					}]
				};
				const res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					// 有数据

					this.$store.commit('SET_USERLIST', res.data.data);
					let info = res.data.data.find(item => item.no === uni.getStorageSync('cur_user_no'))
					if (info&&info.no) {
						this.$store.commit('SET_USERINFO', info);
					} else {
						uni.setStorageSync('current_user_info', res.data.data[0]);
						uni.setStorageSync('current_user', res.data.data[0].name);
						this.userInfo = res.data.data[0];
						if (!item.profile_url) {
							if (this.wxUserInfo.headimgurl) {
								this.updateUserInfo();
							}
						}
						this.$store.commit('SET_USERINFO', res.data.data[0]);
					}
					if (this.vuex_userInfo && this.vuex_userInfo.requirement) {
						let tags = this.vuex_userInfo.requirement.split(',');
						if (Array.isArray(this.checkboxList) && this.checkboxList.length > 0) {
							this.selectedTags = this.checkboxList.filter(item => {
								if (tags.includes(item.value)) {
									item.checked = true;
									return true;
								}
							});
							this.checkboxList = this.checkboxList.map(item => {
								if (tags.includes(item.value)) {
									item.checked = true;
								}
								return item;
							});
						}
					}
					uni.setStorageSync('user_info_list', res.data.data);
					this.userList = res.data.data;
					return res.data.data;
				} else if (res.data.resultCode === '0011') {
					// 登录失效 进行静默登录
					this.isLogin = false;
					this.$store.commit('SET_LOGIN_STATE', false);
					// #ifdef MP-WEIXIN
					const result = await wx.login();
					if (result.code) {
						this.code = result.code;
						await this.wxLogin({
							code: result.code
						});
						await this.initPage();
					}
					// #endif
				} else if (Array.isArray(res.data.data) && res.data.data.length === 0) {
					// 没有角色 提示跳转到创建角色页面
					this.toAddPage(this.wxUserInfo);
				}
			},
			async initPage() {
				let self = this;
				let userInfo = uni.getStorageSync('login_user_info');
				// #ifdef MP-WEIXIN
				let res = await wx.getSetting();
				if (!res.authSetting['scope.userInfo']) {
					this.$store.commit('SET_AUTH_SETTING', {
						type: 'userInfo',
						value: false
					});
					this.$store.commit('SET_AUTH_USERINFO', false);
					// 没有获取用户信息授权
					return;
				} else {
					this.updateUserInfo();
				}
				// #endif
				if (!userInfo || !uni.getStorageSync('isLogin')) {
					// 未登录 h5跳转到登录页,小程序端进行静默登录
					// #ifdef MP-WEIXIN
					const result = await wx.login();
					if (result.code) {
						this.code = result.code;
						await this.wxLogin({
							code: result.code
						});
						await this.initPage();
					}
					// #endif
					// #ifdef H5
					uni.navigateTo({
						url: '/publicPages/accountExec/accountExec'
					});
					// #endif
				} else {
					this.$store.commit('SET_LOGIN_STATE', true);
					this.isLogin = true;
				}
				if (userInfo) {
					this.loginUserInfo = userInfo;
					await this.selectUserList();
					if (!this.dietScore && this.dietScore !== 0) {
						this.dietScore = await this.calcDietScore();
					}
					if (!this.sportScore) {
						this.sportScore = await this.calcSportScore();
					}
					if (!this.sleepScore) {
						this.sleepScore = await this.calcSleepScore();
					}
					if (!this.BPScore) {
						this.BPScore = await this.calcBPScore();
					}
				}
			},
			updateUserInfo() {
				let self = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(user) {
						let rawData = {
							nickname: user.userInfo.nickName,
							sex: user.userInfo.gender,
							country: user.userInfo.country,
							province: user.userInfo.province,
							city: user.userInfo.city,
							headimgurl: user.userInfo.avatarUrl
						};
						self.$store.commit('SET_WX_USERINFO', rawData);
						console.log(self.wxUserInfo);
						console.log(self.vuex_userInfo);
						if (self.vuex_userInfo && self.vuex_userInfo.no && rawData.headimgurl !== self.vuex_userInfo.profile_url) {
							self.updateUserProfile(rawData.headimgurl, self.vuex_userInfo.no, user.userInfo.nickName).then(_ => {
								let userInfo = self.userInfo;
								self.userInfo.profile_url = self.wxUserInfo.headimgurl;
							});
						}
					}
				});
				this.isAuthUserInfo = true;
				this.$store.commit('SET_AUTH_SETTING', {
					type: 'userInfo',
					value: true
				});
				this.$store.commit('SET_AUTH_USERINFO', true);
			},
			toAddPages() {
				let fieldsCond = [{
						column: 'profile_url',
						display: false
					},
					{
						column: 'manager_type',
						display: false
					},
					{
						column: 'userno',
						display: false
						// value: uni.getStorageSync('login_user_info').user_no,
					}
				];
				let wxUserInfo = uni.getStorageSync('wxUserInfo');
				if (wxUserInfo && wxUserInfo.headimgurl) {
					fieldsCond = fieldsCond.map(item => {
						if (item.column === 'profile_url') {
							item.value = wxUserInfo.headimgurl;
						}
						return item;
					});
				}
				uni.setStorageSync('activeApp', 'health');
				uni.navigateTo({
					url: '/publicPages/newForm/newForm?serviceName=srvhealth_person_info_add&type=add&fieldsCond=' +
						decodeURIComponent(JSON.stringify(fieldsCond))
				});
			},
			async getuserinfo(e) {
				// #ifdef MP-WEIXIN
				const user = e.mp.detail;
				if (user && user.userInfo) {
					let rawData = {
						nickname: user.userInfo.nickName,
						sex: user.userInfo.gender,
						country: user.userInfo.country,
						province: user.userInfo.province,
						city: user.userInfo.city,
						headimgurl: user.userInfo.avatarUrl
					};
					this.setWxUserInfo(rawData);
					this.$store.commit('SET_WX_USERINFO', rawData);
					this.$store.commit('SET_AUTH_SETTING', {
						type: 'userInfo',
						value: true
					});
					this.$store.commit('SET_AUTH_USERINFO', true);
					const result = await wx.login();
					if (result.code) {
						this.wxLogin({
							code: result.code
						});
						this.initPage();
					}
				}
				// #endif
			}
		},
		created(option) {
			uni.$on('data-update', () => {
				if (this.is_login) {
					this.initPage();
				}
			});
		},
		onShareAppMessage(res) {
			let path = `/pages/archives/archives?from=share&invite_user_no=${this.userInfo.userno}`;
			this.saveSharerInfo(this.userInfo, path);
			return {
				title: `${this.userInfo.name}邀请您体验小程序`,
				path: path
			};
		},
		onShow() {
			if (this.is_login) {
				this.initPage();
			}
		}
	};
</script>

<style scoped lang="scss">
	.health-archive-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
		background-color: #f1f1f1;
		padding-bottom: 20rpx;
		max-width: 1080rpx;
		margin: 0 auto;

		.user-info-tip {  
			width: 100%;
			display: flex;
			justify-content: flex-start;
			margin-bottom: 20rpx;

			.tips {
				min-width: 33%;
				color: #fff;
				border-top-right-radius: 50rpx;
				border-bottom-right-radius: 50rpx;
				background-color: #2b85e4;
				padding: 10rpx 20rpx;
				animation: 2s ease slidein;

				.text {
					margin-left: 10rpx;
				}
			}
		}

		@keyframes slidein {
			from {
				transform: translateX(-300px);
			}

			to {
				transform: translateX(0);
			}
		}

		.avatar {
			margin-right: 10rpx;
			width: 60rpx;
			height: 60rpx;
			border-radius: 100%;
		}

		.top {
			display: flex;
			padding: 20rpx 0;
			padding-right: 20rpx;
			background-color: #fff;
			justify-content: space-between;
			margin-bottom: 20rpx;

			// flex-wrap: wrap;
			.left {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				line-height: 30rpx;
				margin: 0 20rpx;
				overflow: hidden;
				width: 100%;
				white-space: nowrap;
				text-overflow: ellipsis;
				flex: 1;

				.tag-box {
					overflow: scroll;
					width: 100%;

					.tag-item {
						padding: 10rpx;
						border-radius: 5rpx;
						margin-left: 10rpx;
						font-size: 20rpx;

						@for $i from 1 through 20 {
							&:nth-child(#{$i}) {
								@if $i%2==1 {
									color: #409eff;
									background: #ecf5ff;
									border-color: #b3d8ff;
								}

								@else if $i%2==0 {
									color: #67c23a;
									background: #f0f9eb;
									border-color: #c2e7b0;
								}

								@else if $i%3==0 {
									color: #909399;
									background: #f4f4f5;
									border-color: #d3d4d6;
								}

								@else if $i%4==0 {
									color: #e6a23c;
									background: #fdf6ec;
									border-color: #f5dab1;
								}

								@else if $i%5==0 {
									color: #f56c6c;
									background: #fef0f0;
									border-color: #fbc4c4;
								}
							}
						}
					}
				}
			}

			.right {
				display: flex;
				align-items: center;
			}
		}

		.health-archive-item {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			background-color: #fff;

			.subtitle {
				width: 100%;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				position: relative;
				text-indent: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title-text {
					margin: 0;
					padding: 0;
					display: inline-block;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 10%;
						height: 80%;
						width: 5px;
						background-color: #0081ff;
						border-radius: 5rpx;
					}
				}

				.title-action {
					display: flex;
					justify-content: center;
					align-items: center;
					padding-right: 20rpx;
					height: 60rpx;
					border-radius: 50rpx;
					border: 1px solid #f1f1f1;
					// font-size: 50rpx;
					transition: all 1s;

					&:active {
						background-color: #999;
						color: #fff;
					}

					.see-histroy {
						font-size: 24rpx;
						text-indent: 0;
					}
				}
			}

			.content {
				width: 100%;
				min-height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;

				&.grid-layout {
					display: flex;
					flex-wrap: wrap;

					.grid-item {
						width: calc(33% - 20rpx / 3);
						margin-bottom: 10rpx;
						margin-right: 10rpx;

						&:nth-child(3n) {
							margin-right: 0;
						}

						display: flex;
						height: 150rpx;
						box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
						padding: 10rpx;
						flex-direction: column;

						.title {
							text-align: left;

							.ratio {
								font-weight: normal;
								font-size: 24rpx;
								color: #999;
							}
						}

						.data {
							flex: 1;
							font-size: 60rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.action {
							font-size: 24rpx;
							color: #999;
							text-align: right;
						}
					}
				}
			}
		}

		.health-advice {
			color: #0081ff;
			display: flex;
			flex-direction: column;
			transition: height 0.5s;

			.health-advice-item {
				padding: 20rpx;
				margin-bottom: 10rpx;
				width: 100%;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
