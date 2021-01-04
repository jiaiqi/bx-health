<template>
	<view class="health-archive-wrap" v-if="(is_login && authSetting && authSetting.userInfo) || (is_login && client_env === 'h5')">
		<view class="top text-bold">
			<view class="left">
				<view class="avatar" @click="showUserListPopup = true"><image class="avatar" :src="avatarUrl"></image></view>
				<view class="user-name" @click="showUserListPopup = true">{{ userInfo.name }}</view>
				<view class="switch-icon cuIcon-right" @click="showUserListPopup = true"></view>
				<view class="tag-box" @click="showUserHealtManagePopup = true">
					<text class="tag-item" v-for="item in selectedTags" :key="item.value">{{ item.label }}</text>
				</view>
			</view>
			<view class="right" @click="showUserHealtManagePopup = true" v-if="selectedTags.length === 0">健康标签管理</view>
		</view>
		<view class="user-info-tip">
			<text class="tips" @click="toPages('basic-info')">
				<text class="cuIcon-info"></text>
				<text class="text">信息完整度: 75%</text>
			</text>
		</view>
		<view class="health-overall-score">
			<view class="content">
				<view class="score-item" @click="toPages('score-compose')">
					<text class="label">整体健康分</text>
					<text class="value text-blue" v-if="healthTotalScore || healthTotalScore === 0">
						<text class="int" v-if="totalScore && totalScore.number">{{ totalScore.number }}</text>
						<text class="float" v-if="totalScore && totalScore.digit">.{{ totalScore.digit | fixed1 }}</text>
					</text>
					<text class="valuetip text-blue" v-else>
						<text class="cuIcon-all"></text>
						点击评测
					</text>
					<view class="trend" v-if="healthTotalScore">
						<!-- <image src="/static/icon/down3.png" mode="aspectFit" class="trend-icon" style="transform: rotate(180deg);"></image> -->
						<image src="/static/icon/up3.png" mode="aspectFit" class="trend-icon"></image>
						<text class="text">较上次评测增加两分</text>
					</view>
				</view>
				<view class="score-item" @click="showAdvice = !showAdvice">
					<text class="label">近日健康分</text>
					<text class="value  text-cyan">
						<text class="int" v-if="todayScore && todayScore.number">{{ todayScore.number }}</text>
						<text class="float" v-if="todayScore && todayScore.digit">.{{ todayScore.digit | fixed1 }}</text>
						<!-- <text class="ratio"></text> -->
						<text class="cuIcon-info text-cyan tips"></text>
					</text>
				</view>
			</view>
		</view>
		<view class="health-advice">
			<!-- <view class="title">健康建议</view> -->
			<view class="content" :style="{ height: showAdvice ? 'auto' : 0 }">
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
		<view class="health-archive-item health-todos">
			<view class="subtitle">
				<text class="title-text">待办事项</text>
				<view class="title-action" @click="navPages('plan')">
					<text class="cuIcon-add "></text>
					<text class="see-histroy">添加</text>
				</view>
			</view>
			<view class="content todo-list">
				<view class="todo-item" v-for="(item, index) in todoList" :key="index" @click="clickTodoItem(item, index)">
					<!-- <view class="todo-item-content" :class="{ checked: item.checked }"> -->
					<view class="type">{{ item.play_srv }}</view>
					<view class="title">{{ item.ds_name }}</view>
					<view class="cycle">{{ getCycle(item) }}</view>
					<!-- </view> -->
				</view>
			</view>
		</view>
		<view class="health-archive-item health-score">
			<view class="subtitle">
				<text class="title-text">近日健康指数</text>
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
		<view class="health-archive-item ">
			<view class="subtitle">
				<text class="title-text">检查报告</text>
				<view class="title-action" @click="showAddRecordLayout">
					<text class="cuIcon-add "></text>
					<text class="see-histroy">添加</text>
				</view>
			</view>
			<view class="content inspection-report">
				<view class="report-item" v-for="item in inspectReportRecord" :key="item.id" @click="toRecord(item)">
					<view class="images"><image class="image" src="../../static/xuehzi.png" mode="aspectFill"></image></view>
					<view class="title">{{ item.name || '' }}</view>
					<!-- <view class="title">{{ item.name + item.examination_type }}</view> -->
					<view class="date">{{ item.create_time.slice(0, 10) }}</view>
				</view>
				<view class="empty-data" v-if="inspectReportRecord.length === 0 || !inspectReportRecord">
					<view class="cu-load" :class="!isLoad ? 'loading' : ''"></view>
					<view class="" v-if="isLoad">未找到您的检查报告</view>
				</view>
			</view>
		</view>
		<view class="health-archive-item ">
			<view class="subtitle">
				<text class="title-text">疾病风险提示</text>
				<view class=""></view>
			</view>
			<view class="content disease-risk">
				<view class="disease-item text-red">
					<view class="disease-name">高血压</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">90</text>
						%
					</view>
				</view>
				<view class="disease-item text-orange">
					<view class="disease-name">肥胖</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">75</text>
						%
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showAddRecord }">
			<view class="cu-dialog " @tap.stop="">
				<view class="inspect-record">
					<view class="title">选择检查报告类型</view>
					<view class="cu-bar search bg-white">
						<view class="search-form round">
							<text class="cuIcon-search"></text>
							<input @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索检查报告类型" confirm-type="search" />
						</view>
						<view class="action"><button class="cu-btn bg-green shadow-blur round">搜索</button></view>
					</view>
					<tree-selector
						class="selector-wrap"
						:srvInfo="isArray(configCols.option_list_v2) ? null : configCols.option_list_v2"
						:treeData="treeSelectorData"
						:childNodeCol="'_childNode'"
						:disColName="configCols && configCols.option_list_v2 && configCols.option_list_v2['key_disp_col'] ? configCols.option_list_v2['key_disp_col'] : ''"
						:nodeKey="configCols.option_list_v2 && configCols.option_list_v2['refed_col'] ? configCols.option_list_v2['refed_col'] : 'no'"
						@clickLastNode="confirmTree"
					></tree-selector>
					<view class="" v-if="showCustomAddRecord">
						<text>未找到想要的报告类型？</text>
						<text class="text-blue" @click="confirmTree">直接添加</text>
					</view>
					<view class="button-box"><button class="cu-btn bg-grey" @tap="showAddRecord = false">取消</button></view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal"></view>
		<view class="cu-modal" :class="{ show: showUserListPopup }" @tap="showUserListPopup = false">
			<view class="cu-dialog" @tap.stop="">
				<view class="user-list">
					<view class="user-item" @click="switchUser(item)" v-for="item in userList" :key="item.id" :class="{ 'text-blue': item.name === userInfo.name }">
						<image class="avatar" :src="getImagePath(item.profile_url)" size="60"></image>
						{{ item.name }}
					</view>
				</view>
				<view class="button-box"><button class="cu-btn bg-white text-blue" @click="toAddPages">添加新用户</button></view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showUserHealtManagePopup }" @tap="showUserHealtManagePopup = false">
			<view class="cu-dialog health-item" @tap.stop="">
				<bx-checkbox-group max="5" checkboxMode="button" v-model="checkedList">
					<bx-checkbox v-model="item.checked" v-for="item in checkboxList" :key="item.value" :name="item.label">{{ item.label }}</bx-checkbox>
				</bx-checkbox-group>
				<view class="button-box">
					<button class="cu-btn" @click="cancelSelectTag">取消</button>
					<button class="cu-btn " @click="changeSelectedTag">确定</button>
				</view>
			</view>
		</view>
		<!-- <official-account></official-account> -->
	</view>
	<bx-auth v-else-if="authBoxDisplay" @getuserinfo="getuserinfo"></bx-auth>
