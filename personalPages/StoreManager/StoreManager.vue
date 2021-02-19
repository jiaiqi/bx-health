<template>
	<view>
		<view class="head">
			<image :src="getImagePath(storeInfo.image)" class="logo" mode="aspectFill"></image>
			<view class="store-name">{{ storeInfo.name }}</view>
		</view>
		<view class="manager-view">
			<text class="text-grey title">管理</text>
			<view class="manager-box">
				<view class="box-item" v-for="item in gridList" @click="clickGrid(item.type)">
					<image src="../static/links.png" class="icon" mode="" v-if="!item.icon"></image>
					<text class="icon" v-else :class="['cuIcon-' + item.icon, item.color ? 'text-' + item.color : '']"></text>
					<view class="label">{{ item.label }}</view>
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
			storeNo: '',
			gridList: [
				{
					label: '店铺设置',
					icon: 'settings',
					color: 'blue',
					type:'setting'
				},
				{
					label: '店铺商品',
					icon: 'goods',
					color:'orange'
				},
				{
					label: '店铺订单',
					icon: 'punch',
					color:'yellow'
				},
				{
					label: '预约列表',
					icon: 'peoplelist',
					color:'green'
				},
				{
					label: '就诊列表',
					icon: 'peoplelist',
					color:'cyan'
				},
				{
					label: '方案列表',
					icon: 'calendar',
					color:'blue'
				},
				// {
				// 	label: '药品库存',
				// 	icon:'shop'
				// },
				{
					label: '排班列表',
					icon: 'sort',
					color:'cyan'
				},
				{
					label: '用户列表',
					icon: 'addressbook',
					color:'green'
				}
			]
		};
	},
	methods: {
		clickGrid(type){
			let url = ''
			switch (type){
				case 'setting':
					this.toDetail(this.storeInfo)
					break;
				default:
					break;
			}
			if(url){
				uni.navigateTo({
					url:url
				})
			}
		},
		toDetail(e) {
			let fieldsCond = [
				{
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
					display: false
				},
				{
					column: 'create_time',
					display: false
				},
				{
					column: 'create_user_disp',
					display: false
				}
			];
			uni.navigateTo({
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_store_mgmt_select&type=detail&fieldsCond=' + JSON.stringify(fieldsCond)
			});
		},
		async getStoreInfo() {
			let req = {
				condition: [{ colName: 'store_no', ruleType: 'in', value: this.storeNo }]
			};
			let storeInfo = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health');
			if (storeInfo.success && Array.isArray(storeInfo.data) && storeInfo.data.length > 0) {
				storeInfo = storeInfo.data[0];
				this.storeInfo = storeInfo;
			}
		}
	},
	onLoad(option) {
		if (option.store_no) {
			this.storeNo = option.store_no;
			this.getStoreInfo();
		}
	}
};
</script>

<style lang="scss" scoped>
.head {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 20rpx;
	display: flex;
	.store-name {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		font-weight: bold;
	}
}
.logo {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 1px solid #f1f1f1;
}
.manager-view {
	.title {
		display: inline-block;
		padding: 40rpx 20rpx 20rpx;
	}
}
.manager-box {
	display: flex;
	flex-wrap: wrap;
	.box-item {
		padding: 20rpx;
		width: 33.33%;
		box-sizing: border-box;
		border: 1px solid #f1f1f1;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
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
