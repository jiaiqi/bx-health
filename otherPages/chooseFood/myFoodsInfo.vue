<template>
	<view class="info-wrap">
		<view class="info">
			<view class="info-item">
				<view class="info-item-top">
					<text>出生日期：</text>
				</view>
				<view class="info-item-bot">
					<input
						@blur="onInputBlur"
						@input="onInputChange"
						v-model="info.bir"
						disabled
						class="date-input"
						@click.stop="toggleData"
						:placeholder="'请选择出生日期'"
						style="width: 100%;"
						name="input"
					/>
					<!-- <text
						class="input-icon cuIcon-calendar"
						style="position: absolute;top:10upx;right: 20upx;color: #0bc99d;"
						@click.stop="toggleData"
					></text> -->
					<!-- <w-picker mode="yearMonth" startYear="1900" endYear="2030" :current="false" @confirm="onConfirm" :disabledAfter="false" ref="yearMonth" themeColor="#f00"></w-picker> -->
					<w-picker mode="date" startYear="1900" endYear="2030" :current="false" @confirm="onConfirm" :disabledAfter="false" ref="Date" themeColor="#f00"></w-picker>
					<!-- <picker v-show="dateIsShow" mode="date" :value="info.bir" start="1900-09-01" end="2030-09-01" @change="DateChange">
						<view class="picker">
							{{info.bir}}
						</view>
					</picker> -->
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-top">
					<text>性别：</text>
				</view>
				<view class="info-item-bot-radio">
					<radio-group class="block" @change="RadioChange">
						<radio :class="radio=='男'?'checked':''" :checked="radio=='男'?true:false" value="男">男</radio>
						<radio :class="radio=='女'?'checked':''" :checked="radio=='女'?true:false" value="女">女</radio>
					</radio-group>
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-top">
					<text>体重(kg)：</text>
				</view>
				<view class="info-item-bot">
					<input v-model="info.weight" type="text" value="" />
				</view>
			</view>
		</view>
		<view class="info-bot">
			<uni-button @click="submitData" class="cu-btn bg-blue">提交</uni-button>
			<uni-button @click="cancel" class="cu-btn bg-blue">取消</uni-button>
		</view>
	</view>
</template>

<script>
	import wPicker from '@/otherPages/components/w-picker/w-picker.vue';
	export default {
		name:'myFoodsInfo',
		data(){
			return {
				info:{
					bir:'',
					sex:'',
					weight:''
				},
				radio:'男',
				dateIsShow:false
			}
		},
		components:{
			wPicker
		},
		methods:{
			DateChange(e) {
				this.info.bir = e.detail.value
			},
			RadioChange(e) {
				this.radio = e.detail.value
				this.info.sex = e.detail.value
			},
			
			toggleData(){
				this.$refs.Date.show()
				
			},
			onConfirm(e){
				this.info.bir = e.result
			},
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			async submitData(){
				let self = this;
				let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
				let req = [{
					serviceName: 'srvhealth_person_info_update',
					colNames: ['*'],
					condition:[{
						colName:'id',
						ruleType:'eq',
						value:uni.getStorageSync('current_user_info').id
					}],
					data:[{
						birthday:this.info.bir,
						weight:this.info.weight,
						sex:this.info.sex
					}]
				}];
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					uni.showToast({
						title:'修改成功',
						icon:'none'
					})
					let user = uni.getStorageSync('current_user_info')
					user.birthday = this.info.bir
					user.weight = this.info.weight
					user.sex = this.info.sex
					uni.setStorageSync('current_user_info',user)
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1000)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.info-wrap{
		height: 100vh;
		background-color: #fff;
		.info{
			min-height: 70vh;
			.info-item{
				padding: 30rpx;
				.info-item-top{
					margin-bottom: 10rpx;
					font-weight: 700;
					font-size: 30rpx;
				}
				.info-item-bot{
					border: 1px solid #ccc;
					padding: 10rpx;
				}
			}
		}
		.info-bot{
			display: flex;
			justify-content: space-around;
			margin-top: 100rpx;
			text{
				padding: 0 30rpx;
				height: 64rpx;
				background-color: #0081ff;
				color: #fff;
				line-height: 64rpx;
			}
		}
		.info-item-bot-radio{
			/deep/ uni-radio::before, uni-checkbox::before{
				right: 90rpx;
			}
			/deep/ .uni-radio-wrapper{
				margin-right: 50rpx;
			}
		}
	}
</style>
