<template>
	<view class="doctor-wrap">
		<view class="util-bar">
			<view class="util-item " @click="toPages('group-member')" v-if="groupInfo && groupInfo.gc_no">
				<view class="icon"><text class="cuIcon-friend "></text></view>
				<text class="label">成员</text>
			</view>
			<view class="util-item " @click="toPages('group-util')" v-if="groupInfo && groupInfo.gc_no">
				<view class="icon"><text class="cuIcon-repair "></text></view>
				<text class="label">小工具</text>
			</view>
			<view class="util-item" @click="toPages('group-detail')" v-if="groupInfo && groupInfo.gc_no">
				<view class="icon border"><text class="cuIcon-more"></text></view>
				<text class="label">更多</text>
			</view>
		</view>
		<person-chat
			:customer_no="no"
			ref="chat"
			@completeSendMessage="completeSendMessage"
			:top-height="topHeight"
			:doctor_no="doctor_no"
			:group-info="groupInfo"
			:pageType="pageType"
		></person-chat>
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
			no: '',
			doctor_no: {},
			groupInfo: {},
			memberList: [],
			pageType: 'patient'
		};
	},
	computed: {
		topHeight() {
			return this.groupInfo && this.groupInfo.gc_no ? 60 : 0;
		}
	},
	methods: {
		updateLastLookTime() {
			if (this.groupInfo && this.groupInfo.pg_no) {
				let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_update', 'operate');
				let req = [
					{
						serviceName: 'srvhealth_person_group_circle_update',
						condition: [{ colName: 'pg_no', ruleType: 'eq', value: this.groupInfo.pg_no }],
						data: [{ latest_sign_in_time: this.formateDate('', 'DateTime') }]
					}
				];
				this.$http.post(url, req);
			}
		},
		completeSendMessage(e) {
			// 发送完一条消息后的回调
			this.updateLastLookTime();
		},
		async selectGroupMember() {
			// 查询圈子成员
			// srvhealth_person_group_circle_select
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_group_circle_select',
				colNames: ['*'],
				condition: [{ colName: 'gc_no', ruleType: 'eq', value: this.groupInfo.gc_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				// this.memberList = res.data.data;
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
		if (option.no) {
			this.no = option.no;
		}
		if (option.doctor) {
			this.doctor_no = JSON.parse(decodeURIComponent(option.doctor));
		} else if (option.groupInfo) {
			this.groupInfo = JSON.parse(decodeURIComponent(option.groupInfo));
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
		} else {
			this.pageType = '';
		}
	},
	beforeDestroy() {
		this.updateLastLookTime();
	},
	onPullDownRefresh() {
		// 下拉
		setTimeout(() => {
			this.$refs.chat.getUserInfo(this.no);
			uni.stopPullDownRefresh();
		}, 1000);
	}
};
</script>

<style lang="scss" scoped>
.doctor-wrap {
	overflow: hidden;
	.menu {
		padding: 0 40rpx;
		font-size: 36rpx;
	}
	.util-bar {
		display: flex;
		background-color: #fff;
		justify-content: center;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		padding: 20rpx;
		.util-item {
			// width: 25%;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// border-bottom: 1rpx solid #f1f1f1;
			& + .util-item {
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
