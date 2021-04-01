<template>
	<view class="bx-filter">
		<view class="view">
			
		</view>
		<view class="form-box">
			<a-form :fields="filterCols" ref='filterForm' v-if="filterCols"></a-form>
		</view>
		<view class="button-box">
			<button class="cu-btn bg-green light" @click="reset"><text
					class="cuIcon-refresh margin-right-xs "></text>重置</button>
			<button class="cu-btn bg-blue light" @click="toFilter">
				<text class="cuIcon-search margin-right-xs"></text>筛选
			</button>
		</view>
	</view>
</template>

<script>
	/**
	 * @description - 通用筛选组件
	 * @param {Object} - config 配置数据  
	 */
	export default {
		props: {
			fieldInfo: {
				type: [Object, Array]
			},
		},
		data() {
			return {
				filterCols: []
			}
		},
		methods: {
			toFilter() {
				let model = this.$refs.filterForm.getFieldModel();
				this.filterCols = this.filterCols.map((item) => {
					if (model[item.column]) {
						item['value'] = model[item.column]
					}
					return item
				})
				this.$emit('toFilter', this.filterCols.filter(item => item.value))
			},
			reset() {
				this.filterCols = []
				if (Array.isArray(this.fieldInfo)) {
					let filterCols = this.fieldInfo
					filterCols = filterCols.map(item => {
						item.value = null
						return item
					})
					this.filterCols = filterCols.filter(item => item.in_cond === 1 && !['images', 'input', 'text']
						.includes(item.type) && !
						/^\_.*\_disp$/.test(item.column))
				}
				this.$refs.filterForm.onReset()
			}
		},
		mounted() {
			this.reset()
		}
	}
</script>

<style scoped lang="scss">
	.bx-filter {
		height: calc(100vh - var(--window-bottom) - var(--window-top) - 50rpx);
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		.view{
			flex: 1;
		}
		.form-box {
			max-height: calc(100vh - var(--window-bottom) - var(--window-top) - 200rpx);
			overflow-y: scroll;
		}

		.button-box {
			display: flex;
			align-items: center;
			height: 150rpx;
			margin: 0;
			box-shadow: 6px 5px 13px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

			.cu-btn {
				width: 45%;
			}
		}

	}
</style>
