<template>
	<view
		class="form-item"
		v-if="fieldData.display"
		:class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid, 'flex-column': labelPosition === 'top' || label_width === '100%' }"
	>
		<label
			:for="fieldData.column"
			class="form-item-label"
			:class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid, 'label-top': labelPosition === 'top' || label_width === '100%' }"
			:style="{ width: label_width, 'align-items': labelAlign ? labelAlign : 'left', 'background-color': labelPosition === 'left' ? '' : '' }"
		>
			<text class="cuIcon-titles text-cyan"></text>
			<text class="text-red is-required" v-if="fieldData.isRequire">{{ fieldData.isRequire ? '*' : '' }}</text>
			<text class="label" :for="fieldData.column">{{ fieldData.label }}</text>
		</label>
		<view class="form-item-content" :class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid, 'label-top': labelPosition === 'top' || label_width === '100%' }">
			<!-- detail-详情-start -->
			<view class="form-item_image" v-if="pageType === 'detail' && fieldData.type === 'images'">
				<image
					class="form-item-content_detail image"
					v-if="fieldData.type === 'images'"
					v-for="(item, index) in imagesUrl"
					:key="index"
					style="padding: 5upx;"
					@tap="previewImage(item, 'Image')"
					data-target="Image"
					:src="item"
				></image>
			</view>
			<view class="form-item-content_detail rich-text" v-html="field.value" v-else-if="pageType === 'detail' && (field.type === 'snote' || field.type === 'Note')"></view>
			<view class="form-item-content_detail text" v-else-if="pageType === 'detail'">{{ fieldData.value | formalText }}</view>
			<!-- detail-详情-end -->
			<!-- form-item-start -->
			<bx-radio-group class="form-item-content_value radio-group" :mode="optionMode" v-model="fieldData.value" v-else-if="fieldData.type === 'radio'" @change="radioChange">
				<bx-radio class="radio" color="#2979ff" v-for="item in fieldData.options" :disabled="fieldData.disabled ? fieldData.disabled : false" :name="item">{{ item }}</bx-radio>
			</bx-radio-group>
			<bx-radio-group class="form-item-content_value radio-group" :mode="optionMode" v-model="fieldData.value" v-else-if="fieldData.type === 'radioFk'" @change="radioChange">
				<bx-radio
					:iconSize="fieldData.iconSize"
					class="radio"
					color="#2979ff"
					v-for="item in fieldData.options"
					:disabled="fieldData.disabled ? fieldData.disabled : false"
					:name="item.value"
					:serial-char="item.serialChar"
				>
					{{ item.label }}
				</bx-radio>
			</bx-radio-group>
			<checkbox-group name="checkbox-group" class="form-item-content_value checkbox-group" v-else-if="fieldData.type === 'checkbox'">
				<label v-for="(item, index) in fieldData.options" :key="index" class="checkbox">
					<checkbox color="#2979ff" :value="item" :disabled="fieldData.disabled ? fieldData.disabled : false" :checked="fieldData.value.indexOf(item) !== -1" />
					<text style="flex: 1;" class="text">{{ item }}</text>
				</label>
			</checkbox-group>
			<bx-checkbox-group
				:mode="optionMode"
				v-model="fieldData.value"
				class="form-item-content_value checkbox-group"
				v-else-if="fieldData.type === 'checkboxFk'"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
			>
				<bx-checkbox v-model="item.checked" v-for="item in fieldData.options" :name="item.label">{{ item.label }}</bx-checkbox>
			</bx-checkbox-group>
			<view class="form-item-content_value" v-else-if="popupFieldTypeList.includes(fieldData.type)">
				<view v-if="(setOptionList.length < 15 && fieldData.type === 'Set') || (selectorData.length < 5 && fieldData.type === 'Selector')">
					<bx-checkbox-group v-if="fieldData.type === 'Set'" class="form-item-content_value checkbox-group" v-model="fieldData.value" mode="button">
						<bx-checkbox v-for="item in setOptionList" :name="item.value" v-model="item.checked">{{ item.label }}</bx-checkbox>
					</bx-checkbox-group>
					<bx-radio-group v-if="fieldData.type === 'Selector'" class="form-item-content_value radio-group" v-model="fieldData.value" mode="button" @change="pickerChange">
						<bx-radio v-for="item in selectorData" :name="item.value">{{ item.label }}</bx-radio>
					</bx-radio-group>
				</view>
				<view v-else @click="openModal(fieldData.type)">
					<text class="place-holder" v-if="!fieldData.value">请选择</text>
					<view class="value hidden" v-else-if="fieldData.value && isArray(fieldData.value)">{{ fieldData.value.toString() }}</view>
					<view class="value hidden" v-else-if="fieldData.value">{{ fieldData.value }}</view>
					<text class="value hidden" v-else>{{ fkFieldLabel ? fkFieldLabel : '' }}</text>
				</view>
			</view>
			<view class="form-item-content_value picker" v-else-if="pickerFieldList.includes(fieldData.type)">
				<picker class="uni-picker" :mode="pickerMode" :end="fieldData.end" :value="fieldData.value" @change="bindTimeChange">
					<view class="picker-content">
						<view class="place-holder" v-if="!fieldData.value">请选择</view>
						<view class="value" v-else>{{ fieldData.value }}</view>
						<text class="cuIcon-calendar"></text>
					</view>
				</picker>
			</view>

			<view class="form-item-content_value textarea" v-else-if="fieldData.type === 'textarea'">
				<textarea class="textarea-content" auto-height :adjust-position="false" :show-confirm-bar="false" v-model="fieldData.value" :placeholder="'请输入'"></textarea>
			</view>
			<view class="form-item-content_value location" v-else-if="fieldData.type === 'addr' || fieldData.type === 'location'" @click="getLocation">
				{{ fieldData.value || '点击选择地理位置' }}
			</view>
			<view class="voice" v-else-if="fieldData.type === 'voice'">
				<button class="bg-white cu-btn" @click="showModal('voice')">{{ fieldData.value ? '点击查看录音' : '点击添加录音' }}</button>
			</view>
			<view class="form-item-content_value picker" v-else-if="fieldData.type === 'RichText'" @click="showModal('RichEditor')">
				<text class="place-holder" v-if="!fieldData.value">点击输入</text>
				<view class="value" v-else>{{ fieldData.value | html2text }}</view>
			</view>
			<input
				class="form-item-content_value"
				@blur="onBlur"
				:adjust-position="true"
				:type="fieldData.type"
				:placeholder="'请输入'"
				@input="onInput"
				:maxlength="fieldData.item_type_attr && fieldData.item_type_attr.max_len ? fieldData.item_type_attr.max_len : 999"
				:max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
				:min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
				v-model.number="fieldData.value"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
				v-else-if="((fieldData.type === 'number' || fieldData.type === 'digit') && !fieldData.max) || fieldData.type === 'text'"
			/>
			<view class="form-item-content_value slider" v-else-if="(fieldData.type === 'number' || fieldData.type === 'digit') && fieldData.max">
				<view class="operate" hover-class="active" @click="numberChange('minus')" @longpress="longpressNumChange('minus')" @touchend="longpressNumEnd">-</view>
				<slider
					class="uni-slider"
					@change="changeSlider"
					:step="fieldData.sliderStep ? fieldData.sliderStep : fieldData.type === 'digit' ? 0.5 : 1"
					:min="fieldData.value && fieldData.value >= fieldData.min ? fieldData.min : 0"
					:max="fieldData.max ? (fieldData.value > fieldData.max ? fieldData.value : fieldData.max) : null"
					:value="fieldData.value < fieldData.min ? fieldData.min : fieldData.value"
					v-model="fieldData.value"
					show-value
				/>
				<view class="operate" hover-class="active" @click="numberChange('add')" @longpress="longpressNumChange('add')" @touchend="longpressNumEnd">+</view>
			</view>
			<robby-image-upload
				class="form-item-content_value image"
				v-else-if="fieldData.type === 'images'"
				:value="imagesUrl"
				:enable-del="fieldData.disabled ? !fieldData.disabled : true"
				:enable-add="fieldData.disabled ? !fieldData.disabled : true"
				:server-url="uploadUrl"
				@delete="deleteImage"
				@add="getImagesInfo"
				:form-data="uploadFormData"
				:header="reqHeader"
				:showUploadProgress="true"
				:server-url-delete-image="deleteUrl"
				:limit="fieldData.fileNum"
			></robby-image-upload>
		</view>
		<view class="icon-area" v-if="fieldData.type === 'location' || fieldData.type === 'addr'"><text class="cuIcon-locationfill text-blue" @click="getLocation"></text></view>
		<view class="valid_msg" v-show="!valid.valid">{{ valid.msg }}</view>
		<view class="cu-modal bottom-modal" :class="{ show: modalName === 'RichEditor' }" @click="hideModal">
			<view class="cu-dialog" @tap.stop=""><jin-edit :html="textareaValue" @editOk="saveRichText" ref="richEditor" /></view>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'TextArea' }" @click="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<textarea class="textarea" auto-height v-model="fieldData.value" :placeholder="'请输入'"></textarea>
				<view class="button-box"><view class="cu-btn button bg-cyan" @click="saveRichText({ isSave: true, type: 'textarea' })">确定</view></view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: modalName === 'TreeSelector' }" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="tree-selector cascader" v-if="modalName === 'TreeSelector'">
					<cascader-selector @getCascaderValue="getCascaderValue" :srvInfo="fieldData.srvInfo"></cascader-selector>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: modalName === 'Selector' || modalName === 'MultiSelector' }">
			<view class="cu-dialog" @tap.stop="">
				<view class="tree-selector">
					<view class="content">
						<view class="cu-bar search bg-white" v-if="modalName === 'Selector' && fieldData.showSearch !== false">
							<view class="search-form round" v>
								<text class="cuIcon-search"></text>
								<input @input="searchFKDataWithKey" :adjust-position="false" type="text" placeholder="搜索" confirm-type="search" />
							</view>
						</view>
						<bx-checkbox-group v-if="modalName === 'MultiSelector'" class="form-item-content_value checkbox-group" v-model="fieldData.value" mode="button">
							<bx-checkbox v-for="item in setOptionList" :key="item.label" :name="item.value" v-model="item.checked">{{ item.label }}</bx-checkbox>
						</bx-checkbox-group>
						<bx-radio-group v-if="modalName === 'Selector'" class="form-item-content_value radio-group" v-model="fieldData.value" mode="button" @change="pickerChange">
							<bx-radio v-for="item in selectorData" :name="item.value">{{ item.label }}</bx-radio>
						</bx-radio-group>
					</view>
					<view class="dialog-button">
						<view class="cu-btn bg-blue shadow" @tap="hideModal" v-if="modalName === 'MultiSelector'">确定</view>
						<view class="cu-btn bg-grey shadow" @tap="hideModal" v-if="modalName === 'Selector'">取消</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'voice' }" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="voice-modal">
					<view class="voice-list">
						<audio :src="item" controls v-for="item in voiceUrl" :key="item"></audio>
						<!-- <view class="voice-item cu-btn" v-for="item in voiceUrls" @click="playVoice(item.url)">{{ item.time }}</view> -->
					</view>
					<view class="loading">
						<view class="spinner">
							<view class="rect1" :class="{ rect: onRecord }"></view>
							<view class="rect2" :class="{ rect: onRecord }"></view>
							<view class="rect3" :class="{ rect: onRecord }"></view>
							<view class="rect4" :class="{ rect: onRecord }"></view>
							<view class="rect5" :class="{ rect: onRecord }"></view>
						</view>
					</view>
					<view class="button-box">
						<button class="cu-btn bg-blue" @click="startRecord"><text class="cuIcon-playfill">开始录音</text></button>
						<button class="cu-btn bg-red" @click="stopRecord"><text class="cuIcon-stop">停止录音</text></button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let recorderManager = null;
