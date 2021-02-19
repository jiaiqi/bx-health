<template>
	<view class="wrap">
		<view class="cu-form-group ">
			<view class="title">体重(公斤)</view>
			<input v-model="weight" placeholder="请输入你的体重" name="input"></input>
		</view>
		<view v-if="imglistIndex == 1" class="cu-form-group">
			<view class="title">时间长度(分钟)</view>
			<input v-model="timeLength" placeholder="请输入你活动的时间" name="input"></input>
		</view>
		<view v-else class="cu-form-group">
			<view class="title">运动距离(公里)</view>
			<input v-model="distance" placeholder="请输入你运动的距离" name="input"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">活动类型</view>
			<view class="list-wrap">
				<view class="fenlei">
					<view class="card"  :class="imglistIndex==index?'checkSty':''"   v-for="(item,index) in sportType " @click="typesele(index)">
						<image class="sportImg" :src="item.cover" mode=""></image>
						<view class="titles">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="boxbtn">
			<view class=" btns" :class="!isCountBtn?'not-count':''"  @click="calculate">计算</view>
		</view>
		
		
		
		<view v-if="mask" class="poupbox">
			<view class="mask" v-if="mask"></view>
			<view class="boxpou" v-if="mask">
				<view class="contents">
					<view class="titlec">活动消耗卡路里</view>
					<view class="nubox">
						<view class="number">{{result?(result/1000).toFixed(2):0}}kcal</view>
					</view>	
				</view>
				<view class="contYes">
					<view class="btn concel" @tap="confirm">重新计算</view>
					<view class="btn" @tap="cancel">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>
   
<script>
	export default{
		data(){
			return{
				weight:null,
				timeLength:null,
				result:null,
				distance:null,
				sportType:[
					{
						cover:'/static/img/pb.jpg',
						title:'慢跑'
					},
					{
						cover:'/static/img/yy.jpg',
						title:'游泳'
					},
					{
						cover:'/static/img/lg.jpg',
						title:'遛狗'
					},
					{
						cover:'/static/img/qt.jpg',
						title:'其他'
					}
				],
				imglistIndex:0,
				mask:false
			}
		},
		computed:{
			isCountBtn(){
				if(this.imglistIndex !=1 && this.weight && this.distance){
					return true
				} else if(this.imglistIndex ==1 && this.weight && this.timeLength){
					return true
				}
				else{
					return false
				}
			}
		},
		methods:{
			typesele(val){
				if(this.imglistIndex != val){
					this.weight=null
					this.timeLength=null
					this.distance=null
				}
				this.imglistIndex=val
				
			},
			calculate(){				
				if(!this.isCountBtn) return 							
					this.mask = true;
					let weight = this.weight
					let distance = this.distance
					let currIndex = this.imglistIndex
					let timeLength = this.timeLength
					if(currIndex === 0){						
						this.result = Number(weight) * Number(distance) * 1.036
					} else if(currIndex === 1){
						this.result = Number(weight) * 4.8 * (Number(timeLength)/60) * 1.05
					}else if(currIndex === 2){
						this.result = Number(weight) * Number(distance) * 0.937
					}
					else if(currIndex === 3){
						this.result = Number(weight) * Number(distance) * 0.762
					}
					console.log("11111111")				
			},
			cancel(){
				this.mask = false;
			},
			confirm(){
				this.mask = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		background-color: #fff;
		min-height: 100vh;
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
			margin: 5px auto 0;
			height: 40px;
			width: 90%;
			background:linear-gradient(to right, #5184ef, #348ef1);
			font-size: 16px;
			color: #ffffff;
			text-align: center;
			line-height: 40px;
			border-radius: 30px;
		}
		.not-count{
			background: #b5b5b5;
		}
	}
	.checkSty{
		 box-shadow: 0 2px 10px 0 #c1dbfc !important;
		color:#3287f3 !important;
		background-color: #e1edfe !important;
	}
	.poupbox {
		.mask {
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 888;
		}
		.boxpou {
			z-index: 999;
			width: 88%;
			max-height:400upx;
			min-height: 300upx;
			// box-shadow: 0px 2px 6px 0px #d6d4d4;
			position: fixed;
			background: #ffffff;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			border-radius: 5px;
			animation: 0.3s opacity2;
			.contents{
				padding: 50upx;
				.titlec{
					text-align: center;
					font-size: 36upx;
					font-weight: bold;
				}
				.nubox{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 48upx;
					.number{
						font-size: 60upx;
						font-weight: bold;
						color: #e85350;
					}
					image{
						display: inline-block;
						width: 80upx;
						height: 80upx;
					}
				}
			}
			.contentpop {
				height: 600upx;
				overflow: scroll;
			}
	
			.select {
				width: 100%;
				text-align: center;
				font-size: 34upx;
				line-height: 80upx;
			}
	
			.contYes {
				display: flex;
				justify-content: space-around;
				position: absolute;
				bottom: 0;
				width: 100%;
				.btn {
					width: 50%;
					text-align: center;
					color: rgb(0, 122, 255);
					border-top: 1px solid #d5d5d6;
					line-height: 100upx;
					font-weight: bold;
				}
				.concel {
					border-right: 1px solid #d5d5d6;
				}
			}
		}
	}
	@keyframes opacity2 {
		0% {
			opacity: 0;
		}
	
		50% {
			opacity: 0.5;
		}
	
		100% {
			opacity: 1;
		}
	}
</style>