<template>
	<view
		class="person-chat-wrap"
		:style="{
			'--chart-height': chartHeight,
			'--msgListHeight': msgListHeight,
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<view class="person-chat-top" @click.stop="closeBottomPoup" :class="!doctor_no.owner_account ? 'person-chat-top-w' : 'person-chat-top-w-h'">
			<audio
				v-if="currentChat.id"
				class="audio"
				@ended="playEnd"
				:action="audioAction"
				id="myMp3"
				style="height: 0;opacity: 0;overflow: hidden;position: absolute;top: 0;"
				:src="currentChat.voice_url"
				controls
			/>
			<scroll-view
				@scrolltoupper="loadData"
				:scroll-y="true"
				:scroll-top="scrollTop"
				:scroll-into-view="chatTextBottom"
				:scroll-with-animation="true"
				class="msg-list"
				:class="{ 'top-height': topHeight, showLayer: !isFeed && isSendLink, showKeyboard: !isSendLink && showKeyboard }"
			>
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="isLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view
					:id="`person-chat-item${item.id}`"
					v-for="(item, index) in recordList"
					:key="index"
					class="person-chat-item"
					:class="item.sender_account === currentUserInfo.userno ? 'person-chat-item-my' : ''"
				>
					<view class="send-time" v-if="showSendTime(item, index)">{{ formateDate(item.create_time, false) }}</view>
					<view v-if="item.sender_account != currentUserInfo.userno" class="person-chat-item-accept">
						<view class="sender-info" v-if="groupInfo && groupInfo.gc_no">
							<text class="cu-tag bg-blue sm" v-if="item.sender_group_role">{{ item.sender_group_role }}</text>
							<text class="sender-name" v-if="item.sender_name">{{ item.sender_name }}</text>
						</view>
						<view class="person-chat-item-left">
							<image
								:src="doctor_no.usera_image ? getImagePath(doctor_no.usera_image) : '/personalPages/static/doctor_default.jpg'"
								mode="aspectFit"
								v-if="!groupInfo || !groupInfo.gc_no"
							></image>
							<image :src="getSenderProfile(item) ? getSenderProfile(item) : '/static/man-profile.png'" mode="aspectFit" v-if="groupInfo && groupInfo.gc_no"></image>
						</view>
						<view
							@click="previewImages(item.img_url)"
							v-if="item.image && item.img_url && item.msg_content_type === '图片'"
							class="person-chat-item-right person-chat-item-right-image"
						>
							<image :src="item.img_url" :style="{ width: item.imgWidth + 'px', height: item.imgHeight + 'px' }" lazy-load show-menu-by-longpress></image>
						</view>
						<view v-else-if="item.msg_content" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link ? 'person-chat-item-right-link' : ''">
							<text>{{ item.msg_content }}</text>
						</view>
						<view
							v-else-if="item.msg_link && item.msg_content_type === '链接'"
							@click="clickChatLink(item)"
							class="person-chat-item-right"
							:class="item.msg_link ? 'person-chat-item-right-link' : ''"
						>
							<view class="link-left"><image src="../../static/links.png" mode=""></image></view>
							<view class="link-right">
								<view v-if="item.quertion_name" class="link-right-item">
									<text>问卷记录</text>
									<text>{{ item.quertion_name }}</text>
								</view>
								<view v-else-if="item.recode_num" class="link-right-item">
									<text>饮食记录</text>
									<text>时间：{{ item.recode_num }}</text>
								</view>
							</view>
						</view>
						<view @tap="audioPlay(item)" v-else-if="item.msg_link && item.msg_content_type === '语音'" hover-class="contentType2-hover-class" class="content contentType2">
							<view class="voice_icon_left-wrap" :class="{ 'play-left': currentChat && item.id === currentChat.id && currentChat.anmitionPlay }">
								<view class="">{{ item.voice_time ? item.voice_time : '' }}</view>
								<image
									class="voice_icon voice_icon_left"
									src="../../static/voice-l.png"
									:class="currentChat && item.id === currentChat.id && currentChat.anmitionPlay ? 'voice_icon_left_an' : ''"
								></image>
							</view>
						</view>
						<view v-else-if="item.longitude && item.latitude && item.msg_content_type === '位置'" class="map-container" @tap="openMap(item)">
							<view class="map-info">
								<view class="name">{{ item.location_name }}</view>
								<view class="address">{{ item.location_address }}</view>
							</view>
							<map
								style="width: 500rpx; height: 300rpx;"
								:enable-scroll="false"
								:enable-rotate="false"
								:latitude="item.latitude"
								:longitude="item.longitude"
								:markers="getCovers(item)"
							></map>
						</view>
						<view @tap="openVideo(item)" v-else-if="item.video && item.msg_content_type === '视频'" class="video_right_play">
							<!-- <text>视频</text> -->
							<video
								class="video-msg"
								:poster="item.image ? getImagePath(item.image, true) : false"
								:style="{ width: item.videoWidth + 'px', height: item.videoHeight + 'px' }"
								id="myVideo"
								:src="item.video_url"
								:duration="item.attribute && item.attribute.duration ? item.attribute.duration : ''"
								controls
							></video>
						</view>
						<view @click="downloadfile(item)" v-else-if="item.msg_content_type === '文件'" class="documents-wrap">
							<view class="documents-item">
								<view class="documents-item-left">
									<text>{{ item.documents_name }}</text>
								</view>
								<view class="documents-item-right">
									<image v-if="item.file_type && (item.file_type == 'docx' || item.file_type == 'doc')" src="/personalPages/static/word.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'xlsx'" src="/personalPages/static/excel.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'pdf'" src="/personalPages/static/pdf.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
					<view v-else-if="item.sender_account === currentUserInfo.userno" class="person-chat-item-send">
						<view class="sender-info" v-if="groupInfo && groupInfo.gc_no">
							<text class="sender-name" v-if="item.sender_name">{{ item.sender_name }}</text>
							<text class="cu-tag bg-blue sm" v-if="item.sender_group_role">{{ item.sender_group_role }}</text>
						</view>
						<text class="unread" v-if="item.msg_state === '未读' && (!groupInfo || !groupInfo.gc_no)">{{ item.msg_state }}</text>
						<view @click="previewImages(item.img_url)" v-if="item.image && item.img_url" class="person-chat-item-right person-chat-item-right-image">
							<image :src="item.img_url" :style="{ width: item.imgWidth + 'px', height: item.imgHeight + 'px' }"></image>
						</view>
						<view v-else-if="item.msg_content" @click="clickChatLink(item)" class="person-chat-item-right" :class="item.msg_link ? 'person-chat-item-right-link' : ''">
							<text>{{ item.msg_content }}</text>
						</view>
						<view
							v-else-if="item.msg_link && item.msg_content_type === '链接'"
							@click="clickChatLink(item)"
							class="person-chat-item-right"
							:class="item.msg_link ? 'person-chat-item-right-link' : ''"
						>
							<view class="link-left"><image src="../../static/links.png" mode=""></image></view>
							<view class="link-right">
								<view v-if="item.quertion_name" class="link-right-item">
									<text>问卷记录</text>
									<text>{{ item.quertion_name }}</text>
								</view>
								<view v-else-if="item.recode_num" class="link-right-item">
									<text>饮食记录</text>
									<text>时间：{{ item.recode_num }}</text>
								</view>
							</view>
						</view>
						<view
							@tap="audioPlay(item)"
							v-else-if="item.msg_link && item.msg_content_type === '语音'"
							hover-class="contentType2-hover-class"
							class="content contentType2 content-type-right"
						>
							<view class="voice_icon_right-wrap" :class="{ 'play-right': currentChat && item.id === currentChat.id && currentChat.anmitionPlay }">
								<image
									class="voice_icon voice_icon_right"
									src="../../static/voice-r.png"
									:class="currentChat && item.id === currentChat.id && currentChat.anmitionPlay ? 'voice_icon_right_an' : ''"
								></image>
								<!-- <view class="voice_icon voice_icon_right" :class="currentChat && item.id === currentChat.id && currentChat.anmitionPlay ? 'voice_icon_right_an' : ''"></view> -->
								<view class="">{{ item.voice_time ? item.voice_time : '' }}</view>
							</view>
						</view>
						<view @tap="openVideo(item)" v-else-if="item.video && item.msg_content_type === '视频'" class="video_right_play">
							<!-- <text>视频</text> -->
							<video
								class="video-msg"
								style="width: 250px;height: 200px;"
								:poster="item.image ? getImagePath(item.image, true) : ''"
								:style="{ width: item.videoWidth + 'px', height: item.videoHeight + 'px' }"
								id="myVideo"
								:duration="item.attribute && item.attribute.duration ? item.attribute.duration : ''"
								:src="item.video_url"
								controls
							></video>
							<!-- <video style="width: 250px;height: 200px;" id="myVideo" :src="item.video_url" controls></video> -->
						</view>
						<view v-else-if="item.longitude && item.latitude && item.msg_content_type === '位置'" class="map-container" @tap="openMap(item)">
							<view class="map-info">
								<view class="name">{{ item.location_name }}</view>
								<view class="address">{{ item.location_address }}</view>
							</view>
							<map
								style="width: 500rpx; height: 300rpx;"
								:enable-scroll="false"
								:enable-rotate="false"
								:latitude="item.latitude"
								:longitude="item.longitude"
								:markers="getCovers(item)"
							></map>
						</view>
						<view @click="downloadfile(item)" v-else-if="item.msg_content_type === '文件'" class="documents-wrap">
							<view class="documents-item">
								<view class="documents-item-left">
									<text>{{ item.documents_name }}</text>
								</view>
								<view class="documents-item-right">
									<image v-if="item.file_type && (item.file_type == 'docx' || item.file_type == 'doc')" src="/personalPages/static/word.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'xlsx'" src="/personalPages/static/excel.png" mode=""></image>
									<image v-else-if="item.file_type && item.file_type === 'pdf'" src="/personalPages/static/pdf.png" mode=""></image>
								</view>
							</view>
						</view>
						<view class="person-chat-item-left">
							<image :src="currentUserInfo.profile_url ? currentUserInfo.profile_url : '/personalPages/static/doctor_default.jpg'" mode=""></image>
						</view>
					</view>
				</view>
				<view class="chart-bottom" v-if="isArray(recordList)" :id="'chart-bottom' + recordList.length"></view>
			</scroll-view>
			<view class="voice_an" v-if="recording">
				<view class="voice_an_icon">
					<view id="one" class="wave one"></view>
					<view id="two" class="wave two"></view>
					<view id="three" class="wave three"></view>
					<view id="four" class="wave four"></view>
					<view id="five" class="wave five"></view>
					<view id="six" class="wave six"></view>
					<view id="seven" class="wave seven"></view>
				</view>
				<view class="text">{{ voiceIconText }}</view>
			</view>
		</view>
		<view class="person-chat-bot" :class="{ showLayer: !isFeed && isSendLink }">
			<view class="person-chat-bot-top">
				<view class="person-chat-left">
					<text class="image-icon cuIcon-sound" @click="changeVoice('keyword')" v-if="currentVoiceType === 'voice'"></text>
					<text class="image-icon cuIcon-keyboard" @click="changeVoice('voice')" v-if="currentVoiceType === 'keyword'"></text>
					<text
						v-if="currentVoiceType === 'keyword'"
						class="voice_title"
						:style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"
						@touchstart.stop.prevent="startVoice"
						@touchmove.stop.prevent="moveVoice"
						@touchend.stop="endVoice"
						@touchcancel.stop="cancelVoice"
					>
						{{ voiceTitle }}
					</text>
					<input
						:focus="onFocus"
						:auto-focus="onFocus"
						v-else
						v-model="chatText"
						confirm-hold
						hold-keyboard
						class="send-text"
						type="text"
						@blur="onBlur"
						@focus="onInput"
						@confirm="sendMessage"
						confirm-type="send"
					/>
				</view>
				<view class="person-chat-rig" :class="{ 'is-feed': isFeed }">
					<view class="person-chat-rig-add-wrap">
						<view @click="openLink" v-if="!isFeed" class="person-chat-rig-add"><text class="cuIcon-roundadd"></text></view>
					</view>
					<text class="send" @click="sendMessage" v-if="isFeed">发送</text>
				</view>
			</view>
			<view class="person-chat-bot-bot" :class="{ showLayer: isSendLink && !showKeyboard }">
				<view @click="openMenuPoup('question')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/question.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>问卷记录</text></view>
				</view>
				<view @click="openMenuPoup('bite')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/diet.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>饮食记录</text></view>
				</view>
				<view @click="openMenuPoup('photo')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/photo.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>图片</text></view>
				</view>
				<view @click="openMenuPoup('word')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/file.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>文档</text></view>
				</view>
				<view @click="openMenuPoup('wx_word')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/paper.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>微信文档</text></view>
				</view>
				<view @click="openMenuPoup('video')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/video.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>视频</text></view>
				</view>
				<view @click="openMenuPoup('location')" class="person-chat-bot-bot-item">
					<view class="person-chat-bot-bot-item-top"><image src="/personalPages/static/address.png" mode=""></image></view>
					<view class="person-chat-bot-bot-item-b"><text>位置</text></view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="showBottom ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green" @click="confirmPoup">确定</view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl recode-poup">
					<bx-radio-group @change="radioChange">
						<bx-radio class="radio" color="#2979ff" v-for="(item, i) in recodeList" :key="item.id" :name="item.activity_no ? item.activity_no : item.hdate">
							{{ item.title ? item.title : item.hdate }}
						</bx-radio>
					</bx-radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
