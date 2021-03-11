<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
		<view class="hospital-wrap">
			<view class="hospital-top">
				<view class="left">
					<view class="top">
						<view class="name">{{ storeInfo.name }}</view>
					</view>
					<view class="bottom">
						<view class="address" @click="getCurrentLocation">
							<text class="detail">{{ storeInfo.address || '' }}</text>
							<text class="cuIcon-locationfill text-blue margin-left-xs"></text>
						</view>
					</view>
				</view>
				<view class="right">
					<!-- <text class="cuIcon-phone" @click="makePhoneCall"></text> -->
					<image :src="topBgImg" mode="aspectFit"></image>
				</view>
			</view>
			<view class="introduction news">
				<view class="title">
					<text class="cuIcon-titles text-blue"></text>
					<text class="">通知公告</text>
				</view>
				<view class="content news-list">
					<view class="news-item">
						<text class="cuIcon-mail text-orange margin-right-xs"></text>
						<text class="title-text">关于启动2021年3月进修人员招收的通知</text>
						<text class="date">2021-01-20</text>
					</view>
					<view class="news-item">
						<text class="cuIcon-mail text-orange margin-right-xs"></text>
						<text class="title-text">国家药监局核查中心对我院药物临床试验数据现场核查工作顺利结束</text>
						<text class="date">2021-01-19</text>
					</view>
				</view>
			</view>
			<view class="introduction">
				<view class="title">
					<text class="cuIcon-titles text-blue"></text>
					<text class="">出诊表</text>
				</view>
				<view class="content">
					<view class="professor-box">
						<view class="professor-item" v-for="item in professorList" :key="item.docCode">
							<image class="img" src="../static/img/doctor_default.png" mode="aspectFit"></image>
							<view class="doc-info">
								<view class="top">
									<text class="doc-name">{{ item.docName }}</text>
									<view class="titleDn">{{ item.titleDn }}</view>
								</view>
								<view class="center">
									<view class="depart-name">科室：{{ item.deptName }}</view>
								</view>
								<view class="bottom">擅长：{{ item.special }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="introduction">
				<view class="title">
					<text class="cuIcon-titles text-blue"></text>
					<text class="">关联圈子</text>
				</view>
				<view class="content grid-layout">
					<view class="group-item" v-for="item in 4">
						<view class="icon"><image src="../static/img/doctor_default.png" mode="aspectFit" class="image"></image></view>
						<view class="content">
							<view class="top"><view class="name">xx圈</view></view>
						</view>
					</view>
				</view>
			</view>
			<view class="introduction news">
				<view class="title">
					<text class="cuIcon-titles text-blue"></text>
					<text class="">医院新闻</text>
				</view>
				<view class="content news-list">
					<view class="news-item">
						<text class="cuIcon-title"></text>
						<text class="title-text">关于维护良好就医秩序对广大患者的告知书</text>
						<text class="date">2021-01-20</text>
					</view>
					<view class="news-item">
						<text class="cuIcon-title"></text>
						<text class="title-text">国家药监局核查中心对我院药物临床试验数据现场核查工作顺利结束</text>
						<text class="date">2021-01-19</text>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
import hospitalData from '../static/data/hospital1.js';
export default {
	data() {
		return {
			store_no: '',
			storeInfo: {},
			hospitalData: {},
			hospitalInfo: {
				name: '西安交通大学第一附属医院',
				tag: ['三甲'],
				posititon: {
					address: '', //详细地址
					longitude: '', //经度
					latitude: '' // 纬度
				}
			}
		};
	},
	computed: {
		topBgImg() {
			if (this.storeInfo && this.storeInfo.image) {
				return this.getImagePath(this.storeInfo.image);
			}
		},
		departmentList() {
			if (this.hospitalData && this.hospitalData.departmentList) {
				let arr = this.deepClone(this.hospitalData.departmentList);
				if (Array.isArray(this.hospitalData.departmentList) && this.hospitalData.departmentList.length > 9) {
					arr = arr.splice(0, 9);
				}
				return arr;
			}
		},
		professorList() {
			if (this.hospitalData && this.hospitalData.professorList) {
				let arr = this.deepClone(this.hospitalData.professorList);
				if (Array.isArray(this.hospitalData.professorList) && this.hospitalData.professorList.length > 3) {
					arr = arr.splice(0, 3);
				}
				return arr;
			}
		}
	},
	methods: {
		async getStoreInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'like', value: this.store_no }],
				page: { pageNo: 1, rownumber: 5 },
				query_source: 'list_page'
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.storeInfo = res.data.data[0];
				uni.setNavigationBarTitle({
					title: this.storeInfo.name
				});
			}
		},
		toPages(type) {},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.hospitalData.tel //仅为示例
			});
		},
		getCurrentLocation() {
			let latitude = 34.219329;
			let longitude = 108.935485;
			uni.openLocation({
				latitude: latitude,
				longitude: longitude,
				name: this.hospitalData.name,
				address: this.hospitalData.provinceName + this.hospitalData.address,
				success: function() {
					console.log('success');
				}
			});
		}
	},
	onLoad(option) {
		if (option.store_no) {
			this.store_no = option.store_no;
			this.getStoreInfo();
		}
		this.hospitalData = hospitalData;
	}
};
</script>

