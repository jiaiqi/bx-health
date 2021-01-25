<template>
	<view class="container">
		<!-- tab栏 -->
		<scroll-view class="scroll-view_H b-t b-b" scroll-x>
			<block v-for="(item, index) in dateArr" :key="index">
				<div class="flex-box" @click="selectDateEvent(index, item)" :style="{ 'box-shadow': index == dateActive ? 'inset 0 -2px 0 0 ' + selectedTabColor : '' }">
					<view class="date-box">
						<text class="days" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">{{ item.week }}</text>
						<text class="date" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">{{ item.date }}</text>
					</view>
				</div>
			</block>
		</scroll-view>
		<!-- 时间选项 -->
		<view class="time-box">
			<block v-for="(item, _index) in timeArr" :key="_index">
				<view class="item">
					<view
						class="item-box"
						:class="{ disable: item.disable, active: timeActive.indexOf(_index) >= 0 }"
						:style="{
							background: _index <= timeActive[1] && _index >= timeActive[0] ? selectedItemColor : '#F1F3F6',
							filter: _index < timeActive[1] && _index > timeActive[0] ? 'opacity(0.3)' : ''
						}"
						@click="selectTimeEvent(_index, item)"
					>
						<text>{{ item.time }}</text>
						<text class="all" v-if="item.disable">{{ disableText }}</text>
						<text class="all" v-if="_index == timeActive[0] && !item.disable" style="font-size: 12upx;">开始时间</text>
						<text class="all" v-if="_index == timeActive[1] && !item.disable" style="font-size: 12upx;">结束时间</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { dateData, timeData, timeStamp } from './date.js';
let maxIndex;
export default {
	props: {
		//开始时间选项
		startTime: {
			type: String,
			default: '08:00'
		},
		//结束时间选项
		endTime: {
			type: String,
			default: '18:00'
		},
		// 提前预约的时间
		advanceTime: {
			type: Number,
			default: 0
		},
		// 默认选择的时间段间隔
		timeSlot: {
			type: Number,
			default: 2
		},
		//时间间隔
		timeInterval: {
			type: [Number, String],
			default: 0.5 //半小时
		},
		//选中的tab颜色
		selectedTabColor: {
			type: String,
			default: '#0092D5'
		},
		//选中的时间颜色
		selectedItemColor: {
			type: String,
			default: '#0094D7'
		},

		//禁用显示的文本
		disableText: {
			type: String,
			default: '约满'
		}
	},
	data() {
		return {
			dateArr: [], //日期数据
			timeArr: [], //时间数据
			dateActive: 0, //选中的日期索引
			timeActive: [], //选中的时间索引
			oldTimeActive: [], //保存用户筛选的时间
			selectDate: '', //选择的日期数据
			selectTime: [], //选择的时间
			oldSelectTime: '',
			currentTimeStamp: '',
			currentTime: '',
			tabs: 0
		};
	},
	created() {
		//获取日期tab数据
		this.dateArr = dateData();
		//获取时间数据
		this.timeArr = timeData(this.startTime, this.endTime, this.timeInterval);
		maxIndex = this.timeArr[this.timeArr.length - 1]['index'];
		//当前时间戳
		this.currentTimeStamp = Date.now() + this.advanceTime * 3600 * 1000;
		this.currentTime = timeStamp(this.currentTimeStamp).hour;
		this.timeArr.map(item => {
			if (item.time > this.currentTime) {
				return (item.disable = 0); //判断当前时间大于时间选项则禁用
			} else {
				return (item.disable = 1);
			}
		});
		//默认选中的日期
		this.selectDate = `${this.dateArr[0]['date']}(${this.dateArr[0]['week']})`;
		this.timeArr.some((item, index) => {
			// 默认选中的时间段
			const endIndex = this.timeSlot / this.timeInterval + index > maxIndex ? maxIndex : this.timeSlot / this.timeInterval + index;
			this.selectTime = [this.timeArr[index]['time'], this.timeArr[endIndex]['time']]; //默认选中的时间
			this.oldSelectTime = this.selectTime; //存储选中的时间
			this.timeActive = [index, endIndex]; //选中的时间索引
			this.oldTimeActive = [index, endIndex];
			return !item.disable;
		});
	},
	methods: {
		selectDateEvent(index, item) {
			this.tabs = 0;
			if (this.currentTimeStamp < item.timeStamp) {
				const endIndex = this.timeSlot / this.timeInterval;
				this.timeActive = [0, endIndex];
				this.selectTime = [this.timeArr[0]['time'], this.timeArr[endIndex]['time']];
				this.timeArr.map(item => {
					return (item.disable = 0);
				});
			} else {
				this.timeActive = this.oldTimeActive;
				this.selectTime = this.oldSelectTime;
				this.timeArr.map(item => {
					if (item.time > this.currentTime) {
						return (item.disable = 0);
					} else {
						return (item.disable = 1);
					}
				});
			}
			this.dateActive = index;
			this.selectDate = `${this.dateArr[index]['date']}(${this.dateArr[index]['week']})`;
			this.$emit('selectTime', `${this.selectDate}${this.selectTime.join('-')}`);
		},
		selectTimeEvent(index, item) {
			if (item.disable || this.timeActive.indexOf(index) > -1) return;
			this.tabs++;
			if (this.tabs % 2 == 0) {
				this.$set(this.timeActive, 1, index);
				this.selectTime[1] = this.timeArr[index]['time'];
			} else {
				this.$set(this.timeActive, 0, index);
				this.selectTime[0] = this.timeArr[index]['time'];
			}
			// 判断用户选择的时间是否大于第一次选择的时间
			if (this.timeActive[0] > this.timeActive[1]) {
				const tempTime = this.selectTime[0];
				const tempIndex = this.timeActive[0];
				this.selectTime[0] = this.selectTime[1];
				this.selectTime[1] = tempTime;
				this.$set(this.timeActive, 0, this.timeActive[1]);
				this.$set(this.timeActive, 1, tempIndex);
			}
			// this.timeActive = index
			// this.selectTime = this.timeArr[index]['time']
			this.$emit('selectTime', `${this.selectDate}${this.selectTime.join('-')}`);
		}
	}
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
