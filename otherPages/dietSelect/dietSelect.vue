<template>
	<view class="contents">
		<view class="">
			<view class="flexSelece">
				<view class="box">
					<view class="cu-bar search bg-white">
						<view class="search-form round">
							<text class="cuIcon-search"></text>
							<input
								@input="inputChange"
								:adjust-position="false"
								v-model="searchValue"
								@keyup.enter="searchStart"
								type="text"
								:placeholder="searchInputValue"
								confirm-type="search"
							/>
						</view>
						<view class="action">
							<text style="margin-right: 20rpx;" @click="search">搜索</text>
							<!-- <button v-if="serBtn" @click.stop="searchEnd" class="cu-btn bg-orange shadow-blur round">取消</button> -->
							<text @click="showfilter">筛选</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class=""><sl-filter ref="filter" :color="titleColor" :themeColor="themeColor" :menuList.sync="menuList" @result="result"></sl-filter></view>
		<view class="panelHmh">
			<!-- <drawer-filter-panel :filterShow="filterShow" :submenu="submenu" @sureFilter="onSureFilter" @resetFilter="onResetFilter" @hideFilter="onHideFilter"></drawer-filter-panel> -->
		</view>
		<!-- <scroll-view :scroll-y="true"> -->
		<sPullScroll
			ref="pullScroll"
			:heightStyle="heightStyle"
			:pullDown="pullDown"
			:pullUp="loadData"
			:enablePullDown="true"
			:enablePullUp="true"
			:top="100"
			:fixed="true"
			:bottom="0"
			finishText="我是有底线的..."
		>
			<view class="cu-list menu-avatar contentList">
				<view
					@click.stop="chooseFood(food)"
					@touchstart="ListTouchStart"
					@touchmove="ListTouchMove"
					@touchend="ListTouchEnd"
					:data-target="'move-box-' + idx"
					:class="modalName == 'move-box-' + idx ? 'move-cur' : ''"
					class="cu-item boxfood"
					v-for="(food, idx) in foodList"
					:key="idx"
				>
					<!-- <view class="cu-item boxfood-item" :class="modalName=='move-box-'+ idx?'move-cur':''" :key="idx"
						 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + idx"> -->
					<view class="smallbox">
						<image v-if="food.imgurl" :src="food.imgurl" mode="scaleToFill"></image>
						<image v-else src="/otherPages/static/img/none.png" mode="scaleToFill"></image>
						<view class="textbox">
							<view class="title-food">
								{{ food.name }}
								<view v-if="lockEledata" class="lock-ele">
									(
									<text>{{ lockEledata.label }}:</text>
									<text class="second-lock">{{ food[lockEledata.key] }}</text>
									<text class="second-lock">{{ lockEledata.units ? lockEledata.units.split('/')[0] : '' }}</text>
									)
								</view>
							</view>
							<view class="food-utis">
								<text class="number" style="margin-right: 5px;">{{ food.unit_energy }}千卡</text>
								<text class="utis">/{{ food.unit_amount + food.unit }}</text>
							</view>
						</view>
					</view>
					<view @click.stop="toFoodsDetail(food)" class="relian">
						<text class="status" :style="{ background: food.number > 200 ? '#fdc627' : '#00da43' }"></text>
						<uni-text class="lg text-gray cuIcon-right"><span></span></uni-text>
					</view>
					<view class="move foods-move"><view @click.stop="toFoodsDetail(food)" class="bg-grey">详情</view></view>
					<!-- </view> -->
				</view>
			</view>
		</sPullScroll>
		<!-- </scroll-view> -->
		<view class="cu-modal bottom-modal" :class="{ show: showBottomModal }">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class=" text-cyan button" @tap="showBottomModal = false">取消</view>
					<view class="date-time">
						<view @click="openCalendar" class="date-time-rq">{{ nowDate }}</view>
						/
						<view @click="openTime" class="date-time-rq">{{ currTime ? currTime : nowDateTime }}</view>
					</view>
					<view @click="confirms" class=" text-cyan button confir-btn">确定</view>
				</view>

				<view class="content">
					<view class="food-list">
						<view class="list-item">
							<view class="img-box"><image :src="currFood.imgurl"></image></view>
							<view class="info">
								<view class="name">{{ currFood.name }}</view>
								<text class="infomation">
									<text class="text-red calorie">{{ currFood.unit_energy }}</text>
									千卡/{{ currFood.unit_amount + currFood.unit }}
								</text>
							</view>
							<view class="status bg-green"></view>
						</view>
					</view>
					<view class="ele-text-wrap">
						<view class="ele-text-top">主要维生素含量如下：</view>
						<view class="ele-text-cen">
							<view class="ele-text-cen-item">
								<view class="ele-text-cen-item-title">
									脂溶性维生素
								</view>
								<view class="ele-text-cen-item-cen">
									<view class="ele-text">
										<text>VA:</text>
										<text>{{ currFood.vitamin_a && currFood.vitamin_a.toFixed(1) }}ug</text>
										<text style="color: red;">({{ currFood.vitamin_a>=450?'高':currFood.vitamin_a>=100&&currFood.vitamin_a<450?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>VE:</text>
										<text>{{ currFood.vitamin_e && currFood.vitamin_e.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.vitamin_e>=35?'高':currFood.vitamin_e>=15&&currFood.vitamin_e<35?'较高':'低' }})</text>
									</view>
								</view>
							</view>
							<view class="ele-text-cen-item">
								<view class="ele-text-cen-item-title">
									有机物
								</view>
								<view class="ele-text-cen-item-cen">
									<view class="ele-text">
										<text>蛋白质:</text>
										<text>{{ currFood.protein && currFood.protein.toFixed(1) }}g</text>
										<text style="color: red;">({{ currFood.protein>=35?'高':currFood.protein>=15&&currFood.protein<35?'较高':'低' }})</text>
									</view>								
								</view>
							</view>
							<view class="ele-text-cen-item">
								<view class="ele-text-cen-item-title">
									水溶性维生素
								</view>
								<view class="ele-text-cen-item-cen">
									<view class="ele-text">
										<text>VB1:</text>
										<text>{{ currFood.vitamin_b1 && currFood.vitamin_b1.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.vitamin_b1>=0.15?'高':currFood.vitamin_b1>=0.1&&currFood.vitamin_b1<0.15?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>VB2:</text>
										<text>{{ currFood.vitamin_b2 && currFood.vitamin_b2.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.vitamin_b2>=0.15?'高':currFood.vitamin_b2>=0.1&&currFood.vitamin_b2<0.15?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>VB3:</text>
										<text>{{ currFood.vitamin_b3 && currFood.vitamin_b3.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.vitamin_b3>=5?'高':currFood.vitamin_b3>=3.5&&currFood.vitamin_b3<5?'较高':'低' }})</text>
									</view>		
									<view class="ele-text">
										<text>VC:</text>
										<text>{{ currFood.vitamin_c && currFood.vitamin_c.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.vitamin_c>=50?'高':currFood.vitamin_c>=35&&currFood.vitamin_c<50?'较高':'低' }})</text>
									</view>
								</view>
							</view>
							<view class="ele-text-cen-item">
								<view class="ele-text-cen-item-title">
									常量矿物质
								</view>
								<view class="ele-text-cen-item-cen">
									<view class="ele-text">
										<text>钙:</text>
										<text>{{ currFood.vitamin_a && currFood.element_ca.toFixed(1) }}mg/</text>
										<text style="color: red;">({{ currFood.element_ca>=450?'高':currFood.element_ca>=200&&currFood.element_ca<450?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>镁:</text>
										<text>{{ currFood.element_mg && currFood.element_mg.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_mg>=150?'高':currFood.element_mg>=80&&currFood.element_mg<150?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>磷:</text>
										<text>{{ currFood.element_p && currFood.element_p.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_p>=250?'高':currFood.element_p>=150&&currFood.element_p<250?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>钾:</text>
										<text>{{ currFood.element_k && currFood.element_k.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_k>=500?'高':currFood.element_k>=200&&currFood.element_k<500?'较高':'低' }})</text>
									</view>
								</view>
							</view>
							
							<view class="ele-text-cen-item">
								<view class="ele-text-cen-item-title">
									微量元素
								</view>
								<view class="ele-text-cen-item-cen">
									<view class="ele-text">
										<text>铁:</text>
										<text>{{ currFood.element_fe && currFood.element_fe.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_fe>=8?'高':currFood.element_fe>=4&&currFood.element_fe<8?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>锌:</text>
										<text>{{ currFood.element_zn && currFood.element_zn.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_zn>=7?'高':currFood.element_zn>=4&&currFood.element_zn<7?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>硒:</text>
										<text>{{ currFood.element_se && currFood.element_se.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_se>=20?'高':currFood.element_se>=10&&currFood.element_se<20?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>铜:</text>
										<text>{{ currFood.element_cu && currFood.element_cu.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_cu>=1.5?'高':currFood.element_cu>=1&&currFood.element_cu<1.5?'较高':'低' }})</text>
									</view>
									<view class="ele-text">
										<text>锰:</text>
										<text>{{ currFood.element_mn && currFood.element_mn.toFixed(1) }}mg</text>
										<text style="color: red;">({{ currFood.element_mn>=5?'高':currFood.element_mn>=2.5&&currFood.element_mn<5?'较高':'低' }})</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="calculate">
						<view class="calorie">{{ heatNum.toFixed(1) }}千卡</view>
						<view class="amount">
							<view class="number">{{ choiceNum ? choiceNum : defultChoiceNum }}</view>
						</view>
						<view class="weight">
							<!-- <view class="unit">{{ currFood.unit }}</view> -->
							<view class="unit">{{ radioLabel?(radioLabel.unit_amount?radioLabel.unit_amount+radioLabel.unit:radioLabel.unit):currFood.unit_amount+currFood.unit }}</view>
							<!-- <view class="unit-change"> -->
								<image @click="changeUnit(currFood)" src="/otherPages/static/img/change.png" mode=""></image>
							<!-- </view> -->
							<!-- 300
							<text class="unit">克</text> -->
						</view>
						<!-- <view class="calorie">{{ heatNum.toFixed(1) }}千卡</view> -->
					</view>
					<view class="input-box">
						<div @click="keyboardDown(item)" v-for="(item, index) in keyboardCont" :key="index" class="digit">
							<text v-if="item.type === 'num'">{{ item.value }}</text>
							<text :class="item.value" v-else></text>
						</div>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal car-model" :class="{ show: showCarModal }">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-between">
					<view class="left"><text class="cuIcon-check text-green"></text></view>
					<view class="content">{{ carName }}</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-xl foods-cont">
					<view class="boxfood" v-for="(food, idx) in chooseFoodArr" :key="idx">
						<view class="smallbox">
							<image :src="food.imgurl" mode="scaleToFill"></image>
							<view class="textbox">
								<view class="title-food">{{ food.name }}</view>
								<view class="food-utis">
									<text class="number" style="margin-right: 5px;">{{ food.energy }}千卡</text>
									<text class="utis">/ {{ food.unit_weight_g?food.amount * food.unit_weight_g:food.amount  + food.unit }}</text>
								</view>
							</view>
						</view>
						<view class="relian">
							<text v-if="food.heatNum">{{ food.heatNum && food.heatNum.toFixed(1) }}千卡</text>
							<view @click="delItem(food)" style="margin-left: 20rpx;" class="">
								<uni-text class="lg text-gray cuIcon-delete"><span></span></uni-text>
							</view>
						</view>
					</view>
				</view>
				<view class="button-box"><button class="cu-btn bg-blue" @click="back">完成</button></view>
			</view>
		</view>
		<view class="cu-modal radio-modal" :class="modalName=='RadioModal'?'show':''" @tap="RadiohideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in unitList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.unit_amount?item.unit_amount+item.unit:item.unit}}</view>
								<radio class="round" :class="radioIndex==index?'checked':''" :checked="radioIndex==index?true:false"
								 :value="index.toString()"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<mx-date-picker
			style="z-index: 1290;"
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
		<!-- <flyInCart ref="inCart" :cartBasketRect="cartBasketRect"></flyInCart> -->
		<jumpBall :backgroundImage="currFood.imgurl" :start.sync="num" :element.sync="element" @msg="jbMsg" />
		<view class="public-button-box">
			<view @click="openCar" class="lg text-gray cuIcon-cart add-button">
				<text v-show="chooseFoodArr.length > 0" class="add-button-num">{{ chooseFoodArr.length }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import slFilter from '@/components/sl-filter/sl-filter.vue';
// import drawerFilterPanel from '@/components/ypeng-drawer-filter-panel/index';
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import jumpBall from '@/components/hx-jump-ball/hx-jump-ball.vue';
import sPullScroll from '@/components/s-pull-scroll';
export default {
	components: {
		sPullScroll,
		slFilter,
		// drawerFilterPanel,
		MxDatePicker,
		jumpBall
	},
	computed: {
		carName() {
			if (this.searchArg) {
				let str = '';
				if (this.searchArg.type === 'food') {
					str = '食物选择';
				} else if (this.searchArg.type === 'sport') {
					str = '运动选择';
				}
				return str;
			}
		},
		searchInputValue() {
			if (this.searchArg) {
				let str = '';
				if (this.searchArg.type === 'food') {
					str = '请输入食物名称搜索';
				} else if (this.searchArg.type === 'sport') {
					str = '请输入运动名称搜索';
				}
				return str;
			}
		}
	},	
	data() {
		return {
			heightStyle: 'calc(100vh-200upx)',
			chooseFoods: [],
			colData: [],
			currFoodLabel: {},
			listTouchStart: 0,
			serBtn: false,
			order: '',
			heatNum: 0,
			searchValue: '',
			themeColor: '#000000',
			titleColor: '#666666',
			condObj: '',
			dateFormat: 'hh:ii:ss',
			showTimePicker: false,
			timeType: 'time',
			currentVal: null,
			showBottomModal: false, //是否显示底部选择
			chooseFoodArr: [],
			showCarModal: false,
			filterResult: '',
			choiceNum: '',
			currTime: '',
			currDate: '',
			unitList:[],
			nowDate: this.formateDate(new Date(), 'date').replace(/\s*/g, ''),
			nowDateTime: this.formateDate(new Date(), 'dateTime'),
			selectDate: this.formateDate(new Date(), 'date'),
			defultChoiceNum: '0.00',
			modalName: '',
			searchArg: {
				// type:"food",
				// serviceName:'srvhealth_diet_contents_select',
				// colName:'name',
				// imgCol:'image',
				// wordKey:{
				// 	title:"name",
				// 	unit:"unit",
				// 	energy:"unit_energy",
				// }
			},
			keyboardCont: [
				{
					type: 'num',
					value: '1'
				},
				{
					type: 'num',
					value: '2'
				},
				{
					type: 'num',
					value: '3'
				},
				{
					type: 'num',
					value: '4'
				},
				{
					type: 'num',
					value: '5'
				},
				{
					type: 'num',
					value: '6'
				},
				{
					type: 'num',
					value: '7'
				},
				{
					type: 'num',
					value: '8'
				},
				{
					type: 'num',
					value: '9'
				},
				
				{
					type: 'num',
					value: '0'
				},
				{
					type: 'num',
					value: '.'
				},
				{
					type: 'del',
					value: 'cuIcon-delete'
				}
			],
			submenu: [
				{
					name: '蔬菜',
					value: '蔬菜',
					filterList: [
						{
							title: '蔬菜',
							type: 'fltd_type',

							items: [
								{
									value: '野生蔬菜',
									name: '跑步'
								},
								{
									value: '花菜',
									name: '坚果'
								}
							]
						},
						{
							title: '谷薯类',
							type: 'fltd_type',

							items: [
								{
									value: '马铃薯（烤）',
									name: '跑步'
								},
								{
									value: '马铃薯（蒸）',
									name: '坚果'
								}
							]
						}
						// ,
						// {
						// 	title: '蔬菜',
						// 	type: 'bxlx',

						// 	muti: true,
						// 	items: [
						// 		{ name: 'VA', value: 'value1' },
						// 		{ name: 'VD', value: 'value2' },
						// 		{ name: 'VE', value: 'value3' },
						// 		{ name: 'VK', value: 'value4' },
						// 		{ name: 'B1', value: 'value5' },
						// 		{ name: 'B2', value: 'value6' },
						// 		{ name: 'B3', value: 'value7' },
						// 		{ name: 'B6', value: 'value8' },
						// 		{ name: 'B12', value: 'value9' },
						// 		{ name: '叶酸', value: 'value10' },
						// 		{ name: '走路', value: '走路' }
						// 	]
						// }
					]
				},
				{
					name: '西式',
					value: '西式',
					filterList: [
						{
							title: '谷薯类',
							type: 'fltd_typess',

							items: [
								{
									value: 1,
									name: '米饭'
								},
								{
									value: 2,
									name: '红薯'
								}
							]
						},
						{
							title: '蔬菜',
							type: 'bxlxss',

							items: [{ name: 'VA', value: 'value1' }]
						}
					]
				},
				{
					name: '蔬菜',
					value: '蔬菜',
					filterList: [
						{
							title: '水果类',
							type: 'fruit',

							items: [
								{
									value: '香蕉',
									name: '香蕉'
								}
							]
						},
						{
							title: '蔬菜',
							type: '蔬菜',

							items: [{ name: '青菜', value: '蔬菜' }]
						}
					]
				}
			],
			menuList: [
				{
					title: '宏量成分',
					detailTitle: '请选择一项进行排序',
					isMutiple: false,
					key: 'jobType',
					reflexTitle: true,
					isSort: true,
					detailList: [
						{
							title: '默认',
							value: 'default'
						}
					]
				},
				{
					title: '维生素',
					key: 'salary',
					detailTitle: '请选择多项进行排序',
					isMutiple: true,
					detailList: [
						{
							title: '不限',
							value: '不限'
						},
						{
							title: 'VA',
							value: 'vitamin_a',
							num: 20
						},
						{
							title: 'VC',
							value: 'vitamin_c',
							num: 25
						}
						// {
						// 	title: 'VE',
						// 	value: 'VE'
						// },
						// {
						// 	title: 'VK',
						// 	value: 'VK'
						// },
						// {
						// 	title: 'B1',
						// 	value: 'vitamin_b1',
						// 	num:6
						// },
						// {
						// 	title: 'B2',
						// 	value: 'vitamin_b2',
						// 	num:6
						// },
						// {
						// 	title: 'B3',
						// 	value: 'B3'
						// },
						// {
						// 	title: 'B6',
						// 	value: 'B6'
						// },
						// {
						// 	title: 'B12',
						// 	value: 'B12'
						// },
						// {
						// 	title: '叶酸',
						// 	value: '叶酸'
						// },
						// {
						// 	title: 'VC',
						// 	value: 'vitamin_c',
						// 	num:6.5
						// }
					]
				},
				{
					title: '矿物质',
					key: 'single',
					detailTitle: '请选择多项进行排序',
					isMutiple: true,
					detailList: [
						{
							title: '不限',
							value: '不限'
						},
						{
							title: '钙',
							value: 'element_ca',
							num: 56
						},
						// {
						// 	title: '磷',
						// 	value: '磷'
						// },
						{
							title: '镁',
							value: 'element_m',
							num: 50
						},
						// {
						// 	title: '钠',
						// 	value: '钠'
						// },
						// {
						// 	title: '硫',
						// 	value: '硫'
						// },
						// {
						// 	title: '氮',
						// 	value: '氮'
						// },
						{
							title: '钾',
							value: 'element_k',
							num: 200
						}
						// {
						// 	title: '铁',
						// 	value: 'element_f',
						// 	num:12
						// }
					]
				},
				{
					title: '其他',
					key: 'sort',
					detailTitle: '请选择以下项进行排序',
					isMutiple: true,
					reflexTitle: true,
					detailList: [
						{
							title: '不限',
							value: '不限'
						},
						{
							title: '硫胺素',
							value: 'thiamine',
							num: 0.2
						},
						{
							title: '核黄素',
							value: 'riboflavin',
							num: 0.1
						},
						{
							title: '烟酸',
							value: 'element_k',
							num: 2
						}
					]
				}
			],
			filterShow: false,
			listTouchDirection: null,
			filterArr: [], //选择首页过滤时存储的过滤条件
			filterParams: {
				// fltd_type : [3],
				// bxlx : ['value1'],
			},

			foodList: [],
			isClickDot: false,
			dotEndStr: '',
			currFood: '',
			num: 1,
			element: [],
			foodDoubleList: [],
			pageInfo: {
				total: 0,
				rownumber: 10,
				pageNo: 1
			},
			lockEledata: null,
			radioIndex: 0,
			radioLabel: '',
		};
	},
	onLoad(option) {
		let query = JSON.parse(decodeURIComponent(option.condType));
		console.log('optionoptionoption', query);
		if (query.lackEle) {
			this.lockEledata = query.lackEle;
		}
		let singleType = '';
		if (query.type === 'food') {
			singleType = [
				{
					title: '热量',
					value: 'unit_energy'
				},
				{
					title: '蛋白质',
					value: 'protein'
				},
				{
					title: '脂肪',
					value: 'axunge'
				},
				{
					title: '碳水化合物',
					value: 'carbohydrate'
				}
			];
			let submenu = [
				{
					name: '蔬菜',
					value: '蔬菜',
					filterList: [
						{
							title: '蔬菜',
							type: 'fltd_type',

							items: [
								{
									value: '野生蔬菜',
									name: '野生蔬菜'
								},
								{
									value: '谷薯类',
									name: '谷薯类'
								},
								{
									value: '藻类',
									name: '藻类'
								},
								{
									value: '菌藻类',
									name: '菌藻类'
								},
								{
									value: '干豆类',
									name: '干豆类'
								},
								{
									value: '豆制品',
									name: '豆制品'
								},
								{
									value: '水果',
									name: '水果'
								},
								{
									value: '坚果',
									name: '坚果'
								},
								{
									value: '小麦',
									name: '小麦'
								},
								{
									value: '薯类',
									name: '薯类'
								}
							]
						}
					]
				}
			];
			this.submenu = submenu;
			this.menuList[0].detailList = [...this.menuList[0].detailList, ...singleType];
			if (query.order) {
				this.order = query.order;
			}
			this.getChooseFoodList();
			this.getElementLabel();
			this.onRefresh();
		} else if (query.type === 'sport') {
			singleType = [
				{
					title: '运动',
					detailTitle: '请选择一项进行排序',
					isMutiple: false,
					key: 'jobType',
					reflexTitle: true,
					isSort: true,
					detailList: [
						{
							title: '默认',
							value: 'default'
						},
						{
							title: '卡路里',
							value: 'unit_energy'
						}
					]
				}
			];
			let submenu = [
				{
					name: '跑步',
					value: '跑步',
					filterList: [
						{
							title: '跑步',
							type: 'fltd_type',

							items: [
								{
									value: '跑步',
									name: '跑步'
								}
							]
						}
					]
				}
			];

			this.submenu = submenu;
			this.menuList = singleType;
			// submenu.
			this.getChooseSportList();
		}

		this.searchArg = query;
		// this.getFoodsList();
		this.onRefresh();
		// if(query.type === 'food'){
		// }
	},
	methods: {
		/* 选择单位**/
		changeUnit(item){
			this.modalName = 'RadioModal'
		},
		RadioChange(e) {
			this.radioIndex = e.detail.value
			this.modalName = ''
			this.unitList.forEach((item,i)=>{
				let unitLabel = ''
				if(i == this.radioIndex){
					this.radioLabel = item
				}
			})
			if (Number(this.choiceNum) && !this.radioLabel) {
				this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
			}else if(Number(this.choiceNum) && this.radioLabel){
				if(this.radioLabel.unit_amount){
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				}else{						
					this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount/100) * this.currFood.unit_energy)
				}
			}
		},
		RadiohideModal(){
			this.modalName =  ''
		},
		/* 查询当前选择食物得单位**/
		async selectCurrFoodUnit(item){
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [
					{ colName: 'food_no', ruleType: 'eq', value: item.food_no }
				],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			this.radioLabel = ''
			this.radioIndex = 0
			let unitList = []
			unitList.push(item)
			if(res.data.state === 'SUCCESS'){
				unitList = [...unitList,...res.data.data]
				this.unitList = unitList
			}
			console.log("食物选择单位===>>>",res)
		},
		/* 查询食物元素label**/
		getElementLabel() {
			this.getServiceV2('srvhealth_diet_contents_select', 'list', 'list', 'health').then(a => {
				let colData = a.srv_cols.filter(item => {
					return item.in_list === 1;
				});
				this.colData = colData;
			});
		},
		back() {
			if (this.searchArg.type === 'food') {
				// 通知健康追踪页面，饮食记录已改变，需要刷新数据
				uni.$emit('dietUpdate');
			} else {
				// 通知健康追踪页面，运动记录已改变，需要刷新数据
				uni.$emit('sportUpdate');
			}
			uni.navigateBack({});
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				if (this.searchArg.type === 'sport') {
					this.modalName = null;
				} else {
					this.modalName = e.currentTarget.dataset.target;
				}
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		},
		onRefresh() {
			this.pageInfo.pageNo = 1;
			// this.getListData();
			this.$nextTick(() => {
				this.$refs.pullScroll.refresh();
			});
		},
		pullDown(pullScroll) {
			console.log(pullScroll.page);
			let page = this.pageInfo;
			this.pageInfo.pageNo = 1;
			let self = this;
			setTimeout(() => {
				this.getFoodsList(this.order, this.condObj);
				// self.getDrawCoupon(self.req.serviceName, self.req.cond).then(callBackData => {
				// if (callBackData.page.rownumber * callBackData.page.pageNo >= callBackData.page.total) {
				// 	// finish(boolean:是否显示finishText,默认显示)
				// 	self.$refs.pullScroll.finish();
				// } else {
				// 	self.$refs.pullScroll.success();
				// }
				// });
				// this.loadData(pullScroll);
			}, 200);
		},
		loadData(pullScroll) {
			console.log('上拉加载');
			let page = this.pageInfo;
			this.pageInfo.pageNo = pullScroll.page;
			console.log(pullScroll.page);
			this.getFoodsList(this.order, this.condObj);
			// this.getDrawCoupon(this.req.serviceName, this.req.cond);
			// if (page.rownumber * page.pageNo >= page.total) {
			// 	// finish(boolean:是否显示finishText,默认显示)
			// 	pullScroll.finish();
			// } else {
			// 	pullScroll.success();
			// }
			// });
		},
		/* 点击跳转至食物详情 **/
		toFoodsDetail(itemFood) {
			console.log('itemFood', itemFood);
			if (this.searchArg.type === 'food') {
				uni.navigateTo({
					url:
						'/pages/foodDetail/foodDetail?foods=' + encodeURIComponent(JSON.stringify(itemFood)) + '&filters=' + encodeURIComponent(JSON.stringify(this.filterArr))
				});
			} else if (this.searchArg.type === 'sport') {
				uni.navigateTo({
					url: '/pages/sportsDetail/sportsDetail?sport=' + encodeURIComponent(JSON.stringify(itemFood))
				});
				console.log('点击运动详情');
			}
		},
		/* 查询已经选择过得运动**/
		async getChooseSportList() {
			let self = this;
			let loginUserInfo = uni.getStorageSync('login_user_info');
			let userName = uni.getStorageSync('current_user');
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: userName },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				],
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length >= 0) {
				this.chooseFoodArr = res.data.data;
				for (let i = 0; i < this.chooseFoodArr.length; i++) {
					let urls = self.$api.downloadFile + this.chooseFoodArr[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
					this.$set(this.chooseFoodArr[i], 'imgurl', urls);
					// self.getFilePath(this.chooseFoodArr[i].image).then(url => {
					// 	let urls = self.$api.getFilePath + url[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
					// 	this.$set(this.chooseFoodArr[i], 'imgurl', urls);
					// });
				}
			}
		},
		/* 查询已经选择过得食物**/
		async getChooseFoodList(order) {
			let self = this;
			let loginUserInfo = uni.getStorageSync('login_user_info');
			let userName = uni.getStorageSync('current_user');
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: userName },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				],
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length >= 0) {
				this.chooseFoodArr = res.data.data;
				for (let i = 0; i < this.chooseFoodArr.length; i++) {
					let urls = self.$api.downloadFile + this.chooseFoodArr[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
					this.$set(this.chooseFoodArr[i], 'imgurl', urls);
					// self.getFilePath(this.chooseFoodArr[i].image).then(url => {
					// 	let urls = self.$api.getFilePath + url[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
					// 	this.$set(this.chooseFoodArr[i], 'imgurl', urls);
					// });
				}
			}
		},
		/* 已选食物的删除**/
		delItem(item) {
			console.log('item---', item);
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否确认删除？',
				success: res => {
					if (res.confirm) {
						let serviceName = '';
						if (self.searchArg.type === 'food') {
							serviceName = 'srvhealth_diet_record_delete';
						} else if (self.searchArg.type === 'sport') {
							serviceName = 'srvhealth_body_activity_record_delete';
						}
						let req = [
							{
								serviceName: serviceName,
								condition: [
									{
										colName: 'id',
										ruleType: 'eq',
										value: item.id
									}
								]
							}
						];
						let url = self.getServiceUrl('health', serviceName, 'operate');
						self.$http.post(url, req).then(res => {
							if (res.data.resultCode === 'SUCCESS') {
								uni.showToast({
									title: '删除成功！',
									icon: 'none'
								});
								if (self.searchArg.type === 'food') {
									self.getChooseFoodList();
								} else if (this.searchArg.type === 'sport') {
									self.getChooseSportList();
								}
							}
						});
					}
				}
			});
		},
		/* 点击搜索**/
		search() {
			if (this.searchValue) {
				this.getSearchValue(this.searchValue);
			} else {
				this.getFoodsList();
			}
		},
		/* 输入框输入时触发**/
		inputChange(e) {
			console.log('输入框发生变化--', e.detail.value);
			let serValue = e.detail.value;
			if (serValue) {
				this.getSearchValue(serValue);
			} else {
				this.getFoodsList();
			}
		},
		async getSearchValue(value) {
			let self = this;
			let url = this.getServiceUrl('health', this.searchArg.serviceName, 'select');
			let req = { serviceName: this.searchArg.serviceName, colNames: ['*'], condition: [{ colName: this.searchArg.colName, ruleType: 'like', value: value }] };
			let res = await this.$http.post(url, req);
			let resData = res.data.data;
			this.foodList = resData;
			for (let i = 0; i < resData.length; i++) {
				if (resData[i][self.searchArg.imgCol]) {
					let fileDatas = await self.getFilePath(resData[i][self.searchArg.imgCol]);
					url = self.$api.getFilePath + fileDatas[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
					self.$set(resData[i], 'imgurl', url);
				}
			}
		},
		jbMsg(res) {
			//执行加入购物车的逻辑
			console.log('执行回调', res.code);
		},
		onSelected(e) {
			//时间选择器
			this.showTimePicker = false;
			if (e) {
				// this.dietIn = 0
				// this.sportOut = 0
				//选择的值
				console.log('value => ' + e.value);
				this.currTime = e.value;
				// this.$set(this.currFood,"htime",e.value)
			}
		},
		openCalendar() {
			console.log('打开日历');
		},
		openTime() {
			this.showTimePicker = true;
			console.log('打开时间');
		},
		async goBalanceDiet() {
			if (this.chooseFoods.length > 0) {
				let arr = [];			
				this.chooseFoods.forEach(item => {
					let obj = {
						userno: uni.getStorageSync('login_user_info').user_no,
						hdate: this.currDate ? this.currDate : this.nowDate,
						htime: this.currTime ? this.currTime : this.nowDateTime,
						name: item.name,
						amount: item.amount,
						unit: item.unit,
						energy: item.heatNum,
						user_name: uni.getStorageSync('current_user'),
						image: item.image,
						unit_weight_g:this.radioLabel?this.radioLabel.amount:100
					};
					if (this.searchArg.type === 'food') {
						// if (item.unit === 'g') {
						// 	obj.unit_weight_g = item.unit_amount;
						// }
					}
					arr.push(obj);
				});
				let serviceName = '';
				if (this.searchArg.type === 'food') {
					serviceName = 'srvhealth_diet_record_add';
				} else if (this.searchArg.type === 'sport') {
					serviceName = 'srvhealth_body_activity_record_add';
				}
				let url = this.getServiceUrl('health', serviceName, 'operate');
				let req = [{ serviceName: serviceName, colNames: ['*'], data: arr }];
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					if (this.searchArg.type === 'food') {
						this.getChooseFoodList();
						// 通知健康追踪页面，饮食记录已改变，需要刷新数据
						uni.$emit('dietUpdate');
					} else {
						// 通知健康追踪页面，运动记录已改变，需要刷新数据
						this.getChooseSportList();
						uni.$emit('sportUpdate');
					}
				}
			}
		},
		hideModal() {
			this.showCarModal = false;
			this.modalName = ''
		},
		openCar() {
			console.log('点击购物车');
			this.showCarModal = true;
		},
		confirms() {
			this.$set(this.currFood, 'heatNum', this.heatNum);
			this.$set(this.currFood, 'amount', this.choiceNum);
			
			if (this.currTime) {
				this.$set(this.currFood, 'htime', this.currTime);
			} else {
				this.$set(this.currFood, 'htime', this.nowDateTime);
			}
			if (this.choiceNum) {
				// this.chooseFoodArr.push(this.currFood);
				this.chooseFoods = [];
				this.chooseFoods.push(this.currFood);
				this.element = ['.confir-btn', '.add-button'];
				this.num++;
			}
			this.showBottomModal = false;
			this.goBalanceDiet();
			// chooseFoodArr.push(this.currFood)
		},

		async getFoodsList(order = null, cond = null, type = null) {
			let self = this;
			let url = this.getServiceUrl('health', this.searchArg.serviceName, 'select');
			let req = {
				serviceName: this.searchArg.serviceName,
				colNames: ['*'],
				// condition: [],
				relation_condition: {
					relation: 'OR',
					data: []
				},
				page: {
					// rownumber: this.pageInfo.rownumber,
					// pageNo: this.pageInfo.pageNo
				},
				order: []
			};
			if (!type) {
				req.page = {
					rownumber: this.pageInfo.rownumber,
					pageNo: this.pageInfo.pageNo
				};
			}
			if (order && order.col) {
				req.order = [
					{
						colName: order.col,
						orderType: order.type
					}
				];
			}
			if (this.searchArg.order) {
				req.order = this.searchArg.order;
			}
			if (cond) {
				req.relation_condition.data.push(cond);
			}
			let res = await this.$http.post(url, req);
			if (this.pageInfo.pageNo === 1) {
				self.foodList = [];
			}
			self.pageInfo.total = res.data.page.total;
			self.pageInfo.pageNo = res.data.page.pageNo;
			let page = self.pageInfo;
			if (page.rownumber * page.pageNo >= page.total) {
				// finish(boolean:是否显示finishText,默认显示)
				self.$refs.pullScroll.finish();
			} else {
				self.$refs.pullScroll.success();
			}
			let data = res.data.data;
			if (data.length > 0) {
				if (type) {
					console.log('00000------', res.data.data);
					let a = res.data.data.sort(this.sorta);
					let b = a.sort(this.sortb);
					console.log('sorta-------', b);
					this.foodList = [...this.foodList, ...res.data.data];
				} else {
					this.foodList = [...this.foodList, ...res.data.data];
				}
				if (!order) {
					this.foodDoubleList = JSON.parse(JSON.stringify(res.data.data));
				}
				for (var i = 0; i < data.length; i++) {
					if (data[i].image) {
						// let fileDatas = await self.getFilePath(data[i].image);
						// console.log('img---', fileDatas);
						// url = self.$api.getFilePath + fileDatas[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						url = self.$api.downloadFile + data[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						// let url = this.$api.serverURL + '/file/download?filePath=' + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
						self.$set(data[i], 'imgurl', url);
					}
				}
			}
			console.log('res---', res.data.data, this.colData);
		},
		/* 点击键盘数字**/
		keyboardDown(e) {
			if (e.type === 'num') {
				this.choiceNum += e.value;
				if (Number(this.choiceNum) && !this.radioLabel) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				}else if(Number(this.choiceNum) && this.radioLabel){
					if(this.radioLabel.unit_amount){
						this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
					}else{						
						this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount/100) * this.currFood.unit_energy)
					}
				}
			} else {
				let currNum = this.choiceNum;
				currNum = currNum.substring(0, currNum.length - 1);
				this.choiceNum = currNum;
				
				if (Number(this.choiceNum) && !this.radioLabel) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				}else if(Number(this.choiceNum) && this.radioLabel){
					if(this.radioLabel.unit_amount){
						this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
					}else{						
						this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount/100) * this.currFood.unit_energy)
					}
				}else{
					this.heatNum = 0
				}
			}
		},
		/* 点击选择食物**/
		chooseFood(e) {
			// this.isClickDot = false,
			this.dotEndStr = '';
			this.choiceNum = '';
			this.heatNum = 0;
			this.showBottomModal = true;
			let label_obj = {};
			let colData = this.colData;
			colData.forEach(item => {
				for (let key in e) {
					if (item.columns === key && item.col_type == 'Double') {
						label_obj[key] = item.label;
					}
				}
			});
			this.currFoodLabel = label_obj;
			this.currFood = e;
			
			this.selectCurrFoodUnit(e)
			console.log('选择食物：', e);
		},
		onSureFilter(e) {
			//确定
			console.log(e);
			this.filterParams = e.filterParams;
			let condObj = {
				relation: 'OR',
				data: []
			};
			if (e.allSelectResult.fltd_type && e.allSelectResult.bxlx) {
				let fltd_type = e.allSelectResult.fltd_type;
				let bxlx = e.allSelectResult.bxlx;

				fltd_type.forEach(item => {
					let obj_fltd = {
						colName: 'classify',
						value: item,
						ruleType: 'eq'
					};
					condObj.data.push(obj_fltd);
				});
				bxlx.forEach(item1 => {
					let obj_bxlx = {
						colName: 'classify',
						value: item1,
						ruleType: 'eq'
					};
					condObj.data.push(obj_bxlx);
				});
			} else if (e.allSelectResult.fltd_type || e.allSelectResult.bxlx) {
				let fltd_type = e.allSelectResult.fltd_type ? e.allSelectResult.fltd_type : e.allSelectResult.bxlx;
				fltd_type.forEach(item => {
					let obj = {
						colName: 'classify',
						value: item,
						ruleType: 'eq'
					};
					condObj.data.push(obj);
				});
			}

			if (condObj.data.length <= 0) {
				condObj = null;
			}
			this.condObj = condObj;
			this.getFoodsList(null, condObj);
			console.log('condObj---', condObj);
			this.onHideFilter();
		},

		onResetFilter(e) {
			//重置
			console.log(e);
		},
		onHideFilter() {
			this.filterShow = false;
		},
		showfilter() {
			this.$refs.filter.hideclose();
			this.filterShow = true;
		},
		searchStart() {
			let serValue = this.searchValue;
			console.log('searchStart', serValue);
			if (serValue) {
				this.serBtn = true;
			} else {
				uni.showToast({
					title: '请输入搜索内容',
					icon: 'none'
				});
			}
		},
		searchEnd() {
			this.serBtn = false;
			this.searchValue = '';
		},
		// getDoubleData(){
		// 	let self = this;
		// 	let url = this.getServiceUrl('health',this.searchArg.serviceName, 'select');
		// 	let req = {
		// 		serviceName: this.searchArg.serviceName,
		// 		colNames: ['*'],
		// 		// condition: [],
		// 		relation_condition:{
		// 			relation: "OR",
		// 			data:[]
		// 		},
		// 		order: []
		// 	}

		// 	if(order && order.col){
		// 		req.order = [{
		// 			colName:order.col,
		// 			orderType:order.type
		// 		}]
		// 	}
		// 	if(cond){
		// 		req.relation_condition.data.push(cond)
		// 	}
		// 	let res = await this.$http.post(url, req);
		// 	let data = res.data.data;
		// 	if(data.length > 0){
		// 		this.foodList = res.data.data;
		// 		for (var i = 0; i < data.length; i++) {
		// 			if (data[i].image) {
		// 				let fileDatas = await self.getFilePath(data[i].image);
		// 				console.log('img---', fileDatas);
		// 				url = self.$api.getFilePath + fileDatas[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
		// 				// let url = this.$api.serverURL + '/file/download?filePath=' + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
		// 				self.$set(data[i], 'imgurl', url);
		// 			}
		// 		}
		// 	}
		// },
		result(val) {
			console.log('filter_result:', val);
			this.pageInfo.pageNo = 1;
			if (val[0].result.jobType) {
				let order = '';
				if (val[0].result.jobType != 'default') {
					order = {
						col: val[0].result.jobType,
						type: 'asc'
					};
				}
				this.order = order;
				this.getFoodsList(order, this.condObj);
			}
			if (val[1].title === 'salary' || val[1].title === 'single' || val[1].title === 'sort') {
				let arr = ['salary', 'single', 'sort'];
				let cond = {
					relation: 'AND',
					data: []
				};

				let salary_data = val[0].result;
				let hasValue = false;
				let filterArr = [];
				arr.forEach(classify => {
					if (salary_data[classify] && salary_data[classify].length > 0) {
						filterArr = [...filterArr, ...salary_data[classify]];
						hasValue = true;
						salary_data[classify].forEach(item => {
							this.menuList.forEach(men => {
								if (men.key === classify) {
									men.detailList.forEach(det => {
										if (det.value === item) {
											let obj = {
												colName: item,
												ruleType: 'ge',
												value: det.num
											};
											cond.data.push(obj);
										}
									});
								}
							});
						});
					}
				});
				this.filterArr = filterArr;
				console.log('选中的过滤条件', filterArr);
				if (hasValue) {
					let order = null;
					if (cond.data.length === 1) {
						order = {
							col: cond.data[0].colName,
							type: 'desc'
						};
					}
					this.getFoodsList(order, cond, 'filtrate');
				} else {
					this.getFoodsList();
				}
				console.log('组装之后的condition---', cond);
			}
			this.filterResult = JSON.stringify(val, null, 2);
		}
	}
};
</script>

<style lang="less" scoped>
.contents {
	// overflow: hidden;
	.flexSelece {
	}
}
.food-list {
	display: flex;
	flex-direction: column;
	border-top: 1upx solid #eee;
	margin-top: 50upx;
	.list-item {
		display: flex;
		width: calc(100% - 50upx);
		margin: 0 auto;
		padding: 10upx;
		align-items: center;
		border-bottom: 1upx solid #eee;
		.img-box {
			width: 100upx;
			height: 100upx;
			border-radius: 10upx;
			background-color: #eee;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.info {
			flex: 1;
			padding-left: 20upx;
			.name {
				font-weight: 700;
				font-size: 24upx;
				line-height: 40upx;
			}
			.infomation {
				font-size: 20upx;
				transform: scale(0.7);
				color: #999;
				.calorie {
					padding-right: 10upx;
				}
			}
		}
		.status {
			width: 20upx;
			height: 20upx;
			border-radius: 50%;
		}
	}
}
.text {
	margin-top: 50px;
	margin-left: 20px;
	width: 100%;
}
.contentList {
	overflow-y: scroll;
	// height: calc(100vh - 300upx) !important;
}
.boxfood {
	width: 100%;
	margin: 0 auto;
	border-top: 1upx solid #e8e8e8;
	padding: 25upx 0;
	background: #ffffff;
	display: flex;
	justify-content: space-between !important;
	align-items: center;
	position: relative;
	.boxfood-item {
		width: 100%;
		justify-content: space-between;
		display: flex;
	}
	.relian {
		// position: absolute;
		// right: 40px;
		// top: 0;
		// bottom: 0;
		display: flex;
		margin-right: 20upx;
		align-items: center;
		font-size: 12px;
		.status {
			display: block;
			height: 20upx;
			width: 20upx;
			border-radius: 50%;
			margin-right: 10upx;
		}
	}
	.smallbox {
		display: flex;
		align-items: center;
		image {
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
			border-radius: 8upx;
			margin-left: 20upx;
		}
		.textbox {
			.title-food {
				font-weight: bold;
				font-size: 30upx;
				display: flex;
				.lock-ele {
					margin-left: 5px;
					.second-lock {
						color: #dc2a26;
					}
				}
			}
			.food-utis {
				margin-top: 6upx;
				font-size: 24upx;
				.utis {
					color: #807d7d;
				}
				.number {
					color: #dc2a26;
				}
			}
		}
	}
}
.bottom-modal {
	.cu-dialog {
		height: 1290rpx;
		.cu-bar {
			padding: 0 50upx;
		}
		.button {
			font-weight: 800;
		}
		.food-list {
			margin-top: 0;
			border-top: none;
			border-bottom: 1upx solid #eee;
			padding: 10upx 0;
			.list-item {
				border-bottom: none;
			}
		}
		.calculate {
			display: flex;
			justify-content: space-between;
			padding: 20upx 50upx;
			min-height: 100upx;
			align-items: center;
			color: #999;
			.calorie{
				min-width: 100upx;
			}
			.amount {
				color: #009688;
				font-weight: 800;
				max-width: 200rpx;
				margin-left: 4rem;
				.number {
					padding: 0 20upx;
					font-size: 34upx;
					border-bottom: 5upx solid #009688;
				}
				.unit {
					text-align: center;
					padding: 10upx 0;
				}
			}
			.weight{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				min-width: 220upx;
				image{
					width: 40upx;
					height: 40upx;
					margin-left: 20upx;
				}
			}
		}
	}
}
.input-box {
	display: flex;
	flex-wrap: wrap;
	border-top: 1px solid #cccccc;
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
.add-button {
	position: fixed;
	bottom: 20upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: rgb(246, 210, 0);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
	.add-button-num {
		position: absolute;
		right: -4px;
		top: 1px;
		height: 18px;
		width: 18px;
		background-color: #ff4000;
		color: #ffffff;
		border-radius: 50%;
		z-index: 1;
		font-size: 10px;
		text-align: center;
		line-height: 18px;
	}
}
.car-model {
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 990;
	.cu-dialog {
		max-height: 60vh;
		.cu-bar {
			.left {
				min-width: 48px;
				min-height: 48px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 17px;
				opacity: 0;
			}
		}
		.foods-cont {
			padding: 0;
			min-height: calc(50vh - 200rpx);
			max-height: calc(60vh - 200rpx);
			overflow-y: scroll;
			display: flex;
			flex-direction: column;
		}
		.button-box {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			padding: 15rpx 0;
			button {
				width: 80%;
			}
		}
	}
}

.date-time {
	display: flex;
	color: #000;
	font-weight: 700;
	font-size: 16px;
}
.foods-move {
	width: 130upx !important;
}
.contentList /deep/ .move-cur {
	transform: translateX(-130upx) !important;
}
.ele-text-wrap {
	display: flex;
	flex-direction: column;
	color: #999;
	margin-left: 10px;
	margin-top: 10px;
	.ele-text-cen {
		display: flex;
		flex-wrap: wrap;
		.ele-text-cen-item-title{
			color: #000000;
		}
		.ele-text-cen-item{
			display: flex;
			flex-direction: column;
			height: 100%;
			margin: 0 20upx;
			.ele-text-cen-item-cen{
				display: flex;
				flex-wrap: wrap;
			}
		}
	}
	.ele-text {
		margin: 5px;
	}
}
.radio-modal{
	display: flex;
	align-items: center;
}
.radio-modal /deep/ uni-radio::before{
	right:20upx;
}
</style>
