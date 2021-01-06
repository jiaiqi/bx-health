<template>
	<view class="doctor-wrap">
		<person-chat :customer_no="no" ref="chat" :doctor_no="doctor_no" :group-info="groupInfo" :pageType="pageType"></person-chat>
	</view>
</template>

<script>
	import personChat from '@/personalPages/components/personInfo/personchat.vue'
	export default {
		name:'doctorChat',
		components:{
			personChat
		},
		data() {
			return {
				no:"",
				doctor_no:{},
				groupInfo:{},
				pageType:'patient',
			}
		},
		onLoad(option) {
			if(option.no){
				this.no = option.no
			}
			if(option.doctor){
				this.doctor_no = JSON.parse(decodeURIComponent(option.doctor)) 
			}else if(option.groupInfo){
				this.groupInfo = JSON.parse(decodeURIComponent(option.groupInfo))
				this.pageType = "groupChat"
			}else{
				this.pageType = ""
			}
			
		},
		onPullDownRefresh() {
			// 下拉
			setTimeout(() => {
					this.$refs.chat.getUserInfo(this.no);
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style>
</style>
