<template>
	<view class="">
		<bx-filtrate :menuAgList='menuAgList' :searchArg="searchArg" :childChooseArr='childChooseArr' @clickItem="chooseFood" @clickMenu="chooseMenu" @clickTag="tagClick"></bx-filtrate>
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
							children:[{
								title: '全部',
								value: '全部',
								choose:true
							},{
									title: '咽喉',
									value: '咽喉',
									choose:false
								},
								{
									title: '全身',
									value: '全身',
									choose:false
								},
								
								{
									title: '腹部',
									value: '腹部',
									choose:false
								},
								{
									title: '皮肤',
									value: '皮肤',
									choose:false
								},
								{
									title: '颅脑',
									value: '颅脑',
									choose:false
								}]
						}],
				searchArg: {
					serviceName:'srvhealth_disease_select',
					imgCol:'',
					topNum:160,
					isShowCouple:false,
					pageRowNumber:45,
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
			// getSicknessFilt(){
			// 	let self = this
			// 	let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_item_select', 'select');
			// 	let req = {
			// 		serviceName: 'srvhealth_mixed_food_nutrition_item_select',
			// 		colNames: ['*'],
			// 		condition:[{
			// 			colName:"meal_no",
			// 			ruleType:"eq",
			// 			value:this.foodObj.meal_no
			// 		}],
			// 	};
			// 	let res = await this.$http.post(url, req);
			// }
			
		}
	}
</script>

<style>
</style>
