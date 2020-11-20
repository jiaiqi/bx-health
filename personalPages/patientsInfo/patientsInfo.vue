<template>
	<view class="health-archive-page-wrap">
		<patients-info :customer_no="customer_no" v-if="current_tab == 0"></patients-info>
		<person-chat :customer_no="customer_no" v-if="current_tab == 1"></person-chat>
		<view class="health-bottom">
			<text @click="changeTab(index)" v-for="(item,index) in bottom_tab_data" :key="index" :class="current_tab==index?'active-text':''">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	import patientsInfo from '@/personalPages/components/personInfo/personInfo.vue'
	import personChat from '@/personalPages/components/personInfo/personchat.vue'
export default {
	name:'patientsInfos',
	components:{
		patientsInfo,
		personChat
	},
	data(){
		return {
			bottom_tab_data:[{
				name:'患者信息'
			},{
				name:'交流'
			}],
			current_tab:0,
			customer_no:''
		}
	},
	methods:{
		/*点击底部tab切换*/
		changeTab(i){
			this.current_tab = i
		},
	},
	onLoad(option) {
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
	},
};
</script>

<style scoped lang="scss">

.health-bottom{
	display: flex;
	position: fixed;
	bottom: 0;
	background-color: #fff;
	width: 100%;
	// padding: 20rpx 0;
	height: 80rpx;
	justify-content: space-around;
	border-top: 1px solid rgba(0, 0, 0, 0.33);
	text{
		width: 49%;
		text-align: center;
		line-height: 80rpx;
		&:first-child{
			border-right: 1px solid rgba(0, 0, 0, 0.33);
		}
	}
	.active-text{
		color: chocolate;
	}
}
</style>
