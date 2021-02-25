<template>
	<view class="cu-modal" :class="{ show: show }">
		<view class="cu-dialog">
			<view class="padding-sm">
				<view class="text-bold">选择您要申请的管理者类型</view>
				<bx-checkbox-group mode="button" class="margin-top" v-model="checkedManagerType">
					<bx-checkbox v-for="item in managerTypeList" :key="item.label" v-model="item.checked" :name="item.value">{{ item.label }}</bx-checkbox>
				</bx-checkbox-group>
			</view>
			<view class="button-box">
				<button class="bg-grey cu-btn button" @click="hideModal">取消</button>
				<button class="bg-blue button" @click="updateManagerType">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				checkedManagerType:['医师'],
				managerTypeList: [{
						label: '医师',
						value: '医师',
						checked: true
					},
					{
						label: '营养师',
						value: '营养师',
						checked: false
					},
					{
						value: '健身教练',
						label: '健身教练',
						checked: false
					},
					{
						value: '健康管理师',
						label: '健康管理师',
						checked: false
					}
				]
			}
		},
		methods: {
			hideModal() {
				this.$emit('hideModal')
			},
			updateManagerType(){
				this.$emit('updateManagerType',this.checkedManagerType)
			},
		},
	}
</script>

<style scoped>

</style>