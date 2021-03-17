<template>
	<view>
		<!-- <scroll-view scroll-y="true"> -->
		<view class="cu-list">
			<view class="cu-item" v-for="(item,index) in sessionList" :key="item.session_no" @click="toChat(item)">

				<view class="cu-avatar lg" v-if="!item.store_user_image">
					<text class="cuIcon-profilefill"></text>
					<view class="cu-tag badge" v-if="item.kefu_user_unread_msg">
						{{item.kefu_user_unread_msg}}
					</view>
				</view>
				<view class="cu-avatar  lg" v-if="item.store_user_image"
					:style="[{backgroundImage:'url('+getImagePath(item.store_user_image)+')'}]">
					<view class="cu-tag badge" v-if="item.kefu_user_unread_msg">
						{{item.kefu_user_unread_msg}}
					</view>
				</view>
				<view class="content">
					<view class="text-black">{{item.store_user_name||''}}</view>
				</view>
			</view>
		</view>
		<!-- </scroll-view> -->
		<!-- <uni-load-more :status="more"></uni-load-more> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeNo: '',
				sessionList: [],
				page: {
					pageNo: 0,
					rownumber: 30,
					total: 0
				},
				more: 'more', //more,loading,noMore
			};
		},
		methods: {
			toChat(e) {
				// 跳转到聊天页面
				uni.navigateTo({
					url: `/personalPages/chat/chat?type=机构用户客服&identity=客服&storeNo=${this.storeNo}&session_no=${e.session_no}`
				})
			},
			getStoreSession(isMore) {
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
					"page": {
						"pageNo": this.page.pageNo + 1,
						"rownumber": this.page.rownumber
					}
				}
				this.$fetch('select', 'srvhealth_dialogue_session_select', req, 'health').then(res => {
					if (res.success) {
						if (isMore) {
							this.sessionList = [...this.sessionList, ...res.data];
						} else {
							this.sessionList = res.data
						}
						if (res.page) {
							this.page = res.page;
						}
						if (this.page.total && this.page.total > this.page.rownumber) {
							this.more = 'more';
						} else {
							this.more = 'noMore';
						}
					}
				})
			},
		},

		onLoad(option) {
			uni.$on('updateKefuSessionLastLookTime', () => {
				this.getStoreSession()
			})
			if (option.storeNo) {
				this.storeNo = option.storeNo
				this.getStoreSession()
				uni.setNavigationBarTitle({
					title: '用户咨询记录'
				})
			}
		},
		onPullDownRefresh() {
			if (this.storeNo) {
				this.getStoreSession()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			if (this.page.total && this.page.total > this.page.rownumber) {
				// 加载更多
				this.page.pageNo++;
				this.more = 'loading';
				this.getStoreSession('more');
			} else {
				// 没有更多
				this.more = 'noMore';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;

		.cu-item {
			width: 25%;
			margin-bottom: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.cu-avatar {
				position: relative;
				border-radius: 5px;
			}

			.content {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				width: 90%;
				text-align: center;
			}
		}
	}
</style>
