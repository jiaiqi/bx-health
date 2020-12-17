<template>
	<view class="cascader-content">
		<view class="tag-line">
			<view class="bx-tagbox">
				<view v-if="showSelect">
					<view class="bx-item" @click="selectArea(item)" v-for="(item, index) in areaList" :key="index">
						{{ item.name ? item.name : showCol ? item[showCol] : '' }}
					</view>
					<view class="bx-item more" @click="showMore" v-if="isShowMore"><view class="content">更多</view></view>
				</view>
			</view>
			<view class="bx-tagline">
				<view
					@click="lineClick(item, index)"
					class="bx-item bx-text-blue"
					v-for="(item, index) in lineDataDefault"
					:key="index"
					:class="{
						'line-end': lineDataDefault.length - 1 === index && !showSelect
					}"
				>
					<view class="content tag-item">{{ item.name ? item.name : showCol ? item[showCol] : '' }}</view>
				</view>
				<view class="bx-item bx-text-yellow line-end" v-if="showSelect || (lineData.length === 0 && areaList.length > 0)">请选择</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'cascader', //层叠选择器内层，ui渲染
	data() {
		return {
			lineData: [],
			area: {},
			breadCrumbs: ''
		};
	},
	methods: {
		showMore() {
			this.$emit('show-more');
		},
		selectArea(item) {
			console.log(item);
			this.$emit('tag-click', item);
			this.lineData.push(item);
		},
		lineClick(item, index) {
			this.$emit('line-click', item, index);
		}
	},
	created() {},
	watch: {
		lineDataDefault: {
			deep: true,
			handler: function(newV, oldV) {
				console.log('lineDataDefaultwatch中：', newV);
				this.lineData = newV;
			}
		},
		areaList: {
			deep: true,
			handler: function(newV, oldV) {
				this.areaList = newV;
				this.lineData = this.lineDataDefault;
			}
		}
	},
	mounted() {
		this.lineData = this.lineDataDefault;
	},
	props: {
		// 是否显示‘请选择’提示
		showSelect: {
			type: Boolean,
			default: true
		},
		// 最顶层的line的文字
		topVal: {
			type: String,
			default: ''
		},
		column: {
			//要提交的字段
			type: String,
			default: ''
		},
		showCol: {
			//要显示的字段
			type: String,
			default: ''
		},
		areaList: {
			//区域数据
			type: Array,
			default: () => {
				[];
			}
		},
		// line数据的默认值
		lineDataDefault: {
			type: Array,
			default: () => {
				[];
			}
		},
		isShowMore: {
			type: Boolean,
			default: false
		},
		lineColor: {
			type: String,
			default: 'yellow'
		},
		tagColor: {
			type: String,
			default: 'yellow'
		},
		tagBackground: {
			type: String,
			default: 'yellow'
		}
	}
};
</script>

<style lang="scss">
.cascader-content {
	overflow: scroll;
	flex: 1;
	display: flex;
	height: calc(90vh - 200rpx);
}
.tag-line {
	display: flex;
	flex-direction: column;
	width: 100%;
	.bx-tagline {
		// padding-top: 20upx;
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx;
		padding: 10rpx 40rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.bx-item {
			// padding-left: 100upx;
			height: 80upx;
			line-height: 80rpx;
			position: relative;
			display: flex;
			&::after {
				content: '';
				height: 20rpx;
				width: 4rpx;
				background-color: #007aff;
				transform: rotate(20deg);
				// width: 100rpx;
				margin: 30rpx 20rpx;
			}
			// &::before {
			// 	content: '⚪';
			// 	display: block;
			// 	position: absolute;
			// 	font-size: 20upx;
			// 	top: 0px;
			// 	z-index: 9;
			// 	background-color: #ffffff;
			// 	width: 25px;
			// 	height: 25px;
			// 	text-align: center;
			// 	border: none;
			// 	line-height: 25px;
			// 	left: 18px;
			// 	transform: scale(0.5);
			// }
			// &::after {
			// 	content: '';
			// 	display: block;
			// 	position: absolute;
			// 	width: 0.5px;
			// 	background-color: #ddd;
			// 	left: 30px;
			// 	height: 80upx;
			// 	top: 0;
			// 	z-index: 8;
			// }

			.tag-item {
				text-align: left;
				font-size: 32rpx;
			}
			.content {
				min-width: 30%;
				top: 36rpx;
				border-radius: 20rpx;
				overflow: hidden;
			}
			.delete-button {
				font-size: 40upx;
			}
		}
		.placeholder {
			width: 100%;
		}
		.line-end {
			&::after {
				content: '';
				display: block;
				position: absolute;
				width: 0.5px;
				background-color: #ddd;
				left: 30px;
				height: 0upx;
				top: 0;
				z-index: 8;
			}
		}
	}
	.bx-tagbox {
		margin: 20rpx;
		padding: 20rpx;
		// height: 700rpx;
		text-align: left;
		flex: 1;
		overflow: scroll;
		// box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.bx-item {
			min-width: 100upx;
			// height: 40upx;
			display: inline-block;
			margin-right: 20upx;
			margin-bottom: 10upx;
			// background-color: #f1f1f1;
			border: 1rpx solid #F1F1F1;
			border-radius: 50rpx;
			padding: 6rpx 25rpx;
			text-align: center;
			&:active {
				transition: all 0.5s ease-in-out;
				transform: scale(1.1);
			}
			&.more {
				// background-color: #f0ad4e;
				// border-color:#f0ad4e ;
				border: none;
				color: #f0ad4e;
				// text-decoration: underline;
				position: relative;
				&::after{
					content: '';
					width: 60rpx;
					height: 4rpx;
					position: absolute;
					left:calc(50% - 30rpx);
					bottom: 0;
					background-color: #f0ad4e;
				}
			}
		}
	}

	/**文字颜色*/
	.bx-text-white {
		color: #fff; //明黄
	}
	.bx-text-yellow {
		color: #fbbd08; //明黄
	}
	.bx-text-red {
		color: #e54d42; //嫣红
	}
	.bx-text-orange {
		color: #f37b1d; //桔橙
	}
	.bx-text-green {
		color: #39b54a; //森绿
	}
	.bx-text-cyan {
		color: #1cbbb4; //天青
	}
	.bx-text-blue {
		color: #0081ff; //海蓝
	}
	.bx-text-black {
		color: #333333; //墨黑
	}
	/**背景色*/
	.bx-bg-yellow {
		background-color: #fbbd08; //明黄
	}
	.bx-bg-red {
		background-color: #e54d42; //嫣红
	}
	.bx-bg-orange {
		background-color: #f37b1d; //桔橙
	}
	.bx-bg-green {
		background-color: #39b54a; //森绿
	}
	.bx-bg-cyan {
		background-color: #1cbbb4; //天青
	}
	.bx-bg-blue {
		background-color: #0081ff; //海蓝
	}
	.bx-bg-black {
		background-color: #333333; //墨黑
	}
	/**边框色*/
	.bx-border-yellow {
		border: 1px solid #fbbd08; //明黄
	}
	.bx-border-red {
		border: 1px solid #e54d42; //嫣红
	}
	.bx-border-orange {
		border: 1px solid #f37b1d; //桔橙
	}
	.bx-border-green {
		border: 1px solid #39b54a; //森绿
	}
	.bx-border-cyan {
		border: 1px solid #1cbbb4; //天青
	}
	.bx-border-blue {
		border: 1px solid #0081ff; //海蓝
	}
	.bx-border-black {
		border: 1px solid #333333; //墨黑
	}
}
</style>
