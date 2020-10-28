<template>
	<view class="pregnant_wrap">
		<view class="pregnant-top">
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in titleData" :key="index" @tap="tabSelect(item,$event)" :data-id="index">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			<view class="pregnant-time">
				<view class="pregnant-time-left">
					<text>预产时间：</text>
					<text>请选择预产期</text>
				</view>
				<view @click="openCale" class="pregnant-time-right">
					<u-icon size="50" name="calendar"></u-icon>
				</view>
			</view>
		</view>
		<view v-if="current_tit === 'pregnancy'" class="pregnant-main-fetation">
			<u-collapse :head-style="headStyle">
				<u-collapse-item v-for="(item,index) in timeLienData" :key="index" :open="item.open" :title="item.name">
					<view class="cu-timeline pregnant-timeline">					
						<view v-for="(week,i) in item.child" class="cu-item">
							<view @click="toDetail(week)" class="content bg-cyan">
								<text>{{week.title}}</text>
							</view>
							<view class="pre-chunk-wrap">
								<view @click="openCont(con)" v-for="(con,k) in week.content" :class="con.isOk?'pass-pre-chunk':''" class="pre-chunk">
									{{con.name}}
								</view>
							</view>
							
						</view>						
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view v-else-if="current_tit === 'prepare'" class="pregnant-main-pregnancy">
			<text>备孕</text>
		</view>
		<view v-else-if="current_tit === 'postpartum'" class="pregnant-main-delivery">
			<text>产后</text>
		</view>
		
			<u-popup v-model="show" mode="center" width="85%">
				<view class="pre-model-wrap">
					<view class="pre-top">
						<text>确认下列注意事项是否进行?</text>
					</view>
					<view class="pre-content">
						<view v-for="(curr,i) in current_pre.child" class="pre-content-item">
							<view class="pre-content-top">
								<view class="pre-left">
									<image :src="curr.image" mode=""></image>
								</view>
								<view class="pre-right">
									<text>{{curr.tit}}</text>
									<view @click="selectDetail(curr)" class="details">
										<text>查看详情</text>
										<text v-if="!curr.isOpen" class="lg text-gray cuIcon-rounddown"><span></span></text>
										<image v-else src="/otherPages/static/img/pretop.png" mode=""></image>
									</view>
								</view>
							</view>
							<view :class="curr.isOpen?'detail-show':''" class="pre-content-bot">
								<text></text>
								<text>{{curr.content}}</text>
							</view>
						</view>						
					</view>
					<view class="pre-bot">
						<view @click="botBtn('true')" class="pre-bot-left">
							是
						</view>
						<view @click="botBtn('false')" class="pre-bot-left">
							否
						</view>
					</view>
				</view>
			</u-popup>	
			<!-- <u-popup v-model="showTimeSignPicker" mode="center" width="85%">
				<bx-date-stamp v-show="showTimeSignPicker" ref="ren" :headerBar="true" :disabledAfter='true' :isMarkDays="false" @onDayClick="onDayClick"></bx-date-stamp>
			</u-popup> -->
			<!-- <view @click.self="closeDay" class="cu-modal" style="display: flex; align-items: center" :class="modalName == 'Modal' ? 'show' : ''">
				<view class="cu-dialog">
					<bx-date-stamp v-show="showTimeSignPicker" ref="ren" :markDays="markDays" :headerBar="true" @onDayClick="onDayClick"></bx-date-stamp>
				</view>
			</view> -->
	</view>
</template>

