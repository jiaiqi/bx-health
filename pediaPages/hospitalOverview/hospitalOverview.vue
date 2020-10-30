<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view>
		<view class="header-wrap">
			<view class="hospital-top">
				<view class="left">
					<view class="top">
						<view class="name">{{ hospitalData.name }}</view>
						<view class="tags">
							<text class="tag" v-for="item in hospitalInfo.tag" :key="item">{{ item }}</text>
						</view>
					</view>
					<view class="bottom">
						<view class="address" @click="getCurrentLocation">
							<text>{{ hospitalData.provinceName + hospitalData.address }}</text>
							<text class="cuIcon-locationfill text-blue margin-left-xs"></text>
						</view>
					</view>
				</view>
				<view class="right"><u-icon name="phone" @click="makePhoneCall"></u-icon></view>
			</view>
			<view class="introduction">
				<view class="title">医院简介</view>
				<view class="content">
					<u-read-more close-text="查看详细介绍" :toggle="true" show-height="400"><rich-text :nodes="hospitalData.introduction"></rich-text></u-read-more>
				</view>
			</view>
			<view class="introduction">
				<view class="title"><u-section title="科室列表" sub-title="查看更多" @click="toPages('department')"></u-section></view>
				<view class="content">
					<!-- <u-read-more close-text="查看所有科室" :toggle="true" show-height="400"> -->
					<view class="depart-box">
						<text class="depart-item" v-for="item in departmentList" :key="item.deptCode">{{ item.deptName }}</text>
					</view>
					<!-- </u-read-more> -->
				</view>
			</view>
			<view class="introduction">
				<view class="title"><u-section title="专家团队" sub-title="查看更多" @click="toPages('professor')"></u-section></view>
				<view class="content">
					<view class="professor-box">
						<view class="professor-item" v-for="item in professorList" :key="item.docCode">
							<image class="img" src="../static/img/doctor_default.jpg" mode="aspectFit"></image>
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
			<!-- <u-image width="500rpx" height="500rpx" src="/pediaPages/static/img/mp-code.png" mode="aspectFit"></u-image> -->
		</view>
	</view>
</template>

<script>
import hospitalData from '../static/data/hospital1.js';
export default {
	data() {
		return {
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
		toPages(type){
			
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.hospitalData.tel //仅为示例
			});
		},
		getCurrentLocation() {
			// longitude=108.935485&latitude=34.219329
			let latitude = 34.219329;
			// let latitude = this.hospitalData.pointX;
			let longitude = 108.935485;
			// let longitude = this.hospitalData.pointY;
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
	onLoad() {
		this.hospitalData = hospitalData;
	}
};
</script>

<style scoped lang="scss">
.header-wrap {
	height: 500rpx;
	background-image: url('data:image/png;base64,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');
	background-size: contain;
	background-position: top center;
	background-repeat: no-repeat;
	padding: 300rpx 0rpx 0;
	.hospital-top {
		border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx 28rpx;
		box-shadow: 0 3px 3px rgba(5, 34, 75, 0.18);
		display: flex;
		margin: 0 20rpx 20rpx;
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
				}
			}
		}
		.right {
			margin-left: 20rpx;
			width: 100rpx;
			font-size: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #0ea8ff;
			// transform: rotate(10deg);
		}
	}
	.introduction {
		// 简介
		background-color: #fff;
		padding: 20rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
		}
		.content {
			.depart-box {
				width: 100%;
				text-align: left;
				.depart-item {
					text-indent: 0;
					display: inline-block;
					padding: 10rpx 20rpx;
					background-color: #0081ff;
					color: #fff;
					margin: 10rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
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
							// max-height: 100rpx;
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
