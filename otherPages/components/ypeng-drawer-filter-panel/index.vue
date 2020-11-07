<template>
	<view class="drawerWrap">
		<!-- 遮罩层 -->
		<view class="mask" v-if="filterShow && mask" @click.stop="maskClosable && onHideFilter()" @touchmove.stop.prevent="()=>{}"></view>
		<!-- 弹出层 -->
		<view class="popwrap" :class="[filterShow? 'show' : '', moveFrom]" @touchmove.stop="()=>{}" :style="{width : `${popWidth}rpx`}">
		   <view class="">
				<scroll-view class="sub-menu-list first"
				 :scroll-y="true" :scroll-into-view="'first_id'">
					<block v-for="(sub,index) in submenu" :key="index">
						<view class="sub-menu "  :class="{'on':index == idxSelect}"   :id="'first_id'+index" @tap="selectHierarchyMenu(sub,index)" >
							<view class="menu-name">
								<text>{{sub.name}}</text>
								<text class="iconfont selected"></text>
							</view>
						</view>
					</block>
				</scroll-view>
		   </view>

			<view style="width: 100%;">
				<view class="pop_body">
				    <view class="cateWrap" v-for="(filter, filterIndex) in newFilterList" :key="filter.type">
						<slot name="tit" v-bind="{filter, newFilterParams}"><view class="cateTit">{{filter.title}}<text class="texesty">
						{{filter.muti?'（多选）':'（单选）'}}</text></view></slot>
				        <view class="cateCon" :class="{'all' : !filter.disableAll}" >
				            <view class="cateItem" v-show="false" :class="{'on' : !(newFilterParams[filter.type] && newFilterParams[filter.type].length > 0)}" @click="onTapFilterItemAll({filterIndex},filter)" v-if="!filter.disableAll">不限</view>
							<view class="cateItem" v-for="(item, index) in filter.items" :class="{'on' : item.checked}" :key="item.name" @click="onTapFilterItem({muti : filter.muti, filterIndex, index})">{{item.name}}</view>
				        </view>
				    </view>
				</view>
				<view class="pop_foot">
				    <view class="" @click.stop="onResetFilter">重置</view>
				    <view class="" @click.stop="onSureFilter">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			filterShow : {
			    type : Boolean,
			    default : false,
			},
			
			moveFrom : {
				type : String,
				default : '',// 默认从右往左，可选值left
			},
			
			// 弹出框的宽度
			popWidth : {
				type : Number,
				default : 650
			},
			
			// 是否显示蒙层
			mask : {
				type : Boolean,
				default : true
			},
			
			// 能否通过蒙层关闭
			maskClosable : {
				type : Boolean,
				default : true
			},
			
			// filterList : {
			//     type : Array,
			//     default : [],
			// },
			
			// 传入的筛选条件
			submenu: {
			    type : Array,
			    default : [],
			},
			
		},

		data() {
			return {
				newFilterParams : {},
				newFilterList : [],
				idxSelect:0,
				filterParams:{},
				submenus:this.submenu,
				filterList:[],
				allSelectResult:[],
				leftMenu:''
			};
		},
		watch:{
			idxSelect(){
				this.filterList = this.submenus[this.idxSelect].filterList
				this.leftMenu = this.submenus[this.idxSelect].value
			}
		},
		mounted() {
			this.cq()
		},
		methods: {
			cq(){
				this.filterList = this.submenus[this.idxSelect].filterList
				this.leftMenu = this.submenus[this.idxSelect].value
				this.updateFilterList(this.filterParams)
			},
			selectHierarchyMenu(a,b){
				this.leftMenu=a.value
				if(this.newFilterParams.menu){
					this.allSelectResult.push(this.newFilterParams)
				}
				this.idxSelect = b
				if(this.allSelectResult.length>0){
					for(let i in this.allSelectResult){
						if(this.allSelectResult[i].menu==this.leftMenu){
							this.updateFilterList(this.allSelectResult[i])
						}else{
							this.updateFilterList(this.newFilterParams)
						}
					}
				}else{
					this.updateFilterList(this.newFilterParams)
				}
			},
			updateFilterList(filterParams){
				this.filterList = this.submenu[this.idxSelect].filterList
				const newFilterList = this.filterList.map(filter => {
					const items = filter.items.map((item, index) => {
						const hasType = Object.keys(filterParams).includes(filter.type);
						if( filter.disableAll && (!hasType || !filterParams[filter.type].length) && index === 0){
							return {
								...item,
								checked : true,
							};
						};
						return {
							...item,
							checked : hasType && filterParams[filter.type].includes(item.value),
						}
					});
					return Object.assign({}, filter, {
						items
					});
				});
				
				this.newFilterList = newFilterList;
			},
			
			onTapFilterItem(e){
				const {
					filterIndex,
					index,
					muti,
				} = e;
				const curFilter = this.filterList[filterIndex];
				const newFilterParams = Object.assign({}, this.newFilterParams);
				
				// 多选
				if(muti){
					newFilterParams[curFilter.type] = newFilterParams[curFilter.type] || [];
					const hasValue = newFilterParams[curFilter.type].includes(curFilter.items[index].value);
					// 多选 - 已选择的情况
					if(hasValue){
						let i = newFilterParams[curFilter.type].length;
						while(i > 0){
							if(newFilterParams[curFilter.type][i-1] === curFilter.items[index].value){
								newFilterParams[curFilter.type].splice(i-1, 1);
							};
							i--;
						};
	
						if(!newFilterParams[curFilter.type].length){
							curFilter.disableAll? newFilterParams[curFilter.type] = [curFilter.items[0].value] : delete newFilterParams[curFilter.type];
						};
	
					}else{
						// 多选 - 未选择的情况
						newFilterParams[curFilter.type].push(curFilter.items[index].value);
					};
				}else{// 单选
					newFilterParams[curFilter.type] = newFilterParams[curFilter.type] || [];
					const hasValue = newFilterParams[curFilter.type].includes(curFilter.items[index].value);
	
					// 单选 - 已选择的情况
					if(hasValue){
						curFilter.disableAll? newFilterParams[curFilter.type] = [curFilter.items[0].value] : delete newFilterParams[curFilter.type];
					}else{
						// 单选 - 未选择的情况
						newFilterParams[curFilter.type] = [curFilter.items[index].value];
					};
					
				};
	
				newFilterParams['menu']=this.leftMenu
				this.updateFilterList(newFilterParams)
				this.newFilterParams = newFilterParams;
			},
	
			onTapFilterItemAll(e,item){
				const {
					filterIndex,
				} = e;
				// let dataitem = item.items
				// for(let i in dataitem){
				// 	// this.$set(dataitem[i],'checked',false)
				// 	dataitem[i].checked =false
				// }
				const newFilterParams = Object.assign({}, this.newFilterParams);
				const curType = this.filterList[filterIndex].type;
				const hasType = Object.keys(newFilterParams).includes(curType);
	
				if(hasType) delete newFilterParams[curType];
	
				this.newFilterParams = newFilterParams;
				
			},
	
			onResetFilter(){
				// this.newFilterParams = JSON.parse(JSON.stringify(this.filterParams_static));
				// this.$emit('resetFilter', { filterParams : this.newFilterParams });
				this.idxSelect =0
				this.allSelectResult=[]
				this.newFilterParams = {}
				this.cq()
			},
	
			onSureFilter(){
				this.allSelectResult.push(this.newFilterParams)
				console.log(this.newFilterParams)
				// for(let i in  this.allSelectResult){
				// 	if(this.allSelectResult)
				// }
				let arr = this.allSelectResult
				for (var i = 0; i < arr.length - 1; i++) {
				    for (var j = i + 1; j < arr.length; j++) {
				        if (arr[i].menu == arr[j].menu) {
				            arr.splice(j, 1);
				            j--;
				        }
				    }
				}
				let itemdata = arr[arr.length-1]
				this.$emit('sureFilter', { allSelectResult : this.newFilterParams });
			},
	
			onHideFilter(){
				this.$emit('hideFilter');
			},
		}
		
	}
