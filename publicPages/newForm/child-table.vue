<template>
	<view class="child-service-box">
		<!-- <view class="normal-title">子表</view> -->
		<view class="child-service-item" v-for="item in list" @click="toChildServiceList(item)">
			<view class="child-service-title">
				<view class="cu-tag badge" v-if="item.total">
					<block>{{ item.total > 99 ? '99+' : item.total || 0 }}</block>
				</view>
				<view class="label">{{ item.foreign_key && item.foreign_key.section_name ? item.foreign_key.section_name : item.service_view_name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		childService: {
			type: Array
		},
		formData: {
			type: Object
		}
	},
	mounted() {
		this.getChildServiceList();
	},
	data() {
		return {
			list: []
		};
	},
	watch: {
		childService: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				if (Array.isArray(newValue) && newValue.length > 0) {
					this.list = this.deepClone(newValue);
				}
			}
		}
	},
	methods: {
		toChildServiceList(item) {
			this.$emit('toChildServiceList', item);
		},
		getChildServiceList() {
			let formData = this.formData;
			let req = [
				{
					colNames: ['*'],
					condition: [],
					page: {
						pageNo: 1,
						rownumber: 10
					},
					serviceName: 'srvhealth_chinese_medicine_disease_select'
				},
				{
					colNames: ['*'],
					condition: [],
					page: {
						pageNo: 1,
						rownumber: 10
					},
					serviceName: 'srvhealth_see_doctor_record_select'
				}
			];
			let url = this.getServiceUrl('health', 'select', 'multi');
			if (this.childService.length > 0) {
				req = this.childService.map(item => {
					let obj = {
						colNames: ['*'],
						condition: [{ colName: item.foreign_key.column_name, ruleType: 'eq', value: formData[item.foreign_key.referenced_column_name] }],
						serviceName: item.service_name,
						page: {
							pageNo: 1,
							rownumber: 1
						}
					};
					return obj;
				});
				this.$http.post(url, req).then(res => {
					this.list = this.list.map((item, index) => {
						if (Array.isArray(res.data.data) && res.data.data.length > 0) {
							res.data.data.forEach((data, dIndex) => {
								if (index === dIndex) {
									if (data.page) {
										item.total = data.page.total;
									} else {
										item.total = 0;
									}
									this.$set(item, 'total', data.page.total);
								}
							});
						}
						return item;
					});
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.child-service-box {
	margin: 20rpx;
	padding: 20rpx;
	display: flex;
	flex-wrap: wrap;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	.child-service-item {
		min-height: 100rpx;
		width: calc(33% - 6rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translate(2px, 2px);
		background-color: #409eff;
		color: #fff;
		transition: 0.2s all ease-in-out;
		border-radius: 10rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		&:nth-child(3n) {
			margin-right: 0;
		}
		&:active {
			transform: translate(2px, 2px);
			color: #409eff;
			background: #ecf5ff;
			box-shadow: 0px 0px 4px #ecf5ff, 0 0 6px #b3d8ff;
		}
		.child-service-title {
			text-align: center;
		}
	}
}
</style>
