<template>
	<view>
		<view class="_table" :style="{'--col':'auto '.repeat(tableData.thead.length).trim(),'text-align':align}">
			<view class="_th" v-for="(item,i) in tableData.thead" :key="i">{{item.name}}</view>
			<view class="_td" :class="item.isFlex?'isFlex':''" v-for="(item,i) in tableData.tbody" :key="i+'td'" :style="{'grid-area': item.gridArea||'unset','display':item.gridArea=='auto'||item.value==''?'none':'','color':item.color,'backgroundColor':item.bgColor,'text-align':item.align}">
				{{item.value}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"grid-table",
		props:{
			tableData:Object,
			align:String,
		},
		data() {
			return {
			};
		},
	}
</script>

<style lang="scss" scoped>
	$tb-pd: 4px 8px;
	$tb-color: rgb(81, 82, 83);
	@mixin isFlex() {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	._table{
		width: 100%;
		box-sizing: border-box;
		border-left: 1px solid $tb-color;
		border-right: 1px solid $tb-color;
		border-top: 1px solid $tb-color;
		// border: 1px solid $tb-color;
		grid-template-columns:  var(--col);
		display: grid; 
		overflow: auto;
		white-space: break-spaces;
	}
	._th{
		text-align: center;
		padding: $tb-pd;
		font-size:26rpx;
		font-weight: bold;
		border-right: 1px solid $tb-color;
		border-bottom: 1px solid $tb-color;
		@include isFlex;
		&:nth-child(4n){
			border-right: none;
		}
	}
	._td{
		padding: $tb-pd;
		font-size:24rpx;
		border-right: 1px solid $tb-color;
		border-bottom: 1px solid $tb-color;
		&:nth-child(4n){
			border-right: none;
		}
	}
	.isFlex{
		@include isFlex;
	}
	// 固定表头样式
	.fixed-thead{
		display: grid;
		grid-template-columns:  var(--col);
	}
	.fiexd_td{
		visibility: collapse;
	}
</style>