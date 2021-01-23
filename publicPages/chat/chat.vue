<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view
				class="msg-list"
				scroll-y="true"
				:scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollToView"
				@scrolltoupper="loadHistory"
				upper-threshold="50"
			>
				<!-- 加载历史数据waitingUI -->
				<view class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + row.msg.id">
					<!-- 系统消息 -->
					<block>
						<view class="send-time" v-if="showSendTime(row, index)">{{ formateDate(row.create_time, false) }}</view>
					</block>
					<block v-if="row.type == 'system'">
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.msg.type == 'text'" class="text">{{ row.msg.content.text }}</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="row.type == 'user'">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.uid == myuid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type == 'text'" class="bubble"><rich-text :nodes="row.msg.content.text"></rich-text></view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type == 'voice'" class="bubble voice" @tap="playVoice(row.msg)" :class="playMsgid == row.msg.id ? 'play' : ''">
									<view class="length">{{ row.msg.content.length }}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type == 'img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url" :style="{ width: row.msg.content.w + 'px', height: row.msg.content.h + 'px' }"></image>
								</view>
								<!-- 视频消息 -->
								<view v-if="row.msg.type == 'video'" class="bubble img" @tap="showPic(row.msg)">
									<video :src="row.msg.content.url" :style="{ width: row.msg.content.w + 'px', height: row.msg.content.h + 'px' }"></video>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right"><image :src="row.msg.userinfo.face"></image></view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid != myuid">
							<!-- 左-头像 -->
							<view class="left"><image :src="row.msg.userinfo.face"></image></view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{ row.msg.userinfo.username }}</view>
									<view class="time">{{ row.msg.time }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type == 'text'" class="bubble"><rich-text :nodes="row.msg.content.text"></rich-text></view>
								<!-- 语音消息 -->
								<view v-if="row.msg.type == 'voice'" class="bubble voice" @tap="playVoice(row.msg)" :class="playMsgid == row.msg.id ? 'play' : ''">
									<view class="icon other-voice"></view>
									<view class="length">{{ row.msg.content.length }}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type == 'img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url" :style="{ width: row.msg.content.w + 'px', height: row.msg.content.h + 'px' }"></image>
								</view>
								<!-- 视频消息 -->
								<view v-if="row.msg.type == 'video'" class="bubble img">
									<video :src="row.msg.content.url" :style="{ width: row.msg.content.w + 'px', height: row.msg.content.h + 'px' }"></video>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 更多功能 相册-拍照-位置-语音 -->
			<view class="more-layer" :class="{ hidden: hideMore }">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<view class="box" @tap="handRedEnvelopes"><view class="icon hongbao"></view></view>
					<!-- <view class="box" @tap="yuyintonghua"><image style="font-size:16px;width: 32px; height: 32px;" src="../../static/img/more/yuyintonghua.png"></image></view> -->
					<!-- <view class="box" @tap="weizhi"><image style="font-size:16px;width: 32px; height: 32px;" src="../../static/img/more/weizhi.png"></image></view> -->
					<!-- <view class="box" @tap="yuyinshuru"><image style="font-size:16px;width: 32px; height: 32px;" src="../../static/img/more/yuyinshuru.png"></image></view> -->
					<!-- <view class="box" @tap="handRedEnvelopes">
						<image style="font-size:16px;width: 32px; height: 28px;" src="../../static/img/more/文件.png"></image>
					</view> -->
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice"><view class="icon" :class="isVoice ? 'jianpan' : 'yuyin'" @tap="switchVoice"></view></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="textbox">
				<view
					class="voice-mode"
					:class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
					@touchstart="voiceBegin"
					@touchmove.stop.prevent="voiceIng"
					@touchend="voiceEnd"
					@touchcancel="voiceCancel"
				>
					{{ voiceTis }}
				</view>
				<view class="text-mode" :class="isVoice ? 'hidden' : ''">
					<view class="box"><textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" /></view>
					<view class="em" @tap="chooseEmoji"><view class="icon biaoqing"></view></view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText"><view class="btn">发送</view></view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording ? '' : 'hidden'">
			<view class="ing" :class="willStop ? 'hidden' : ''"><view class="icon luyin2"></view></view>
			<view class="cancel" :class="willStop ? '' : 'hidden'"><view class="icon chehui"></view></view>
			<view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	data() {
		return {
			msgPage: {
				rownumber: 20,
				total: 0,
				pageNo: 1
			},
			groupInfo: {
				create_time: '2021-01-07 17:22:18',
				modify_user_disp: null,
				modify_user: null,
				create_user_disp: '可苦可乐/okMrXs-zyQb_v-wkKRC4ClS8dviA',
				modify_time: '2021-01-07 17:22:18',
				icon: '20210107172215427100',
				name: '科学减脂',
				create_user: 'okMrXs-zyQb_v-wkKRC4ClS8dviA',
				id: 4,
				gc_no: 'GC202101071722180004',
				group_role: '用户',
				latest_sign_in_time: '2021-01-21 18:26:56',
				pg_no: 'PG202101211815580024',
				lastChatState: '未读',
				lastChatTime: '2021-01-21 18:20:56',
				lastChatText: '123'
			},
			//文字消息
			textMsg: '',
			//消息列表
			isHistoryLoading: false,
			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			msgList: [],
			msgImgList: [],
			myuid: 0,
			//录音相关参数
			// #ifndef H5
			//H5不能录音
			RECORDER: uni.getRecorderManager(),
			// #endif
			isVoice: false,
			voiceTis: '按住 说话',
			recordTis: '手指上滑 取消发送',
			recording: false,
			willStop: false,
			initPoint: { identifier: 0, Y: 0 },
			recordTimer: null,
			recordLength: 0,
			//播放语音相关参数
			AUDIO: uni.createInnerAudioContext(),
			playMsgid: null,
			VoiceTimer: null,
			// 抽屉参数
			popupLayerClass: '',
			// more参数
			hideMore: true,
			//表情定义
			hideEmoji: true,
			emojiList: [{}],
			emojiPath: '',
			//红包相关参数
			windowsState: '',
			redenvelopeData: {
				rid: null, //红包ID
				from: null,
				face: null,
				blessing: null,
				money: null
			}
		};
	},
	onLoad(option) {
		if (option.group_no) {
			this.getGroupInfo(option.group_no).then(info => {
				this.getInitMsgList();
			});
		}
		// this.getMsgList();
		//语音自然播放结束
		this.AUDIO.onEnded(res => {
			this.playMsgid = null;
		});
		// #ifndef H5
		//录音开始事件
		this.RECORDER.onStart(e => {
			this.recordBegin(e);
		});
		//录音结束事件
		this.RECORDER.onStop(e => {
			this.recordEnd(e);
		});
		// #endif
	},

	onShow() {
		this.scrollTop = 9999999;
	},
	methods: {
		async getPersonGroupInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_group_circle_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'gc_no',
						ruleType: 'eq',
						value: no
					}
				]
			};
			let res = await this.$http.post(url, req);
		},
		async getGroupInfo(no) {
			// 查找圈子信息
			let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_group_circle_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'gc_no',
						ruleType: 'eq',
						value: no
					}
				],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.groupInfo = res.data.data[0];
				if (this.groupInfo.name) {
					uni.setNavigationBarTitle({
						title: this.groupInfo.name
					});
				}
				return res.data.data[0];
			}
		},
		showSendTime(item, index) {
			// 此条消息记录上方是否显示发送时间 上一条消息和当前消息发送时间不在同一分钟 则显示
			if (index === 0) {
				return true;
			} else if (index >= 1) {
				return this.formateDate(item.create_time, 'normal') !== this.formateDate(this.msgList[index - 1].create_time, 'normal');
			}
		},
		// 接受消息(筛选处理)
		screenMsg(msg) {
			//从长连接处转发给这个方法，进行筛选处理
			if (msg.type == 'system') {
				// 系统消息
				switch (msg.msg.type) {
					case 'text':
						this.addSystemTextMsg(msg);
						break;
					case 'redEnvelope':
						this.addSystemRedEnvelopeMsg(msg);
						break;
				}
			} else if (msg.type == 'user') {
				// 用户消息
				switch (msg.msg.type) {
					case 'text':
						this.addTextMsg(msg);
						break;
					case 'voice':
						this.addVoiceMsg(msg);
						break;
					case 'img':
						this.addImgMsg(msg);
						break;
					case 'redEnvelope':
						this.addRedEnvelopeMsg(msg);
						break;
				}
				// console.log('用户消息');
				//非自己的消息震动
				if (msg.msg.userinfo.uid != this.myuid) {
					// console.log('振动');
					uni.vibrateLong();
				}
			}
			this.$nextTick(function() {
				// 滚动到底
				this.scrollToView = 'msg' + msg.msg.id;
			});
		},

		//触发滑动到顶部(加载历史信息记录)
		loadHistory(e) {
			if (this.isHistoryLoading) {
				return;
			}
			this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
			this.scrollAnimation = false; //关闭滑动动画
			let Viewid = this.msgList[0].msg.id; //记住第一个信息ID
			//本地模拟请求历史记录效果
			setTimeout(() => {
				// 消息列表
				let list = [];
				// 获取消息中的图片,并处理显示尺寸
				for (let i = 0; i < list.length; i++) {
					if (list[i].type == 'user' && list[i].msg.type == 'img') {
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.unshift(list[i].msg.content.url);
					}
					list[i].msg.id = Math.floor(Math.random() * 1000 + 1);
					this.msgList.unshift(list[i]);
				}

				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				this.$nextTick(function() {
					this.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
					this.$nextTick(function() {
						this.scrollAnimation = true; //恢复滚动动画
					});
				});
				this.isHistoryLoading = false;
			}, 1000);
		},
		async getInitMsgList() {
			// 初次进入页面加载消息
			if (!this.groupInfo.gc_no) {
				return;
			}
			if (this.userInfo && this.userInfo.no) {
				this.myuid = this.userInfo.no;
			}
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [{ colName: 'rcv_group_no', ruleType: 'eq', value: this.groupInfo.gc_no }],
				order: [{ colName: 'create_time', orderType: 'desc' }],
				page: { rownumber: this.msgPage.rownumber, pageNo: this.msgPage.pageNo }
			};
			let res = await this.$fetch('select', 'srvhealth_consultation_chat_record_select', req, 'health');
			if (res.success) {
				let list = res.data.map(item => {
					let type = '';
					switch (item.msg_content_type) {
						case '文本':
							type = 'text';
							break;
						case '链接':
							type = 'link';
							break;
						case '图片':
							type = 'img';
							break;
						case '语音':
							type = 'voice';
							break;
						case '文件':
							type = 'file';
							break;
						case '视频':
							type = 'video';
							break;
						case '位置':
							type = 'location';
							break;
					}
					return {
						type: 'user',
						create_time: item.create_time,
						msg: {
							id: item.id,
							type: type,
							content: {
								text: item.msg_content,
								url: type === 'img' ? this.getImagePath(item.image) : type === 'video' ? this.getVideoPath(item.video) : ''
							},
							userinfo: {
								uid: item.sender_person_no,
								username: item.sender_name,
								face: this.getImagePath(item.sender_profile_url) ? this.getImagePath(item.sender_profile_url) : '/static/man-profile.png'
							}
						}
					};
				});
				// 获取消息中的图片,并处理显示尺寸
				for (let i = 0; i < list.length; i++) {
					if (list[i].type == 'user') {
						if (list[i].msg.type == 'img') {
							let picInfo = await this.getImageInfo({ url: list[i].msg.content.url });
							picInfo.url = picInfo.src;
							list[i].msg.content = this.setPicSize(picInfo);
							this.msgImgList.push(list[i].msg.content.url);
						} else if (list[i].msg.type == 'video') {
							// let picInfo = await this.getVideoInfo(list[i].msg.content.url);
							// picInfo.url = picInfo.src;
							// list[i].msg.content = this.setPicSize(picInfo);
							// this.msgImgList.push(list[i].msg.content.url);
						}
					}
				}
				this.msgList = list.reverse();
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
				});
			}
		},
		// 加载初始页面消息
		getMsgList() {
			// 消息列表
			let list = [
				{ type: 'system', msg: { id: 0, type: 'text', content: { text: '欢迎进入聊天室' } } },
				{
					type: 'user',
					msg: { id: 1, type: 'text', time: '12:56', userinfo: { uid: 0, username: '大黑哥', face: '/static/img/face.jpg' }, content: { text: '为什么温度会相差那么大？' } }
				},
				{
					type: 'user',
					msg: {
						id: 2,
						type: 'text',
						time: '12:57',
						userinfo: { uid: 1, username: '售后客服008', face: '/static/img/im/face/face_2.jpg' },
						content: { text: '这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。' }
					}
				},
				{
					type: 'user',
					msg: {
						id: 3,
						type: 'voice',
						time: '12:59',
						userinfo: { uid: 1, username: '售后客服008', face: '/static/img/im/face/face_2.jpg' },
						content: { url: '/static/voice/1.mp3', length: '00:06' }
					}
				},
				{
					type: 'user',
					msg: {
						id: 4,
						type: 'voice',
						time: '13:05',
						userinfo: { uid: 0, username: '大黑哥', face: '/static/img/face.jpg' },
						content: { url: '/static/voice/2.mp3', length: '00:06' }
					}
				}
			];
			// 获取消息中的图片,并处理显示尺寸
			for (let i = 0; i < list.length; i++) {
				if (list[i].type == 'user' && list[i].msg.type == 'img') {
					list[i].msg.content = this.setPicSize(list[i].msg.content);
					this.msgImgList.push(list[i].msg.content.url);
				}
			}
			this.msgList = list;
			// 滚动到底部
			this.$nextTick(function() {
				//进入页面滚动到底部
				this.scrollTop = 9999;
				this.$nextTick(function() {
					this.scrollAnimation = true;
				});
			});
		},
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

		//更多功能(点击+弹出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
		},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		//拍照发送
		camera() {
			this.getImage('camera');
		},
		//发红包
		handRedEnvelopes() {
			uni.navigateTo({
				url: 'HM-hand/HM-hand'
			});
			this.hideDrawer();
		},
		//选照片 or 拍照
		getImage(type) {
			this.hideDrawer();
			uni.chooseImage({
				sourceType: [type],
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: res => {
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						uni.getImageInfo({
							src: res.tempFilePaths[i],
							success: image => {
								// console.log(image.width);
								// console.log(image.height);
								let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
								this.sendMsg(msg, 'img');
							}
						});
					}
				}
			});
		},
		//获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus() {
			if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
				this.hideDrawer();
			}
		},
		// 发送文字消息
		sendText() {
			uni.showToast({
				title: '发送文本消息',
				icon: 'none'
			});
			this.hideDrawer(); //隐藏抽屉
			if (!this.textMsg) {
				return;
			}
			let content = this.replaceEmoji(this.textMsg);
			let msg = { text: content };
			this.sendMsg(msg, 'text');
			this.textMsg = ''; //清空输入框
		},
		//替换表情符号为图片
		replaceEmoji(str) {
			// 正则表达式匹配内容
			let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
				// console.log("item: " + item);
				for (let i = 0; i < this.emojiList.length; i++) {
					let row = this.emojiList[i];
					for (let j = 0; j < row.length; j++) {
						let EM = row[j];
						if (EM.alt == item) {
							//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
							//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
							// let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
							// let imgstr = '<image src="'+onlinePath+this.onlineEmoji[EM.url]+'">';

							let onlinePath = this.emojiPath;
							let imgstr = '<img style="width:24px;height:24px;" src="' + onlinePath + EM.url + '">';
							// console.log("imgstr: " + imgstr);
							return imgstr;
						}
					}
				}
			});
			return '<div style="align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
		},
		// 发送消息
		async sendMessage(msg) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data: [
						// {
						// 	sender_account: this.userInfo.userno,
						// 	sender_name: this.userInfo.name,
						// 	sender_profile_url: this.userInfo.profile_url,
						// 	sender_user_image: this.userInfo.user_image,
						// 	receiver_account:  this.userInfo.userno,
						// 	receiver_person_no: this.userInfo.no,
						// 	sender_person_no: this.userInfo.no,
						// 	msg_content_type: !this.isSendLink ? '文本' : '链接',
						// 	identity: this.pageType ? '患者' : '医生'
						// }
					]
				}
			];
			// if (this.pageType === 'groupChat') {
			// 群组聊天
			req[0].data[0] = {
				sender_account: this.userInfo.userno,
				sender_name: this.userInfo.name,
				sender_profile_url: this.userInfo.profile_url,
				sender_user_image: this.userInfo.user_image,
				sender_group_role: this.groupInfo.group_role,
				rcv_group_no: this.groupInfo.gc_no,
				receiver_account: this.groupInfo.gc_no,
				receiver_person_no: this.groupInfo.gc_no,
				sender_person_no: this.userInfo.no,
				msg_content_type: '文本',
				identity: this.groupInfo.group_role
			};
			// }
			// if (!this.isSendLink) {
			req[0].data[0].msg_content = this.textMsg;
			// } else {
			// 	req[0].data[0].msg_link = this.chooseRecod;
			// }
			if (msg && msg.msg && msg.msg.type === 'voice') {
				let url = msg.msg.content.url;
				if (url) {
					let result = await this.toUploadFile(url);
				} else {
					return;
				}
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.$emit('completeSendMessage', req[0].data[0]);
				this.getInitMsgList();
			}
		},
		 toUploadFile(filePath) {
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
			return new Promise((resolve,reject)=>{
				uni.uploadFile({
					url: self.$api.upload,
					header: reqHeader,
					formData: formData,
					filePath: filePath,
					name: 'file',
					success: e => {
						if (e.statusCode === 200) {
							debugger
						}
					}
				});
			})
			
		},
		// 发送消息
		sendMsg(content, type) {
			//实际应用中，此处应该提交长连接，模板仅做本地处理。
			var nowDate = new Date();
			let lastid = this.msgList[this.msgList.length - 1].msg.id;
			lastid++;
			let msg = {
				type: 'user',
				create_time: this.formateDate('', 'full'),
				msg: {
					id: lastid,
					// time: nowDate.getHours() + ':' + nowDate.getMinutes(),
					type: type,
					userinfo: { uid: this.userInfo.no, username: this.userInfo.name, face: this.getImagePath(this.userInfo.profile_url) },
					content: content
				}
			};
			// 发送消息
			this.screenMsg(msg);
			debugger;
			this.sendMessage(msg);
			// // 定时器模拟对方回复,三秒
			// setTimeout(() => {
			// 	lastid = this.msgList[this.msgList.length - 1].msg.id;
			// 	lastid++;
			// 	msg = {
			// 		type: 'user',
			// 		msg: {
			// 			id: lastid,
			// 			time: nowDate.getHours() + ':' + nowDate.getMinutes(),
			// 			type: type,
			// 			userinfo: { uid: 1, username: '售后客服008', face: '/static/img/im/face/face_2.jpg' },
			// 			content: content
			// 		}
			// 	};
			// 	// 本地模拟发送消息
			// 	this.screenMsg(msg);
			// }, 3000);
		},

		// 添加文字消息到列表
		addTextMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加语音消息到列表
		addVoiceMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加图片消息到列表
		addImgMsg(msg) {
			msg.msg.content = this.setPicSize(msg.msg.content);
			this.msgImgList.push(msg.msg.content.url);
			this.msgList.push(msg);
		},
		addRedEnvelopeMsg(msg) {
			this.msgList.push(msg);
		},
		// 添加系统文字消息到列表
		addSystemTextMsg(msg) {
			this.msgList.push(msg);
		},
		sendSystemMsg(content, type) {
			let lastid = this.msgList[this.msgList.length - 1].msg.id;
			lastid++;
			let row = { type: 'system', msg: { id: lastid, type: type, content: content } };
			this.screenMsg(row);
		},
		// 预览图片
		showPic(msg) {
			uni.previewImage({
				indicator: 'none',
				current: msg.content.url,
				urls: this.msgImgList
			});
		},
		// 播放语音
		playVoice(msg) {
			this.playMsgid = msg.id;
			this.AUDIO.src = msg.content.url;
			this.$nextTick(function() {
				this.AUDIO.play();
			});
		},
		// 录音开始
		voiceBegin(e) {
			if (e.touches.length > 1) {
				return;
			}
			this.initPoint.Y = e.touches[0].clientY;
			this.initPoint.identifier = e.touches[0].identifier;
			this.RECORDER.start({ format: 'mp3' }); //录音开始,
		},
		//录音开始UI效果
		recordBegin(e) {
			this.recording = true;
			this.voiceTis = '松开 结束';
			this.recordLength = 0;
			this.recordTimer = setInterval(() => {
				this.recordLength++;
			}, 1000);
		},
		// 录音被打断
		voiceCancel() {
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.willStop = true; //不发送录音
			this.RECORDER.stop(); //录音结束
		},
		// 录音中(判断是否触发上滑取消发送)
		voiceIng(e) {
			if (!this.recording) {
				return;
			}
			let touche = e.touches[0];
			//上滑一个导航栏的高度触发上滑取消发送
			if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
				this.willStop = true;
				this.recordTis = '松开手指 取消发送';
			} else {
				this.willStop = false;
				this.recordTis = '手指上滑 取消发送';
			}
		},
		// 结束录音
		voiceEnd(e) {
			if (!this.recording) {
				return;
			}
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.RECORDER.stop(); //录音结束
		},
		//录音结束(回调文件)
		recordEnd(e) {
			clearInterval(this.recordTimer);
			if (!this.willStop) {
				// console.log("e: " + JSON.stringify(e));
				let msg = {
					length: 0,
					url: e.tempFilePath
				};
				let min = parseInt(this.recordLength / 60);
				let sec = this.recordLength % 60;
				min = min < 10 ? '0' + min : min;
				sec = sec < 10 ? '0' + sec : sec;
				msg.length = min + ':' + sec;
				this.sendMsg(msg, 'voice');
			} else {
				// console.log('取消发送录音');
			}
			this.willStop = false;
		},
		// 切换语音/文字输入
		switchVoice() {
			this.hideDrawer();
			this.isVoice = this.isVoice ? false : true;
		},
		discard() {
			return;
		}
	}
};
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
