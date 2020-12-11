<template>
	<view class="form-item" v-if="fieldData.display" :class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid }">
		<label
			class="form-item-label"
			:class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid, 'label-top': labelPosition === 'top' }"
			:style="{ width: label_width, 'align-items': labelAlign ? labelAlign : 'left', 'background-color': labelPosition === 'left' ? '' : '' }"
		>
			<text class="text-red is-required">{{ fieldData.isRequire ? '*' : '' }}</text>
			<text class="label">{{ fieldData.label }}</text>
		</label>
		<view class="form-item-content" :class="{ 'form-detail': pageType === 'detail', valid_error: !valid.valid }">
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
			<view class="form-item-content_detail text" v-else-if="pageType === 'detail'">
				{{ field.value ? (isArray(fieldData.value) ? field.value.toString() : field.value) : '' }}
			</view>
			<!-- detail-详情-end -->
			<!-- form-item-start -->
			<bx-radio-group class="form-item-content_value radio-group" :mode="optionMode" v-model="fieldData.value" v-else-if="fieldData.type === 'radio'" @change="radioChange">
				<bx-radio class="radio" color="#2979ff" v-for="item in fieldData.options" :disabled="fieldData.disabled ? fieldData.disabled : false" :key="item" :name="item">
					{{ item }}
				</bx-radio>
			</bx-radio-group>
			<bx-radio-group class="form-item-content_value radio-group" :mode="optionMode" v-model="fieldData.value" v-else-if="fieldData.type === 'radioFk'" @change="radioChange">
				<bx-radio
					class="radio"
					color="#2979ff"
					v-for="item in fieldData.options"
					:disabled="fieldData.disabled ? fieldData.disabled : false"
					:key="item.id"
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
				<bx-checkbox v-model="item.checked" v-for="item in fieldData.options" :key="item.value" :name="item.label">{{ item.label }}</bx-checkbox>
			</bx-checkbox-group>
			<view class="form-item-content_value picker" v-else-if="popupFieldTypeList.includes(fieldData.type)" @click="openPopup(fieldData.type)">
				<text class="place-holder" v-if="!fieldData.value">{{ '请选择' }}</text>
				<view class="value hidden" v-else-if="fieldData.value && isArray(fieldData.value)">{{ fieldData.value.toString() }}</view>
				<text class="value hidden" v-else>{{ fkFieldLabel }}</text>
			</view>
			<view class="form-item-content_value picker" v-else-if="pickerFieldList.includes(fieldData.type)">
				<picker :mode="pickerMode" :value="fieldData.value" start="09:01" end="21:01" @change="bindTimeChange">
					<view class="place-holder" v-if="!fieldData.value">请选择</view>
					<view class="value" v-else>{{ fieldData.value }}</view>
				</picker>
			</view>
			<view class="form-item-content_value picker" v-else-if="fieldData.type === 'textarea'" @click="showTextArea = true">
				<text class="place-holder" v-if="!fieldData.value">点击输入</text>
				<view class="value" v-else>{{ fieldData.value | html2text }}</view>
			</view>
			<input
				class="form-item-content_value"
				@blur="onBlur"
				:type="fieldData.type"
				:placeholder="'请输入'"
				@input="onInput"
				:maxlength="fieldData.item_type_attr && fieldData.item_type_attr.max_len ? fieldData.item_type_attr.max_len : 999"
				:max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
				:min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
				v-model.number="fieldData.value"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
				v-else-if="((fieldData.type === 'number' || fieldData.type === 'digit') && (!fieldData.max || !fieldData.min)) || fieldData.type === 'text'"
			/>
			<view class="form-item-content_value slider" v-else-if="(fieldData.type === 'number' || fieldData.type === 'digit') && fieldData.max && fieldData.min">
				<view class="operate" hover-class="active" @click="numberChange('minus')" @longpress="longpressNumChange('minus')" @touchend="longpressNumEnd">-</view>
				<slider
					class="uni-slider"
					@change="changeSlider"
					:step="fieldData.type === 'digit' ? 0.5 : 1"
					:min="fieldData.value&&fieldData.value>=fieldData.min?fieldData.min:0"
					:max="fieldData.max"
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
				:server-url="$api.upload"
				@delete="deleteImage"
				@add="getImagesInfo"
				:form-data="uploadFormData"
				:header="reqHeader"
				:showUploadProgress="true"
				:server-url-delete-image="$api.deleteFile"
				:limit="fieldData.fileNum"
			></robby-image-upload>
		</view>
		<view class="icon-area">
			<!-- <text class="cuIcon-edit" v-if="(fieldData.type === 'number' || fieldData.type === 'digit') && fieldData.max && fieldData.min"></text> -->
			<text class="cuIcon-locationfill text-blue" @click="getLocation" v-if="fieldData.fieldType === 'location'"></text>
		</view>
		<view class="valid_msg" v-show="!valid.valid">{{ valid.msg }}</view>
		<view class="cu-modal bottom-modal" :class="{ show: showTextArea }">
			<view class="cu-dialog">
				<textarea class="form-item-content_value textarea" v-model="textareaValue" placeholder="请输入" />
				<view class="button-box">
					<button class="cu-btn button bg-grey" @tap="showTextArea = false">取消</button>
					<button
						type="primary"
						class="cu-btn button bg-blue"
						@tap="
							showTextArea = false;
							fieldData.value = textareaValue;
						"
					>
						确定
					</button>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showSelectorPopup || showMultiSelectorPopup }">
			<view class="cu-dialog">
				<view class="tree-selector">
					<view class="content">
						<view class="cu-bar search bg-white" v-if="showSelectorPopup">
							<view class="search-form round">
								<text class="cuIcon-search"></text>
								<input @input="searchFKDataWithKey" :adjust-position="false" type="text" placeholder="搜索" confirm-type="search" />
							</view>
						</view>
						<bx-checkbox-group v-if="showMultiSelectorPopup" class="form-item-content_value checkbox-group" v-model="fieldData.value" mode="button">
							<bx-checkbox v-for="item in setOptionList" :key="item.label" :name="item.value" v-model="item.checked">{{ item.label }}</bx-checkbox>
						</bx-checkbox-group>
						<bx-radio-group v-if="showSelectorPopup" class="form-item-content_value radio-group" v-model="fieldData.value" mode="button" @change="pickerChange">
							<bx-radio v-for="item in selectorData" :key="item.id" :name="item.value">{{ item.label }}</bx-radio>
						</bx-radio-group>
					</view>
					<view class="dialog-button">
						<view class="cu-btn bg-blue shadow" @tap="hidePopup" v-if="showMultiSelectorPopup">确定</view>
						<view class="cu-btn bg-grey shadow" @tap="hidePopup" v-if="showSelectorPopup">取消</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
		label_width() {
			return this.labelPosition === 'left' ? 'auto' : '100%';
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
			checkedList: [],
			fieldData: {},
			imagesUrl: [],
			popupFieldTypeList: ['treeSelector', 'Selector', 'Set'], //点击会弹出popup的字段类型
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
			showSelectorPopup: false,
			showMultiSelectorPopup: false,
			showTextArea: false,
			textareaValue: this.fieldData && this.fieldData.value ? this.fieldData.value : '',
			treePageInfo: { total: 0, rownumber: 20, pageNo: 1 },
			selectorData: [],
			setOptionList: [],
			fkFieldLabel: '',
			valid: {
				column: this.field.column,
				valid: true,
				msg: '不能为空!'
			},
			longpressTimer:null
		};
	},
	watch: {
		field: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				this.fieldData = newValue;
			}
		}
	},
	methods: {
		longpressNumEnd(){
			clearInterval(this.longpressTimer)
		},
		longpressNumChange(type){
			if(type){
			  this.longpressTimer = setInterval(()=>{
					this.numberChange(type)
				},200)
			}
		},
		numberChange(type) {
			if (this.fieldData.type === 'number' || this.fieldData.type === 'digit') {
				let step = this.fieldData.type === 'number' ? 1 : this.fieldData.type === 'digit' ? 0.5 : 0;
				if(!this.fieldData.value){
					this.fieldData.value = this.fieldData.min?this.fieldData.min:0
				}
				if (this.fieldData.max && this.fieldData.min) {
					if (type === 'add') {
						if (this.fieldData.value + step <= this.fieldData.max) {
							this.fieldData.value = this.fieldData.value + step;
						}
					} else if (type === 'minus') {
						if (this.fieldData.value - step >= this.fieldData.min) {
							this.fieldData.value = this.fieldData.value - step;
						}
					}
				}
			}
		},
		changeSlider(e) {
			console.log('value 发生变化：' + e.detail.value);
			this.fieldData.value = e.detail.value
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
			this.$emit('getLocation');
		},
		hidePopup() {
			this.showSelectorPopup = false;
			this.showMultiSelectorPopup = false;
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
			let res = JSON.parse(e.allImages[0]);
			this.fieldData.value = res.file_no;
			console.log('图片返回：', e, e.allImages[0], res, this.fieldData.value);
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
				this.getTreeSelectorData(null, null, relation_condition);
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
				this.showSelectorPopup = false;
				this.onInput();
			}
			// this.fkFieldLabel = this.selectorData.find(item => item.value === e).label;
		},
		async getTreeSelectorData(cond, serv, relation_condition) {
			let self = this;
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
					// req.condition.push();
				} else {
					req.condition = [{ colName: 'dept_no', ruleType: 'like', value: 'bx100sys' }];
				}
				appName = 'sso';
			}
			if (relation_condition && typeof relation_condition === 'object') {
				req.relation_condition = relation_condition;
				delete req.condition;
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
		openPopup(type) {
			// 打开弹出层
			let fieldData = this.deepClone(this.fieldData);
			switch (type) {
				case 'Set':
					if (Array.isArray(this.fieldData.option_list_v2)) {
						this.setOptionList = this.fieldData.option_list_v2.map(item => {
							if (fieldData.value && fieldData.value.includes(item.value)) {
								item.checked = true;
							}
							return item;
						});
						this.showMultiSelectorPopup = true;
					}
					break;
				case 'Selector':
					// this.getTreeSelectorData().then(_ => {
					this.showSelectorPopup = true;
					// });
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
	created() {
		if (this.fieldData.type === 'images') {
			this.uploadFormData = {
				serviceName: 'srv_bxfile_service',
				interfaceName: 'add',
				app_no: '',
				table_name: '',
				columns: ''
			};
			this.uploadFormData['app_no'] = this.fieldData.srvInfo.appNo;
			// this.uploadFormData['table_name'] = this.fieldData.srvInfo.tableName;
			this.uploadFormData['columns'] = this.fieldData.column;
			if (this.fieldData.value !== '' && this.fieldData.value !== null && this.fieldData.value !== undefined) {
				this.uploadFormData['file_no'] = this.fieldData.value;
			}
		}
		if (this.pageType === 'detail' || this.pageType === 'update') {
			this.getDefVal();
		}
		if (this.fieldData && this.fieldData.type === 'Selector') {
			let cond = null;
			// if(this.fieldData.value&&this.fieldData.option_list_v2&&this.fieldData.option_list_v2.refed_col){
			// 	cond = [{colName:this.fieldData.option_list_v2.refed_col,ruleType:'in',value:this.fieldData.value}]
			// }
			this.getTreeSelectorData(cond).then(_ => {
				if (this.fieldData.value) {
					this.fkFieldLabel = this.selectorData.find(item => item.value === this.fieldData.value)
						? this.selectorData.find(item => item.value === this.fieldData.value).label
						: '请选择';
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-dialog {
	padding: 0 20rpx 50rpx;
	background-color: #fff;
	.form-item-content_value {
		width: 100%;
		padding: 20rpx;
	}
	.dialog-button {
		display: flex;
		justify-content: space-around;
		.cu-btn {
			min-width: 45%;
		}
	}
}
.form-item {
	display: flex;
	flex-wrap: wrap;
	min-height: 100rpx;
	align-items: center;
	// background-color: #fff;
	padding: 10rpx;
	position: relative;
	&.form-detail {
		min-height: 80rpx;
		align-items: center;
	}
	.valid_msg {
		width: 100%;
		color: #f76260;
		text-indent: 220rpx;
		font-size: 24rpx;
	}
	&::after {
		position: absolute;
		box-sizing: border-box;
		content: ' ';
		pointer-events: none;
		right: 16px;
		bottom: 0;
		left: 16px;
		border-bottom: 1px solid #ebedf0;
		transform: scaleY(0.5);
	}
	.form-item-label {
		display: flex;
		min-width: 200rpx;
		padding: 20rpx 10rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: #666;
		&.form-detail {
			padding: 0;
		}
		&.label-top {
			width: 100%;
		}
		.is-required {
			display: inline-flex;
			align-items: center;
			width: 20rpx;
		}
	}
	.form-item-content_value.checkbox-group {
		margin-top: 50rpx;
	}
	.form-item-content {
		flex: 1;
		display: flex;
		flex-wrap: nowrap;
		padding: 20rpx 0;
		padding-left: 20rpx;
		color: #000;
		&.form-detail {
			padding: 0;
		}
		&.valid_error {
			border: 1rpx dashed #f37b1d;
			margin-bottom: 10rpx;
		}
		.form-item-content_detail {
			&.image {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.form-item-content_value {
			line-height: 1.4em;
			min-height: 1.4em;
			position: relative;
			height: 100%;
			font: inherit;
			display: flex;
			flex: 1;
			&.slider {
				display: flex;
				height: 80rpx;
				align-items: center;
				.operate {
					display: inline-block;
					padding: 5rpx 20rpx;
					background-color: #f1f1f1;
					position: relative;
					font-size: 40rpx;
					&.active {
						transition: all 0.2s;
						transform: scale(1.2);
					}
					&::before {
						content: '';
						width: 130%;
						height: 130%;
						top: -15%;
						left: -15%;
						position: absolute;
					}
				}
				.uni-slider {
					flex: 1;
				}
			}
			&.picker {
				.value {
					width: 400rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
				&:active {
					background-color: #f1f1f1;
					transition: all 0.5s ease-out;
				}
			}
			.place-holder {
				color: grey;
				overflow: hidden;
				text-overflow: clip;
				word-break: keep-all;
				pointer-events: none;
				padding: 0 10rpx;
			}
			.value {
				padding: 0 10rpx;
			}
		}
	}
	.icon-area {
		display: inline-flex;
		align-content: center;
		text-align: left;
		margin-right: 20rpx;
		padding: 20rpx 0;
		font-size: 40rpx;
	}
	.tree-selector {
		height: calc(80vh - var(--window-top) - var(--window-bottom));
		display: flex;
		flex-direction: column;
		.content {
			flex: 1;
			background-color: #fff;
			.bx-radio-group {
				margin: 0 20rpx;
			}
			.button-mode {
				margin-bottom: 10rpx;
			}
		}
	}
}
.button-box {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	margin: 40rpx 0;
	.button {
		min-width: 45%;
	}
}
</style>
