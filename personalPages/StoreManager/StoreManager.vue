<template>
	<view>
		<view class="head">
			<image :src="getImagePath(storeInfo.image)" class="logo" mode="aspectFill"></image>
			<view class="store-name">
				<view class="name">{{ storeInfo.name }}</view>
				<view class="address" @click="openLocation">
					{{ storeInfo.address }}
					<text class="location cuIcon-locationfill text-blue margin-left-xs"></text>
				</view>
			</view>
			<view class="phone" @click="makePhoneCall" v-if="storeInfo.telephone"><image src="../../static/icon/makePhone.png" mode=""></image></view>
		</view>
		<view class="manager-view">
			<text class="text-grey title">管理</text>
			<view class="manager-box">
				<view class="box-item" v-for="item in gridList" @click="clickGrid(item.type)">
					<view class="box-item-content">
						<view class="cu-tag  amount text-blue" v-if="storeInfo[item.type]">{{ storeInfo[item.type] | overDisplay }}</view>
						<image src="../static/links.png" class="icon" mode="" v-if="!item.icon"></image>
						<text class="icon" v-else :class="['cuIcon-' + item.icon, item.color ? 'text-' + item.color : '']"></text>
						<view class="label">{{ item.label }}</view>
					</view>
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
					label: '店铺商品',
					icon: 'goods',
					color: 'orange',
					type: 'goods_count'
				},
				{
					label: '店铺订单',
					icon: 'punch',
					color: 'yellow',
					type: 'order_count'
				},
				// {
				// 	label: '预约列表',
				// 	icon: 'peoplelist',
				// 	color: 'green',
				// 	type: 'person_order_count'
				// },
				{
					label: '就诊列表',
					icon: 'peoplelist',
					color: 'cyan',
					type: 'see_doctor_count'
				},
				{
					label: '方案列表',
					icon: 'calendar',
					color: 'blue',
					type: 'paln_count'
				},
				// {
				// 	label: '药品库存',
				// 	icon:'shop'
				// },
				{
					label: '排班列表',
					icon: 'sort',
					color: 'cyan',
					type: 'schedule_count'
				},
				{
					label: '用户列表',
					icon: 'addressbook',
					color: 'green',
					type: 'user_count'
				},
				{
					label: '店铺设置',
					icon: 'settings',
					color: 'blue',
					type: 'setting'
				}
			]
		};
	},
	filters: {
		overDisplay: function(value) {
			return value < 100 ? value : '99+';
		}
	},
	methods: {
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.storeInfo.telephone //仅为示例
			});
		},
		openLocation() {
			if (this.storeInfo.latitude && this.storeInfo.longitude) {
				uni.openLocation({
					latitude: Number(this.storeInfo.latitude),
					longitude: Number(this.storeInfo.longitude),
					name: this.storeInfo.name,
					address: this.storeInfo.address
				});
			}
		},
		clickGrid(type) {
			let url = '';
			let cond = [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }];
			let viewTemp = {};
			switch (type) {
				case 'setting':
					this.toDetail(this.storeInfo);
					break;
				case 'goods_count':
					viewTemp = {
						title: 'goods_name',
						tip: 'goods_desc',
						img: 'goods_img',
						price: 'price',
						footer: 'store_name'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_store_goods_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
				case 'order_count':
					viewTemp = {
						title: 'order_no',
						tip: 'order_remark',
						// img: 'img',
						price: 'order_amount',
						footer: 'rcv_addr_str'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_store_order_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
				case 'see_doctor_count':
					viewTemp = {
						title: 'name'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_see_doctor_record_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
				case 'paln_count':
					viewTemp = {
						title: 'ds_name'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_plan_schedule_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
				case 'schedule_count':
					viewTemp = {
						title: 'person_name'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_store_on_duty_scheduling_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
				case 'user_count':
					viewTemp = {
						title: 'person_name',
						tip: 'sex',
						img: 'profile_url',
						footer: 'user_role'
					};
					url = `/publicPages/list/list?pageType=list&serviceName=srvhealth_store_user_select&cond=${JSON.stringify(cond)}&viewTemp=${JSON.stringify(viewTemp)}`;
					break;
			}

			if (url) {
				uni.navigateTo({
					url: url
				});
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
					display: false,
					value: e.audit_status
				},
				{
					column: 'create_time',
					display: false
				},
				{
					column: 'create_user_disp',
					display: false
				},
				{
					column: 'order_count',
					display: false
				},
				{
					column: 'goods_count',
					display: false
				},
				{
					column: 'person_order_count',
					display: false
				},
				{
					column: 'see_doctor_count',
					display: false
				},
				{
					column: 'user_count',
					display: false
				},
				{
					column: 'website_no',
					display: false,
					value: e.website_no
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
		// display: flex;
		// align-items: flex-start;
		margin-left: 20rpx;
		flex-wrap: wrap;
		.name {
			font-weight: bold;
			font-size: 16px;
			width: 80%;
		}
		.address {
			max-width: 400rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-top: 5px;
			color: #666;
		}
	}
	.phone {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}
}
.logo {
	width: 120rpx;
	height: 120rpx;
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
		// display: inline-flex;
		// flex-direction: column;
		// justify-content: center;
		// align-items: center;
		background-color: #fff;
		.box-item-content {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.amount{
				position: absolute;
				right: -5px;
				top: -5px;
			}
		}
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