</template>

<script>
import energyListWrap from '@/static/js/element_info.js';
import { mapGetters } from 'vuex';
import dayjs from '@/static/js/dayjs.min.js';
export default {
	data() {
		return {
			isLogin: false,
			showUserListPopup: false,
			showUserHealtManagePopup: false,
			healthTotalScore: null,
			userList: [],
			userInfo: {},
			loginUserInfo: {},
			checkboxList: [],
			selectedTags: [],
			checkedList: [],
			energyListWrap: energyListWrap,
			dietScore: 0,
			sportScore: 0,
			sleepScore: 0,
			BPScore: 0,
			inspectReportRecord: [],
			isLoad: false,
			showAddRecord: false,
			showCustomAddRecord: false,
			treeSelectorData: [],
			treePageInfo: {
				pageNo: 1,
				rownumber: 20
			},
			configCols: {
				column: 'activity_no',
				label: '选择检查报告类型',
				srvInfo: { serviceName: 'srvdaq_activity_result_submit', appNo: 'daq' },
				type: 'treeSelector',
				isRequire: false,
				display: true,
				option_list_v2: { refed_col: 'daq_survey_activity_no', srv_app: 'health', serviceName: 'srvhealth_see_doctor_lab_examination_select', key_disp_col: 'name' },
				showExp: true,
				value: ''
			},
			todoList: [],
			dietAdvice: '',
			showAdvice: false
		};
	},
	filters: {
		fixed1: function(value) {
			if (value) {
				return value.toString().slice(0, 1);
			} else {
				return 0;
			}
		}
	},
	computed: {
		...mapGetters({
			authSetting: 'authSetting',
			is_login: 'isLogin',
			wxUserInfo: 'wxUserInfo',
			login_user_info: 'loginUserInfo',
			client_env: 'env',
			authBoxDisplay: 'authBoxDisplay'
		}),
		totalScore() {
			if (this.healthTotalScore && typeof this.healthTotalScore === 'number') {
				let score = this.healthTotalScore;
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
						number: this.healthTotalScore,
						digit: 0
					};
				}
			}
		},
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
		disabledTag() {
			if (this.checkedList.length >= 5) {
				return true;
			} else {
				return false;
			}
		},
		avatarUrl() {
			if (this.userInfo.profile_url) {
				return this.getImagePath(this.userInfo.profile_url);
			} else if (this.loginUserInfo.headimgurl) {
				return this.getImagePath(this.loginUserInfo.headimgurl);
			} else if (this.wxUserInfo.headimgurl) {
				return this.getImagePath(this.wxUserInfo.headimgurl);
			}
		},
		bmi() {
			if (this.userInfo.weight && this.userInfo.height) {
				return Number((Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1));
			}
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
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
			}else{
				return 0
			}
		}
	},
	methods: {
		getCycle(e) {
			let endDate = dayjs(e.start_date).add(e.take_days, 'day');
			return `${dayjs(e.start_date).format('MM.DD')}-${dayjs(endDate).format('MM.DD')}`;
		},
		switchUser(item) {
			this.userInfo = item;
			uni.setStorageSync('current_user_info', item);
			uni.setStorageSync('current_user', item.name);
			this.showUserListPopup = false;
			this.initPage();
		},
		clickTodoItem(item, index) {
			if (item.ds_no) {
				if (item.play_srv) {
					uni.navigateTo({
						url: `/archivesPages/DrugPlan/DrugPlan?play_srv=${item.play_srv}&ds_no=${item.ds_no}`
					});
				}
			}
		},
		async getToDoList() {
			let url = this.getServiceUrl('health', 'srvhealth_plan_schedule_select', 'select');
			let req = {
				serviceName: 'srvhealth_plan_schedule_select',
				colNames: ['*'],
				condition: [{ colName: 'owner_person_no', ruleType: 'eq', value: this.userInfo.no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.todoList = res.data.data
					.map(item => {
						if (!item.play_srv) {
							item.play_srv = '用药';
						}
						return item;
					})
					.filter(item => dayjs(item.start_date).add(item.take_days, 'day') >= dayjs().subtract(1, 'day'));
			}
		},
		showAddRecordLayout() {
			this.showAddRecord = true;
			this.showCustomAddRecord = false;
			this.getTreeSelectorData();
		},
		saveValue(e) {
			console.log(e);
		},
		InputBlur(e) {
			let value = e.detail.value;
			if (e.detail.value) {
				let cond = [{ colName: 'name', ruleType: 'like', value: value }];
				this.getTreeSelectorData(cond);
			} else {
				this.getTreeSelectorData();
			}
		},
		async getTreeSelectorData(cond) {
			let self = this;
			let req = {
				serviceName: self.configCols.option_list_v2.serviceName,
				colNames: ['*'],
				condition: [],
				// condition: [{ colName: 'daq_survey_activity_no', ruleType: 'notnull', value: '' }],
				page: { pageNo: this.treePageInfo.pageNo, rownumber: this.treePageInfo.rownumber }
			};
			if (cond) {
				req.condition = [...req.condition, ...cond];
				setTimeout(() => {
					this.showCustomAddRecord = true;
				}, 1000);
			} else {
				this.showCustomAddRecord = false;
			}
			let appName = self.configCols.option_list_v2.srv_app;
			let res = await self.onRequest('select', req.serviceName, req, appName);
			if (res.data.state === 'SUCCESS') {
				if (res.data.page) {
					this.treePageInfo = res.data.page;
				}
				if (res.data.page && res.data.page.pageNo > 1) {
					let data = res.data.data;
					self.treeSelectorData = [...self.treeSelectorData, ...data];
				} else {
					if (res.data.data.length === 0) {
						uni.showToast({
							title: '没有找到相关数据',
							icon: 'none'
						});
					}
					self.treeSelectorData = res.data.data;
				}
			}
		},
		confirmTree(e) {
			if (e.item && e.item.jy_no) {
				let fieldsCond = [
					{ column: 'specimen', value: e.item.specimen }, //标本类型
					{ column: 'examination_type', value: e.item.examination_type }, //检查类别
					{ column: 'jy_no', display: false, value: e.item.jy_no },
					{ column: 'examinate_person_no', display: false, value: this.userInfo.no },
					{ column: 'examinate_name', display: false, value: this.userInfo.name },
					{ column: 'examinate_account', display: false, value: this.userInfo.userno },
					{ column: 'examinate_date', display: true, value: dayjs().format('YYYY-MM-DD') },
					{ column: 'report_daq_survey_activity_no', display: false },
					{ column: 'report_record', display: false },
					{ column: 'report_daq_survey_ack_no', display: false }
				];
				let url = `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`;
				if (e.item.daq_survey_activity_no) {
					let params = {
						to: `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add`, //提交后要跳转的页面
						idCol: 'report_daq_survey_activity_no', // 跳转时携带的参数
						buttonLabel: '下一步',
						fieldsCond: fieldsCond
					};
					fieldsCond[fieldsCond.findIndex(item => item.column === 'report_daq_survey_activity_no')].value = e.item.daq_survey_activity_no;
					url = `/questionnaire/index/index?formType=form&activity_no=${e.item.daq_survey_activity_no}&status=进行中&params=${encodeURIComponent(JSON.stringify(params))}`;
				}
				uni.navigateTo({
					url: url
				});
			} else {
				let fieldsCond = [
					{ column: 'jy_no', display: false },
					{ column: 'examinate_person_no', display: false, value: this.userInfo.no },
					{ column: 'examinate_name', display: false, value: this.userInfo.name },
					{ column: 'examinate_account', display: false, value: this.userInfo.userno },
					{ column: 'examinate_date', display: true, value: dayjs().format('YYYY-MM-DD') },
					{ column: 'report_daq_survey_activity_no', display: false },
					{ column: 'report_record', display: false },
					{ column: 'report_daq_survey_ack_no', display: false }
				];
				uni.navigateTo({
					url: `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`
				});
			}
		},
		toQuestionnaire(no) {
			uni.navigateTo({
				url: `/questionnaire/index/index?formType=form&activity_no=${no}&status=进行中`
			});
		},
		toRecord(item) {
			// 跳转到血脂检查记录页面。
			// fill_batch_no activity_no
			let fieldsCond = [
				{ column: 'jybg_no', display: false, value: item.jybg_no },
				{ column: 'jy_no', display: false },
				{ column: 'examinate_person_no', display: false },
				{ column: 'examinate_name', display: false },
				{ column: 'examinate_account', display: false },
				{ column: 'report_daq_survey_activity_no', display: false },
				{ column: 'report_record', display: false },
				{ column: 'report_daq_survey_ack_no', display: false }
			];
			let url = `/archivesPages/report/report?serviceName=srvhealth_examination_report_select&type=detail&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`;
			debugger;
			uni.navigateTo({
				url: url
			});
			// if (item.activity_no && item.fill_batch_no) {
			// 	uni.navigateTo({
			// 		url: `/questionnaire/index/index?formType=detail&activity_no=${item.activity_no}&status=完成&fill_batch_no=${item.fill_batch_no}`
			// 	});
			// }
		},
		async selectInspectionReport() {
			// 查询检查报告
			let url = this.getServiceUrl('health', 'srvhealth_examination_report_select', 'select');
			let req = {
				serviceName: 'srvhealth_examination_report_select',
				colNames: ['*'],
				page: { rownumber: 10, pageNo: 1 },
				condition: [{ colName: 'examinate_account', ruleType: 'eq', value: this.userInfo.userno }, { colName: 'examinate_person_no', ruleType: 'eq', value: this.userInfo.no }]
			};
			let res = await this.$http.post(url, req);
			if (this.requestSuccess(res)) {
				let list = res.data.data;
				this.isLoad = true;
				if (Array.isArray(res.data.data)) {
					this.inspectReportRecord  = res.data.data
					// let no = list.map(item => item.report_daq_survey_activity_no).toString();
					// let result = await this.getQuestRecord(no);
					// if (result) {
					// 	this.inspectReportRecord = list.map(record => {
					// 		result.forEach(item => {
					// 			if (record.report_daq_survey_activity_no === item.activity_no) {
					// 				record.activity_no = item.activity_no;
					// 				record.fill_batch_no = item.fill_batch_no;
					// 				record.end_time = item.end_time;
					// 			} else {
					// 				record.end_time = record.create_time;
					// 			}
					// 		});
					// 		return record;
					// 	});
					// }
				}
			} else {
				this.isLoad = true;
			}
		},
		async getQuestRecord(no) {
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [
					{ colName: 'activity_no', ruleType: 'in', value: no },
					{ colName: 'state', ruleType: 'eq', value: '完成' },
					{ colName: 'user_no', ruleType: 'eq', value: this.userInfo.userno }
				]
			};
			let res = await this.$http.post(url, req);
			if (this.requestSuccess(res)) {
				let list = res.data.data;
				if (res.data.data.length > 0) {
					return res.data.data;
				}
			}
		},
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
						if (ele.EAR < ele.value && ele.value < ele.EAR * 2) {
						} else if (ele.EAR > ele.value) {
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
				} else if (item.diastolic_pressure >= 90) {
				}
				if (item.systolic_pressure < 120) {
					result += 2.5;
				} else if (item.systolic_pressure >= 120 && item.systolic_pressure < 140) {
					result += 1;
				} else if (item.systolic_pressure >= 140) {
				}
			}
			return result;
		},
		async getSleepRecord(type = 'sleep') {
			let serviceObj = {
				weight: 'srvhealth_body_fat_measurement_record_select', // 体重体脂
				bloodPressure: 'srvhealth_blood_pressure_record_select', // 血压
				sleep: 'srvhealth_sleep_record_select' // 血压
			};
			let serviceName = serviceObj[type];
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc' // asc升序  desc降序
					}
				],
				page: {
					pageNo: 1,
					rownumber: 2
				}
			};
			if (type === 'sleep') {
				req.condition = [
					{ colName: 'user_info_no', ruleType: 'like', value: this.userInfo.no },
					{ colName: 'getup_time', ruleType: 'like', value: this.formateDate(new Date(), 'date').trim() }
				];
			} else if (type === 'bloodPressure') {
				req.condition = [{ colName: 'create_user', ruleType: 'like', value: this.userInfo.userno }, { colName: 'name', ruleType: 'like', value: this.userInfo.name }];
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		async getSportRecord() {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: this.formateDate(new Date(), 'date').trim()
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
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: this.formateDate(new Date(), 'date').trim()
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
								ele.EAR = ene.val_rni ? ene.val_rni * self.userInfo.weight : ene.val_ear ? ene.val_ear * self.userInfo.weight : ele.EAR * self.userInfo.weight;
								ele.UL = 0;
							}
						} else {
							if (ele.name === '脂肪') {
								ele.EAR = Number((self.userInfo.weight * 50 * 0.2) / 9).toFixed(2);
								ele.UL = 0;
							}
							if (ele.name === '碳水') {
								ele.EAR = self.userInfo.weight * 4;
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
						if (food.food_no === diet.diet_contents_no || food.meal_no === diet.mixed_food_no) {
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
				order: [
					{
						colName: 'nutrient',
						orderType: 'desc' // asc升序  desc降序
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.userInfo.sex) !== -1) || !item.sex) {
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
									mat.EAR = item.val_rni ? item.val_rni * self.userInfo.weight : item.val_ear ? item.val_ear * self.userInfo.weight : mat.EAR * self.userInfo.weight;
									mat.UL = 0;
								}
							} else {
								if (mat.name === '脂肪') {
									mat.EAR = Number((self.userInfo.weight * 50 * 0.2) / 9).toFixed(2);
									mat.UL = 0;
								}
								if (mat.name === '碳水') {
									mat.EAR = self.userInfo.weight * 4;
									mat.UL = 0;
								}
							}
						});
					});
				});
				return result;
			}
		},
		async getCheckboxList() {
			let url = this.getServiceUrl('health', 'srvsys_service_columnex_v2_select', 'select');
			let req = {
				serviceName: 'srvsys_service_columnex_v2_select',
				colNames: ['*'],
				condition: [{ colName: 'service_name', value: 'srvhealth_person_info_select', ruleType: 'eq' }, { colName: 'use_type', value: 'list', ruleType: 'eq' }],
				order: [{ colName: 'seq', orderType: 'asc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.resultCode === 'SUCCESS' && Array.isArray(res.data.data.srv_cols)) {
				let { srv_cols } = res.data.data;
				let requirement = null;
				if (Array.isArray(srv_cols) && srv_cols.length > 0) {
					srv_cols.forEach(item => {
						if (item.columns === 'requirement') {
							this.checkboxList = item.option_list_v2.map(item => {
								item['checked'] = false;
								return item;
							});
						}
					});
				}
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
		addSymptom() {
			// 跳转到症状选择页面
			let term = {
				serviceName: 'srvhealth_self_symptoms_select',
				srvApp: 'health',
				key: 'name',
				type: 'symptom'
			};
			uni.navigateTo({
				url: '/otherPages/symptomSelect/symptomSelect?term=' + encodeURIComponent(JSON.stringify(term))
			});
		},
		changeSelectedTag() {
			this.selectedTags = this.checkboxList.filter(item => item.checked);
			if (this.selectedTags.length > 5) return;
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);

			this.updataUserTags().then(res => {
				this.showUserHealtManagePopup = false;
			});
		},
		async updataUserTags() {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let requirement = this.selectedTags.map(item => item.value);
			if (Array.isArray(requirement) && requirement.length > 0) {
				let req = [
					{
						serviceName: 'srvhealth_person_info_update',
						condition: [{ colName: 'no', ruleType: 'eq', value: this.userInfo.no }],
						data: [{ requirement: requirement.toString() }]
					}
				];
				if (this.userInfo.no) {
					let res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS') {
						return res.data;
					}
				}
			}
		},
		cancelSelectTag() {
			if (Array.isArray(this.selectedTags) && this.selectedTags.length === 0) {
				this.checkboxList = this.checkboxList.map(item => {
					item.checked = false;
					return item;
				});
			} else if (Array.isArray(this.selectedTags) && this.selectedTags.length > 0) {
				this.checkboxList = this.checkboxList.map(item => {
					item.checked = false;
					this.selectedTags.forEach(sel => {
						if (item.label === sel.label) {
							item.checked = true;
						}
					});
					return item;
				});
			}
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
			this.showUserHealtManagePopup = false;
		},
		checkboxchange(e) {
			console.log(e);
		},
		checkboxGroupChange(e) {
			console.log(e);
			let items = this.checkboxList;
			// let	values = e.detail.value;
			let values = e;
			// items[e.index].checked = e.value
			// this.$set(this.checkboxList,e.index,items[e.index])
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (item.label === e.name) {
					this.$set(item, 'checked', e.value);
				}
				if (values.includes(item.label)) {
					this.$set(item, 'checked', true);
				} else {
					this.$set(item, 'checked', false);
				}
			}
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
		},
		navPages(type = 'history') {
			if (type === 'history') {
				uni.navigateTo({
					url: '/archivesPages/archives-history/archives-history?isAll=true'
				});
			} else if (type === 'plan') {
				debugger;
				let fieldsCond = [{ column: 'create_manager_no', display: false }, { column: 'owner_person_no', display: false, value: this.userInfo.no }];
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
		toCouple() {
			uni.navigateTo({
				url: '/questionnaire/couple/couple'
			});
		},

		// 查找当前帐号建立的用户列表
		async selectUserList() {
			const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'create_user', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				// 有数据
				if (uni.getStorageSync('current_user')) {
					res.data.data.forEach(item => {
						if (item.name === uni.getStorageSync('current_user')) {
							uni.setStorageSync('current_user', item.name);
							console.log(this.checkboxList);
							this.userInfo = item;
							console.log(this.wxUserInfo);
							if (!item.profile_url) {
								if (this.wxUserInfo.headimgurl) {
									this.updateUserInfo();
									// this.userInfo.profile_url = this.wxUserInfo.headimgurl;
								}
							}
							this.$store.commit('SET_USERINFO', item);
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
					uni.setStorageSync('current_user', res.data.data[0].name);
					this.userInfo = res.data.data[0];
					if (!item.profile_url) {
						if (this.wxUserInfo.headimgurl) {
							this.updateUserInfo();
							// this.userInfo.profile_url = this.wxUserInfo.headimgurl;
						}
					}
					this.$store.commit('SET_USERINFO', res.data.data[0]);
				}
				this.$store.commit('SET_USERLIST', res.data.data);
				if (this.userInfo && this.userInfo.requirement) {
					let tags = this.userInfo.requirement.split(',');
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
					await this.wxLogin({ code: result.code });
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
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: false });
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
					await this.wxLogin({ code: result.code });
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
				await this.getCheckboxList();
				await this.selectUserList();
				this.dietScore = await this.calcDietScore();
				this.sportScore = await this.calcSportScore();
				this.sleepScore = await this.calcSleepScore();
				this.BPScore = await this.calcBPScore();
				this.selectInspectionReport();
				this.getToDoList();
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
					console.log(self.userInfo);
					if (self.userInfo && self.userInfo.no && !self.userInfo.profile_url) {
						self.updateUserProfile(rawData.headimgurl, self.userInfo.no).then(_ => {
							self.userInfo.profile_url = self.wxUserInfo.headimgurl;
						});
					}
				}
			});
			this.isAuthUserInfo = true;
			this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
		},
		toAddPages() {
			let fieldsCond = [
				{ column: 'profile_url', display: false },
				{
					column: 'userno',
					display: false
					// value: uni.getStorageSync('login_user_info').user_no,
					// condition: [{ colName: 'user_no', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }]
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
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_person_info_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond))
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
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
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

	onTabItemTap(e) {
		this.initPage();
	},
	onPullDownRefresh() {
		this.initPage().then(_ => {
			uni.stopPullDownRefresh();
		});
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
		if (this.is_login && this.authSetting['userInfo']) {
			this.initPage();
		}
		uni.$on('healthTotalScoreChanged', result => {
			if (result) {
				if (parseInt(result !== parseFloat(result))) {
					// 有小数
					let arr = result.toString().split('.');
				}
				this.healthTotalScore = result;
			}
		});
		uni.$on('data-update', () => {
			if (this.is_login) {
				this.initPage();
			}
		});
		let score = uni.getStorageSync('healthTotalScore');
		if (score) {
			this.healthTotalScore = score;
		}
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
							} @else if $i%2==0 {
								color: #67c23a;
								background: #f0f9eb;
								border-color: #c2e7b0;
							} @else if $i%3==0 {
								color: #909399;
								background: #f4f4f5;
								border-color: #d3d4d6;
							} @else if $i%4==0 {
								color: #e6a23c;
								background: #fdf6ec;
								border-color: #f5dab1;
							} @else if $i%5==0 {
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
	.health-overall-score {
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			overflow: hidden;
			// flex-direction: column;
			flex: 1;
			.uni-ec-charts {
				width: 400rpx;
				height: 400rpx;
			}
			.separator {
				font-size: 100rpx;
				height: 160rpx;
				display: flex;
				align-items: flex-end;
			}
			.score-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				color: #333;
				border-radius: 20rpx;
				width: 300rpx;
				height: 300rpx;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				// border: 1px solid #f1f1f1;
				background-color: #fff;
				box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
				position: relative;
				&:last-child {
					margin-right: 0;
				}
				.label {
					font-size: 30rpx;
					font-weight: 600;
					text-align: center;
					letter-spacing: 2px;
				}
				.value {
					font-size: 150rpx;
					display: flex;
					position: relative;
					.float {
						font-size: 40rpx;
					}
					.tips {
						font-size: 38rpx;
						position: absolute;
						top: 20rpx;
						right: -10rpx;
					}
				}
				.valuetip {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					height: 160rpx;
					width: 160rpx;
				}
				.trend {
					font-size: 30rpx;
					position: absolute;
					bottom: 10%;
					left: 10%;
					display: flex;
					align-items: center;
					.trend-icon {
						width: 32rpx;
						height: 32rpx;
					}
					.text-icon {
						display: inline-block;
						transform: rotate(180deg) scale(1, 1.5);
					}
					.text {
						transform: rotate(0) scale(1);
						font-size: 24rpx;
						color: #999;
					}
				}
			}
		}
	}
	.health-archive-item {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
		border-radius: 20rpx;
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
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.grid-item {
					display: flex;
					// justify-content: center;
					height: 150rpx;
					// border: 1px solid #999;
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
			&.disease-risk {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.disease-item {
					padding: 10rpx 20rpx;
					border: 1px solid #999;
					display: flex;
					flex-direction: column;
					border-radius: 20rpx;
					min-height: 150rpx;
					&.text-red {
						border-color: #e54d42;
					}
					&.text-orange {
						border-color: #f37b1d;
					}
					.disease-name {
						font-size: 32rpx;
						flex: 1;
						// color: #666;
					}
					.number {
						font-size: 26rpx;
						min-width: 100rpx;
						flex: 1;
						text-align: center;
						.digit {
							font-size: 60rpx;
						}
					}
				}
			}
			&.inspection-report {
				// 检查报告
				width: 100%;
				display: flex;
				height: auto;
				justify-content: flex-start;
				flex-wrap: wrap;
				.empty-data {
					width: 100%;
					text-align: center;
					font-weight: normal;
					color: #999;
				}
				.report-item {
					width: calc(25% - 30rpx / 4);
					min-height: 200rpx;
					overflow: hidden;
					margin: 0 10rpx 10rpx 0;
					display: flex;
					flex-direction: column;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					padding-bottom: 20rpx;
					border-radius: 20rpx;
					&:nth-child(4n) {
						margin-right: 0;
					}
					.image {
						width: 100%;
						height: 100rpx;
					}
					.title {
						height: 46rpx;
						text-indent: 10rpx;
						padding: 5rpx 0;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.date {
						font-size: 24rpx;
						color: #999;
						text-indent: 10rpx;
					}
				}
			}
			&.todo-list {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				font-weight: normal;
				.todo-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #e6a23c;
					background: #fdf6ec;
					border-color: #f5dab1;
					box-shadow: 0px 0px 4px #f5dab1, 0 0 6px #fdf6ec;
					padding: 20rpx;
					position: relative;
					overflow: hidden;
					.type {
						text-align: center;
						font-weight: normal;
						width: 100%;
						position: absolute;
						transform: rotate(-45deg) scale(0.8);
						background-color: #fff;
						font-size: 24rpx;
						left: -75rpx;
						padding: 5rpx;
						top: 10rpx;
						letter-spacing: 5rpx;
						background-color: #409eff;
						color: #fff;
					}
					.title {
						padding: 10rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						width: 100%;
					}
					.cycle {
						font-size: 24rpx;
					}
					.todo-item-content {
						font-weight: 700;
						.title {
						}
						&.checked {
							text-decoration: line-through;
							// text-underline: thr;
						}
					}
				}
			}
		}
	}
	.health-advice {
		margin: 20rpx 20rpx 0;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		.content {
			color: #0081ff;
			display: flex;
			flex-direction: column;
			transition: height 0.5s;
			.health-advice-item {
				padding: 20rpx;
				// color: #67c23a;
				// background: #f0f9eb;
				// border-color: #c2e7b0;
				margin-bottom: 10rpx;
				width: 100%;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
}
.health-item {
	// min-height: 150rpx;
	// display: flex;
	padding: 50rpx 30rpx;
	// display: flex;
	// flex-direction: column;
	.tips {
		color: #999;
		padding: 20rpx 0;
	}
	.check-box-group {
		display: flex;
		flex-wrap: wrap;
		.check-box-item {
			margin-right: 20rpx;
			min-width: 30%;
		}
	}
}
.user-list {
	min-height: 300rpx;
	padding: 50rpx 30rpx 30rpx;
	.user-item {
		text-indent: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 34rpx;
		padding: 30rpx 20rpx 10rpx;
		border-bottom: 1rpx solid #f1f1f1;
		transition: all 0.5s;
		.avatar {
			margin-right: 20rpx;
		}
		&:active {
			background-color: #f1f1f1;
		}
	}
}
.button-box {
	width: 100%;
	padding: 30rpx;
	font-weight: bold;
	text-align: center;
	display: flex;
	.cu-btn {
		background-color: #11c5bd;
		color: #fff;
		margin-right: 50rpx;
		flex: 1;
		&:nth-child(2n),
		&:last-child {
			margin-right: 0;
		}
	}
}
.inspect-record {
	width: 100%;
	background-color: #fff;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 80vh;
	.selector-wrap {
		overflow: scroll;
		flex: 1;
	}
	.title {
		width: 100%;
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		padding: 20rpx;
	}
	.button-box {
		// position: absolute;
		// bottom: 20rpx;
		.cu-btn {
			width: 45%;
		}
	}
}
</style>
