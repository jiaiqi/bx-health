<template>
	<view class="balanced-diet" :class="{ 'component-page': pageType }">
		<view class="switch-date" @click="changeSignDate">
			<text>{{ selectDate }}</text>
			<text class="cuIcon-calendar" color="#333" size="30"></text>
		</view>
		<view class="diet-wrap" v-if="pageType == 'diet' || pageType == 'sport'">
			<view class="main-box">
				<view class="main-content main-content-t">
					<view class="main-box-title">能量等式</view>
					<view class="energy-item" @click="changePageType('diet')">
						<view class="text">饮食摄入</view>
						<view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
					</view>
					<view class="operate">-</view>
					<view class="energy-item" @click="changePageType('sport')">
						<view class="text">运动消耗</view>
						<view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
					</view>
					<view class="operate">-</view>
					<view class="energy-item" @click="changePageType('weight')">
						<view class="text">基础代谢</view>
						<view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0' }}</view>
					</view>
					<view class="operate" @click="changePageType('weight')">=</view>
					<view class="energy-item">
						<view class="text">体重变化</view>
						<view
							class="number"
							:class="{ 'text-red': parseFloat(energyChange) > 0, 'text-green': parseFloat(energyChange) < 0 }"
							style="display: flex; width: 90px; justify-content: space-between"
						>
							<text style="flex: 1">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
							<text class="units">大卡</text>
						</view>
						<view
							class="number"
							:class="{ 'text-red': parseFloat(energyChange) > 0, 'text-green': parseFloat(energyChange) < 0 }"
							style="display: flex; width: 90px; justify-content: space-between"
						>
							<text style="flex: 1">
								{{
									energyChange === 0
										? '0.0'
										: parseFloat(energyChange / 7.7) > 0
										? `+${parseFloat(energyChange / 7.7).toFixed(1)}`
										: parseFloat(energyChange / 7.7).toFixed(1)
								}}
							</text>
							<text class="units">g脂肪</text>
						</view>
					</view>
					<view class="bmi-tip-box" v-if="weightUp">
						<text class="cuIcon-warn text-yellow margin-right-xs"></text>
						<text>根据您近期的饮食运动记录及身体数据分析,若长期保持当前的饮食习惯,您的体重将会在一个月后后增长</text>
						<text class="text-red text-bold">{{ weightUp }}</text>
						,建议合理饮食并适当进行运动
					</view>
				</view>
			</view>
			<view class="main-box main-box-plus" v-if="!pageType || pageType === 'diet'">
				<view class="title">
					<view class="label">
						营养素摄入情况分析
						<text class="cuIcon-rankfill"></text>
					</view>
				</view>
				<view class="chart-box">
					<!-- #ifdef MP-WEIXIN -->
					<uni-ec-canvas class="uni-ec-canvas" @click-chart="clickCharts" canvas-id="nutrients-canvas" :ec="nutrientsChartOption"></uni-ec-canvas>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<uni-echarts
						@click-chart="clickCharts"
						class="uni-ec-canvas"
						canvas-id="nutrients-canvas"
						:ec="nutrientsChartOption"
						v-if="nutrientsChartOption && nutrientsChartOption.option"
					></uni-echarts>
					<!-- #endif -->
				</view>
				<view class="indicator">
					<view
						class="btn"
						v-for="(item, index) in radioArr"
						:key="index"
						:class="{
							'active-btn': index === subIndex
						}"
					>
						<button
							class="cu-btn text-white"
							:style="{
								'background-color': index === 0 ? '#5098ff' : index === 1 ? '#999' : index === 2 ? 'rgb(141, 198, 63)' : index === 3 ? '#ff9900' : ''
							}"
							@click="changeSub(index)"
						>
							{{ item.label }}
						</button>
					</view>
				</view>
				<view class="" style="width: 100%;">
					<view class="tips" v-if="!hasRecord">请先添加您的饮食记录</view>
					<view v-for="(item, index) in energyList" :key="index" class="main-box">
						<view class="main-top">
							<view class="main-title">
								<text>{{ item.title }}</text>
								<text>({{ item.units }})</text>
							</view>
						</view>
						<view class="main-content ele-content" v-if="energyList.length > 0">
							<view v-for="(alone, i) in item.matterList" :key="i" class="ele-item" @click="toDetail(alone, item)">
								<view class="ele-item-wrap" v-if="subIndex === 1 ? alone.value < alone.EAR || alone.value > alone.UL : true">
									<text class="ele-item-name">{{ alone.shortName }}</text>
									<view class="bg-white probar">
										<view class="cu-progress progress-bar radius pro-rad">
											<view class="pointer" :style="{ left: `${alone.value_left ? alone.value_left : 0}px` }">
												<view
													class="after"
													:class="{
														lack: alone.value < alone.EAR,
														normal: alone.value >= alone.EAR && (alone.value <= alone.UL || !alone.UL),
														over: alone.UL && alone.value > alone.UL
													}"
												>
													{{
														alone.value === 0
															? alone.shortName === 'E'
																? 0 + 'mg/d'
																: '0'
															: alone.shortName === 'E'
															? alone.value.toFixed(1) + 'mg/d'
															: alone.value.toFixed(1)
													}}
												</view>
											</view>
											<view
												class="bg-grey EAR"
												:style="{
													width: alone.left_width ? alone.left_width + 'px' : '33%'
												}"
											>
												<view class="after">{{ alone.left_width ? alone.EAR : '' }}</view>
											</view>
											<view
												class="bg-olive regular"
												:style="{
													width: alone.center_width ? alone.center_width + 'px' : '33%',
													'border-top-right-radius': !alone.UL ? '5px' : '',
													'border-bottom-right-radius': !alone.UL ? '5px' : ''
												}"
											></view>
											<view
												class="bg-red risk"
												:style="{
													width: alone.UL && alone.right_width ? alone.right_width + 'px' : !alone.UL ? 0 : '33%'
												}"
											>
												<view
													class="before"
													:class="{
														lack: alone.value < alone.EAR,
														normal: alone.value >= alone.EAR && (alone.value <= alone.UL || !alone.UL),
														over: alone.UL && alone.value > alone.UL
													}"
												>
													{{ alone.value < alone.EAR ? '不足' : alone.UL && alone.value > alone.UL ? '过多' : '正常' }}
												</view>
												<view class="after">{{ alone.right_width && alone.UL ? alone.UL : '' }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-box symptom" v-if="!pageType || pageType === 'diet'">
				<view class="title">
					<view class="label">饮食</view>
					<view class="switch-layout">
						<text class="cuIcon-list" :class="{ 'active-layout': dietLayout === 'list' }" @click="dietLayout = 'list'"></text>
						<text class="cuIcon-apps" :class="{ 'active-layout': dietLayout === 'grid' }" @click="dietLayout = 'grid'"></text>
					</view>
				</view>
				<view class="record-box" @click.self="clickDietBox">
					<view class="table" v-if="dietLayout === 'list'">
						<view class="no-data" v-if="!dietRecord || dietRecord.length === 0" @click="toPages('food')">
							<view class="cuIcon-add text-black" style="font-size: 38rpx"></view>
							点击添加饮食记录
						</view>
						<view class="row" v-for="(item, index) in dietRecord" :key="index">
							<view class="readonly" @click="clickDietRecordItem(item)">
								<view class="img"><image mode="scaleToFill" class="img" :src="getDownloadPath(item)"></image></view>
								<view class="column center">
									<view class="name">{{ item.name }}</view>
									<view class="number">{{ item.unit !== 'g' ? item.amount + item.unit : item.amount * item.unit_weight_g + item.unit }}</view>
								</view>
								<view class="column time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<view class="column">
									<text class="heat">
										<text class="text text-orange">{{ item.energy }}</text>
										千卡
									</text>
									<text class="cuIcon-right" v-if="dietLayout === 'list'"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="table grid-layout" v-if="dietLayout === 'grid'">
						<view class="diet-item" v-for="(item, index) in dietRecord" :key="index" @click="clickDietRecordItem(item)">
							<image class="u-image" :src="getDownloadPath(item)" mode="scaleToFill"></image>
							<view class="diet-detail">
								<view class="name">{{ item.name }}</view>
								<view class="number">
									<text class="heat">{{ item.energy }}千卡</text>
								</view>
								<view class="number">
									<text>{{ item.unit !== 'g' ? item.amount + item.unit : item.amount * item.unit_weight_g + item.unit }}</text>
									<text class="time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</text>
								</view>
							</view>
						</view>
						<view class="diet-item" @click="toPages('food')"><text class="cuIcon-add add-icon"></text></view>
					</view>
				</view>
			</view>
			<view class="main-box symptom" v-if="!pageType || pageType === 'sport'">
				<view class="title">
					<view class="label">运动</view>
					<view class="switch-layout">
						<text class="cuIcon-list" :class="{ 'active-layout': sportLayout === 'list' }" @click="sportLayout = 'list'"></text>
						<text class="cuIcon-apps" :class="{ 'active-layout': sportLayout === 'grid' }" @click="sportLayout = 'grid'"></text>
					</view>
				</view>
				<view class="record-box" @click.self="clickSportBox">
					<view class="table" v-if="sportLayout === 'list'">
						<view class="no-data" v-if="!sportsRecord || sportsRecord.length === 0" @click="toPages('sport')">
							<view class="cuIcon-add text-black" style="font-size: 38rpx"></view>
							点击添加运动记录
						</view>
						<view class="row" v-for="(item, index) in sportsRecord" :key="index">
							<view class="readonly" @click="clickSportRecordItem(item)">
								<view class="img"><image class="img" mode="aspectFit" :src="getDownloadPath(item)"></image></view>
								<view class="column center">
									<view class="name">{{ item.name }}</view>
									<view class="number">{{ item.amount + item.unit }}</view>
								</view>
								<view class="column time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
								<view class="column">
									<text class="heat">
										<text class="text text-green">{{ item.energy }}</text>
										千卡
									</text>
									<text class="cuIcon-right"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="table grid-layout" v-if="sportsRecord && sportLayout === 'grid'">
						<view class="diet-item" v-for="(item, index) in sportsRecord" :key="index" @click="clickSportRecordItem(item)">
							<image  class="u-image" :src="getDownloadPath(item)" mode="scaleToFill"></image>
							<view class="diet-detail">
								<view class="name">{{ item.name }}</view>
								<view class="number">
									<text class="heat">{{ item.energy }}千卡</text>
								</view>
								<view class="number">
									<text>{{ item.amount + item.unit }}</text>
									<text class="time">{{ item.htime ? item.htime.slice(0, 5) : '' }}</text>
								</view>
							</view>
						</view>
						<view class="diet-item" @click="toPages('sport')"><text class="cuIcon-add add-icon"></text></view>
					</view>
				</view>
				<!-- </u-read-more> -->
			</view>
			<view class="main-box symptom" v-if="!pageType || pageType === 'symptom'">
				<view class="title">症状</view>
				<view class="symptom-box">
					<view class="symptom-item" v-for="(item, index) in symptomList" :key="index">{{ item.name }}</view>
					<view class="symptom-item symptom-add" @click="addSymptom">+</view>
				</view>
			</view>
			<!-- <view class="main-box symptom">
				<view class="title">慢病风险</view>
				<view class="symptom-box">
					<view class="symptom-item" v-for="(item, index) in diseaseList" :key="index" v-show="item.disease_name">{{ item.disease_name }}</view>
					<view class="symptom-item symptom-add">+</view>
				</view>
			</view> -->
		</view>
		<!-- <u-popup v-model="showEditModal" mode="bottom"> -->
		<view class="cu-modal bottom-modal" :class="{ show: showEditModal }" @click.self="(showEditModal = false), (currentRecord = null)">
			<view class="cu-dialog current-diet-detail" v-if="currentRecord">
				<view class="title-bar" v-if="currentRecord.hdate && currentRecord.htime">
					<view class="date">{{ currentRecord.hdate + ' ' + currentRecord.htime.slice(0, 5) }}</view>
				</view>
				<view class="diet-info">
					<view class="img"><image mode="aspectFit" class="img" :src="currentDietImgUrl"></image></view>
					<view class="info">
						<view class="name">
							{{ currentRecord.name }}
							<view class="delete-icon" @click="deleteItem(currentRecord)">
								<text class="text">删除记录</text>
								<text class="cuIcon-delete"></text>
							</view>
						</view>
						<view class="weight">
							<text class="label margin-right-xs">热量:</text>
							<text class="heat">
								{{ currentRecord.energy }}
								<text class="unit">千卡</text>
							</text>
						</view>

						<view class="">
							<text class="label text-bold margin-right-xs">单位:</text>
							<text class="unit">{{ currentRecord.unit }}</text>
						</view>
					</view>
					<view class="chart-box">
						<!-- #ifdef MP-WEIXIN -->
						<uni-ec-canvas class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="currentDietChartData"></uni-ec-canvas>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<uni-echarts class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="currentDietChartData"></uni-echarts>
						<!-- #endif -->
					</view>
					<view class="cook-type-box" v-if="currentRecord && currentRecordType === 'food'">
						<view class="title">烹调方式:</view>
						<view class="current-cook-type" v-if="currentRecord.cook_method" @click="showCookTypes">{{ currentRecord.cook_method }}</view>
						<text class="" v-if="!currentRecord.cook_method" @click="showCookTypes">(点击选择烹调方式)</text>
						<text class="lg text-gray cuIcon-right" v-if="cookTypes.length > 0"></text>
					</view>
					<view class="unit-box" v-if="currentRecordType === 'food'">
						<view class="title">单位:</view>
						<view class="unit-item" :class="{ 'active-unit': currentUnitIndex === index }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">
							{{ u.unit_weight_g && u.unit === 'g' ? u.unit_weight_g + u.unit : u.unit }}
						</view>
					</view>
					<view class="amount">
						<view class="title">数量:</view>
						<view class="number-box">
							<text @click="changeCurrentVal('minus', 0.1)" class="symbol">-0.1</text>
							<text @click="changeCurrentVal('minus')" class="symbol">-1</text>
							<input class="input" @change="changeValue" v-model.number="currentRecord.amount" type="number" />
							<text @click="changeCurrentVal('plus')" class="symbol">+1</text>
							<text @click="changeCurrentVal('plus', 0.1)" class="symbol">+0.1</text>
						</view>
					</view>
				</view>
				<view class="delete-bar">
					<view
						class="btn bg-grey"
						@click="
							showEditModal = false;
							currentRecord = null;
						"
					>
						取消
					</view>
					<view class="btn bg-blue" @click="UpdateDietInfo">确认</view>
				</view>
			</view>
		</view>
		<view class="add-button" @click="clickAddButton"><view class="cuIcon-add"></view></view>
		<u-popup v-model="showPopup" mode="bottom" border-radius="50">
			<view class="popup-box">
				<view class="icon-item" @click="toPages('food')">
					<image src="@/archivesPages/static/icon/yinshi.png" mode="" class="icon"></image>
					<text class="label">饮食</text>
				</view>
				<view class="icon-item" @click="toPages('sport')">
					<image src="@/archivesPages/static/icon/yundong.png" mode="" class="icon"></image>
					<text class="label">运动</text>
				</view>
				<view class="icon-item" @click="toPages('weight')">
					<image src="@/archivesPages/static/icon/tizhong.png" mode="" class="icon"></image>
					<text class="label">体重</text>
				</view>
				<view class="icon-item" @click="toPages('sleep')">
					<image src="@/archivesPages/static/icon/sleep.png" mode="" class="icon"></image>
					<text class="label">睡眠</text>
				</view>
				<view class="icon-item" @click="toPages('heartRate')">
					<image src="@/archivesPages/static/icon/xinlv.png" mode="" class="icon"></image>
					<text class="label">心率</text>
				</view>
				<view class="icon-item" @click="toPages('pressure')">
					<image src="@/archivesPages/static/icon/xueya.png" mode="" class="icon"></image>
					<text class="label">血压</text>
				</view>
				<view class="icon-item" @click="toPages('oxygen')">
					<image src="@/archivesPages/static/icon/xueyang.png" mode="" class="icon"></image>
					<text class="label">血氧</text>
				</view>
				<view class="icon-item" @click="toPages('glucose')">
					<image src="@/archivesPages/static/icon/xuetang.png" mode="" class="icon"></image>
					<text class="label">血糖</text>
				</view>
			</view>
			<view class="close-icon"><text @click="showPopup = false" class="cuIcon-close"></text></view>
		</u-popup>
		<view @click.self="closeDay" class="cu-modal" style="display: flex; align-items: center" :class="modalName == 'Modal' ? 'show' : ''">
			<view style="height: 43vh" class="cu-dialog">
				<bx-date-stamp v-show="showTimeSignPicker" ref="ren" :markDays="markDays" :headerBar="true" @onDayClick="onDayClick"></bx-date-stamp>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="isShowCookType ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white cook-top">
					<view class="action text-blue" @tap="isShowCookType = false">取消</view>
					<text>常见烹调方式</text>
					<view class="action text-green" @tap="isShowCookType = false"></view>
				</view>
				<view class="cooktype-wrap" v-if="currentRecord">
					<view
						@click="chooseCookType(cook)"
						v-for="(cook, c) in cookTypes"
						:key="c"
						class="cook-item"
						:class="{
							'active-cook-item': currentRecord && currentRecord.cook_method && currentRecord.cook_method===cook.value
						}"
					>
						<text>{{ cook.value }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import bxDateStamp from '@/archivesPages/components/bx-date-stamp/bx-date-stamp.vue';
import xflSelect from '@/archivesPages/components/xfl-select/xfl-select.vue';
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/archivesPages/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/archivesPages/components/uni-ec-canvas/uni-echarts.vue';
// #endif
let self;
export default {
	components: {
		xflSelect,
		bxDateStamp,
		// #ifdef MP-WEIXIN
		uniEcCanvas,
		// #endif
		// #ifdef H5
		uniEcharts
		// #endif
	},
	data() {
		return {
			isShowCookType: false,
			cookTypes: [], //烹调方式集合
			unitList: [],
			dietLayout: 'grid',
			sportLayout: 'grid', //grid,list
			nutrientsChartOption: {
				option: {
					color: ['#92d050', '#f79646', '#4f81bd'],
					title: { text: '' },
					legend: { data: ['已选', '超标部分', 'NRV%达标线'] },
					grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
					xAxis: [
						{
							type: 'category',
							data: ['蛋白', '脂肪', '碳水', 'VA', 'VE', 'VB1', 'B2', '烟酸', '叶酸', 'VC', '钙', '磷', '镁', '钾', '铁', '锌', '硒', '铜', '锰'],
							axisLabel: { rotate: 70, interval: 0, fontSize: 10 }
						}
					],
					yAxis: [
						{
							type: 'value',
							max: 120,
							axisLabel: { formatter: '{value}%' }
						}
					],
					series: [
						{ name: '已选', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], type: 'bar', stack: '营养素' },
						{ name: '超标部分', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], type: 'bar', stack: '营养素' },
						{ name: 'NRV%达标线', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100], type: 'line', stack: false }
					]
				}
			},
			currentDietChartData: {},
			currentUnitIndex: 0,
			showUserList: false,
			backTextStyle: {
				width: '100rpx',
				color: '#fff'
			},
			markDays: [],
			userMenuList: [],
			navBackground: {
				backgroundColor: '#0bc99d'
			},
			modalName: '',
			showTimeSignPicker: false,
			userInfo: { name: '' },
			showPopup: false, // 添加弹窗
			foodListDisplay: false,
			sportListDisplay: false,
			showEditModal: false, // 是否显示食物/运动记录编辑弹框
			subColor: '#999',
			subIndex: 4,
			radioArr: [
				{
					key: '全部',
					name: '全部',
					label: '全部(17)',
					value: 'all',
					num: 0
				},
				{
					key: '不足',
					name: '不足',
					label: '不足(17)',
					value: 'lack',
					num: 0
				},
				{
					key: '正常',
					name: '正常',
					label: '正常(0)',
					value: 'normal',
					num: 0
				},
				{
					key: '过高',
					name: '过高',
					label: '过高(0)',
					value: 'over',
					num: 0
				}
			],
			selectRadio: '',
			field: {},
			symptomList: [],
			list: [],
			radio: '',
			loginUserInfo: {},
			dietRecord: [],
			sportsRecord: [],
			dietIn: 0, //饮食摄入
			sportOut: 0, //运动消耗
			editable: false,
			currentType: 'food',
			currentData: [],
			currentRecord: {}, // 当前编辑的记录
			currentRecordType: {}, // 当前编辑的记录类型 食物/运动
			currentColumn: '',
			currentIndex: 0,
			currentVal: 0,
			selectDate: this.formateDate(new Date(), 'date'),
			addType: 'food',
			onSelect: '', //新增表单中打开时间选择器时 onSelect为form
			onEditor: '',
			formData: {
				userno: '',
				hdate: this.formateDate(new Date(), 'date'),
				htime: '',
				name: '',
				amount: '',
				unit: '',
				energy: ''
			},
			sportType: [],
			foodType: [],
			pageInfo: { total: 0, pageNo: 1, rownumber: 10 },
			picker: [],
			pickerIndex: -1,
			foodList: [],
			sportList: [],
			wxUserInfo: {},
			unit_energy: '', //当前选项每单位的能量
			symptomDiseaseList: [], // 病症-疾病对照
			diseaseList: [],
			energyListWrap: [
				{
					title: '有机大分子',
					units: 'g/d',
					matterList: [
						{
							label: '蛋白',
							name: '蛋白',
							shortName: '蛋白',
							key: 'protein',
							EAR: 0.9, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							label: '脂肪',
							name: '脂肪',
							shortName: '脂肪',
							key: 'axunge',
							EAR: 0, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							label: '碳水',
							name: '碳水',
							shortName: '碳水',
							key: 'carbohydrate',
							EAR: 0, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						}
					]
				},
				{
					title: '脂溶性维生素',
					units: 'ug/d',
					matterList: [
						{
							label: '维生素A',
							name: 'VA',
							shortName: 'A',
							key: 'vitamin_a',
							EAR: 560, // 平均需要量
							UL: 3000, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						// {
						// 	name: 'D',
						// 	key: 'vitamin_d',
						// 	EAR: 8,
						// 	UL: 50,
						// 	value: 0
						// },
						{
							label: '维生素E',
							name: 'VE',
							shortName: 'E',
							EAR: 14,
							key: 'vitamin_e',
							UL: 700,
							value: 0
						}
						// {
						// 	name: 'K',
						// 	EAR: 50,
						// 	key: 'vitamin_k',
						// 	UL: 80,
						// 	value: 0
						// }
					]
				},
				{
					title: '水溶性维生素',
					units: 'mg/d',
					matterList: [
						{
							label: '维生素B1',
							name: 'VB1', //名字
							shortName: 'B1',
							key: 'vitamin_b1',
							EAR: 1.3, // 平均需要量
							UL: 0, // 可耐受最高摄入量
							value: 0 // 当前值
						},
						{
							label: '维生素B2',
							name: 'B2',
							shortName: 'B2',
							key: 'vitamin_b2',
							EAR: 1.3,
							UL: 0,
							value: 0
						},
						{
							label: '烟酸(vb3)',
							shortName: 'B3',
							name: '烟酸',
							EAR: 12,
							key: 'vitamin_b3',
							UL: 0,
							value: 0
						},
						{
							label: '叶酸',
							shortName: 'B9',
							name: '叶酸',
							EAR: 0.32,
							key: 'folic_acid',
							UL: 0,
							value: 0
						},
						{
							label: '维生素C',
							shortName: 'C',
							name: 'VC',
							EAR: 85,
							key: 'vitamin_c',
							UL: 0,
							value: 0
						}
					]
				},
				{
					title: '常量矿物质',
					units: 'mg/d',
					matterList: [
						{
							label: '钙',
							name: '钙', //名字
							shortName: '钙',
							EAR: 650, // 低值
							UL: 2000, // 最大值
							key: 'element_ca',
							value: 0 // 当前值
						},
						{
							label: '磷',
							name: '磷', //名字
							shortName: '磷',
							EAR: 600, // 低值
							UL: 3500, // 最大值
							key: 'element_p',
							value: 0 // 当前值
						},
						{
							label: '镁',
							name: '镁',
							shortName: '镁',
							EAR: 280,
							UL: 1000,
							key: 'element_mg',
							value: 0
						},
						{
							label: '钾',
							shortName: '钾',
							name: '钾',
							EAR: 2000,
							UL: 3600,
							key: 'element_k',
							value: 0
						}
					]
				},
				{
					title: '微量矿物质',
					units: 'mg/d',
					matterList: [
						{
							name: '铁', //名字
							label: '铁', //名字
							shortName: '铁',
							EAR: 12, // 低值
							UL: 50, // 最大值
							key: 'element_fe',
							value: 0 // 当前值
						},
						{
							name: '锌',
							label: '锌', //名字
							shortName: '锌',
							EAR: 12.5,
							UL: 45,
							key: 'element_zn',
							value: 0
						},
						{
							label: '硒', //名字
							name: '硒',
							shortName: '硒',
							EAR: 50,
							UL: 80,
							key: 'element_se',
							value: 0
						},
						{
							name: '铜',
							label: '铜', //名字
							shortName: '铜',
							EAR: 0.6,
							UL: 8,
							key: 'element_cu',
							value: 0
						},
						{
							label: '锰', //名字
							shortName: '锰',
							name: '锰',
							EAR: 4.5,
							UL: 11,
							key: 'element_mn',
							value: 0
						}
					]
				}
			],
			energyList: []
		};
	},
	watch: {
		symptomList: {
			handler(newValue, oldValue) {
				console.log('-----------');
				if (Array.isArray(newValue) && newValue.length > 0) {
					this.getSymptomDiseaseList(newValue);
				} else {
					this.diseaseList = [];
				}
			}
		}
	},
	props: {
		pageType: {
			type: String
		}
	},
	computed: {
		bx_auth_ticket() {
			return uni.getStorageSync('bx_auth_ticket');
		},
		profile_url() {
			if (this.userInfo.profile_url) {
				return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			} else if (this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			}
		},
		currentDietImgUrl() {
			let currentDiet = this.currentRecord;
			if (currentDiet && currentDiet.image) {
				return this.$api.downloadFile + currentDiet['image'] + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		},
		hasRecord() {
			return this.dietRecord.length > 0;
		},
		energyChange() {
			return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		basicOut() {
			//基础代谢
			// IF(B4="男",IF(B3>=60,B2*13.4+490,IF(B3>=31,B2*11.5+830,B2*15.2+680)),IF(B3>=60,B2*10.4+600,IF(B3>=31,B2*8.6+830,B2*14.6+450)))
			if (this.userInfo.sex === '男') {
				if (this.age >= 60) {
					return this.userInfo.weight * 13.4 + 490;
				} else if (this.age >= 31 && this.age < 60) {
					return this.userInfo.weight * 11.5 + 830;
				} else {
					return this.userInfo.weight * 15.2 + 600; //<31
				}
			} else {
				if (this.age >= 60) {
					return this.userInfo.weight * 10.4 + 600;
				} else if (this.age >= 31 && this.age <= 60) {
					return this.userInfo.weight * 8.6 + 830;
				} else {
					return this.userInfo.weight * 14 + 450; //<31
				}
			}
		},
		BMI() {
			if (this.userInfo.weight && this.userInfo.height) {
				return (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1);
			}
		},
		weightUp() {
			if (this.userInfo.weight && this.userInfo.height) {
				let bmi = (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1);
				if (bmi >= 24) {
					let dietIn =
						this.energyChange === 0
							? '0.0'
							: parseFloat(this.energyChange / 7.7) > 0
							? `${parseFloat(this.energyChange / 7.7).toFixed(1)}`
							: parseFloat(this.energyChange / 7.7).toFixed(1);
					dietIn = dietIn * 30;
					if (dietIn > 0) {
						if (dietIn / 1000 >= 1) {
							dietIn = Number((dietIn / 1000).toFixed(1)) + 'kg';
						} else {
							dietIn = dietIn + 'g';
						}
						return dietIn;
					}
				}
			}
		},
		bmiTip() {
			// <18.5 偏瘦 18.5-24 正常 24-28 偏重 >28 肥胖
			if (this.userInfo.weight && this.userInfo.height) {
				let tip = '';
				let mbi = (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1);
				if (mbi < 18.5) {
					// 偏低
					tip = 'bmi偏低,建议适当多吃一些甜品和肉制品';
				} else if (mbi < 24.0 && mbi >= 18.5) {
				} else {
					let dietIn =
						this.energyChange === 0
							? '0.0'
							: parseFloat(this.energyChange / 7.7) > 0
							? `${parseFloat(this.energyChange / 7.7).toFixed(1)}`
							: parseFloat(this.energyChange / 7.7).toFixed(1);
					dietIn = dietIn * 30;
					if (dietIn) {
						if (dietIn / 1000 >= 1) {
							dietIn = Number((dietIn / 1000).toFixed(1)) + 'kg';
						} else {
							dietIn = dietIn + 'g';
						}
					}
					tip = `根据您近期的饮食运动记录及身体数据分析,若长期保持当前的饮食习惯,您的体重将会在一个月后后增长<b>${dietIn}</b>.<p><b>为了您的身体健康,对您有以下几点建议:</b></p>
					<li> <b>适当节食</b></li>
					<li> <b>坚持规律的运动</b></li>
					<li> <b>调整好心态</b></li>
					<li> <b>保证充足的睡眠</b></li>`;
					// 减少卡路里的摄入
					// 要实现这一点就要少吃高脂肪的食物，同时，食用不饱和脂肪食物对你的心脏大有好处，并且可以帮助你吸收脂溶性维生素。为了达到减少卡路里的目的，你食用的必须比身体需要的更少。
					// 改变饮食习惯
					// 适当节食，少吃高脂肪食物，减少热量摄入，主要饮食改为蔬菜、水果、谷物和少量瘦蛋白。放慢吃饭速度，吃得慢一些。并且，要对碳酸饮料、加糖饮料、奶制品饮料、酒精及酒精饮料说不。
					// 坚持规律的运动
					// 每周5次，每次大约60分钟的有氧运动，如快步走、健身操、游泳等项目，可以让您的减肥事业事半功倍。
					// 拥有积极乐观的心态
					// 调整好心态，设定一个现实的目标，专心健身。注意把握自己身体的规律，不要在无聊或者压力大的时候海吃海喝，只有在真正饿的时候再吃东西。
					// 保证充足的睡眠
					// 要知道没有充足的睡眠，也是可能导致肥胖的发生的，所以要想要降低过高的bmi指数，就需要保证每天7-8小时的睡眠时间。
				}
				return tip;
			}
		}
	},
	methods: {
		showCookTypes() {
			this.isShowCookType = true;
			console.log(this.cookTypes);
		},
		changePageType(e) {
			if (this.pageType && this.pageType !== e) {
				this.$emit('changePageType', e);
			}
		},
		clickCharts(e) {
			this.toDetail(e);
		},
		async buildCurrenDietChartOption() {
			let currentDiet = this.deepClone(this.currentRecord);
			let dietRecordList = this.deepClone(this.dietRecord);
			let serviceName = '';
			let condition = [{}];
			if (currentDiet.diret_type === 'diet_contents') {
				// 食材
				serviceName = 'srvhealth_diet_contents_select';
				condition[0] = {
					colName: 'food_no',
					ruleType: 'eq',
					value: currentDiet.diet_contents_no
				};
			} else if (currentDiet.diret_type === 'mixed_food') {
				// 混合食物
				serviceName = 'srvhealth_mixed_food_nutrition_contents_select';
				condition[0] = {
					colName: 'meal_no',
					ruleType: 'eq',
					value: currentDiet.mixed_food_no
				};
			}
			let foodType = [];
			let foodInfo = await this.getFoodType(condition, serviceName);
			if (Array.isArray(foodInfo) && foodInfo.length > 0) {
				foodInfo = foodInfo[0];
			} else {
				// 没查到食物记录对应的食物信息
				return;
			}
			currentDiet = { ...foodInfo, ...currentDiet };
			let energyList = await this.buildDietData();
			// 构建echarts需要的数据格式
			energyList = this.deepClone(this.energyListWrap);
			let eleArr = [];
			energyList.forEach(item => {
				item.matterList.forEach(ele => {
					eleArr.push(ele);
				});
			});
			let category = eleArr.map(item => {
				return item.name;
			});
			let legendData = ['其它食物', '当前食物', 'NRV%达标线'];
			let seriesData = legendData.map(le => {
				let obj = {
					name: le,
					data: []
				};
				obj.type = 'bar';
				obj.stack = '营养素';
				let data = eleArr.map(item => {
					let num = (item.value * 100) / Number(item.EAR);
					num = parseFloat(num.toFixed(1));
					return num;
				});
				switch (le) {
					case '其它食物':
						obj.data = eleArr.map(item => {
							let ratio = (currentDiet.unit_weight_g * currentDiet.amount) / 100;
							// item.value = item.value - ratio * currentDiet[item.key];
							item.value = item.value - currentDiet[item.key];
							let num = (item.value * 100) / Number(item.EAR);
							num = Math.abs(parseFloat(num.toFixed(1)));
							if (typeof num === 'number' && num.toString() === 'NaN') {
							}
							return num;
						});
						break;
					case '当前食物':
						obj.data = eleArr.map(item => {
							let ratio = (currentDiet.unit_weight_g * currentDiet.amount) / 100;
							let num = currentDiet[item.key] ? (ratio * currentDiet[item.key] * 100) / Number(item.EAR) : 0;
							num = Math.abs(parseFloat(num.toFixed(1)));
							return num;
						});
						break;
					case 'NRV%达标线':
						obj.type = 'line';
						obj.stack = false;
						obj.data = eleArr.map(item => {
							return 100;
						});
						break;
				}
				return obj;
			});
			let option = {
				color: ['#92d050', '#f79646', '#4f81bd'],
				// color: ['#92d050', '#00b050', '#f79646', '#4f81bd'],
				title: {
					text: ''
				},
				tooltip: {
					show: true,
					trigger: 'axis'
					// axisPointer: {
					// 	type: 'cross',
					// 	label: {
					// 		backgroundColor: '#6a7985'
					// 	}
					// }
				},
				legend: {
					data: legendData
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '10%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: category,
						axisLabel: {
							rotate: 70,
							interval: 0,
							fontSize: 10
						}
					}
				],
				yAxis: [
					{
						max: function(value) {
							return value.max + 20;
						},
						type: 'value',
						axisLabel: {
							formatter: `{value}%`
						}
					}
				],
				series: []
			};
			option.series = seriesData;
			let result = {
				option: option
			};
			this.currentDietChartData = result;
		},
		buildNutrientsChartOption(energyListWrap) {
			// 构建echarts需要的数据格式
			let energyList = this.deepClone(this.energyListWrap);
			let eleArr = [];
			energyList.forEach(item => {
				item.matterList.forEach(ele => {
					eleArr.push(ele);
				});
			});
			let category = eleArr.map(item => {
				return item.name;
			});
			let legendData = ['已选', '超标部分', 'NRV%达标线'];
			let seriesData = legendData.map(le => {
				let obj = {
					name: le,
					data: []
				};
				obj.type = 'bar';
				obj.stack = '营养素';
				let data = eleArr.map(item => {
					let num = (item.value * 100) / Number(item.EAR);
					num = parseFloat(num.toFixed(1));
					return num;
				});
				switch (le) {
					case '已选':
						obj.data = eleArr.map(item => {
							let num = 0;
							if (item.UL) {
								// 有最大值
								if (item.value > item.UL) {
									num = (Number(item.UL) * 100) / Number(item.EAR);
								} else {
									num = (item.value * 100) / Number(item.EAR);
								}
							} else {
								num = (item.value * 100) / Number(item.EAR);
							}
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case '新增':
						break;
					case '超标部分':
						obj.data = eleArr.map(item => {
							let num = 0;
							if (item.UL) {
								// 有最大值
								if (item.value > item.UL) {
									num = (Number(item.UL) * 100) / Number(item.EAR) - 100;
								} else {
									num = 0;
								}
							} else {
								num = 0;
							}
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case 'NRV%达标线':
						obj.type = 'line';
						obj.stack = false;
						obj.data = eleArr.map(item => {
							return 100;
						});
						break;
				}
				return obj;
			});
			let option = {
				color: ['#92d050', '#f79646', '#4f81bd'],
				// color: ['#92d050', '#00b050', '#f79646', '#4f81bd'],
				title: {
					text: ''
				},
				legend: {
					data: legendData
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '10%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: category,
						axisLabel: {
							rotate: 70,
							interval: 0,
							fontSize: 10
						}
					}
				],
				yAxis: [
					{
						max: function(value) {
							return value.max + 20;
						},
						type: 'value',
						axisLabel: {
							formatter: `{value}%`
						}
					}
				],
				series: []
			};
			option.series = seriesData;
			let result = {
				option: option
			};
			this.nutrientsChartOption = result;
			return result;
		},

		chooseCookType(e) {
			// 选择食物烹调方式
			this.currentRecord.cook_method = e.value;
			this.isShowCookType = false;
		},
		checkUnit(item, index) {
			// 切换单位
			this.currentUnitIndex = index;
			let currentUnit = this.unitList[index];
			console.log(this.currentRecord);
			//TODO 动态改变热量
			// this.currentRecord.energy  this.currentRecord.unit_weight_g/100
			this.currentRecord.unit_weight_g = currentUnit.unit_weight_g ? currentUnit.unit_weight_g : currentUnit.amount;
			this.currentRecord.unit = item.unit;
			// this.currentRecord.energy = currentUnit.amount / 100;
			this.buildCurrenDietChartOption();
		},
		async getCookTypes() {
			let colVs = await this.getServiceV2('srvhealth_diet_contents_select', 'list', 'list', 'health');
			let colData = colVs.srv_cols;
			colData.forEach(item => {
				if (item.columns === 'cook_method') {
					this.cookTypes = item.option_list_v2;
				}
			});
		},
		async getFoodUnit(item) {
			// 查找当前食物的单位
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [{ colName: 'food_no', ruleType: 'eq', value: item.diet_contents_no ? item.diet_contents_no : item.mixed_food_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			let unitList = [];
			if (item.unit !== 'g') {
				let basicUnit = this.deepClone(item);
				basicUnit.unit = 'g';
				basicUnit.amount = 1;
				basicUnit.energy = (item.energy * 100) / item.unit_weight_g;
				basicUnit.unit_weight_g = 100;
				unitList.push(basicUnit);
			} else {
				unitList.push(item);
			}
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				unitList = [...unitList, ...res.data.data];
			} else {
				// unitList = [item];
			}
			this.unitList = unitList;
			return unitList;
		},
		getDownloadPath(e) {
			return this.$api.downloadFile + e['image'] + '&bx_auth_ticket=' + this.bx_auth_ticket + '&thumbnailType=fwsu_100';
		},
		toAddDiet() {
			// 跳转到选餐页面
			let energyList = this.deepClone(this.energyListWrap);
			let condition = [];
			let elementList = [];
			energyList.forEach(en => {
				en.matterList.forEach(ele => {
					if (this.dietRecord.length > 0 && ele.EAR > ele.value) {
						ele.diff = ele.value / ele.EAR;
						elementList.push(ele);
					}
				});
			});
			elementList = elementList.sort(function(a, b) {
				return a.diff - b.diff;
			});
			const condType = {
				type: 'food',
				serviceName: 'srvhealth_diet_contents_select',
				colName: 'name',
				imgCol: 'image',
				date: this.selectDate,
				wordKey: {
					title: 'name',
					unit: 'unit',
					energy: 'unit_energy'
				}
			};
			if (elementList.length > 0) {
				condType.order = [
					{
						colName: elementList[0].key,
						orderType: 'desc' // asc升序  desc降序
					}
				];
			}
			const url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
			uni.navigateTo({
				url: url
			});
		},
		async getFoodList(diet) {
			let foodNameList = diet.map(item => item.name);
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [{ colName: 'name', ruleType: 'in', value: foodNameList.toString() }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				diet = diet.map(item => {
					let obj = null;
					res.data.data.map(food => {
						if (food.name === item.name) {
							obj = Object.assign(food, item);
						}
					});
					return obj;
				});
				return diet;
			}
		},
		async buildChartData(e) {
			let { energy, diet } = e;
			let normalData = {
				chartName: ' ',
				chartId: '',
				units: '',
				chartOption: {
					color: [],
					legend: {
						data: [],
						show: true,
						orient: 'vertical',
						right: '3%',
						top: 'top'
					},
					grid: {
						top: '5%',
						left: '3%',
						right: '100',
						bottom: '0',
						containLabel: true
					},
					xAxis: {
						type: 'category'
					},
					yAxis: {
						max: function(value) {
							return value.max + 20;
						},
						type: 'value'
					},
					series: []
				}
			};
			let resultList = [];
			let lineList = ['最高', '最低'];
			energy.forEach(item => {
				let resultData = this.deepClone(normalData);
				resultData.chartName = item.title;
				resultData.chartId = item.title;
				resultData.units = item.units;
				resultData.chartOption.color = ['#f49d13', '#28ebb1', '#f6d748', '#9967FA', '#44aff0', '#d34e58', '#f49d13', '#f6d748', '#9967FA', '#44aff0'];
				resultData.chartOption.legend.data = diet.map(item => item.name).concat(lineList);
				resultData.chartOption.xAxis.data = item.matterList.map(item => item.key);
				resultData.chartOption.series = dietList.map(dietItem => {
					let obj = {
						name: dietItem.name,
						type: 'bar',
						stack: '总量',
						label: {
							normal: {
								show: false
							}
						},
						data: []
					};
					resultData.chartOption.xAxis.data.map(ele => {
						if (dietItem[ele]) {
							obj.data.push(dietItem.amount * dietItem[ele]);
						} else {
							obj.data.push(0);
						}
					});
					return obj;
				});
				let lineSeries = [];
				lineList.forEach((l, index) => {
					let obj = {
						name: l,
						type: 'line',
						// smooth: true,
						// stack: '总量',
						sampling: 'average',
						areaStyle: {
							normal: {}
						},
						label: {
							normal: {
								show: false
							}
						},
						data: []
					};
					if (index === 0) {
						obj.areaStyle.normal.color = 'rgba(40,235,177,0.2)';
					} else {
						obj.areaStyle.normal.color = 'rgba(244,157,19,0.2)';
					}
					item.matterList.forEach(mat => {
						resultData.chartOption.xAxis.data.forEach(x => {
							if (mat.key === x) {
								if (l === '最低') {
									obj.data.push(mat.EAR);
								} else {
									obj.data.push(mat.UL);
								}
							}
						});
					});
					lineSeries.push(obj);
					resultData.chartOption.series.unshift(obj);
				});
				resultData.chartOption.xAxis.data = item.matterList.map(item => item.name);
				resultList.push(resultData);
			});
			return resultList;
		},
		changeCurrentVal(e, step = 1) {
			if (e === 'minus') {
				if (this.currentRecord.amount >= 1) {
					this.currentRecord.amount = Number((this.currentRecord.amount - step).toFixed(1));
				} else {
					return;
				}
			} else {
				this.currentRecord.amount = Number((this.currentRecord.amount + step).toFixed(1));
			}
			if (this.currentRecordType === 'food') {
				this.buildCurrenDietChartOption();
			}
		},

		toDetail(e, item) {
			if (!item) {
				let name = e.name;
				let energyList = this.deepClone(this.energyListWrap);
				let eleArr = [];
				energyList.forEach(ene => {
					ene.matterList.forEach(ele => {
						ele.units = ene.units;
						eleArr.push(ele);
						if (e.name === ele.name) {
							e = ele;
						}
					});
				});
			} else {
				e.units = item.units;
			}
			uni.navigateTo({
				url: '/otherPages/elementDetail/elementDetail?data=' + JSON.stringify(e) + '&user_no=' + this.loginUserInfo.user_no + '&date=' + this.selectDate
			});
		},
		closeDay(e) {
			this.modalName = '';
			this.showTimeSignPicker = false;
		},
		async getDietAllRecord() {
			//饮食记录
			this.getCookTypes();
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					}
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.getSportsAllRecord(res.data.data);
			}
		},
		async getSportsAllRecord(data) {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					}
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let arr = [...data, ...res.data.data];
				let timeArr = [];
				arr.forEach(item => {
					timeArr.push(item.hdate);
				});

				let allRecord = Array.from(new Set(timeArr));
				this.markDays = allRecord;
			}
		},
		onDayClick(data) {
			this.showTimeSignPicker = false;
			this.selectDate = data.date;
			this.modalName = '';
			this.getDietRecord(this.selectDate);
			this.getSportsRecord(this.selectDate);
			this.changeSub(4);
		},
		changeSignDate() {
			this.modalName = 'Modal';
			let dietRecord = null;
			this.showTimeSignPicker = !this.showTimeSignPicker;
		},
		async getSymptomDiseaseList(symptomList) {
			if (Array.isArray(symptomList) && symptomList.length > 0) {
				const symptomNoList = symptomList.map(item => item.no);
				const symptomNoStr = symptomNoList.toString();
				if (symptomNoStr) {
					const url = this.getServiceUrl('health', 'srvhealth_symptoms_disease_select', 'select');
					const req = {
						serviceName: 'srvhealth_symptoms_disease_select',
						colNames: ['*'],
						condition: [
							{
								colName: 'symptoms_no',
								ruleType: 'in',
								value: symptomNoStr
							}
						]
					};
					const res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
						let diseaseList = res.data.data.map(item => {
							return {
								disease_no: item.disease_no,
								disease_name: item._disease_no_disp,
								symptoms_no: item.symptoms_no,
								symptoms_name: item._symptoms_no_disp
							};
						});
						let diseaseNameList = diseaseList.map(item => item.disease_name);
						// 去重
						diseaseNameList = [...new Set(diseaseNameList)];
						diseaseList = diseaseNameList.map(item => {
							let obj = {
								disease_name: item,
								disease_no: '',
								symptoms_info: []
							};
							diseaseList.map(disease => {
								if (item === disease.disease_name) {
									obj.disease_no = disease.disease_no;
									obj.symptoms_info.push({
										no: disease.symptoms_no,
										name: disease.symptoms_name
									});
								}
							});
							return obj;
						});
						this.diseaseList = diseaseList;
					}
				}
			}
		},
		async changeSub(e, showSub, data) {
			// 切换展示营养素状态(异常||全部)
			console.log(e);
			if (this.subIndex === e && !showSub) {
				this.subIndex = 4;
			} else {
				this.subIndex = e;
			}
			let energyListWrap = this.deepClone(this.energyListWrap);
			if (data) {
				energyListWrap = this.deepClone(data);
			}
			this.energyList.length = 0;
			switch (this.subIndex) {
				case 0:
					this.subColor = '#5098ff';
					this.energyList = energyListWrap.map(item => {
						item.matterList = item.matterList.map(ele => {
							ele.value_left = 0;
							ele.value = 0;
							return ele;
						});
						return item;
					});
					setTimeout(() => {
						this.energyList = this.deepClone(this.energyListWrap).map(item => {
							item.matterList.map(ele => {
								return ele;
							});
							return item;
						});
					}, 300);
					break;
				case 1:
					this.subColor = '#999';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							ele.value_left = 0;
							return ele.value < ele.EAR;
						});
						return item.matterList.length > 0;
					});
					setTimeout(() => {
						this.energyList = this.deepClone(this.energyListWrap).filter(item => {
							item.matterList = item.matterList.filter(ele => {
								return ele.value < ele.EAR;
							});
							return item.matterList.length > 0;
						});
					}, 300);
					break;
				case 2:
					this.subColor = 'rgb(141, 198, 63)';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							ele.value_left = 0;
							return ele.UL ? ele.value >= ele.EAR && ele.value <= ele.UL : ele.value >= ele.EAR;
						});
						return item.matterList.length > 0;
					});
					setTimeout(() => {
						this.energyList = this.deepClone(this.energyListWrap).filter(item => {
							item.matterList = item.matterList.filter(ele => {
								return ele.UL ? ele.value >= ele.EAR && ele.value <= ele.UL : ele.value >= ele.EAR;
							});
							return item.matterList.length > 0;
						});
					}, 300);
					break;
				case 3:
					this.subColor = '#ff9900';
					this.energyList = energyListWrap.filter(item => {
						item.matterList = item.matterList.filter(ele => {
							ele.value_left = 0;
							// ele.value = 0;
							return ele.UL ? ele.value > ele.UL : false;
						});
						return item.matterList.length > 0;
					});
					setTimeout(() => {
						this.energyList = this.deepClone(this.energyListWrap).filter(item => {
							item.matterList = item.matterList.filter(ele => {
								return ele.UL ? ele.value > ele.UL : false;
							});
							return item.matterList.length > 0;
						});
					}, 300);
					break;
				case 4:
					this.energyList = [];
					break;
			}
		},
		/*跳转到基本信息**/
		toPersonal() {
			uni.navigateTo({
				url: '/pages/personalDetail/personalDetail?type=person'
			});
		},
		addSymptom() {
			// 跳转到症状选择页面
			let term = {
				serviceName: 'srvhealth_self_symptoms_select',
				srvApp: 'health',
				key: 'name',
				type: 'symptom'
			};
			uni.navigateTo({
				url: '/otherPages/symptomSelect/symptomSelect?term=' + encodeURIComponent(JSON.stringify(term))
			});
		},
		procEleData() {
			let energyList = this.energyList;
			energyList.forEach(item => {
				item.matterList.forEach(alone => {
					if (parseInt(alone.value) <= parseInt(alone.EAR)) {
						alone['status'] = 'anomaly';
					} else if (parseInt(alone.value) >= parseInt(alone.UL)) {
						alone['status'] = 'anomaly';
					} else {
						alone['status'] = 'regular';
					}
				});
			});
		},
		selectChange(e) {
			if (e.newVal) {
				this.formData['name'] = e.newVal;
				let data = [];
				if (this.addType === 'food') {
					data = this.foodType;
				} else if (this.addType === 'sport') {
					data = this.sportType;
				}
				data.forEach(item => {
					if (item.name === e.newVal) {
						this.unit_energy = item.unit_energy;
						this.formData['unit'] = item.unit;
					}
				});
			}
		},
		async UpdateDietInfo() {
			let self = this;
			let dietInfo = this.deepClone(this.currentRecord);
			let serviceName = 'srvhealth_diet_record_update';
			let cond = [
				{
					colName: 'name',
					ruleType: 'eq',
					value: dietInfo.name
				}
			];
			let serv = '';
			if (dietInfo.diret_type === 'diet_contents') {
				// 食材
				serv = 'srvhealth_diet_contents_select';
				cond[0] = {
					colName: 'food_no',
					ruleType: 'eq',
					value: dietInfo.diet_contents_no
				};
			} else if (dietInfo.diret_type === 'mixed_food') {
				// 混合食物
				serv = 'srvhealth_mixed_food_nutrition_contents_select';
				cond[0] = {
					colName: 'meal_no',
					ruleType: 'eq',
					value: dietInfo.mixed_food_no
				};
			}
			let recordType = await this.getFoodType(cond, serv);
			let ele = null;
			if (this.currentRecordType === 'sport') {
				serviceName = 'srvhealth_body_activity_record_update';
				recordType = await this.getSportType(cond);
			}
			let currentUnit = this.unitList[this.currentUnitIndex];
			let data = {
				amount: dietInfo.amount,
				energy: dietInfo.energy
			};
			if (Array.isArray(recordType) && recordType.length > 0) {
				ele = recordType[0];
				if (this.currentRecordType === 'food' && currentUnit.unit != 'g') {
					ele.unit_energy = (currentUnit.amount / 100) * ele.unit_energy;
				}
				dietInfo.energy = dietInfo.amount * ele.unit_energy;
			}
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: serviceName,
					condition: [{ colName: 'id', ruleType: 'eq', value: dietInfo.id }],
					data: [
						{
							amount: dietInfo.amount,
							energy: dietInfo.energy
						}
					]
				}
			];
			if (this.currentRecordType === 'diet' || this.currentRecordType === 'food') {
				req[0].data = [
					{
						amount: dietInfo.amount,
						energy: dietInfo.energy,
						unit_weight_g: dietInfo.unit_weight_g,
						unit: dietInfo.unit,
						cook_method: dietInfo.cook_method
					}
				];
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await self.getDietRecord();
				await self.getSportsRecord();
				self.showEditModal = false;
			}
		},
		deleteItem(item) {
			let self = this;
			let type = this.currentRecordType;
			uni.showModal({
				title: '提示',
				content: '确定删除此条记录?',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						self.showEditModal = false;
						let serviceName = '';
						let url = '';
						if (type === 'food') {
							serviceName = 'srvhealth_diet_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						} else if (type === 'sport') {
							serviceName = 'srvhealth_body_activity_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_body_activity_record_delete', 'operate');
						}
						let req = [
							{
								serviceName: serviceName,
								condition: [{ colName: 'id', ruleType: 'in', value: item.id }]
							}
						];
						self.$http.post(url, req).then(res => {
							uni.hideLoading();
							if (res.data.resultCode === 'SUCCESS') {
								if (type === 'food') {
									self.getDietRecord();
								} else if (type === 'sport') {
									self.getSportsRecord();
								}
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '删除失败!',
									icon: 'none'
								});
							}
						});
					} else if (res.cancel) {
						uni.showToast({
							title: '取消删除',
							icon: 'none'
						});
					}
				}
			});
		},
		updateData(data, type) {
			let serviceName = '';
			let url = '';
			let req = {};
			let obj = {};
			obj[this.currentColumn] = this.currentVal;
			if (type === 'food') {
				this.foodType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
				serviceName = 'srvhealth_diet_record_update';
				url = this.getServiceUrl('health', 'srvhealth_diet_record_update', 'operate');
				req = [
					{
						serviceName: 'srvhealth_diet_record_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
						data: [obj]
					}
				];
				this.$http.post(url, req).then(res => {
					console.log(res.data);
					if (res.data.resultCode === 'SUCCESS') {
						uni.showToast({
							title: '修改成功'
						});
						this.getDietRecord();
					}
				});
			} else if (type === 'sport') {
				this.sportType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
				this.sportType.forEach(item => {
					if (item.name === data.name) {
						obj['energy'] = item.unit_energy * obj[this.currentColumn];
					}
				});
				serviceName = 'srvhealth_body_activity_record_update';
				url = this.getServiceUrl('health', 'srvhealth_body_activity_record_update', 'operate');
				req = [
					{
						serviceName: 'srvhealth_body_activity_record_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: data.id }],
						data: [obj]
					}
				];
				this.$http.post(url, req).then(res => {
					console.log(res.data);
					if (res.data.resultCode === 'SUCCESS') {
						uni.showToast({
							title: '修改成功'
						});
						this.getSportsRecord();
					}
				});
			}
		},
		changeValue(val) {
			console.log(val);
			this.currentVal = val.value;
		},
		async getBaseInfo() {
			// 使用user_no查找基本信息
			await this.getNutrientRecommended();
			let res = await this.getDietRecord();
			if (Array.isArray(res) && res.length > 0) {
				let names = res.map(item => item.name);
				let mixDietList = res.filter(item => item.diret_type === 'mixed_food');
				let basicDietList = res.filter(item => item.diret_type === 'diet_contents');
				let condition1 = [
					{
						colName: 'name',
						ruleType: 'in',
						value: mixDietList.map(item => item.name).toString()
					}
				];
				let condition2 = [
					{
						colName: 'name',
						ruleType: 'in',
						value: basicDietList.map(item => item.name).toString()
					}
				];
				let mix = await this.getFoodType(condition1, 'srvhealth_mixed_food_nutrition_contents_select');
				let basic = await this.getFoodType(condition2);
				this.foodType = [...mix, ...basic];
			}
			this.getSportsRecord().then(res => {
				let condition = null;
				if (Array.isArray(res) && res.length > 0) {
					res = res.map(item => item.name);
					condition = [
						{
							colName: 'name',
							ruleType: 'in',
							value: res.toString()
						}
					];
					this.getSportType(condition);
				}
			});
		},
		async getNutrientRecommended() {
			let url = this.getServiceUrl('health', 'srvhealth_nutrient_values_recommended_select', 'select');
			let req = {
				serviceName: 'srvhealth_nutrient_values_recommended_select',
				colNames: ['*'],
				order: [
					{
						colName: 'nutrient',
						orderType: 'desc' // asc升序  desc降序
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.userInfo.sex) !== -1) || !item.sex) {
						if (item.age_start && item.age_end) {
							return self.age >= item.age_start && self.age < item.age_end;
						} else if (item.age_start && !item.age_end) {
							return self.age >= item.age_start;
						} else if (!item.age_start && !item.age_end) {
							return true;
						} else {
							return false;
						}
					}
				});
				result.forEach(item => {
					self.energyListWrap.forEach(energy => {
						energy.matterList.forEach(mat => {
							if (item.nutrient === mat.name || item.nutrient.indexOf(mat.name) !== -1) {
								mat.UL = item.val_ul ? item.val_ul : mat.UL;
								mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
								if (energy.title !== '水溶性维生素') {
									mat.UL = item.val_ul ? item.val_ul : mat.UL;
								} else {
									mat.UL = 0;
								}
								if (mat.name === '蛋白') {
									mat.EAR = item.val_rni
										? item.val_rni * self.userInfo.weight
										: item.val_ear
										? item.val_ear * self.userInfo.weight
										: mat.EAR * self.userInfo.weight;
									mat.UL = 0;
								}
							} else {
								if (mat.name === '脂肪') {
									mat.EAR = Number((self.userInfo.weight * 50 * 0.2) / 9).toFixed(2);
									mat.UL = 0;
								}
								if (mat.name === '碳水') {
									mat.EAR = self.userInfo.weight * 4;
									mat.UL = 0;
								}
							}
						});
					});
				});
				return result;
			}
		},
		/* 根据饮食记录查找食物**/
		async getChooseFood(str) {
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'name',
						ruleType: 'in',
						value: str
					}
				]
			};

			let res = await this.$http.post(url, req);
			console.log('res-------', res.data.data);
			return res.data.data;
		},
		async buildDietData() {
			let data = this.dietRecord;
			let strArr = [];
			data.forEach(item => {
				item['editable'] = false;
				strArr.push(item.name);
			});
			let energyList = this.deepClone(this.energyListWrap);
			let str = strArr.join();
			this.getChooseFood(str).then(a => {
				if (Array.isArray(a) && a.length > 0) {
					a.forEach(food => {
						data.forEach(re => {
							if (food.name === re.name) {
								food['amount'] = food['amount'] ? food['amount'] + re.amount : re.amount;
							}
						});
					});
					let chooseFood = a;
					if (chooseFood && chooseFood.length > 0) {
						let eledata = '';
						energyList.forEach(item => {
							item.matterList.forEach(mat => {
								mat.value = 0;
								chooseFood.forEach(fod => {
									for (let a in fod) {
										if (mat.key && mat.key == a) {
											mat.value = Number(mat.value) + Number(fod.amount) * Number(fod[a]);
											/**
											 * 共计 mat.EAR*2 + mat.UL-mat.EAR --> mat.EAR+mat.UL
											 * 左/右： mat.EAR
											 * 中间： mat.UL-mat.EAR
											 */
											if (mat.UL && mat.value && mat.value > (mat.UL - mat.EAR) * 4) {
												mat['value_left'] = (120 * 0.9) / 2;
												mat['left_width'] = (mat.EAR * 120) / ((mat.value * 2) / 0.9);
												mat['center_width'] = ((mat.UL - mat.EAR) * 120) / ((mat.value * 2) / 0.9);
												mat['right_width'] = 120 - mat['left_width'] - mat['center_width'];
											} else {
												if (!mat.UL) {
													mat['right_width'] = 0;
													mat['left_width'] = 50;
													mat['center_width'] = 70;
													if (mat.value <= mat.EAR) {
														mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
													} else {
														mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
													}
													if (mat['value_left'] > 110) {
														mat['value_left'] = 110;
													}
													return;
												}
												if (mat.value === 0 || mat.value === '0') {
													mat['value_left'] = 0;
													mat['right_width'] = 30;
													mat['left_width'] = (90 * mat.EAR) / mat.UL;
													mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
												} else {
													mat['value_left'] = (40 * mat.value) / (mat.UL - mat.EAR);
													mat['left_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL);
													mat['right_width'] = (120 * mat.EAR) / (mat.EAR + mat.UL) > 30 ? (120 * mat.EAR) / (mat.EAR + mat.UL) : 30;
													if (mat['left_width'] + mat['right_width'] > 80) {
														mat['right_width'] = 20;
														mat['left_width'] = (100 * mat.EAR) / mat.UL;
													}
													mat['center_width'] = 120 - mat['left_width'] - mat['right_width'];

													if (mat.value < mat.EAR) {
														mat['value_left'] = (mat['left_width'] * mat.value) / mat.EAR;
													}
													if (mat.value >= mat.EAR && mat.value <= mat.UL) {
														mat['value_left'] = mat['left_width'] + (mat['center_width'] * (mat.value - mat.EAR)) / (mat.UL - mat.EAR);
													}
													if (mat.value > mat.UL) {
														mat['value_left'] = mat['left_width'] + mat['center_width'] + (mat['right_width'] * (mat.value - mat.UL)) / mat.EAR;
													}
												}
												if (mat['value_left'] > 110) {
													mat['value_left'] = 110;
												}
											}
										} else {
											if (mat.value == 0) {
												mat['value_left'] = 0;
												mat['right_width'] = 30;
												mat['left_width'] = (90 * mat.EAR) / mat.UL;
												mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
											}
										}
									}
								});
							});
						});
					}
				}
				this.radioArr.forEach((radio, index) => {
					radio.num = 0;
					energyList.forEach(item => {
						item.matterList.forEach(ele => {
							switch (index) {
								case 0:
									radio.num++;
									break;
								case 1:
									if (ele.value < ele.EAR) {
										radio.num++;
									}
									break;
								case 2:
									if (ele.value >= ele.EAR && ele.value <= ele.UL) {
										radio.num++;
									} else if (ele.value >= ele.EAR && ele.UL === 0) {
										radio.num++;
									}
									break;
								case 3:
									if (ele.UL && ele.value > ele.UL) {
										radio.num++;
									}
									break;
							}
						});
					});
					radio.label = radio.name + '(' + radio.num + ')';
				});
				this.buildNutrientsChartOption(this.energyListWrap);
			});
			return energyList;
		},
		async getDietRecord(chooseDate = null) {
			//饮食记录
			if (chooseDate) {
				this.selectDate = chooseDate;
			}
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: chooseDate ? chooseDate.trim() : this.selectDate.trim()
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			let energyList = this.energyListWrap;
			energyList.forEach(item => {
				item.matterList.forEach(mat => {
					mat['value_left'] = 0;
					mat['right_width'] = 30;
					mat['left_width'] = (90 * mat.EAR) / mat.UL;
					mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
					if (item.title === '水溶性维生素') {
						mat['right_width'] = 0;
						mat['left_width'] = 30;
						mat['center_width'] = 90;
					}
					if (item.title === '有机大分子') {
						mat['right_width'] = 0;
						mat['left_width'] = 50;
						mat['center_width'] = 70;
					}
					if (mat.center_width * 3 < mat.left_width || mat.center_width * 3 < mat.right_width) {
						mat.left_width = mat.left_width - mat['center_width'];
						mat.right_width = mat.right_width - mat['center_width'];
						mat['center_width'] = 3 * mat['center_width'];
					}
				});
			});
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				let dietIn = 0;
				res.data.data.forEach(item => {
					dietIn += item.energy;
				});
				this.dietIn = dietIn;
				uni.$emit('dietInChange', dietIn);
				console.log(this.foodType);
				this.dietRecord = res.data.data;
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.dietRecord = [];
				this.dietIn = 0;
				this.energyListWrap.forEach(i => {
					i.matterList.forEach(at => {
						at.value = 0;
					});
				});
			}
			this.energyListWrap = await this.buildDietData();
			this.energyList = this.deepClone(energyList);
			this.changeSub(4);
			return res.data.data;
		},
		async getSportsRecord(chooseDate = null) {
			// 运动记录
			if (chooseDate) {
				this.selectDate = chooseDate;
			}
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: chooseDate ? chooseDate : this.selectDate.trim()
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.sportsRecord = res.data.data.map(item => {
					// item.energy = item.energy * this.userInfo.weight
					return item;
				});
				let sportOut = 0;
				res.data.data.forEach(item => {
					sportOut = item.energy + sportOut;
					console.log(item, this.userInfo.weight, 'sportOut');
					item['editable'] = false;
				});
				this.sportOut = sportOut;
				uni.$emit('sportOutChange', sportOut);
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.sportsRecord = [];
				this.sportOut = 0;
			}
			return res.data.data;
		},
		async getFoodType(cond, serv) {
			// 食物类型
			let serviceName = 'srvhealth_diet_contents_select';
			if (serv) {
				serviceName = serv;
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				order: []
			};
			if (cond) {
				req.condition = cond;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0 && !serv) {
				console.log(res.data.data);
				// this.foodType = res.data.data;
			}
			return res.data.data ? res.data.data : [];
		},
		async getSportType(cond) {
			// 运动类型
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_contents_select',
				colNames: ['*'],
				condition: [],
				order: []
			};
			if (cond) {
				req.condition = cond;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.sportType = res.data.data;
			}
			return res.data.data;
		},
		backToHome() {
			uni.switchTab({
				url: '/pages/home/home',
				fail() {
					uni.navigateTo({
						url: '/archivesPages/old-home/old-home'
					});
				}
			});
		},
		clickUserMenu(e) {
			console.log(e);
			if (e === 'regulate') {
				let viewTemp = {
					title: 'name',
					tip: 'sex',
					img: 'pic',
					footer: 'job'
				};
				let cond = [
					{
						colName: 'userno',
						ruleType: 'eq',
						value: 'user_no'
					}
				];
				uni.navigateTo({
					url:
						'/publicPages/list/list?serviceName=srvhealth_person_info_select&navigationBarTitle=我的车辆&pageType=list&type=skip&viewTemp=' +
						decodeURIComponent(JSON.stringify(viewTemp)) +
						'&cond=' +
						decodeURIComponent(JSON.stringify(cond))
				});
			} else if (e === 'health') {
				uni.navigateTo({
					url: '/pages/balancedDiet/balancedDiet'
				});
			} else {
				uni.setStorageSync('current_user_info', e);
				this.userInfo = e;
				uni.setStorageSync('current_user', e.name);
				this.getDietAllRecord();
				this.getDietRecord(this.selectDate);
				this.getSportsRecord(this.selectDate);
			}
			this.showUserList = false;
		},
		clickSportRecordItem(item) {
			this.showEditModal = true;
			this.currentRecord = this.deepClone(item);
			this.currentRecordType = 'sport';
		},
		async clickDietRecordItem(item) {
			let unitList = await this.getFoodUnit(item);
			unitList.forEach((unit, index) => {
				console.log(item, unit);
				if (item.unit === unit.unit) {
					this.currentUnitIndex = index;
				}
			});
			this.showEditModal = true;
			this.currentRecord = this.deepClone(item);
			this.currentRecordType = 'food';
			this.buildCurrenDietChartOption();
		},
		clickSportBox() {
			this.sportListDisplay = !this.sportListDisplay;
		},
		clickDietBox() {
			this.foodListDisplay = !this.foodListDisplay;
		},
		clickAddButton() {
			this.showPopup = true;
		},
		toPages(e) {
			let condType = {};
			let url = '';
			switch (e) {
				case 'food':
					condType = {
						type: 'food',
						date: this.selectDate,
						serviceName: 'srvhealth_diet_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
				case 'sport':
					condType = {
						type: 'sport',
						date: this.selectDate,
						serviceName: 'srvhealth_body_activity_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
			}
			this.showPopup = false;
			if (e !== 'food' && e !== 'sport') {
				uni.navigateTo({
					url: '/otherPages/otherIndicator/otherIndicator?type=' + e
				});
			} else {
				if (url) {
					uni.navigateTo({
						url: url
					});
				}
			}
		},
		/*查询当前登录人创建得用户信息**/
		async getCurrUserInfo() {
			const url = self.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let user = uni.getStorageSync('login_user_info').user_no;
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: user }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			this.userMenuList = res.data.data;
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				if (uni.getStorageSync('current_user')) {
					res.data.data.forEach(item => {
						if (item.name === uni.getStorageSync('current_user')) {
							uni.setStorageSync('current_user', item.name);
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
				}
				uni.setStorageSync('current_user', res.data.data[0].name);
			}
			uni.setStorageSync('user_info_list', res.data.data);
		},

		async getUserInfo() {
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxmp
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
				// #ifdef H5
				// this.getSignature();
				// #endif
			}
		},
		clickUserList(e) {
			console.log(e);
		}
	},
	created() {
		let symptomList = uni.getStorageSync('symptomList');
		if (symptomList) {
			this.symptomList = symptomList;
		} else {
			this.symptomList = [];
		}
		uni.$on('checkedItem', datas => {
			let data = datas && datas.length > 0 ? datas : [];
			this.symptomList = data;
		});
		uni.$on('dietUpdate', () => {
			//饮食记录已改变，刷新数据
			this.getDietRecord();
		});
		uni.$on('sportUpdate', () => {
			//运动记录已改变，刷新数据
			this.getSportsRecord();
		});
		uni.$on('symptomSelect', e => {
			//症状已选择
			this.symptomList = e;
		});
	},
	mounted() {
		if (!this.pageType) {
			return;
		}
		self = this;
		this.procEleData();
		let userInfo = uni.getStorageSync('login_user_info');
		if (userInfo && userInfo.user_no) {
			this.getUserInfo();
			this.formData.userno = userInfo.user_no;
			this.loginUserInfo = userInfo;
			this.getBaseInfo();
			this.getCurrUserInfo().then(_ => {
				if (uni.getStorageSync('current_user_info')) {
					this.userInfo = uni.getStorageSync('current_user_info');
					uni.setStorageSync('current_user', this.userInfo.name);
				} else {
					let userList = uni.getStorageSync('user_info_list');
					if (Array.isArray(userList) && userList.length > 0) {
						this.userInfo = userList[0];
						uni.setStorageSync('current_user_info', userList[0]);
					}
				}
				this.getDietAllRecord();
			});
		} else {
			alert('未发现登录用户信息');
		}
	}
};
</script>

