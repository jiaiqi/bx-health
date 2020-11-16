<template>
	<view class="pregnant_wrap">
		<view class="pregnant-top">
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view  class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in titleData" :key="index" @tap="tabSelect(item,$event)" :data-id="index">
						{{item.name}}
					</view>
				</view> 
			</scroll-view>
			<view class="pregnant-time">
				<view class="pregnant-time-left">
					<text>预产时间：</text>
					<text>{{selectDate?selectDate:'请选择末次经期时间'}}</text>   
					<!-- 怀孕280天，计算预产期从末次月经时间 + 280天 -->
				</view>
				<view @click="openCale" class="pregnant-time-right">
					<u-icon size="50" name="calendar"></u-icon>
				</view>
			</view>
		</view>
		
		<view v-if="current_tit === 'pregnancy'" class="pregnant-main-fetation">
			<view class="pregnant-main-top">
				<view class="pregnant-main-top-item">
						<view class="pregnant-main-top-item-w">
							<scroll-view :scroll-with-animation="true" style="height: 60upx;" scroll-x :scroll-left="scrollMenuLeft">
								<text @click="chooseClasify(item,index)" :class="currClasifyIndex===index?'active-clasify':''" v-for="(item,index) in classifyData" :key="index">{{item.name}}</text>						
							</scroll-view>
						</view>
						<view class="pregnant-main-top-item-r">
							<u-icon :top="4" v-if="!menuIsShow" size="48" @click="showMore('open')" name="list"></u-icon>
							<u-icon :top="4" v-else size="48" @click="showMore('close')" name="close"></u-icon>
						</view>
					
				</view>
				
				<!-- <view v-if="menuIsShow" class="pregnant-main-top-item-add">
					<text @click="chooseClasify(item,index)" v-if="index >= 6" :class="currClasifyIndex===index?'active-clasify':''" v-for="(item,index) in classifyData" :key="index">{{item.name}}</text>
				</view> -->
			</view>
			<!-- 预期首页===胎儿 -->
			<view v-if="currentClasifyType === 'fetus' " class="fetus-wrap">
				<view class="cu-timeline">
					<view class="cu-time">胎儿</view>
					<view v-for="(item,index) in fetusTimeLienData" :key="index" :class="item.isCurrent?'text-green':''" class="cu-item cur">
						<view class="content shadow-blur" :class="item.isCurrent?'bg-green':'bg-orange'">
							<!-- <view class="content-item-top"> -->
								<!-- <text v-if="week.start_time && week.end_time">{{week.start_time}} ~ {{week.end_time}}</text> -->
							<!-- </view> -->
							<view class="content-item-top">
								<text>{{item.name}}</text>
								<text v-if="item.start_time && item.end_time">{{item.start_time}} ~ {{item.end_time}}</text>
							</view>
							<view @click="shrink(item,'fetus')" class="content-item-bot">
								<text v-if="!item.isOpen">展开</text>
								<text v-else>收起</text>
							</view>
							
						</view>
						<view v-show="item.isOpen" class="fetus-top">
							<view class="fetus-top-tit">
								<text>胎儿发育</text>
							</view>
							<view class="fetus-top-main">
								<view class="fetus-top-main-left">
									<image src="/pregnancy/static/img/1.png" mode=""></image>
								</view>
								<view class="fetus-top-main-right">
									<view class="fetus-top-main-right-t">
										<text>孕{{item.num}}周</text>
									</view>
									<view class="fetus-top-main-right-b">
										<view class="fetus-top-main-right-b-l">
											<text>体重：</text>
											<text>{{item.weight}}克</text>
										</view>
										<view class="fetus-top-main-right-b-l">
											<text>身长：</text>
											<text>{{item.height}}厘米</text>
										</view>
									</view>
								</view>
							</view>
							<view class="fetus-top-bot">
								<view class="fetus-top-bot-t">
									<text>概览</text>
								</view>
								<view class="fetus-top-bot-b">
									<view class="fetus-top-bot-b-t">
										<text>宝宝变化</text>
										<text>孕1周时，精子和卵子尚未结合，胎宝宝还未形成，此时卵子正乖乖呆在准妈妈的体内</text>
									</view>
									<view class="fetus-top-bot-b-b">
										<text>关爱提醒</text>
										<text>有的妈妈有少量出血，别怕，这可能是受精卵着床成功的信号；如果量多，建议去医院检查</text>
									</view>
								</view>
							</view>
						</view>
					</view> 					
				</view>
			</view>
			<!-- 孕期首页===> 饮食 -->
			<view v-if="currentClasifyType === 'diet' " class="diet-wrap">
				<view class="diet-item-wrap">
					<view class="cu-timeline">
						<view class="cu-time">饮食</view>
						<view v-for="(item,index) in dietTimeLineData" :key="index" class="cu-item cur">
							<view class="content bg-green shadow-blur">
								<view class="content-item-top">
									<text>{{item.name}}</text>
								</view>								
							</view>
							<view class="diet-main">
								<view class="diet-main-top">
									<text class="diet-main-top-text" >推荐饮食</text>
									<view class="diet-main-item-wrap">
										<view @click="toFoodsDetail('recommend')" v-for="(rec,i) in item.recommend" :key="i" class="diet-main-item">
											<view class="diet-main-item-t">
												<text>宜</text>
												<!-- <text>忌</text> -->
											</view>
											<view  class="diet-main-item-b">
												{{rec.name}}
											</view>
										</view>
									</view>									
								</view>
								<view class="diet-main-top">
									<text class="diet-main-top-text">忌讳饮食</text>
									<view class="diet-main-item-wrap">
										<view @click="toFoodsDetail('taboo')" v-for="(dietab,o) in item.taboo" :key="o" class="diet-main-item taboo-item">
											<view class="diet-main-item-t">
												<text>忌</text>
												<!-- <text>忌</text> -->
											</view>
											<view  class="diet-main-item-b">
												{{dietab.name}}
											</view>
										</view>
									</view>									
								</view>
							</view>
						</view>
					</view>
					<!-- <view @click="toFoodsList(item)" v-for="(item,index) in foodsClassify" :key="index" class="diet-item">
						<view class="diet-item-left">
							<view class="diet-item-left-top">
								<text>{{item.name}}</text>
							</view>
						</view>
						<view class="diet-item-rig">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>	 -->				
				</view>
			</view>
			
			<!-- 孕期首页===> 运动 -->
			<view v-if="currentClasifyType === 'sports'" class="sports-wrap diet-wrap">
				<view class="diet-item-wrap">
					<view class="cu-timeline">
						<view class="cu-time">运动</view>
						<view v-for="(item,index) in sportsTimeLineData" :key="index" class="cu-item cur">
							<view class="content bg-green shadow-blur">
								<view class="content-item-top">
									<text>{{item.name}}</text>
								</view>								
							</view>
							<view class="diet-main">
								<view class="diet-main-top">
									<text class="diet-main-top-text" >推荐运动</text>
									<view class="diet-main-item-wrap">
										<view v-for="(rec,i) in item.recommend" :key="i" class="diet-main-item">
											<view class="diet-main-item-t">
												<text>宜</text>
												<!-- <text>忌</text> -->
											</view>
											<view  class="diet-main-item-b">
												{{rec.name}}
											</view>
										</view>
									</view>									
								</view>
								<view class="diet-main-top">
									<text class="diet-main-top-text">忌讳运动</text>
									<view class="diet-main-item-wrap">
										<view v-for="(dietab,o) in item.taboo" :key="o" class="diet-main-item taboo-item">
											<view class="diet-main-item-t">
												<text>忌</text>
												<!-- <text>忌</text> -->
											</view>
											<view  class="diet-main-item-b">
												{{dietab.name}}
											</view>
										</view>
									</view>									
								</view>
							</view>
						</view>
					</view>			
				</view>
			</view>
			<!-- 孕期首页===> 待办/已办 -->
			<view v-if="currentClasifyType === 'matter'" class="matter-wrap">
				<view class="cu-timeline">
					<view class="cu-time">待办/已办</view>
					<view v-for="(item,index) in inspectTimeLienData" :key="index" class="cu-item cur" :class="item.isCurrent?'text-green':''">
						<view class="content shadow-blur" :class="item.isCurrent?'bg-green':'bg-blue'">
							<view class="matter-content-top">
								<text>{{item.name}}</text>
								<text v-if="item.start_time && item.end_time">{{item.start_time}} ~ {{item.end_time}}</text>
							</view>
							<view @click="shrink(item,'fetus')" class="matter-content-bot">
								<text v-if="!item.isOpen">展开</text>
								<text v-else>收缩</text>
							</view>
						</view>
						<view v-show="item.isOpen">
							<view class="pre-chunk-top pre-chunk-bot matter-wrap-main">
								<view class="pre-chunk-top-notice">
									<text>待办事项</text>
								</view>
								<view class="pre-chunk-top-backlog-cont">										
									<view v-for="(sing,i) in item.backlog" :key="index" @click="toPreDetail('no')" class="pre-chunk-top-backlog-cont-item">
										<view class="pre-chunk-top-backlog-cont-item-l">
											<text>{{i+1}}.{{sing.name}}</text>
											<text>{{sing.content}}</text>
										</view>
										<view class="pre-chunk-top-backlog-cont-item-r">
											<text>查看详情</text>
										</view>
									</view>
								</view>
							</view>
							<view class="pre-chunk-top pre-chunk-bot matter-wrap-main">
								<view class="pre-chunk-top-notice">
									<text>已办事项</text>
								</view>
								<view class="pre-chunk-top-backlog-cont">										
									<view v-for="(fin,ids) in item.finished" :key="ids" @click="toPreDetail('ok')" class="pre-chunk-top-backlog-cont-item">
										<view class="pre-chunk-top-backlog-cont-item-l">
											<text>{{ids+1}}.{{fin.name}}</text>
											<text>{{fin.content}}</text>
										</view>
										<view class="pre-chunk-top-backlog-cont-item-r">
											<text>查看详情</text>
										</view>
									</view>
								</view>
							</view>
						</view>						
					</view>
				</view>
			</view>
			
			<!-- 孕期首页===> 症状 -->
			
			<view v-if="currentClasifyType === 'symptom'" class="symptom_wrap">
				<view class="cu-timeline">
					<view class="cu-time">症状</view>
					<view v-for="(item,index) in symptomTimeLienData" :key="index" class="cu-item cur">
						<view  class="content bg-mauve shadow-blur" :class="item.isCurrent?'symptom-current':''">
							<view class="symptom-content-top">
								<text>{{item.name}}</text>
								<text v-if="item.start_time && item.end_time">{{item.start_time}} ~ {{item.end_time}}</text>
							</view>
							<view @click="shrink(item,'symptom')" class="symptom-content-bot">
								<text v-if="!item.isOpen">展开</text>
								<text v-else>收缩</text>
							</view>
						</view>
						<view v-show="item.isOpen" class="symptom_main">
							<view class="symptom_main_top">
								<text>可能出现得症状</text>
							</view>
							<view class="symptom_main_bot">
								<view @click="toSymDetail(sym)" v-for="(sym,n) in item.symptom" class="symptom_main_item">
									<view class="symptom_main_item_top">
										<text>{{n+1}}.</text>
										<text>{{sym.name}}</text>
									</view>
									<view class="symptom_main_item_bot">
										<text>查看详情</text>
									</view>
								</view>
							</view>							
						</view>
					</view>					
				</view>
			</view>
			
			<!-- 孕期首页===> 检查 -->
			<view v-if="currentClasifyType === 'inspect'" class="inspect_wrap">
				<view class="cu-timeline">
					<view class="cu-time">检查</view>
					<view v-for="(item,index) in matterTimeLineData" :key="index" class="cu-item cur" :class="item.isCurrent?'text-green':''">
						<view class="content shadow-blur" :class="item.isCurrent?'inspect-bg':'bg-yellow'">
							<view class="inspect_wrap_top_left">
								<view class="inspect_wrap_top_left_t">
									<text v-if="item.start_time && item.end_time">{{item.start_time}} ~ {{item.end_time}}</text>
								</view>
								<view class="inspect_wrap_top_left_c">
									<view class="inspect_wrap_top_left_c_l">
										<text>产检重点：</text>
									</view>
									<view class="inspect_wrap_top_left_c_r">
										<text v-for="(sing,i) in item.point">{{sing.name}}</text>
									</view>									
								</view>
								<view class="inspect_wrap_top_left_b">
									<text>孕{{item.num}}周</text>
								</view>
							</view>
							<view class="inspect_wrap_top_rig">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
					</view>					
				</view>				
			</view>
			
			<!-- 孕期首页===> 孕期 -->
			<u-collapse v-if="currentClasifyType === 'gestation'" ref='collapse' :head-style="headStyle">
				<u-collapse-item v-for="(item,index) in timeLienData" :key="index" :open="item.open" :title="item.name">
					<view class="cu-timeline pregnant-timeline">					
						<view v-for="(week,i) in item.child" class="cu-item " :class="week.isCurrent?'text-green':''">
							<view  class="content " :class="week.isCurrent?'bg-green shadow-blur':'bg-cyan'">
								<view class="content-item-top">
									<text>{{week.title}}</text>
									<text v-if="week.start_time && week.end_time">{{week.start_time}} ~ {{week.end_time}}</text>
								</view>	
								<view  class="content-item-cen">
									<view @click="toDetail(week)" class="content-item-cen-l">
										详情
									</view>
									<view @click.stop="shrink(week,'pregnant')" class="content-item-cen-r">
										<text v-if="!week.isOpen">展开</text>
										<text v-else>收起</text>
									</view>
								</view>																							
							</view>
							
							<view v-if="week.isOpen" class="pre-chunk-wrap">
								<view class="pre-chunk-top">
									<view v-for="(con,k) in week.content" :key="k" class="pre-chunk-top-item">
										<view class="pre-chunk-top-notice">
											<text>{{con.name}}</text>
										</view>
										<view class="pre-chunk-item-wrap">
											<!-- <view   :class="con.isOk?'pass-pre-chunk':''" class="pre-chunk">
												{{con.name}}																			
											</view> -->
											<view @click="toFoodsDetail(pre.type)" v-for="(pre,p) in con.child" :class="pre.type === 'recom'?'pass-pre-chunk':''" class="pre-chunk">
												<view class="pre-chunk-top">
													<text v-if="pre.type === 'recom'">宜</text>
													<text v-else>忌</text>
												</view>
												<view class="pre-chunk-item-bot">
													{{pre.tit}}
												</view>
											</view>
										</view>
									</view>
									
									
									
									<!-- <view class="pre-chunk-top-notice-cont">										
											<u-collapse :head-style="headMatterStyle" :item-style="itemStyle">
												<u-collapse-item @change="collapseClick"  :title="matter.name" v-for="(matter, m) in week.content" :key="m" :open="matter.isOk" :disabled="item.disabled">
													<view v-for="(matterItem,n) in matter.child" class="pre-chunk-top-notice-cont-item">
														<view class="pre-chunk-top-notice-cont-item-l">
															<text>{{n+1}}.</text>
														</view>
														<view class="pre-chunk-top-notice-cont-item-r">
															<text>{{matterItem.tit}}.</text>
															<text>{{matterItem.content}}</text>
														</view>
														
													</view>
												</u-collapse-item>
											</u-collapse>
									</view> -->
								</view>
								
								<view class="pre-chunk-top pre-chunk-bot">
									<view class="pre-chunk-top-notice">
										<text>待办事项</text>
									</view>
									<view class="pre-chunk-top-backlog-cont">										
										<view @click="toPreDetail('no')" class="pre-chunk-top-backlog-cont-item">
											<view class="pre-chunk-top-backlog-cont-item-l">
												<text>1.建档</text>
												<text>建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。</text>
											</view>
											<view class="pre-chunk-top-backlog-cont-item-r">
												<text>查看详情</text>
											</view>
										</view>
										<view class="pre-chunk-top-backlog-cont-item">
											<view class="pre-chunk-top-backlog-cont-item-l">
												<text>2.建档</text>
												<text>建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。</text>
											</view>
											<view class="pre-chunk-top-backlog-cont-item-r">
												<text>查看详情</text>
											</view>
										</view>
									</view>
								</view>
								<view class="pre-chunk-top pre-chunk-bot">
									<view class="pre-chunk-top-notice">
										<text>已办事项</text>
									</view>
									<view class="pre-chunk-top-backlog-cont">										
										<view @click="toPreDetail('ok')" class="pre-chunk-top-backlog-cont-item">
											<view class="pre-chunk-top-backlog-cont-item-l">
												<text>1.建档</text>
												<text>建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。</text>
											</view>
											<view class="pre-chunk-top-backlog-cont-item-r">
												<text>查看详情</text>
											</view>
										</view>
										<view class="pre-chunk-top-backlog-cont-item">
											<view class="pre-chunk-top-backlog-cont-item-l">
												<text>2.建档</text>
												<text>建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。</text>
											</view>
											<view class="pre-chunk-top-backlog-cont-item-r">
												<text>查看详情</text>
											</view>
										</view>
									</view>
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
										<image v-else src="/pregnancy/static/img/pretop.png" mode=""></image>
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
				<u-popup v-model="menuIsShow" :closeable="true" mode="top">
					<view class="pregnant-main-top-item-poup">
						<text @click="chooseClasify(item,index)" :class="currClasifyIndex===index?'active-clasify':''" v-for="(item,index) in classifyData" :key="index">{{item.name}}</text>
					</view>
				</u-popup>
			<u-popup v-model="showTimeSignPicker" mode="center" width="85%">
				<bx-date-stamp v-show="showTimeSignPicker" ref="ren" :headerBar="true" :isMarkDays="false" @onDayClick="onDayClick"></bx-date-stamp>
			</u-popup>
			<!-- <view @click.self="closeDay" class="cu-modal" style="display: flex; align-items: center" :class="modalName == 'Modal' ? 'show' : ''">
				<view class="cu-dialog">
					<bx-date-stamp v-show="showTimeSignPicker" ref="ren" :markDays="markDays" :headerBar="true" @onDayClick="onDayClick"></bx-date-stamp>
				</view>
			</view> -->
	</view>
