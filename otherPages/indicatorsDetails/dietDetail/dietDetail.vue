<template>
	<view class="diet-wrap">
		<view class="picker">
			<picker class="date-picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">
					<text class="u-margin-10">{{ date }}</text>
					<!-- <u-icon name="arrow-down-fill" color="#333" size="28"></u-icon> -->
					<text class="cuIcon-triangledownfill" color="#333" size="28"></text>
				</view>
			</picker>
		</view>
		<view class="quantity">
			<view class="text-box">
				<view class="number">75.00</view>
				<view class="unit">公斤</view>
			</view>
		</view>
		<view class="cuIcon-time currentTime">18:03</view>
		<view class="footer">
			<view class="left-box" v-for="(item,index) in dataItem" :key="index">
				<view class="controlStyle">
					<image class="left_icon" :src="item.img" mode=""></image>
					<view class="left_content">
						<view class="title">{{item.title}}</view>
						<view class="detail">
							<view class="">{{item.number}}</view>
							<image v-if="item.icon" :src="item.icon" mode=""></image>
							<text class="units" v-if="item.units">{{item.units}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				date: '',
				dataItem:[
					{
						img:require('@/otherPages/static/img/t2Detail.png'),
						title:'身高体重指标',
						number:'24.5',
						icon:require('@/otherPages/static/img/failDetail.png'),
						units:''
					},
					{
						img:require('@/otherPages/static/img/t1Detail.png'),
						title:'建议体重',
						number:'65.08',
						icon:'',
						units:'公斤'
					}
				]
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
		
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		},
		created() {
			this.date = this.formateDate(new Date(), '年月日');
		},
	}
</script>

<style scoped lang="scss">
	.diet-wrap{
		.picker {
			display: flex;
			justify-content: center;
			height: 100rpx;
			padding-top: 50upx;
			align-items: center;
		}
		.quantity{
			height: 320upx;
			display: flex;
			justify-content: center;
			align-items: center;
			.text-box{
				display: flex;
				align-items: flex-end;
				.number{
					font-size: 60upx;
					font-weight: bold;
				}
				.unit{
					font-size: 22upx;
					font-weight: bold;
					line-height: 44upx;
				}
			}
		}
		.currentTime{
			font-size: 26upx;
			font-weight: bold;
			color: #ef751f;
			text-align: center;
		}
		.footer{
			display: flex;
			align-items: center;
			margin: 0 10px 5px;
			padding: 55upx 30upx;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
			margin-top: 60upx;
			.left-box:nth-child(odd){
				border-right: 1upx solid #EEEEEE;
				padding-right:30upx ;
			}
			.left-box:nth-child(even){
				padding-left:30upx ;
			}
			.left-box{
				width: 50%;
				display: flex;
				align-items: center;
				image{
					border-radius: 50%;
				}
				.controlStyle{
					display: flex;
					align-items: center;
					margin: 0 auto;
				}
				.left_icon{
					display: inline-block;
					height: 80upx;
					width: 80upx;
					margin-right: 20upx;
				}
				.left_content{
					.title{
						font-size: 24upx;
						font-weight: bold;
						color: #737373;
					}
					.detail{
						font-size: 38upx;
						font-weight: bold;
						display: flex;
						align-items: center;
						image{
							display: inline-block;
							width: 40upx;
							height: 40upx;
							margin-left: 16upx;
						}
						.units{
							font-size: 15px;
						}
					}
				}
			}
		}
	}
	.cuIcon-time:before{
		    margin-right: 8upx
	}
	::v-deep.u-margin-10{
		font-weight: bold;
		color: #7d7c7c;
	}
</style>
