<template>
	<view class="menu-list">
		<swiper class="swiper"
			:class="{'rectangle-dot':pageItem.button_style!=='grid','grid-style':pageItem.button_style==='grid'}"
			:style="{height:swiperHeight+'px'}" indicator-active-color="#00aaff" indicator-color="#ccc"
			:indicator-dots="true" :autoplay="false">
			<swiper-item v-for="(swiperItem,swiperIndex) in menuList" :key="swiperIndex">
				<view class="swiper-item">
					<view class="menu-item" :class="{'grid-style':pageItem.button_style==='grid'}"
						@click="item.eventType==='toPage'?toPages(item):toGroup(item.type)"
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
			userInfo: {
				type: Object
			},
			pageItem: {
				type: Object
			},
		},
		data() {
			return {
				groupList: [],
				buttons: []
			}
		},
		computed: {
			showPublic() {
				return this.pageItem && this.pageItem.show_public_button === '是'
			},
			storeNo() {
				return this.storeInfo && this.storeInfo.store_no ? this.storeInfo.store_no : null
			},
			swiperHeight() {
				if (this.pageItem) {
					let num = this.pageItem.row_number || 1
					if (this.pageItem.button_style === 'grid') {
						return num * 85 + 20
					} else {
						return num * 110 + 20
					}
				}
			},
			menuList() {
				let list = []
				if (this.pageItem.show_subscribe && this.showPublic) {
					// 检测是否关注公众号
					if (!this.$store.state?.app?.subscsribeStatus) {
						list.push({
							icon: 'cuIcon-notice text-orange',
							iconType: 'font',
							label: '通知设置',
							eventType: 'toPage',
							type: 'subscsribe',
							num: '请设置'
						})
					}
				}
				if (this.storeInfo && this.storeInfo.member_session_no && this.showPublic) {
					list.push({
						icon: 'cuIcon-comment',
						iconType: 'font',
						label: this.storeInfo.member_session_name || '公开咨询',
						eventType: 'toPage',
						type: 'groupChat',
						num: this.bindUserInfo.store_session_user_unread_msg || 0,
					})
				}
				if (Array.isArray(this.groupList)) {
					let groupList = this.groupList.map(item => {
						return {
							icon: this.getImagePath(item.icon, true),
							iconType: 'image',
							label: item.name,
							eventType: 'toGroup',
							type: item.gc_no,
							num: item.unreadNum || 0,
						}
					})
					list = [...list, ...groupList]
				}
				if (this.bindUserInfo && this.showPublic && this.bindUserInfo.user_role && (this.bindUserInfo.user_role
						.indexOf('工作人员') !== -
						1 || this.bindUserInfo.user_role.indexOf('管理员') !== -1)) {
					list.push({
						icon: 'cuIcon-shop',
						iconType: 'font',
						label: '管理入口',
						eventType: 'toPage',
						num: this.storeInfo && this.storeInfo.kefu_unread_msg ? this.storeInfo.kefu_unread_msg : 0,
						type: 'manager'
					})
				}
				if (Array.isArray(this.buttons) && this.buttons.length > 0) {
					this.buttons.forEach(btn => {
						list.push({
							navType: btn.navigate_type,
							icon: this.getImagePath(btn.icon, true),
							iconType: 'image',
							label: btn.button_label,
							eventType: 'toPage',
							num: 0,
							type: 'navPage',
							url: btn.dest_page
						})
					})
				}
				let rownumber = this.pageItem.row_number || 1
				if (Array.isArray(list)) {
					return list.reduce((pre, item) => {
						if (pre.length === 0) {
							pre = [
								[item]
							]
						} else if (pre[pre.length - 1].length >= rownumber * 4) {
							pre.push([item])
						} else {
							pre[pre.length - 1].push(item)
						}
						return pre
					}, [])
				}
			}
		},
		methods: {
			getButtons() {
				if (this.pageItem && this.showPublic && this.pageItem.show_related_group === '是' && this.pageItem.type ===
					"按钮组") {
					// 查找关联群组
					this.seletGroupList()
				}else{
					this.groupList = []
				}
				let req = {
					"serviceName": "srvhealth_page_item_buttons_select",
					"colNames": ["*"],
					"condition": [{
							"colName": "item_no",
							"ruleType": "eq",
							"value": this.pageItem.component_no
						},
						// {
						// 	"colName": "display",
						// 	"ruleType": "ne",
						// 	"value": '隐藏'
						// }, {
						// 	"colName": "display",
						// 	"ruleType": "ne",
						// 	"value": '否'
						// },
					],
					"page": {
						"pageNo": 1,
						"rownumber": 99
					},
				}
				this.$fetch('select', 'srvhealth_page_item_buttons_select', req, 'health').then(res => {
					if (res.success) {
						this.buttons = res.data
					}
				})
			},
			async getGroupList() {
				// 查找店铺关联群组
				let req = {
					condition: [{
							"colName": "circle_visible",
							"ruleType": "ne",
							"value": '不开放',
						},
						{
							colName: 'store_no',
							ruleType: 'eq',
							value: this.storeNo
						}
					]
				};
				let res = await this.$fetch('select', 'srvhealth_group_circle_select', req, 'health')
				if (res.success) {
					return res.data
				}
			},
			async seletGroupList() {
				// 查找店铺关联群组 - 群成员信息
				if (!this.storeNo) {
					return
				}
				let groupList = await this.getGroupList()
				if (Array.isArray(groupList) && groupList.length > 0) {
					let groupNoList = groupList.map(item => item.gc_no)
					let req = {
						"condition": [{
								"colName": "gc_no",
								"ruleType": "in",
								"value": groupNoList.toString(),
							},
							{
								"colName": "person_no",
								"value": this.userInfo.no,
								"ruleType": "eq"
							}
						]
					}
					let res = await this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health')
					if (res.success) {
						groupList.forEach(item => {
							let userInfo = res.data.find(data => data.gc_no === item.gc_no)
							if (userInfo) {
								item.userInfo = userInfo
								item.latest_sign_in_time = userInfo.latest_sign_in_time
								item.unreadNum = userInfo.user_unread_msg
							}
						})
					}
					this.groupList = groupList
					return groupList
				}
			},
			toPages(e) {
				let url = '';
				if ((!this.bindUserInfo || !this.bindUserInfo.store_user_no) && e !== 'health-manager') {
					this.addToStore()
					return
				}
				switch (e.type) {
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
					case 'navPage':
						if (e && e.url) {
							url = e.url
						}
						break;
				}

				if (url) {
					let navType = 'navigateTo'
					if (e.navType) {
						navType = e.navType
					}

					uni[navType]({
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

			&.grid-style {
				::v-deep.uni-swiper-dot {
					transition: all 0.5s;
				}

				::v-deep.uni-swiper-dot-active {
					width: 35rpx;
					border-radius: 10rpx;
					height: 15rpx;
				}
			}
		}

		.swiper-item {
			width: 100%;
			display: flex;
			padding: 20rpx 20rpx 0;
			flex-wrap: wrap;
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

			&.grid-style {
				background-color: #fff;
				padding: 0;
				padding-top: 20rpx;
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
