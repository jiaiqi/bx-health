<template>
	<view></view>
</template>

<script>
export default {
	// 通用站点首页
	data() {
		return {
			pageItemList: [] // 页面项
		};
	},
	methods: {
		async getPageItem() {
			// 查找页面项
			let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_page_item_select',
				colNames: ['*'],
				condition: [{ colName: 'page_no', ruleType: 'eq', value: 'BX202004280847490008' }],
				page: null,
			};
			let res = await this.$http.post(url,req)
			if(res.data.state==="SUCCESS"){
			}
		}
	}
};
</script>

<style lang="scss"></style>
