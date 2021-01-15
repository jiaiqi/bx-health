<template>
	<view>
		<view class="basic-info">
			<image :src="groupInfo.icon ? getImagePath(groupInfo.icon) : '../static/chat-active.png'" mode="aspectFit" class="logo"></image>
			<view class="content">
				<view class="name">{{ groupInfo.name }}</view>
				<view class="introduce">群主很懒，还没有群介绍哦~</view>
			</view>
		</view>
		<view class="setting-item cu-list group-member" v-if="type === 'group-member'">
			<view class="title cu-item arrow">圈子成员</view>
			<view class="content-list">
				<view class="content-item" v-for="item in memberList" :key="item.person_no">
					<image :src="getProfilePath(item)" mode="aspectFit" class="image"></image>
					<text class="label">{{ item.name }}</text>
				</view>
				<view class="content-item" @click="showQrCodeModal(true)">
					<text class="image cuIcon-add"></text>
					<text class="label">邀请成员</text>
				</view>
			</view>
			<view class="see-all" v-if="loadmoreMemeber !== 'noMore'"><uni-load-more :status="loadmoreMemeber"></uni-load-more></view>
		</view>
		<view class="setting-item group-util" v-if="type === 'group-util'">
			<view class="title">小工具</view>
			<view class="content-list">
				<view class="content-item">
					<view class="image"><text class="cuIcon-file text-yellow"></text></view>
					<text class="label">文件</text>
				</view>
				<view class="content-item">
					<view class="image"><text class="cuIcon-pic text-blue"></text></view>
					<text class="label">图片</text>
				</view>
				<view class="content-item" @click="toPages('food')">
					<view class="image"><text class="cuIcon-similar text-green"></text></view>
					<text class="label">食物信息</text>
				</view>
				<view class="content-item" @click="toPages('sport')">
					<view class="image"><text class="cuIcon-hot text-orange"></text></view>
					<text class="label">运动信息</text>
				</view>
			</view>
		</view>
		<view class="tip" v-if="type === 'group-detail'">圈子信息</view>
		<view class="setting-item cu-list group-util" v-if="type === 'group-detail' || type === 'join-detail'">
			<view class="title cu-item arrow" @click="showQrCodeModal(true)">
				<text>二维码</text>
				<text class="cuIcon-qrcode"></text>
			</view>
		</view>
		<view class="setting-item cu-list group-util" v-if="type === 'group-detail' || type === 'join-detail'">
			<view class="title cu-item arrow">
				<text>公告</text>
				<text class="cuIcon-form"></text>
			</view>
			<view class="content-text">问君西游何时还？畏途巉岩不可攀。但见悲鸟号古木，雄飞雌从绕林间。又闻子规啼夜月，愁空山。蜀道之难，难于上青天，使人听此凋朱颜</view>
		</view>
		<view class="cu-modal" :class="{ show: showQrCode }" @click="showQrCodeModal(false)">
			<view class="cu-dialog radius" @click.stop="">
				<view class="qr-code">
					<view class="qr-code-info">
						<view class="logo"><image :src="groupInfo.icon ? getImagePath(groupInfo.icon) : '../static/chat-active.png'" mode="aspectFit" class="img"></image></view>
						<view class="title">{{ groupInfo.name }}</view>
					</view>
					<uni-qrcode
						cid="qrcodeCanvas"
						class="qr-code-container"
						:text="'https://wx2.100xsys.cn/joinGroup/' + groupInfo.gc_no"
						:size="qrCodeSize"
						foregroundColor="#333"
						makeOnLoad
						@makeComplete="makeComplete"
						v-if="showQrCode && groupInfo.gc_no"
					></uni-qrcode>
					<image :src="groupQrCode" mode="aspectFit" class="qr-code-image" @click="previewImage"></image>
					<view class="action"><button class="cu-btn line-green text-green" open-type="share">分享</button></view>
				</view>
			</view>
		</view>
		<view class="join-button" v-if="type === 'join-detail' && userInfo && userInfo.no"><button class="cu-btn bg-blue button" @click="joinGroup">加入圈子</button></view>
	</view>
</template>

