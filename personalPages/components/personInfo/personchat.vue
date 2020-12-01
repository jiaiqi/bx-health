<template>
	<view class="person-chat-wrap">
		<!-- <cu-custom class="nav-chat-top" bgColor="#0bc99d" :isBack="true"><block slot="backText">返回</block><block slot="content">交流</block></cu-custom> -->
		<view class="person-chat-top" :style="{height:heightStyle}" :class="!doctor_no?'person-chat-top-w':'person-chat-top-w-h'">
			<scroll-view scroll-y="true" :style="{height:heightStyle}" :scroll-into-view="chatTextBottom">
				<view :id="`person-chat-item${index}`" v-for="(item,index) in recordList" :key="index" class="person-chat-item" :class="item.sender_account === currentUserInfo.user_no?'person-chat-item-my':''">
					<view v-if="doctor_no?item.sender_account === doctor_no : item.sender_account === userInfo.userno" class="person-chat-item-accept">
						<view class="person-chat-item-left">
							<image :src="userInfo.img_url?userInfo.img_url:'/personalPages/static/doctor_default.jpg'" mode=""></image>
						</view>
						<view @click="previewImages(item.img_url)" v-if="item.image && item.img_url" class="person-chat-item-right person-chat-item-right-image">
							<image :src="item.img_url" mode=""></image>
						</view>
						<view v-else-if="item.msg_content" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link?'person-chat-item-right-link':''">
							<text>{{item.msg_content}}</text>
						</view>
						<!-- <view v-else @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link?'person-chat-item-right-link':''">
							<text>{{item.msg_content?item.msg_content:item.msg_link}}</text>
						</view> -->
						<view v-else-if="item.msg_link && item.msg_content_type === '链接'" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link?'person-chat-item-right-link':''">
							<view class="link-left">
								<image src="../../static/links.png" mode=""></image>
							</view>
							<view class="link-right">
								<view v-if="item.quertion_name" class="link-right-item">
									<text>问卷记录</text>
									<text>{{item.quertion_name}}</text>
								</view>
								<view v-else-if="item.recode_num" class="link-right-item">
									<text>饮食记录</text>
									<text>时间：{{item.recode_num}}</text>
								</view>
							</view>
							<!-- <text>{{item.quertion_name?item.quertion_name:item.recode_num}}</text> -->
							<!-- <text>{{item.msg_link}}</text> -->
						</view>
						
						<view
							@tap="handleAudio(item)"
							v-else-if = "item.msg_link && item.msg_content_type === '语音'" 
							hover-class="contentType2-hover-class"
							class="content contentType2">
							<view class="voice_icon_left-wrap">
								<view class="">
									{{item.voice_time?item.voice_time:''}}
								</view>
								<view class="voice_icon voice_icon_left" :class="item.anmitionPlay?'voice_icon_left_an':''"></view>								
							</view>
							
						</view>
						
						<view
						@tap="openVideo(item)" 						
						v-else-if = "item.video && item.msg_content_type === '视频'" class="video_right_play">
							<!-- <text>视频</text> -->
							<video style="width: 250px;height: 200px;" id="myVideo" :src="item.video_url" controls></video>
						</view>
					</view>
					<view v-else-if="item.sender_account === currentUserInfo.user_no" class="person-chat-item-send">
						<text class="unread" v-if="item.msg_state === '未读'">{{item.msg_state}}</text>
						<view @click="previewImages(item.img_url)" v-if="item.image && item.img_url" class="person-chat-item-right person-chat-item-right-image">
							<image :src="item.img_url" mode=""></image>
						</view>
						<view v-else-if="item.msg_content" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link?'person-chat-item-right-link':''">
							<text>{{item.msg_content}}</text>
						</view>
						<view v-else-if="item.msg_link && item.msg_content_type === '链接'" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link?'person-chat-item-right-link':''">
							<view class="link-left">
								<image src="../../static/links.png" mode=""></image>
							</view>
							<view class="link-right">
								<view v-if="item.quertion_name" class="link-right-item">
									<text>问卷记录</text>
									<text>{{item.quertion_name}}</text>
								</view>
								<view v-else-if="item.recode_num" class="link-right-item">
									<text>饮食记录</text>
									<text>时间：{{item.recode_num}}</text>
								</view>
							</view>
							<!-- <text>{{item.quertion_name?item.quertion_name:item.recode_num}}</text> -->
							<!-- <text>{{item.msg_link}}</text> -->
						</view>
						
						<view 
							@tap="handleAudio(item)"
							v-else-if = "item.msg_link && item.msg_content_type === '语音'" 
							hover-class="contentType2-hover-class"
							class="content contentType2 content-type-right">
							<view class="voice_icon_right-wrap">
								<view class="voice_icon voice_icon_right" :class="item.anmitionPlay?'voice_icon_right_an':''"></view>
								<view class="">{{item.voice_time?item.voice_time:''}}</view>
							</view>
							
						</view>
						<view
						@tap="openVideo(item)" 
						v-else-if = "item.video && item.msg_content_type === '视频'" class="video_right_play">
							<!-- <text>视频</text> -->
							<video style="width: 250px;height: 200px;" id="myVideo" :src="item.video_url" controls></video>
						</view>
						<view @click="downloadfile(item)" v-else-if = "item.msg_content_type === '文件'" class="documents-wrap">
							<view class="documents-item">
								<view class="documents-item-left">
									<text>1125.docx</text>
								</view>
								<view class="documents-item-right">
									<image v-if="item.file_type && (item.file_type == 'docx' || item.file_type == 'doc')" src="/personalPages/static/word.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'xlsx'" src="/personalPages/static/excel.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'pdf'" src="/personalPages/static/pdf.png" mode=""></image>
								</view>
							</view>
						</view>
						<view class="person-chat-item-left">
							<image :src="currentUserInfo.headimgurl?currentUserInfo.headimgurl:'/personalPages/static/doctor_default.jpg'" mode=""></image>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="voice_an"  v-if="recording">
				<view class="voice_an_icon">
					<view id="one" class="wave"></view>
					<view id="two" class="wave"></view>
					<view id="three" class="wave"></view>
					<view id="four" class="wave"></view>
					<view id="five" class="wave"></view>
					<view id="six" class="wave"></view>
					<view id="seven" class="wave"></view>
				</view>
				<view class="text">{{voiceIconText}}</view>
			</view>
		</view>
		<view class="person-chat-bot" :class="doctor_no?'person-doctor-chat-bot':''">
			<view class="person-chat-bot-top">
				<view class="person-chat-left">
					<image @click="changeVoice('keyword')" v-if="currentVoiceType === 'voice'" src="../../static/voice.png" mode=""></image>
					<image @click="changeVoice('voice')" v-if="currentVoiceType === 'keyword'" src="../../static/keyboard.png" mode=""></image>
					<text 
					v-if="currentVoiceType === 'keyword'"
					class="voice_title"
					:style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"
					@touchstart.stop.prevent="startVoice"
					@touchmove.stop.prevent="moveVoice"
					@touchend.stop="endVoice"
					@touchcancel.stop="cancelVoice"
					
					>{{ voiceTitle }}</text>
					<input v-else @input="changeTest" v-model="chatText" type="text" value="" />
					<!-- <input v-if="!isSendLink" @input="changeTest" v-model="chatText" type="text" value="" /> -->
					<!-- <input v-else @input="changeTest" v-model="chatText" type="text" value="" /> -->
				</view>
				<view class="person-chat-rig">
					<view class="person-chat-rig-add-wrap">
						<view @click="openLink" v-if="!isFeed" class="person-chat-rig-add">
							<text class="lg text-gray" :class="'cuIcon-add'"></text>
						</view>					
					</view>
					
					<!-- <text @click="changeType('link')" v-if="!isFeed && current_type === 'world'">链接</text> -->
					<!-- <text @click="changeType('world')" v-if="!isFeed && current_type === 'link'">文字</text> -->
					<text class="send" @click="sendMessage" v-if="isFeed">发送</text>
				</view>
			</view>
			<view v-if="!isFeed && isSendLink" class="person-chat-bot-bot">
				<view class="person-chat-bot-bot-item-w">
					<view @click="openMenuPoup('question')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							问
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>问卷记录</text>
						</view>
					</view>
					<view @click="openMenuPoup('bite')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							饮
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>饮食记录</text>
						</view>
					</view>
					<view @click="openMenuPoup('photo')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							图
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>图片</text>
						</view>
					</view>
					<view @click="openMenuPoup('word')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							文
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>文档</text>
						</view>
					</view>
					<view @click="openMenuPoup('wx_word')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							文
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>微信文档</text>
						</view>
					</view>
					<view @click="openMenuPoup('video')" class="person-chat-bot-bot-item">
						<view class="person-chat-bot-bot-item-top">
							视
						</view>
						<view  class="person-chat-bot-bot-item-b">
							<text>视频</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="showBottom?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green" @click="confirmPoup">确定</view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl recode-poup">
					<!-- <bx-radio-group @change="radioChange">
						<bx-radio
							class="radio"
							color="#2979ff"
							v-for="(item,i) in recodeList"							
							:key="item.id"
							:name="item.activity_no?item.activity_no:item.hdate"
						>
							{{ item.title?item.title:item.hdate }}
						</bx-radio>
					</bx-radio-group> -->
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	// import bxRadio from '@/components/bx-radio/bx-radio.vue';
	// import bxRadioGroup from '@/components/bx-radio-group/bx-radio-group.vue';
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
	export default {
		name:'personchat',
		components:{
			robbyImageUpload
		},
		props:{
			customer_no: {
				type: String,
				default() {
					return '';
				}
			},
			pageType:{
				type: String,
				default() {
					return '';
				}
			},
			doctor_no:{
				type: String,
				default() {
					return '';
				}
			},
		},
		computed:{
			isFeed(){
				let feed = false
				if(this.chatText){
					feed = true
				}else{
					feed = false
				}
				return feed
			}
		},
		onReady() {
			 this.videoContext = uni.createVideoContext('myVideo')
			console.log("eeeeeee-----Ready")
		},
		data(){
			return {
				heightStyle:'',
				videoContext:'',
				checkRadioValue:'',
				chatText:'',
				isSendLink:false,
				showBottom:false,
				currentSendType:'',
				apiUrl:this.$api.downloadFile,
				// isFeed:false,
				current_type:'world',
				voiceTitle:'按住 说话',
				userInfo:'',
				recordList:[],
				chatTextBottom:'',
				currentUserInfo:uni.getStorageSync('login_user_info'),
				recodeList:[],
				recodeOnloadList:[],
				chooseRecod:'', //链接
				currentVoiceType:'voice',
				Recorder: uni.getRecorderManager(),
				Audio: uni.createInnerAudioContext(),
				ticket:uni.getStorageSync('bx_auth_ticket'),
				recording: false, //标识是否正在录音
				isStopVoice: false, //加锁 防止点击过快引起的当录音正在准备(还没有开始录音)的时候,却调用了stop方法但并不能阻止录音的问题
				voiceInterval:null,
				voiceTime:0, //总共录音时长
				canSend:true, //是否可以发送
				PointY:0, //坐标位置
				voiceIconText:"正在录音...",
				showFunBtn:false, //是否展示功能型按钮
				AudioExam:null, //正在播放音频的实例
			}
		},
		methods:{
			/*播放视频**/
			openVideo(item){
				// let self = this
				// uni.openVideoEditor({
				// 	filePath:self.$api.downloadFile + item.video + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
				// })
			},
			//控制播放还是暂停音频文件
			handleAudio(item) {				
				console.log("点击语音=========>",this.Audio.paused)				
				this.AudioExam = item;
				this.Audio.paused ? this.playAudio(item) : this.stopAudio(item);
			},
			//播放音频
			playAudio(item) {
				this.Audio.src = item.msg_link;
				this.Audio.id = item.id;
				this.Audio.play();
				item.anmitionPlay = true;
			},
			stopAudio(item) {
				item.anmitionPlay = false;
				// this.Audio.id = item.id;
				this.Audio.src = '';
				this.Audio.stop();
			},
			//准备开始录音
			startVoice(e) {
				console.log("-==----------------")
				if(!this.Audio.paused){
					//如果音频正在播放 先暂停。
					this.stopAudio(this.AudioExam)
				}
				this.recording = true;
				this.isStopVoice = false;
				this.canSend = true;
				this.voiceIconText = "正在录音..."
				this.PointY = e.touches[0].clientY;
				this.Recorder.start({
					format: 'mp3'
				});
			},
			//录音已经开始
			beginVoice(){
				if (this.isStopVoice) {
					this.Recorder.stop();
					return;
				}
				this.voiceTitle = '松开 结束'
				this.voiceInterval =  setInterval(()=>{
					this.voiceTime ++;
				},1000)
			},
			//move 正在录音中
			moveVoice(e){
				const PointY = e.touches[0].clientY
				const slideY = this.PointY - PointY;
				if(slideY > uni.upx2px(120)){
					this.canSend = false;
					this.voiceIconText = '松开手指 取消发送 '
				}else if(slideY > uni.upx2px(60)){
					this.canSend = true;
					this.voiceIconText = '手指上滑 取消发送 '
				}else{
					this.voiceIconText = '正在录音... '
				}
			},
			//结束录音
			endVoice() {
				this.isStopVoice = true; //加锁 确保已经结束录音并不会录制
				this.Recorder.stop();
				this.voiceTitle = '按住 说话'
			},
			handleRecorder({ tempFilePath,duration }) {
				console.log("0000000000录音结束")
				let contentDuration;
				// #ifdef MP-WEIXIN
				this.voiceTime = 0;
				if (duration < 600) {
					this.voiceIconText="说话时间过短";
					setTimeout(()=>{
						this.recording = false;
					},200)
					return;
				} 
				contentDuration = duration/1000;
				// #endif
				
				// #ifdef APP-PLUS
				contentDuration = Number(this.voiceTime) +1;
				this.voiceTime = 0;
				console.log("=----------录音--")
				if(contentDuration <= 0) {
					this.voiceIconText="说话时间过短";
					setTimeout(()=>{
						this.recording = false;
					},200)
					return;
				};
				// #endif
				
				this.recording = false;
				const params = {
					contentType: 2,
					content: tempFilePath,
					contentDuration: Math.ceil(contentDuration)
				};
				console.log("-----语音----",params)
				this.canSend && this.sendMessageLanguageInfo('语音',params)
				// this.canSend && this.sendMsg(params);
			},
			/*发送语音**/
			sendVoiceMesage(params){
				
			},
			closeAnmition() {				
				const hasBeenSentId = this.Audio.id;
				// this.recodeList.forEach(it=>{
				// 	if(it.id === hasBeenSentId){
				// 		it.anmitionPlay = false;
				// 	}
				// })
				const item = this.recordList.find(it => it.id == hasBeenSentId);
				console.log("-----------动画",item)
				item.anmitionPlay = false;
			},
		/*点击图片预览**/
		previewImages(url){
			console.log("---------预览")
			let arr = [url]
			uni.previewImage({
				urls:arr
			})
		},
		 uniqueArray(array, key){
			  var result = [array[0]];
			  for(var i = 1; i < array.length; i++){
			    var item = array[i];
			    var repeat = false;
			    for (var j = 0; j < result.length; j++) {
			      if (item[key] == result[j][key]) {
			        repeat = true;
			        break;
			      }
			    }
			    if (!repeat) {
			      result.push(item);
			    }
			  }
			  return result;
			 },
			async getUserInfoList(){
				const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_info_select',
					colNames: ['*'],
					condition: [],
					order: [
						{
							colName: 'create_time',
							orderType: 'asc'
						}
					]
				};
				const res = await this.$http.post(url, req);
				console.log("userInfo=====>",res.data.data)
			},
			clickChatLink(item){
				console.log("点击聊天----",item)
				uni.navigateTo({
					url:item.msg_link
				})
			},
			radioChange(e){
				this.checkRadioValue = e
				console.log("e----------",e)
				
			},
			checkboxGroupChange(){
			},
			openMenuPoup(type){
				let self = this
				if(type == 'question' || type === 'bite'){								
					this.showBottom = true
					this.currentSendType = type
					this.seleceMenuConent()
				}else if(type === 'photo'){
					uni.chooseImage({
					    count: 6, //默认9
					    sourceType: ['album'], //从相册选择
					    success: function (res) {
							console.log("上传图片----》",res)
							let reqHeader = {
								bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
							}
							let formData = {
								serviceName: "srv_bxfile_service",
								interfaceName: "add",
								app_no: "health",
								table_name: "",
								thumbnailType:'fwsu_100',
								columns: "image"
							}
							let url = ''
							for(let i=0;i<res.tempFilePaths.length;i++){
								uni.uploadFile({
									url:self.$api.upload,
									header: reqHeader,
									formData:formData,
									filePath: res.tempFilePaths[i],
									name: 'file',
									success: (e) => {
										if(e.statusCode === 200){
											let photoDataNo = JSON.parse(e.data).file_no
											self.sendMessageLanguageInfo('图片',photoDataNo)
										}else{
											
										}
										// console.log(uploadFileRes.data);
									}
								})
							}
							
					    }
					});
				}else if(type === 'word'){
					let url = '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent("https://wx2.100xsys.cn/pages/fileInfo/fileInfo") + '?doctor_no=' + encodeURIComponent(this.doctor_no?this.doctor_no:'') + '&userno=' + encodeURIComponent(this.userInfo.userno)
					console.log('url----->',url)
					uni.navigateTo({
						url:'/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent("https://wx2.100xsys.cn/pages/fileInfo/fileInfo") + '&doctor_no=' + encodeURIComponent(this.doctor_no?this.doctor_no:'') + '&userno=' + encodeURIComponent(this.userInfo.userno)
					})
					// return
					// wx.chooseMessageFile({
					//   count: 1,
					//   type: 'file',
					//   success (res) {
					//    console.log("上传图片----》",res)
					//    let reqHeader = {
					// 		bx_auth_ticket: uni.getStorageSync('bx_auth_ticket'),
					// 		"content-type":"multipart/form-data"
					//    }
					//    let formData = {
					//    	serviceName: "srv_bxfile_service",
					//    	interfaceName: "add",
					//    	app_no: "health",
					//    	columns: "attachment"
					//    }
					//    console.log("name-----",formData)
					//    let url = ''
					//    for(let i=0;i<res.tempFiles.length;i++){
					// 	   console.log("res--上传文件--",res)
					//    	wx.uploadFile({
					//    		url:self.$api.upload,
					//    		header: reqHeader,
					//    		formData:formData,
					//    		filePath: res.tempFiles[i],
					// 		name:'file',
					//    		success: (e) => {
					// 			console.log("e----->",e)
					//    			if(e.statusCode === 200){
					//    				let photoDataNo = JSON.parse(e.data).file_no
					// 				console.log("上传文件-----",e)
					//    				self.sendMessageLanguageInfo('文件',photoDataNo)
					//    			}else{
					   				
					//    			}
					//    		},
					// 		fail:(e)=>{
					// 			console.log("fail-----",e)
					// 		}
					//    	})
					//    }
					//   }
					// })
					console.log("点击上传文档----")
				}else if(type === 'wx_word'){
					wx.chooseMessageFile({
					  count: 1,
					  type: 'file',
					  success (res) {
					   console.log("上传图片----》",res)
					   let reqHeader = {
							bx_auth_ticket: uni.getStorageSync('bx_auth_ticket'),
							"content-type":"multipart/form-data"
					   }
					   let formData = {
					   	serviceName: "srv_bxfile_service",
					   	interfaceName: "add",
					   	app_no: "health",
					   	columns: "attachment"
					   }
					   console.log("name-----",formData)
					   let url = ''
					   for(let i=0;i<res.tempFiles.length;i++){
						   console.log("res--上传文件--",res)
					   	uni.uploadFile({
					   		url:self.$api.upload,
					   		header: reqHeader,
					   		formData:formData,
					   		filePath: res.tempFiles[0].path,
							name:'file',
					   		success: (e) => {
								console.log("e----->",e)
					   			if(e.statusCode === 200){
					   				let photoDataNo = JSON.parse(e.data).file_no
									console.log("上传文件-----",e)
					   				self.sendMessageLanguageInfo('文件',photoDataNo)
					   			}else{
					   				
					   			}
					   		},
							fail:(e)=>{
								console.log("fail-----",e)
							}
					   	})
					   }
					  }
					})
				}else if(type === 'video'){
					let reqHeader = {
						bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
					}
					let formData = {
						serviceName: "srv_bxfile_service",
						interfaceName: "add",
						app_no: "health",
						columns: "video"
					}
					 uni.chooseVideo({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function (res) {
							let src = res.tempFilePath;
							console.log("-----------res----视频",src)
							uni.uploadFile({
								url:self.$api.upload,
								header: reqHeader,
								formData:formData,
								filePath: src,
								name:'file',
								success: (e) => {
									console.log("上传文件-----",e)
									if(e.statusCode === 200){
										let photoDataNo = JSON.parse(e.data).file_no
										console.log("上传文件-----",e)
										self.sendMessageLanguageInfo('视频',photoDataNo)
									}else{										
									}
								},
								fail:(e)=> {
									console.log("失败---",e)
								}
							})
							console.log("点击视频----",res)
							
						}
					});
				}
				
			},
			confirmPoup(){
				this.showBottom = false
				// url:`/questionnaire/index/index?formType=form&activity_no=${item.no}&status=进行中`
				let url = ''
				if(this.currentSendType == 'question'){
					url = `/questionnaire/index/index?formType=form&activity_no=${this.checkRadioValue}&status=进行中`
				}else if(this.currentSendType == 'bite'){
					// url = `/archivesPages/archives-history/archives-history?pageType=${e}`;
					url = `/archivesPages/archives-history/archives-history?pageType=diet&chatChoseTime=` + this.checkRadioValue
				}
				this.chooseRecod = url
				// this.chatText = url
				// let linkData = {
				// 	name:,
				// 	url:url
				// }
				this.sendMessageInfo()
				console.log("------url",url)
				
			},
			hideModal(){
				this.showBottom = false
			},
			/*查询问卷列表**/
			async getRecorderManagerList(){
				let serviceName = 'srvdaq_activity_cfg_select'
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition:[
					// {
					// 	colName:'user_no',
					// 	ruleType:'eq',
					// 	value:uni.getStorageSync('login_user_info').user_no
					// },
					{
						colName:'status',
						ruleType:"eq",
						value:'进行中'
					},
					{
						colName:'info_collect_type',
						ruleType:"eq",
						value:'自测'
					}
					],
					order:[{
						colName:'create_time',
						orderType:'asc'
					}]
				}
				let app = 'daq'
				let url = this.getServiceUrl(app, serviceName, 'select');
				let res = await this.$http.post(url,req)
				this.recodeOnloadList = res.data.data
				this.getUserInfo(this.customer_no);
			},
			async seleceMenuConent(){
				let serviceName = null
				let req = null
				let app = null
				if(this.currentSendType === 'question'){
					serviceName = 'srvdaq_activity_cfg_select',
					req = {
						serviceName: serviceName,
						colNames: ['*'],
						condition:[
						// {
						// 	colName:'user_no',
						// 	ruleType:'eq',
						// 	value:uni.getStorageSync('login_user_info').user_no
						// },
						{
							colName:'status',
							ruleType:"eq",
							value:'进行中'
						},
						{
							colName:'info_collect_type',
							ruleType:"eq",
							value:'自测'
						}
						],
						order:[{
							colName:'create_time',
							orderType:'asc'
						}]
					}
					app = 'daq'
				}else if(this.currentSendType === 'bite'){
					app = 'health'
					serviceName = 'srvhealth_diet_record_select',
					req = {
						serviceName: serviceName,
						colNames: ['*'],
						condition:[
						{
							colName:'userno',
							ruleType:'eq',
							value:uni.getStorageSync('login_user_info').user_no
						},						
						],
						order:[{
							colName:'create_time',
							orderType:'desc'
						}]
					}
				}
				let url = this.getServiceUrl(app, serviceName, 'select');				
				let res = await this.$http.post(url,req)
				if(this.currentSendType === 'bite'){
					res.data.data = this.uniqueArray(res.data.data,'hdate')
				}
				this.recodeList = res.data.data
				console.log("res======>",res.data.data)
			},
			/*打开发送链接弹窗**/
			openLink(){
				this.isSendLink = !this.isSendLink
				
				// setTimeout(() => {
				//    uni.pageScrollTo({scrollTop: 99999999, duration: 0});
				// }, 50);
				if(this.doctor_no){
					this.heightStyle = 'calc(100vh - 140px)'
				}else{
					this.heightStyle = 'calc(100vh - 200px)'
				}
				
				if(!this.isSendLink){
					this.heightStyle = 'calc(100vh - 45px)'
				}
				
			},
			/*切换文字或者链接**/
			changeType(type){
				this.current_type = type
			},
			/*点击发送**/
			sendMessage(){
				this.sendMessageInfo()
				this.chatText = "",
				this.isSendLink = false
				if(this.doctor_no){
					this.heightStyle = 'calc(100vh - 50px)'
				}else{
					this.heightStyle = 'calc(100vh - 100px)'
				}
				// this.heightStyle = 'calc(100vh - 100px)'
			},
			changeVoice(type){
				// if(type = ){
					
				// }
				console.log("----------",type)
				this.currentVoiceType = type
			},
			/*input框内有没有内容**/
			changeTest(){
				if(this.chatText){
					this.isSendLink = false
					
					if(this.doctor_no){
						this.heightStyle = 'calc(100vh - 50px)'
					}else{
						this.heightStyle = 'calc(100vh - 100px)'
					}
					
				}
			},
			downloadfile(item){				
			    var url = this.$api.downloadFile + item.attachment + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
				uni.showToast({
					title:'正在下载',
					icon:'none'
				})
			    //下载文件，生成临时地址
			    wx.downloadFile({
			      url: url, 
			      success(res) {
			        // console.log(res)
			        //保存到本地
			        wx.saveFile({
			          tempFilePath: res.tempFilePath,
			          success: function (res) {
						  uni.hideToast()
			            const savedFilePath = res.savedFilePath;
			            // 打开文件
						uni.showToast({
							title:'正在打开',
							icon:'none'
						})
			            wx.openDocument({
			              filePath: savedFilePath,
			              success: function (res) {
							  uni.hideToast()
			                console.log('打开文档成功')
			              },
			            });
			          },
			          fail: function (err) {
			            console.log('保存失败：', err)
			          }
			        });
			      }
			    })
			  },
			/*点击发送后添加图片或语音数据**/
			async sendMessageLanguageInfo(type,value){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
				let req = [{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data:[{
						sender_account:this.currentUserInfo.user_no,
						receiver_account:this.doctor_no?this.doctor_no:this.userInfo.userno,
						msg_content_type:type
					}]
				}];
				if(type === '图片'){
					req[0].data[0].image = value
				}else if(type === '语音'){
					req[0].data[0].msg_link = value.content
					req[0].data[0].voice_time = value.contentDuration
				}else if(type === '文件'){
					req[0].data[0].attachment = value
				}else if(type === '视频'){
					req[0].data[0].video = value
				}
				console.log("res========>",req)
				let res = await this.$http.post(url, req);
				// if(res.data.state === 'SUCCESS'){
					
					console.log("发送成功",res)
					this.getMessageInfo()
					
				// }
			},
			/*查询文件**/
			async getFileNo(no){
				let fileNo = await this.getFilePath(no)
				return fileNo[0]
				console.log("file——no",fileNo)
			},
			/*点击发送后添加数据**/
			async sendMessageInfo(){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
				let req = [{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data:[{
						sender_account:this.currentUserInfo.user_no,
						receiver_account:this.doctor_no?this.doctor_no:this.userInfo.userno,
						msg_content_type:!this.isSendLink?'文本':'链接',
					}]
				}];
				if(!this.isSendLink){
					req[0].data[0].msg_content=this.chatText
				}else{
					req[0].data[0].msg_link = this.chooseRecod
				}
				console.log("res========>",req)
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					
					console.log("发送成功")
					this.getMessageInfo()
					
				}
			},
			/*查询当前登陆人和其他人聊天记录**/
			async getMessageInfo(type=null){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					relation_condition:{
						relation:'OR',
						data:[]
					},
					order:[{
						colName:'create_time',
						orderType:'asc'
					}]
				};
				let conditionData = []
				if(this.pageType){
					conditionData = [{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.doctor_no
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.userInfo.userno
							}]
						},{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.userInfo.userno
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.doctor_no
							}]
						}]
				}else{
					conditionData = [{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.currentUserInfo.user_no
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.userInfo.userno
							}]
						},{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.userInfo.userno
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.currentUserInfo.user_no
							}]
						}]
				}
				req.relation_condition.data = conditionData
				let res = await this.$http.post(url, req);
				if(res.data.data.length > 0){
					res.data.data.forEach((item,i)=>{
						if(item.msg_content_type === '语音'){
							this.$set(res.data.data[i],'anmitionPlay',false)
						}
						if(item.image){
							let url = this.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
							this.$set(res.data.data[i],'img_url',url)
						}
						if(item.attachment){
							 this.getFileNo(item.attachment).then(obj=>{
								console.log("fileObj------>",obj)
								this.$set(res.data.data[i],'documents_name',obj.src_name)
								this.$set(res.data.data[i],'file_type',obj.file_type)
								this.$set(res.data.data[i],'file_size',obj.file_size)
							})
							
						}
						if(item.msg_content_type === '视频' && item.video){
							let video_url = this.$api.downloadFile + item.video + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
							this.$set(res.data.data[i],'video_url',video_url)
						}
					})
					this.recordList = res.data.data
					res.data.data.forEach(links=>{
						if(links.msg_content_type === '链接'){
							/*饮食记录**/
							if(links.msg_link.indexOf('chatChoseTime') > -1){
								links['recode_num'] = links.msg_link.split("&")[1].split("=")[1]
							}else if(links.msg_link.indexOf('activity_no') > -1){
								//问卷记录
								let active_num = links.msg_link.split("&")[1].split("=")[1]
								this.recodeOnloadList.forEach(t=>{
									if(t.activity_no === active_num){
										links['quertion_name'] = t.title
									}
								})
							}
						}
					})
					this.chatTextBottom ='person-chat-item' + (res.data.data.length - 1)
					// this.getUserInfoList()
					if(type && type === 'onLoad'){
						this.updateMessageInfo()
					}
				}
			},
			/*修改消息记录状态**/
			async updateMessageInfo(){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_update', 'operate');
				let req = [{
					serviceName: 'srvhealth_consultation_chat_record_update',
					colNames: ['*'],
					condition:[{
						colName:'sender_account',
						ruleType:'eq',
						value:this.doctor_no?this.doctor_no:this.userInfo.userno
					},{
						colName:'msg_state',
						ruleType:'eq',
						value:'未读'
					}],
					data:[{
						msg_state:'已读'
					}]
				}];
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					
					this.getMessageInfo()
					console.log("更新成功")
				}				
			},
			/*查询当前病人**/
			async getUserInfo(customer_no) {						
				let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_info_select',
					colNames: ['*'],
					condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
					page: { pageNo: 1, rownumber: 10 }
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					if(res.data.data[0].profile_url){
						res.data.data[0]['img_url'] = this.$api.downloadFile + res.data.data[0].profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
					}					
					this.userInfo = res.data.data[0];
					
					uni.setStorageSync('current_patient',this.userInfo)
					this.getMessageInfo('onLoad')
					return res.data.data[0];
				}else{
					uni.setStorageSync('current_patient',"")
					uni.showToast({
						title:'未找到患者信息',
						icon:'none'
					})
				}
			},
			
		},	
		mounted() {
			
			this.Recorder = uni.getRecorderManager()
			this.Recorder.onStart(e => {				
				this.beginVoice();
			});
			//录音结束事件
			this.Recorder.onStop(res => {
				clearInterval(this.voiceInterval);
				this.handleRecorder(res);
			});
			
			//音频停止事件
			this.Audio.onStop(e => {
				this.closeAnmition();
			});
			
			//音频播放结束事件
			this.$on('onEnded',data=>{
				this.Audio.onEnded(e => {
					console.log("e----------end--")
				});
			}
				// this.Audio.onEnded(e => {
				// 	console.log("e----------end--")
				// });
			)
				
			
			if(this.customer_no){
				this.getRecorderManagerList()
				
			}
			const query = uni.createSelectorQuery().in(this);
			query.select('.person-chat-top').boundingClientRect(data => {
			  console.log("得到布局位置信息" + JSON.stringify(data));
			  console.log("节点离页面顶部的距离为" + data.top);
			  uni.pageScrollTo({
			      scrollTop: data.top,
			      duration: 300
			  });
			}).exec();
			
			setTimeout(()=>{
				this.$nextTick(()=>{
					if(this.doctor_no){
						uni.setStorageSync('doctor_no',this.doctor_no)
						this.heightStyle = 'calc(100vh - 50px);'
					}else{
						uni.setStorageSync('doctor_no',"")
						this.heightStyle = 'calc(100vh - 100px);'
					}
				})
			},500)
			
			
			// setTimeout(() => {
			//    uni.pageScrollTo({scrollTop: 99999999, duration: 0});
			// }, 50);
		},		
		onLoad(option) {
			//录音开始事件
			this.Recorder.onStart(e => {
				
				this.beginVoice();
			});
			//录音结束事件
			this.Recorder.onStop(res => {
				clearInterval(this.voiceInterval);
				this.handleRecorder(res);
			});
			
			//音频停止事件
			this.Audio.onStop(e => {
				this.closeAnmition();
			});
			
			//音频播放结束事件
			this.Audio.onEnded(e => {
				console.log("----------语音播放结束----")
				this.closeAnmition();
			});
			if(option.no){
				// this.getUserInfo(option.no);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.person-chat-wrap{
		height: 100vh;
		background-color: #eeeeee;
		.voice_an{
			width: 300rpx;
			height: 300rpx;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-55%);
			background-color: rgba(41,41,41,0.7);
			color: white;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			border-radius: 10rpx;
			.text{
				padding-top: 30rpx;
			}
			@keyframes runVoice{
				0%{
					height: 10%;
				}
				20%{
					height: 50%;
				}
				50%{
					height: 100%;
				}
				80%{
					height: 50%;
				}
				100%{
					height: 0%;
				}
			}	
			.wave{
				width:6rpx;
				height: 100%;
				margin-left: 10rpx;
				border-radius: 50rpx;
				background-color: #999;
				vertical-align: middle;
				display: inline-block;
			}
			.voice_an_icon{
				width: 200rpx;
				height: 100rpx;
				line-height: 50rpx;
				margin: 50rpx 0;
			}
			.voice_an_icon #one{
				animation:runVoice 0.6s infinite 0.1s;
			}
			.voice_an_icon #two{
				animation:runVoice 0.6s infinite 0.3s;
			}
			.voice_an_icon #three{
				animation:runVoice 0.6s infinite 0.6s;
			}
			.voice_an_icon #four{
				animation:runVoice 0.6s infinite 0.1s;
			}
			.voice_an_icon #five{
				animation:runVoice 0.6s infinite 0.3s;
			}
			.voice_an_icon #six{
				animation:runVoice 0.6s infinite 0.6s;
			}
			.voice_an_icon #seven{
				animation:runVoice 0.6s infinite 0.1s;
			}
		}
		.nav-chat-top{
			background-color: rgb(11, 201, 157)!important;
			color: white;
			font-weight: 700;
		}
		
		.person-chat-top{
			display: flex;
			flex-direction: column;
			max-height: calc(100vh - 100rpx);
			overflow-y: scroll;
			// margin: 10rpx;
			.person-chat-item{	
				// display: flex;
				// margin-right: 20rpx;
				.person-chat-item-accept{
					display: flex;
					margin: 30rpx 10rpx;
					.person-chat-item-left{
						margin-right: 20rpx;
						image{
							width: 80rpx;
							height: 80rpx;
						}
					}
					.person-chat-item-right{
						min-width: 16%;
						background: #FFF;
						border-radius: 5px;
						padding: 5px;
						font-weight: 700;
						font-size: 12px;
						position: relative;
						display: flex;
						align-items: center;
						box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
						.link-left{
							margin-right: 16rpx;
							image{
								width: 30rpx;
								height: 30rpx;
							}
						}
						.link-right{
							.link-right-item{
								display: flex;
								flex-direction: column;
								text{
									&:first-child{
										color: #000;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px
									}
									&:last-child{
										color: #ccc;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px;
									}
								}
							}
						}
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-right: 8px solid #fff;
							position: absolute;
							border-radius: 1px;
							left: -8px;
							top: 15px;
						}
					}
					.person-chat-item-right-link{
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 0px solid transparent;
							border-bottom: 0px solid transparent;
							border-right: 0px solid #fff;
							position: absolute;
							border-radius: 1px;
							left: -8px;
							top: 15px;
						}
					}
					.person-chat-item-right-image{
						background: #eeeeee;
						box-shadow: none;
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 0px solid transparent;
							border-bottom: 0px solid transparent;
							border-left: 0px solid transparent;
							position: absolute;
							right: -8px;
							top: 15px;						
						}
						image{
							width: 130rpx;
							height: 130rpx;
							border-radius: 5px;
						}
						// image{
						// 	width: 100rpx;
						// 	height: 100rpx;
						// }
					}
					.person-chat-item-right-link{
						.link-left{
							image{
								width: 30rpx;
								height: 30rpx;
							}
						}
						text{
							color: blue;
							font-weight: 200;
							font-style:italic;
							text-decoration: underline;
						}
					}
				}
				.person-chat-item-send{
					display: flex;
					margin: 30rpx 10rpx;
					justify-content: flex-end;
					min-width: 40%;
					.unread{
						line-height: 86rpx;
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #ccc;
					}
					.person-chat-item-left{
						image{
							width: 80rpx;
							height: 80rpx;
						}
						margin-left: 20rpx;
					}
					.person-chat-item-right{
						min-width: 40%;
						max-width: 75%;
						word-wrap: break-word;
						background: #07c062;
						border-radius: 5px;
						padding: 5px;
						font-weight: 700;
						font-size: 12px;
						position: relative;
						display: flex;
						align-items: center;
						.link-left{
							margin-right: 16rpx;
							image{
								width: 30rpx;
								height: 30rpx;
							}
						}
						.link-right{
							.link-right-item{
								display: flex;
								flex-direction: column;
								text{
									&:first-child{
										color: #000;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px
									}
									&:last-child{
										color: #ccc;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px;
									}
								}
							}
						}
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-left: 8px solid #07c062;
							position: absolute;
							right: -8px;
							top: 15px;
						}
					}
					.person-chat-item-right-image{
						background: #eeeeee;
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-left: 0px solid transparent;
							position: absolute;
							right: -8px;
							top: 15px;						
						}
						image{
							width: 130rpx;
							height: 130rpx;
							border-radius: 5px;
						}
						
					}
					.person-chat-item-right-link{
						display: flex;
						background-color: #eeeeee;
						background-color: #fff;
						box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
						align-items: center;
						.link-left{
							margin-right: 16rpx;
							image{
								width: 30rpx;
								height: 30rpx;
							}
						}
						.link-right{
							.link-right-item{
								display: flex;
								flex-direction: column;
								text{
									&:first-child{
										color: #000;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px
									}
									&:last-child{
										color: #ccc;
										font-weight: 700;
										font-style: normal;
										text-decoration: none;
										font-size: 14px;
									}
								}
							}
						}
						text{
							color: blue;
							font-weight: 200;
							font-style:italic;
							text-decoration: underline;
						}
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-left: 8px solid transparent;
							position: absolute;
							right: -8px;
							top: 15px;
						}
					}
				}
			}
			.person-chat-item-my{
				display: flex;
				justify-content: flex-end;
				// .person-chat-item-send{
				// 	.person-chat-item-right{
				// 		background-color: #eeeeee;
				// 		text{
				// 			width: 100%;
				// 			background-color: #07c062;
				// 		}
				// 	}
				// }
				
			}
		}
		.person-chat-top-w{
			// max-height: calc(100vh - 260rpx);
		}
		.person-chat-top-w-h{
			// max-height: calc(100vh - 180rpx);
		}
		.person-chat-bot{
			// background-color: #f7f7f7;
			// box-shadow: 0px 1px 4px rgba(26, 26, 26, 0.2);
			position: fixed;
			bottom: 80rpx;
			width: 100%;
			// display: flex;
			// padding: 10rpx 20rpx;
			// align-items: center;
			.person-chat-bot-top{
				background-color: #f7f7f7;
				box-shadow: 0px 1px 4px rgba(26, 26, 26, 0.2);				
				width: 100%;
				display: flex;
				padding: 10rpx 20rpx;
				align-items: center;
			.person-chat-left{
				width: 85%;
				display: flex;
				align-items: center;
				// margin-right: 30rpx;
				image{
					width: 50rpx;
					height: 50rpx;
					margin-right: 10rpx;
				}
				input{
					width: 90%;
					padding: 2px 10rpx;
					background: #fff;
					height: 70rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
				}
				text{
					width: 90%;
					padding: 2px 10rpx;
					background: #fff;
					height: 70rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
					text-align: center;
					line-height: 80rpx;
					font-size: 28rpx;
				}
			}
			.person-chat-rig{
				width: 15%;
				text-align: center;
				.person-chat-rig-add-wrap{
					.person-chat-rig-add{
						margin: 0 auto;
						border: 1px solid #ccc;
						width: 50rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 30rpx;
						font-size: 40rpx;
					}
				}
				
				.send{
					background-color: #07c062;
					padding: 10rpx 20rpx;
					color: #fff;
					border-radius: 10rpx;
					margin-left: 10rpx;
				}
			}
		}
		.person-chat-bot-bot{
			.person-chat-bot-bot-item-w{
				display: flex;
				border-top: 1px solid #ccc;
				background-color: #f7f7f7;
				flex-wrap: wrap;
				.person-chat-bot-bot-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 20rpx;
					.person-chat-bot-bot-item-top{
						padding: 5px;
						background: #fff;
						width: 50px;
						height: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 22px;
						font-weight: 600;
						border-radius: 10px;
						margin-bottom: 5px;
					}
				}
			}
			
		}
	}
		.person-doctor-chat-bot{
			bottom: 0rpx;
		}
	}
	.recode-poup{
		height: calc(100vh - 150px);
		overflow-y: auto;
		.recode-poup-list{
			display: flex;
			flex-direction: column;
			
		}
	}
	.contentType2 {
		display: flex;
		flex-direction: row;
		align-items: center;
		.voice_icon_right-wrap{
			background-color: #07c062;
			padding: 16rpx 16rpx 16rpx 80rpx;
			border-radius: 8rpx;
			position: relative;
			display: flex;
			&::after{
					content: '';
					display: block;
					width: 0;
					height: 0;
					border-top: 5px solid transparent;
					border-bottom: 5px solid transparent;
					border-left: 8px solid #07c062;
					position: absolute;
					border-radius: 1px;
					right: -7px;
					top: 16rpx;
				}
		}
		.voice_icon_left-wrap{
			background-color: #fff;
			padding: 16rpx 80rpx 16rpx 16rpx;
			border-radius: 8rpx;
			position: relative;
			display: flex;
			box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
			&::after{
					content: '';
					display: block;
					width: 0;
					height: 0;
					border-top: 5px solid transparent;
					border-bottom: 5px solid transparent;
					border-right: 8px solid #fff;
					position: absolute;
					border-radius: 1px;
					left: -7px;
					top: 16rpx;
				}
		}
		.voice_icon {
			height: 34rpx;
			width: 34rpx; 
			background-repeat: no-repeat;
			background-size: 100%;
		}
		.voice_icon_right {
			background-image: url(../../static/voice-left-3.png);
			margin-left: 10rpx;
		}
		.voice_icon_left {
			background-image: url(../../static/voice-right-3.png);
			margin-right: 10rpx;
		}
		.voice_icon_right_an {
			animation: voiceAn_right 1s linear alternate infinite;
		}
		.voice_icon_left_an {
			animation: voiceAn_left 1s linear alternate infinite;
		}
		@keyframes voiceAn_right {
			0% {
				background-image: url(../../static/voice-left-1.png);
			}
			50% {
				background-image: url(../../static/voice-left-2.png);
			}
			100% {
				background-image: url(../../static/voice-left-3.png);
			}
		}
		@keyframes voiceAn_left {
			0% {
				background-image: url(../../static/voice-right-1.png);
			}
			50% {
				background-image: url(../../static/voice-right-2.png);
			}
			100% {
				background-image: url(../../static/voice-right-3.png);
			}
		}
	}
	.voice_title {
		text-align: center;
		background-color: #ffffff;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 12rpx;
	}
	.documents-wrap{
		.documents-item{
			display: flex;
			background-color: white;
			padding: 10rpx 20rpx;
			border-radius: 10rpx;
			.documents-item-left{
				margin-right: 30rpx;
			}
			.documents-item-right{
				image{
					width: 85rpx;
					height: 85rpx;
				}
			}
		}
	}
	
</style>
