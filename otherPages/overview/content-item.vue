<template>
	<view class="content">
		<view class="title">
			<text class="title-text">{{ content.title }}</text>
			<view class="add">
				<button class="cu-btn " @click="addItem(content)" v-for="(btn, btnIndex) in content.headButton" :key="btnIndex">{{ btn.label }}</button>
			</view>
		</view>
		<view
			class="content-item"
			:class="{
				'bg-red': item.result && item.result.scope < 5,
				'bg-yellow': item.result && item.result.scope >= 5 && item.result.scope <= 8,
				'bg-green': item.result && item.result.scope > 8
			}"
			v-for="(item, itemIndex) in content.list"
			:key="itemIndex"
			@click="toRelationPage(content, item)"
		>
			<view class="item" v-if="item">{{ item.label }}</view>
			<view class="item remark" v-if="item && item.result && item.result.remark">{{ item.result.remark }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			contentData: null
		};
	},
	props: {
		content: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		setReason(data) {
			let self = this;
			let list = [];
			let isAssign = false;
			if (self.content.list && Array.isArray(self.content.list) && self.content.list.length > 0) {
				self.content.list.forEach((item, index) => {
					if (item.label === data.from) {
						isAssign = true;
						item = Object.assign(item, data);
						self.$set(self.content.list, index, item);
					}
					list.push(item);
				});
			}

			// if(isAssign){
			// this.$emit('listChange', list);
			// }
		},
		addItem(content) {
			console.log(content);
			if (content.title === '病症') {
				uni.navigateTo({
					url: '/pages/specific/symptomSelect/symptomSelect'
				});
			}
		},
		toRelationPage(e, item) {
			console.log(e);
			if (e.title === '疾病') {
				uni.navigateTo({
					url: '/pages/relation/relation'
				});
			} else if ((e.title = '病因')) {
				console.log(item);
				if (item.label === '饮食') {
					uni.navigateTo({
						url: '/pages/specific/questionnaire/questionnaire?formType=form&activity_no=20200826143719000152&status=进行中&from=health&origin=' + item.label
					});
				}
			}
		}
	},
	created() {
	},
	watch: {
		'content.list': {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {}
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	background-color: #fff;
	padding: 20rpx;
	margin-top: 20rpx;
	display: flex;
	flex-wrap: wrap;
	min-height: 100rpx;
	.title {
		font-weight: 700;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
}
.content-item {
	min-height: 150rpx;
	width: calc(33.333% - 20rpx);
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f1f1f1;
	margin: 10rpx;
	border-radius: 10rpx;
	padding: 10rpx;
	flex-direction: column;
	&.bg-green {
		background-color: rgba(110, 220, 94, 0.7);
	}
	.item {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.remark {
		font-size: 24rpx;
	}
}
</style>
