<template>
	<view class="list-wrap">
		<view class="cu-list">
			<view class="cu-item" v-for="(item,index) in sessionList" :key="item.session_no" @click="toChat(item)">
				<view class="cu-avatar lg" v-if="!item.store_user_image&&!item.store_user_profile">
					<text class="cuIcon-profilefill"></text>
					<view class="cu-tag badge" v-if="item.kefu_kefu_unread_msg">
						{{item.kefu_kefu_unread_msg}}
					</view>
					<view class="cu-tag badge-left" v-if="item.kefu_kefu_unack_msg">
						{{item.kefu_kefu_unack_msg}}
					</view>
				</view>
				<view class="cu-avatar  lg" v-if="item.store_user_profile"
					:style="[{backgroundImage:'url('+getImagePath(item.store_user_profile)+')'}]">
					<view class="cu-tag badge" v-if="item.kefu_kefu_unread_msg">
						{{item.kefu_kefu_unread_msg}}
					</view>
					<view class="cu-tag badge-left" v-if="item.kefu_kefu_unack_msg">
						{{item.kefu_kefu_unack_msg}}
					</view>
				</view>
				<view class="cu-avatar  lg" v-if="item.store_user_image"
					:style="[{backgroundImage:'url('+getImagePath(item.store_user_image)+')'}]">
					<view class="cu-tag badge" v-if="item.kefu_kefu_unread_msg">
						{{item.kefu_kefu_unread_msg}}
					</view>
					<view class="cu-tag badge-left" v-if="item.kefu_kefu_unack_msg">
						{{item.kefu_kefu_unack_msg}}
					</view>
				</view>
				<view class="content">
					<view class="text-black">{{item.store_user_name||''}}</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeNo: '',
				sessionList: [],
				page: {
					pageNo: 1,
					rownumber: 40,
					total: 0
				},
				more: 'more', //more,loading,noMore
			};
		},
		methods: {
			toChat(e) {
				this.page.pageNo = 1
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
					},{
						"colName":"msg_count",
						ruleType:'gt',
						value:0
					}
					],
					order: [{
						"colName": "last_msg_time",
						"orderType": "desc" // asc升序  desc降序
					}],
					"page": {
						"pageNo": this.page.pageNo,
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
						if (this.page.total && this.page.total > this.page.rownumber*this.page.pageNo) {
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
			this.page.pageNo = 1
			if (this.storeNo) {
				this.getStoreSession()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			if (this.more!=='noMore') {
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
	.list-wrap {
		min-height: calc(100vh - var(--window-bottom) - var(--window-top) + 10px);
		padding: 20rpx 0;
	}

	.cu-list {
		display: flex;
		flex-wrap: wrap;
		.cu-item {
			width: 25%;
			margin-bottom: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.badge-left {
				position: absolute;
				background-color: transparent;
				background-color: #f37b1d;
				border-radius: 100px;
				top: -5px;
				left: -10px;
				font-size: 10px;
				padding: 0px 5px;
				height: 14px;
				color: #FFFFFF;
			}
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
				height: 20px;
				overflow: hidden;
			}
		}
	}
</style>