<style scoped lang="scss">
.hospital-wrap {
	border-top: 1rpx solid #f1f1f1;
	background-color: #f9f9f9;
	.hospital-top {
		// border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx 28rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		margin: 0rpx 10rpx 20rpx;
		margin-top: 40px;
		position: relative;
		.left {
			display: flex;
			flex-direction: column;
			flex: 1;
			position: relative;
			&::after {
				position: absolute;
				right: 0;
				top: 10%;
				height: 80%;
				content: '';
				width: 1px;
				background-color: #dfdada;
			}
			.top {
				display: flex;
				.name {
					font-size: 32rpx;
					font-weight: 800;
					color: #333;
				}
				.tags {
					display: flex;
					.tag {
						display: inline-block;
						margin-left: 10rpx;
						padding: 5rpx 10rpx;
						background-color: #0ea8ff;
						color: #fff;
						border-radius: 10rpx;
					}
				}
			}
			.bottom {
				padding-top: 10rpx;
				.address {
					color: #bbb;
					display: flex;
					.cuIcon-locationfill {
						width: 80rpx;
						display: flex;
						align-items: flex-start;
						justify-content: center;
					}
					.detail {
						width: 90%;
						overflow: scroll;
					}
				}
			}
		}
		.right {
			margin-left: 20rpx;
			width: 100rpx;
			height: 100rpx;
			font-size: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #0ea8ff;
			border-radius: 10rpx;
			overflow: hidden;
			position: absolute;
			right: 20px;
			top: -50rpx;
			border: 4rpx solid #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			// transform: rotate(10deg);
		}
	}
	.introduction {
		// 简介
		background-color: #fff;
		padding: 20rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
		&.news .title {
			border-bottom: 1rpx solid #ccc;
		}
		.news-list {
			.news-item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1rpx dotted #f1f1f1;
				align-items: center;

				.title-text {
					width: 70%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.date {
					flex: 1;
					text-align: right;
					color: #ccc;
				}
			}
		}
		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
		}
		.content {
			.rich-text {
				height: 300rpx;
				overflow: scroll;
			}
			&.grid-layout {
				display: flex;
				.group-item {
					width: 25%;
					display: flex;
					padding: 20rpx 10rpx;
					flex-direction: column;
					align-items: center;
					// background-color: #f1f1f1;
					border-radius: 20rpx;
					& + .group-item {
						border-top: none;
					}
					.icon {
						border-radius: 10rpx;
						position: relative;
						width: 100rpx;
						height: 100rpx;
						display: flex;
						.image {
							border-radius: 50rpx;
							width: 100%;
							height: 100%;
						}
					}
					.top {
						.name {
							margin-top: 10rpx;
							font-weight: bold;
							font-size: 28rpx;
							letter-spacing: 0;
						}
					}
				}
			}
			.professor-box {
				display: flex;
				flex-direction: column;
				.professor-item {
					padding: 10rpx 0;
					margin: 10rpx;
					display: flex;
					align-items: center;
					.img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 10rpx;
						margin-right: 20rpx;
					}
					.doc-info {
						display: flex;
						flex-direction: column;
						flex: 1;
						.top {
							display: flex;
							.doc-name {
								font-size: 34rpx;
								letter-spacing: 5rpx;
							}
							.titleDn {
								font-size: 28rpx;
								margin-left: 30rpx;
								display: flex;
								align-items: flex-end;
								color: #999;
							}
						}
						.center {
							.depart-name {
								font-size: 26rpx;
								color: #5e5e5e;
								padding: 2px 0;
							}
						}
						.bottom {
							overflow: hidden;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #afafaf;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
}
</style>
