<template>
	<view class="menu-list">
		<swiper class="swiper rectangle-dot" indicator-active-color="#00aaff" indicator-color="#ccc"
			:indicator-dots="true" :autoplay="false">
			<swiper-item v-for="(swiperItem,swiperIndex) in mainMenuList" :key="swiperIndex">
				<view class="swiper-item">
					<view class="menu-item" @click="item.eventType==='toPage'?toPages(item.type):toGroup(item.type)"
						v-for="(item,index) in swiperItem" :key="index">
						<view class="cu-tag badge" v-if="item.num">{{item.num||''}}</view>
						<u-icon :name="item.icon" size="60" color="#00aaff"
							v-if="item.iconType==='uicon'&&!item.custonIcon">
						</u-icon>
						<u-icon custom-prefix="custom-icon" :name="item.icon" size="60" color="#00aaff"
							v-else-if="item.iconType==='uicon'&&item.custonIcon">
						</u-icon>
						<image class="icon image" :src="item.icon" mode="aspectFit" v-if="item.iconType==='image'">
							<text :class="item.icon" style="font-size: 30px;color:#00aaff;"
								v-if="item.iconType==='font'"></text>
							<text class="title">{{item.label}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			mainMenuList: {
				type: Array
			},
			bindUserInfo: {
				type: Object
			},
			storeInfo: {
				type: Object
			},
			userInfo:{
				type: Object
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toPages(e, info) {
				let url = '';
				if ((!this.bindUserInfo || !this.bindUserInfo.store_user_no) && e !== 'health-manager') {
					this.addToStore()
					return
				}
				switch (e) {
					case 'manager':
						url = `/personalPages/StoreManager/StoreManager?store_no=${this.storeInfo.store_no}`
						break;
					case 'vaccine-order':
						url = '/storePages/VaccineOrder/VaccineOrder'
						break;
					case 'subscsribe':
						url = '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(
							'https://mp.weixin.qq.com/s/Z9o7ZJOtrAsR2Sj7PIIgRQ');
						break;
					case 'health-manager':
						url = '/pages/pedia/pedia'
						break;
					case 'food':
						url =
							'/otherPages/dietSelect/dietSelect?condType={"type":"food","serviceName":"srvhealth_diet_contents_select","colName":"name","imgCol":"image","wordKey":{"title":"name","unit":"unit","energy":"unit_energy"},"pagetType":"detail"}';
						break;
					case 1: // 就诊登记
						// url = '/storePages/Registration/Registration?storeNo=' + this.storeNo
						let fieldsCond = [{
								"column": "user_info_no",
								"display": false
							}, {
								"column": "name",
								"value": this.userInfo.name
							}, {
								"column": "time",
								"value": this.formateDate('', 'date')
							}, {
								"column": "user_no",
								"display": false,
								value: this.userInfo.userno
							},
							{
								"column": "store_no",
								"display": false,
								"value": this.storeInfo.store_no
							}
						]
						url =
							'/publicPages/newForm/newForm?serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=' +
							JSON.stringify(
								fieldsCond)
						break;
					case 2:
						url =
							'/otherPages/symptomSelect/symptomSelect2?term=%7B"serviceName"%3A"srvhealth_self_symptoms_select","srvApp"%3A"health","key"%3A"name","type"%3A"symptom"%7D';
						break;
					case 3:
						url = '/archivesPages/healthCompose/healthCompose';
						break;
					case 'groupChat':
						if (this.storeInfo.member_session_no) {
							url =
								`/personalPages/chat/chat?type=店铺机构全员&session_no=${this.storeInfo.member_session_no}&storeNo=${this.storeInfo.store_no}`;
						} else {
							// url = '/personalPages/chat/chat?type=店铺机构全员&storeNo=' + this.storeNo
						}
						break;
					case 'personal':
						url = '/pediaPages/personal/personal?type=shop';
						break;
					case 'instroduce':
						url = '/storePages/StoreIntroduce/StoreIntroduce?store_no=' + this.storeInfo.store_no;
						break;
				}
				if (url) {
					uni.navigateTo({
						url: url,
						fail() {
							uni.switchTab({
								url: url
							})
						}
					});
				}
			},
			addToStore() {
				this.$emit('addToStore')
			},
			async selectPersonInGroup(group_no) {
				// 查找当前登录用户有没有在此圈子用户列表中
				let req = {
					condition: []
				};
				if (group_no) {
					req.condition.push({
						colName: 'person_no',
						ruleType: 'eq',
						value: this.userInfo.no
					})
					req.condition.push({
						// {
						colName: 'gc_no',
						ruleType: 'eq',
						value: group_no
						// },
					})
				} else {
					return
				}
				let res = await this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health');
				if (Array.isArray(res.data) && res.data.length > 0) {
					return res.data[0]
				}
			},
			async toGroup(e) {
				if (!this.bindUserInfo || !this.bindUserInfo.store_user_no) {
					// this.bindUserInfo = await this.bindStore()
					this.addToStore()
					return
				}
				let data = await this.selectPersonInGroup(e)
				if (data && data.pg_no && data.gc_no) {
					// 跳到聊天页面  
					uni.navigateTo({
						url: `/personalPages/chat/chat?type=群组圈子&groupNo=${data.gc_no}&pg_no=${data.pg_no}&group_role=${data.group_role||'用户'}`
					});
				} else {
					// 跳到圈子信息页面
					uni.navigateTo({
						url: `/personalPages/gropDetail/gropDetail?gc_no=${e}&pb_no=${this.userInfo.no}&type=group-detail&from=store-detail`
					});
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.menu-list {

		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		margin-bottom: 20rpx;

		.swiper {
			width: 100%;
			height: 130px;
		}

		.swiper-item {
			width: 100%;
			display: flex;
			padding: 20rpx 20rpx 0;
		}

		.menu-item {
			width: calc(25% - 15px/4);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #f3f3f3;
			border-radius: 5px;
			margin-left: 5px;
			padding: 30rpx 20rpx;
			margin-bottom: 10px;
			position: relative;

			&:nth-child(4n+1) {
				margin-left: 0;
			}

			.icon {
				width: 30px;
				height: 30px;
				font-size: 30px;
				text-align: center;
				line-height: 100rpx;
			}

			.title,
			.label {
				// display: flex;
				// align-items: flex-end;
				text-align: center;
				min-height: 70rpx;
				margin-top: 10rpx;
				font-size: 14px;
			}
		}
	}
</style>
