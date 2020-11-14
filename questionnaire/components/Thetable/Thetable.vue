<template>
	<view class="">
			<view class="table" id="tabbox" v-if="list.length>0"  >
				<view class="htmlbox" v-for="(item,index) in list" :style="{background:item.answer?'#c5efd6':''}" >
					<!-- <view class="erjibox" :style="{color:item.Color}">{{item.text}}{{item.answSheet?('：'+item.answSheet.strAnsw):''}}</view> -->
					<view class="erjibox" :style="{color:item.answer?'#42b983':''}">{{item.name}}{{item.answer?('：'+item.answer):''}}</view>
					<text class="cuIcon-close close" @click="delHtml(item)"></text>
				</view>
				<text @click="checkAllTable" class=" allcancl ">清除所有</text>
			</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				location:0
			}
		},
		props:{
			list:{
				type:Array,
				default:[]
			}
		},
		watch:{
			list:function(newdata){
				this.location = newdata.length*80
			}
		},
		methods:{
			delHtml(val){
				this.$emit('delHtml',val)
			},
			checkAllTable(){
				this.$emit('delAlltabAllansw','*')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.table{
		padding: 10upx;
		margin: 0  10px;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.allcancl{
			background: #ccc;
			line-height:60upx ;
			height: 60upx;
			border-radius: 3px;
			display: flex;
			justify-content: center;
			margin-top: 10upx;
			padding: 0 10upx;
			color: #49698c;
		}
		.htmlbox{
			height: 60upx;
			display: flex;
			flex-shrink: 0;
			// width: 120upx;
			box-shadow: 0px 2px 10px 0px #d6d4d4;
			border-radius: 3px;
			line-height:60upx ;
			color: #8c8383;
			margin-right: 8upx;
			justify-content: center;
			padding: 0 10upx;
			margin-top: 10upx;
			.erjibox{
				max-width: 300upx;
				    overflow: hidden;
				    white-space: nowrap;
				    text-overflow: ellipsis;
			}
			
			
		}
	}
</style>
