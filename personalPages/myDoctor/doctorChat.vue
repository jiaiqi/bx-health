<template>
	<view class="doctor-wrap">
		<person-chat :customer_no="no" :doctor_no="doctor_no" pageType="patient"></person-chat>
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
				doctor_no:""
			}
		},
		onLoad(option) {
			if(option.no){
				this.no = option.no
			}
			if(option.doctor){
				this.doctor_no = option.doctor
			}
		}
	}
</script>

<style>
</style>
