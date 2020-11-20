<template>
	<view class="pathogen-detail-wrap">
		<text v-if="query">{{query.name}}</text>
		<!-- <text>详情</text>s -->
	</view>
</template>

<script>
	export default {
		name:'pathogenDetail',
		data(){
			return {
				detailObj:'',
				query:''
			}
		},
		onLoad(option) {
			
			let query = JSON.parse(decodeURIComponent(option.detail))
			this.query = query
			console.log("option=====>",option.detail)
		}
	}
</script>

<style>
</style>
