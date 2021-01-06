<template>
	<view class="chat-group">
		<view class="group-list">
			<view class="group-item" v-for="item in groupList" :key="item.gc_no" @click="toChat(item)">
				<view class="icon"><image src="../static/chat-active.png" mode="aspectFit" class="image"></image></view>
				<view class="content">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="time">{{ item.latest_sign_in_time.slice(10, 16) }}</view>
					</view>
					<view class="bottom">
						<text class="message">{{ item.lastChatText || '' }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			groupList: []
		};
	},
	computed: {
		...mapState({
			vuex_userInfo: state => state.user.userInfo
		})
	},
	methods: {
		toChat(item) {
			//跳转到群组聊天页面
			uni.navigateTo({
				url: `/personalPages/myDoctor/doctorChat?no=${this.vuex_userInfo.no}&groupInfo=${encodeURIComponent(JSON.stringify(item))}`
			});
		},
		selectLastChatText(no) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [{ colName: 'rcv_group_no', ruleType: 'in', value: no }]
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.groupList = this.groupList.map(item => {
						res.data.data.map(info => {
							if (info.rcv_group_no === item.gc_no) {
								if (!item.lastChatTime || item.lastChatTime < info.create_time) {
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
		},
		selectMyGroup() {
			if (this.vuex_userInfo && this.vuex_userInfo.no) {
				let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_group_circle_select',
					colNames: ['*'],
					condition: [{ colName: 'person_no', ruleType: 'eq', value: this.vuex_userInfo.no }]
				};
				this.$http.post(url, req).then(res => {
					if (Array.isArray(res.data.data)) {
						let no = res.data.data.map(item => item.gc_no);
						this.selectGroupInfo(no.toString(), res.data.data);
						// this.groupList = res.data.data;
					}
				});
			}
		},
		selectGroupInfo(no, data) {
			if (no) {
				let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
				let req = {
					serviceName: 'srvhealth_group_circle_select',
					colNames: ['*'],
					condition: [{ colName: 'gc_no', ruleType: 'in', value: no }]
				};
				this.$http.post(url, req).then(res => {
					if (Array.isArray(res.data.data)) {
						this.groupList = res.data.data.map(item => {
							data.map(info => {
								if (info.gc_no === item.gc_no) {
									item.group_role = info.group_role;
									item.latest_sign_in_time = info.latest_sign_in_time;
									item.pg_no = info.pg_no;
								}
							});
							return item;
						});
						this.selectLastChatText(no);
					}
				});
			}
		}
	},
	onPullDownRefresh() {
		this.selectMyGroup();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	created() {
		this.selectMyGroup();
	}
};
</script>

<style lang="scss" scoped>
.chat-group {
	min-height: 100vh;
	background-color: #fff;
}
.group-list {
	display: flex;
	flex-direction: column;
	.group-item {
		display: flex;
		padding: 20rpx;
		transition: all 0.5s ease-out;
		&:active {
			background-color: #f1f1f1;
		}
		& + .group-item {
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
				.name{
					font-weight: bold;
					font-size: 32rpx;
					letter-spacing: 2px;
				}
				.time{
					font-size: 24rpx;
					color: #999;
				}
			}
			.bottom {
				.message{
					color: #999;
				}
			}
		}
	}
}
</style>