<script>
	import bxDateStamp from '@/components/bx-date-stamp/bx-date-stamp.vue';
	export default {
		name:"pregnant",
		components:{bxDateStamp},
		data(){
			return {
				headStyle:{
					paddingLeft:'18px'
				},
				current_pre:"",
				
				markDays:[],
				showTimeSignPicker:false,
				modalName:'',
				selectDate:'',
				TabCur: 1,
				scrollLeft: 0,
				titleData:[{
					name:'备孕',
					type:'prepare'
				},{
					name:'已怀孕',
					type:'pregnancy'
				},{
					name:'产后',
					type:'postpartum'
				}],
				show:false,
				timeLienData:
				 [
					 {
					 name:'早期',
					 open:true,
					 child:[
						{
						 title:"第一周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'避孕药',
									 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
									 isOpen:false,
									 image:"/otherPages/static/img/byy.jpg"
								 },
								 {
									 tit:'白酒',
									 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
									 isOpen:false,
									 image:"/otherPages/static/img/bj.jpg"
								 },
								 {
									 tit:'薏米',
									 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
									 isOpen:false,
									 image:"/otherPages/static/img/ym.jpg"
								 },
								 {
									 tit:'五香粉',
									 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
									 isOpen:false,
									 image:"/otherPages/static/img/wxf.jpg"
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 {
						 title:"第二周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'啤酒',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'可乐',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'冰淇淋',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'咖啡',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 ]
				 },
				 {
					 name:'中期',
					 open:false,
					 child:[
						{
						 title:"第三周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'啤酒',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'可乐',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'冰淇淋',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'咖啡',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 {
						 title:"第四周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'啤酒',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'可乐',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'冰淇淋',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'咖啡',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 ]
				 },
				 {
					 name:'晚期',
					 open:false,
					 child:[
						{
						 title:"第五周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'啤酒',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'可乐',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'冰淇淋',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'咖啡',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 {
						 title:"第六周",
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'啤酒',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'可乐',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'冰淇淋',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'咖啡',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'坐飞机',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看电影',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								}
							 ]
						 },{
							 name:'运动',
							 isOk:false,
							 child:[
								 {
									 tit:"滑雪",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 ]
				 },
				 ],	
				current_tit:'pregnancy'
			}
		},
		methods:{
			/*点击日期某一天**/
			onDayClick(data){
				this.showTimeSignPicker = false;
				this.selectDate = data.date;
				this.modalName = '';
			},
			/*关闭日期选择器**/
			closeDay(e) {
				this.modalName = '';
				this.showTimeSignPicker = false;
			},
			/*点击打开日期选择器*/
			openCale(){
				this.modalName = 'Modal';
				this.showTimeSignPicker = true
			},
			/*tab选择*/
			tabSelect(item,e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.current_tit = item.type
			},
			/*点击每周进入详情页面**/
			toDetail(){
				uni.navigateTo({
					url:'/otherPages/pregnant/pregnantDetail'
				})
			},
			/*点击小方块弹出模态框**/
			openCont(item){
				// item.open = true
				this.show = true
				this.current_pre = item
				console.log("点击当前")
			},
			/* 点击注意事项中的查看详情**/
			selectDetail(item){
				item.isOpen = !item.isOpen
				// this.current_pre.open = !this.current_pre.open
			},
			botBtn(type){
				if(type === 'true'){
					this.current_pre.isOk = false
					console.log("点击是")
				}else if(type === 'false'){
					this.current_pre.isOk = true
					console.log("点击否")
				}
				this.show = false
			}
		},
		onLoad() {
			console.log("---------------------")
		}
	}
</script>

<style scoped lang="scss">
	.pregnant_wrap{
		min-height: 100vh;
		background-color: white;
		.pregnant-top{
			.pregnant-time{
				margin: 20upx 0;
				display: flex;
				justify-content: space-between;
				.pregnant-time-left{
					margin-left: 25upx;
					font-size: 32upx;
					text{
						&:last-child{
							color: red;
						}
					}
				}
				.pregnant-time-right{
					margin-right: 25upx;
				}
			}
		}
		.pregnant-timeline{
			.cu-time{
				font-weight: 700;
				color: #000000;
				font-size: 14px;
			}
			.cu-item{				
				.content{
					font-size: 30upx;
					font-weight: 700;
					.cont-tit{
						display: flex;
						.tit-stature{
							margin-right: 10upx;
						}
					}
				}
				.pre-chunk-wrap{
					display: flex;
					margin-top: 20upx;
					flex-wrap: wrap;
					.pre-chunk{
						width: 120upx;
						height: 120upx;
						display: flex;
						align-items: center;
						justify-content: center;
						background-color: #e54d42;
						box-shadow: 4px 3px 4px rgba(229, 77, 66, 0.2);
						color: white;
						border-radius: 5px;
						margin-right: 20upx;
						margin-bottom: 20upx;
					}
					.pass-pre-chunk{
						background-color: #39b54a;
						box-shadow: 4px 3px 4px rgba(57, 181, 74, 0.2);
					}
				}				
			}
			
			
		}
	}
	.pre-model-wrap{
		.pre-top{
			text-align: center;
			font-size: 16px;
			font-weight: 600;
			padding: 10px
		}
		.pre-content{
			display: flex;
			flex-direction: column;
			.pre-content-item{
				.pre-content-top{
					display: flex;
					padding: 20upx;
					.pre-left{
						margin-right: 20upx;
						image{
							width: 100upx;
							height: 100upx;
						}
					}
					.pre-right{
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						text{
							&:first-child{
								font-weight: 700;
							}
						}
						.details{
							display: flex;
							align-items: center;
							image{
								width: 30upx;
								height: 30upx;
							}
							text{
								&:first-child{
									margin-right: 8upx;
									
								}
								&:last-child{
									font-size: 30upx;
									margin-top: 6upx;
								}
							}
						}
					}
				}
				.pre-content-bot{
					padding: 0 20upx;
					display: none;
					text{
						&:first-child{
							width: 20upx;
							height: 40upx;
							background: chartreuse;
							border-radius: 4upx;
							margin-right: 10upx;
						}
					}
				}
				.detail-show{
					display: flex;
				}
			}
		}
		.pre-bot{
			display: flex;
			justify-content: space-around;
			border-top: 1px solid #f6f7f9;
			.pre-bot-left{
				text-align: center;
				padding: 10px;
				&:first-of-type{
					color: #4e90ff;
				}
			}
		}
	}
	// .pregnant_wrap{
	// 	height: 100vh;
	// 	.pregnant-timeline{
	// 		height: 100%;
	// 	}
	// }
</style>
