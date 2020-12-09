<template>
	<view class="form-item">
		<label
			class="form-item-label"
			:style="{ width: label_width, 'align-items': labelAlign ? labelAlign : 'left', 'background-color': labelPosition === 'left' ? 'white' : '' }"
		>
			{{ fieldData.label }}
		</label>
		<view class="form-item-content">
			<!-- detail-详情-start -->
			<view class="form-item_image" v-if="pageType === 'detail' && fieldData.type === 'images'">
				<image
					class="form-item-content_detail image"
					v-if="fieldData.type === 'images'"
					v-for="(item, index) in imagesUrl"
					:key="index"
					style="padding: 5upx;"
					@tap="showModal(index, 'Image')"
					data-target="Image"
					:src="item"
				></image>
			</view>
			<view class="form-item-content_detail text" v-html="field.value" v-else-if="pageType === 'detail' && (field.type === 'snote' || field.type === 'Note')"></view>
			<view class="form-item-content_detail rich-text" v-else-if="pageType === 'detail'">{{ field.value }}</view>
			<!-- detail-详情-end -->
			<!-- form-item-start -->
			<bx-radio-group class="form-item-content_value radio-group" v-model="fieldData.value" v-else-if="fieldData.type === 'radio'">
				<bx-radio class="radio" color="#2979ff" v-for="item in fieldData.options" :disabled="fieldData.disabled ? fieldData.disabled : false" :key="item" :name="item">
					{{ item }}
				</bx-radio>
			</bx-radio-group>
			<bx-radio-group class="form-item-content_value radio-group" v-model="fieldData.value" v-else-if="fieldData.type === 'radioFk'">
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
				<label v-for="(item, index) in fieldData.options" :key="index" class="checkbox" @click="radioChange(item)">
					<checkbox color="#2979ff" :value="item" :disabled="fieldData.disabled ? fieldData.disabled : false" :checked="fieldData.value.indexOf(item) !== -1" />
					<text style="flex: 1;" class="text">{{ item }}</text>
				</label>
			</checkbox-group>
			<bx-checkbox-group
				v-model="fieldData.value"
				class="form-item-content_value checkbox-group"
				v-else-if="fieldData.type === 'checkboxFk'"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
			>
				<bx-checkbox v-model="item.checked" v-for="item in fieldData.options" :key="item.value" :name="item.label">{{ item.label }}</bx-checkbox>
			</bx-checkbox-group>
			<view class="form-item-content_value picker" v-else-if="popupFieldTypeList.includes(fieldData.type)" @click="openPopup(fieldData.type)">
				<text class="place-holder" v-if="!fieldData.value">{{ '请选择' }}</text>
				<text class="value" v-else>{{ fkFieldLabel }}</text>
			</view>
			<view class="form-item-content_value picker" v-else-if="pickerFieldList.includes(fieldData.type)">
				<picker :mode="pickerMode" :value="fieldData.value" start="09:01" end="21:01" @change="bindTimeChange">
					<view class="place-holder" v-if="!fieldData.value">请选择</view>
					<view class="value" v-else>{{ fieldData.value }}</view>
				</picker>
			</view>
			<input
				class="form-item-content_value"
				@blur="onBlur"
				type="number"
				:placeholder="'请输入'"
				@input="onInput"
				:max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
				:min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
				v-model.number="fieldData.value"
				name="input"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
				v-else-if="fieldData.type === 'number'"
			/>
			<input
				class="form-item-content_value"
				@blur="onBlur"
				type="digit"
				:placeholder="'请输入'"
				@input="onInput"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
				:max="fieldData.item_type_attr && fieldData.item_type_attr.max ? fieldData.item_type_attr.max : 999"
				:min="fieldData.item_type_attr && fieldData.item_type_attr.min ? fieldData.item_type_attr.min : 0"
				v-model.number="fieldData.value"
				name="input"
				v-else-if="fieldData.type === 'digit' || fieldData.type === 'Float'"
			/>
			<input
				class="form-item-content_value text uni-input"
				v-else-if="fieldData.type === 'input'"
				@blur="onBlur"
				:maxlength="fieldData.item_type_attr && fieldData.item_type_attr.max_len ? fieldData.item_type_attr.max_len : 100"
				:disabled="fieldData.disabled ? fieldData.disabled : false"
				:placeholder="'输入' + fieldData.label"
				v-model="fieldData.value"
				@input="onInput"
				name="input"
				type="text"
			/>
			<robby-image-upload
				class="form-item-content_value image"
				v-else-if="fieldData.type === 'images'"
				:value="imagesUrl"
				:enable-del="fieldData.disabled ? !fieldData.disabled : true"
				:enable-add="fieldData.disabled ? !fieldData.disabled : true"
				:server-url="$api.upload"
				@delete="deleteImage"
				@add="getImageInfo"
				:form-data="fileFormData"
				:header="reqHeader"
				:showUploadProgress="true"
				:server-url-delete-image="$api.deleteFile"
				:limit="fieldData.fileNum"
			></robby-image-upload>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showSelectorPopup }">
			<view class="cu-dialog">
				<view class="tree-selector">
					<view class="content">
						<view class="cu-bar search bg-white">
							<view class="search-form round">
								<text class="cuIcon-search"></text>
								<input @input="searchFKDataWithKey" :adjust-position="false" type="text" placeholder="搜索" confirm-type="search" />
							</view>
						</view>
						<bx-radio-group class="form-item-content_value radio-group" v-model="fieldData.value" mode="button" @change="pickerChange">
							<bx-radio class="radio" color="#2979ff" v-for="item in selectorData" :key="item.id" :name="item.value" :serial-char="item.serialChar">
								{{ item.label }}
							</bx-radio>
						</bx-radio-group>
					</view>
					<view class="dialog-button"><view class="cu-btn bg-grey shadow flex" @tap="showSelectorPopup = false">取消</view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'aFormItem',
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
		// lable的样式，对象形式
		labelStyle: {
			type: Object,
			default() {
				return {};
			}
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
				}
				return type;
			}
		}
	},
	data() {
		return {
			fieldData: this.field,
			imagesUrl: [],
			popupFieldTypeList: ['treeSelector', 'Selector', 'Set'], //点击会弹出popup的字段类型
			pickerFieldList: ['date', 'dateTime', 'time', 'Time', 'Date'],
			reqHeader: null,
			fileFormData: {
				serviceName: 'srv_bxfile_service',
				interfaceName: 'add',
				app_no: '',
				table_name: '',
				columns: ''
			},
			showSelectorPopup: false,
			treePageInfo: { total: 0, rownumber: 20, pageNo: 1 },
			selectorData: [],
			fkFieldLabel: ''
		};
	},
	methods: {
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
		pickerChange(e) {
			this.fkFieldLabel = this.selectorData.find(item => item.value === e).label;
			this.showSelectorPopup = false;
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
						console.log(this.deepClone(this.fieldData.option_list_v2));
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
				self.selectorData = res.data.data.srv_cols;
			}
		},
		bindTimeChange(e) {
			this.fieldData.value = e.detail.value;
		},
		openPopup(type) {
			// 打开弹出层
			switch (type) {
				case 'Selector':
					// this.getTreeSelectorData().then(_ => {
					this.showSelectorPopup = true;
					// });
					break;
				case 'Set':
					break;
			}
		},
		onBlur() {
			// 输入框失去焦点
			console.log('on-blur');
		},
		onInput() {
			// input事件
			console.log('on-input');
		}
	},
	created() {
		if (this.fieldData && this.fieldData.type === 'Selector') {
			this.getTreeSelectorData().then(_ => {
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
.form-item {
	display: flex;
	flex-wrap: wrap;
	min-height: 100rpx;
	align-items: flex-start;
	background-color: #fff;
	padding: 10rpx;
	position: relative;
	&::after {
		position: absolute;
		box-sizing: border-box;
		content: ' ';
		pointer-events: none;
		right: 16px;
		bottom: 0;
		left: 16px;
		border-bottom: 1px solid #ebedf0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	.form-item-label {
		display: flex;
		min-width: 200rpx;
		padding: 20rpx 10rpx;
	}
	.form-item-content {
		flex: 1;
		display: flex;
		padding: 20rpx 0;
		padding-left: 20rpx;
		.form-item-content_value {
			line-height: 1.4em;
			min-height: 1.4em;
			position: relative;
			height: 100%;
			font: inherit;
			display: flex;
			flex: 1;
			&.picker {
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
			.button-mode{
				margin-bottom: 10rpx;
			}
		}
	}
}
</style>