</template>

<script>
	import bxDateStamp from '@/pregnancy/components/bx-date-stamp/bx-date-stamp.vue';
	export default {
		name:"pregnant",
		components:{bxDateStamp},
		data(){
			return {				
				classifyData:[{
					name:'孕期',
					type:'gestation'
				},{
					name:'胎儿',
					type:"fetus"
				},{
					name:'饮食',
					type:"diet"
				},{
					name:'运动',
					type:"sports"
				},{
					name:'检查',
					type:"inspect"
				},{
					name:'症状',
					type:"symptom"
				},{
					name:'待办/已办',
					type:"matter"
				}],
				menuIsShow:false,
				currentClasifyType:'gestation',
				headStyle:{
					paddingLeft:'18px'
				},
				dietHeadStyle:{
					paddingLeft:'18px',
					fontWeight:'700',
					fontSize:'18px'
				},
				itemStyle:{
					marginTop:"5px",
					boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1), 0 0 6px rgba(0, 0, 0, 0.04)",
					borderRadius:'5px'
				},
				headMatterStyle:{
					paddingLeft:'18px',
					fontWeight:"800"
				},
				current_pre:"",
				
				markDays:[],
				showTimeSignPicker:false,
				currClasifyIndex:0,
				modalName:'',
				selectDate:'',
				TabCur: 1,
				scrollLeft: 0,
				scrollMenuLeft:0,
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
				fetusTimeLienData:[{
					name:'第一周',
					num:1,
					isCurrent:false,
					isOpen:false,
					weight:100,
					height:50
				},{
					name:'第二周',
					isCurrent:false,
					isOpen:false,
					num:2,
					weight:200,
					height:60
				},{
					name:'第三周',
					isCurrent:false,
					isOpen:false,
					num:3,
					weight:300,
					height:70
				},{
					name:'第四周',
					isCurrent:false,
					isOpen:false,
					num:4,
					weight:400,
					height:80
				},{
					name:'第五周',
					isCurrent:false,
					isOpen:false,
					num:5,
					weight:500,
					height:90
				}],
				matterTimeLineData:[{
					name:'第二周',
					isCurrent:false,
					isOpen:false,
					num:2,
					point:[{
						name:'建档',						
					},{
						name:'NT检查',						
					},{
						name:'B超',						
					}]
				},{
					name:'第五周',
					isCurrent:false,
					isOpen:false,
					num:5,
					point:[{
						name:'建档',						
					},{
						name:'NT检查',						
					},{
						name:'B超',						
					}]
				},{
					name:'第十周',
					isCurrent:false,
					isOpen:false,
					num:10,
					point:[{
						name:'建档',						
					},{
						name:'NT检查',						
					},{
						name:'B超',						
					}]
				}],
				foodsClassify:[{
					name:'推荐食物',
					type:'recommend'
				},
				{
					name:'谨慎食物',
					type:'prudent'
				},{
					name:'禁止食物',
					type:'forbid'
				}],
				symptomTimeLienData:[{
					name:'第一周',
					isCurrent:false,
					isOpen:false,
					symptom:[{
						name:'体重增加，血压降低，可能有眩晕感；乳晕乳头颜色变深；',
						cause:'血管松弛了，所以血压会降低；进而导致眩晕',
						regular:'否',
						measure:'出血较多，建议立即就医'
					},{
						name:'恶心、极度乏困，情绪波动大；尿频；有特想吃的食物或特反胃的食物；',
						cause:'孕反应是体内支持宝宝生长的激素水平及生理变化导致的；特定激素引发尿量增加，同时增大的子宫又压迫了膀胱导致尿频。',
						regular:'是',
						measure:'注意休息，调整睡眠；呕吐严重可不必过分强调饮食；'
					}]
				},{
					name:'第二周',
					isCurrent:false,
					isOpen:false,
					symptom:[{
						name:'体重增加，血压降低，可能有眩晕感；乳晕乳头颜色变深；',
						cause:'血管松弛了，所以血压会降低；进而导致眩晕',
						regular:'否',
						measure:'出血较多，建议立即就医'
					},{
						name:'恶心、极度乏困，情绪波动大；尿频；有特想吃的食物或特反胃的食物；',
						cause:'孕反应是体内支持宝宝生长的激素水平及生理变化导致的；特定激素引发尿量增加，同时增大的子宫又压迫了膀胱导致尿频。',
						regular:'是',
						measure:'注意休息，调整睡眠；呕吐严重可不必过分强调饮食；'
					}]
				},{
					name:'第三周',
					isCurrent:false,
					isOpen:false,
					symptom:[{
						name:'体重增加，血压降低，可能有眩晕感；乳晕乳头颜色变深；',
						cause:'血管松弛了，所以血压会降低；进而导致眩晕',
						regular:'否',
						measure:'出血较多，建议立即就医'
					},{
						name:'恶心、极度乏困，情绪波动大；尿频；有特想吃的食物或特反胃的食物；',
						cause:'孕反应是体内支持宝宝生长的激素水平及生理变化导致的；特定激素引发尿量增加，同时增大的子宫又压迫了膀胱导致尿频。',
						regular:'是',
						measure:'注意休息，调整睡眠；呕吐严重可不必过分强调饮食；'
					}]
				}],
				inspectTimeLienData:[{
					name:'第一周',
					isCurrent:false,
					isOpen:false,
					backlog:[{
						name:'建档',
						content:'建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。'
					}],
					finished:[{
						name:'建档',
						content:'建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。'
					}]
				},{
					name:'第二周',
					isCurrent:false,
					isOpen:false,
					backlog:[{
						name:'建档',
						content:'建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。'
					}],
					finished:[{
						name:'建档',
						content:'建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。'
					}]
				}],
				dietTimeLineData:[{
					name:'第一周~第五周',
					isCurrent:false,
					isOpen:false,
					recommend:[{
						name:'苹果'
					},{
						name:'黑米粥'
					},{
						name:'大米'
					},{
						name:'炒面'
					}],
					taboo:[{
						name:"烤冷面"
					},{
						name:"避孕药"
					},{
						name:"五香粉"
					},{
						name:"锅巴"
					}]
				},{
					name:'第六周~第二十周',
					isCurrent:false,
					isOpen:false,
					recommend:[{
						name:'苹果'
					},{
						name:'黑米粥'
					},{
						name:'大米'
					},{
						name:'炒面'
					}],
					taboo:[{
						name:"烤冷面"
					},{
						name:"避孕药"
					},{
						name:"五香粉"
					},{
						name:"锅巴"
					}]
				}],
				
				sportsTimeLineData:[{
					name:'第一周~第五周',
					isCurrent:false,
					isOpen:false,
					recommend:[{
						name:'散步'
					},{
						name:'瑜伽'
					},{
						name:'做操'
					},{
						name:'晨练'
					}],
					taboo:[{
						name:"踢足球"
					},{
						name:"滑雪"
					},{
						name:"打网球"
					},{
						name:"减肥"
					}]
				},{
					name:'第六周~第二十周',
					isCurrent:false,
					isOpen:false,
					recommend:[{
						name:'散步'
					},{
						name:'瑜伽'
					},{
						name:'做操'
					},{
						name:'晨练'
					}],
					taboo:[{
						name:"跳绳"
					},{
						name:"踢毽子"
					},{
						name:"打篮球"
					},{
						name:"倒立"
					}]
				}],
				timeLienData:
				 [
					 {
					 name:'早期',
					 open:true,
					 child:[
						{
						 title:"第一周",
						 isOpen:false,
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'避孕药',
									 type:'taboo',
									 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
									 isOpen:false,
									 image:"/pregnancy/static/img/byy.jpg"
								 },
								 {
									 tit:'白酒',
									 type:'taboo',
									 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
									 isOpen:false,
									 image:"/pregnancy/static/img/bj.jpg"
								 },
								 {
									 tit:'薏米',
									 type:'taboo',
									 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
									 isOpen:false,
									 image:"/pregnancy/static/img/ym.jpg"
								 },
								 {
									 tit:'苹果',
									 type:'recom',
									 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
									 isOpen:false,
									 image:"/pregnancy/static/img/wxf.jpg"
								 }]
						 },{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'散步',
									 type:'recom',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
						 },{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看书',
									 type:'recom',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 type:'taboo',
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
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }
							 ]
						 }]
					 },
					 {
						 title:"第二周",
						 isOpen:false,
						 content:[{
							 name:'饮食',
							 isOk:false,							 
							 child:[
								 {
									 tit:'避孕药',
									 type:'taboo',
									 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
									 isOpen:false,
									 image:"/pregnancy/static/img/byy.jpg"
								 },
								 {
									 tit:'白酒',
									 type:'taboo',
									 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
									 isOpen:false,
									 image:"/pregnancy/static/img/bj.jpg"
								 },
								 {
									 tit:'薏米',
									 type:'taboo',
									 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
									 isOpen:false,
									 image:"/pregnancy/static/img/ym.jpg"
								 },
								 {
									 tit:'苹果',
									 type:'recom',
									 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
									 isOpen:false,
									 image:"/pregnancy/static/img/wxf.jpg"
								 }]
							},{
							 name:'出行',
							 isOk:false,
							 child:[
								 {
									 tit:'坐动车',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'过安检',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'散步',
									 type:'recom',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'摔跤',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 }]
								},{
							 name:'娱乐',
							 isOk:false,
							 child:[
								 {
									 tit:'看书',
									 type:'recom',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:'唱歌',
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"烧烤",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"看恐怖片",
									 type:'taboo',
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
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"骑马",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"踢毽子",
									 type:'taboo',
									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
									 isOpen:false
								 },
								 {
									 tit:"用跑步机",
									 type:'taboo',
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
						 isOpen:false,
						content:[{
													 name:'饮食',
													 isOk:false,							 
													 child:[
														 {
															 tit:'避孕药',
															 type:'taboo',
															 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
															 isOpen:false,
															 image:"/pregnancy/static/img/byy.jpg"
														 },
														 {
															 tit:'白酒',
															 type:'taboo',
															 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
															 isOpen:false,
															 image:"/pregnancy/static/img/bj.jpg"
														 },
														 {
															 tit:'薏米',
															 type:'taboo',
															 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
															 isOpen:false,
															 image:"/pregnancy/static/img/ym.jpg"
														 },
														 {
															 tit:'苹果',
															 type:'recom',
															 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
															 isOpen:false,
															 image:"/pregnancy/static/img/wxf.jpg"
														 }]
						},{
													 name:'出行',
													 isOk:false,
													 child:[
														 {
															 tit:'坐动车',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'过安检',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'散步',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'摔跤',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 }]
						},{
													 name:'娱乐',
													 isOk:false,
													 child:[
														 {
															 tit:'看书',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'唱歌',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"烧烤",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"看恐怖片",
															 type:'taboo',
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
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"骑马",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"踢毽子",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"用跑步机",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 }
													 ]
						}]
					 },
					 {
						 title:"第四周",
						 isOpen:false,
						content:[{
													 name:'饮食',
													 isOk:false,							 
													 child:[
														 {
															 tit:'避孕药',
															 type:'taboo',
															 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
															 isOpen:false,
															 image:"/pregnancy/static/img/byy.jpg"
														 },
														 {
															 tit:'白酒',
															 type:'taboo',
															 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
															 isOpen:false,
															 image:"/pregnancy/static/img/bj.jpg"
														 },
														 {
															 tit:'薏米',
															 type:'taboo',
															 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
															 isOpen:false,
															 image:"/pregnancy/static/img/ym.jpg"
														 },
														 {
															 tit:'苹果',
															 type:'recom',
															 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
															 isOpen:false,
															 image:"/pregnancy/static/img/wxf.jpg"
														 }]
						},{
													 name:'出行',
													 isOk:false,
													 child:[
														 {
															 tit:'坐动车',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'过安检',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'散步',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'摔跤',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 }]
						},{
													 name:'娱乐',
													 isOk:false,
													 child:[
														 {
															 tit:'看书',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'唱歌',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"烧烤",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"看恐怖片",
															 type:'taboo',
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
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"骑马",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"踢毽子",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"用跑步机",
															 type:'taboo',
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
						 isOpen:false,
						 content:[{
						 							 name:'饮食',
						 							 isOk:false,							 
						 							 child:[
						 								 {
						 									 tit:'避孕药',
						 									 type:'taboo',
						 									 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
						 									 isOpen:false,
						 									 image:"/pregnancy/static/img/byy.jpg"
						 								 },
						 								 {
						 									 tit:'白酒',
						 									 type:'taboo',
						 									 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
						 									 isOpen:false,
						 									 image:"/pregnancy/static/img/bj.jpg"
						 								 },
						 								 {
						 									 tit:'薏米',
						 									 type:'taboo',
						 									 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
						 									 isOpen:false,
						 									 image:"/pregnancy/static/img/ym.jpg"
						 								 },
						 								 {
						 									 tit:'苹果',
						 									 type:'recom',
						 									 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
						 									 isOpen:false,
						 									 image:"/pregnancy/static/img/wxf.jpg"
						 								 }]
						 },{
						 							 name:'出行',
						 							 isOk:false,
						 							 child:[
						 								 {
						 									 tit:'坐动车',
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:'过安检',
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:'散步',
						 									 type:'recom',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:'摔跤',
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 }]
						 },{
						 							 name:'娱乐',
						 							 isOk:false,
						 							 child:[
						 								 {
						 									 tit:'看书',
						 									 type:'recom',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:'唱歌',
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:"烧烤",
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:"看恐怖片",
						 									 type:'taboo',
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
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:"骑马",
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:"踢毽子",
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 },
						 								 {
						 									 tit:"用跑步机",
						 									 type:'taboo',
						 									 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
						 									 isOpen:false
						 								 }
						 							 ]
						 }]
					 },
					 {
						 title:"第六周",
						 isOpen:false,
						content:[{
													 name:'饮食',
													 isOk:false,							 
													 child:[
														 {
															 tit:'避孕药',
															 type:'taboo',
															 content:"怀孕后吃避孕药会对胎儿产生影响，所以孕期不能吃。",
															 isOpen:false,
															 image:"/pregnancy/static/img/byy.jpg"
														 },
														 {
															 tit:'白酒',
															 type:'taboo',
															 content:"准妈妈不能喝白酒，白酒中含有一定量的酒精，酒精会通过血液循环到达胎盘，会影响薄薄的智力发育，甚至会造成宝宝畸形。准妈妈摄入酒精过多会刺激子宫收缩，造成流产、早产等后果",
															 isOpen:false,
															 image:"/pregnancy/static/img/bj.jpg"
														 },
														 {
															 tit:'薏米',
															 type:'taboo',
															 content:"薏米虽然营养丰富，但是大量食用会有兴奋子宫的作用，食用不当会引起宫缩，不利于安胎。保险起见，建议准妈妈不要吃薏米哦",
															 isOpen:false,
															 image:"/pregnancy/static/img/ym.jpg"
														 },
														 {
															 tit:'苹果',
															 type:'recom',
															 content:"五香粉种类繁多，大部分用的都是温热性的中药性食材，不仅吃多了容易上火，还会出现一些未知的风险，影响胎儿的健康。建议不要食用",
															 isOpen:false,
															 image:"/pregnancy/static/img/wxf.jpg"
														 }]
						},{
													 name:'出行',
													 isOk:false,
													 child:[
														 {
															 tit:'坐动车',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'过安检',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'散步',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'摔跤',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 }]
						},{
													 name:'娱乐',
													 isOk:false,
													 child:[
														 {
															 tit:'看书',
															 type:'recom',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:'唱歌',
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"烧烤",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"看恐怖片",
															 type:'taboo',
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
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"骑马",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"踢毽子",
															 type:'taboo',
															 content:"孕妇最好不要踢毽子。踢毽子很容易摔着，动了胎气，对宝宝的发育不好。如果想运动的话，可以找老公陪你练瑜伽!",
															 isOpen:false
														 },
														 {
															 tit:"用跑步机",
															 type:'taboo',
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
			toSymDetail(item){
				uni.navigateTo({
					url:'/pregnancy/pregnant/symptomDetail'
				})
			},
			/*点击隐藏显示顶部菜单*/
			showMore(){
				this.menuIsShow = !this.menuIsShow
			},
			/*控制展开收缩*/
			shrink(item,type){
				item.isOpen = !item.isOpen
				if(type =="pregnant"){
					// setTimeout(()=>{
						this.$nextTick(()=>{
							this.$refs.collapse.init()
						})
					// },1000)
					
				}				
			},
			/*点击食物分类进行跳转**/
			toFoodsDetail(type){
				uni.navigateTo({
					url:'/pregnancy/pregnant/pregnantFoodsDetail?type=' + type
				})
			},
			/*点击注意事项item触发**/
			collapseClick(e){
				console.log("--------点击触发--------")
				this.$nextTick(()=>{
					setTimeout(()=>{
						this.$refs.collapse.init()
					},250)
				})
			},
			/*点击孕期顶部分类**/
			chooseClasify(item,i){
				this.currClasifyIndex = i
				this.currentClasifyType = item.type
				this.scrollMenuLeft = (i - 1) * 85
				// this.scrollMenuLeft = 
				if(this.menuIsShow){
					this.menuIsShow  = false
				}
			},
			/*跳转至产检详情**/
			toPreDetail(type){
				
				uni.navigateTo({
					url:'/pregnancy/pregnant/antenatal?type=' + type
				})
			},
			/*点击日期某一天**/
			onDayClick(data){
				this.showTimeSignPicker = false;
				
				/***/
				let interval_time = 280 * 24 * 60 * 60 *1000  //计算280天得毫秒数
				let choose_time = new Date(data.date).getTime() + 24 * 60 * 60 *1000 // 计算当前选择时间下一天得毫秒数
				let period_time = choose_time + interval_time // 预产期毫秒数
				let endTime = this.formateDate(period_time)
				console.log("点击选择预产期----",endTime)				
				this.selectDate = endTime;
				this.modalName = '';
				let time = {
					choose_time :data.date,
					end_time : endTime
				}
				uni.setStorageSync('pretime',time)
				this.calcTimeQuantum(data.date)
			},
			/*计算每一周得时间段**/
			calcTimeQuantum(time){
				let timeLienData = this.timeLienData
				let fetusTimeLienData = this.fetusTimeLienData
				let inspectTimeLienData = this.inspectTimeLienData
				let matterTimeLineData = this.matterTimeLineData
				let symptomTimeLienData = this.symptomTimeLienData
				let startTime = new Date(time).getTime() + 24 * 60 * 60 *1000  //开始时间
				// startTime * index * 7 * 60 * 60 * 1000
				let currIndex = 0
				/*孕期时间*/
				timeLienData.forEach(item=>{
					item.child.forEach((child,index)=>{
						if(item.name === '早期'){
							this.$set(child,'start_time',this.formateDate(startTime * index * 7 * 60 * 60 * 1000==0?startTime:startTime + index * 7 *24 * 60 * 60 * 1000))
							this.$set(child,'end_time',this.formateDate(new Date(child.start_time).getTime() + 6*24 * 60 * 60 * 1000))
							currIndex = index
						}else{
							currIndex = currIndex + 1
							this.$set(child,'start_time',this.formateDate(startTime + currIndex * 7*24 * 60 * 60 * 1000))
							this.$set(child,'end_time',this.formateDate(new Date(child.start_time).getTime() + 6*24 * 60 * 60 * 1000))
						}
					})
				})
				
				/*胎儿时间*/
				// let fetuCurrIndex = 0
				fetusTimeLienData.forEach((single,i)=>{
					this.$set(single,'start_time',this.formateDate(startTime * i * 7 * 60 * 60 * 1000==0?startTime:startTime + i * 7 *24 * 60 * 60 * 1000))
					this.$set(single,'end_time',this.formateDate(new Date(single.start_time).getTime() + 6*24 * 60 * 60 * 1000))
				})
				
				/* 待办/已办**/
				inspectTimeLienData.forEach((inspect,m)=>{
					this.$set(inspect,'start_time',this.formateDate(startTime * m * 7 * 60 * 60 * 1000==0?startTime:startTime + m * 7 *24 * 60 * 60 * 1000))
					this.$set(inspect,'end_time',this.formateDate(new Date(inspect.start_time).getTime() + 6*24 * 60 * 60 * 1000))
				})
				
				/* 检查**/
				matterTimeLineData.forEach((matter,t)=>{
					this.$set(matter,'start_time',this.formateDate(startTime * (matter.num - 1) * 7 * 60 * 60 * 1000==0?startTime:startTime + ((matter.num - 1) * 7 *24 * 60 * 60 * 1000)))
					this.$set(matter,'end_time',this.formateDate(new Date(matter.start_time).getTime() + 6*24 * 60 * 60 * 1000))
				})
				
				/* 症状 **/
				symptomTimeLienData.forEach((sym,n)=>{
					this.$set(sym,'start_time',this.formateDate(startTime * n * 7 * 60 * 60 * 1000==0?startTime:startTime + n * 7 *24 * 60 * 60 * 1000))
					this.$set(sym,'end_time',this.formateDate(new Date(sym.start_time).getTime() + 6*24 * 60 * 60 * 1000))
				})
				
				if(this.currentClasifyType === 'gestation'){
					this.$nextTick(()=>{
						this.$refs.collapse.init()
					})
				}				
				this.calcCurrTime()
				console.log("每周预期时间---",timeLienData)
			},
			/*计算当前所处孕期时间阶段**/
			calcCurrTime(){
				let nowTime = new Date().getTime() //当前时间
				let timeLienData = this.timeLienData
				let fetusTimeLienData = this.fetusTimeLienData
				let inspectTimeLienData = this.inspectTimeLienData
				let matterTimeLineData = this.matterTimeLineData
				let symptomTimeLienData = this.symptomTimeLienData
				timeLienData.forEach(item=>{
						item.open = false
					item.child.forEach(child=>{
						if(child.isCurrent){
							child.isCurrent = false
						}
						let startTime = new Date(child.start_time).getTime()
						let endTime = new Date(child.end_time).getTime()
						if(nowTime>=startTime && nowTime <= endTime){
							this.$set(child,'isCurrent',true)
							item.open = true
							child.isOpen = true
						}
					})
				})
				
				fetusTimeLienData.forEach(sing=>{
					sing.isCurrent = false
					let fetusStartTime = new Date(sing.start_time).getTime()
					let fetusEndTime = new Date(sing.end_time).getTime()
					if(nowTime>=fetusStartTime && nowTime <= fetusEndTime){
						// this.$set(sing,'isCurrent',true)
						sing.isCurrent = true
						sing.isOpen = true
					}
				})
				
				inspectTimeLienData.forEach(inspe=>{
					inspe.isCurrent = false
					
					let inspeStartTime = new Date(inspe.start_time).getTime()
					let inspeEndTime = new Date(inspe.end_time).getTime()
					if(nowTime>=inspeStartTime && nowTime <= inspeEndTime){
						// this.$set(sing,'isCurrent',true)
						inspe.isCurrent = true
						inspe.isOpen = true
					}
				})
				
				matterTimeLineData.forEach(matter=>{
					matter.isCurrent = false					
					let matterStartTime = new Date(matter.start_time).getTime()
					let matterEndTime = new Date(matter.end_time).getTime()
					if(nowTime>=matterStartTime && nowTime <= matterEndTime){
						// this.$set(sing,'isCurrent',true)
						matter.isCurrent = true
						matter.isOpen = true
					}
				})
				
				symptomTimeLienData.forEach(sym=>{
					sym.isCurrent = false
					
					let symStartTime = new Date(sym.start_time).getTime()
					let symEndTime = new Date(sym.end_time).getTime()
					if(nowTime>=symStartTime && nowTime <= symEndTime){
						// this.$set(sing,'isCurrent',true)
						sym.isCurrent = true
						sym.isOpen = true
					}
				})
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
					url:'/pregnancy/pregnant/pregnantDetail'
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
			let time = uni.getStorageSync('pretime')
			if(time){
				this.selectDate = time.end_time
				this.calcTimeQuantum(time.choose_time)
			}
			console.log("---------------------")
		},
		mounted() {
			this.$nextTick(()=>{
				this.$refs.collapse.init()
			})
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
		.pregnant-main-fetation{
			.pregnant-main-top{
				margin-bottom: 20upx;
				.pregnant-main-top-item{
					display: flex;
					justify-content: center;
					.pregnant-main-top-item-w{
						width: 600upx;
						overflow: hidden;
						display: flex;
						// justify-content: center;
						white-space: nowrap;
						/deep/ text{
							display: inline-block;
							background-color: #ededed;
							color: #000;
							padding: 4upx 50upx;
							border: 1px solid #ededed;
							border-radius: 10upx;
							margin-right: 10upx;
							height: 48upx;
							line-height:48upx;
						}
						.active-clasify{
							background-color: #1cbbb4;
							color: #fff;
						}
					}
					.pregnant-main-top-item-r{
						margin-left: 10upx;
					}
					
				}
				.pregnant-main-top-item-add{
					display: flex;
					justify-content: flex-start;
					margin-left: 30upx;
					margin-top: 20upx;
					text{
						background-color: #ededed;
						color: #000;
						padding: 4upx 20upx;
						border: 1px solid #ededed;
						border-radius: 10upx;
						margin-right: 10upx;
					}
					.active-clasify{
						background-color: #1cbbb4;
						color: #fff;
					}
				}
			}
			.fetus-wrap{
				.content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					text{
						font-weight: 600;
						font-size: 15px;
					}
					.content-item-top{
						display: flex;
						flex-direction: column;
					}										
				}
				/deep/ .fetus-top{
					margin-top: 30upx;					
					.fetus-top-tit{
						color: #000;
						font-size: 32upx;
						font-weight: 700;
					}
					.fetus-top-main{
						display: flex;
						box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
						border-radius: 80upx;
						margin-top: 30upx;
						.fetus-top-main-left{
							width: 180upx;
							height: 180upx;
							margin: 6upx;
							image{
								width: 100%;
								height: 100%;
							}
						}
						.fetus-top-main-right{
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							margin-left: 15px;
							.fetus-top-main-right-t{
								font-size: 40upx;
								color: #fcc005;
								font-weight: 600;
							}
							.fetus-top-main-right-b{
								color: #ccc;
							}
						}
					}
					.fetus-top-bot{
						margin-top: 30upx;
						.fetus-top-bot-t{							
							color: #000;
							font-size: 32upx;
							font-weight: 700;
						}
						.fetus-top-bot-b{
							box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
							border-radius: 15px;
							padding: 10px;
							margin-top: 15px;
							.fetus-top-bot-b-t{								
								text{
									color: #000;
									&:first-child{
										display: inline-block;
										border-radius: 10upx;
										padding: 4upx 20upx;
										background-color: #ffe7eb;
										color: #c87684;
										margin-right: 10upx;
									}
								}
							}
							.fetus-top-bot-b-b{
								margin-top: 15upx;
								text{
									color: #000;
									&:first-child{
										display: inline-block;
										padding: 4upx 20upx;
										border-radius: 10upx;
										background-color: #ffe7eb;
										color: #c87684;
										margin-right: 10upx;
									}
								}
							}
						}
					}
				}
			}
			
			.diet-wrap{
				.content{
					font-size: 30upx;
					font-weight: 700;
					background-color: lightseagreen;
				}
				.diet-item-wrap{
					.diet-main{
						display: flex;
						flex-direction: column;
						.diet-main-top{
							margin-top: 30upx;
							.diet-main-top-text{
								font-size: 32upx;
								color: #000;
								font-weight: 700;
							}
							.diet-main-item-wrap{
								margin-top: 20upx;
								display: flex;
								flex-wrap: wrap;
								.diet-main-item{
									display: flex;
									flex-direction: column;
									box-shadow: 4px 3px 4px rgba(57, 181, 74, 0.2);
									background-color: #39b54a;
									color: #fff;
									width: 120upx;
									height: 120upx;
									border-radius: 10upx;
									margin-right: 20upx;
									.diet-main-item-t{
										margin: 10upx 0 0 10upx;
									}
									.diet-main-item-b{
										text-align: center;
										// margin-top: 10upx;
									}
								}
								.taboo-item{
									box-shadow: 4px 3px 4px rgba(229, 77, 66, 0.2);
									background-color: #e54d42;
									color: #fff;
								}
							}
						}
						
					}
				// 	.diet-item{
				// 		display: flex;
				// 		justify-content: space-between;
				// 		align-items: center;
				// 		width: 85%;
				// 		margin: 60upx auto;
				// 		padding: 20px;
				// 		background: #f8b3a4;
				// 		color: white;
				// 		font-size: 18px;
				// 		border-radius: 15px;
				// 		font-weight: 800;
				// 		box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
				// 		&:nth-of-type(2){
				// 			background: #8e9bc5;
				// 		}
				// 		&:nth-of-type(3){
				// 			background: #76a1c3;
				// 		}
				// 		.diet-item-left{
				// 			.diet-item-left-top{
								
				// 			}
				// 		}
				// 		.diet-item-rig{
							
				// 		}
				// 	}
				}
			}
			.sports-wrap{
				.content{
					background-color: steelblue;
				}
			}
			.matter-wrap{
				/deep/ .content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30upx;
					font-weight: 700;
					
					.matter-content-top{
						display: flex;
						flex-direction: column;
					}
				}
				/deep/ .matter-wrap-main{
						margin-top: 20upx;
						.pre-chunk-top-notice{
							font-size: 16px;
							color: #000;
							font-weight: 600;
						}
						
						.pre-chunk-top-backlog-cont{
							// box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
							border-radius: 10px;
							// padding: 10px;
							margin-top: 15px;
							.pre-chunk-top-backlog-cont-item{
								box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
								border-radius: 10px;
								padding: 10px;
								margin-top: 15px;
								// box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
								.pre-chunk-top-backlog-cont-item-l{
									line-height: 48upx;									
									text{
										color:#ccc;
										&:first-child{
											font-weight: 700;
											display: inline-block;
											margin-right: 20upx;
											color: #000;
										}
									}
								}
								.pre-chunk-top-backlog-cont-item-r{
									text-align: right;
									color: #fb7e62;
								}
							}
						}
				}
			}
			.symptom_wrap{
				/deep/ .content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30upx;
					font-weight: 600;
					background: cadetblue;
					.symptom-content-top{
						display: flex;
						flex-direction: column;
					}
				}
				.symptom-current{
					background: rgba(110,220,94,0.7);
				}
				.symptom_main{
					.symptom_main_top{
						margin: 20upx 0;
						font-size: 32upx;
						font-weight: 700;
						color: #000;
					}
					.symptom_main_bot{
						display: flex;
						flex-wrap: wrap;
						
						.symptom_main_item{
							box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
							border-radius: 20upx;
							padding: 30upx;
							display: flex;
							align-items: flex-end;
							justify-content: center;
							flex-direction: column;
							margin-top: 30upx;
							.symptom_main_item_bot{
								color: #fb7e62;
							}
						}
					}
				}
			}
			.inspect_wrap{
				.content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #fff;
					background-color: #f4b600;
				}
				.inspect-bg{
					background-color: rgba(110,220,94,0.7);
				}
				/deep/ .inspect_wrap_top_left{
					.inspect_wrap_top_left_t{
						font-size: 16px;
						font-weight: 700;
						color: #fff;
					}
					.inspect_wrap_top_left_c{
						display: flex;
						.inspect_wrap_top_left_c_l{
							
						}
						.inspect_wrap_top_left_c_r{
							display: flex;
							text{
								margin-right: 20upx;
							}
						}
					}
				}
				.inspect_wrap_top_rig{
					
				}
				
			}
			// /deep/ .u-collapse-body{
			// 	height: 750upx!important;
			// }
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
					display: flex;
					justify-content: space-between;
					align-items: center;
					.cont-tit{
						display: flex;
						
						.tit-stature{
							margin-right: 10upx;
						}
					}
				}
				.content-item-top{
					display: flex;
					flex-direction: column;
				}
				.content-item-cen{
					display: flex;
					.content-item-cen-l{
						margin-right: 15upx;
					}
				}
				.pre-chunk-wrap{
					display: flex;
					margin-top: 20upx;
					flex-wrap: wrap;
					.pre-chunk-top{
						width: 100%;
						.pre-chunk-top-item{
							.pre-chunk-top-notice{
								font-size: 16px;
								color: #000;
								font-weight: 600;
							}
							.pre-chunk-item-wrap{
								display: flex;
								justify-content: center;
								margin-top: 15upx;
								.pre-chunk{									
									width: 120upx;
									height: 120upx;
									display: flex;
									flex-direction: column;
									// align-items: center;
									// justify-content: center;
									background-color: #e54d42;
									box-shadow: 4px 3px 4px rgba(229, 77, 66, 0.2);
									color: white;
									border-radius: 5px;
									margin-right: 20upx;
									margin-bottom: 20upx;
									.pre-chunk-top{
										margin: 10upx 0 0 10upx;
									}
									.pre-chunk-item-bot{
										text-align: center;
									}
								}
								.pass-pre-chunk{
									background-color: #39b54a;
									box-shadow: 4px 3px 4px rgba(57, 181, 74, 0.2);
								}
							}
						}
						
						
						.pre-chunk-top-notice-cont{
							margin-top: 10px;
							.pre-chunk-top-notice-cont-item{
								display: flex;
								line-height: 48upx;
								// box-shadow: 3px 3px 5px rgba(26, 26, 26, 0.2);
								width: 100%;
								padding: 0 20upx;
								.pre-chunk-top-notice-cont-item-l{
									color: #000;
									font-weight: 600;
								}
								.pre-chunk-top-notice-cont-item-r{
									// font-weight: 800;
									color: #ccc;
									text{
										&:first-child{
											margin-right: 10upx;
											color: #000;
											font-weight: 800;
										}
									}
								}
							}
						}
					}
					.pre-chunk-bot{
						margin-top: 20upx;
						.pre-chunk-top-notice{
							color: #000;
							font-weight: 700;
							font-size: 32upx;
						}
						.pre-chunk-top-backlog-cont{
							// box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
							border-radius: 10px;
							// padding: 10px;
							margin-top: 15px;
							.pre-chunk-top-backlog-cont-item{
								box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
								border-radius: 10px;
								padding: 10px;
								margin-top: 15px;
								// box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
								.pre-chunk-top-backlog-cont-item-l{
									line-height: 48upx;									
									text{
										color:#ccc;
										&:first-child{
											font-weight: 700;
											display: inline-block;
											margin-right: 20upx;
											color: #000;
										}
									}
								}
								.pre-chunk-top-backlog-cont-item-r{
									text-align: right;
									color: #fb7e62;
								}
							}
						}
					}
					// .pre-chunk{
					// 	width: 120upx;
					// 	height: 120upx;
					// 	display: flex;
					// 	align-items: center;
					// 	justify-content: center;
					// 	background-color: #e54d42;
					// 	box-shadow: 4px 3px 4px rgba(229, 77, 66, 0.2);
					// 	color: white;
					// 	border-radius: 5px;
					// 	margin-right: 20upx;
					// 	margin-bottom: 20upx;
					// }
					// .pass-pre-chunk{
					// 	background-color: #39b54a;
					// 	box-shadow: 4px 3px 4px rgba(57, 181, 74, 0.2);
					// }
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
							max-width: 10upx;
							min-width: 10upx;
							display: inline-block;
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
	.pregnant-main-top-item-poup{
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 80upx 0;
		width: 98%;
		margin: 0 auto;
		text{
			background-color: #ededed;
			color: #000;
			padding: 4upx 56upx;
			border: 1px solid #ededed;
			border-radius: 10upx;
			margin-right: 10upx;
			margin-bottom: 15upx;
			height: 48upx;
			line-height: 48upx;
			// &:first-child{
			// 	margin-left: 10upx;
			// }
		}
		.active-clasify{
			background-color: #1cbbb4;
			color: #fff;
		}
	}
	// .pregnant_wrap{
	// 	height: 100vh;
	// 	.pregnant-timeline{
	// 		height: 100%;
	// 	}
	// }
</style>
