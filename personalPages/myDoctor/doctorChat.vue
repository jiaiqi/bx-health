<template>
	<view class="doctor-wrap" :class="{ 'padding-top': groupInfo && groupInfo.gc_no }">
		<view class="util-bar" v-if="groupInfo && groupInfo.gc_no">
			<view class="util-item " @click="toPages('group-member')">
				<view class="icon"><text class="cuIcon-friend "></text></view>
				<text class="label">成员</text>
			</view>
			<view class="util-item " @click="toPages('group-util')">
				<view class="icon"><text class="cuIcon-repair "></text></view>
				<text class="label">小工具</text>
			</view>
			<view class="util-item" @click="toPages('group-detail')">
				<view class="icon border"><text class="cuIcon-more"></text></view>
				<text class="label">更多</text>
			</view>
		</view>
		<person-chat ref="chat" @load-msg-complete="loadMsgComplete" :top-height="topHeight" :doctor_no="doctor_no"
		 :groupInfo="groupInfo" :pageType="pageType" v-if="groupInfo&&groupInfo.gc_no"></person-chat>
		<person-chat ref="chat" @load-msg-complete="loadMsgComplete" :doctor_info="doctor_no" :pageType="pageType" :customer_no="no"
		 v-else-if="no"></person-chat>
	</view>
</template>

<script>
	import personChat from '@/personalPages/components/personInfo/personchat.vue';
	export default {
		name: 'doctorChat',
		components: {
			personChat
		},
		data() {
			return {
				optionParams :{},
				no: '', // 一对一聊天对象的person_no
				groupNo: "", // 圈子编号
				doctor_no: {}, // 医生信息
				groupInfo: {}, // 圈子信息
				pageType: 'patient', // 发送人身份 患者/医生
				lastMessage: {} // 消息列表中最后一条消息
			};
		},
		computed: {
			topHeight() {
				return this.groupInfo && this.groupInfo.gc_no ? 60 : 0;
			}
		},
		methods: {
			selectGroupInfo() {
				let req = {
					condition: [{
						colName: 'gc_no',
						ruleType: 'in',
						value: this.groupNo
					}]
				};
				this.$fetch('select', 'srvhealth_group_circle_select', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.groupInfo = {...res.data[0],...this.optionParams}
						this.pageType = 'groupChat';
						this.selectGroupMember().then(data => {
							if (Array.isArray(data)) {
								uni.setNavigationBarTitle({
									title: `${this.groupInfo.name}（${data.length}）`
								});
							} else {
								uni.setNavigationBarTitle({
									title: `${this.groupInfo.name}`
								});
							}
						});
					}
				})
			},
			updateLastLookTime(e) {
				if (this.groupInfo && this.groupInfo.pg_no) {
					let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_update', 'operate');
					let req = [{
						serviceName: 'srvhealth_person_group_circle_update',
						condition: [{
							colName: 'pg_no',
							ruleType: 'eq',
							value: this.groupInfo.pg_no
						}],
						data: [{
							latest_sign_in_time: e && e.create_time ? e.create_time : this.formateDate('', 'DateTime')
						}]
					}];
					this.$http.post(url, req);
				}
			},
			loadMsgComplete(e) {
				// this.updateLastLookTime(e);
				// 消息加载完毕，e为最后一条消息
				this.lastMessage = e
			},
			async selectGroupMember() {
				// 查询圈子成员
				let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_group_circle_select',
					colNames: ['*'],
					condition: [{
						colName: 'gc_no',
						ruleType: 'eq',
						value: this.groupInfo.gc_no
					}]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					return res.data.data;
				}
			},
			toPages(type) {
				uni.navigateTo({
					url: `../gropDetail/gropDetail?gc_no=${this.groupInfo.gc_no}&type=${type}`
				});
			}
		},
		onLoad(option) {
			if(option.no){
				this.no = option.no
			}
			if (option.gc_no) {
				this.groupNo = option.gc_no
				this.optionParams = option
				this.selectGroupInfo()
			}
			if (option.doctor) {
				this.doctor_no = JSON.parse(decodeURIComponent(option.doctor));
			} else if (option.groupInfo) {
				this.groupInfo = JSON.parse(decodeURIComponent(option.groupInfo));
			} else {
				this.pageType = '';
			}
		},
		beforeDestroy() {
			this.updateLastLookTime(this.lastMessage);
		},
	};
</script>

<style lang="scss" scoped>
	page {
		min-height: calc(100vh - var(--window-top) - var(--window-bottom));
	}

	.doctor-wrap {
		overflow: hidden;
		position: relative;
		width: 100%;

		&.padding-top {
			padding-top: 60px;
		}

		.menu {
			padding: 0 40rpx;
			font-size: 36rpx;
		}

		.util-bar {
			display: flex;
			background-color: #fafafa;
			justify-content: center;
			border-radius: 0 0 20rpx 20rpx;
			overflow: hidden;
			padding: 20rpx;
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			width: 100%;
			z-index: 2;

			.util-item {
				// width: 25%;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				// border-bottom: 1rpx solid #f1f1f1;
				&+.util-item {
					border-left: 1rpx solid #eee;
				}

				.icon {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					color: #333;
					line-height: 40rpx;
					text-align: center;
					font-size: 40rpx;

					&.border {
						border: 1rpx solid #333;
					}
				}

				.label {
					color: #999;
					margin-top: 10rpx;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
