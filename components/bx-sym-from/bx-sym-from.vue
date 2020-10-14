<template>
	<view class="sym-wrap">
		<sym-from-item class="sym-item" @checkedChange="checkedChange" :itemType="item" :itemNum="index" v-for="(item,index) in fromTypeData"></sym-from-item>
	</view>
</template>

<script>
	import symFromItem from '@/components/bx-sym-from/bx-sym-from-item'
	export default {
		name:"bxSymfrom",
		components:{symFromItem},
		props:{
			fromTypeData:{
				type:Array,
				default:()=>{
					return []
				}
			}
		},
		data(){
			return  {
				
			}
		},
		methods:{
			checkedChange(e,item){
				this.$emit('checkedItemChange',e,item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sym-wrap{
		margin:0 10px;
		.sym-item{
			margin-top: 15px;
		}
	}
</style>
