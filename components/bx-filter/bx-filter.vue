<template>
	<view class="bx-filter">
		<view class="view">

		</view>
		<view class="form-box">
			<a-form :fields="filterCols" ref='filterForm' pageType="filter" v-if="filterCols"></a-form>
		</view>
		<view class="button-box">
			<button class="cu-btn bg-green light" @click="reset"><text
					class="cuIcon-refresh margin-right-xs "></text>重置</button>
			<button class="cu-btn bg-grey light" @click="cancel"><text
					class="cuIcon-close margin-right-xs "></text>取消</button>
			<button class="cu-btn bg-blue light confirm" @click="toFilter">
				<text class="cuIcon-search margin-right-xs"></text>确定
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
			cancel() {
				this.$emit('cancel')
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
		max-height: calc(100vh - var(--window-bottom) - var(--window-top) - 150rpx);
		overflow-y: hidden;
		display: flex;
		flex-direction: column;

		.view {
			flex: 1;
		}

		.form-box {
			max-height: calc(100vh - var(--window-bottom) - var(--window-top) - 300rpx);
			overflow-y: scroll;
		}

		.button-box {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin: 0;
			box-shadow: 6px 5px 13px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			padding: 20rpx;

			.cu-btn {
				// flex: 1;
				width: 200rpx;
				&+.cu-btn {
					// margin-left: 20rpx;
				}
				&.confirm{
					// flex: 2;
				}
			}
		}

	}
</style>
