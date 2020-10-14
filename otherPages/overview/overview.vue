<template>
	<view class="content-wrap">
		<view class="top">
			<view class="prompt">永远相信美好的事情即将发生</view>
			<picker class="date-picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">
					<text class="u-margin-10">{{ date }}</text>
					<u-icon name="arrow-down-fill" color="#333" size="28"></u-icon>
				</view>
			</picker>
		</view>
		<view class="content" v-for="(content, contentIndex) in contentList" :key="contentIndex">
			<view class="title">
				<text class="title-text">{{ content.title }}</text>
				<view class="add">
					<u-button size="mini" :ripple="true" @click="addItem(content)" v-for="(btn, btnIndex) in content.headButton" :key="btnIndex">{{ btn.label }}</u-button>
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
	</view>
</template>

<script>
import formateDate from '@/common/function/formatDate.js';
export default {
	data() {
		return {
			pageTitle: '健康概览',
			showUserList: false,
			date: '',
			backTextStyle: {
				color: '#333'
			},
			userMenuList: [{ label: '健康状况' }, { label: '健康档案' }],
			src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			navBackground: {
				backgroundColor: '#fff'
			},
			userInfo: { name: 'jiaqi' },
			contentList: [
				{
					headButton: [],
					title: '病因',
					list: [
						{
							label: '家族史'
						},
						{
							label: '先天因素'
						},
						{
							label: '环境'
						},
						{
							label: '饮食'
						},
						{
							label: '运动'
						},
						{
							label: '心理因素'
						},
						{
							label: '生活方式'
						},
						{
							label: '睡眠'
						}
					]
				},
				{
					headButton: [
						{
							label: '添加'
						}
					],
					title: '症状',
					list: []
					// list: ['咳嗽', '极度口渴', '心跳过快', '头痛', '胸闷', '气短', '胃痛']
				},
				{
					headButton: [],
					title: '疾病',
					list: [
						{
							label: '急性咽喉炎'
						},
						{
							label: '支气管炎'
						},
						{
							label: '肺结核'
						},
						{
							label: '高血糖'
						},
						{
							label: '低血压'
						},
						{
							label: '颈性偏头痛'
						},
						{
							label: '胰腺炎'
						},
						{
							label: '十二指肠溃疡'
						}
					]
				}
			]
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods: {
		addItem(content) {
			console.log(content);
			if (content.title === '病症' || content.title === '症状') {
				uni.navigateTo({
					url: '/pages/symptomSelect/symptomSelect'
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
		},
		bindDateChange(e) {
			console.log(e);
			console.log(e.detail.value);
			this.date = formateDate(new Date(e.detail.value), '年月日');
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 20;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		}
	},
	mounted() {
		if (this.$route.query.result) {
			let result = JSON.parse(this.$route.query.result);
			this.contentList[0].list.map((item, index) => {
				if (item.label === result.result.origin) {
					item = { ...item, ...result };
					this.$set(this.contentList[0].list, index, item);
				}
			});
		}
	},
	created() {
		this.date = formateDate(new Date(), '年月日');
		let self = this;
		uni.$on('checkedItem', datas => {
			let data = datas && datas.length > 0 ? datas : [];
			this.$set(this.contentList[1], 'list', datas);
		});
	}
};
</script>

<style scoped lang="scss">
.content-wrap {
	// 内容区域
	display: flex;
	flex-direction: column;
	// background-color: #fff;
	padding: 20rpx 0 210rpx;
	height: 100%;
	overflow-y: scroll;
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		// justify-content: center;
		padding: 20rpx 30rpx 0;
		.prompt {
			// 提示语
			width: 100%;
			border-radius: 20rpx;
			// border: 1rpx solid #c8c9cc;
			background-color: #f4f4f5;
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.date-picker {
			margin: 10rpx 0;
			color: #999;
			// font-weight: 700;
		}
	}
	.content {
		background-color: #fff;
		padding: 20rpx;
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		.title {
			font-weight: 700;
			width: 100%;
			display: flex;
			justify-content: space-between;
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
	}
}
</style>
