<template>
	<view class="page-wrap">
		<view class="head">
			<image :src="getImagePath(storeInfo.image)" class="logo" mode="aspectFill" @click="toStoreDetail"></image>
			<view class="store-name" @click="toStoreDetail">
				<view class="name">{{ storeInfo.name }}</view>
				<view class="address" v-if="storeInfo.address" @click="openLocation">
					{{ storeInfo.address }}
					<text class="location cuIcon-locationfill text-blue margin-left-xs"></text>
				</view>
			</view>
			<view class="phone" @click="makePhoneCall" v-if="storeInfo.telephone">
				<image src="../../static/icon/makePhone.png" mode=""></image>
			</view>
		</view>
		<view class="manager-view">
			<text class="text-grey title">管理</text>
			<view class="manager-box">
				<view class="box-item" v-for="item in list" @click="clickGrid(item)">
					<view class="box-item-content">
						<text class="cu-tag badge" v-if="item.num">{{item.num}}</text>
						<view class="cu-tag amount text-blue" v-if="storeInfo[item.type]">
							{{ storeInfo[item.type] | overDisplay }}
						</view>
						<image src="../static/links.png" class="icon" mode="" v-if="!item.icon"></image>
						<text class="icon" v-else
							:class="['cuIcon-' + item.icon, item.color ? 'text-' + item.color : '']"></text>
						<view class="label">{{ item.label }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{show:modalName ==='selectColumn'}" @click="hideModal">
			<view class="cu-dialog" @click.stop="">
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>
						<text>请选择</text>
					</view>
					<view class="action">
						<button class="cu-btn bg-green shadow" @tap="showModal"
							data-target="DialogModal1">Dialog</button>
						<button class="cu-btn bg-blue shadow margin-left" @tap="showModal"
							data-target="DialogModal2">Dialog</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeInfo: {},
				modalName: '',
				storeNo: '',
				gridList: [{
						label: '店铺商品',
						icon: 'goods',
						color: 'orange',
						type: 'goods_count'
					},
					{
						label: '店铺订单',
						icon: 'punch',
						color: 'yellow',
						type: 'order_count'
					},
					{
						label: '就诊列表',
						icon: 'peoplelist',
						color: 'cyan',
						type: 'see_doctor_count'
					},
					{
						label: '方案列表',
						icon: 'calendar',
						color: 'blue',
						type: 'paln_count'
					},
					{
						label: '排班列表',
						icon: 'sort',
						color: 'cyan',
						type: 'schedule_count'
					},
					{
						label: '用户列表',
						icon: 'addressbook',
						color: 'green',
						type: 'user_count'
					},
					{
						label: '员工列表',
						icon: 'addressbook',
						color: 'yellow',
						type: 'staff_count'
					},
					{
						label: '用户咨询记录',
						icon: 'message',
						color: 'red',
						type: 'message',
						num: 0
					},
					{
						label: '疫苗库存',
						icon: 'list',
						color: 'green',
						type: 'vaccine_stocks'
					},
					{
						label: '可预约列表',
						icon: 'list',
						color: 'blue',
						type: 'vaccination_appointment'
					},
					// {
					// 	label: '公告管理',
					// 	icon: 'read',
					// 	color: 'orange',
					// 	type: 'notice'
					// },
					// {
					// 	label: '业务管理',
					// 	icon: 'read',
					// 	color: 'blue',
					// 	type: 'business'
					// },
					{
						label: '操作手册',
						icon: 'creative',
						color: 'yellow',
						type: 'manual'
					},
					{
						label: '店铺设置',
						icon: 'settings',
						color: 'blue',
						type: 'setting'
					}
				],
				sessionList: [],
				unreadNum: 0,
				websiteDetail: {}, //店铺关联站点信息
				websiteColumn: [], //站点栏目
			};
		},
		filters: {
			overDisplay: function(value) {
				return value;
				// return value < 999 ? value : '99+';
			}
		},
		computed: {
			list() {
				return this.gridList.map(item => {
					if (item.type === 'message') {
						item.num = this.unreadNum
					}
					return item
				})
			}
		},
		methods: {
			getWebsiteColumn(no) {
				let req = {
					"serviceName": "srvdaq_cms_category_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "website_no",
						"ruleType": "eq",
						"value": no
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 2
					},
				}
				this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(res => {
					if (res.success && res.data.length > 0) {
						this.websiteColumn = res.data
					}
				})
			},
			goNoticeList(item) {
				let viewTemp = {
					tip: 'content_status',
					footer: 'content',
					title: 'title',
					img: 'icon_image'
				};
				let cond = [{
					colName: "no",
					ruleType: "like",
					value: item.no
				}]
				let url =
					`/publicPages/list/list?pageType=list&appName=daq&serviceName=srvdaq_cms_content_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
				uni.navigateTo({
					url: url
				})
			},
			toStoreDetail() {
				uni.navigateBack()
			},
			getStoreArticleColumns() {
				// 查找此店铺关联的文章栏目
				let req = {
					condition: [{
							colName: 'website_no',
							ruleType: 'eq',
							value: this.storeInfo.website_no
						},
						{
							colName: 'is_leaf',
							ruleType: 'eq',
							value: '是'
						}
					]
				};
				this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(cate => {
					if (cate.success && cate.data.length > 0) {
						let types = cate.data.reduce((pre, cur) => {
							let obj = {
								name: cur.cate_name,
								no: cur.no,
								icon: 'read',
								color: 'blue',
								type: 'article-list'
							}
							pre.push(obj)
							return pre
						}, [])
						if (types.length > 0) {
							types.forEach(type => {
								type.label = type.name + '管理'
								if (!this.gridList.find(item => item.no && item.no === type.no)) {
									this.gridList.push(type)
								}
							})
						}
					}
				});
			},
			getStoreSession() {
				// 查找此店铺的客服会话列表
				let req = {
					"condition": [{
						"colName": "session_type",
						"ruleType": "in",
						"value": "机构用户客服"
					}, {
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
					colNames: ["store_person_no", "session_no", "kefu_kefu_unread_msg"],
					group: [{
						"colName": "kefu_kefu_unread_msg",
						"type": "sum", // 总条数
						'aliasName': 'unread'
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 20
					}
				}
				this.$fetch('select', 'srvhealth_dialogue_session_select', req, 'health').then(res => {
					if (res.success && Array.isArray(res.data) && res.data.length > 0) {
						this.unreadNum = res.data[0].unread
					}
				})
			},
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.storeInfo.telephone //仅为示例
				});
			},
			openLocation() {
				if (this.storeInfo.latitude && this.storeInfo.longitude) {
					uni.openLocation({
						latitude: Number(this.storeInfo.latitude),
						longitude: Number(this.storeInfo.longitude),
						name: this.storeInfo.name,
						address: this.storeInfo.address
					});
				}
			},
			clickGrid(item) {
				let url = '';
				let cond = [{
					colName: 'store_no',
					ruleType: 'eq',
					value: this.storeNo
				}];
				let {
					type
				} = item
				let labels = []
				let viewTemp = {};
				switch (type) {
					case 'setting':
						this.toDetail(this.storeInfo);
						break;
					case 'manual':
						// 操作手册
						url = `/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=CT2021041518560002`
						break;
					case 'message':
						url = '/otherPages/MessageCenter/MessageCenter?storeNo=' + this.storeNo
						break;
					case 'goods_count':
						viewTemp = {
							title: 'goods_name',
							tip: 'goods_desc',
							img: 'goods_img',
							price: 'price',
							footer: 'store_name'
						};
						url =
							`/publicPages/list/list?pageType=list&serviceName=srvhealth_store_goods_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'order_count':
						viewTemp = {
							title: 'order_no',
							tip: 'create_time',
							img: 'image',
							price: 'order_amount',
							footer: 'rcv_addr_str'
						};
						url =
							`/publicPages/list/list?pageType=list&serviceName=srvhealth_store_order_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'see_doctor_count':
						viewTemp = {
							title: 'name'
						};
						url =
							`/publicPages/list/list?pageType=list&serviceName=srvhealth_see_doctor_record_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'paln_count':
						viewTemp = {
							title: 'ds_name'
						};
						url =
							`/publicPages/list/list?pageType=list&serviceName=srvhealth_plan_schedule_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'schedule_count':
						viewTemp = {
							title: 'person_name'
						};
						url =
							`/publicPages/list/list?pageType=list&serviceName=srvhealth_store_on_duty_scheduling_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'user_count':
						viewTemp = {
							title: 'store_remark_person_name||person_name',
							img: 'profile_url'
						};
						let order = [
							// 	{
							// 	colName: "store_remark_person_name",
							// 	orderType: "desc"
							// },{
							// 	colName: "user_role",
							// 	orderType: "desc"
							// }
						]
						url =
							`/publicPages/list/list?pageType=list&hideFootBtn=true&serviceName=srvhealth_store_user_select&order=${JSON.stringify(order)}&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'staff_count':
						viewTemp = {
							title: 'store_remark_person_name||person_name',
							tip: 'sex',
							img: 'profile_url',
							price: 'store_session_user_unread_msg',
							footer: 'kefu_session_kefu_unread_msg'
							// footer: [' ','user_role']
						};
						cond.push({
							colName: "user_role",
							ruleType: "inset",
							value: "工作人员,大夫,药房人员,客服,管理员"
						})
						labels = ['store_session_user_unread_msg', 'kefu_session_kefu_unread_msg', 'user_role', 'sex'],
							url =
							`/publicPages/list/list?pageType=list&hideFootBtn=true&customTemp=true&label=${JSON.stringify(labels)}&serviceName=srvhealth_store_user_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
						break;
					case 'vaccination_appointment':
						// 预约列表
						viewTemp = {
							title: 'appoint_name',
							tip: ['预约日期：', 'app_date', ' ', 'app_time_start', '-', 'app_time_end'],
							// img: 'profile_url',
							price: 'app_count',
							footer: 'app_desc'
						};
						labels = ['app_count', 'app_desc'],
							url =
							`/publicPages/list/list?pageType=list&label=${JSON.stringify(labels)}&serviceName=srvhealth_store_vaccination_appointment_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`
						break;
					case 'notice':
						// 通知公告管理
						// this.modalName = 'selectColumn'
						if (this.storeNo === 'S20210227032') {
							this.goNoticeList()
						}
						break;
					case 'article-list':
						// 通知公告管理
						// this.modalName = 'selectColumn'
						// if (this.storeNo === 'S20210227032') {
						this.goNoticeList(item)
						// }
						break;
					case 'vaccine_stocks':
						// 疫苗库存
						viewTemp = {
							title: 'vaccine_drug_name',
							tip: 'usage',
							// img: 'profile_url',
							price: 'stock_count',
							footer: 'remark'
						};
						labels = ['stock_count', 'remark']
						url =
							`/publicPages/list/list?pageType=list&label=${JSON.stringify(labels)}&serviceName=srvhealth_store_vaccine_stocks_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`
						break;


				}

				if (url) {
					uni.navigateTo({
						url: url
					});
				}
			},
			hideModal() {
				this.modalName = ''
			},
			toDetail(e) {
				let fieldsCond = [{
						column: 'store_no',
						display: false,
						value: e.store_no
					},
					{
						column: 'sale_num',
						display: false
					},
					{
						column: 'grade',
						display: false
					},
					{
						column: 'audit_status',
						display: false,
						value: e.audit_status
					},
					{
						column: 'create_time',
						display: false
					},
					{
						column: 'create_user_disp',
						display: false
					},
					{
						column: 'order_count',
						display: false
					},
					{
						column: 'goods_count',
						display: false
					},
					{
						column: 'person_order_count',
						display: false
					},
					{
						column: 'see_doctor_count',
						display: false
					},
					{
						column: 'user_count',
						display: false
					},
					{
						column: 'website_no',
						display: false,
						value: e.website_no
					}
				];
				uni.navigateTo({
					url: '/publicPages/newForm/newForm?serviceName=srvhealth_store_mgmt_select&type=detail&fieldsCond=' +
						JSON.stringify(
							fieldsCond)
				});
			},
			async getStoreInfo() {
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'in',
						value: this.storeNo
					}]
				};
				let storeInfo = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health');
				if (storeInfo.success && Array.isArray(storeInfo.data) && storeInfo.data.length > 0) {
					// storeInfo = storeInfo.data[0];
					this.unreadNum = storeInfo.data[0].kefu_unread_msg
					this.storeInfo = storeInfo.data[0];
					this.getStoreArticleColumns()
				}
			}
		},
		onPullDownRefresh() {
			if (this.storeNo) {
				this.getStoreInfo();
				// this.getStoreSession()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		beforeDestroy() {
			uni.$emit('updateUnread')
		},
		onLoad(option) {
			uni.$on('updateKefuSessionLastLookTime', () => {
				if (this.storeNo) {
					this.getStoreInfo();
					// this.getStoreSession()
				}
			})
			if (option.store_no) {
				this.storeNo = option.store_no;
				this.getStoreInfo();
				// this.getStoreSession()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #f1f1f1;
	}

	.head {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx;
		display: flex;

		.store-name {
			margin-left: 20rpx;
			flex-wrap: wrap;

			.name {
				font-weight: bold;
				font-size: 16px;
			}

			.address {
				max-width: 400rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-top: 5px;
				color: #666;
			}
		}

		.phone {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			image {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}

	.logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		border: 1px solid #f1f1f1;
	}

	.manager-view {
		background-color: #fff;
		.title {
			display: inline-block;
			padding: 20rpx 20rpx 20rpx;
		}
	}

	.manager-box {
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;

		.box-item {
			padding: 20rpx;
			width: 33.33%;
			box-sizing: border-box;
			border: 1px solid #f1f1f1;
			background-color: #fff;

			.box-item-content {
				position: relative;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.amount {
					position: absolute;
					right: -5px;
					top: -5px;
				}
			}

			.icon {
				width: 80rpx;
				height: 80rpx;
				font-size: 30px;
				display: inline-flex;
				justify-content: center;
				align-items: center;
			}

			.label {
				margin-top: 10px;
			}
		}
	}
</style>
