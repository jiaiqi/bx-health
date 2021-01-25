<template>
	<u-popup v-model="popupStatus" :mask-close-able="maskClose" mode="bottom" :popup="false" length="auto" :safe-area-inset-bottom="true" @close="close">
		<view class="u-datetime-picker">
			<view class="u-picker-header" @touchmove.stop.prevent="">
				<view class="u-btn-picker u-btn-picker--tips" :style="{ color: cancelColor }" hover-class="u-opacity" :hover-stay-time="150" @tap="getResult('cancel')">
					{{ cancelText }}
				</view>
				<view class="u-picker__title">{{ title }}</view>
				<view
					class="u-btn-picker u-btn-picker--primary"
					:style="{ color: moving ? cancelColor : confirmColor }"
					hover-class="u-opacity"
					:hover-stay-time="150"
					@touchmove.stop=""
					@tap.stop="getResult('confirm')"
				>
					{{ confirmText }}
				</view>
			</view>
			<view class="u-picker-body">
				<picker-view :value="valueArr" class="u-picker-view" @change="change" @pickstart="pickstart" @pickend="pickend">
					<picker-view-column v-if="!reset">
						<view v-for="(item, index) in dates" :key="index" class="u-column-item">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view v-for="(item, index) in hours" :key="index" class="u-column-item">
							{{ item.label }}
							<text class="u-text">时</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset">
						<view v-for="(item, index) in minutes" :key="index" class="u-column-item">
							{{ item.label }}
							<text class="u-text">分</text>
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</u-popup>
</template>

<script>
/**
 * 自定义时间选择组件
 * @description 自定义天数、起止小时分钟限制的时间选择组件
 * @property {String} title 标题
 * @property {Boolean} default-time 是否显示取消按钮，默认 false
 * @property {String} mask-close 是否允许通过点击遮罩关闭Picker（默认true）
 * @property {Boolean} days 显示日期的天数
 * @property {Boolean} min-hour 最小小时（默认0）
 * @property {Boolean} max-hour 最大小时（默认23）
 * @property {Boolean} min-minute 最小分钟（默认0）
 * @property {Boolean} max-minute 最大分钟（默认59）
 * @property {String} minute-step 分钟间隔（默认1）
 * @property {Boolean} cancel-color 取消按钮的颜色（默认#606266）
 * @property {Boolean} confirm-color 确认按钮的颜色（默认#2979ff）
 * @property {Boolean} cancel-text 取消按钮的文字
 * @property {Boolean} confirm-text 确认按钮的文字
 * @event {Function} cancel 点击取消按钮的回调
 * @event {Function} confirm 点击确认按钮的回调
 * @event {Function} close 点击 mask/close 关闭弹框的回调
 * @event {Function} complete 弹框关闭的回调(confirm、cancel、close 都会执行)
 * @example
 */
const dateFormat = function(fmt = 'YYYY-MM-DD', date = new Date()) {
	const time = new Date(date);
	const weekArr = ['日', '一', '二', '三', '四', '五', '六'];
	var o = {
		'M+': time.getMonth() + 1, //月份
		'D+': time.getDate(), //日
		'h+': time.getHours(), //小时
		'm+': time.getMinutes(), //分
		's+': time.getSeconds(), //秒
		'q+': Math.floor((time.getMonth() + 3) / 3), //季度
		S: time.getMilliseconds(), //毫秒
		W: time.getDay() //星期
	};
	if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, RegExp.$1 == 'W' ? weekArr[o[k]] : RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	return fmt;
};

