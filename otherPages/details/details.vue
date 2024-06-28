<template>
  <view class="details-view">
    <view class="details-tit">
      {{detailsForm.node_name||detailsForm.expert_name||''}}
      <text class="circle-btn" @click="toSpeech">听</text>
    </view>
    <view class="details-msg">
      <view class="author" v-if="detailsForm.author">
        作者：<text>{{detailsForm.author || '-'}}</text>
      </view>
      <!--    <view class="author" v-if="detailsForm.expert_name">
        姓名：<text>{{detailsForm.expert_name || '-'}}</text>
      </view> -->
      <view class="publish" v-if="detailsForm.author">
        发布：<text>{{detailsForm.create_time}}</text>
      </view>
      <view class="publish" v-if="detailsForm.expert_title">
        职称/标签：<text>{{detailsForm.expert_title}}</text>
      </view>
    </view>
    <view class="padding-tb" v-if="detailsForm.expert_expertise">
      <div style="width: 100%;" v-html="detailsForm.expert_expertise" disabled placeholder="" />
    </view>
    <div class="richText" v-if="detailsForm.node_desc" ref="richText">
      <!-- <rich-text :nodes="detailsForm.contents"></rich-text> -->
      <u-parse :html="detailsForm.node_desc" :selectable="true" :tag-style="style"></u-parse>
    </div>
    <view class="richText" v-else>
      <!-- <rich-text :nodes="detailsForm.contents"></rich-text> -->
      <image :src="detailsForm.coverFileName" mode=""></image>
    </view>
    <!-- 		<view class="look-over">
			<uni-icons type="eye" size="30"></uni-icons>
			<view class="look-tit" style="margin-right: 200rpx;">浏览量（333）</view>
			<uni-icons type="star" size="30" :color="sc == 2 ? '#faa51b' : ''" v-if="sc == 1" @click="scang(2)"></uni-icons>
			<uni-icons type="star" size="30" :color="sc == 2 ? '#faa51b' : ''" v-else @click="scang(1)"></uni-icons>
			<view class="look-tit" style="margin-right: 40rpx;" v-if="sc == 1" @click="scang(2)">收藏</view>
			<view class="look-tit" style="margin-right: 40rpx;" v-else @click="scang(1)">已收藏</view>
			<uni-icons type="redo" size="30"></uni-icons>
			<view class="look-tit">分享</view>
		</view> -->
    <!-- <view style="margin: 20rpx 0;">相关推荐
		</view>
		<view class="recommend">
			<view class="recommend-item" v-for="item in list">
				<img class="recommend-img" src="../../static/img/tuijian.jpg" alt="">
				<view class="recommend-tit">
					糖尿病会造成急性或慢性并发症
				</view>
			</view>
		</view> -->
    <!-- <view class="review">
			<view class="review-top">
				<view class="review-left">
					评论（344）
				</view>
				<view class="review-icon">
					<uni-icons type="compose" size="30"></uni-icons>
				</view>
				<view class="review-right">
					参与评论
				</view>
			</view>
			<view class="review-list" v-for="i in 4">
				<img class="review-img" src="http://139.224.68.50:9017/file/18114b7680374a7b806e962aea7859b7.jpg"
					alt="">
				<view class="content">
					<view class="content-top">
						<view class="user-name">
							微信用户
						</view>
						<view class="review-time">
							2023-10-10
						</view>
					</view>
					<view class="review-content">
						金秋的阳光温馨安静，金秋的微风和煦温柔，金秋的蓝天白云飘逸，金秋的田野遍地金黄。在这个硕果累累的季节
					</view>
				</view>
			</view>
		</view> -->
  </view>
</template>