</script>

<style lang="scss">
.drawerWrap{}

.mask{position: fixed;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;z-index: 100;background: rgba(0, 0, 0, .2);overflow: hidden;top: calc(var(--window-top));}
.popwrap{
	display: flex;
	position: fixed;right: 0;bottom: 0;z-index: 110;background: #fff;width: 560rpx;transform: translateX(100%);transition: transform ease .2s;top: 90upx;border-left: 2rpx solid #E6E9EC;box-shadow: 0 -1rpx 6rpx 0 rgba(165,180,197,.5);
	&.left{right: auto;left: 0;transform: translateX(-100%);border-right: 2rpx solid #E6E9EC;}
	&.show{transform: translateX(0);}
	.pop_body{overflow-y: auto;padding-bottom: 120rpx;height: 100%;box-sizing: border-box;}
	.pop_foot{position: absolute;left: 0;right: 0;bottom: 0;height: 90rpx;line-height: 90rpx;font-size: 32rpx;color: #4A90E2;display: flex;justify-content: center;align-items: center;background: #fff;border-top: 1rpx solid #E6E9EC;box-shadow: 0 -1rpx 6rpx 0 rgba(165,180,197,.5);
		view{flex: 1;display: flex;justify-content: center;align-items: center;
			&:first-child{border-right: 1rpx solid #E6E9EC;}
		}
	}
	 .cateWrap{padding: 30rpx;margin: 30rpx 0;font-size: 28rpx;border-bottom: 1rpx solid #E6E9EC;
		.cateTit{color: #000;font-weight: bold;}
		.cateCon{position: relative;padding-left: 40rpx;
			&.all{padding-left: 20rpx;
				.cateItem:first-child{position: absolute;left: 0;}
			}
		}
		.cateItem{margin: 10rpx;margin-left: 0;padding: 0 15rpx;line-height: 46rpx;border-radius: 23rpx;display: inline-block;
			&.on{background: #3C67DF;color: #fff;}
		}
	 }
}
.sub-menu-list {
		width: 100%;
		// height: 345px;
		padding-bottom: 120upx;
		height: 100%;
		overflow-y: scroll;
		flex-direction: column;
		.sub-menu {
			min-height: 44px;
			font-size: 13px;
			flex-direction: column;
			padding-right: 15px;
			>.menu-name {
				height: 44px;
				line-height: 44px;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				>.iconfont {
					display: none;
					font-size: 18px;
					color: #ec652b;
				}
			}
		}
		&.first {
			flex-shrink: 0;
			width: 236rpx;
			background-color: #f0f0f0;
			.sub-menu {
				padding-left: 15px;
	
				&.on {
					background-color: #fff;
				}
			}
		}
		&.alone {
			max-height: 345px;
			min-height: 170px;
			height: auto;
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #e5e5e5;
	
				&.on {
					color: #ec652b;
	
					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
			}
		}
		&.not-first {
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #e5e5e5;
				>.menu-name {
					height: calc(44px - 1rpx);
					>.iconfont {
						display: none;
						font-size: 18px;
						color: #ec652b;
					}
				}
				&.on {
					color: #ec652b;
					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
				.more-sub-menu {
					flex-direction: row;
					flex-wrap: wrap;
					padding-bottom: 9px;
					>text {
						height: 30px;
						border-radius: 3px;
						background-color: #f5f5f5;
						color: #9b9b9b;
						margin-bottom: 6px;
						margin-right: 6px;
						text-align: center;
						line-height: 30px;
						border: solid #f5f5f5 1rpx;
						flex: 0 0 calc(33.33% - 6px);
						overflow: hidden;
						font-size: 12px;
						&:nth-child(3n) {
							margin-right: 0;
						}
						&.on {
							border-color: #f6c8ac;
							color: #ec652b;
						}
						.iconfont {
							color: #9b9b9b;
						}
					}
				}
			}
		}
	}
	.texesty{
		color: #a9a6a6;
		font-weight: 100;
		font-size: 25upx;
	}
</style>
