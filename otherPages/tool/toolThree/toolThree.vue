<template>
	<view class="wrap">
		<view class="cu-form-group margin-top">
			<view class="title">年龄(月/岁)</view>
			<input placeholder="请选择婴儿年龄查询" @click="show = true" v-model="age" name="input"></input>
		</view>
		<!-- <u-select v-model="show"  :list="merchantList" @confirm="confirmMerchant"></u-select> -->
		<view class="footerbg">
			<!-- <image src="/static/img/ber.png" mode=""></image> -->
		</view>
		<!-- <view class="boxbtn">
			<view class=" btns"  @click="calculate">计算</view>
		</view> -->
		<view class="target" v-if="age">
			<view class="">
				标准体重：
				<text>{{userinfor.weight}}kg</text>
			</view>
			<view class="">
				标准身高：
				<text>{{userinfor.height}}cm</text>
			</view>
			<view class="">
				乳牙（颗）：
				<text>{{userinfor.Numtooth>0?userinfor.Numtooth:0}}颗</text>
			</view>
			<view class="">
				动作语言发育：
				<text>{{userinfor.tooth?userinfor.tooth:'暂无'}}</text>
			</view>
		</view>
		</view>
	</view>
</template>
   
<script>
	export default{
		data(){
			return{
				merchantList:[
					{
						value: '1',
						label: '1个月',
						extra:'xxx'
					},
					{
						value: '2',
						label: '2个月',
						extra:'可以扶坐或侧卧时能勉强抬头，始发喉音，会笑。'
					},
					{
						value: '3',
						label: '3个月',
						extra:'扶着两手或者髋骨时能坐，能握持玩具，能咿呀发音。'
					},
					{
						value: '4',
						label: '4个月',
						extra:'能发出笑声。'
					},
					{
						value: '5',
						label: '5个月'
					},
					{
						value: '6',
						label: '6个月'
					},
					{
						value: '7',
						label: '7个月'
					},
					{
						value: '8',
						label: '8个月'
					},
					{
						value: '9',
						label: '9个月'
					},
					{
						value: '10',
						label: '10个月'
					},
					{
						value: '11',
						label: '11个月'
					},
					{
						value: '12',
						label: '12个月'
					},
					{
						value: '13',
						label: '2岁'
					},
					{
						value: '14',
						label: '3岁'
					},
					{
						value: '15',
						label: '4岁'
					},
				],
				show:false,
				mask:false,
				age:'',
				userinfor:{
					weight:'',
					height:'',
					tooth:'',
					Numtooth:''
				}
			}
		},
		methods:{
			calculate(val){
				if(val<12){
					// 月
					this.userinfor.weight=(val+9)/2 //体重
					this.userinfor.height='50~75' //升高
					
				}else{
					// 岁
					this.userinfor.weight=8+2*val //体重
					this.userinfor.height=(val*5+75) //升高
				}
			},
			confirmMerchant(e){
				this.age =e[0].label
				this.userinfor.tooth =e[0].extra
				this.userinfor.Numtooth =Number(e[0].value)-4
				this.calculate(Number(e[0].value))
			},
			typesele(val){
				this.imglistIndex=val
			},
			cancel(){
				this.mask = false;
			},
		},
		computed:{
		
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		background: #fde9e8;
		min-height: 100vh;
		overflow: hidden;
		.target{
			margin-top: 40upx;
			padding: 0.5px 30upx;
			line-height: 60upx;
			font-weight: 600;
			color: gray;
			text{
			}
		}
		.title{
			color: #3287f3;
			font-size: 27upx;
			font-weight: bold;
		}
		.list-wrap{
			.fenlei{
				display: flex;
				flex-wrap: wrap;
				.card{
					width: 46%;
					background-color:#fff;
					margin-bottom: 4%;
					color: #454c54;
					.sportImg{
						height: 230upx;
						box-shadow:3px 7px 8px 1px rgba(0, 0, 0, 0.13);
						border-radius: 32upx;
					}
					border-radius: 32upx;
					box-shadow:0 4px 15px 0 rgba(0,0,0,.1);
					.titles{
						text-align:center;
						font-size: 32upx;
						font-weight: 700;
						padding: 8upx 0;
					}
				}
			}
			.fenlei>.card:nth-child(odd){
				margin-right:8%;
			}
		}
		input{
			height: 45px;
			border-radius: 8px;
			border: 2px solid #d9d9d9;
			// 
			display: block;
			width: 100%;
			padding: 5px 15px;
			font-size: 13px;
			font-weight: 600;
			color: #04244d;
			background-color: #fff;
			outline:none;
		}
	}
	::v-deep .cu-form-group+.cu-form-group{
		border: none;
	}
	::v-deep.cu-form-group uni-input .uni-input-input{
		border: none;
	}

	.boxbtn {
		width: 100vw;
		margin-top: 40upx;
		.btns {
			margin: 5px auto;
			height: 40px;
			width: 90%;
			background:linear-gradient(to right, #5184ef, #348ef1);
			font-size: 16px;
			color: #ffffff;
			text-align: center;
			line-height: 40px;
			border-radius: 30px;
		}
	}
	.checkSty{
		 box-shadow: 0 2px 10px 0 #c1dbfc !important;
		color:#3287f3 !important;
		background-color: #e1edfe !important;
	}
	
	.footerbg{
		image{
			height: 40vh;
			width: 50vw;
			position: absolute;
			bottom: 10vh;
			left: 25vw;
			    opacity: 0.14;
		}
	}
	.margin-top{
		margin-top: 200upx;
		background: #fde9e8;
	}
</style>