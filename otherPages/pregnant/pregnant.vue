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
					<text @click="chooseClasify(item,index)" :class="currClasifyIndex===index?'active-clasify':''" v-for="(item,index) in classifyData" :key="index">{{item.name}}</text>
				</view>
			</view>
			<!-- 预期首页===胎儿 -->
			<view v-if="currentClasifyType === 'fetus' " class="fetus-wrap">
				<view class="cu-timeline">
					<view class="cu-time">胎儿</view>
					<view class="cu-item cur">
						<view class="content bg-orange shadow-blur">
							<text>第一周</text>
						</view>
						<view class="fetus-top">
							<view class="fetus-top-tit">
								<text>胎儿发育</text>
							</view>
							<view class="fetus-top-main">
								<view class="fetus-top-main-left">
									<image src="/otherPages/static/img/1.png" mode=""></image>
								</view>
								<view class="fetus-top-main-right">
									<view class="fetus-top-main-right-t">
										<text>孕1周</text>
									</view>
									<view class="fetus-top-main-right-b">
										<view class="fetus-top-main-right-b-l">
											<text>体重：</text>
											<text>1000克</text>
										</view>
										<view class="fetus-top-main-right-b-l">
											<text>身长：</text>
											<text>50厘米</text>
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
					<view class="cu-item cur">
						<view class="content bg-orange shadow-blur">
							<text>第二周</text>
						</view>
						<view class="fetus-top">
							<view class="fetus-top-tit">
								<text>胎儿发育</text>
							</view>
							<view class="fetus-top-main">
								<view class="fetus-top-main-left">
									<image src="/otherPages/static/img/1.png" mode=""></image>
								</view>
								<view class="fetus-top-main-right">
									<view class="fetus-top-main-right-t">
										<text>孕2周</text>
									</view>
									<view class="fetus-top-main-right-b">
										<view class="fetus-top-main-right-b-l">
											<text>体重：</text>
											<text>1000克</text>
										</view>
										<view class="fetus-top-main-right-b-l">
											<text>身长：</text>
											<text>50厘米</text>
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
				<u-collapse :head-style='dietHeadStyle'>
					<u-collapse-item  title="饮食" :open="true">
						<view class="diet-wrap-top">
							<view class="diet-wrap-top-item">
								<view class="diet-wrap-top-item-left">
									<image src="/otherPages/static/img/14.jpg" mode=""></image>
								</view>
								<view class="diet-wrap-top-item-right">
									<view class="diet-wrap-top-item-right-t">
										<text>面条</text>
									</view>
									<view class="diet-wrap-top-item-right-c">
										<view class="diet-wrap-top-item-right-c-i">
											<view class="r-c-i-l">
												<u-icon color="#5fdb13" name="checkmark-circle-fill"></u-icon>
												<text>孕期</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#ffc121" name="error-circle-fill"></u-icon>
												<text>坐月子</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#f75d64" name="close-circle-fill"></u-icon>
												<text>脯乳期</text>
											</view>	
										</view>
									</view>
									<!-- <view class="diet-wrap-top-item-right-b">
										<text>面条</text>
									</view> -->
								</view>
							</view>
							<view class="diet-wrap-top-item">
								<view class="diet-wrap-top-item-left">
									<image src="/otherPages/static/img/14.jpg" mode=""></image>
								</view>
								<view class="diet-wrap-top-item-right">
									<view class="diet-wrap-top-item-right-t">
										<text>面条</text>
									</view>
									<view class="diet-wrap-top-item-right-c">
										<view class="diet-wrap-top-item-right-c-i">
											<view class="r-c-i-l">
												<u-icon color="#5fdb13" name="checkmark-circle-fill"></u-icon>
												<text>孕期</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#ffc121" name="error-circle-fill"></u-icon>
												<text>坐月子</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#f75d64" name="close-circle-fill"></u-icon>
												<text>脯乳期</text>
											</view>	
										</view>
									</view>
									<!-- <view class="diet-wrap-top-item-right-b">
										<text>面条</text>
									</view> -->
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="运动" >
						<view class="diet-wrap-top">
							<view class="diet-wrap-top-item">
								<view class="diet-wrap-top-item-left">
									<image src="/otherPages/static/img/yy.jpg" mode=""></image>
								</view>
								<view class="diet-wrap-top-item-right">
									<view class="diet-wrap-top-item-right-t">
										<text>游泳</text>
									</view>
									<view class="diet-wrap-top-item-right-c">
										<view class="diet-wrap-top-item-right-c-i">
											<view class="r-c-i-l">
												<u-icon color="#5fdb13" name="checkmark-circle-fill"></u-icon>
												<text>孕期</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#ffc121" name="error-circle-fill"></u-icon>
												<text>坐月子</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#f75d64" name="close-circle-fill"></u-icon>
												<text>脯乳期</text>
											</view>	
										</view>
									</view>
									<!-- <view class="diet-wrap-top-item-right-b">
										<text>面条</text>
									</view> -->
								</view>
							</view>
							<view class="diet-wrap-top-item">
								<view class="diet-wrap-top-item-left">
									<image src="/otherPages/static/img/pb.jpg" mode=""></image>
								</view>
								<view class="diet-wrap-top-item-right">
									<view class="diet-wrap-top-item-right-t">
										<text>跑步</text>
									</view>
									<view class="diet-wrap-top-item-right-c">
										<view class="diet-wrap-top-item-right-c-i">
											<view class="r-c-i-l">
												<u-icon color="#5fdb13" name="checkmark-circle-fill"></u-icon>
												<text>孕期</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#ffc121" name="error-circle-fill"></u-icon>
												<text>坐月子</text>
											</view>	
											<view class="r-c-i-l">
												<u-icon color="#f75d64" name="close-circle-fill"></u-icon>
												<text>脯乳期</text>
											</view>	
										</view>
									</view>
									<!-- <view class="diet-wrap-top-item-right-b">
										<text>面条</text>
									</view> -->
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>				
			</view>
			
			<!-- 孕期首页===> 待办/已办 -->
			<view v-if="currentClasifyType === 'matter'" class="matter-wrap">
				<view class="cu-timeline">
					<view class="cu-time">待办/已办</view>
					<view class="cu-item cur">
						<view class="content bg-blue shadow-blur">
							<text>第一周</text>
						</view>
						<view class="pre-chunk-top pre-chunk-bot matter-wrap-main">
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
						<view class="pre-chunk-top pre-chunk-bot matter-wrap-main">
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
			
			<!-- 孕期首页===> 检查 -->
			<view v-if="currentClasifyType === 'inspect'" class="inspect_wrap">
				<view class="cu-timeline">
					<view class="cu-time">检查</view>
					<view class="cu-item cur">
						<view class="content bg-yellow shadow-blur">
							<view class="inspect_wrap_top_left">
								<view class="inspect_wrap_top_left_t">
									<text>2020-10-29</text>
								</view>
								<view class="inspect_wrap_top_left_c">
									<view class="inspect_wrap_top_left_c_l">
										<text>产检重点：</text>
									</view>
									<view class="inspect_wrap_top_left_c_r">
										<text>建档</text>
										<text>NT检查</text>
										<text>B超</text>
									</view>									
								</view>
								<view class="inspect_wrap_top_left_b">
									<text>孕2周</text>
								</view>
							</view>
							<view class="inspect_wrap_top_rig">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
					</view>
					<view class="cu-item cur">
						<view class="content bg-yellow shadow-blur">
							<view class="inspect_wrap_top_left">
								<view class="inspect_wrap_top_left_t">
									<text>2021-01-10</text>
								</view>
								<view class="inspect_wrap_top_left_c">
									<view class="inspect_wrap_top_left_c_l">
										<text>产检重点：</text>
									</view>
									<view class="inspect_wrap_top_left_c_r">
										<text>建档</text>
										<text>NT检查</text>
										<text>B超</text>
									</view>									
								</view>
								<view class="inspect_wrap_top_left_b">
									<text>孕5周</text>
								</view>
							</view>
							<view class="inspect_wrap_top_rig">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
					</view>
					<view class="cu-item cur">
						<view class="content bg-yellow shadow-blur">
							<view class="inspect_wrap_top_left">
								<view class="inspect_wrap_top_left_t">
									<text>2021-9-10</text>
								</view>
								<view class="inspect_wrap_top_left_c">
									<view class="inspect_wrap_top_left_c_l">
										<text>产检重点：</text>
									</view>
									<view class="inspect_wrap_top_left_c_r">
										<text>建档</text>
										<text>NT检查</text>
										<text>B超</text>
									</view>									
								</view>
								<view class="inspect_wrap_top_left_b">
									<text>孕10周</text>
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
						<view v-for="(week,i) in item.child" class="cu-item" :class="week.isCurrent?'text-green':''">
							<view @click="toDetail(week)" class="content " :class="week.isCurrent?'bg-green shadow-blur':'bg-cyan'">
								<view class="content-item-top">
									<text v-if="week.start_time && week.end_time">{{week.start_time}} ~ {{week.end_time}}</text>
								</view>
								<view class="content-item-cen">
									<text>{{week.title}}</text>
								</view>								
							</view>
							
							<view class="pre-chunk-wrap">
								<view class="pre-chunk-top">
									<view class="pre-chunk-top-notice">
										<text>注意事项</text>
									</view>
									<view class="pre-chunk-item-wrap">
										<view @click="openCont(con)" v-for="(con,k) in week.content" :key="k" :class="con.isOk?'pass-pre-chunk':''" class="pre-chunk">
												{{con.name}}																			
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
	import bxDateStamp from '@/components/bx-date-stamp/bx-date-stamp.vue';
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
					name:'饮食/运动',
					type:"diet"
				},{
					name:'检查',
					type:"inspect"
				},{
					name:'待办/已办',
					type:"matter"
				}],
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
			},
			/*跳转至产检详情**/
			toPreDetail(type){
				
				uni.navigateTo({
					url:'/otherPages/pregnant/antenatal?type=' + type
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
				let startTime = new Date(time).getTime() + 24 * 60 * 60 *1000  //开始时间
				// startTime * index * 7 * 60 * 60 * 1000
				let currIndex = 0
				
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
				this.$nextTick(()=>{
					this.$refs.collapse.init()
				})
				this.calcCurrTime()
				console.log("每周预期时间---",timeLienData)
			},
			/*计算当前所处孕期时间阶段**/
			calcCurrTime(){
				let nowTime = new Date().getTime() //当前时间
				let timeLienData = this.timeLienData
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
						}
					})
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
				.diet-wrap-top{
					.diet-wrap-top-item{
						display: flex;
						width: 95%;
						margin: 30upx auto 0;
						.diet-wrap-top-item-left{
							width: 250upx;
							height: 150upx;
							image{
								width: 100%;
								height: 100%;
								border-radius: 30upx;
							}
						}
						.diet-wrap-top-item-right{
							margin-left: 20upx;
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							flex: 1;
							border-bottom: 1px solid #f5f5f5;
							.diet-wrap-top-item-right-t{
								font-size: 32upx;
								font-weight: 600;
							}
							.diet-wrap-top-item-right-c{
								display: flex;
								.diet-wrap-top-item-right-c-i{
									display: flex;
									.r-c-i-l{
										line-height: 20upx;
										margin-right: 15upx;
										text{
											margin-left: 10upx;
										}
									}
								}
							}
						}
					}
				}
			}
			.matter-wrap{
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
			.inspect_wrap{
				.content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #fff;
					background-color: #f4b600;
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
					.pre-chunk-top{
						width: 100%;
						.pre-chunk-top-notice{
							font-size: 16px;
							color: #000;
							font-weight: 600;
						}
						.pre-chunk-item-wrap{
							display: flex;
							margin-top: 15upx;
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
	// .pregnant_wrap{
	// 	height: 100vh;
	// 	.pregnant-timeline{
	// 		height: 100%;
	// 	}
	// }
</style>