export default {
	name: 'personchat',
	components: {
		robbyImageUpload
	},
	props: {
		customer_no: {
			type: String
		},
		groupInfo: {
			type: Object
		},
		pageType: {
			type: String
		},
		doctor_no: {
			type: Object
		},
		topHeight: {
			type: Number,
			default: 0
		}
	},
	computed: {
		...mapState({
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize,
			currentUserInfo: state => state.user.userInfo
		}),
		chartHeight() {
			if (this.topHeight) {
				return `calc(100vh - ${this.topHeight}px - var(--window-top) - var(--window-bottom))`;
			} else {
				return 'calc(100vh  - var(--window-top) - var(--window-bottom))';
			}
		},
		msgListHeight() {
			if (this.topHeight) {
				if (this.isSendLink) {
					return `calc(100vh - 310px - var(--window-top))`;
				}
				return `calc(100vh - 120px - var(--window-top))`;
			} else {
				if (this.isSendLink) {
					return 'calc(100vh - 250px - var(--window-top))';
				}
				return 'calc(100vh - 60px - var(--window-top))';
			}
		},
		isFeed() {
			let feed = false;
			if (this.chatText) {
				feed = true;
			} else {
				feed = false;
			}
			return feed;
		}
	},
	onReady() {
		this.videoContext = uni.createVideoContext('myVideo');
		this.videoMp3Context = wx.createVideoContext('myMp3');
	},
	data() {
		return {
			showKeyboard: false,
			showLayer: false,
			videoContext: '',
			audioAction: {
				method: 'pause'
			},
			videoMp3Context: '',
			checkRadioValue: '',
			chatText: '',
			isSendLink: false,
			onFocus: false,
			showBottom: false,
			currentSendType: '',
			apiUrl: this.$api.downloadFile,
			// isFeed:false,
			current_type: 'world',
			voiceTitle: '按住 说话',
			pageInfo: {
				rownumber: 20,
				total: 0,
				pageNo: 1
			},
			scrollNum: 0,
			userInfo: '',
			recordList: [],
			chatTextBottom: '',
			scrollAnimation: false,
			scrollTop: 0,
			recodeList: [],
			recodeOnloadList: [],
			chooseRecod: '', //链接
			currentVoiceType: 'voice',
			Recorder: uni.getRecorderManager(),
			Audio: uni.createInnerAudioContext(),
			ticket: uni.getStorageSync('bx_auth_ticket'),
			recording: false, //标识是否正在录音
			isStopVoice: false, //加锁 防止点击过快引起的当录音正在准备(还没有开始录音)的时候,却调用了stop方法但并不能阻止录音的问题
			voiceInterval: null,
			voiceTime: 0, //总共录音时长
			canSend: true, //是否可以发送
			PointY: 0, //坐标位置
			voiceIconText: '正在录音...',
			showFunBtn: false, //是否展示功能型按钮
			AudioExam: null, //正在播放音频的实例
			isLoading: false,
			isAll: false,
			currentChat: {},
			updateMessageTimer: null
		};
	},

	methods: {
		//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
		setPicSize(content) {
			// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
			let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
			let maxH = uni.upx2px(350); //350是定义消息图片最大高度
			if (content.w > maxW || content.h > maxH) {
				let scale = content.w / content.h;
				content.w = scale > 1 ? maxW : maxH * scale;
				content.h = scale > 1 ? maxW / scale : maxH;
			}
			return content;
		},
		getCovers(item) {
			return [
				{
					latitude: item.latitude,
					longitude: item.longitude,
					iconPath: '/static/icon_position.png'
				}
			];
		},
		audioPlay(item) {
			if (!item.voice_url) {
				return;
			}
			this.$set(this.currentChat, 'src', item.voice_url);
			this.currentChat = item.voice_url;
			if (item.id != this.currentChat.id) {
				this.currentChat = '';
				setTimeout(() => {
					this.currentChat = item;
					this.$set(this.audioAction, 'method', 'play');
					this.currentChat.anmitionPlay = true;
				}, 100);
			} else if (item.id == this.currentChat.id) {
				this.currentChat.anmitionPlay = false;
			}
		},
		playEnd(item) {
			// console.log("播放结束",item)
			// item.anmitionPlay = false;
			if (this.currentChat) {
				this.currentChat.anmitionPlay = false;
			}
			this.audioAction.method = 'pause';
			// this.closeAnmition();
		},
		/*关闭底部选择按钮**/
		closeBottomPoup() {
			uni.hideKeyboard();
			this.showKeyboard = false;
			this.$nextTick(function() {
				this.isSendLink = false;
			});
		},
		onBlur() {
			this.showKeyboard = false;
		},
		onInput(e) {
			this.$nextTick(function() {
				//进入页面滚动到底部
				this.scrollTop = 99999;
			});
		},
		openMap(item) {
			// 打开地图
			uni.openLocation({
				latitude: Number(item.latitude),
				longitude: Number(item.longitude),
				name: item.location_name,
				address: item.location_address,
				success: function() {
					console.log('success');
				}
			});
		},
		/*播放视频**/
		openVideo(item) {
			// let self = this
			// uni.openVideoEditor({
			// 	filePath:self.$api.downloadFile + item.video + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')
			// })
		},
		//控制播放还是暂停音频文件
		handleAudio(item) {
			console.log('点击语音=========>', this.Audio.paused);
			this.AudioExam = item;
			this.Audio.paused ? this.playAudio(item) : this.stopAudio(item);
		},
		//播放音频
		playAudio(item) {
			this.Audio.id = item.id;
			//音频播放结束事件
			console.log('this.Audio------->', this.Audio);
			this.Audio.onEnded(e => {
				console.log('e----播放结束', e);
				this.closeAnmition();
			});
			this.Recorder.onStart(e => {
				console.log('录音开始');
				this.beginVoice();
			});
			//音频停止事件
			this.Audio.onStop(e => {
				console.log('音频停止事件');
				this.closeAnmition();
			});

			this.Audio.play();
			item.anmitionPlay = true;
		},
		stopAudio(item) {
			item.anmitionPlay = false;
			// this.Audio.id = item.id;
			this.Audio.src = '';
			this.Audio.stop();
		},
		cancelVoice(e) {
			this.voiceTime = 0;
			this.voiceTitle = '按住 说话';
			this.canSend = false;
			this.Recorder.stop();
		},
		//准备开始录音
		startVoice(e) {
			if (!this.Audio.paused) {
				//如果音频正在播放 先暂停。
				this.stopAudio(this.AudioExam);
			}
			this.recording = true;
			this.isStopVoice = false;
			this.canSend = true;
			this.voiceIconText = '正在录音...';
			this.PointY = e.touches[0].clientY;
			this.Recorder.start({
				format: 'mp3'
			});
		},
		//录音已经开始
		beginVoice() {
			if (this.isStopVoice) {
				this.Recorder.stop();
				return;
			}
			this.voiceTitle = '松开 结束';
			this.voiceInterval = setInterval(() => {
				this.voiceTime++;
			}, 1000);
		},
		//move 正在录音中
		moveVoice(e) {
			const PointY = e.touches[0].clientY;
			const slideY = this.PointY - PointY;
			if (slideY > uni.upx2px(120)) {
				this.canSend = false;
				this.voiceIconText = '松开手指 取消发送 ';
			} else if (slideY > uni.upx2px(60)) {
				this.canSend = true;
				this.voiceIconText = '手指上滑 取消发送 ';
			} else {
				this.voiceIconText = '正在录音... ';
			}
		},
		//结束录音
		endVoice() {
			this.isStopVoice = true; //加锁 确保已经结束录音并不会录制
			this.Recorder.stop();
			this.voiceTitle = '按住 说话';
		},
		handleRecorder({ tempFilePath, duration }) {
			let self = this;
			debugger;
			let contentDuration;
			// #ifdef MP-WEIXIN
			this.voiceTime = 0;
			if (duration < 600) {
				this.voiceIconText = '说话时间过短';
				setTimeout(() => {
					this.recording = false;
				}, 200);
				return;
			}
			contentDuration = duration / 1000;
			// #endif

			// #ifdef APP-PLUS
			contentDuration = Number(this.voiceTime) + 1;
			this.voiceTime = 0;
			console.log('=----------录音--');
			if (contentDuration <= 0) {
				this.voiceIconText = '说话时间过短';
				setTimeout(() => {
					this.recording = false;
				}, 200);
				return;
			}
			// #endif

			this.recording = false;
			const params = {
				contentType: 2,
				content: tempFilePath,
				contentDuration: Math.ceil(contentDuration)
			};
			debugger;
			// this.canSend &&
			this.sendMsg(params);
		},
		/*发送语音**/
		sendMsg(params) {
			let self = this;
			let reqHeader = {
				bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
			};
			let formData = {
				serviceName: 'srv_bxfile_service',
				interfaceName: 'add',
				app_no: 'health',
				table_name: '',
				columns: 'msg_link'
			};
			uni.uploadFile({
				url: self.$api.upload,
				header: reqHeader,
				formData: formData,
				filePath: params.content,
				name: 'file',
				success: e => {
					if (e.statusCode === 200) {
						let photoDataNo = JSON.parse(e.data).file_no;
						params.content = photoDataNo;
						debugger;
						self.sendMessageLanguageInfo('语音', params);
					} else {
					}
					// console.log(uploadFileRes.data);
				}
			});
		},
		// /*滚动**/
		// chatScroll(e) {
		// 	// this.scrollNum = e.detail.scrollTop;
		// 	// if (e.detail.scrollTop < 50 && e.detail.scrollTop != 0 && !this.isLoading && !this.isAll) {
		// 	// 	this.isLoading = true;
		// 	// 	this.pageInfo.pageNo += 1;
		// 	// 	this.getMessageInfo().then(_ => {
		// 	// 		this.isLoading = false;
		// 	// 	});
		// 	// }
		// },
		loadData() {
			if (!this.isAll && !this.isLoading) {
				this.isLoading = true;
				this.pageInfo.pageNo += 1;
				this.getMessageInfo('add');
			}
		},
		closeAnmition() {
			const hasBeenSentId = this.Audio.id;
			const item = this.recordList.find(it => it.id == hasBeenSentId);
			console.log('-----------动画', item);
			item.anmitionPlay = false;
		},
		/*点击图片预览**/
		previewImages(url) {
			console.log('---------预览');
			let arr = [url];
			uni.previewImage({
				urls: arr
			});
		},
		uniqueArray(array, key) {
			var result = [array[0]];
			for (var i = 1; i < array.length; i++) {
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
		async getUserInfoList() {
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
			this.$store.commit('SET_USERLIST', res.data.data);
			console.log('userInfo=====>', res.data.data);
		},
		clickChatLink(item) {
			console.log('点击聊天----', item);
			uni.navigateTo({
				url: item.msg_link
			});
		},
		radioChange(e) {
			this.checkRadioValue = e;
			console.log('e----------', e);
		},
		openMenuPoup(type) {
			let self = this;
			if (type == 'location') {
				uni.chooseLocation({
					success: function(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						// self.sendMessageInfo(res);
						self.sendMessageLanguageInfo('位置', res);
					}
				});
			} else if (type == 'question' || type === 'bite') {
				this.showBottom = true;
				this.currentSendType = type;
				this.seleceMenuConent();
			} else if (type === 'photo') {
				uni.chooseImage({
					count: 6, //默认9
					sourceType: ['album'], //从相册选择
					success: function(res) {
						let reqHeader = {
							bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
						};
						let formData = {
							serviceName: 'srv_bxfile_service',
							interfaceName: 'add',
							app_no: 'health',
							table_name: '',
							thumbnailType: 'fwsu_100',
							columns: 'image'
						};
						let url = '';
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: function(image) {
									uni.uploadFile({
										url: self.$api.upload,
										header: reqHeader,
										formData: formData,
										filePath: res.tempFilePaths[i],
										name: 'file',
										success: e => {
											if (e.statusCode === 200) {
												let photoDataNo = JSON.parse(e.data).file_no;
												self.sendMessageLanguageInfo('图片', photoDataNo, image);
											} else {
											}
										}
									});
								}
							});
						}
					}
				});
			} else if (type === 'word') {
				let url =
					'/publicPages/webviewPage/webviewPage?webUrl=' +
					encodeURIComponent('https://wx2.100xsys.cn/pages/fileInfo/fileInfo') +
					'?doctor_no=' +
					encodeURIComponent(this.doctor_no.owner_account) +
					'&userno=' +
					encodeURIComponent(this.userInfo.userno);
				console.log('url----->', url);
				uni.navigateTo({
					url:
						'/publicPages/webviewPage/webviewPage?webUrl=' +
						encodeURIComponent('https://wx2.100xsys.cn/pages/fileInfo/fileInfo') +
						'&doctor_no=' +
						encodeURIComponent(this.doctor_no.owner_account) +
						'&userno=' +
						encodeURIComponent(this.userInfo.userno)
				});
				console.log('点击上传文档----');
			} else if (type === 'wx_word') {
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					success(res) {
						console.log('上传图片----》', res);
						let reqHeader = {
							bx_auth_ticket: uni.getStorageSync('bx_auth_ticket'),
							'content-type': 'multipart/form-data'
						};
						let formData = {
							serviceName: 'srv_bxfile_service',
							interfaceName: 'add',
							app_no: 'health',
							columns: 'attachment',
							src_name: res.tempFiles[0].name
						};
						console.log('name-----', formData);
						let url = '';
						for (let i = 0; i < res.tempFiles.length; i++) {
							console.log('res--上传文件--', res);
							uni.uploadFile({
								url: self.$api.upload,
								header: reqHeader,
								formData: formData,
								filePath: res.tempFiles[0].path,
								name: 'file',
								success: e => {
									console.log('e----->', e);
									if (e.statusCode === 200) {
										let photoDataNo = JSON.parse(e.data).file_no;
										console.log('上传文件-----', e);
										self.sendMessageLanguageInfo('文件', photoDataNo);
									} else {
									}
								},
								fail: e => {
									console.log('fail-----', e);
								}
							});
						}
					}
				});
			} else if (type === 'video') {
				let reqHeader = {
					bx_auth_ticket: uni.getStorageSync('bx_auth_ticket'),
					'content-type': 'audio/mpeg'
				};
				let formData = {
					serviceName: 'srv_bxfile_service',
					interfaceName: 'add',
					app_no: 'health',
					columns: 'video'
				};
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						let src = res.tempFilePath;
						// 1. 上传视频文件res.tempFilePath、2.上传视频缩略图res.thumbTempFilePath
						uni.showLoading({
							title: '发送中...'
						});
						uni.uploadFile({
							url: self.$api.upload,
							header: reqHeader,
							formData: formData,
							filePath: src,
							name: 'file',
							success: e => {
								console.log('上传文件-----', e);
								if (e.statusCode === 200) {
									let photoDataNo = JSON.parse(e.data).file_no;
									let thumbFormData = {
										serviceName: 'srv_bxfile_service',
										interfaceName: 'add',
										app_no: 'health',
										columns: 'image'
									};
									uni.uploadFile({
										url: self.$api.upload,
										header: reqHeader,
										formData: formData,
										filePath: res.thumbTempFilePath,
										name: 'file',
										success: e => {
											if (e.statusCode === 200) {
												let imageNo = JSON.parse(e.data).file_no;
												res.imageNo = imageNo;
												// #ifdef MP-WEIXIN
												uni.getVideoInfo({
													src: res.tempFilePath,
													success(info) {
														info.imageNo = imageNo;
														self.sendMessageLanguageInfo('视频', photoDataNo, info);
													},
													fail() {
														self.sendMessageLanguageInfo('视频', photoDataNo, res);
													}
												});
												// #endif
												// #ifndef MP-WEIXIN
												self.sendMessageLanguageInfo('视频', photoDataNo, res);
												// #endif
											}
										}
									});
									// self.sendMessageLanguageInfo('视频', photoDataNo,res);
								} else {
								}
							}
						});
					}
				});
			}
		},
		getSenderProfile(item) {
			// 查找发送者头像
			if (item.sender_user_image) {
				return this.getImagePath(item.sender_user_image);
			} else if (item.sender_profile_url) {
				return this.getImagePath(item.sender_profile_url);
			}
		},
		confirmPoup() {
			this.showBottom = false;
			let url = '';
			if (this.currentSendType == 'question') {
				url = `/questionnaire/index/index?formType=form&activity_no=${this.checkRadioValue}&status=进行中`;
			} else if (this.currentSendType == 'bite') {
				url = `/archivesPages/archives-history/archives-history?pageType=diet&chatChoseTime=` + this.checkRadioValue;
			}
			this.chooseRecod = url;
			this.sendMessageInfo();
			console.log('------url', url);
		},
		hideModal() {
			this.showBottom = false;
		},
		/*查询问卷列表**/
		async getRecorderManagerList() {
			let serviceName = 'srvdaq_activity_cfg_select';
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [
					{
						colName: 'status',
						ruleType: 'eq',
						value: '进行中'
					},
					{
						colName: 'info_collect_type',
						ruleType: 'eq',
						value: '自测'
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			let app = 'daq';
			let url = this.getServiceUrl(app, serviceName, 'select');
			let res = await this.$http.post(url, req);
			this.recodeOnloadList = res.data.data;
			this.getUserInfo(this.customer_no);
		},
		async seleceMenuConent() {
			let serviceName = null;
			let req = null;
			let app = null;
			if (this.currentSendType === 'question') {
				(serviceName = 'srvdaq_activity_cfg_select'),
					(req = {
						serviceName: serviceName,
						colNames: ['*'],
						condition: [
							{
								colName: 'status',
								ruleType: 'eq',
								value: '进行中'
							},
							{
								colName: 'info_collect_type',
								ruleType: 'eq',
								value: '自测'
							}
						],
						order: [
							{
								colName: 'create_time',
								orderType: 'asc'
							}
						]
					});
				app = 'daq';
			} else if (this.currentSendType === 'bite') {
				app = 'health';
				(serviceName = 'srvhealth_diet_record_select'),
					(req = {
						serviceName: serviceName,
						colNames: ['*'],
						condition: [
							{
								colName: 'userno',
								ruleType: 'eq',
								value: uni.getStorageSync('login_user_info').user_no
							}
						],
						order: [
							{
								colName: 'create_time',
								orderType: 'desc'
							}
						]
					});
			}
			let url = this.getServiceUrl(app, serviceName, 'select');
			let res = await this.$http.post(url, req);
			if (this.currentSendType === 'bite') {
				res.data.data = this.uniqueArray(res.data.data, 'hdate');
			}
			this.recodeList = res.data.data;
			console.log('res======>', res.data.data);
		},
		/*打开发送链接弹窗**/
		openLink() {
			if (this.isSendLink) {
				this.isSendLink = false;
				this.onFocus = true;
				return;
			}
			uni.hideKeyboard();
			this.isSendLink = true;
			this.showKeyboard = false;
			this.$nextTick(function() {
				//进入页面滚动到底部
				this.scrollTop = 99999;
				this.$nextTick(function() {
					this.$nextTick(() => {
						this.toBottom()
						if (this.recordList.length > 0 && Array.isArray(this.recordList) && this.recordList.length > 0) {
							// this.chatTextBottom = 'person-chat-item' + this.recordList[this.recordList.length - 1].id;
							// this.toBottom()
						}
					});
				});
			});
		},
		/*切换文字或者链接**/
		changeType(type) {
			this.current_type = type;
		},
		/*点击发送**/
		sendMessage() {
			this.sendMessageInfo();
			this.chatText = '';
			this.isSendLink = false;
		},
		changeVoice(type) {
			// if(type = ){

			// }
			console.log('----------', type);
			this.currentVoiceType = type;
		},
		downloadfile(item) {
			var url = this.$api.downloadFile + item.attachment + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			uni.showToast({
				title: '正在下载',
				icon: 'none'
			});
			//下载文件，生成临时地址
			wx.downloadFile({
				url: url,
				success(res) {
					//保存到本地
					wx.saveFile({
						tempFilePath: res.tempFilePath,
						success: function(res) {
							console.log('res------保存', res);
							uni.hideToast();
							const savedFilePath = res.savedFilePath;
							// 打开文件
							uni.showToast({
								title: '正在打开',
								icon: 'none'
							});
							wx.openDocument({
								filePath: savedFilePath,
								success: function(res) {
									uni.hideToast();
									console.log('打开文档成功');
								}
							});
						},
						fail: function(err) {
							console.log('保存失败：', err);
						}
					});
				}
			});
		},
		/*点击发送后添加图片或语音数据**/
		async sendMessageLanguageInfo(type, value, info) {
			console.log('type----sendMessageLanguageInfo', type);
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data: [
						{
							sender_account: this.currentUserInfo.userno,
							sender_name: this.currentUserInfo.name,
							sender_profile_url: this.currentUserInfo.profile_url,
							sender_user_image: this.currentUserInfo.user_image,
							receiver_account: this.doctor_no.usera_no ? this.doctor_no.usera_no : this.userInfo.userno,
							receiver_person_no: this.doctor_no.usera_person_no ? this.doctor_no.usera_person_no : this.userInfo.no,
							// receiver_account: this.doctor_no.userb_no ? this.doctor_no.userb_no : this.userInfo.userno,
							// receiver_person_no: this.doctor_no.userb_person_no ? this.doctor_no.userb_person_no : this.userInfo.no,
							sender_person_no: this.currentUserInfo.no,
							msg_content_type: type,
							identity: this.pageType ? '患者' : '医生'
						}
					]
				}
			];
			if (this.pageType === 'groupChat') {
				// 群组聊天
				req[0].data[0] = {
					sender_account: this.currentUserInfo.userno,
					sender_name: this.currentUserInfo.name,
					sender_profile_url: this.currentUserInfo.profile_url,
					sender_user_image: this.currentUserInfo.user_image,
					sender_group_role: this.groupInfo.group_role,
					rcv_group_no: this.groupInfo.gc_no,
					receiver_account: this.groupInfo.gc_no,
					receiver_person_no: this.groupInfo.gc_no,
					sender_person_no: this.currentUserInfo.no,
					msg_content_type: type,
					identity: this.groupInfo.group_role
				};
			}
			if (type === '图片') {
				req[0].data[0].attribute = info;
				req[0].data[0].image = value;
				try {
					req[0].data[0].attribute = JSON.stringify(info);
				} catch (e) {
					//TODO handle the exception
				}
			} else if (type === '语音') {
				debugger;
				req[0].data[0].msg_link = value.content;
				req[0].data[0].voice_time = value.contentDuration;
			} else if (type === '文件') {
				req[0].data[0].attachment = value;
			} else if (type === '视频') {
				req[0].data[0].video = value;
				req[0].data[0].image = info.imageNo;
				try {
					req[0].data[0].attribute = JSON.stringify(info);
				} catch (e) {
					//TODO handle the exception
				}
			} else if (type === '位置') {
				if (value.latitude && value.longitude) {
					// 发送位置
					req[0].data[0].msg_content_type = '位置';
					req[0].data[0].latitude = value.latitude; //纬度
					req[0].data[0].longitude = value.longitude; //经度
					req[0].data[0].location_name = value.name;
					req[0].data[0].location_address = value.address;
					try {
						req[0].data[0].attribute = JSON.stringify(value);
					} catch (e) {
						//TODO handle the exception
					}
				} else {
					uni.showToast({
						title: '发送失败,请重试！',
						icon: 'none'
					});
					return;
				}
			}
			let res = await this.$http.post(url, req);
			uni.hideLoading();
			if (
				Array.isArray(res.data.response) &&
				res.data.response.length > 0 &&
				res.data.response[0].response &&
				Array.isArray(res.data.response[0].response.effect_data) &&
				res.data.response[0].response.effect_data[0].id
			) {
				this.$emit('completeSendMessage', res.data.response[0].response.effect_data[0]);
			} else {
				this.$emit('completeSendMessage', req[0].data[0]);
			}
			this.isAll = false;
			this.pageInfo.pageNo = 1;
			this.getMessageInfo();
		},
		/*查询文件**/
		async getFileNo(no) {
			let fileNo = await this.getFilePath(no);
			return fileNo[0];
			console.log('file——no', fileNo);
		},
		/*点击发送后添加数据**/
		async sendMessageInfo(obj) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data: [
						{
							sender_account: this.currentUserInfo.userno,
							sender_name: this.currentUserInfo.name,
							sender_profile_url: this.currentUserInfo.profile_url,
							sender_user_image: this.currentUserInfo.user_image,
							receiver_account: this.doctor_no.usera_no ? this.doctor_no.usera_no : this.userInfo.userno,
							receiver_person_no: this.doctor_no.usera_person_no ? this.doctor_no.usera_person_no : this.userInfo.no,
							sender_person_no: this.currentUserInfo.no,
							msg_content_type: !this.isSendLink ? '文本' : '链接',
							identity: this.pageType ? '患者' : '医生'
						}
					]
				}
			];
			if (this.pageType === 'groupChat') {
				// 群组聊天
				req[0].data[0] = {
					sender_account: this.currentUserInfo.userno,
					sender_name: this.currentUserInfo.name,
					sender_profile_url: this.currentUserInfo.profile_url,
					sender_user_image: this.currentUserInfo.user_image,
					sender_group_role: this.groupInfo.group_role,
					rcv_group_no: this.groupInfo.gc_no,
					receiver_account: this.groupInfo.gc_no,
					receiver_person_no: this.groupInfo.gc_no,
					sender_person_no: this.currentUserInfo.no,
					msg_content_type: !this.isSendLink ? '文本' : '链接',
					identity: this.groupInfo.group_role
				};
			}
			if (!this.isSendLink) {
				req[0].data[0].msg_content = this.chatText;
			} else {
				req[0].data[0].msg_link = this.chooseRecod;
			}
			console.log('res========>', req);
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				if (
					Array.isArray(res.data.response) &&
					res.data.response.length > 0 &&
					res.data.response[0].response &&
					Array.isArray(res.data.response[0].response.effect_data) &&
					res.data.response[0].response.effect_data[0].id
				) {
					this.$emit('completeSendMessage', res.data.response[0].response.effect_data[0]);
				} else {
					this.$emit('completeSendMessage', req[0].data[0]);
				}
				console.log('发送成功');
				this.isAll = false;
				this.pageInfo.pageNo = 1;
				this.getMessageInfo();
			}
		},
		_SortJson(json) {
			if (Array.isArray(json)) {
				json.sort((a, b) => {
					return new Date(a.create_time).getTime() - new Date(b.create_time).getTime(); //时间反序
				});
			} else {
				json = [];
			}
			return json;
		},
		showSendTime(item, index) {
			// 此条消息记录上方是否显示发送时间 上一条消息和当前消息发送时间不在同一分钟 则显示
			if (index === 0) {
				return true;
			} else if (index >= 1) {
				return this.formateDate(item.create_time, 'normal') !== this.formateDate(this.recordList[index - 1].create_time, 'normal');
			}
		},
		/*查询当前登陆人和其他人聊天记录**/
		async getMessageInfo(type = null) {
			this.scrollAnimation = false; //关闭滑动动画
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			if (type === 'refresh') {
				this.pageInfo.pageNo = 1;
				// this.recordList = [];
			}
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				relation_condition: {
					relation: 'OR',
					data: []
				},
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				],
				page: this.pageInfo
			};
			let conditionData = [];
			if (this.pageType) {
				if (this.pageType === 'groupChat' && this.groupInfo && this.groupInfo.gc_no) {
					conditionData = [
						{
							relation: 'AND',
							data: [
								{
									colName: 'rcv_group_no', //接收群组编码
									ruleType: 'eq',
									value: this.groupInfo.gc_no
								}
							]
						}
					];
				} else {
					conditionData = [
						{
							relation: 'AND',
							data: [
								{
									colName: 'sender_account',
									ruleType: 'eq',
									value: this.doctor_no.usera_no
								},
								{
									colName: 'receiver_account',
									ruleType: 'eq',
									value: this.currentUserInfo.userno
								}
							]
						},
						{
							relation: 'AND',
							data: [
								{
									colName: 'sender_account',
									ruleType: 'eq',
									value: this.currentUserInfo.userno
								},
								{
									colName: 'receiver_account',
									ruleType: 'eq',
									value: this.doctor_no.usera_no
								}
							]
						}
					];
				}
			} else {
				conditionData = [
					{
						relation: 'AND',
						data: [
							{
								colName: 'sender_account',
								ruleType: 'eq',
								value: this.currentUserInfo.userno
							},
							{
								colName: 'receiver_account',
								ruleType: 'eq',
								value: this.userInfo.userno
							}
						]
					},
					{
						relation: 'AND',
						data: [
							{
								colName: 'sender_account',
								ruleType: 'eq',
								value: this.userInfo.userno
							},
							{
								colName: 'receiver_account',
								ruleType: 'eq',
								value: this.currentUserInfo.userno
							}
						]
					}
				];
			}
			req.relation_condition.data = conditionData;

			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.$emit('load-msg-complete', res.data.data[0]);
			} else {
				this.$emit('load-msg-complete', res.data.data);
			}
			let resData = res.data.data;
			if (type) {
				this.isLoading = false;
			}
			if (Array.isArray(resData) !== true || this.isAll) {
				return;
			}
			this.pageInfo.total = res.data.page.total;
			if (resData.length > 0) {
				resData.forEach((item, i) => {
					if (item.msg_content_type === '语音') {
						this.$set(resData[i], 'anmitionPlay', false);
						this.getFilePath(item.msg_link).then(obj => {
							if (obj) {
								let video_url = this.$api.getFilePath + obj[0].fileurl;
								this.$set(item, 'voice_url', video_url);
							}
						});
					}
					if (item.image) {
						let url = this.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						if (item.msg_content_type === '图片') {
							this.$set(item, 'img_url', url);
						}
						if (item.attribute) {
							try {
								item.attribute = JSON.parse(item.attribute);
								this.$set(item, 'attribute', item.attribute);
							} catch (e) {
								//TODO handle the exception
							}
						}
						if (item.attribute && item.attribute.width && item.attribute.height) {
							let info = this.setImgSize(item.attribute);
							if (info.width && info.height) {
								this.$set(item, 'imgWidth', info.width);
								this.$set(item, 'imgHeight', info.height);
							}
						} else {
							this.getImageInfo({ url: url }).then(picInfo => {
								if (picInfo.w && picInfo.h) {
									let res = this.setPicSize(picInfo);
									if (res.w && res.h) {
										this.$set(item, 'imgWidth', res.w);
										this.$set(item, 'imgHeight', res.h);
									}
								}
							});
						}
					}
					if (item.attachment) {
						this.getFileNo(item.attachment).then(obj => {
							this.$set(item, 'documents_name', obj.src_name);
							this.$set(item, 'file_type', obj.file_type);
							this.$set(item, 'file_size', obj.file_size);
						});
					}
					if (item.msg_content_type === '视频' && item.video) {
						if (item.attribute) {
							try {
								item.attribute = JSON.parse(item.attribute);
								this.$set(item, 'attribute', item.attribute);
							} catch (e) {
								//TODO handle the exception
							}
						}
						if (item.attribute && item.attribute.width && item.attribute.height) {
							let info = this.setImgSize(item.attribute, 500);
							if (info.width && info.height) {
								this.$set(item, 'videoWidth', info.width);
								this.$set(item, 'videoHeight', info.height);
							}
						}
						let video_url = this.$api.downloadFile + item.video + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						this.$set(resData[i], 'video_url', video_url);
					}
				});
				resData.forEach(links => {
					if (links.msg_content_type === '链接') {
						/*饮食记录**/
						if (links.msg_link.indexOf('chatChoseTime') > -1) {
							links['recode_num'] = links.msg_link.split('&')[1].split('=')[1];
						} else if (links.msg_link.indexOf('activity_no') > -1) {
							//问卷记录
							let active_num = links.msg_link.split('&')[1].split('=')[1];
							this.recodeOnloadList.forEach(t => {
								if (t.activity_no === active_num) {
									links['quertion_name'] = t.title;
								}
							});
						}
					}
				});
				if (type === 'refresh') {
					resData = resData;
				}else{
					resData = [...resData, ...this.recordList];
				}
				resData = resData.reduce((pre, cur) => {
					if (Array.isArray(pre) && !pre.find(item => item.id === cur.id)) {
						pre.push(cur);
						return pre;
					}
				}, []);
				this.$nextTick(() => {
					this.recordList = this._SortJson(resData);
					if (this.pageInfo.pageNo * this.pageInfo.rownumber >= res.data.page.total) {
						this.isAll = true;
					}
				});
				this.$nextTick(() => {
					this.toBottom()
					// if (this.recordList.length > 0 && Array.isArray(this.recordList) && this.recordList.length > 0) {
					// 	this.chatTextBottom = 'person-chat-item' + this.recordList[this.recordList.length - 1].id;
					// }
					this.$nextTick(function() {
						this.scrollAnimation = true; //恢复滚动动画
					});
				});
			}
		},
		/*修改消息记录状态**/
		async updateMessageInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_update', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_consultation_chat_record_update',
					colNames: ['*'],
					condition: [
						{
							colName: 'receiver_person_no',
							ruleType: 'eq',
							value: this.currentUserInfo.no
						},
						{
							colName: 'msg_state',
							ruleType: 'eq',
							value: '未读'
						}
					],
					data: [
						{
							msg_state: '已读'
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			this.pageInfo.pageNo = 1;
			this.getMessageInfo('refresh').then(_ => {
				uni.$emit('updateSuccess');
			});
			console.log('更新成功');
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
				if (res.data.data[0].profile_url) {
					res.data.data[0]['img_url'] = this.$api.downloadFile + res.data.data[0].profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
				}
				this.userInfo = res.data.data[0];
				uni.setStorageSync('current_patient', this.userInfo);
				clearInterval(this.updateMessageTimer);
				this.getMessageInfo('refresh').then(_ => {
					this.$nextTick(function() {
						//进入页面滚动到底部
						this.scrollTop = 99999;
						this.$nextTick(function() {
							this.scrollAnimation = true;
						});
					});
				});
				this.updateMessageTimer = setInterval(() => {
					this.updateMessageInfo();
				}, 6 * 1000);
				// this.getMessageInfo('onLoad').then(_ => {
				// 	this.$nextTick(function() {
				// 		//进入页面滚动到底部
				// 		this.scrollTop = 99999;
				// 		this.$nextTick(function() {
				// 			this.scrollAnimation = true;
				// 		});
				// 	});
				// });
				return res.data.data[0];
			} else {
				uni.setStorageSync('current_patient', '');
				uni.showToast({
					title: '未找到用户信息',
					icon: 'none'
				});
			}
		},
		toBottom() {
			this.chatTextBottom = '';
			this.$nextTick(() => {
				this.scrollTop = 999999;
				// if (Array.isArray(this.recordList)) {
				// 	this.chatTextBottom = 'chart-bottom' + this.recodeList.length;
				// }
			});
		}
	},
	beforeDestroy() {
		clearInterval(this.updateMessageTimer);
		uni.hideKeyboard();
	},
	mounted() {
		uni.onKeyboardHeightChange((res = {}) => {
			console.log(res.height);
			if (res.height > 0) {
				this.showKeyboard = true;
				this.isSendLink = false;
			}
			this.$nextTick(() => {
				this.scrollTop = 999999;
			});
		});
		this.Recorder = uni.getRecorderManager();
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
		if (this.customer_no || (this.groupInfo && this.groupInfo.gc_no)) {
			this.getRecorderManagerList();
		}
	},
	onLoad(option) {
		//录音开始事件
		this.Recorder.onStart(e => {
			console.log('录音开始');
			this.beginVoice();
		});
		//录音结束事件
		this.Recorder.onStop(res => {
			console.log('录音结束事件');
			clearInterval(this.voiceInterval);
			this.handleRecorder(res);
		});

		//音频停止事件
		this.Audio.onStop(e => {
			console.log('音频停止事件');
			this.closeAnmition();
		});

		//音频播放结束事件
		this.Audio.onEnded(e => {
			console.log('----------语音播放结束----');
			this.closeAnmition();
		});
	}
};
</script>

