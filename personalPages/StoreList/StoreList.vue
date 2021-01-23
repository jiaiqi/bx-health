<template>
	<view class="store-list-wrap">
		<view class="cu-bar bg-white">
			<view class="action sub-title">
				<text class="text-xl text-bold text-green"><span>我的单位</span></text>
				<text class="bg-green"><span></span></text>
			</view>
			<button class="action add-unit cu-btn" @click="createUnit">
				<text class="cuIcon-add"></text>
				<text>创建单位</text>
			</button>
		</view>
		<view class="store-list">
			<view class="list-item" v-for="item in storeList">
				<image @click="toStoreDetail(item)" :src="getImagePath(item.image)" mode="aspectFit" class="image"></image>
				<view class="content" @click="toStoreDetail(item)">
					<view class="store-name">{{ item.name }}</view>
					<view class="user-info">
						<text class="label">职业：</text>
						<text class="mine-role">{{ item.user_role }}</text>
					</view>
				</view>
				<view class="action">
					<button class="cu-btn sm line-green round" open-type="share" data-type="bindOrganization" :data-data="item"><text class="cuIcon-forward"></text></button>
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
			storeList: []
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	methods: {
		createUnit() {
			let fieldsCond = [
				{
					column: 'address',
					fieldType: 'location'
				},
				{
					column: 'audit_status',
					display: false,
					value: '待审核'
				},
				{
					column: 'grade',
					display: false,
					value: '0'
				},
				{
					column: 'longitude',
					display: false
				},
				{
					column: 'latitude',
					display: false
				},
				{
					column: 'sale_num',
					display: false
				}
			];
			uni.navigateTo({
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_store_mgmt_add&type=add&fieldsCond=' + JSON.stringify(fieldsCond)
			});
		},
		toStoreDetail(e) {
			if (e.store_no) {
				uni.navigateTo({
					url: `/personalPages/StoreDetail/StoreDetail?store_no=${e.store_no}&from=list`
				});
			}
		},
		async selectMineStore() {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [
					{ colName: 'user_role', ruleType: 'ne', value: '用户' },
					{ colName: 'user_role', ruleType: 'notnull' },
					{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.storeList = res.data.data;
			}
		}
	},
	onShareAppMessage(e) {
		let path = '';
		let title = '百想健康';
		let imageUrl = '';
		if (e.target && e.target.dataset && e.target.dataset.type === 'bindOrganization') {
			// 邀请加入组织机构
			if (e.target.dataset.data && e.target.dataset.data.id) {
				let data = e.target.dataset.data;
				path = `/personalPages/StoreDetail/StoreDetail?from=share&invite_user_no=${this.userInfo.userno}&store_no=${data.store_no}&doctor_no=${
					this.userInfo.no
				}&share_type=bindOrganization`;
				title = `${this.userInfo.name}邀请您加入【${data.name}】`;
				imageUrl = this.getImagePath(data.image);
			}
		} else {
			if (this.userInfo.name) {
				title = this.userInfo.name + '邀请您体验百想健康小程序';
			}
		}
		return {
			imageUrl: imageUrl,
			title: title,
			path: path
		};
	},
	onLoad() {
		if (this.userInfo && this.userInfo.no) {
			this.selectMineStore();
		}
	}
};
</script>

<style scoped lang="scss">
.store-list-wrap {
	background-color: #fff;
	min-height: 100vh;
	.add-unit {
		border-radius: 20rpx;
		font-size: 14px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		padding: 10rpx 20rpx;
		background-color: #fff;
		color: #007aff;
	}
	.store-list {
		padding: 0 20rpx;
		.list-item {
			display: flex;
			border-radius: 10px;
			margin-bottom: 5px;
			width: 100%;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			overflow: hidden;
			.image {
				width: 150rpx;
				height: auto;
				min-height: 150rpx;
			}
			.content {
				padding: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: flex-start;
				flex: 1;
				.store-name {
					font-weight: bold;
				}
				.user-info {
					margin-top: 10rpx;
				}
				.mine-role {
					// background-color: #007aff;
					// color: #fff;
					padding: 5rpx 10rpx;
				}
			}
			.action {
				padding: 10rpx;
			}
		}
	}
}
</style>
