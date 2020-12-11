<template>
	<view class="">		
		<bx-filtrate v-if="menuAgList[0].children.length > 0" :menuAgList='menuAgList' :showSearch="true" :searchArg="searchArg" :childChooseArr='childChooseArr' @clickItem="chooseFood" @clickMenu="chooseMenu" @clickTag="tagClick"></bx-filtrate>
	</view>
</template>

<script>
	import bxFiltrate from '@/components/bx-filtrate/bx-filtrate.vue'
	export default {
		name:'sickness',
		components:{
			bxFiltrate
		},
		data(){
			return {
				menuAgList:[{
							classify_name:'发病部位',
							type:'subclass',
							colunn:'disease_location',
							children:[]
						}],
				searchArg: {
					serviceName:'srvhealth_disease_select',
					imgCol:'',
					topNum:230,
					serColname:'disease_name',
					searchPlaceHolder:'请输入疾病名称搜索',
					isShowCouple:false,					
					pageRowNumber:65,
					wordKey:{
						title:"disease_name",
						unit:"",
						energy:"",
						unitNum:"",						
					}
				},
				childChooseArr:[],
			}
		},
		onShow() {
			this.getSicknessFilt()
		},
		methods:{
			
			chooseFood(e){
				// console.log("点击食物---",e)
				this.$store.commit('SET_SICK_ITEM',e)
				// uni.navigateTo({
				// 	url:'/pregnancy/sickness/sicknessDetail?sick=' + encodeURIComponent(JSON.stringify(e))
				// })
				uni.navigateTo({
					url:'/pregnancy/sickness/sicknessDetail'
				})
			},
			chooseMenu(e){
				console.log("点击顶部菜单---",e)
			},
			tagClick(){
				console.log("点击标签---",e)
			},
			/*查询顶部晒选条件**/
			async getSicknessFilt(){
				let self = this
				let url = this.getServiceUrl('health', 'srvhealth_disease_select', 'select');
				let req = {
					"serviceName": "srvhealth_disease_select",
					"colNames": [
						"*"
					],
					"condition": [],
					"group":[{
						"colName":"disease_location",
						"type":"by"
					},{
						"colName":"id",
						"type":"count"
					}],
					"page": {
						pageNo:1,
						rownumber:7
					},
					"order": [{
					 "colName": "id",
					 "orderType": "desc" 
				  }]
				}				
				let res = await this.$http.post(url, req);
				let topFilterArr = [{
					title: '全部',
					value: '全部',
					choose:true
				}]
				// {
				// 	title: '颅脑',
				// 	value: '颅脑',
				// 	choose:false
				// }
				res.data.data.forEach(item=>{
					let obj =  {
						title: item.disease_location,
						value: item.disease_location,
						choose:false
					}
					topFilterArr.push(obj)
				})
				this.menuAgList[0].children = topFilterArr
				console.log("res----",res.data.data)
			}
			
		}
	}
</script>

<style>
</style>
