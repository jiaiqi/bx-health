<template>
	<view class="sym-item-wrap">
			<view class="contentpop_cen_tit">
				{{itemNum+1}}.{{itemType.title}}
				<text :class="itemType.isfail?'must-fill':''" v-if="itemType.required">(必填)</text>
				<text v-else>(选填)</text>
			</view>
			
			<!-- <checkbox-group @change="checkboxChange" v-if="itemType.type === 'checked'">
				<checkbox 
					:class="item.checked?'checked':''" :checked="item.checked?true:false"
					v-model="item.checked" 
					v-for="(item, index) in itemType.data" :key="index" 
					:name="item.name"
					:value="item.name"
				>{{item.name}}</checkbox>
			</checkbox-group> -->
			
			<view class="border-bottom" v-if="itemType.type === 'num'" >
				<!-- <input type="text" v-model="itemType.value" value="" /> -->
				<!-- <u-number-box :positive-integer="false" :step="activeStep" v-model="itemType.value"></u-number-box> -->
				<!-- <view class="step-wrap">
					<view class="steps">
						步进值
					</view>
					<view class="steps-num">
						<text :class="activeStep===1?'active-text':''" @click="chooseSteps(itemType,1)">1</text>
						<text :class="activeStep===0.1?'active-text':''" @click="chooseSteps(itemType,0.1)">0.1</text>
					</view>
				</view> -->
				<!-- <view class="input-box">
					<view class="key-left">
						<text @click="countDietNum(itemType,'-0.1')">-0.1</text>
						<text @click="countDietNum(itemType,'-1')">-1</text>
					</view>
					<input placeholder=" " :disabled="true" :clearable="false" :border="true" maxlength="20" v-model="itemType.value" type="number" />
					<view class="key-right">
						<text @click="countDietNum(itemType,'+1')">+1</text>
						<text @click="countDietNum(itemType,'+0.1')">+0.1</text>
					</view>
				</view> -->
			</view>
			<!-- <radio-group @change="radioChange"  v-model="itemType.value" v-if="itemType.type === 'radio'">
				<radio 					
					v-for="(item, index) in itemType.data" :key="index" 
					:name="item.name"
					:value="item.name"
					:class="radio==item.name?'checked':''" :checked="radio==item.name?true:false"
				>
					{{item.name}}
				</radio>
			</radio-group> -->
			<!-- <view class="border-bottom" v-if="itemType.type === 'text'" >
				<input height="auto-height" :height="100" :border="true" type="textarea" :placeholder="'请输入'+itemType.title" v-model="itemType.value"/>
			</view>
			<view class="border-bottom date-bottom" v-if="itemType.type === 'date'||itemType.type === 'time' ||itemType.type === 'dateTime'" :right-icon-style="rightIcon"  right-icon="calendar">
				<input @click="openTime" :height="100" :border="true" height="20" :disabled="true" :placeholder="'请选择'+itemType.title" v-model="itemType.value"/>
			</view> -->
			<mx-date-picker
				style="z-index: 15000;"
				:format="dateFormat"
				:show="showTimePicker"
				:type="timeType"
				:value="currentVal"
				:show-tips="true"
				:begin-text="'入住'"
				:end-text="'离店'"
				:show-seconds="true"
				@confirm="onSelected"
				@cancel="onSelected"
			/>
	</view>
</template>

