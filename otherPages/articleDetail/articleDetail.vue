<template>
	<view class="article-wrap">
		<view class="header">
			<view class="title" v-if="articleData.title">{{ articleData.title }}</view>
			<view class="title" v-if="articleData.name">{{ articleData.name }}</view>
		</view>
		<!-- <view class="category">
      <text class="lg cuIcon-tagfill"></text>
      {{ cate_name }}
    </view> -->
		<view class="create-time">{{ articleData.create_time }}</view>

		<view class="content" v-if="articleData.content">
			
			<!-- <u-parse :html="articleData.content"></u-parse> -->
			<view class="" v-html="JSON.parse(JSON.stringify(articleData.content).replace(/\<img/gi, '<img width=100% height=100%'))"></view>
		</view>
		<view class="content" v-if="articleData.introduce">
			<view class="" v-html="JSON.parse(JSON.stringify(articleData.introduce).replace(/\<img/gi, '<img width=100% height=100%'))"></view>
		</view>
		<view class="footer">
			<!-- <view class="create-user">
        责任编辑:{{articleData.create_user}}
      </view> -->
			<!-- <view class="modify-time">修改时间:{{ articleData.modify_time }}</view> -->
		</view>
	</view>
</template>

<script>
export default {
	computed: {
		editor() {
			let str = '';
			if (this.articleData.create_user_disp) {
				str = this.articleData.create_user_disp.split('/')[0];
			}
			return str;
		}
	},
	data() {
		return {
			articleData: {},
			content_no: '',
			cate_name: '',
			serviceName: 'srvdaq_cms_content_select'
		};
	},
	methods: {
		getArticleData() {
			let url = this.getServiceUrl('daq', 'srvdaq_cms_content_select', 'select');
			let req = {
				serviceName: 'srvdaq_cms_content_select',
				colNames: ['*'],
				condition: [{ colName: 'content_no', ruleType: 'in', value: this.content_no }]
			};
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
					this.articleData = res.data.data[0];
				} else {
					uni.showModal({
						title: '提示',
						content: '未查找到对应文章，点击确定返回上一级',
						success(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/specific/index/index'
								});
							}
						}
					});
				}
			});
		}
	},
	onLoad(option) {
		if (option.article) {
			this.articleData = JSON.parse(decodeURIComponent(option.article));
		}
		if (option.cate_name) {
			this.cate_name = option.cate_name;
		}
		if (option.serviceName) {
			this.serviceName = decodeURIComponent(option.serviceName);
		}
		if (option.content_no) {
			this.content_no = decodeURIComponent(option.content_no);
			this.getArticleData();
		}
		if (option.destApp) {
			uni.setStorageSync('activeApp', option.destApp);
		}
	}
};
</script>

<style lang="scss">
.article-wrap {
	background-color: #fff;
	display: flex;
	flex-direction: column;
	width: 100%;
	margin: 0 auto;
	padding: 20upx 20upx 40upx;
	min-height: 100vh;
	box-shadow: 0 0 5px rgba(0, 0, 100, 0.27), 0 0 20px rgba(0, 100, 100, 0.1) inset;
	// border-bottom-left-radius: 20px 500px;
	// border-bottom-right-radius: 500px 30px;
	// border-top-right-radius: 115px 30px;
	.header {
		display: flex;
		align-items: center;
		.title {
			min-height: 100upx;
			font-weight: 600;
			font-size: 40upx;
			display: flex;
			align-items: center;
			flex: 1;
		}
	}
	.category {
		width: 100%;
		font-size: 24upx;
		margin-left: 20upx;
		line-height: 60upx;
		height: 60upx;
		display: flex;
		justify-content: flex-end;
		padding-right: 30upx;
		color: #0081ff;
		align-items: flex-end;
	}
	.create-time {
		color: #999;
		margin: 20upx 0 0;
	}
	.content {
		min-height: 800upx;
		margin-top: 30upx;
		padding: 30upx 0;
		border-bottom: dashed 1px #eee;
		border-top: dashed 1px #eee;
		line-height: 60upx;
		font-size: 36upx;
	}
	.footer {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		line-height: 60upx;
		// justify-content: space-around;
		.modify-time {
			color: #999;
		}
	}
}
</style>
