<template>
	<view>
		<view class="menu-list">
			<view class="menu-item" v-for="item in menuList" @click="navPages(item.type)">
				<image src="../static/links.png" mode="" class="icon"></image>
				<view class="label">{{ item.label }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			menuList: [
				{
					label: '饮食',
					icon: '../static/links.png',
					type: 'diet'
				},
				{
					label: '运动',
					icon: '../static/links.png',
					type: 'sport'
				},
				{
					label: '血压',
					icon: '../static/links.png',
					type: 'bp'
				},
				{
					label: '体重',
					icon: '../static/links.png',
					type: 'weight'
				},
				{
					label: '睡眠',
					icon: '../static/links.png',
					type: 'sleep'
				},
				{
					label: '症状',
					icon: '../static/links.png',
					type: 'symptom'
				}
			]
		};
	},
	methods: {
		navPages(e) {
			if (e) {
				uni.navigateTo({
					url: `/archivesPages/archives-history/archives-history?pageType=${e}`
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.menu-list {
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	.menu-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
		&:active {
			background-color: #f1f1f1;
		}
		.icon {
			width: 100rpx;
			height: 100rpx;
		}
		.label {
			margin-top: 5px;
		}
	}
}
</style>
