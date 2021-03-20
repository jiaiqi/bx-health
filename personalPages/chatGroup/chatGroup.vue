<template>
	<view class="chat-group">
		<view class="tab-view">
			<view class="tab-item" :class="{ 'active-tab': index == TabCur }" v-for="(item, index) in tabList"
				:key="index" @tap="tabSelect" :data-id="index">{{ item.label }}</view>
		</view>
		<view class="group-list" v-if="TabCur === 0">
			<view class="group-item" v-for="item in groupList" :key="item.gc_no" @click="toChat(item)">
				<view class="icon" @click.stop="toChat(item)">
					<image :src="item.icon ? getImagePath(item.icon) : '../static/chat-active.png'" mode="aspectFit"
						class="image"></image>
				</view>
				<view class="content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="time">{{ formateTime(item.lastChatTime, true) }}</view>
					</view>
					<view class="bottom">
						<text class="message">{{ item.lastChatText || '' }}</text>
						<text class="unread">
							<text class="text" v-if="item.unreadAmount">{{ item.unreadAmount || '' }}</text>
						</text>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar search bg-white" v-if="TabCur === 1">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" placeholder="搜索圈子" confirm-type="search" v-model="keywords"
					@blur="InputBlur" />
			</view>
			<view class="action"><button class="cu-btn bg-green shadow-blur round">搜索</button></view>
		</view>
		<view class="group-list grid" v-if="TabCur === 1">
			<view class="group-item" v-for="item in otherGroup" :key="item.gc_no" @click="toPages('group-info', item)">
				<view class="icon">
					<image :src="item.icon ? getImagePath(item.icon) : '../static/chat-active.png'" mode="aspectFit"
						class="image"></image>
				</view>
				<view class="content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
					</view>
				</view>
			</view>
			<!-- 		<view class="group-item" @click="toPages('create-group')">
				<view class="icon cuIcon-add"></view>
				<view class="content">
					<view class="top">
						<view class="name">创建圈子</view>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				groupList: [],
				otherGroup: [],
				TabCur: 0,
				keywords: '',
				tabList: [{
						label: '我的'
					},
					{
						label: '发现'
					}
				]
			};
		},
		computed: {
			...mapState({
				vuex_userInfo: state => state.user.userInfo
			})
		},
		methods: {
			async selectUnreadAmount(list) {
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					group: [{
							colName: 'rcv_group_no',
							type: 'by'
						},
						{
							colName: 'create_time',
							type: 'count'
						}
					]
				};
				if (Array.isArray(list)) {
					let relationCondition = {
						relation: 'OR',
						data: [{
							relation: 'AND',
							data: []
						}]
					};
					relationCondition.data = list.map(item => {
						let obj = {
							relation: 'AND',
							data: [{
								colName: 'rcv_group_no',
								ruleType: 'eq',
								value: item.gc_no
							}, {
								colName: 'create_time',
								ruleType: 'gt',
								value: item.latest_sign_in_time
							}]
						};
						return obj;
					});
					req.relation_condition = relationCondition;
				}
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					this.groupList = this.groupList.map(item => {
						res.data.data.forEach(count => {
							if (count.rcv_group_no === item.gc_no) {
								item.unreadAmount = count.create_time;
							}
						});
						return item;
					});
				}
			},
			InputBlur(e) {
				if (e.detail) {
					let condition = [{
						colName: 'name',
						ruleType: 'like',
						value: e.detail.value
					}];
					this.selectOtherGroup(condition);
				}
			},
			tabSelect(e) {
				this.TabCur = Number(e.currentTarget.dataset.id);
				if (this.TabCur === 1) {
					this.selectOtherGroup();
				} else {
					this.selectMyGroup();
				}
			},
			toPages(type, info) {
				let self = this;
				if (type === 'group-info') {
					uni.showModal({
						title: '提示',
						content: `是否加入${info.name}圈子?`,
						confirmText: '加入',
						confirmColor: '#007AFF',
						success(res) {
							if (res.confirm) {
								self.joinGroup(info);
							}
						}
					});
				} else if (type === 'create-group') {
					let fieldsCond = [{
						column: 'circle_visible',
						value: '不开放'
					}]
					let url =
						`/publicPages/newForm/newForm?serviceName=srvhealth_group_circle_select&type=add&fieldsCond=${JSON.stringify(fieldsCond)}`;
					uni.navigateTo({
						url: url
					});
				}
			},
			// toChat2(item) {
			// 	//跳转到群组聊天页面
			// 	uni.navigateTo({
			// 		url: `/publicPages/chat/chat?no=${this.vuex_userInfo.no}&group_no=${item.gc_no}`
			// 	});
			// },
			toChat(item) {
				//跳转到群组聊天页面
				// uni.navigateTo({
				// 	url: `/personalPages/myDoctor/doctorChat?no=${this.vuex_userInfo.no}&groupInfo=${encodeURIComponent(JSON.stringify(item))}`
				// });
				uni.navigateTo({
					url: `/personalPages/chat/chat?type=群组圈子&attend_approve=${item.attend_approve}&groupNo=${item.gc_no}&pg_no=${item.pg_no}&circle_visible=${item.circle_visible}&group_role=${item.group_role}`
				});
				// uni.navigateTo({
				// 	url: `/personalPages/myDoctor/doctorChat?no=${this.vuex_userInfo.no}&attend_approve=${item.attend_approve}&gc_no=${item.gc_no}&pg_no=${item.pg_no}&circle_visible=${item.circle_visible}&group_role=${item.group_role}`
				// });
			},
			joinGroup(e) {
				let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_add', 'operate');
				let req = [{
					serviceName: 'srvhealth_person_group_circle_add',
					condition: [],
					data: [{
						person_no: this.vuex_userInfo.no,
						user_no: this.vuex_userInfo.userno,
						gc_no: e.gc_no,
						group_role: '用户',
						latest_sign_in_time: this.formateDate('', 'DateTime')
					}]
				}];
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						uni.showToast({
							title: '操作成功'
						});
						uni.startPullDownRefresh();
						this.selectMyGroup();
					}
				});
			},
			async selectGroup(cond, page) {
				// 查找圈子
				let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_group_circle_select',
					colNames: ['*'],
					page: {
						pageNo: 1,
						rownumber: 10
					}
				};
				if (Array.isArray(cond)) {
					req.condition = cond;
				}
				if (page) {
					req.page = page;
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					return res.data.data;
				}
			},
			async selectOtherGroup(condition) {
				// 查找当前登录用户未加入的圈子
				let cond = [{
					colName: 'gc_no',
					ruleType: 'notin',
					value: this.groupList.map(item => item.gc_no).toString()
				}, {
					"colName": "circle_visible",
					"ruleType": "ne",
					"value": '不开放',
				}];
				if (condition) {
					cond = [...cond, ...condition];
				}
				let res = await this.selectGroupInfo('', '', cond);
				if (Array.isArray(res)) {
					this.otherGroup = res;
				}
			},
			async selectMyGroup() {
				// 查找当前登录用户已加入的圈子
				if (this.vuex_userInfo && this.vuex_userInfo.no) {
					let res = await this.selectGroup([{
						colName: 'person_no',
						ruleType: 'eq',
						value: this.vuex_userInfo.no
					}]);
					if (Array.isArray(res) && res.length > 0) {
						let no = res.map(item => item.gc_no);
						this.groupList = await this.selectGroupInfo(no.toString(), res);
						let lastTimeArr = res.map(item => {
							return {
								gc_no: item.gc_no,
								latest_sign_in_time: item.latest_sign_in_time
							};
						});
						this.selectUnreadAmount(this.groupList);
						this.selectLastChatText(no.toString());
					}
				}
			},
			async selectGroupInfo(no, data, cond) {
				if (no || cond) {
					let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
					let req = {
						serviceName: 'srvhealth_group_circle_select',
						colNames: ['*'],
						condition: [{
							colName: 'gc_no',
							ruleType: 'in',
							value: no
						}, {
							"colName": "circle_visible",
							"ruleType": "ne",
							"value": '不开放',
						}]
					};
					if (cond) {
						req.condition = cond;
					}
					let res = await this.$http.post(url, req);
					if (Array.isArray(res.data.data) && Array.isArray(data)) {
						res.data.data = res.data.data.map(item => {
							data.map(info => {
								if (info.gc_no === item.gc_no) {
									item.group_role = info.group_role;
									item.latest_sign_in_time = info.latest_sign_in_time;
									item.pg_no = info.pg_no;
								}
							});
							return item;
						});
						return res.data.data;
					} else if (Array.isArray(res.data.data)) {
						return res.data.data;
					}
				}
			},
			selectLastChatText(no) {
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					page: {
						rownumber: 20
					},
					condition: [{
						colName: 'rcv_group_no',
						ruleType: 'in',
						value: no
					}]
				};
				this.$http.post(url, req).then(res => {
					if (Array.isArray(res.data.data)) {
						this.groupList = this.groupList.map(item => {
							res.data.data.map(info => {
								if (info.rcv_group_no === item.gc_no) {
									if (!item.lastChatTime || item.lastChatTime < info
										.create_time) {
										// 最新一条消息
										item.lastChatState = info.msg_state;
										item.lastChatTime = info.create_time;
										switch (info.msg_content_type) {
											case '文本':
												item.lastChatText = info.msg_content;
												break;
											case '链接':
												item.lastChatText = '[链接]';
												break;
											case '图片':
												item.lastChatText = '[图片]';
												break;
											case '语音':
												item.lastChatText = '[语音]';
												break;
											case '视频':
												item.lastChatText = '[视频]';
												break;
											case '文件':
												item.lastChatText = '[文件]';
												break;
										}
									}
								}
							});
							return item;
						});
					}
				});
			}
		},
		onPullDownRefresh() {
			if (this.TabCur === 1) {
				this.selectOtherGroup();
			} else if (this.TabCur === 0) {
				this.selectMyGroup();
			}
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			this.$nextTick(function() {
				if (this.TabCur === 1) {
					this.selectOtherGroup();
				} else if (this.TabCur === 0) {
					this.selectMyGroup();
				}
			});
		}
	};
