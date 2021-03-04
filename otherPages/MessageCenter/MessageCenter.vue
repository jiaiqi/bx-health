<template>
	<view>
		<scroll-view scroll-y="true">
			<view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in sessionList" :key="item.session_no"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index"
				 @click="toChat(item)">
					<view class="cu-avatar round lg" v-if="!item.store_user_image">
						<text class="cuIcon-profilefill"></text>
					</view>
					<view class="cu-avatar round lg" v-if="item.store_user_image" :style="[{backgroundImage:'url('+getImagePath(item.store_user_image)+')'}]"></view>
					<view class="content">
						<view class="text-grey">{{item.store_user_name||''}}</view>
						<view class="text-gray text-sm">
							<!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
							<!-- <text>							 消息未送达</text> -->
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{formateDate(item.last_msg_time, 'normal') }}</view>
						<view class="cu-tag round bg-grey sm">{{item.msg_count}}</view>
					</view>
					<view class="move">
						<view class="bg-grey">置顶</view>
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: '',
				listTouchStart: 0,
				storeNo: '',
				sessionList: []
			};
		},
		methods: {
			toChat(e) {
				// 跳转到聊天页面
				uni.navigateTo({
					url: `/personalPages/chat/chat?type=机构用户客服&identity=客服&storeNo=${this.storeNo}&session_no=${e.session_no}`
				})
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
					"page": {
						"pageNo": 1,
						"rownumber": 20
					}
				}
				this.$fetch('select', 'srvhealth_dialogue_session_select', req, 'health').then(res => {
					if (res.success) {
						this.sessionList = res.data
					}
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		},
		onLoad(option) {
			if (option.storeNo) {
				this.storeNo = option.storeNo
				this.getStoreSession()
			}
		},
		onPullDownRefresh() {
			if (this.storeNo) {
				this.getStoreSession()
				uni.setNavigationBarTitle({
					title: '用户咨询记录'
				})
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		}
	}
</script>

<style lang="scss">

</style>