<style lang="scss">
.balanced-diet {
	display: flex;
	flex-direction: column;
	width: 100%;
	/* #ifdef H5 */
	// padding-bottom: 100rpx;
	/* #endif */
	overflow-y: auto;
	background-color: #f1f1f1;
	position: relative;
	/deep/ .u-navbar {
		border-bottom: 1px solid #f1f1f1;
	}
	&.component-page {
		background-color: #fff;
	}
	.switch-date {
		/* #ifdef MP-WEIXIN */
		width: 100%;
		/* #endif */
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		color: #333;
		.u-icon {
			padding-left: 10rpx;
			position: relative;
			top: -2px;
		}
	}
	.header-wrap {
		// 顶部导航栏
		color: #f1f1f1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		padding: 0 30rpx;
		position: relative;
		/* #ifdef MP-WEIXIN */
		justify-content: center;
		/* #endif */
		.title {
			// 顶部标题
			font-weight: 700;
			/* #ifdef MP-WEIXIN */
			position: absolute;
			left: 10rpx;
			/* #endif */
		}
		.switch-date {
			height: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #0bc99d;
			color: #fff;
			.u-icon {
				padding-left: 10rpx;
			}
		}
		.user-info {
			display: flex;
			align-items: center;
			position: relative;
			.user-name {
				min-width: 100rpx;
				display: flex;
				.text {
					padding: 0 10rpx 0 20rpx;
				}
				.u-icon {
					transition: all 0.5s;
					&.active {
						transform: rotate(90deg);
					}
				}
			}
			.user-list {
				position: absolute;
				box-sizing: border-box;
				width: 200rpx;
				height: 0;
				border-radius: 10rpx;
				right: 0;
				opacify: 0;
				transition: all 0.5s;
				overflow: hidden;
				background-color: #fff;
				&.active {
					border: 1px solid #ddd;
					opacify: 1;
					height: auto;
					top: 70rpx;
					z-index: 999;
				}
				.menu-item {
					color: #333;
					min-height: 80rpx;
					font-weight: bold;
					border-bottom: 1px solid #fef0f0;
					font-size: 16px;
					display: flex;
					align-items: center;
					padding-left: 30rpx;
					&.current-user {
						color: #0586ff;
					}
				}
				.user {
					width: 100%;
					height: 50rpx;
					padding: 5rpx;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom: 1rpx solid #fff;
				}
			}
		}
	}
	.headline {
		font-size: 40upx;
		height: 80upx;
		font-weight: 600;
		text-align: center;
	}
	.top {
		display: flex;
		justify-content: space-between;
		width: 95%;
		margin: 0 auto;
		.top-item {
			display: flex;
			flex-wrap: wrap;
			height: 150upx;
			justify-content: space-between;
			align-items: center;
			&:first-child {
				width: 150upx;
				height: 150upx;
				.head-img {
					width: 100%;
					height: 100%;
					border-radius: 10upx;
				}
			}
			&:nth-child(2) {
				flex: 1;
				margin: 0 20upx;
			}
			&:last-child {
				width: 200upx;
				justify-content: space-around;
			}
			.info {
				width: 45%;
				text-align: center;
				height: 50upx;
				line-height: 50upx;
			}

			.top-item-bottom {
				display: flex;
				display: flex;
				justify-content: center;
				align-items: center;
				.the-date {
					padding: 0 10upx;
				}
			}
		}
	}
	.chart-box {
		width: 100%;
	}

	.main-box-plus {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
		transition: height 0.6s ease;
		height: auto;
		background-color: #fff;
		.title {
			width: 100%;
			padding: 10rpx;
			min-height: 100rpx;
			font-weight: bold;
			font-size: 34rpx;
			font-weight: bold;
			display: flex;
			text-align: left;
			justify-content: space-between;
			align-items: center;
			.switch-layout {
				width: 100rpx;
				display: flex;
				justify-content: space-around;
				color: #ccc;
				.active-layout {
					color: rgb(11, 201, 157);
				}
			}
		}
		.main-box {
			width: calc(100% - 20rpx);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			padding: 20rpx 0;
		}
	}
	.main-box {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		border-top: 3px solid #f1f1f1;
		padding: 10rpx 0;
		&.symptom {
			background-color: #fff;
			margin: 20rpx 0;
			width: calc(100%);
			overflow: hidden;
			&:first-child {
				margin-bottom: 0;
				box-shadow: none;
				padding: 10rpx 0;
				background-color: #f1f1f1;
			}
			.title {
				padding: 10rpx;
				font-weight: bold;
				font-size: 34rpx;
				display: flex;
				justify-content: space-between;
				.switch-layout {
					width: 100rpx;
					display: flex;
					justify-content: space-around;
					color: #ccc;
					.active-layout {
						color: rgb(11, 201, 157);
					}
				}
				.cuIcon-add {
					&:active {
						transform: scale(1.5);
						font-weight: 700;
					}
				}
				.num {
					font-weight: 300;
					color: #999;
					line-height: 34rpx;
				}
			}
			.record-box {
				width: 100%;
				display: flex;
				.read-more {
					width: 100%;
				}
				.record-item {
					flex: 1;
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0 10rpx;
					background-color: #fff;
					border-radius: 10rpx;
					font-weight: 700;
					font-size: 30rpx;
					letter-spacing: 2px;
					box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
					&:active {
						transform: translate(1px, 2px);
					}
				}
				.table {
					width: 100%;
					padding: 10rpx 0;
					text-indent: 0;
					.no-data {
						width: 100%;
						height: 60rpx;
						padding-bottom: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #666;
						font-size: 34rpx;
					}
					&.grid-layout {
						display: flex;
						flex-wrap: wrap;
						padding: 20rpx 10rpx 0 20rpx;
						.diet-item {
							width: calc(25% - 10rpx);
							min-height: 170rpx;
							margin: 0 10rpx 10rpx 0;
							border-radius: 10rpx;
							background-color: #fff;
							overflow: hidden;
							display: flex;
							flex-wrap: wrap;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							box-shadow: 6px 2px 30px #d1d9e6, inset -20px -18px 30px 0px #fff;
							.add-icon {
								font-size: 80rpx;
								font-weight: bold;
								color: #cecece;
							}
							.u-image {
								width: 100rpx;
								height: 100rpx;
							}
							.diet-detail {
								width: 100%;
								padding: 10rpx 5rpx;
								flex: 1;
								line-height: 1;
								.name {
									width: 100%;
									font-weight: bold;
									white-space: nowrap;
								}
								.time {
									font-size: 20rpx;
									color: #999;
								}
								.number {
									line-height: 1.2;
									font-size: 24rpx;
									display: flex;
									justify-content: space-between;
									.heat {
										line-height: 1.5;
										display: inline-block;
										color: #dc2a26;
									}
								}
							}
						}
					}
					.row {
						padding: 0 20rpx;
						.readonly {
							width: 100%;
							display: flex;
							min-height: 120rpx;
							align-items: center;
							&:active {
								background-color: #f1f1f1;
								box-shadow: 0px 0px 20px 8px #f1f1f1;
							}
							// box-shadow: 4px 3px 5px 0px rgba(0, 0, 0, 0.12);
							// border-bottom: 1rpx dotted #f1f1f1;
							.img {
								width: 110rpx;
								height: 110rpx;
								padding: 1px;
								border-radius: 10rpx;
								overflow: hidden;
								border: 1px solid #f1f1f1;
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
							}
							.column {
								// flex: 1;
								display: flex;
								min-height: 80rpx;
								justify-content: flex-end;
								align-items: flex-end;
								&.time {
									justify-content: center;
									padding: 0 10rpx;
									color: #999;
								}
								&.center {
									flex-direction: column;
									padding-left: 50rpx;
									align-items: flex-start;
									justify-content: flex-start;
									height: 120rpx;
									min-width: 140rpx;
									.name {
										font-weight: 700;
										font-size: 15px;
										line-height: 70rpx;
									}
									.number {
										font-size: 12px;
										color: #999;
									}
								}
								.heat {
									color: #999;
									margin-right: 10rpx;
									font-size: 12px;
									.text {
										font-size: 16px;
										padding-right: 2px;
									}
								}
								.cuIcon-right {
									color: #999;
								}
								&:last-child {
									flex: 1;
								}
							}
						}
					}
				}
			}
			.symptom-box {
				width: 100%;
				display: flex;
				padding: 10rpx;
				flex-wrap: wrap;
				justify-content: flex-start;

				.symptom-item {
					min-height: 110rpx;
					min-width: 140rpx;
					background-color: #ff8383;
					color: #fff;
					// min-height: 60rpx;
					padding: 10rpx 20rpx;
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 10rpx;
					max-width: 180rpx;
					// margin: 0 auto;
					margin-right: 10rpx;
					margin-bottom: 20rpx;
					letter-spacing: 2px;
					&.symptom-add {
						background-color: #fff;
						width: 180rpx;
						height: 170rpx;
						font-size: 40px;
						color: #ccc;
						font-weight: 100;
						box-shadow: 6px 2px 30px #d1d9e6, inset -20px -18px 30px 0px #fff;
					}
				}
			}
		}
		.main-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
		}
		.main-title {
			// margin: 20upx 0 0upx 0;
			font-size: 16px;
			font-weight: 700;
			text-indent: 10upx;
			letter-spacing: 1px;
		}
		.main-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			flex-wrap: wrap;
			background-color: #fff;
			.main-box-title {
				width: 100%;
				text-align: center;
				font-size: 14px;
				color: #666;
			}
			.bmi-tip-box {
				margin: 20rpx;
				padding: 30rpx 40rpx;
				border-radius: 10rpx;
				background-color: #fff;
				line-height: 1.5;
				font-weight: normal;
				font-size: 30rpx;
				box-shadow: 4px 0px 7px #ffb79b, inset 1px 1px 20px 0px #ffb79b;
			}
			.energy-item {
				color: #333;
				font-weight: bold;
				min-height: 150upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				margin-bottom: 10rpx;
				border-radius: 20rpx;
				margin: 30rpx 10rpx;
				&:nth-child(2) {
					background-color: rgba($color: #f14d30, $alpha: 0.8);
					box-shadow: 4px 3px 4px rgba($color: #cf6d40, $alpha: 0.5);
					color: #f1f1f1;
				}
				&:nth-child(4) {
					color: #f1f1f1;
					background-color: rgba($color: #0bc99d, $alpha: 0.8);
					box-shadow: 4px 3px 4px rgba($color: #0bc99d, $alpha: 0.5);
				}
				&:nth-child(6) {
					color: #f1f1f1;
					background-color: rgba($color: #2989ff, $alpha: 0.8);
					box-shadow: 4px 3px 4px rgba($color: #2979ff, $alpha: 0.5);
				}
				&:last-child {
					background-color: #fff;
					flex: 1.5;
					margin-right: 0;
					color: #333;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: rgba($color: #fff, $alpha: 0.8);
					box-shadow: 0px 1px 5px 0px rgba(153, 153, 153, 0.5);
				}
				.text {
					font-size: 20upx;
					text-align: center;
					font-weight: normal;
				}
				.number {
					font-size: 30upx;
					text-align: center;
					margin-top: 10rpx;
				}
				.text-red {
					color: rgba(241, 77, 48, 0.8);
					text-align: right;
				}
				.text-green {
					color: rgba($color: #0bc99d, $alpha: 0.7);
					text-align: right;
				}
				.units {
					min-width: 65rpx;
					padding-left: 10upx;
					font-size: 20upx;
					color: #000;
					// color: #f1f1f1;
				}
			}
			.operate {
				font-size: 60upx;
				font-weight: 600;
				// width: 60upx;
				color: #ff8944;
				text-align: center;
				text-shadow: 4px 3px 4px rgba($color: #e79715, $alpha: 0.5);
			}
			.table {
				width: 100%;
				.row {
					.readonly {
						width: 100%;
						display: flex;
						min-height: 60upx;
						align-items: center;
						.column {
							// text-indent: 20upx;
							flex: 1;
							// text-align: left;
							display: flex;
							.units {
								flex: 1;
							}
							&:nth-child(3) {
								flex: 0.7;
								display: flex;
								justify-content: center;
							}
							&:nth-child(4) {
								flex: 0.7;
								display: flex;
								justify-content: center;
							}
							&:nth-child(5) {
								flex: 0.3;
							}
							// input{
							// 	width: 100%;
							// }
						}
					}
				}
			}
			.ele-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 50%;
				margin-top: 30rpx;
				.ele-item-wrap {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					// justify-content: center;
					.probar {
						// width: 100%;
						// padding: 40upx 20upx;
						padding: 0 10rpx;
						position: relative;
						flex: 1;
						.pointer {
							position: absolute;
							width: 8rpx;
							height: 30rpx;
							background-color: rgba(250, 65, 65, 0.6);
							z-index: 20;
							top: 0;
							border-radius: 20rpx;
							transition: left 1s ease;
							.after {
								position: absolute;
								font-size: 14px;
								top: -30rpx;
								color: red;
								&.lack {
									color: #333;
								}
								&.normal {
									color: #8dc63f;
								}
								&.over {
									color: #ffb347;
								}
							}
						}
						.EAR {
							transition: none;
							.after {
								position: absolute;
								right: 0px;
								color: #333;
								z-index: 2;
							}
						}
						.risk {
							transition: none;
							.after {
								position: absolute;
								left: 0px;
								color: #333;
								z-index: 2;
							}
							.before {
								width: auto;
								position: absolute;
								right: -26px;
								color: #333;
								font-size: 12px;
								z-index: 2;
								&.lack {
									color: #333;
								}
								&.normal {
									color: #8dc63f;
								}
								&.over {
									color: #ffb347;
								}
							}
						}
						.regular {
							position: relative;
							transition: none;
						}
						.progress-bar {
							transition: none;
							height: 30rpx;
							width: 240rpx;
							position: relative;
						}
					}
					.ele-item-name {
						font-size: 14px;
						font-weight: 700;
						min-width: 30px;
						text-align: right;
					}
					.ele-item-num {
						text-align: center;
						background: #39b54a;
						// background-image: linear-gradient(45deg, #39b54a, #8dc63f);
						padding: 4px 5px;
						border-radius: 4px;
						font-size: 12px;
						min-width: 75px;
						:nth-child(2) {
							font-size: 14px;
							font-weight: 700;
						}
					}
					.max {
						// background-image: linear-gradient(45deg, #f43f3b, #ec008c);
						background-color: #e54d42;
					}
				}
			}
		}
		.main-content-t {
			background: #fff;
			color: #333;
			padding: 20rpx;
			font-size: 17px;
			font-weight: bold;
			.number {
				.units {
					color: #000;
					font-weight: 100;
					padding-left: 0;
				}
			}
		}
		.ele-content {
			flex-wrap: wrap;
			justify-content: end;
		}
	}
	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
		.number-box {
			display: flex;
			justify-content: center;
			padding: 20rpx;
			text {
				background: rgb(242, 243, 245);
				color: rgb(50, 50, 51);
				width: 30px;
				height: 27px;
				line-height: 27px;
				display: flex;
				justify-content: center;
				align-content: center;
				font-size: 20px;
			}
			input {
				width: 100rpx;
				color: rgb(50, 50, 51);
				font-size: 14px;
				background: rgb(242, 243, 245);
				height: 27px;
				width: 43px;
				text-align: center;
				position: relative;
				padding: 0;
				margin: 0 3px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		.title {
			width: auto;
		}
		.cu-form-group + .cu-form-group {
			border-top: none;
		}
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		// padding: 15px;
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
		background-color: #fff;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
	.cu-form-group {
		background-color: #fff;
		width: 100%;
		height: 150upx;
	}
}
.radioModal {
	display: flex;
	justify-content: center;
	align-items: center;
	.cu-dialog {
		height: 15vh;
	}
}
.radioModal /deep/ uni-radio::before,
uni-checkbox::before {
	right: 9px;
}
.pro-rad {
	overflow: inherit;
	height: 10px;
	background-color: transparent;
}
.tootio-item-wrap {
	position: absolute;
	width: 80rpx;
	top: -50rpx;
	right: 104rpx;
	.tootio-item {
		background-color: #8dc63f;
		border-color: #8dc63f;
		color: #ffffff;
		&::before {
			border-color: #8dc63f transparent transparent;
		}
	}
}

.max-risk {
	right: 8%;
	.tootio-item {
		background-color: #ffb347;
		border-color: #ffb347;
		color: #ffffff;
		&::before {
			border-color: #ffb347 transparent transparent;
		}
	}
}
.min-low {
	// &::after {
	left: 30rpx;
	.tootio-item {
		background-color: #00c2ff;
		border-color: #00c2ff;
		color: #ffffff;
		&::before {
			border-color: #00c2ff transparent transparent;
		}
	}
	// 	color: #00c2ff;
	// }
}
.EAR,
.risk {
	position: relative;
	background-color: #cfcfcf;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.risk {
	border-radius: 0;
	border: none;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: rgb(255, 179, 71);
	&.lack {
		&::before {
			color: #333;
		}
	}
	&.normal {
		&::before {
			color: #8dc63f;
		}
	}
	&.over {
		&::before {
			color: #ffb347;
		}
	}
}
.tips {
	text-align: center;
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	color: #999;
	font-size: 12px;
}
.indicator {
	background-color: #ffffff;
	text-align: center;
	font-size: 15px;
	width: 100%;
	padding: 10rpx 0;
	display: flex;
	justify-content: center;
	padding: 20rpx;
	.btn {
		display: inline-flex;
		margin-right: 10rpx;
		flex: 1;
		&.active-btn {
			padding-bottom: 10rpx;
			border-bottom: 5px solid #2fc25b;
		}
		&:last-child {
			margin-right: 0;
		}
	}
	.cu-btn {
		padding: 0 10px;
		font-size: 12px;
		width: 100%;
		&:last-child {
			margin-right: 0rpx;
		}
	}

	.cu-item {
		.content {
			font-weight: 700;
			display: flex;
			justify-content: space-between;
			.content_left {
				display: flex;
				.content_left_legend {
					display: flex;
					align-items: center;
					margin-left: 20upx;
					.content_left_legend_leg {
						width: 12px;
						height: 12px;
						background-color: #999;
						border-radius: 3px;
					}
				}
			}
		}
	}
}
.cu-modal.show {
	z-index: 999;
}
.cooktype-wrap {
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	padding: 20rpx;
	.cook-item {
		background-color: #f1f1f1;
		padding: 5rpx 30rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		transition: all 1s;
		letter-spacing: 2rpx;
		&:active {
			transform: scale(1.2);
		}
		&.active-cook-item {
			background-color: #007aff;
			color: #fff;
		}
	}
}
.current-diet-detail {
	width: 100vw;
	overflow: scroll;
	height: 100%;
	.title-bar {
		display: flex;
		justify-content: center;
		min-height: 80rpx;
		align-items: center;
		background-color: #fff;
		.date {
			font-size: 28rpx;
			font-weight: bold;
		}
		.btn {
			padding: 030rpx;
			color: #0081ff;
			font-size: 28rpx;
		}
	}
	.diet-info {
		display: flex;
		padding: 20rpx 0;
		justify-content: space-around;
		flex-wrap: wrap;
		.img {
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;
			overflow: hidden;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		}
		.info {
			min-width: 400rpx;
			padding-left: 50rpx;
			display: flex;
			flex-direction: column;
			.delete-icon {
				padding: 10rpx 20rpx;
				background-color: #fff;
				font-size: 24rpx;
				border-radius: 60rpx;
				text-align: center;
				transition: all 0.5s;
				border: 1rpx solid #e54d42;
				color: #f56c6c;
				background: #fef0f0;
				border-color: #fbc4c4;
				&:active {
					background-color: #e54d42;
					color: #fff;
					transform: scale(1.1);
					box-shadow: 0 0 10px #e54d42;
				}
				.text {
				}
			}
			.cuIcon-delete {
				display: inline-block;
				text-align: center;
				border-radius: 100%;
			}
			.name {
				font-weight: 700;
				font-size: 16px;
				display: flex;
				justify-content: space-between;
			}
			.element {
				color: #8dc63f;
			}
			.weight {
				padding: 10rpx 0;
				// color: #999;
				color: #ffb347;
				.heat {
					color: #ffb347;
					font-size: 16px;
				}
				.unit {
					font-size: 12px;
				}
			}
		}
		.amount {
			display: flex;
			align-items: center;
			.number-box {
				display: flex;
				justify-content: center;
				.title {
					margin-right: 20rpx;
				}
				.input {
					width: 120rpx;
					height: 70rpx;
					color: rgb(50, 50, 51);
					font-size: 14px;
					background: rgb(242, 243, 245);
					text-align: center;
					position: relative;
					padding: 10rpx 0;
					margin: 0 3px;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #dcdfe6;
					border-radius: 10rpx;
				}
				.symbol {
					border-radius: 10rpx;
					margin: 0 5rpx;
					padding: 10rpx 0;
					background: #d6e2eb;
					color: rgb(50, 50, 51);
					width: 120rpx;
					display: flex;
					justify-content: center;
					align-content: center;
					font-size: 20px;
					&:active {
						transform: scale(1.2);
					}
					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
		.cook-type-box {
			width: 100%;
			display: flex;
			padding: 20rpx;
			flex-wrap: wrap;
			align-items: center;
			.current-cook-type {
				color: #007aff;
				padding: 0 10rpx;
			}
		}
		.unit-box {
			width: 100%;
			display: flex;
			padding: 20rpx;
			flex-wrap: wrap;
			.title {
				margin-right: 20rpx;
			}
			.unit-item {
				margin-right: 5px;
				background-color: #f8f8f8;
				color: #999;
				border-radius: 20px;
				border: 1px solid #999;
				padding: 0px 8px;
				min-height: 27px;
				display: flex;
				align-items: center;
				margin-bottom: 5px;
				font-size: 20rpx;
			}
			.active-unit {
				font-size: 26rpx;
				border: 1px solid #f37b1d;
				background-color: #f37b1d;
				color: #fff;
			}
		}
	}
	.delete-bar {
		flex: 1;
		padding: 10rpx 20rpx;
		color: #999;
		border-top: 1px solid #f1f1f1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 50rpx;
		padding-top: 30rpx;
		// height: 150rpx;
		margin-bottom: 100rpx;
		.btn {
			padding: 15rpx 30rpx;
			letter-spacing: 2px;
			border-radius: 10rpx;
			font-size: 28rpx;
			flex: 1;
			margin-right: 20rpx;
			text-align: center;
			&:last-child {
				margin-right: 0rpx;
			}
		}
	}
}
.tootio-item {
	position: relative;
	width: 100%;
	height: 25px;
	border: 2px solid #3377aa;
	top: 0px;
	border-radius: 12rpx;
	color: #000000;
	font-size: 12px;
	&::before {
		position: absolute;
		content: '';
		width: 0;
		height: 0;
		border-width: 5px 5px;
		border-style: solid;
		border-color: #3377aa transparent transparent;
		bottom: -12px;
		left: 12px;
	}
}
.popup-box {
	display: flex;
	justify-content: center;
	padding: 50rpx 0 20rpx;
	flex-wrap: wrap;
	.icon-item {
		min-width: 22%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 210rpx;
		align-items: center;
		.icon {
			width: 130rpx;
			height: 130rpx;
			border-radius: 100%;
			background-color: rgba($color: orange, $alpha: 0.1);
			padding: 30rpx;
		}
		.label {
			padding: 10rpx 0;
		}
	}
}
.close-icon {
	width: 100%;
	padding-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.cuIcon-close {
		padding: 20rpx;
		border-radius: 50%;
		background-color: #f1f1f1;
		font-size: 40rpx;
	}
}
.add-button {
	position: fixed;
	bottom: 200rpx;
	left: calc(50% - 50rpx);
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #0081ff;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 30px;
	color: white;
	transition: all 0.5s;
	&:active {
		transform: rotate(45deg);
		bottom: -100rpx;
	}
}
.uni-ec-canvas {
	width: 100%;
	height: 550rpx;
	display: block;
}
</style>
