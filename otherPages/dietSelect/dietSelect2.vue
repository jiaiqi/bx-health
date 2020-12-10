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
							<text @click="showfilter">筛选</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<bx-filtrate :menuAgList='menuAgList' :searchArg="searchArg" :childChooseArr='childChooseArr' @clickFood="chooseFood" @clickMenu="chooseMenu" @clickTag="tagClick"></bx-filtrate>
		<!-- <view class="filtrate-wrap">
			<view v-if="childChooseArr.length > 0" class="filtrate-choose">
				<text>已选择：</text>
				<view v-for="(item,index) in childChooseArr" class="filtrate-choose-item">
					<u-tag :text="item.title" closeable :show="item.choose" type="warning" @close="tagClick(item)" mode="light"/>
				</view>
			</view>
			<view class="filtrate-item-wrap">
				<view v-for="(item,index) in menuAgList" :key="index" class="filtrate-item">
					<view class="filtrate-item-left" style="display: flex;flex-shrink: 0;width: 152rpx;">
						{{item.classify_name}}
					</view>
					<view class="" style="display: flex;  flex-flow: wrap;">
						<view @click="chooseMenu(item,cate)" v-for="(cate,i) in item.children" :class="cate.choose?'cate-active':''" class="filtrate-item-right">
							<text>{{cate.title}}</text>
							<u-icon size="24" v-show="cate.current_num == 1 && item.type !=='food' && childChooseArrLength == 1" name="arrow-downward"></u-icon>
							<u-icon size="24" v-show="cate.current_num == 2 && item.type !=='food' && childChooseArrLength == 1" name="arrow-upward"></u-icon>
							<text v-show="cate.current_num == 1 && item.type !=='food' && childChooseArrLength >= 2">(高)</text>
							<text v-show="cate.current_num == 2 && item.type !=='food' && childChooseArrLength >= 2">(中)</text>
							<text v-show="cate.current_num == 3 && item.type !=='food' && childChooseArrLength >= 2">(低)</text>
						</view>
					</view>
					
				</view>
			</view>
		</view> -->
		<!-- <sPullScroll
			ref="pullScroll"
			:heightStyle="heightStyle"
			:pullDown="pullDown"
			:pullUp="loadData"
			:enablePullDown="true"
			:enablePullUp="true"
			:top="topNum"
			:fixed="true"
			:bottom="0"
			finishText="我是有底线的..."
		>
			<view class="cu-list menu-avatar contentList">
				<view
					@click.stop="chooseFood(food)"
					:data-target="'move-box-' + idx"
					:class="modalName == 'move-box-' + idx ? 'move-cur' : ''"
					class="cu-item boxfood"
					v-for="(food, idx) in foodList"
					:key="idx"
				>
					<view class="smallbox">
						<view class="smallbox-img">
							<u-image width="100%" height="100%" v-if="!food.imgurl" src="/otherPages/static/img/none.png"></u-image>
							<u-image width="100%" height="100%" v-else :src="food.imgurl"></u-image>
						</view>
						
						<view class="textbox">
							<view class="title-food">
								{{ food.name }}								
							</view>
							<view v-if="lockEledata " class="lock-ele">
								(
								<text>{{ lockEledata.label }}:</text>
								<text class="second-lock">{{ food[lockEledata.key] }}</text>
								<text class="second-lock">{{ lockEledata.units ? lockEledata.units.split('/')[0] : '' }}</text>
								)
							</view>
							<view class="food-utis">
								<text class="number" style="margin-right: 5px;">{{ food.unit_energy }}千卡</text>
								<text class="utis">/{{ food.unit_amount + food.unit }}</text>
							</view>
						</view>
					</view>	
				</view>
				<view 
					@click.stop="tofeedback"
					class="cu-item boxfood couple-boxfood"
					v-if="isLoad"
				>
					<view class="smallbox couple-smallbox">
						<view class="smallbox-couple-top">
							<u-icon size="70" name="plus"></u-icon>
						</view>
						<view v-if="!isShowMyList" class="smallbox-couple-bot">
							<text>没有找到想要的?去</text>
							<text>反馈</text>
						</view>
						<view v-else class="smallbox-couple-bot">
							<text>没有找到想要的?去</text>
							<text>添加</text>
						</view>
					</view>
				</view>
			</view>
		</sPullScroll> -->
		<!-- </scroll-view> -->
		<view v-if="pageType === 'sport'" class="cu-modal bottom-modal" :class="{ show: showBottomModal }">
			<view class="cu-dialog" :class="pageType === 'sport'?'sport-dialog':''">
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
							<view class="calorie">{{ heatNum ? heatNum.toFixed(1) :''}}千卡</view>
						</view>
					</view>					
					<view class="calculate">						
							<view  class="weight">
								<view class="calculate-l">
									单位：
								</view>
								<view @click="changeUnit(u,ids)" v-for="(u,ids) in unitList" :key="ids" :class="currIndex==ids?'active-unit':''" class="unit">
									{{u.unit_amount?u.unit_amount+u.unit:u.unit}}								
								</view>
							</view>
						
					</view>
					<view class="amount">
						<view class="input-box">
							<view class="key-left">
								<text @click="countDietNum('-0.1')">-0.1</text>
								<text @click="countDietNum('-1')">-1</text>
							</view>
							<u-input placeholder=" " :disabled="true" :clearable="false" :border="true" maxlength="20" v-model="choiceNum" type="number" />
							<view class="key-right">
								<text @click="countDietNum('+1')">+1</text>
								<text @click="countDietNum('+0.1')">+0.1</text>
							</view>
						</view>
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
					<view class="boxfood_car" v-for="(food, idx) in chooseFoodArr" :key="idx">
						<view class="smallbox_car">
							<image :src="food.imgurl" mode="scaleToFill"></image>
							<view class="textbox_car">
								<view class="title-food_car">{{ food.name }}</view>
								<view class="food-utis_car">
									<text class="number_car" style="margin-right: 5px;">{{ food.energy }}千卡</text>
									<text class="utis_car">/ {{ food.unit_weight_g?food.amount * food.unit_weight_g:food.amount  + food.unit }}</text>
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
		<view class="public-button-box add-button">
			<view @click="openCar" class="lg text-gray cuIcon-cart add-button-wrap">
					<text v-show="chooseFoodArr.length > 0" class="add-button-num">{{ chooseFoodArr.length }}</text>				
			</view>
		</view>
	</view>
