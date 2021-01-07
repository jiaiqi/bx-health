<template>
	<view class="doctor-wrap">
		<view class="util-bar">
			<view class="util-item" @click="toPages('group-detail')" v-if="groupInfo && groupInfo.gc_no">
				<view class="icon"><text class="cuIcon-more"></text></view>
				<text class="label">更多</text>
			</view>
		</view>
		<!-- 		<cu-custom :isBack="true">
			<block slot="content">{{ groupInfo.name + '(' + groupInfo.peopleNum + ')' }}</block>
			<block slot="right">
				<view class="menu"><text class="cuIcon-more"></text></view>
			</block>
		</cu-custom> -->
		<person-chat :customer_no="no" ref="chat" :doctor_no="doctor_no" :group-info="groupInfo" :pageType="pageType"></person-chat>
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
			pageType: 'patient'
		};
	},
	methods: {
		toPages(type) {
			if (type === 'group-detail') {
				uni.navigateTo({
					url: `../gropDetail/gropDetail?gc_no=${this.groupInfo.gc_no}`
				});
			}
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
		} else {
			this.pageType = '';
		}
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
		.util-item {
			width: 25%;
			padding: 20rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-bottom: 1rpx solid #f1f1f1;
			.icon {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				border: 1rpx solid #333;
				color: #333;
				line-height: 40rpx;
				text-align: center;
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