<script>
import UniQrcode from '../components/uni-qrcode/uni-qrcode';
import { mapState } from 'vuex';
export default {
	components: { UniQrcode },
	data() {
		return {
			gc_no: '',
			type: 'group-detail',
			qrCodeSize: uni.upx2px(500),
			groupInfo: {},
			memberList: [],
			loadmoreMemeber: 'more', //more,loading,noMore
			memberPage: {
				total: 0,
				rownumber: 5,
				pageNo: 1
			},
			showQrCode: false,
			groupQrCode: ''
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	methods: {
		async joinGroup() {
			// 加入圈子
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_person_group_circle_add',
					condition: [],
					data: [
						{
							person_no: this.userInfo.no,
							user_no: this.userInfo.userno,
							name: this.userInfo.name,
							profile_url: this.userInfo.profile_url,
							user_image: this.userInfo.user_image,
							gc_no: this.gc_no,
							group_role: '用户'
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showModal({
					title: '提示',
					content: '您已成功加入' + this.groupInfo.name,
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.redirectTo({
								url: '/personalPages/chatGroup/chatGroup'
							});
						}
					}
				});
			}
			// });
		},
		makeComplete(e) {
			this.groupQrCode = e;
		},
		showQrCodeModal(showQrCode) {
			this.showQrCode = showQrCode;
		},
		getProfilePath(e) {
			if (e.profile_url) {
				return this.getImagePath(e.profile_url);
			} else if (e.user_image) {
				return this.getImagePath(e.user_image);
			}
		},
		async selectGroupInfo() {
			// 圈子信息
			let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_group_circle_select',
				colNames: ['*'],
				condition: [{ colName: 'gc_no', ruleType: 'eq', value: this.gc_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.groupInfo = res.data.data[0];
				return res.data.data[0];
			}
		},
		async selectGroupMember() {
			// 圈子成员
			// srvhealth_person_group_circle_select
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_group_circle_select',
				colNames: ['*'],
				condition: [{ colName: 'gc_no', ruleType: 'eq', value: this.gc_no }],
				page: { rownumber: this.memberPage.rownumber, pageNo: this.memberPage.pageNo }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				this.memberList = res.data.data;
				this.memberPage.total = res.data.page.total;
				this.memberPage.pageNo = res.data.page.pageNo;
				this.memberPage.rownumber = res.data.page.rownumber;
				if (this.memberPage.total && this.memberPage.total > this.memberPage.rownumber) {
					this.loadmoreMemeber = 'more';
				} else {
					this.loadmoreMemeber = 'noMore';
				}
				return res.data.data;
			}
		},
		toPages(type) {
			let url = '';
			switch (type) {
				case 'sport':
					url = '/archivesPages/SportItemList/SportItemList';
					break;
				case 'food':
					let detail = {
						type: 'food',
						serviceName: 'srvhealth_diet_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: { title: 'name', unit: 'unit', energy: 'unit_energy' },
						pagetType: 'detail'
					};
					url = `/otherPages/dietSelect/dietSelect?condType=${encodeURIComponent(JSON.stringify(detail))}`;
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		previewImage() {
			uni.previewImage({
				urls: [this.groupQrCode],
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		}
	},
	onPullDownRefresh() {
		this.selectGroupInfo();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	async onLoad(option) {
		this.checkOptionParams(option);
		this.toAddPage();
		if (!this.userInfo || !this.userInfo.no) {
			const result = await wx.login();
			let userInfo = uni.getStorageSync('current_user_info');
			if (result.code) {
				await this.wxLogin({
					code: result.code
				});
				await this.selectBasicUserList();
			}
		}
		if (option.gc_no && option.type) {
			this.gc_no = option.gc_no;
			this.type = option.type;
			this.selectGroupInfo();
			if (this.type === 'group-member') {
				this.selectGroupMember();
			}
		}
		if (option.q) {
			let text = decodeURIComponent(option.q);
			if (text.indexOf('https://wx2.100xsys.cn/joinGroup/') !== -1) {
				let result = text.split('https://wx2.100xsys.cn/joinGroup/')[1];
				this.gc_no = result;
				this.type = 'join-detail';
				this.selectGroupInfo();
			}
		}
	},
	onShareAppMessage(res) {
		let path = `/personalPages/gropDetail/gropDetail?gc_no=${this.groupInfo.gc_no}&type=join-detail&from=share&invite_user_no=${this.userInfo.userno}`
		this.saveSharerInfo(this.userInfo,path)
		return {
			title: `${this.userInfo.name}邀请你加入${this.groupInfo.name}`,
			path: path
		};
	}
};
</script>

<style lang="scss" scoped>
.basic-info {
	padding: 20rpx;
	display: flex;
	background-color: #fff;
	.logo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
	}
	.content {
		.name {
			font-size: 28rpx;
			font-weight: bold;
		}
		.introduce {
			color: #999;
		}
	}
}
.setting-item {
	padding: 20rpx;
	margin: 20rpx 0;
	background-color: #fff;
	.content-text {
		color: #888;
		padding: 10rpx 0;
		font-size: 28rpx;
	}
	.title {
		font-weight: bold;
		font-size: 32rpx;
		display: flex;
		justify-content: space-between;
	}
	.content-list {
		display: flex;
		padding: 20rpx 0;
		flex-wrap: wrap;
		.content-item {
			padding: 0 10rpx;
			width: 20%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 80rpx;
				&.cuIcon-add {
					// background-color: #f1f1f1;
					font-size: 60rpx;
					border: 1rpx dashed #f1f1f1;
				}
			}
			.label {
				height: 50rpx;
				line-height: 50rpx;
				padding-top: 10rpx;
				font-size: 24rpx;
			}
		}
	}
}
.tip {
	padding: 20rpx 20rpx 0;
	font-size: 24rpx;
	color: #999;
}
.qr-code {
	position: relative;
	padding-top: 80rpx;
	.action {
		padding: 20rpx;
	}
	.qr-code-info {
		.logo {
			width: 150rpx;
			height: 150rpx;
			position: absolute;
			top: -75rpx;
			left: calc(50% - 75rpx);
			background-color: #f8f8f8;
			border-radius: 50%;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.img {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.title {
			font-size: 38rpx;
			font-weight: bold;
			margin: 10rpx 0;
		}
	}
	.qr-code-container {
		padding: 20rpx;
		display: flex;
		justify-content: center;
		position: fixed;
		top: -9999px;
	}
	.qr-code-image {
		width: 500rpx;
		height: 500rpx;
	}
}
/deep/.cu-dialog {
	overflow: initial;
}
.join-button {
	height: 300rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	.button {
		width: 50%;
	}
}
</style>
