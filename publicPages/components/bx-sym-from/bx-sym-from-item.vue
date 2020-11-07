<template>
	<view class="sym-item-wrap">
			<view class="contentpop_cen_tit">
				{{itemNum+1}}.{{itemType.title}}
				<text :class="itemType.isfail?'must-fill':''" v-if="itemType.required">(必填)</text>
				<text v-else>(选填)</text>
			</view>
			<u-checkbox-group v-if="itemType.type === 'checked'">
				<u-checkbox 
					@change="checkboxChange($event,itemType)" 
					v-model="item.checked" 
					v-for="(item, index) in itemType.data" :key="index" 
					:name="item.name"
				>{{item.name}}</u-checkbox>
			</u-checkbox-group>
			
			<u-form-item class="border-bottom" v-if="itemType.type === 'num'" >
				<!-- <u-input height="20" type="number" :placeholder="'请输入'+itemType.title" v-model="itemType.value"/> -->
				<u-number-box :positive-integer="false" :step="activeStep" v-model="itemType.value"></u-number-box>
				<view class="step-wrap">
					<view class="steps">
						步进值
					</view>
					<view class="steps-num">
						<text :class="activeStep===1?'active-text':''" @click="chooseSteps(1)">1</text>
						<text :class="activeStep===0.1?'active-text':''" @click="chooseSteps(0.1)">0.1</text>
					</view>
				</view>
			</u-form-item>
			
			<u-radio-group v-model="itemType.value" v-if="itemType.type === 'radio'">
				<u-radio 
					@change="radioChange" 
					v-for="(item, index) in itemType.data" :key="index" 
					:name="item.name"
					:disabled="item.disabled"
				>
					{{item.name}}
				</u-radio>
			</u-radio-group>
			
			<u-form-item class="border-bottom" v-if="itemType.type === 'text'" >
				<u-input height="auto-height" :height="100" :border="true" type="textarea" :placeholder="'请输入'+itemType.title" v-model="itemType.value"/>
			</u-form-item>
			
			
			<u-form-item class="border-bottom date-bottom" v-if="itemType.type === 'date'||itemType.type === 'time' ||itemType.type === 'dateTime'" :right-icon-style="rightIcon"  right-icon="calendar">
				<u-input @click="openTime" :height="100" :border="true" height="20" :disabled="true" :placeholder="'请选择'+itemType.title" v-model="itemType.value"/>
			</u-form-item>
			<!-- <view class="date-item">
				<text>请选择开始时间</text>
				<u-icon name="photo" color="#2979ff" size="28"></u-icon>
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
	import MxDatePicker from '@/publicPages/components/mx-datepicker/mx-datepicker.vue';
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
				activeStep:1
			}
		},
		methods:{
			chooseSteps(num){
				this.activeStep = num
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e,item) {
				this.$emit('checkedChange',e,item)
				return
				
				// this.itemType.value = e.name
				console.log("复选框",checkedData);
			},
			//选中某个单选框时，由radio时触发
			radioChange(e){
				// this.showTimePicker = true;
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
</style>
