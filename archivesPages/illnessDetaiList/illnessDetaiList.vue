<template>
	<view class="content">
		<view class="listBox" v-for="(item,index) in list" :key="index">
			<view class="topbox">
				<image class="bgImg" :src="item.img"  mode=""></image>
				<view class="rightText">
					<view class="title">{{item.title}}
						<text style="color: #ff9900;font-size: 13px;margin-left: 15rpx;">[{{item.office}}]</text>
						<text style="">
							
						</text>
					</view>  
					<view class="detail">{{item.detail}}</view>
				</view>
			</view>
			<view class="correlation">
				相关症状：{{item.symptom}}
			</view>
			
			<view class="bottomSty">
				<view class="">患病几率：</view>
				<view class="flex  pressline" style="display: flex;align-items: center;">
					<view class="cu-progress round">
						<view :class="[estimate({id:item.possibility})]"
						:style="[{ width:item.possibility?(item.possibility+'%'):'0'}]"
						>
						</view>
					</view>
					<text class="margin-left">{{item.possibility+'%'}}</text>
				</view>
			</view>
			
		</view>
	
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[
					{
						img:'http://xs3.op.xywy.com/api.iu1.xywy.com/jib/20160509/36574546bfd678b3c40141e9cbf610b363543.jpg',
						title:'跟痛症',
						possibility:'95',
						office:'外科',
						detail:'跟痛症是以足跟疼痛为主，由外伤、劳损、足跟部某种疾病引起的，跟骨骨膜及周围纤维组织损伤造成的无菌性炎症，是一种常见的慢性损伤性疾病，好发于40岁以上的中、老年人。',
						symptom:'脚后跟长骨刺、足跟痛'
					},
					{
						img:'http://xs3.op.xywy.com/api.iu1.xywy.com/jib/20161019/83fe739beb4473a58d243b561196f96c29066.jpg',
						title:'骨膜炎',
						possibility:'80',
						office:'外科',
						detail:'骨膜炎是由于骨膜及骨膜血管扩张、充血、水肿或骨膜下出血，血肿机化，骨膜增生及炎症性改变造成的应力性骨膜损伤或化脓性细菌侵袭造成的感染性骨膜损伤。1)',
						symptom:'充血、骨气臌、骨痛、踝部凹陷性水肿、脚外侧疼、弥漫性骨膜增厚'
					},
					{
						img:'http://xs3.op.xywy.com/api.iu1.xywy.com/jib/20160509/e41ed4daff5db6413730f19d440c7f5752320.jpg',
						title:'惊恐症',
						office:'精神科',
						possibility:'60',
						detail:'所谓的惊恐障碍简称惊恐症，是以反复出现显著的心悸，出汗、震颤等自主神经症状，伴以强烈的濒死感或失控感，害怕产生不幸后果的惊恐发作为特征的一种急性焦虑障碍。',
						symptom:'不真实感、代脉、气短、强迫恐怖症、无用感、胸闷、晕厥'
					},
					{
						img:'http://xs3.op.xywy.com/api.iu1.xywy.com/jib/20160509/ae78ea40d4a36d6baad4b912987aece697648.jpg',
						title:'股神经痛',
						office:'内科',
						possibility:'40',
						detail:'股神经痛也称为Wassermann征，多因股神经及分支损伤引起。股神经痛疼痛时做热敷和揉捏痛处不能减轻疼痛程度，则股神经痛可以排除。该病表现特殊步态。',
						symptom:'步态异常、感觉障碍、皮肤青紫色改变'
					},
					{
						img:'http://xs3.op.xywy.com/api.iu1.xywy.com/jib/20160509/f43eb06ff60c2bc78bf49f2613607447972.jpg',
						title:'生殖细胞瘤',
						office:'肿瘤科',
						possibility:'40',
						detail:'生殖细胞瘤由原始的生殖细胞衍生而来，好发于松果体区，其次为鞍上池。肿瘤多发生于男性青少年，位于鞍上生殖细胞瘤则以女性多见。生殖细胞瘤对放射线非常敏感。',
						symptom:'尿崩、视力障碍、嗜睡、头痛并呕吐'
					},
				]
			}
		},
		methods:{
			estimate(val){
				let valNum = Number(val.id)
				let className = '';
				if (valNum>=90){
					className='bg-red';
				}else if(valNum>=80){
					className='bg-pink';
				}else if(valNum>=70){
					className='bg-orange';
				}else if(valNum>=60){
					className='bg-yellow';
				}else if(valNum>=50){
					className='bg-mauve';
				}else{
					className='bg-olive';
				}
				
				 return className;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #fff;
		.listBox{
			padding: 25upx;
			border-bottom: 1px solid #eeeeee;
			.correlation{
				padding-top: 25rpx;
				overflow: hidden;
				  text-overflow: ellipsis;
				  display: -webkit-box;
				  -webkit-line-clamp: 2;
				  -webkit-box-orient: vertical;
				  
				      font-size: 27rpx;
				      color: #676767;
			}
			.topbox{
				display: flex;
				align-items: center;
				.rightText{
					border-bottom:1px solid #eeeeee;
					.title{
						font-size: 30upx;
					}
					.detail{
						overflow: hidden;
						  text-overflow: ellipsis;
						  display: -webkit-box;
						  -webkit-line-clamp: 2;
						  -webkit-box-orient: vertical;
						  color: #999;
						  font-size: 28rpx;
						  line-height: 45rpx;
						  padding-bottom: 10upx;
					}
				}
				.bgImg{
					flex-shrink: 0;
					height: 130rpx;
					    width: 200rpx;
					    padding-right: 22rpx;
				}
			}
		}
	}
	.cu-progress {
		height: 10rpx !important;
	}
	.pressline{
		    width: 80% !important; 
	}
	.bottomSty{
		display: flex;
		align-items: center;
		color: #676767;
		    margin-top: 10rpx;
	}
</style>