<script>
	import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
	export default {
		name:"symFromItem",
		components:{MxDatePicker},
		props:{
			itemType:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			itemNum:{
				type:Number,
				default:0
			}
		},
		watch: {
			itemType:{
				handler(newval,oldval){
					if(newval.required && newval.value){
						newval.isfail = false
					}else if(newval.required && !newval.value){
						newval.isfail = true
					}
					console.log("------watch--",newval)
				},
				deep:true
			}
			
		},
		data(){
			return {
				rightIcon:{
					marginLeft:50
				},
				checkedData:[],
				dateFormat: '',
				showTimePicker: false,
				timeType: '',
				currentVal: null,
				currTime:null,
				isShowMust:false,
				activeStep:1,
				radio:""
			}
		},
		methods:{
			chooseSteps(item,num){
				this.activeStep = num
			},
			countDietNum(item,num){
				let numbers = Number(item.value)
				if(!numbers){
					numbers = 0
				}
				if(num === '+1'){
					numbers+=1
				}else if(num=== '+0.1'){
					numbers+=0.1
				}else if(num=== '-1'){
					if (numbers >= 1) {
						numbers = numbers - 1;
					}
				}else if(num=== '-0.1'){
					if (numbers > 0) {
						numbers-=0.1
					} else {
						numbers = 0;
					}
				}
				debugger
				item.value = Number(numbers).toFixed(1)
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				let value = e.detail.value
				let itemType = this.itemType
				let currValue = ""
				debugger
				itemType.data.forEach(I=>{
					if(I.name === value){
						currValue = I
					}
				})
				this.$emit('checkedChange',itemType,currValue)
				// return
				
				// this.itemType.value = e.name
				// console.log("复选框",checkedData);
			},
			//选中某个单选框时，由radio时触发
			radioChange(e){
				debugger
				// this.showTimePicker = true;
				this.radio = e.detail.value
				console.log("e---",e)
			},
			onSelected(e) {
				//时间选择器
				this.showTimePicker = false;
				if (e) {
					// this.dietIn = 0
					// this.sportOut = 0
					//选择的值
					console.log('value => ' + e.value);
					this.itemType.value = e.value
					// this.$set(this.currFood,"htime",e.value)
				}
			},
			
			openTime(){
				if(this.itemType.type === 'time'){
					this.dateFormat = 'hh:ii:ss'
					this.timeType = 'time'
				}else if(this.itemType.type === 'date'){
					this.dateFormat = 'yyyy-mm-dd'
					this.timeType = 'date'
				}else if(this.itemType.type === 'dateTime'){
					this.dateFormat = 'yyyy-mm-dd hh:ii:ss'
					this.timeType = 'datetime'
				}
				this.showTimePicker=true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sym-item-wrap{
		.border-bottom{
			// border-bottom: 1px solid #e4e7ed;
			
			color: #606266;
			/deep/ .u-form-item--left{
				flex: initial!important;
				width: inherit!important;
			}
		}
		
	}
	.contentpop_cen_tit{
		margin: 5px;
		color: #777777;
		margin-left: 0;
	}
	.must-fill{
		color: red;
	}
	.step-wrap{
		display: flex;
		margin-left: 50upx;
		flex: 1;
		height: 50upx;
		align-items: center;
	
		.steps{
			height: 100%;
			line-height: 25px;
		}
		.steps-num{
			display: flex;
			height: 100%;
			align-items: center;
			border: 1px solid rgb(238, 238, 239);
			background-color: rgb(238, 238, 239);
			border-radius: 10upx;
			margin-left: 10upx;
			padding: 2px;
			text{
				padding: 0px 40upx;
				height: 100%;
				line-height: 40upx;
			}
			.active-text{
				background-color: white;
				border-radius:10upx;
			}
		}
	}
	.date-bottom{
		position: relative;
	}
	.date-bottom /deep/ .u-input__input{
		min-height: 64upx!important;
	}
	.date-bottom /deep/ .u-form-item--right__content__icon{
		position: absolute;
		right: 20upx!important;
	}
	.input-box {
		display: flex;
		// flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		/deep/ input {
			border: 1px solid #ccc;
			width: 100rpx !important;
			height: 58rpx;
			text-align: center;
			border-radius: 10rpx;
		}
		.key-left {
			text {
				padding: 12upx 12upx;
				background-color: #d6e2eb;
				font-size: 30upx;
				min-width: 90upx;
				text-align: center;
				display: inline-block;
				margin-right: 10upx;
				border-radius: 5px;
			}
		}
		.key-right {
			text {
				padding: 12upx 12upx;
				background-color: #d6e2eb;
				font-size: 30upx;
				min-width: 90upx;
				text-align: center;
				display: inline-block;
				margin-left: 10upx;
				border-radius: 5px;
			}
		}
		.digit {
			width: 33%;
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			border-right: 1px solid #cccccc;
			border-bottom: 1px solid #cccccc;
			font-size: 18px;
			&:active {
				box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
			}
			&:nth-child(3n) {
				border-right: none;
				flex: 1;
			}
			&:nth-child(10) {
				border-bottom: none;
			}
			&:nth-child(11) {
				border-bottom: none;
			}
			&:nth-child(12) {
				border-bottom: none;
			}
		}
	}
</style>
