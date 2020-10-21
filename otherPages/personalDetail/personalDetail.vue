<template>
	<view class="detail-wrap">
		<view v-if="type && type === 'person'" class="detail-list">
			<view class="cu-list menu sm-border" v-if="currentUser">
				<view class="cu-item">
					<view class="content">
						<text class="text-black">姓名</text>
						<text
							class="value"
							@click="
								showModel = true;
								currentModel = 'name';
							"
						>
							{{ currentUser.name }}
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">性别</text>
						<text
							class="value"
							@click="
								showSexModal = true;
								currentModel = 'sex';
							"
						>
							{{ currentUser.sex }}
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">生日</text>
						<text
							class="value"
							@click="
								showCalender = true;
								currentModel = 'birthday';
							"
						>
							{{ currentUser.birthday }}
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">身高</text>
						<text
							class="value"
							@click="
								showModel = true;
								currentModel = 'height';
							"
						>
							{{ currentUser.height }}cm
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">体重</text>
						<text
							class="value"
							@click="
								showModel = true;
								currentModel = 'weight';
							"
						>
							{{ currentUser.weight }}kg
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">职业</text>
						<text
							class="value"
							@click="
								showModel = true;
								currentModel = 'job';
							"
						>
							{{ currentUser.job }}
							<text class="cuIcon-right"></text>
						</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="type && type === 'corp'" class="detail-list">
			<view class="cu-list menu sm-border">
				<view class="cu-item">
					<view class="content">
						<text class="text-black">运动步数</text>
						<text class="value">10000步</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">睡眠时长</text>
						<text class="value">7h</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">体重</text>
						<text class="value">70kg</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">血压</text>
						<text class="value">11</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">血脂</text>
						<text class="value">11</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">血糖</text>
						<text class="value">11</text>
					</view>
				</view>
			</view>
		</view>
		<u-calendar v-model="showCalender" :mode="'date'" @change="changeBirthday"></u-calendar>
		<u-select v-model="showSexModal" :list="sexList" @confirm="changeSex"></u-select>
		<u-modal v-model="showModel" :mask-close-able="true" :show-title="false" :show-cancel-button="true" @confirm="changeInput">
			<view class="slot-content">
				<u-input v-model="modifyUserInfo.name" :type="modelInputType" :border="false" :placeholder="modelInputHint" v-if="currentModel === 'name'" />
				<u-input v-model="modifyUserInfo.height" :type="modelInputType" :border="false" placeholder="请输入身高(cm)" v-if="currentModel === 'height'" />
				<u-input v-model="modifyUserInfo.weight" :type="modelInputType" :border="false" placeholder="请输入体重(kg)" v-if="currentModel === 'weight'" />
				<u-input v-model="modifyUserInfo.job" :type="modelInputType" :border="false" placeholder="请输入您的职业" v-if="currentModel === 'job'" />
			</view>
		</u-modal>
	</view>
</template>

<script>
export default {
	name: 'personalDetail',
	data() {
		return {
			type: '',
			userInfo: null,
			currentUser: null,
			modifyUserInfo: {
				name: '',
				sex: '',
				birthday: '',
				weight: '',
				height: '',
				job: ''
			},
			showCalender: false, //日历
			showSexModal: false,
			sexList: [
				{
					value: '男',
					label: '男'
				},
				{
					value: '女',
					label: '女'
				}
			],
			showModel: false,
			currentModel: 'name',
			modelInputType: 'text',
			modelInputHint: '请输入姓名'
		};
	},
	methods: {
		changeInput(e) {
			console.log(this.modifyUserInfo);
			this.submitData();
		},
		changeSex(e) {
			if (Array.isArray(e) && e.length > 0) {
				console.log(e[0]);
				let result = e[0].value;
				this.modifyUserInfo.sex = result;
				this.submitData();
			}
		},
		changeBirthday(e) {
			console.log(e);
			if (e.result) {
				this.modifyUserInfo.birthday = e.result;
				this.submitData();
			}
		},
		submitData() {
			const type = this.currentModel;
			const data = this.deepClone(this.modifyUserInfo);
			const serviceName = 'srvhealth_person_info_update';
			let req = [
				{
					serviceName: serviceName,
					condition: [{ colName: 'userno', ruleType: 'eq', value: this.currentUser.userno }, { colName: 'name', ruleType: 'eq', value: this.currentUser.name }],
					data: [{}]
				}
			];
			const url = this.getServiceUrl('health', serviceName, 'operate');
			req[0]['data'][0][type] = data[type];
			let reqData = req[0];
			if (!reqData.condition || reqData.condition.length === 0 || !reqData.condition[0].value) {
				return;
			}
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.getuserInfoList();
					uni.showToast({
						title: '修改成功'
					});
				}
			});
		},
		async getuserInfoList() {
			const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let user = uni.getStorageSync('login_user_info').user_no;
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'create_user', ruleType: 'eq', value: user }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.setStorageSync('user_info_list', res.data.data);
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					uni.setStorageSync('current_user', res.data.data[0].name);
				}
				this.initData();
			}
		},
		initData() {
			let userInfo = uni.getStorageSync('wxUserInfo');
			this.userInfo = userInfo;
			let userList = uni.getStorageSync('user_info_list');
			let current_user = uni.getStorageSync('current_user');
			if (userList && current_user) {
				let currentUser = userList.filter(item => {
					return item.name === current_user;
				});
				if (Array.isArray(currentUser) && currentUser.length > 0){
					this.currentUser = currentUser[0]
				} ;
				this.modifyUserInfo = this.deepClone(this.currentUser);
			}
		}
	},
	created() {
		this.getuserInfoList();
	},
	onLoad(option) {
		let type = option.type;
		this.type = type;
		console.log('type====', type);
	}
};
</script>

<style lang="scss" scoped>
.detail-wrap {
	width: 100%;
	height: 100vh;
	background-color: white;
	.detail-list {
		/deep/ .content {
			display: flex;
			justify-content: space-between;
			.cuIcon-right {
				mrgint-left: 5rpx;
			}
			.value {
				color: #666;
			}
		}
	}
	/deep/ .u-calendar__action {
		display: flex;
		justify-content: center;
	}
	.slot-content {
		padding: 20rpx 50rpx 10rpx;
		/deep/.uni-input-input {
			text-align: center;
		}
	}
}
</style>