</script>

<style lang="scss" scoped>
	.chat-group {
		min-height: calc(100vh - var(--window-top) - var(--window-bottom));
		background-color: #fff;
	}

	.tab-view {
		display: flex;

		.tab-item {
			padding: 30rpx;
			font-size: 36rpx;

			&.active-tab {
				font-weight: bold;
				position: relative;

				&::after {
					content: '';
					height: 5rpx;
					width: 40rpx;
					bottom: 20rpx;
					left: calc(50% - 20rpx);
					background-color: #000000;
					position: absolute;
				}
			}
		}
	}

	.group-list {
		display: flex;
		flex-direction: column;

		.group-item {
			display: flex;
			padding: 20rpx;
			transition: all 0.5s ease-out;
			overflow: hidden;

			&:active {
				background-color: #f1f1f1;
			}

			&+.group-item {
				border-top: 1rpx solid #f8f8f8;
			}

			.icon {
				width: 120rpx;
				height: 120rpx;
				padding: 20rpx;
				display: flex;
				background-color: #f1f1f1;
				border-radius: 50%;
				justify-content: center;
				align-items: center;
				border: 1rpx solid #f1f1f1;
			}

			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 20rpx;

				.top {
					display: flex;
					justify-content: space-between;
					padding: 10rpx 0;

					.name {
						font-weight: bold;
						font-size: 32rpx;
						letter-spacing: 2px;
					}

					.time {
						font-size: 24rpx;
						color: #999;
					}
				}

				.bottom {
					display: flex;

					.message {
						color: #999;
						flex: 1;
					}

					.unread {
						width: 50rpx;

						.text {
							display: inline-block;
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
							background-color: #dd525d;
							line-height: 50rpx;
							text-align: center;
							color: #fff;
							font-size: 20rpx;
						}
					}
				}
			}
		}

		&.grid {
			flex-direction: row;
			padding: 0 30rpx;

			.group-item {
				width: 33%;
				padding: 20rpx 10rpx;
				flex-direction: column;
				align-items: center;

				// border: 1rpx dashed #f1f1f1;
				&+.group-item {
					border-top: none;
				}

				.icon {
					border-radius: 10rpx;
					position: relative;

					.button {
						position: absolute;
						right: 0;
						bottom: 0;
					}
				}

				.top {
					.name {
						font-weight: bold;
						font-size: 28rpx;
						letter-spacing: 0;
					}
				}
			}
		}
	}
</style>
