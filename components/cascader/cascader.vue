<template>
	<view>
		<view class="tag-line">
			<view class="bx-tagline">
				<!-- <view @click="lineClick()" class="bx-item bx-text-blue">
					<view class="content tag-item">{{ topVal ? topVal : '中国' }}</view>
				</view> -->
				<view
					@click="lineClick(item, index)"
					class="bx-item text-blue"
					v-for="(item, index) in lineDataDefault"
					:key="index"
					:class="{
						'line-end': lineDataDefault.length - 1 === index && !showSelect
					}"
				>
					<view class="content tag-item">{{ item.name ? item.name : showCol ? item[showCol] : '' }}</view>
				</view>
				<view class="bx-item text-yellow line-end" v-if="showSelect || (lineData.length === 0 && areaList.length > 0)">请选择</view>
			</view>
			<view class="bx-tagbox-list"  v-if="oldeItemList.length>0">
				<view class="bx-tagbox" v-for="oldeItem in oldeItemList" :key='oldeItem.no'>
					<view class="bx-item" @click="selectArea(item)" v-for="(item, index) in oldeItem.data" :key="index">
						<view class="content">{{ item.name ? item.name : showCol ? item[showCol] : '' }}</view>
					</view>
					<view class="bx-item text-white bg-yellow radius" @click="showMore" v-if="isShowMore"><view class="content">更多</view></view>
				</view>
			</view>
			
			<view class="bx-tagbox" v-if="showSelect">
				<view class="bx-item" @click="selectArea(item)" v-for="(item, index) in areaList" :key="index">
					<view class="content">{{ item.name ? item.name : showCol ? item[showCol] : '' }}</view>
				</view>
				<view class="bx-item text-white bg-yellow radius" @click="showMore" v-if="isShowMore"><view class="content">更多</view></view>
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
				// console.log('areaListwatch中：', newV, thi.lineData);
			}
		}
	},
	mounted() {
		// console.log('lineDataDefault', this.lineDataDefault);
		// if (this.lineDataDefault && lineDataDefault.length > 0) {
		this.lineData = this.lineDataDefault;
		// }
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
			default: '中国'
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
		oldeItemList: {
			// 上层数据
			type: Array,
			default: () => []
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
.tag-line {
	.bx-tagline {
		display: flex;
		padding: 20rpx 40rpx;
		min-height: 120rpx;
		flex-wrap: wrap;
		margin: 10px 10px;
		padding: 5px 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.bx-item {
			position: relative;
			display: inline-flex;
			align-items: center;
			& + .bx-item {
				&::before {
					content: '';
					display: inline-block;
					width: 5px;
					height: 5px;
					border-top: 2px solid #656565;
					border-right: 2px solid #656565;
					transform: rotate(45deg);
					border-color: #007aff;
					margin: 16px 10px;
				}
			}
			.content {
				min-width: 30%;
				height: 50rpx;
				line-height: 50rpx;
				top: 36rpx;
				// font-size: 36rpx;
				font-size: 16px;
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
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		margin: 10px;
		padding: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		border-radius: 15px;
		.bx-item {
			min-width: 100rpx;
			padding: 10rpx 20rpx;
			border-radius: 50rpx;
			border: 1px solid #f1f1f1;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			& + .bx-item {
				// margin-left: 20rpx;
			}
		}
		.radius {
			border-radius: 10upx;
		}
	}
}
</style>