<script>
  import uParse from '@/components/u-parse/u-parse.vue'
  // import * as topNewsList from '../../common/api/topNewsList.js'
  // import * as me from '../../common/api/me.js'
  import Speech from "speak-tts";
  export default {
    components: {
      uParse
    },
    data() {
      return {
        classify: "",
        uid: '',
        list: [1, 2, 3, 4],
        detailsForm: {
          titleName: ''
        },
        style: {
          // 字符串的形式
          img: 'display: block;',
          video: 'display: block;width:670rpx;'
        },
        sc: 1,
        speech: null,
      };
    },
    onLoad(e) {
      this.classify = e.classifyName
      // this.uid = e.uid
      this.getData(e.id)
      this.SpeechInit()
    },
    methods: {
      SpeechInit() {
        this.speech = new Speech();
        this.speech.setLanguage("zh-CN");
        this.speech.init().then(() => {});
      },
      //播放按钮
      play(data) {
        this.speech
          .speak({
            text: data,
            listeners: {
              //开始播放
              onstart: () => {
                console.log("Start utterance");
              },
              //判断播放是否完毕
              onend: () => {
                console.log("End utterance");
              },
              //恢复播放
              onresume: () => {
                console.log("Resume utterance");
              },
            },
          })
          .then(() => {
            console.log("读取成功");
          });
      },
      //暂停
      paused() {
        this.speech.pause();
      },
      //从暂停处继续播放
      goahead() {
        this.speech.resume();
      },
      //点击播放按钮
      setdefaultWordData(data) {
        this.play(data)
      },
      // 收藏或已收藏
      // scang(type){
      // 	let param = {}
      // 	if(type == 1){
      // 		param = {
      // 			uid:this.detailsForm.collectId
      // 		};
      // 	}else{
      // 		param = {
      // 			type:2,
      // 			openId:uni.getStorageSync('openid_key'),
      // 			targetId:this.uid
      // 		};
      // 	}

      // 	me.collectInsert(param).then(res => {
      // 		if(res.data.code == 200){
      // 			this.sc = type
      // 			this.getData();
      // 		}
      // 	})
      // },
      toSpeech() {
        const richText = this.$refs.richText;
        let text = richText.innerText;
        // let textArr = text.split('。')
        // this.setdefaultWordData('微信到账100元')
        const synth = window.speechSynthesis;
        synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
        // setTimeout(()=>{
        //   const utterance = new SpeechSynthesisUtterance(text);
        //   synth.speak(utterance);
        // },300)
    
      },
      getData(id) {
        const serviceMap = {
          '中医健康科普专家': 'srvhealth_chinese_medicine_expert_select',
          '中医历史与文化': 'srvhealth_knowledge_node_select'
        }
        const url = this.getServiceUrl('health', serviceMap[this.classify], 'select');
        // const url = `/health/select/srvhealth_knowledge_node_select`
        const req = {
          "serviceName": serviceMap[this.classify],
          "colNames": ["*"],
          "condition": [{
            "colName": "id",
            "value": id,
            "ruleType": "eq"
          }],
          "page": {
            "pageNo": 1,
            "rownumber": 1
          }
        }
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            if (res?.data?.data?.length) {
              this.detailsForm = res.data.data[0]
              if (this.detailsForm.node_name || this.detailsForm.expert_name) {
                uni.setNavigationBarTitle({
                  title: this.detailsForm.node_name || this.detailsForm.expert_name
                })
              }
            }
          }
        })

        // let param = {
        // 	uid: this.uid,
        // 	openId:uni.getStorageSync('openid_key')
        // }
        // topNewsList.queryById(param).then(res => {
        // 	this.detailsForm = res.data.data
        // 	this.sc = res.data.data.collectId == null ? 1 : 2;
        // }).catch(error => {
        // 	console.log(error)
        // })
      }
    }
  }
</script>

<style scoped lang="scss">
  .details-view {
    padding: 50rpx 20rpx;

    .details-tit {
      text-align: center;
      font-size: 40rpx;
      position: relative;

      .circle-btn {
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        border: 1px solid #333;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        right: 24px;
        cursor: pointer;

        &:active {
          transform: translate(1px, 1px);
        }
      }
    }

    .details-msg {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      margin-top: 30rpx;
    }

    .look-over {
      display: flex;
      font-size: 24rpx;
      line-height: 40rpx;
      margin: 20rpx 0;

      .look-tit {
        margin-bottom: 10rpx;
      }

      .uni-icons {
        font-size: 24rpx;
      }
    }

    .recommend {
      width: 710rpx;
      display: flex;
      gap: 40rpx;
      overflow-x: scroll;

      .recommend-item {
        width: 200rpx;

        .recommend-img {
          width: 200rpx;
          height: 140rpx;
          border-radius: 20rpx;
        }

        .recommend-tit {
          width: 200rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

    }

    .review {
      width: 710rpx;
      margin-top: 40rpx;

      .review-top {
        position: relative;
        height: 80rpx;

        .review-left {
          position: absolute;
          left: 0;
        }

        .review-icon {
          position: absolute;
          top: -16rpx;
          right: 160rpx;
        }

        .review-right {
          position: absolute;
          right: 0;
        }
      }

      .review-list {
        display: flex;
        gap: 20rpx;
        margin-bottom: 40rpx;

        .review-img {
          width: 80rpx;
          height: 80rpx;
          border-radius: 40rpx;
        }

        .content {
          width: 580rpx;

          .content-top {
            position: relative;
            height: 60rpx;
            width: 580rpx;

            .user-name {
              position: absolute;
              left: 0;
            }

            .review-time {
              position: absolute;
              right: 0;
            }
          }

          .review-content {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }
    }
  }

  .richText {
    margin: 20rpx auto;
    // width: 670rpx;
    padding: 0 20rpx;
  }

  video {
    display: block;
    margin: 20rpx auto;
    width: 710rpx;
  }
</style>