export default {
	name: 'BzDatePicker',

	props: {
		// v-model
		value: {
			type: Boolean,
			default: false
		},
		// 当前选中时间，时间格式（2000-01-01 00:00）
		defaultTime: {
			type: String,
			default: ''
		},
		// 提示的标题
		title: {
			type: String,
			default: '请选择'
		},
		// 分钟数递增步长
		minuteStep: {
			type: Number,
			default: 1
		},
		// 天数
		days: {
			type: [String, Number],
			default() {
				return 1;
			}
		},
		// 最小可选小时
		minHour: {
			type: [Number, String],
			default: 0
		},
		// 最大可选小时
		maxHour: {
			type: [Number, String],
			default: 23
		},
		// 最小可选分钟
		minMinute: {
			type: [Number, String],
			default: 0
		},
		// 最大可选分钟
		maxMinute: {
			type: [Number, String],
			default: 59
		},
		// "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: '#2979ff'
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		}
	},

	data() {
		return {
			popupStatus: this.value,
			dates: [], // 日期列表
			hours: [], // 小时列表
			minutes: [], // 分钟列表
			date: '',
			hour: 0,
			minute: 0,
			valueArr: [],
			reset: false,
			moving: false // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
		};
	},

	watch: {
		// 微信和QQ小程序由于一些奇怪的原因(故同时对所有平台均初始化一遍)，需要重新初始化才能显示正确的值
		value: {
			immediate: true,
			handler(val) {
				this.popupStatus = val;
				this.reset = true;
				if (val) {
					// 设置当前打开的时间
					this.showTime = new Date().getTime();
					this.closeType = undefined;
					setTimeout(() => this.init(), 10);
				}
			}
		}
	},

	methods: {
		// 标识滑动开始，只有微信小程序才有这样的事件
		pickstart() {
			// #ifdef MP-WEIXIN
			this.moving = true;
			// #endif
		},

		// 标识滑动结束
		pickend() {
			// #ifdef MP-WEIXIN
			this.moving = false;
			// #endif
		},

		// 小于10前面补0，用于月份，日期，时分秒等
		formatNumber(num) {
			return +num < 10 ? '0' + num : String(num);
		},

		// 生成递进的数组
		generateArray(start, end, step = 1) {
			step = +step;
			start = Math.ceil(+start / step) * step;
			const result = [];
			if (start > end && step > 1) {
				return result;
			}
			while (start <= end) {
				result.push(start);
				start += step;
			}
			return result;
		},

		getIndex(arr, val) {
			const index = arr.findIndex(i => i.value === val);
			// 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0，导致条件不成立
			return ~index ? index : 0;
		},

		//日期时间处理
		initTimeValue() {
			// 格式化时间，在IE浏览器(uni不存在此情况)，无法识别日期间的"-"间隔符号
			let fdate = this.defaultTime.replace(/\-/g, '/');
			fdate = fdate && fdate.indexOf('/') === -1 ? `2020/01/01 ${fdate}` : fdate;
			let time = null;
			if (fdate) time = new Date(fdate);
			else time = new Date(this.showTime);
			// 获取年日月时分秒
			this.date = dateFormat('YYYY-MM-DD', time);
			this.hour = this.formatNumber(Math.max(dateFormat('h', time), this.minHour));
			this.minute = this.formatNumber(Math.ceil(+time.getMinutes() / this.minuteStep) * 10);

			// 时间超出依次递加
			if (this.minute > this.maxMinute) {
				this.minute = this.formatNumber(Math.ceil(this.minMinute / this.minuteStep) * 10);
				this.hour = this.formatNumber(+this.hour + 1);
			}
			if (this.hour > this.maxHour) {
				time = new Date(+new Date(this.date) + 24 * 60 * 60 * 1000);
				this.date = dateFormat('YYYY-MM-DD', time);
				this.hour = this.formatNumber(this.minHour);
				this.minute = this.formatNumber(Math.ceil(this.minMinute / this.minuteStep) * 10);
			}
			// console.log('initTimeValue ->', this.date + ' ' + this.hour + ':' + this.minute)
		},
		init() {
			this.valueArr = [];
			this.reset = false;
			this.initTimeValue();
			this.setDates();
			this.setHours();
			this.setMinutes();
			this.$forceUpdate();
		},

		// 获取指定日期往后推N天的日期列表
		setDates() {
			this.dates = this.generateArray(1, this.days).map(i => {
				return this.getDate(+new Date(this.showTime) + (i - 2) * 24 * 60 * 60 * 1000, i - 1);
			});
			this.valueArr.splice(0, 1, this.getIndex(this.dates, this.date));
			// console.log('this.dates', JSON.parse(JSON.stringify(this.dates)))
		},

		// 根据时间戳获取日期
		getDate(timer, day) {
			const curDate = dateFormat('YYYY-MM-DD', this.showTime);
			const nextDate = dateFormat('YYYY-MM-DD', +new Date(this.showTime) + 24 * 60 * 60 * 1000);
			const dateVal = dateFormat('YYYY-MM-DD', timer);
			const result = {
				label: '',
				value: dateVal
			};
			if (curDate === dateVal) {
				result.label = dateFormat('今天(周W)', timer);
			} else if (nextDate === dateVal) {
				result.label = dateFormat('明天(周W)', timer);
			} else {
				result.label = dateFormat('MM月DD日(周W)', timer);
			}
			return result;
		},

		setHours() {
			this.hours = this.generateArray(this.minHour, this.maxHour).map(i => {
				const val = this.formatNumber(i);
				return {
					label: val,
					value: val
				};
			});
			this.valueArr.splice(1, 1, this.getIndex(this.hours, this.hour));
			// console.log('this.hours', JSON.parse(JSON.stringify(this.hours)))
		},

		setMinutes() {
			this.minutes = this.generateArray(this.minMinute, this.maxMinute, this.minuteStep).map(i => {
				const val = this.formatNumber(i);
				return {
					label: val,
					value: val
				};
			});
			this.valueArr.splice(2, 1, this.getIndex(this.minutes, this.minute));
			// console.log('this.minutes', JSON.parse(JSON.stringify(this.minutes)))
		},

		// 用户更改picker的列选项
		change(e) {
			// console.log(JSON.parse(JSON.stringify(e)))
			const value = [...e.detail.value];
			debugger
			this.valueArr = this.verifyValue(value);
			const isEq = value.toString() === this.valueArr.toString();

			// 如果选中的日期值与验证后的不一样，则通过 this.reset 来进行重置，直接设置value不生效
			if (!isEq) this.reset = true;
			setTimeout(() => {
				this.date = this.dates[this.valueArr[0]].value;
				this.hour = this.hours[this.valueArr[1]].value;
				this.minute = this.minutes[this.valueArr[2]].value;
				if (!isEq) this.reset = false;
				// console.log(
				//   'change -> ',
				//   JSON.parse(JSON.stringify(this.valueArr)),
				//   this.date,
				//   this.hour,
				//   this.minute
				// )
			}, 0);
		},

		// 验证picker value有效性，并设置为合法值
		verifyValue(value) {
			const newValue = [...value];
			let curDate = dateFormat('YYYY-MM-DD', this.showTime);
			let curHour = dateFormat('hh', this.showTime);
			let curMinute = this.formatNumber(Math.ceil(dateFormat('mm', this.showTime) / this.minuteStep) * this.minuteStep);

			// 当前分钟大于最大分钟数，重置分钟为最小值，小时加1
			if (curMinute > this.maxMinute) {
				curMinute = this.formatNumber(Math.ceil(this.minMinute / this.minuteStep) * this.minuteStep);
				curHour = this.formatNumber(+curHour + 1);
			}

			// 当前小时大于最大小时，重置小时为最小值，日期加1
			if (curHour > this.maxHour) {
				curDate = dateFormat('YYYY-MM-DD', this.showTime + 24 * 60 * 60 * 1000);
				curHour = this.formatNumber(this.minHour);
				curMinute = this.formatNumber(Math.ceil(this.minMinute / this.minuteStep) * this.minuteStep);
			}

			// 获取日期、小时、分钟 所在的下标值（最小下标值）
			const curDateIndex = this.dates.findIndex(i => i.value === curDate);
			const curHourIndex = this.hours.findIndex(i => i.value === curHour);
			const curMinuteIndex = this.minutes.findIndex(i => i.value === curMinute);

			// console.log('newValue', newValue)
			// console.log('curTime', curDate, curHour, curMinute)
			// console.log('curIndex', curDateIndex, curHourIndex, curMinuteIndex)

			// 日期小于最小值，重置日期
			if (newValue[0] < curDateIndex) {
				newValue[0] = curDateIndex;
				// console.log('日期太小', newValue)
			}

			// 小时小于最小值 且 日期为最小值时，重置小时
			if (newValue[1] < curHourIndex && newValue[0] === curDateIndex) {
				newValue[1] = curHourIndex;
				// console.log('小时太小', newValue)
			}

			// 分钟小于最小值 且 小时为最小值 且 日期为最小值时，重置分钟
			if (newValue[2] < curMinuteIndex && newValue[1] === curHourIndex && newValue[0] === curDateIndex) {
				newValue[2] = curMinuteIndex;
				// console.log('分钟太小', newValue)
			}

			return newValue;
		},

		// 用户点击确定按钮
		getResult(event = null) {
			// #ifdef MP-WEIXIN
			if (this.moving) return;
			// #endif

			const result = this.date + ' ' + this.hour + ':' + this.minute;
			this.closeType = event;
			if (event) this.$emit(event, result);
			this.hide();
		},

		hide() {
			this.$emit('input', false);
		},

		close(event) {
			if (!this.closeType) this.$emit('close');
			this.hide();
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'uview-ui/libs/css/style.components.scss';

.u-datetime-picker {
	position: relative;
	z-index: 999;
}

.u-picker-view {
	height: 100%;
	box-sizing: border-box;
}

.u-picker-header {
	width: 100%;
	height: 90rpx;
	padding: 0 40rpx;
	@include vue-flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	font-size: 30rpx;
	background: #fff;
	position: relative;
}

.u-picker-header::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid #eaeef1;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.u-picker__title {
	color: $u-content-color;
}

.u-picker-body {
	width: 100%;
	height: 500rpx;
	overflow: hidden;
	background-color: #fff;
}

.u-column-item {
	@include vue-flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: $u-main-color;
	padding: 0 8rpx;
}

.u-text {
	font-size: 24rpx;
	padding-left: 8rpx;
}

.u-btn-picker {
	padding: 16rpx;
	box-sizing: border-box;
	text-align: center;
	text-decoration: none;
}

.u-opacity {
	opacity: 0.5;
}

.u-btn-picker--primary {
	color: $u-type-primary;
}

.u-btn-picker--tips {
	color: $u-tips-color;
}
</style>
