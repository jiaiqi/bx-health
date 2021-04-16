<template>
	<view class="doctor-intro">
		<view class="top-intro">
			<view class="person-info">
				<view class="person-name">
					张xx
				</view>
				<view class="sub-title">
					<view class="sub-title-item">
						主任医师
					</view>
					<view class="sub-title-item">
						门诊呼吸科
					</view>
					<view class="wrap-width sub-title-item">
						xxxxxxx医院
					</view>
				</view>
			</view>
			<image src="../static/img/ym.jpg" mode="aspectFill" class="person-image"></image>
		</view>
		<view class="main-intro" :class="{'show-wrap':showIntroWrap}">
			<view class="intro-item" :class="{'show-wrap':showIntroWrap}">
				<text class="label">擅长：</text>
				<text>
					从事各种不孕症的诊断及治疗七年。在国内外发表论文多篇。从事各种不孕症的诊断及治疗七年。在国内外发表论文多篇。
				</text>
			</view>
			<view class="intro-item" :class="{'show-wrap':showIntroWrap}">
				<text class="label">简介：</text>
				<text>
					张xx，女，主治医师，医学硕士，2008年开始从事生殖医学临床工作至今。擅长多囊卵巢综合症、盆腔炎症后遗症、复发性自然流产等不孕不育的诊断及治疗。曾参与国家自然科学基金项目，发表论文数篇。
				</text>
			</view>
			<view class="show-more text-cyan" @click="showIntroWrap=!showIntroWrap">
				<text class="text-cyan" v-if="!showIntroWrap">详细介绍</text>
				<text class="text-cyan" v-if="showIntroWrap">收起</text>
				<text class="cuIcon-unfold margin-left-xs" :class="{'show-wrap':showIntroWrap}"></text>
			</view>
		</view>
		<view class="other-intro">
			<view class="intro-label">
				<text>业务办理</text>
				<!-- 		<text class="to-more">
					<text>更多</text>
					<text class="cuIcon-right"></text>
				</text> -->
			</view>
			<view class="serve-list">
				<view class="serve-item">
					<image src="../static/img/yygh.png" mode="" class="serve-image"></image>
					<view class="serve-label">
						预约挂号
					</view>
					<view class="serve-label-tip">
						130人预约
					</view>
				</view>
				<view class="serve-item">
					<image src="../static/img/zxwz.png" mode="" class="serve-image"></image>
					<view class="serve-label">
						在线问诊
					</view>
					<view class="serve-label-tip">
						2410人问诊过
					</view>
				</view>
			</view>
		</view>
		<view class="other-intro">
			<view class="intro-label">
				<text>
					<text>用户评价</text>
					<text>（341）</text>
				</text>
				<text class="to-more">
					<text>查看全部</text>
					<text class="cuIcon-right"></text>
				</text>
			</view>
			<view class="intro-evaluate">
				<view class="evaluate-tags">
					<text class="cu-tag evaluate-tag bg-cyan light round text-black">支气管炎</text>
					<text class="cu-tag evaluate-tag bg-cyan light round text-black">肺结核</text>
					<text class="cu-tag evaluate-tag bg-cyan light round text-black">过敏性咳嗽</text>
				</view>
				<view class="evaluate-list">
					<view class="evaluate-item">
						<view class="customer-infos">
							<image src="../static/img/1.png" mode="" class="customer-image"></image>
							<view class="customer-info">
								<view class="customer-name">
									路人甲
								</view>
								<view class="evaluate-score">
									<text class="evaluate-date">2021.04.07</text>
									<text class="margin-right-xs">挂号</text>
									<text class="margin-right-xs">慢性咽炎</text>
									<text class="score">
										<text class="cuIcon-favorfill text-yellow"></text><text
											class="cuIcon-favorfill text-yellow"></text><text
											class="cuIcon-favorfill text-yellow"></text>
										<text class="cuIcon-favorfill text-yellow"></text><text
											class="cuIcon-favorfill"></text>
									</text>
								</view>
							</view>
						</view>
						<view class="evaluate-content">
							今天心情很不好，各种糟心事，眼圈也一直红红的！但见到张大夫，她很细心地跟我分析了我的情况，还鼓励我不要太灰心。有时候医生说的暖心话真的也是一副良药，能把人的心情治愈好，感谢
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="other-intro">
			<view class="intro-label">
				<text>咨询历史</text>
				<text class="to-more">
					<text>更多</text>
					<text class="cuIcon-right"></text>
				</text>
			</view>
			<view class="consult-list">
				<view class="consult-item">
					<view class="consult-top">
						<view class="disease-name">
							肺结核
						</view>
						<view class="customer-name">
							刘**
						</view>
					</view>
					<view class="consult-content">
						今天心情很不好，各种糟心事，眼圈也一直红红的！但见到张大夫，她很细心地跟我分析了我的情况，还鼓励我不要太灰心。有时候医生说的暖心话真的也是一副良药，能把人的心情治愈好，感谢
					</view>
					<view class="consult-reply">
						<view class="content">
							<text class="text-gray margin-right-xs">[医生回复]</text>
							<text>根据B超和验血结果，你最近有就不用来了。没有就过来吧 </text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		data() {
			return {
				showIntroWrap: false
			}
		},
		methods: {
			async selectStoreInfo(times = 0) {
				let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}],
					page: {
						pageNo: 1,
						rownumber: 1
					},
				};
				let res = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health')
				if (Array.isArray(res.data) && res.data.length > 0) {
					this.storeInfo = res.data[0];
					uni.setNavigationBarTitle({
						title: this.storeInfo.name
					});
				} else {
					if (res && res.code === '0011') {
						await this.toAddPage()
						times++
						if (times < 3) {
							this.selectStoreInfo(times)
						}
					} else {
						uni.showModal({
							title: '未查找到机构信息',
							content: `${res?JSON.stringify(res):''}  storeNo为${this.storeNo}`,
							showCancel: false
						})
					}
				}
			},
		},
		onPageScroll: function(e) { //nvue暂不支持滚动监听，可用bindingx代替
			if (e.scrollTop > 50 && e.scrollTop < 80) {
				uni.setNavigationBarTitle({
					title: '张XX'
				})
			} else if (e.scrollTop > 20 && e.scrollTop <= 50) {
				uni.setNavigationBarTitle({
					title: ''
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.doctor-intro {
		.top-intro {
			padding: 40rpx;
			display: flex;
			background-color: #eef1f5;

			.person-info {
				flex: 1;

				.person-name {
					font-weight: bold;
					font-size: 20px;
					margin-bottom: 20rpx;
				}

				.sub-title {
					color: #666;
					display: flex;
					flex-wrap: wrap;

					.sub-title-item {
						margin-right: 20px;
						padding: 5rpx 0;
					}

					.wrap-width {
						width: 100%;
						line-height: 1.2;
					}
				}
			}

			.person-image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 100rpx;
			}
		}

		.main-intro {
			padding: 40rpx;
			transition: all .5s ease;

			.intro-item {
				color: #666;
				line-height: 1.5;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				/**指定行数*/
				-webkit-box-orient: vertical;
				overflow: hidden;
				margin-bottom: 10rpx;

				&.show-wrap {
					display: block;
					overflow: auto;
				}

				.label {
					font-weight: bold;
					color: #000;
				}

			}

			.show-more {
				text-align: center;

				text {
					display: inline-block;
					transition: all .2s ease;
				}

				.show-wrap {
					transform: rotate(180deg);
				}
			}
		}

		.other-intro {
			padding: 40rpx;

			.intro-label {
				font-weight: bold;
				font-size: 20px;
				color: #333;
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;

				.to-more {
					font-weight: normal;
					font-size: 16px;
					color: #666;
				}
			}

			.consult-list {
				display: flex;

				.consult-item {
					width: 100%;
					background-color: #F5F7FB;
					border-radius: 20rpx;
					overflow: hidden;
					border: 1px solid #f1f1f1;

					.consult-top {
						display: flex;
						align-items: center;
						padding: 10rpx 20rpx;

						.disease-name {
							font-size: 18px;
						}

						.customer-name {
							padding: 20rpx;
						}
					}

					.consult-content {
						padding: 0 20rpx;
						word-break: break-all;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						/**指定行数*/
						-webkit-box-orient: vertical;
						overflow: hidden;
						color: #888;
					}

					.consult-reply {
						margin-top: 30rpx;
						font-weight: bold;
						background-color: #E4F2FF;
						padding: 30rpx 20rpx;
						position: relative;

						.content {
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}

						&::before {
							content: '';
							width: 0px;
							height: 0;
							border: 10px solid transparent;
							border-bottom-color: #e4f2ff;
							position: absolute;
							top: -38rpx;
							right: 150rpx;
						}
					}
				}
			}

			.intro-evaluate {
				.evaluate-tags {
					padding: 20rpx 0;

					.evaluate-tag {
						color: #000;
					}
				}

				.evaluate-list {
					padding: 10rpx 0;

					.evaluate-item {
						.customer-infos {
							display: flex;
						}

						.evaluate-content {
							margin-left: 100rpx;
							margin-top: 10rpx;
							word-break: break-all;
							display: -webkit-box;
							-webkit-line-clamp: 3;
							/**指定行数*/
							-webkit-box-orient: vertical;
							overflow: hidden;
						}
					}

					.customer-image {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
					}

					.customer-name {
						font-weight: bold;
					}

					.evaluate-score {
						color: #666;

						.evaluate-date {
							margin-right: 20rpx;
						}
					}
				}

			}

			.serve-list {
				display: flex;
				flex-wrap: wrap;
				.serve-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					border-radius: 10rpx;
					padding: 20rpx;
					margin-left: 20rpx;
					border: 1rpx solid #f1f1f1;
					box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
					// flex: 1;
					width: calc(33% - 40rpx/3);
					&:nth-child(3n+1){
						margin-left: 0;
					}
					.serve-image {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 20rpx;
					}

					.serve-label {
						font-weight: bold;
						font-size: 18px;
					}

					.serve-label-tip {
						margin-top: 10rpx;
						color: #888;
						font-size: 14px;
					}
				}
			}
		}
	}
</style>
