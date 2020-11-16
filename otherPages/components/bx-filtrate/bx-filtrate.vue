<template>
	<view class="filtrate-wrap">
		<view v-if="childChooseArr.length > 0" class="filtrate-choose">
			<text>已选择：</text>
			<view v-for="(item,index) in childChooseArr" class="filtrate-choose-item">
				<text class="cu-tag" :text="item.title" closeable :show="item.choose" type="warning" @close="tagClick(item)" mode="light"></text>
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
						<!-- arrow-down-fill -->
						<text size="24" class="cuIcon-usefullfill" style="transform: rotate(180deg);" v-show="cate.current_num == 1 && item.type !=='food' && childChooseArrLength == 1" name="arrow-downward"></text>
						<!-- <u-icon size="24" v-show="cate.current_num == 1 && item.type !=='food' && childChooseArrLength == 1" name="arrow-downward"></u-icon> -->
						<u-icon size="24" v-show="cate.current_num == 2 && item.type !=='food' && childChooseArrLength == 1" name="arrow-upward"></u-icon>
						<text v-show="cate.current_num == 1 && item.type !=='food' && childChooseArrLength >= 2">(高)</text>
						<text v-show="cate.current_num == 2 && item.type !=='food' && childChooseArrLength >= 2">(中)</text>
						<text v-show="cate.current_num == 3 && item.type !=='food' && childChooseArrLength >= 2">(低)</text>
					</view>
				</view>				
			</view>
		</view>
		
		<sPullScroll
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
							<image width="100%" height="100%" v-if="!food.imgurl" src="/otherPages/static/img/none.png"></image>
							<image width="100%" height="100%" v-else :src="food.imgurl"></image>
						</view>
						
						<view class="textbox">
							<view class="title-food">
								{{ food[searchArg.wordKey.title] }}								
							</view>							
							<!-- <view class="food-utis">
								<text class="number" style="margin-right: 5px;">{{ food[searchArg.wordKey.energy] }}千卡</text>
								<text class="utis">/{{ food[searchArg.wordKey.unitNum] + food[searchArg.wordKey.unit] }}</text>
							</view> -->
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
		</sPullScroll>
	</view>
</template>

<script>
	import sPullScroll from '@/otherPages/components/s-pull-scroll';
	export default {		
		name:'bx-filtrate',
		components: {
			sPullScroll,
		},
		props:{
			childChooseArr:{
				type:Array,
				default:()=>{
					return []
				}
			},
			menuAgList:{
				type:Array,
				default:()=>{
					return []
				}
			},
			searchArg:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data(){
			return {
				childChooseArrLength:0,
				heightStyle: 'calc(100vh-200upx)',
				isShowMyList:false,
				topNum:440,
				foodList:[],
				lockEledata: null,
				isLoad:false,
				order: '',
				modalName:'',
				pageInfo: {
					total: 0,
					rownumber: 20,
					pageNo: 1
				},
				condObj:null,
				classifyCond:null,
				copyData:[]
			}
		},
		watch: {
			childChooseArr(newValue, oldValue){
				this.childChooseArrLength = newValue.length
			}
				
		},
		mounted() {
			// this.getFoodsList()
			if(this.menuAgList){
				this.copyData = this.deepClone(this.menuAgList)
			}
			this.onRefresh()
		},
		methods:{
			/* 顶部菜单点击**/
			chooseMenu(parent,child){
				this.$emit('clickMenu',parent,child)
				this.pageInfo.pageNo = 1
				if(child.value!='不限' && child.value != 'default'){
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
									// this.onRefresh()
								}
							})
						}
					})				
				}				
				if(parent.type == 'subclass') {
					// this.searchArg.serviceName = 'srvhealth_diet_contents_select'
					if(child.value === '全部'){
						this.condObj = null
						this.classifyCond = null
						this.getFoodsList()
					}else{
						let cond = {
							colName:parent.colunn,
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
					this.childChooseArr = childChooseArr
					this.order = order
					this.condObj =this.classifyCond?this.classifyCond:condOrder
				}
				// }
				this.onRefresh();
				console.log("parent:",parent,"child",child)
			},
			/*点击顶部标签**/
			tagClick(item){
				this.$emit('clickTag',item)
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
			/*点击食物**/
			chooseFood(item){
				this.$emit('clickFood',item)
			},
			/*点击底部出现得新增**/
			tofeedback(){
				console.log("点击新增----")
				// this.$emit('clickFeedBack',item)
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
				}, 200);
			},
			loadData(pullScroll) {
				console.log('上拉加载');
				let page = this.pageInfo;
				this.pageInfo.pageNo = pullScroll.page;
				console.log(pullScroll.page);
				this.getFoodsList(this.order, this.condObj);
			},
			async getFoodsList(order = null, cond = null, type = null,serviceName=null) {				
				let self = this;
				let url = this.getServiceUrl('health', serviceName?serviceName:this.searchArg.serviceName, 'select');
				let req = {
					serviceName: serviceName?serviceName:this.searchArg.serviceName,
					colNames: ['*'],
					relation_condition: {
						relation: 'OR',
						data: []
					},
					page: {
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
		}
	}
</script>

<style scoped lang="scss">
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