let innerAudioContext = null;

export default {
	name: 'aFormItem',
	filters: {
		html2text: function(value) {
			return value
				.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '')
				.replace(/<[^>]+?>/g, '')
				.replace(/\s+/g, ' ')
				.replace(/ /g, ' ')
				.replace(/>/g, ' ');
		},
		formalText(val) {
			if (Array.isArray(val)) {
				val = val.toString();
			} else if (typeof val === 'string') {
				val = val;
			} else if (typeof val === 'object') {
				val = JSON.stringify(val);
			} else if (!val) {
				val = '';
			}
			if (val === 'null') {
				val = '—';
			}
			return val;
		}
	},
	props: {
		field: {
			type: Object,
			required: true
		},
		// label的位置，left-左边，top-上边
		labelPosition: {
			type: String,
			default: 'left'
		},
		// lable字体的对齐方式
		labelAlign: {
			type: String,
			default: ''
		},
		procData: {
			type: Object,
			default() {
				return {};
			}
		},
		fieldsModel: {
			type: Object,
			default() {
				return {};
			}
		},
		formType: {
			type: String,
			default: 'add' //add||update
		},
		pageType: {
			type: String,
			default: 'form' //form||detail
		},
		optionMode: {
			type: String,
			default: 'button' //选项的样式 normal | button
		}
	},
	computed: {
		uploadUrl() {
			return this.$api.upload;
		},
		deleteUrl() {
			return this.$api.deleteFile;
		},
		label_width() {
			let result = '';
			if (this.labelPosition === 'left') {
				result = 'auto';
			}
			if (
				this.pageType !== 'detail' &&
				((this.setOptionList.length < 15 && this.fieldData.type === 'Set') || (this.selectorData.length < 5 && this.fieldData.type === 'Selector'))
			) {
				result = '100%';
			}
			if ((this.fieldData.type === 'textarea' || this.fieldData.type === 'images') && (this.fieldData.value || this.pageType !== 'detail')) {
				result = '100%';
			}
			return result;
		},
		pickerMode() {
			let type = this.fieldData.type;
			if (this.pickerFieldList.includes(type)) {
				switch (type) {
					case 'Date':
						type = 'date';
						break;
					case 'Time':
						type = 'time';
						break;
				}
				return type;
			}
		}
	},
	data() {
		return {
			focusTextArea: false,
			checkedList: [],
			fieldData: {},
			imagesUrl: [],
			popupFieldTypeList: ['TreeSelector', 'treeSelector', 'Selector', 'Set'], //点击会弹出popup的字段类型
			pickerFieldList: ['date', 'dateTime', 'time', 'Time', 'Date'],
			reqHeader: {
				bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
			},
			uploadFormData: {
				serviceName: 'srv_bxfile_service',
				interfaceName: 'add',
				app_no: '',
				table_name: '',
				columns: ''
			},
			listModel: {},
			textareaValue: '',
			treePageInfo: { total: 0, rownumber: 20, pageNo: 1 },
			selectorData: [],
			setOptionList: [],
			fkFieldLabel: '',
			valid: {
				column: this.field.column,
				valid: true,
				msg: '不能为空!'
			},
			longpressTimer: null,
			modalName: '', //当前显示的modal
			//录音相关参数
			// RECORDER: null,
			RECORDER: uni.getRecorderManager(),
			voicePath: [],
			voiceUrl: [],
			voiceUrls: [],
			voiceText: '按住 说话',
			//播放语音相关参数
			// AUDIO: null,
			AUDIO: uni.createInnerAudioContext(),
			playMsgid: null,
			VoiceTimer: null,
			onRecord: false //正在录音
		};
	},
	watch: {
		field: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				this.fieldData = newValue;
				if (newValue.type === 'textarea' || newValue.type === 'RichText') {
					this.textareaValue = newValue.value;
				}
			}
		}
	},
	methods: {
		saveRichText(e) {
			if (e.isSave) {
				if (e.type === 'textarea') {
					this.fieldData.value = this.textareaValue;
				} else {
					if (e.html) {
						this.fieldData.value = e.html;
					}
					this.fieldData.richData = e;
				}
			} else {
				let val = this.fieldData.value ? this.fieldData.value : '';
				this.textareaValue = val;
				if (e.type === 'richtext') {
					this.$refs.richEditor.resetContent(val);
				}
			}
			this.modalName = '';
		},
		longpressNumEnd() {
			clearInterval(this.longpressTimer);
		},
		longpressNumChange(type) {
			if (type) {
				this.longpressTimer = setInterval(() => {
					this.numberChange(type);
				}, 100);
			}
		},
		numberChange(type) {
			if (this.fieldData.type === 'number' || this.fieldData.type === 'digit') {
				let step = this.fieldData.type === 'number' ? 1 : this.fieldData.type === 'digit' ? 0.5 : 0;
				if (this.fieldData.step) {
					step = this.fieldData.step;
				}
				if (!this.fieldData.value) {
					this.fieldData.value = this.fieldData.min ? this.fieldData.min : 0;
				}
				if (this.fieldData.max) {
					if (type === 'add') {
						if (this.fieldData.value + step <= this.fieldData.max) {
							this.fieldData.value = Number((this.fieldData.value + step).toFixed(1));
						} else {
							clearInterval(this.longpressTimer);
						}
					} else if (type === 'minus') {
						if (this.fieldData.value - step >= this.fieldData.min) {
							this.fieldData.value = Number((this.fieldData.value - step).toFixed(1));
						} else {
							clearInterval(this.longpressTimer);
						}
					}
				}
			}
		},
		changeSlider(e) {
			console.log('value 发生变化：' + e.detail.value);
			this.fieldData.value = e.detail.value;
		},
		previewImage(urls) {
			if (!urls) {
				return;
			}
			if (typeof urls === 'string') {
				urls = [urls];
			}
			urls = urls.map(url => {
				//若图片地址携带压缩图参数则预览时去掉此参数
				return url.replace(/&thumbnailType=fwsu_100/gi, '');
			});
			uni.previewImage({
				urls: urls,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					}
				}
			});
		},
		getLocation() {
			// this.$emit('getLocation');
			if (this.pageType === 'detail') {
				return;
			}
			let self = this;
			uni.chooseLocation({
				success: function(res) {
					console.log('位置名称：' + res.name);
					console.log('详细地址：' + res.address);
					console.log('纬度：' + res.latitude);
					console.log('经度：' + res.longitude);
					self.$emit('chooseLocation', res);
					self.fieldData.value = res.address;
					self.onInput();
					self.getDefVal();
				}
			});
		},
		showModal(name) {
			this.modalName = name;
			this.$nextTick(function() {
				if (name === 'TextArea') {
					// this.focusTextArea = true;
				}
			});
		},
		hideModal() {
			this.modalName = '';
		},
		async getDefVal() {
			let self = this;
			if (this.fieldData.type === 'images' && this.fieldData.value) {
				if (this.fieldData.value.indexOf('http') === -1) {
					// 上传到系统的图片 只有图片编号 查到图片地址后再push
					let fileDatas = await self.getFilePath(this.fieldData.value);
					self.imagesUrl = [];
					if (fileDatas) {
						for (let i = 0; i < fileDatas.length; i++) {
							const url = `${self.$api.getFilePath}${fileDatas[i].fileurl}&bx_auth_ticket=${uni.getStorageSync('bx_auth_ticket')}&thumbnailType=fwsu_100`;
							self.imagesUrl.push(url);
						}
					}
				} else {
					// 网络地址 直接push
					self.imagesUrl.push(this.fieldData.value);
				}
			} else if (this.fieldData.type === 'list' && this.fieldData.value !== '') {
				// 选项列表
				let listItemModel = this.fieldData.optionsConfig.model;
				let colKey = this.fieldData.optionsConfig.conditions;
				for (let i = 0; i < colKey.length; i++) {
					this.$set(this.listModel, colKey[i].colName, this.fieldModelsData[colKey[i].value]);
					this.listModel[colKey[i].colName] = this.fieldModelsData[colKey[i].value];
				}
			} else if (this.fieldData.type === 'Set' && this.fieldData.value && typeof this.fieldData.value === 'string') {
				// 多选
				this.fieldData.value = this.fieldData.value.split(',');
			} else {
				Object.keys(this.fieldsModel).forEach(key => {
					if (this.fieldData.column === key && !this.fieldData.value && this.fieldsModel[key]) {
						this.fieldData.value = this.fieldsModel[key];
					}
				});
			}
		},
		getFileInfo(e) {
			if (e.response.file_no) {
				this.fieldData.value = e.response.file_no;
			}
		},
		getImagesInfo(e) {
			let res = e.allImages[0];
			try {
				res = JSON.parse(e.allImages[0]);
			} catch (e) {
				//TODO handle the exception
			}
			this.fieldData.value = res.file_no;
			if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
				this.uploadFormData['file_no'] = this.fieldData.value;
			}
			this.onInput();
			this.getDefVal();
		},
		deleteImage(e) {
			console.log(e);
			this.fieldData.value = '';
		},
		getCascaderValue(e) {
			if (e) {
				let srvInfo = this.fieldData.srvInfo;
				this.fkFieldLabel = `${e[srvInfo.key_disp_col]}/${e[srvInfo.refed_col]}`;
				this.fieldData.value = e[srvInfo.refed_col];
				this.fieldData['colData'] = e;
			}
			this.hideModal();
			this.onInput();
			this.getDefVal();
		},
		searchFKDataWithKey(e) {
			if (e.detail.value) {
				let option = this.fieldData.option_list_v2;
				let relation_condition = {
					relation: 'OR',
					data: []
				};
				if (!option.key_disp_col && !option.refed_col) {
					return;
				}
				if (option.key_disp_col) {
					relation_condition.data.push({
						relation: 'AND',
						data: [
							{
								colName: option.key_disp_col,
								value: e.detail.value,
								ruleType: '[like]'
							}
						]
					});
				}
				if (option.refed_col) {
					relation_condition.data.push({
						relation: 'AND',
						data: [
							{
								colName: option.refed_col,
								value: e.detail.value,
								ruleType: '[like]'
							}
						]
					});
				}
				this.getSelectorData(null, null, relation_condition);
			}
		},
		radioChange(e) {
			this.onInput();
		},
		pickerChange(e) {
			if (this.fieldData.type === 'Selector') {
				let optionData = this.selectorData.find(item => item.value === e);
				this.fkFieldLabel = optionData.label;
				this.fieldData['colData'] = optionData;
				this.hideModal();
				this.onInput();
			}
		},
		async getSelectorData(cond, serv, relation_condition) {
			let self = this;
			if (this.fieldData.col_type === 'Enum') {
				if (Array.isArray(this.fieldData.options)) {
					this.selectorData = this.fieldData.options;
				}
				return;
			}
			let req = {
				serviceName: serv ? serv : self.fieldData.option_list_v2 ? self.fieldData.option_list_v2.serviceName : '',
				colNames: ['*'],
				page: { pageNo: this.treePageInfo.pageNo, rownumber: this.treePageInfo.rownumber }
			};
			let appName = '';
			if (self.fieldData.option_list_v2 && self.fieldData.option_list_v2.srv_app) {
				appName = self.fieldData.option_list_v2.srv_app;
			} else {
				appName = uni.getStorageSync('activeApp');
			}
			let fieldModelsData = self.deepClone(self.fieldsModel);
			if (!self.procData.id) {
				fieldModelsData = self.deepClone(self.fieldsModel);
			} else {
				fieldModelsData = self.deepClone(self.procData);
			}
			// #ifdef H5
			top.user = uni.getStorageSync('login_user_info');
			// #endif
			if (cond) {
				req.condition = cond;
			} else if (self.fieldData.option_list_v2 && Array.isArray(self.fieldData.option_list_v2.conditions) && self.fieldData.option_list_v2.conditions.length > 0) {
				let condition = self.deepClone(self.fieldData.option_list_v2.conditions);
				condition = condition.map(item => {
					if (item.value.indexOf('data.') !== -1) {
						let colName = item.value.slice(item.value.indexOf('data.') + 5);
						if (fieldModelsData[colName]) {
							item.value = fieldModelsData[colName];
						}
					} else if (item.value.indexOf('top.user.user_no') !== -1) {
						item.value = uni.getStorageSync('login_user_info').user_no;
					} else if (item.value.indexOf("'") === 0 && item.value.lastIndexOf("'") === item.value.length - 1) {
						item.value = item.value.replace(/\'/gi, '');
					}
					if (item.value_exp) {
						delete item.value_exp;
					}
					return item;
				});
				if (Array.isArray(condition) && condition.length > 0) {
					req.condition = condition;
				} else {
					return;
				}
			}
			if (req.serviceName === 'srvsso_user_select') {
				if (Array.isArray(req.condition)) {
				} else {
					req.condition = [{ colName: 'dept_no', ruleType: 'like', value: 'bx100sys' }];
				}
				appName = 'sso';
			}
			if (relation_condition && typeof relation_condition === 'object') {
				req.relation_condition = relation_condition;
				delete req.condition;
			}
			if (!req.serviceName) {
				return;
			}
			let res = await self.onRequest('select', req.serviceName, req, appName);
			// if (res.data.state === 'SUCCESS' && res.data.page && res.data.page.total > res.data.page.rownumber * res.data.page.pageNo) {
			// 	this.treeDataStatus = 'loadmore';
			// } else {
			// 	this.treeDataStatus = 'nomore';
			// }
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				if (res.data.page) {
					this.treePageInfo = res.data.page;
				}
				let hasParentNo = res.data.data.filter(item => item.parent_no).length;
				if (hasParentNo) {
					self.selectorData = self.treeReform(res.data.data, 'parent_no', 'no', self.fieldData.option_list_v2);
					if (res.data.page && res.data.page.pageNo > 1) {
						let data = self.treeReform(res.data.data, 'parent_no', 'no', self.fieldData.option_list_v2);
						self.selectorData = [...self.selectorData, ...data];
					}
					self.selectorData = self.selectorData.map((item, index) => {
						let a = {
							title: '',
							name: '',
							icon: '',
							seq: '',
							link: '',
							type: 'button',
							_childNode: []
						};
						a = Object.assign(a, item);
						a.title = item.pr_name;
						a.name = item.pr_name;
						a._childNode = item._childNode;
						a.no = item.no;
						a.parent_no = item.parent_no;
						return a;
					});
				} else {
					if (res.data.page && res.data.page.pageNo > 1) {
						let data = res.data.data;
						self.selectorData = [...self.selectorData, ...data];
					} else {
						self.selectorData = res.data.data;
					}
					self.selectorData = self.selectorData.map(item => {
						const config = this.deepClone(this.fieldData.option_list_v2);
						item.label = config.key_disp_col ? item[config.key_disp_col] : '';
						item.value = config.refed_col ? item[config.refed_col] : '';
						return item;
					});
				}
				self.selectorData.forEach(item => {
					if (self.fieldData.option_list_v2 && item[self.fieldData.option_list_v2.refed_col] === self.fieldData.value) {
						self.fieldData['colData'] = item;
					}
				});
			} else if (req.serviceName === 'srvsys_service_columnex_v2_select' && res.data && res.data.data && Array.isArray(res.data.data.srv_cols)) {
				self.selectorData = res.data.data.srv_cols.map(item => {
					item.checked = false;
					return item;
				});
			}
		},
		bindTimeChange(e) {
			this.fieldData.value = e.detail.value;
		},
		openModal(type) {
			// 打开弹出层
			let fieldData = this.deepClone(this.fieldData);
			switch (type) {
				case 'Set':
					if (Array.isArray(this.fieldData.option_list_v2)) {
						this.setOptionList = this.fieldData.option_list_v2.map(item => {
							if (this.fieldData.value && this.fieldData.value.includes(item.value)) {
								item.checked = true;
							}
							return item;
						});
						this.modalName = 'MultiSelector';
					}
					break;
				case 'Selector':
					this.modalName = 'Selector';
					break;
				case 'TreeSelector':
					this.modalName = 'TreeSelector';
					break;
			}
		},
		onBlur() {
			// 输入框失去焦点 进行校验
			console.log('on-blur');
		},
		onInput() {
			// input事件
			console.log('on-input');
			this.getValid();
			this.$emit('on-value-change', this.fieldData);
		},
		//录音开始UI效果
		recordBegin(e) {
			this.onRecord = true;
		},
		// 录音被打断
		voiceCancel() {
			this.RECORDER.stop(); //录音结束
		},
		// 录音开始
		startRecord(e) {
			this.onRecord = true;
			this.RECORDER.start({ format: 'mp3' }); //录音开始,
		},
		// 停止录音
		stopRecord() {
			this.onRecord = false;
			this.RECORDER.stop(); //录音结束
		},
		playVoice(voicePath) {
			console.log('播放录音');
			if (voicePath) {
				innerAudioContext.src = voicePath;
				innerAudioContext.play();
			}
		},
		saveRecord(res) {
			this.voicePath.push(res.tempFilePath);
			console.log(this.deepClone(this.voicePath));
			this.uploadFile(res.tempFilePath);
		},
		async uploadFile(tempFilePath) {
			let self = this;
			console.log(this.uploadFormData);
			this.uploadFormData['app_no'] = this.fieldData.srvInfo && this.fieldData.srvInfo.appNo ? this.fieldData.srvInfo.appNo : uni.getStorageSync('activeApp');
			this.uploadFormData['columns'] = this.fieldData.column;
			if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
				this.uploadFormData['file_no'] = this.fieldData.value;
			}
			this.uploadFormData['table_name'] = this.fieldData._colDatas.table_name;
			let res = await uni.uploadFile({
				filePath: tempFilePath,
				url: self.$api.upload,
				header: {
					bx_auth_ticket: uni.getStorageSync('bx_auth_ticket')
				},
				formData: self.uploadFormData,
				name: 'file'
			});
			if (Array.isArray(res) && res.length === 2 && typeof res[1].data === 'string') {
				res = JSON.parse(res[1].data);
				this.voiceUrl.push(self.$api.getFilePath + res.fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket'));
				this.voiceUrls.push({
					url: self.$api.getFilePath + res.fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket'),
					time: res.create_time
				});
				self.fieldData.value = res.file_no;
			}
		},
		getValid() {
			if (this.fieldData.isRequire && this.fieldData.value) {
				if (this.fieldData.hasOwnProperty('_validators') && this.fieldData._validators.hasOwnProperty('isType') && typeof this.fieldData._validators.isType === 'function') {
					this.fieldData.valid = this.fieldData._validators.isType(this.fieldData.value);
					this.valid.valid = true;
				} else {
					this.fieldData.valid = { valid: true, msg: '有效' };
					this.valid.valid = true;
				}
				// this.valid.valid = this.fieldData.valid.valid;
			} else if (this.fieldData.isRequire && (this.fieldData.value === '' || this.fieldData.value === null || this.fieldData.value === undefined)) {
				this.fieldData.valid = { valid: false, msg: this.fieldData.label + '不能为空' };
				this.valid.valid = false;
			} else {
				this.fieldData.valid = { valid: true, msg: '有效' };
				this.valid.valid = true;
			}
			this.$emit('on-value-change', this.fieldData);
			return this.valid;
		}
	},
	onReady() {
		let self = this;
		//语音自然播放结束
		if (this.fieldData.type === 'voice') {
			// innerAudioContext = uni.createInnerAudioContext();
			// innerAudioContext.autoplay = true;
			// self.AUDIO.onEnded(res => {
			// 	self.playMsgid = null;
			// });
			//录音结束事件
			this.RECORDER.onStop(e => {
				self.saveRecord(e);
			});
		}
	},
	created() {
		let self = this;
		if (this.fieldData.type === 'images' || this.fieldData.type === 'voice') {
			this.uploadFormData = {
				serviceName: 'srv_bxfile_service',
				interfaceName: 'add',
				app_no: '',
				table_name: '',
				columns: ''
			};
			this.uploadFormData['app_no'] = this.fieldData.srvInfo && this.fieldData.srvInfo.appNo ? this.fieldData.srvInfo.appNo : uni.getStorageSync('activeApp');
			this.uploadFormData['columns'] = this.fieldData.column;
			if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
				this.uploadFormData['file_no'] = this.fieldData.value;
			}
		}
		if (this.pageType === 'detail' || this.pageType === 'update') {
			this.getDefVal();
		}
		this.$nextTick(function() {
			if (Array.isArray(this.fieldData.option_list_v2)) {
				this.setOptionList = this.fieldData.option_list_v2.map(item => {
					if (this.fieldData.value && this.fieldData.value.includes(item.value)) {
						item.checked = true;
					}
					return item;
				});
			}
		});
		if (self.fieldData && self.fieldData.type === 'Selector') {
			let cond = null;
			if (this.fieldData.value && this.fieldData.option_list_v2.refed_col) {
				cond = [
					{
						colName: this.fieldData.option_list_v2.refed_col,
						value: this.fieldData.value,
						ruleType: 'like'
					}
				];
			}
			self.getSelectorData(cond).then(_ => {
				if (self.fieldData.value) {
					self.fkFieldLabel = self.selectorData.find(item => item.value === self.fieldData.value)
						? self.selectorData.find(item => item.value === self.fieldData.value).label
						: '请选择';
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