<style lang="scss" scoped>
.person-chat-wrap {
	background-color: #eeeeee;
	overflow: hidden;
	width: 100%;
	height: var(--chart-height);
	display: flex;
	flex-direction: column;
	.nav-chat-top {
		background-color: rgb(11, 201, 157) !important;
		color: white;
		font-weight: 700;
	}
	.person-chat-top {
		// height: var(--msgListHeight);
		position: relative;
		.msg-list {
			height: calc(100vh - var(--window-top) - 60px);
			.loading {
				//loading动画
				display: flex;
				justify-content: center;
				@keyframes stretchdelay {
					0%,
					40%,
					100% {
						transform: scaleY(0.6);
					}
					20% {
						transform: scaleY(1);
					}
				}
				.spinner {
					margin: 20upx 0;
					width: 60upx;
					height: 100upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					view {
						background-color: #f06c7a;
						height: 50upx;
						width: 6upx;
						border-radius: 6upx;
						animation: stretchdelay 1.2s infinite ease-in-out;
					}
					.rect2 {
						animation-delay: -1.1s;
					}
					.rect3 {
						animation-delay: -1s;
					}
					.rect4 {
						animation-delay: -0.9s;
					}
					.rect5 {
						animation-delay: -0.8s;
					}
				}
			}
			&.top-height {
				height: calc(100vh - var(--window-top) - 60px - 60px);
			}
			&.showLayer {
				height: calc(100vh - var(--window-top) - 60px - 230px);
			}
			&.top-height.showLayer {
				height: calc(100vh - var(--window-top) - 60px - 60px - 230px);
			}
		}

		.person-chat-item {
			flex-direction: column;
			align-items: flex-end;
			.send-time {
				padding-top: 50rpx;
				display: flex;
				width: 100%;
				justify-content: center;
				color: #999;
			}
			.person-chat-item-accept {
				display: flex;
				margin: 0rpx 10rpx 20rpx;
				flex-wrap: wrap;
				.sender-info {
					width: 100%;
					font-size: 24rpx;
					margin-bottom: 10rpx;
					text-align: left;
					.sender-name {
						color: #999;
						margin-left: 10rpx;
					}
				}
				.map-container {
					width: 500rpx;
					background-color: #fff;
					border-radius: 5rpx;
					overflow: hidden;
					.map-info {
						padding: 20rpx;
						.address {
							font-size: 24rpx;
							color: #999;
							margin-top: 10rpx;
						}
					}
				}
				.person-chat-item-left {
					margin-right: 20rpx;
					image {
						width: 80rpx;
						height: 80rpx;
					}
				}
				.person-chat-item-right {
					min-width: 16%;
					max-width: 60%;
					background: #fff;
					border-radius: 10rpx;
					padding: 5px 10px;
					line-height: 1.5;
					letter-spacing: 1px;
					font-family: '微软雅黑', 'Courier New', Courier, monospace;
					font-size: var(--global-text-font-size);
					position: relative;
					display: flex;
					align-items: center;
					box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
					.link-left {
						margin-right: 16rpx;
						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
					.link-right {
						.link-right-item {
							display: flex;
							flex-direction: column;
							text {
								&:first-child {
									color: #000;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
								&:last-child {
									color: #ccc;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
							}
						}
					}
					&::after {
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
				.person-chat-item-right-link {
					&::after {
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
				.person-chat-item-right-image {
					background: #eeeeee;
					box-shadow: none;
					&::after {
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
					image {
						min-width: 130rpx;
						min-height: 130rpx;
						border-radius: 5px;
					}
				}
				.person-chat-item-right-link {
					.link-left {
						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
					text {
						color: blue;
						font-weight: 200;
						font-style: italic;
						text-decoration: underline;
					}
				}
			}
			.person-chat-item-send {
				display: flex;
				margin: 0 10rpx 20rpx;
				justify-content: flex-end;
				min-width: 40%;
				flex-wrap: wrap;
				.sender-info {
					width: 75%;
					font-size: 24rpx;
					margin-bottom: 10rpx;
					text-align: right;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.sender-name {
						color: #999;
						margin-right: 10rpx;
					}
				}
				.map-container {
					width: 500rpx;
					background-color: #fff;
					border-radius: 5rpx;
					overflow: hidden;
					.map-info {
						padding: 20rpx;
						.address {
							font-size: 24rpx;
							color: #999;
							margin-top: 10rpx;
						}
					}
				}
				.unread {
					line-height: 86rpx;
					margin-right: 10rpx;
					font-size: 24rpx;
					color: #ccc;
				}
				.person-chat-item-left {
					image {
						width: 80rpx;
						height: 80rpx;
					}
					margin-left: 20rpx;
				}
				.person-chat-item-right {
					min-width: 40%;
					max-width: 60%;
					word-wrap: break-word;
					// background: #12b7f5;
					background-color: #12b7f5;
					color: #fff;
					border-radius: 5px;
					letter-spacing: 1px;
					padding: 5px 10px;
					font-size: var(--global-text-font-size);
					position: relative;
					display: flex;
					align-items: center;
					.link-left {
						margin-right: 16rpx;
						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
					.link-right {
						.link-right-item {
							display: flex;
							flex-direction: column;
							text {
								&:first-child {
									color: #000;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
								&:last-child {
									color: #ccc;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
							}
						}
					}
					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 5px solid transparent;
						border-bottom: 5px solid transparent;
						border-left: 8px solid #12b7f5;
						// border-left: 8px solid #12b7f5;
						position: absolute;
						right: -8px;
						top: 15px;
					}
				}
				.person-chat-item-right-image {
					background: #eeeeee;
					&::after {
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
					image {
						width: 130rpx;
						height: 130rpx;
						border-radius: 5px;
					}
				}
				.person-chat-item-right-link {
					display: flex;
					background-color: #eeeeee;
					background-color: #fff;
					box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
					align-items: center;
					.link-left {
						margin-right: 16rpx;
						image {
							width: 30rpx;
							height: 30rpx;
						}
					}
					.link-right {
						.link-right-item {
							display: flex;
							flex-direction: column;
							text {
								&:first-child {
									color: #000;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
								&:last-child {
									color: #ccc;
									font-weight: 700;
									font-style: normal;
									text-decoration: none;
									font-size: 14px;
								}
							}
						}
					}
					text {
						color: blue;
						font-weight: 200;
						font-style: italic;
						text-decoration: underline;
					}
					&::after {
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
		.person-chat-item-my {
			display: flex;
			justify-content: flex-end;
		}
	}
	.person-chat-bot {
		height: 60px;
		width: 100%;
		transition: all 0.15s linear;
		&.showLayer {
			height: 290px;
		}
		.person-chat-bot-top {
			background-color: #f7f7f7;
			box-shadow: 0px 1px 4px rgba(26, 26, 26, 0.2);
			width: 100%;
			display: flex;
			padding: 10px 10px 15px;
			align-items: center;
			.person-chat-left {
				width: calc(100% - 150rpx);
				display: flex;
				align-items: center;
				flex: 1;
				// margin-right: 30rpx;
				.image-icon {
					width: 50rpx;
					height: 50rpx;
					font-size: 50rpx;
					margin-right: 10rpx;
				}
				.send-text {
					height: 70rpx;
					padding: 2px 10rpx;
					transition: all 0.5s ease-out;
					flex: 1;
					width: 100%;
					background: #fff;
					border-radius: 10rpx;
					font-size: var(--global-text-font-size);
				}
				.is-feed {
					width: 85%;
				}
			}
			.person-chat-rig {
				text-align: right;
				display: flex;
				justify-content: flex-end;
				margin-left: 20rpx;
				.person-chat-rig-add-wrap {
					.person-chat-rig-add {
						margin: 0 auto;
						width: 50rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 30rpx;
						font-size: 60rpx;
					}
				}
				.send {
					background-color: #12b7f5;
					padding: 15rpx 40rpx;
					color: #fff;
					border-radius: 10rpx;
					margin-left: 10rpx;
					transition: all 0.5s ease-in;
				}
			}
		}
		.person-chat-bot-bot {
			display: flex;
			border-top: 1px solid #ccc;
			background-color: #f7f7f7;
			flex-wrap: wrap;
			&.showLayer {
				height: 230px;
			}
			.person-chat-bot-bot-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 20rpx;
				width: calc(25% - 20px);
				.person-chat-bot-bot-item-top {
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
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}
	}
}
.recode-poup {
	height: calc(100vh - 150px);
	overflow-y: auto;
	.recode-poup-list {
		display: flex;
		flex-direction: column;
	}
}
.contentType2 {
	display: flex;
	flex-direction: row;
	align-items: center;
	.voice_icon_right-wrap {
		background-color: #12b7f5;
		padding: 16rpx;
		min-width: 150rpx;
		border-radius: 8rpx;
		position: relative;
		display: flex;
		justify-content: flex-end;
		&::after {
			content: '';
			display: block;
			width: 0;
			height: 0;
			border-top: 5px solid transparent;
			border-bottom: 5px solid transparent;
			border-left: 8px solid #12b7f5;
			position: absolute;
			border-radius: 1px;
			right: -7px;
			top: 16rpx;
		}
	}
	.voice_icon_left-wrap {
		background-color: #fff;
		padding: 16rpx;
		min-width: 150rpx;
		border-radius: 8rpx;
		position: relative;
		display: flex;
		box-shadow: 2px 1px 2px rgba(26, 26, 26, 0.2);
		&::after {
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
	.audio {
		/deep/ .uni-audio-default {
			height: 0 !important;
			border: none;
		}
	}
	.voice_icon {
		height: 34rpx;
		width: 34rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		.icon::after {
			content: ' ';
			width: 32rpx;
			height: 32rpx;
			border-radius: 100%;
			// position: absolute;
			position: relative;
			box-sizing: border-box;
		}
	}
	.voice_icon_right {
		background-color: #fff;
		background-image: url(../../static/voice-r.jpg);
		margin-left: 10rpx;
		margin-right: 10rpx;
	}
	.voice_icon_left {
		background-image: url(../../static/voice%20L.jpg);
		background-color: #000000;
		margin-right: 10rpx;
		margin-left: 10rpx;
	}
	.voice_icon_right_an {
		animation: voiceAn_right 1s linear reverse infinite;
	}
	.voice_icon_left_an {
		animation: voiceAn_left 1s linear normal infinite;
	}
	@keyframes voiceAn_right {
		0% {
			background-color: transparent;
			background-size: 100% 100%;
		}
		50% {
			background-size: 50% 100%;
		}
		100% {
			background-size: 0% 100%;
			background-color: #fff;
		}
	}
	@keyframes voiceAn_left {
		0% {
			background-color: transparent;
			background-size: 0% 100%;
		}
		50% {
			background-size: 50% 100%;
		}
		100% {
			background-color: #000;
			background-size: 100% 100%;
		}
	}
}
.voice_title {
	text-align: center;
	background-color: #ffffff;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 12rpx;
	flex: 1;
}
.documents-wrap {
	.documents-item {
		display: flex;
		background-color: white;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		border: 1px solid #ccc;
		max-width: 450rpx;
		.documents-item-left {
			margin-right: 30rpx;
			max-width: 280rpx;
			overflow: hidden;
			white-space: normal;
			text-overflow: ellipsis;
		}
		.documents-item-right {
			image {
				width: 85rpx;
				height: 85rpx;
			}
		}
	}
}
.voice_an {
	width: 300rpx;
	height: 300rpx;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -55%);
	background-color: rgba(41, 41, 41, 0.7);
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	border-radius: 10rpx;
	.text {
		padding-top: 30rpx;
	}
	@keyframes runVoice {
		0% {
			height: 10%;
		}
		20% {
			height: 50%;
		}
		50% {
			height: 100%;
		}
		80% {
			height: 50%;
		}
		100% {
			height: 0%;
		}
	}
	.wave {
		width: 6rpx;
		height: 100%;
		margin-left: 10rpx;
		border-radius: 50rpx;
		background-color: #999;
		vertical-align: middle;
		display: inline-block;
	}
	.voice_an_icon {
		width: 200rpx;
		height: 100rpx;
		line-height: 50rpx;
		margin: 50rpx 0;
	}
}
.one {
	animation: runVoice 0.6s infinite 0.1s;
}
.two {
	animation: runVoice 0.6s infinite 0.3s;
}
.three {
	animation: runVoice 0.6s infinite 0.6s;
}
.four {
	animation: runVoice 0.6s infinite 0.1s;
}
.five {
	animation: runVoice 0.6s infinite 0.3s;
}
.six {
	animation: runVoice 0.6s infinite 0.6s;
}
.seven {
	animation: runVoice 0.6s infinite 0.1s;
}
.chart-bottom {
	width: 100vw;
	height: 20px;
}
</style>