</template>

<script>
import bxFiltrate from '@/otherPages/components/bx-filtrate/bx-filtrate.vue'
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import jumpBall from '@/otherPages/components/hx-jump-ball/hx-jump-ball.vue';
import sPullScroll from '@/components/s-pull-scroll';
export default {
	components: {
		sPullScroll,			
		MxDatePicker,
		jumpBall,
		bxFiltrate
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
			isSeekValue:true, // 是否搜索到内容
			chooseFoods: [],
			value1:0,
			list: [],
			current: 0,
			isLoad:false,
			currIndex:'',
			topNum:440,
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
			unitList:[],
			nowDate: this.formateDate(new Date(), 'date').replace(/\s*/g, ''),
			nowDateTime: this.formateDate(new Date(), 'dateTime'),
			selectDate: this.formateDate(new Date(), 'date'),
			defultChoiceNum: '0.00',
			modalName: '',
			searchArg: {
				// type:"food",
				serviceName:'srvhealth_diet_contents_select',
				imgCol:'image',
				wordKey:{
					title:"name",
					unit:"unit",
					energy:"unit_energy",
					unitNum:"unit_amount"
				}
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
			menuAgList:[],
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
				rownumber: 20,
				pageNo: 1
			},
			lockEledata: null,
			radioIndex: 0,
			radioLabel: '',
			TabCur: 0,
			scrollLeft: 0,
			pageType:'',
			childChooseArr:[],
			childChooseArrLength:0,
			classifyCond:null,
			copyData:[],
			isShowMyList:false
		};
	},
	onShow() {
		this.getChooseFoodList();
		this.getElementLabel();
		// this.onRefresh();
	},
	onLoad(option) {
		let query = JSON.parse(decodeURIComponent(option.condType));
		if(query.date){
			this.selectDate = query.date
		}
		console.log('optionoptionoption', query);
		if (query.lackEle) {
			this.lockEledata = query.lackEle;
		}
		let singleType = '';
		this.pageType = query.type
		// this.searchArg = query;
		if (query.type === 'food') {
					let menuData = [
						{
							classify_name:'分类',
							type:"food",
							colunn:'',
							children:[
								{
									title:'食材',
									value:'matter',
									choose:true
								},
								{
									title: '食物',
									value: 'foods',
									choose:false
								}																																															
							]
						},
						{
							classify_name:'子类',
							type:'subclass',
							colunn:'classify',
							children:[{
								title: '全部',
								value: '全部',
								choose:true
							},{
									title: '蔬菜',
									value: '蔬菜',
									choose:false
								},
								{
									title: '水果干果',
									value: '水果干果',
									choose:false
								},
								
								{
									title: '菌藻类',
									value: '菌藻类',
									choose:false
								},
								{
									title: '坚果',
									value: '坚果',
									choose:false
								},
								{
									title: '谷薯类',
									value: '谷薯类',
									choose:false
								},
								{
									title: '蛋奶类',
									value: '蛋奶类',
									choose:false
								},
								{
									title: '畜禽肉',
									value: '畜禽肉',
									choose:false
								},
								{
									title: '水产品',
									value: '水产品',
									choose:false
								},
								{
									title: '调味品',
									value: '调味品',
									choose:false
								},
								{
									title: '饮品',
									value: '饮品',
									choose:false
								},
								{
									title: '糕点类',
									value: '糕点类',
									choose:false
								},
								{
									title: '其他',
									value: '其他',
									choose:false
								}]
						},
						{
						classify_name:'宏量成分',
						type:'capacity',				
						children:[
							{
								title: '默认',
								value: 'default',
								choose:true,
								current_num:0
							},
							{
								title: '热量',
								value: 'unit_energy',
								choose:false,
								num: 646,
								current_num:0
							},
							{
								title: '蛋白质',
								value: 'protein',
								choose:false,
								num: 51.6,
								current_num:0
							},
							{
								title: '脂肪',
								value: 'axunge',
								choose:false,
								num: 58.8,
								current_num:0
							},
							{
								title: '碳水化合物',
								value: 'carbohydrate',
								choose:false,
								num: 85.8,
								current_num:0
							}
						]
					},{
						classify_name:'维生素',
						type:'vitamin',				
						children:[{
									title: '不限',
									value: '不限',
									choose:true,
									current_num:0
								},
								{
									title: 'VA',
									value: 'vitamin_a',
									choose:false,
									num: 20,
									current_num:0
								},
								{
									title: 'VC',
									value: 'vitamin_c',
									choose:false,
									num: 25,
									current_num:0
								},{
									title: 'VD',
									value: 'vitamin_d',
									choose:false,
									num: 141,
									current_num:0
								},{
									title: 'VE',
									value: 'vitamin_e',
									choose:false,
									num: 46.55,
									current_num:0
								},{
									title: 'B1',
									value: 'vitamin_b1',
									choose:false,
									num: 1.01,
									current_num:0
								},{
									title: 'B2',
									value: 'vitamin_b2',
									choose:false,
									num: 1.32,
									current_num:0
								},{
									title: 'B3',
									value: 'vitamin_b3',
									choose:false,
									num: 7.54,
									current_num:0
								}
								]
						},{
						classify_name:'矿物质',
						type:'mineral',				
						children:[
								{
									title: '不限',
									value: '不限',
									choose:true,
									current_num:0
									
								},
								{
									title: '钙',
									value: 'element_ca',
									choose:false,
									num: 635,
									current_num:0
								},
								{
									title: '镁',
									value: 'element_m',
									choose:false,
									num: 186,
									current_num:0
								},
								{
									title: '钾',
									value: 'element_k',
									choose:false,
									num: 877,
									current_num:0
								},								
								{
									title: '钠',
									value: 'element_na',
									choose:false,
									num: 250,
									current_num:0
								},
								{
									title: '铁',
									value: 'element_fe',
									choose:false,
									num: 12,
									current_num:0
								},
								{
									title: '锌',
									value: 'element_zn',
									choose:false,
									num: 10,
									current_num:0
								}
							]
						}
						]
						this.copyData = JSON.parse(JSON.stringify(menuData))
						this.menuAgList = menuData
						// this.searchArg.serviceName = 'srvhealth_mixed_food_nutrition_contents_select'
					if (query.order) {
						this.order = query.order;
					}
					this.getChooseFoodList();
					this.getElementLabel();
					// this.onRefresh();
				} else if (query.type === 'sport') {
					let menuData = [{
						classify_name:'运动',
						type:'capacity',
						children:[{
							title: '默认',
							value: 'default',
							choose:true
						},{
							title: '卡路里',
							value: 'unit_energy',
							choose:false,
							num: 880,
							current_num:0
						}]
					}]
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
					this.menuAgList = menuData;
					this.topNum = 160
					this.getChooseSportList();
				}
		// this.onRefresh();
	},
	watch: {
		childChooseArr(newValue, oldValue) {
			console.log("-------------",newValue.length)
			this.childChooseArrLength = newValue.length
			if(newValue.length > 0){
				if(this.pageType == 'food'){
					this.topNum = 500
				}else if(this.pageType== 'sport'){
					this.topNum = 240
				}
			}else{
				if(this.pageType == 'food'){
					this.topNum = 430
				}else if(this.pageType== 'sport'){
					this.topNum = 180
				}
			}
		}
	},
	methods: {
		/*点击前往反馈页面**/
		tofeedback(){
			let no = null
			if(this.pageType === 'food'){
				no = '20201105113648000165'
			}else if(this.pageType === 'sport'){
				no = '20201105115133000167'
			}
			let url = `/questionnaire/index/index?formType=form&activity_no=${no}&status=进行中`;
			if(!this.isShowMyList){
				uni.navigateTo({
					url: url
				});
			}else{
				let cond = [{
					colName:"restaurant_no",
					ruleType:"eq",
					value:""
				}]
				uni.navigateTo({
				  url: '/publicPages/newForm/newForm?serviceName=srvhealth_mixed_food_nutrition_contents_add&type=add'
				  // url: '/publicPages/form/form?serviceName=srvhealth_mixed_food_nutrition_contents_add&type=add&addType=onwer&cond='+decodeURIComponent(JSON.stringify(cond))
				});
			}
			
		},
		countDietNum(num){
			let value = Number(this.value1)
			if(value >= 0){				
				if(num === '-0.1'){
					if(value > 0){
						value = value - 0.1
					}else{
						value = 0
					}
				}else if(num === '-1'){
					if(value >= 1){
						value = value - 1
					}
				}else if(num === '+1'){
					value = value + 1
					
				}else if(num === '+0.1'){
					value = value + 0.1
				}
				this.value1 = value.toFixed(1)
				this.choiceNum = value.toFixed(1)
				if (Number(this.choiceNum) && !this.radioLabel) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				}else if(Number(this.choiceNum) && this.radioLabel){
					if(this.radioLabel.unit_amount){
						this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
					}else{						
						this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount/100) * this.currFood.unit_energy)
					}
				}
				if(value == 0){
					this.heatNum = 0
				}
			}
		},
		/*标签关闭事件**/
		tagClick(item){
			let cond = {
				relation: 'AND',
				data: []
			};
			let order = ""
			let childChooseArr = this.childChooseArr
			childChooseArr.forEach((ch,i)=>{
				if(ch.title === item.title){
					childChooseArr.splice(i,1)
				}
			})
			let menuData = this.menuAgList
			let hasChild = false
			let childCloseData = []
			menuData.forEach(m=>{
				m.children.forEach(c=>{
					if(c.title === item.title){
						hasChild = true
						c.choose = false
						c.current_num = 0
						
						if(childChooseArr.length <= 0){
							m.children[0].choose = true
						}else{
							childChooseArr.forEach(b=>{
								if(b.title === c.title){
									childCloseData.push(b)
								}
							})
						}
						if(childCloseData.length == 0){
							m.children[0].choose = true
						}
					}					
				})
				
			})						
			if(childChooseArr.length === 0){
				this.getFoodsList()
			}else{
				childChooseArr.forEach(son=>{
					
					let obj = {
						colName:son.value,
						ruleType: 'ge',
						value:son.num
					}
					cond.data.push(obj)
				})
				if (cond.data.length === 1) {
					order = {
						col: cond.data[0].colName,
						type: 'desc'
					};
				}
				if(cond.data.length === 0){
					cond = null
				}
				
				this.getFoodsList(order, cond, 'filtrate');
			}
		},
		/* 顶部菜单点击**/
		chooseMenu(parent,child){			
			if(child.value === '饭馆饭菜'){
				uni.switchTab({
					url:'/pages/store/store'
				})
			}else{
			console.log(parent,child,'parent,childparent,child')					
			this.pageInfo.pageNo = 1
			if(parent.type === 'subclass'){
			}else if(child.value!='不限' && child.value != 'default'){
				child.current_num += 1
				if(child.current_num == 5){
					child.current_num  = 0
				}
			}else{
				child.choose = !child.choose
			}
			let menuData = this.menuAgList
			let order = ''
			if(parent.type==='food' || parent.type === 'subclass'){				
				child.choose = !child.choose
				menuData.forEach(par=>{
					if(par.type === parent.type){
						par.children.forEach(p=>{
							if(p.value !== child.value){
								p.choose = false
							}
							if(!child.choose){
								par.children[0].choose = true
								this.getFoodsList()
							}
						})
					}
				})				
			}
			if(child.value === '我的饭菜'){
				this.isShowMyList = true
				this.searchArg.serviceName = 'srvhealth_mixed_food_nutrition_contents_select'
				let cond = [{
						colName:'restaurant_no',
						ruleType:'isnull',
						value:''
					},{
						colName:'create_user',
						ruleType:'eq',
						value:uni.getStorageSync('current_user_info').userno
					}]
				this.condObj = cond
			}else if(child.value === '公共饭菜'){
				this.condObj = null
			}
			if(child.value === 'foods' || child.value === 'matter'){
				let foodsArr = []
				if(child.value === 'foods'){
					 foodsArr = [{
										title: '公共饭菜',
										value: '公共饭菜',
										choose:true
									},{
										title: '饭馆饭菜',
										value: '饭馆饭菜',
										choose:false
									},
									{
										title: '我的饭菜',
										value: '我的饭菜',
										choose:false
									}]
					this.searchArg.serviceName = 'srvhealth_mixed_food_nutrition_contents_select'
				}else if(child.value === 'matter'){
					foodsArr = [{
								title: '全部',
								value: '全部',
								choose:true
							},{
									title: '蔬菜',
									value: '蔬菜',
									choose:false
								},
								{
									title: '水果干果',
									value: '水果干果',
									choose:false
								},
								
								{
									title: '菌藻类',
									value: '菌藻类',
									choose:false
								},
								{
									title: '坚果',
									value: '坚果',
									choose:false
								},
								{
									title: '谷薯类',
									value: '谷薯类',
									choose:false
								},
								{
									title: '蛋奶类',
									value: '蛋奶类',
									choose:false
								},
								{
									title: '畜禽肉',
									value: '畜禽肉',
									choose:false
								},
								{
									title: '水产品',
									value: '水产品',
									choose:false
								},
								{
									title: '调味品',
									value: '调味品',
									choose:false
								},
								{
									title: '饮品',
									value: '饮品',
									choose:false
								},
								{
									title: '糕点类',
									value: '糕点类',
									choose:false
								},
								{
									title: '其他',
									value: '其他',
									choose:false
								}]				
					this.searchArg.serviceName = 'srvhealth_diet_contents_select'
				}
				this.menuAgList = this.menuAgList.map(c=>{
					if(c.type === 'subclass'){
						c.children = foodsArr
					}
					return c
				})
				this.condObj = null
				this.classifyCond = null	
				console.log("this.menuAgList-----",this.menuAgList)
				// this.onRefresh();
				
			}else if(parent.type == 'subclass' && this.menuAgList[0].children[0].choose) {
				this.searchArg.serviceName = 'srvhealth_diet_contents_select'
				if(child.value === '全部'){
					this.condObj = null
					this.classifyCond = null
					this.getFoodsList()
				}else{
					let cond = {
						colName:"classify",
						ruleType:"eq",
						value:child.value
					}
					this.condObj = cond
					this.classifyCond = cond
					this.menuAgList.forEach(m=>{
						this.copyData.forEach(n=>{
							if(m.classify_name != '分类' && m.classify_name === n.classify_name){
								m = n
							}
						})
					})
					this.getFoodsList(null,cond)
					console.log("点击素材")
				}
				
			}
			if(parent.type === 'capacity' || parent.type === 'vitamin' || parent.type === 'mineral' ||parent.type === 'mingle'){
				console.log(333,'par.type === parent.type')
				let isHas = false
				this.childChooseArr.forEach(hdel=>{
					if(hdel.title === child.title){
						isHas = true
					}
				})
				if(child.value != '不限' && !isHas){
					this.childChooseArr.push(child)
				}							
				let childChooseArr = this.childChooseArr
				// else if(child.current_num === 3){
				// 	child.current_num = 0
				// }
				if(childChooseArr.length === 1){
					if(child.current_num === 3){
						childChooseArr.forEach((del,index)=>{
							if(del.title === child.title){
								childChooseArr.splice(index,1)
									child.current_num = 0
									child.choose = false
							}
						})
					}
				}else{
					if(childChooseArr.length==2 && childChooseArr[1].current_num == 1 && child.value != childChooseArr[0].value){
						childChooseArr[0].current_num = 1 
					}
					if(child.current_num === 4){
						childChooseArr.forEach((del,index)=>{
							if(del.title === child.title){
								childChooseArr.splice(index,1)
								if(childChooseArr.length == 1){
									childChooseArr[0].current_num = 1
								}
							}
						})
					}
				}
				
				let hasChild = false
				menuData.forEach(par=>{
					if(par.type === parent.type){
						par.children.forEach(p=>{
							this.childChooseArr.forEach(chos=>{
								if(chos.title === p.title){
									hasChild = true
								}
							})
							if(child.value !== '不限' && child.value !== 'default' && child.value ===p.value&& child.current_num == 4){
								child.current_num = 0
								p.choose = false
								par.children[0].choose = true
							}else if(child.value !== '不限' && child.value !== 'default' && child.value ===p.value&& child.current_num != 0){
								p.choose = true
								par.children[0].choose = false
							}else if(child.value === '不限'|| child.value == 'default'){
								p.current_num = 0
								par.children.forEach(a=>{
									this.childChooseArr.forEach((b,i)=>{
										if(a.value != 'default' || a.value != '不限'){
											if(a.value === b.value){
												this.childChooseArr.splice(i,1)
											}
										}
									})
								})
								if((p.value === '不限'|| p.value == 'default') && child.value === p.value){
									p.choose = true
								}else {
									p.choose = false
								}
								
							}
							
						})
						if(!hasChild){
							par.children.forEach(bpar=>{
								if(bpar.value === '不限' || bpar.value ==='default'){
									bpar.choose = true
								}
							})
						}
					}
					// if(par.type == 'capacity'){
					// 	par.children.forEach(alone=>{
					// 		alone.choose = false
					// 		alone.current_num = 0
					// 		par.children[0].choose = true
					// 		this.childChooseArr.forEach((c,i)=>{
					// 			if(alone.value === c.value){
					// 				this.childChooseArr.splice(i,1)
					// 			}
					// 		})
					// 	})
						
					// }
				})
				
				let condOrder = {
					relation: 'AND',
					data: []
				};
				if(childChooseArr.length > 0 ){
					if(childChooseArr.length === 1){						
						if(child.current_num === 1){
							order = {
								 	col: child.value,
								 	type: 'asc'
							}
						}else if(child.current_num === 2){
							order = {
								 	col: child.value,
								 	type: 'desc'
							}
						}
					}else{
						childChooseArr.forEach(son=>{
							let min_num = (son.num * 0.3).toFixed(2)
							let max_num = (son.num * 0.6).toFixed(2)
							let obj = [{
								colName:son.value,
								ruleType: 'ge',
								value:max_num
							}]
							if(son.current_num == 2){
								obj[0].ruleType = 'lt'
								obj[1] = {
									colName:son.value,
									ruleType: 'gt',
									value:min_num
								}
							}else if(son.current_num == 3){
								obj = [{
									colName:son.value,
									ruleType: 'le',
									value:min_num
								}]
							}
							// cond.data.push(obj)
							condOrder.data = [...condOrder.data,...obj]
						})
					}
					
					
				}
				
				if (condOrder.data.length === 1) {
					order = {
						col: condOrder.data[0].colName,
						type: 'desc'
					};
				}
				if(childChooseArr.length === 1){
					let order_type = 'asc'
					if(childChooseArr[0].current_num == 1){
						order_type = 'desc'
					}
					order = {
						col: childChooseArr[0].value,
						type: order_type
					};
				}
				if(condOrder.data.length === 0){
					condOrder = null
				}
				console.log("-----order-----",condOrder)
				this.childChooseArr = childChooseArr
				this.order = order
				this.condObj =this.classifyCond?this.classifyCond:condOrder
				console.log('childChooseArr-----',order)
				// this.getFoodsList(this.order?this.order:order, this.condObj, 'filtrate');
			}
			}
			// this.onRefresh();
			console.log("parent:",parent,"child",child)
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
		},
		change(index) {
			// this.current = index;
			this.radioIndex = index
			console.log("点击单位",index)
			this.list.forEach((item,i)=>{
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
		/* 选择单位**/
		changeUnit(item,index){
			// this.modalName = 'RadioModal'
			this.currIndex = i
			this.radioLabel = item;
			if (Number(this.choiceNum) && !this.radioLabel) {
				this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
			} else if (Number(this.choiceNum) && this.radioLabel) {
				if (this.radioLabel.unit_amount) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				} else {
					this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount / 100) * this.currFood.unit_energy);
				}
			}
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
				this.list = unitList
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
						'/pages/specific/health/foodDetail/foodDetail?foods=' + encodeURIComponent(JSON.stringify(itemFood)) + '&filters=' + encodeURIComponent(JSON.stringify(this.filterArr))
				});
			} else if (this.searchArg.type === 'sport') {
				uni.navigateTo({
					url: '/pages/specific/health/sportsDetail/sportsDetail?sport=' + encodeURIComponent(JSON.stringify(itemFood))
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
					let urls = self.$api.downloadFile + this.chooseFoodArr[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') +"&thumbnailType=fwsu_100";
					this.$set(this.chooseFoodArr[i], 'imgurl', urls);
				}
			}else{
				this.chooseFoodArr = []
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
			this.isLoad = true
			if (res.data.state === 'SUCCESS' && res.data.data.length >= 0) {
				this.chooseFoodArr = res.data.data;
				for (let i = 0; i < this.chooseFoodArr.length; i++) {
					let urls = self.$api.downloadFile + this.chooseFoodArr[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')+"&thumbnailType=fwsu_100";
					this.$set(this.chooseFoodArr[i], 'imgurl', urls);
				}
			}else{
				this.chooseFoodArr = []
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
				this.isSeekValue = true
				this.pageInfo.pageNo = 1
				this.getFoodsList(null,this.classifyCond);
			}
		},
		/*触发搜索框**/
		async getSearchValue(value) {
			let self = this;
			let url = this.getServiceUrl('health', this.searchArg.serviceName, 'select');
			let req = { serviceName: this.searchArg.serviceName, colNames: ['*'], condition: [{ colName: this.searchArg.colName, ruleType: 'like', value: value }] };
			let res = await this.$http.post(url, req);
			let resData = res.data.data;
			if(resData.length === 0){
				this.isSeekValue = false
			}else{
				let isHas = false
				resData.forEach(seek=>{
					if(seek.name === value){
						isHas=true
					}
				})
				if(!isHas){
					this.isSeekValue = false
				}
			}
			this.foodList = resData;
			for (let i = 0; i < resData.length; i++) {
				if (resData[i][self.searchArg.imgCol]) {
					let fileDatas = await self.getFilePath(resData[i][self.searchArg.imgCol]);
					url = self.$api.getFilePath + fileDatas[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')+"&thumbnailType=fwsu_100";
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
						hdate: this.selectDate ? this.selectDate : this.nowDate,
						htime: this.currTime ? this.currTime : this.nowDateTime,
						name: item.name,
						amount: item.amount,
						unit: item.unit,
						energy: item.heatNum,
						user_name: uni.getStorageSync('current_user'),
						image: item.image,
					};
					if (this.searchArg.type === 'food') {
						if(item.classify && item.classify === 'mixed_food'){
							obj['mixed_food_no'] = item.meal_no
							obj['diret_type'] = item.classify
							obj['unit_weight_g'] = this.radioLabel?this.radioLabel.amount:100
						}else {
							obj['diet_contents_no'] = item.food_no
							obj['diret_type'] = 'diet_contents'
						}
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

		async getFoodsList(order = null, cond = null, type = null,serviceName=null) {
			
			let self = this;
			let url = this.getServiceUrl('health', serviceName?serviceName:this.searchArg.serviceName, 'select');
			let req = {
				serviceName: serviceName?serviceName:this.searchArg.serviceName,
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
			if (Array.isArray(this.condObj)) {
				req = {
					serviceName: 'srvhealth_mixed_food_nutrition_contents_select',
					colNames: ['*'],
					condition:[{
						colName:'restaurant_no',
						ruleType:'isnull',
						value:''
					},{
						colName:'create_user',
						ruleType:'eq',
						value:uni.getStorageSync('current_user_info').userno
					}]
				}
				// req.relation_condition.data = this.condObj
			}else if(cond){				
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
						url = self.$api.downloadFile + data[i].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')+"&thumbnailType=fwsu_100";
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
			this.dotEndStr = '';
			this.choiceNum = 0;
			this.heatNum = 0;
			this.value1 = 0
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
			this.currFood.hdate = this.selectDate
			if(this.pageType === 'food'){
				let food = encodeURIComponent(JSON.stringify(this.currFood))
				if(!this.isShowMyList){
					uni.navigateTo({
						url:'/otherPages/chooseFood/chooseFood?currFood=' + food
					})
				}else{
					uni.navigateTo({
						url:'/otherPages/chooseFood/chooseFood?currFood=' + food + '&type=owner'
					})
				}
				
			}
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
		result(val) {
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
.filtrate-wrap{
	.filtrate-choose{
		display: flex;
		align-items: center;
		padding-left: 20upx;
		.filtrate-choose-item{
			padding: 10upx;
		}
	}
	.filtrate-item-wrap{
		background-color: white;
		.filtrate-item{
			display: flex;
			.filtrate-item-left{
				padding: 10upx 20upx;
			}
			.filtrate-item-left:first{
				padding:0 20upx 10upx 20upx;
			}
			.filtrate-item-right{
				// padding: 10upx 20upx;
				display: flex;
				margin: 0 10upx;
				align-items: center;
			}
			.cate-active{
				color: red;
				/deep/ .u-icon{
					display: flex;
					// padding-bottom: 8upx;
					padding-left: 2upx;
				}
			}
		}
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
	display: flex;
	flex-wrap: wrap;
	overflow-y: scroll;
	// height: calc(100vh - 300upx) !important;
}
.seek-wrap{
	width: 95%;
	text-align: center;
	padding: 40rpx;
	background-color: white;
	margin: 30rpx auto;
	border-radius: 16rpx;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
	font-size: 32rpx;
	.seek-back{
		color: #0081ff;
		font-weight: 700;
	}
}
.boxfood {
	border-top: 1upx solid #e8e8e8;
	// padding: 25upx 0;
	background: #ffffff;
	width: 23%;
	// flex:1;
	margin: 20upx 10upx 0 0;
	height: 100%!important;
	display: flex;
	align-items: center;
	position: relative;
	flex-wrap: wrap;
	padding-right: 0!important;
	border-radius: 20upx;
	&:nth-child(4n + 1){
		margin-left: 14upx;
	}
	.boxfood-item {
		width: 100%;
		justify-content: space-between;
		display: flex;
	}
	// .relian {
	// 	// position: absolute;
	// 	// right: 40px;
	// 	// top: 0;
	// 	// bottom: 0;
	// 	display: flex;
	// 	margin-right: 20upx;
	// 	align-items: center;
	// 	font-size: 12px;
	// 	.status {
	// 		display: block;
	// 		height: 20upx;
	// 		width: 20upx;
	// 		border-radius: 50%;
	// 		margin-right: 10upx;
	// 	}
	// }
	.smallbox {
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		.smallbox-couple-top{
			width: 100%;
			min-height: 100rpx;			
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px dashed #ccc;
		}
		.smallbox-couple-bot{
			font-weight: 700;
			width: 100%;
			text-align: center;
			padding: 10rpx 0;
			text{
				&:last-child{
					color: #0081FF;
				}
			}
		}
		.smallbox-img{
			width: 100%;
			height: 100upx;
			image {
				width: 100%;
				height: 100upx;
				border-radius: 8upx;
			}
			/deep/ .u-image__image{
				div{
					background-size:100% 100%!important;
				}
			}
		}
		
		.textbox {
			width: 100%;
			padding: 10upx 4upx;
			.title-food {
				font-weight: bold;
				font-size: 30upx;
				display: flex;
				justify-content: center;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				text-align: center;
				
			}
			.lock-ele {
				margin-left: 5px;
				.second-lock {
					color: #dc2a26;
				}
			}
			.food-utis {
				margin-top: 6upx;
				font-size: 24upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				.utis {
					color: #807d7d;
				}
				.number {
					color: #dc2a26;
				}
			}
		}
	}
	.couple-smallbox{
		border: 1px dashed #fff;
		
	}
}
.couple-boxfood{
	border-radius: 0;
	border-bottom-left-radius: 20rpx;
	border-bottom-right-radius: 20rpx;
}
.bottom-modal {
	.cu-dialog {
		height: 100vh;
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
			justify-content: flex-start;
			// flex-wrap: wrap;
			padding: 20upx 20upx;
			min-height: 100upx;
			align-items: center;
			font-size: 36upx;
			margin-right: 20upx;
			color: #999;
			.calorie{
				min-width: 115upx;
			}
			.calculate-l{
				width: 100rpx;
				font-size: 28upx;
			}
			.amount {
				color: #009688;
				font-weight: 800;
				// max-width: 200rpx;
				
				// margin-left: 4rem;
				.number {
					padding: 0 20upx;
					font-size: 34upx;
					// border-bottom: 5upx solid #009688;
				}
				.unit {
					text-align: center;
					padding: 10upx 0upx;
					
				}
			}
			.weight {
				display: flex;
				align-items: center;
				font-size: 28upx;
				flex-wrap: wrap;
				white-space:nowrap;
				overflow-x: scroll;
				// justify-content: flex-end;
				// flex-wrap: wrap;
				// min-width: 220upx;
				.unit{
					margin-right: 10upx;
					background-color: #f8f8f8;
					color: #999;
					border-radius: 40upx;
					border: 1px solid #999;
					padding: 0px 16upx;
					min-height:54upx ;
					display: flex;
					align-items: center;
					margin-bottom: 10upx;
			
				}
				.active-unit{
					border: 1px solid #f37b1d;
					background-color: #f37b1d;
					color: #fff;
					// color: red;
					// font-size: 32upx;
				}
				image {
					width: 40upx;
					height: 40upx;
					margin-left: 20upx;
				}
			}
		}
		.amount {
			color: #009688;
			font-weight: 800;
			.number {
				padding: 0 20upx;
				font-size: 34upx;
			}
			.unit {
				text-align: center;
				padding: 10upx 0upx;
			}
		}
	}
	.sport-dialog{
		height: 710upx;
	}
}
.input-box {
	display: flex;
	// flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	/deep/ input {
		width: 65upx !important;
		text-align: center;
	}
	.key-left {
		text {
			padding: 12upx 12upx;
			background-color: #d6e2eb;
			font-size: 30upx;
			min-width: 100upx;
			text-align: center;
			display: inline-block;
			margin-right: 20upx;	
			border-radius: 5px;
		}
	}
	.key-right {
		text {
			padding: 12upx 12upx;
			background-color: #d6e2eb;
			font-size: 30upx;
			min-width: 100upx;
			text-align: center;
			display: inline-block;
			margin-left: 20upx;		
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
.public-button-box{
	position: relative;
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
	.add-button-wrap{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		color: white;
			.add-button-num {
				display: flex;
				justify-content: center;
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
			.boxfood_car{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 5px;
				margin-bottom: 0;
				background-color: white;
				.smallbox_car{
					display: flex;
					align-items: center;
					image{
						width: 100upx;
						height: 100upx;
						margin: 10upx;
					}
				}
				.relian{
					margin-right: 10px;
				}
			}
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
.change-tab{
	width: 100px;
	margin: 0 0 0 auto;
	margin-top: -20px;
}
.change-tab /deep/ .u-tab-item{
	padding: 0 10rpx;
}
</style>
