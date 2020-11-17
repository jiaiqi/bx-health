<template>
	<view class="pathogen-detail-wrap">
		<text>{{query.name}}</text>
	</view>
</template>

<script>
	export default {
		name:'pathogenDetail',
		data(){
			return {
				detailObj:''
			}
		},
		onLoad(option) {
			let query = JSON.parse(decodeURIComponent(option.detail))
			this.query = query
			console.log("option=====>",query)
		}
	}
</script>

<style>
</style>
