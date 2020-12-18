<template>
	<view class="filtrate-box">
		<view class="filter-item" v-for="(item, index) in filterList" :key="index">
			<view class="filter-label">{{item[config.labelCol]}}</view>
			<view class="filter-content"></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'filtrate',
	props: {
		config: {
			type: Object,
			default: () => {
				return {
					labelCol: 'label',
					listCol:"list"
				}
			}
		},
		filterList: {
			type: Array,
			default: () => []
		}
	}
};
</script>

<style scoped></style>
