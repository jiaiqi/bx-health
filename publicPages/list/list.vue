<template>
	<view class="page-wrap">
		<view class="search-bar" v-if="showSearchBar">
			<view class="bg-white cu-bar search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input @focus="searchBarFocus" @blur="serachBarBlur" :adjust-position="false" type="text"
						v-model="searchVal" :placeholder="placeholder" confirm-type="search" />
				</view>
				<view class="action">
					<button class="cu-btn bg-cyan shadow-blur round" @click="toSearch" v-if="searchVal"><text
							class="cuIcon-search"></text></button>
					<button class="cu-btn bg-cyan shadow-blur round margin-left-xs" @click="showFilterModal"
						v-if="listConfig&&listConfig._fieldInfo">
						<!-- <text class="cuIcon-filter"></text> -->
						<text class="text-sm">筛选</text>
					</button>
					<button class="cu-btn bg-cyan shadow-blur round margin-left-xs" @click="clickAddButton"
						v-if="showAdd"><text class="cuIcon-add"></text></button>
				</view>
			</view>
			<!-- <view style="height: 100upx;width: 100%;"></view> -->
		</view>
		<bx-list ref="bxList" :serviceName="serviceName" :condition="condition" :order="order"
			:relation_condition="relation_condition" :pageType="pageType" :listType="'list'" :labels="labels"
			:srvApp="appName" :rowButtons="listConfig && listConfig.rowButton ? listConfig.rowButton : []"
			:showTab="false" :viewTemp="viewTemp" :listConfig="listConfig" :showButton="showRowButton" :fixed="true"
			:top="listTop" :searchWords="searchVal" :searchColumn="keyColumn" :tempWord="tempWord" :rownumber="42"
			:showFootBtn="showFootBtn" @click-list-item="clickItem" @list-change="listChange"
			@clickFootBtn="clickFootBtn" @loadEnd="loadEnd"></bx-list>
		<!-- 		<view class="public-button-box">
			<view class="add-button" @click="clickAddButton" v-if="showAdd"></view>
		</view> -->
		<view class="cu-modal bottom-modal" :class="{'show':showFilter}" @click.stop="hideFilter">
			<view class="cu-dialog" @click.stop="">
				<bx-filter v-if="listConfig&&listConfig._fieldInfo" :fieldInfo="listConfig._fieldInfo"
					@toFilter="toFilter" @cancel="hideFilter"></bx-filter>
			</view>
		</view>
	</view>
</template>

<script>
	import bxList from '../components/bx-list/bx-list.vue';
	import dayjs from '@/static/js/dayjs.min.js'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			bxList
		},
		computed: {
			...mapState({
				doctorInfo: state => state.user.userInfo,
				patientInfo: state => state.user.patientInfo
			})
		},
		data() {
			return {
				showFilter: false, //是否显示筛选弹框
				appName: '',
				serviceName: '',
				pageType: '',
				placeholder: '输入搜索关键词',
				listConfig: {},
				srv_cols: [],
				condition: [],
				relation_condition: null,
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				fabContent: [],
				fabHorizontal: 'left',
				fabVertical: 'bottom',
				fabDirection: 'horizontal',
				listTop: 100,
				showRowButton: 'true',
				viewTemp: {
					// title: 'name',
					// tip: 'desc',
					// img: 'img',
					// price: 'current_price',
					// footer: 'shop_name'
				},
				order: [],
				publicButton: [],
				searchVal: '',
				keyColumn: '',
				showAdd: false,
				noData: false,
				showSearchBar: false,
				showFootBtn: true,
				tempWord: {},
				queryParams: {},
				queryOption: {},
				navigationBarTitle: null,
				labels: [] // 要显示label的字段
			};
		},
		onReachBottom() {
			console.log('触底');
			if (!this.noData) {
				this.$refs.bxList.pageInfo.pageNo++;
				this.$refs.bxList.getListData().then(data => {});
			}
		},
		onShow() {
			if (this.serviceName && this.$refs.bxList) {
				this.$refs.bxList.onRefresh();
			}
		},
		onLoad(option) {
			if (option.hideFootBtn) {
				this.showFootBtn = false
			}
			if (option.label) {
				try {
					this.labels = JSON.parse(option.label)
				} catch (e) {
					//TODO handle the exception
				}
			}
			let query = {};
			// #ifdef H5
			// this.listTop = 0;
			if (option.query) {
				query = JSON.parse(decodeURIComponent(option.query));
			} else {
				query = option;
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (option.serviceName) {
				query = option;
			} else {
				query = JSON.parse(decodeURIComponent(option.query));
			}
			if (option.navigationBarTitle) {
				this.navigationBarTitle = option.navigationBarTitle;
				uni.setNavigationBarTitle({
					title: option.navigationBarTitle
				});
			}
			// #endif
			if (option.hasOwnProperty('showAdd')) {
				this.queryOption = option;
			}
			if (option.order) {
				try {
					this.order = JSON.parse(option.order)
				} catch (e) {
					//TODO handle the exception
				}
			}
			if (query.viewTemp) {
				this.viewTemp = JSON.parse(decodeURIComponent(query.viewTemp));
				if (this.viewTemp.title) {
					this.keyColumn = this.viewTemp.title;
				}
				if (query.destApp) {
					uni.setStorageSync('activeApp', query.destApp);
				}
				if (query.appName) {
					this.appName = query.appName
				}
			}
			if (query.cond) {
				try {
					let cond = JSON.parse(decodeURIComponent(query.cond));
					if (Array.isArray(cond)) {
						cond.forEach(item => {
							if ((item.colName === 'create_user' || item.colName === 'openid' || item.colName ===
									'glry') && item.value === 'user_no') {
								item.value = uni.getStorageSync('login_user_info').user_no;
							}
						});
						this.condition = cond;
					}
				} catch (e) {
					console.log(e);
					//TODO handle the exception
				}
				// this.condition = JSON.parse(this.getDecodeUrl(option.cond));
			}
			if (query.relation_condition) {
				try {
					let cond = JSON.parse(decodeURIComponent(query.relation_condition));
					if (Array.isArray(cond.data)) {
						cond.data.forEach(item => {
							if ((item.colName === 'create_user' || item.colName === 'openid' || item.colName ===
									'glry') && item.value === 'user_no') {
								item.value = uni.getStorageSync('login_user_info').user_no;
							}
						});
						this.relation_condition = cond;
					}
				} catch (e) {
					console.log(e);
					//TODO handle the exception
				}
			}

			if (query.tempWord) {
				this.tempWord = JSON.parse(query.tempWord);
			}
			if (query.showRowButton) {
				this.showRowButton = query.showRowButton;
			}
			if (query.serviceName && query.pageType) {
				this.serviceName = query.serviceName;
				this.pageType = query.pageType;
				if (query.params) {
					let params = {};
					if (typeof query.params === 'string') {
						try {
							params = JSON.parse(query.params);
							this.queryParams = params;
						} catch (e) {
							//TODO handle the exception
						}
					}
				}
				this.getListV2();
			} else {}
		},
		methods: {
			toFilter(e) {
				this.searchVal = ''
				this.showFilter = false;
				if (Array.isArray(e)) {
					let cond = e.filter(item => item.value !== '全部').map(item => {
						let obj = {
							colName: item.column,
							ruleType: 'like',
							value: item.value
						}
						if (item.col_type === 'Set') {
							obj.ruleType = 'inset'
						}
						return obj
					})
					this.$refs.bxList.getListData(cond)
				}
			},
			hideFilter() {
				this.showFilter = false
			},
			showFilterModal() {
				this.showFilter = true
			},
			toSearch() {
				let keywords = this.searchVal;
				this.$refs.bxList.toSearch();
			},
			loadEnd(e) {
				this.noData = true;
			},
			clickAddButton() {
				if (this.pageType === 'proc') {
					this.publicButton.map(item => {
						if (item.button_type === 'add' || item.button_type === 'apply') {
							uni.navigateTo({
								url: '/pages/public/proc/apply/apply?serviceName=' + item.service_name +
									'&cond=' + decodeURIComponent(JSON.stringify(this.condition))
							});
						}
					});
				} else {
					this.publicButton.map(item => {
						if (item.button_type === 'add') {
							let fieldsCond = [];
							if (Array.isArray(this.condition)) {
								fieldsCond = this.condition.map(item => {
									return {
										column: item.colName,
										value: item.value,
										display: false
									};
								});
							}
							if (item.service_name.indexOf('health_plan_schedule') !== -1) {
								if (fieldsCond.find(item => item.column === 'sdr_no')) {
									fieldsCond.push({
										column: 'play_srv',
										value: '大夫开药',
										display: false
									});
								}
								if (this.patientInfo && this.patientInfo.no) {
									fieldsCond.push({
										column: 'owner_person_no',
										value: this.patientInfo.no,
										display: false
									});
								}
								if (this.doctorInfo && this.doctorInfo.no) {
									fieldsCond.push({
										column: 'create_manager_no',
										value: this.doctorInfo.no,
										display: false
									});
								}
							} else if (item.service_name === 'srvhealth_drug_schedule_doctor_detail_list_add') {
								let ds_no = this.condition.find(item => item.colName === 'ds_no');
								if (ds_no && ds_no.value) {
									let url =
										`/archivesPages/DrugSelect/DrugSelect?ds_no=${ds_no.value}&type=大夫开药&service_name=${item.service_name}`;
									uni.navigateTo({
										url: url
									});
								}
								return;
							}
							let url = `/publicPages/newForm/newForm?type=add&serviceName=${item.service_name.replace('_select', '_add')}&fieldsCond=${
							JSON.stringify(fieldsCond)}`;
							if (this.appName) {
								url += `&appName=${this.appName}`
							}
							uni.navigateTo({
								url: url
							});
						}
					});
				}
			},
			searchBarFocus(e) {
				console.log('searchBarFocus:', e);
			},
			serachBarBlur(e) {
				console.log('serachBarBlur:', e);
			},
			listChange(e) {
				console.log('listChange:', e);
			},
			clickItem(e) {
				if (this.pageType === 'proc') {
					uni.navigateTo({
						url: '/pages/public/proc/procDetail/procDetail?proc_instance_no=' + e.proc_instance_no
					});
				} else {
					let req = {
						button: {
							button_name: '详情',
							button_type: 'detail',
							service_name: this.serviceName
						},
						row: e
					};
					try {
						this.onButtonToUrl(req, this.appName).then(res => {
							console.log('clickItem :', res);
							let {
								row,
								button
							} = res
							if (row && row.id) {
								let fieldsCond = [{
									column: 'id',
									value: row.id,
									display: false
								}]
								let otherParams = this.handleSpecialClickEvent(res)
								if (otherParams && otherParams.otherFieldsCond) {
									if (Array.isArray(otherFieldsCond)) {
										fieldsCond = [...fieldsCond, ...otherFieldsCond]
									}
								}
								let url =
									`/publicPages/newForm/newForm?type=detail&serviceName=${button.service_name}&fieldsCond=${JSON.stringify(fieldsCond)}`
								if (otherParams.hideColumn) {
									url += `&hideColumn=${JSON.stringify(otherParams.hideColumn)}`
								}
								if (this.appName) {
									url += `&appName=${this.appName}`
								}
								if (button.service_name === 'srvdaq_cms_content_select') {
									if (e.content_no) {
										uni.navigateTo({
											url: `/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}`
										});
									}
									return
								}
								uni.navigateTo({
									url: url
								})
							}

						});
					} catch (e) {
						//TODO handle the exception
					}
				}
				console.log('click-list-item:', e);
			},
			handleSpecialClickEvent(e) {
				// 处理特殊的点击事件参数
				let result = {}
				if (e && e.button && e.button.service_name) {
					switch (e.button.service_name) {
						case "srvhealth_store_user_select":
							result.hideColumn = ['name', 'image', 'type', 'store_user_no', '_store_no_disp', 'store_no',
								'_person_no_disp',
								'person_no', 'user_account', 'store_remark_person_name', 'kefu_kefu_unread_msg',
								'invite_user_no', 'home_store_no', 'kefu_session_no', 'kefu_session_user_last_time',
								'kefu_session_kefu_last_time', 'kefu_session_user_unread_msg',
								'kefu_session_kefu_unread_msg', 'store_session_sign_in_time',
								'store_session_user_unread_msg', 'add_url', 'create_time', 'create_user_disp'
							]
							break;
						case 'srvhealth_store_vaccination_appointment_select':
							result.hideColumn = ['sa_no', 'store_no', 'svs_no', 'svs_name', 'create_time', 'create_user',
								'create_user_disp', 'modify_user', 'modify_user_disp', 'modify_time'
							];
							break;
						case 'srvhealth_store_vaccine_stocks_select':
							result.hideColumn = ['vs_no', 'store_no', 'drug_classify_no', 'create_time', 'create_user',
								'create_user_disp', 'modify_user', 'modify_user_disp', 'modify_time'
							]
							break;
						case 'srvdaq_cms_content_update': //新闻公告编辑
							result.hideColumn = ['no']
							break;
					}
				}
				return result
			},
			async clickFootBtn(data) {
				let self = this
				let buttonInfo = this.deepClone(data.button);
				let rowData = this.deepClone(data.row);
				if (buttonInfo.operate_params && typeof buttonInfo.operate_params === 'string') {
					try {
						buttonInfo.operate_params = JSON.parse(buttonInfo.operate_params);
						if (Array.isArray(buttonInfo.operate_params.condition) && buttonInfo.operate_params.condition
							.length > 0) {
							buttonInfo.operate_params.condition.forEach(cond => {
								if (typeof cond.value === 'object' && cond.value.value_type === 'rowData') {
									cond.value = data.row[cond.value.value_key];
								} else if (typeof cond.value === 'object' && cond.value.value_type ===
									'constant') {
									cond.value = cond.value.value;
								}
							});
						}
						if (Array.isArray(buttonInfo.operate_params.data) && buttonInfo.operate_params.data.length >
							0) {
							buttonInfo.operate_params.data.forEach(data => {
								if (typeof data === 'object') {
									Object.keys(data).forEach(item => {
										if (typeof data[item] === 'object' && data[item].value_type ===
											'rowData') {
											data[item] = rowData[data[item].value_key];
										} else if (typeof data[item] === 'object' && data[item]
											.value_type === 'constant') {
											data[item] = data[item].value;
										}
									});
								}
							});
						}
						if (buttonInfo.operate_type === '操作' && buttonInfo.operate_mode === '静默操作') {
							let req = [{
								serviceName: buttonInfo.operate_service,
								condition: buttonInfo.operate_params.condition,
								data: buttonInfo.operate_params.data
							}];
							let app = this.appName || uni.getStorageSync('activeApp');
							let url = this.getServiceUrl(buttonInfo.application || app, buttonInfo.operate_service,
								buttonInfo.servcie_type);
							let res = await this.$http.post(url, req);
							if (res.data.state === 'SUCCESS') {
								this.$refs.bxList.onRefresh();
							}
							return
						} else if (buttonInfo.operate_type === '更新弹出') {
							// let params = {
							// 	type: buttonInfo.servcie_type,
							// 	serviceName: buttonInfo.operate_service,
							// 	defaultVal: {}
							// };
							// uni.navigateTo({
							// 	url: '/pages/public/formPage/formPage?serviceName=' +
							// 		buttonInfo.operate_service +
							// 		'&type=' +
							// 		buttonInfo.servcie_type +
							// 		'&cond=' +
							// 		decodeURIComponent(JSON.stringify(buttonInfo.operate_params.condition))
							// });

							// 自定义按钮
							let moreConfig = buttonInfo.more_config;
							if (moreConfig && typeof moreConfig === 'string') {
								try {
									moreConfig = JSON.parse(moreConfig);
								} catch (e) {
									//TODO handle the exception
									console.log(e);
								}
							}
							if (buttonInfo.servcie_type === 'add') {
								let params = {
									type: 'add',
									serviceName: buttonInfo.service_name,
									defaultVal: data.row,
									eventOrigin: buttonInfo
								};
								uni.navigateTo({
									url: '/pages/public/formPage/formPage?params=' + JSON.stringify(
										params)
								});
								return
							} else if (buttonInfo.servcie_type === 'select') {
								let params = {
									type: 'select',
									serviceName: buttonInfo.service_name,
									defaultVal: data.row,
									eventOrigin: buttonInfo
								};
								if (buttonInfo.operate_params && Array.isArray(buttonInfo.operate_params
										.condition)) {
									let viewTemp = {};
									if (buttonInfo.service_name ===
										'srvhealth_store_vaccination_appoint_record_select') {
										viewTemp = {
											title: 'customer_name',
											img: 'person_image',
										}
									}
									uni.navigateTo({
										url: '/publicPages/list/list?pageType=list&serviceName=' +
											buttonInfo.service_name +
											'&cond=' +
											JSON.stringify(buttonInfo.operate_params.condition) +
											'&viewTemp=' +
											JSON.stringify(viewTemp)
									});
									return
								}
							} else if (buttonInfo.servcie_type === 'update') {
								let params = {
									type: 'update',
									serviceName: buttonInfo.service_name,
									defaultVal: data.row,
									eventOrigin: buttonInfo
								};
								let fieldsCond = [];
								let condition = buttonInfo.operate_params.condition
								let defaultVal = buttonInfo.operate_params.data
								if (Array.isArray(defaultVal) && defaultVal.length > 0) {
									let obj = defaultVal[0]
									if (this.iObject(obj)) {
										Object.keys(obj).forEach(key => {
											fieldsCond.push({
												column: key,
												value: obj[key]
											})
										})
									}
								}
								if (Array.isArray(condition) && condition.length > 0) {
									condition.forEach(cond => {
										fieldsCond.push({
											column: cond.colName,
											value: cond.value
										})
									})
								}
								let otherParams = this.handleSpecialClickEvent(data)
								if (otherParams && otherParams.otherFieldsCond) {
									if (Array.isArray(otherFieldsCond)) {
										fieldsCond = [...fieldsCond, ...otherFieldsCond]
									}
								}
								let url =
									`/publicPages/newForm/newForm?service=${buttonInfo.service}&serviceName=${buttonInfo.service_name}&type=${buttonInfo.servcie_type}&fieldsCond=` +
									encodeURIComponent(JSON.stringify(fieldsCond));
								if (this.appName) {
									url += `&appName=${this.appName}`
								}
								if (otherParams && otherParams.hideColumn) {
									url += `&hideColumn=${JSON.stringify(otherParams.hideColumn)}`
								}
								uni.navigateTo({
									url: url
								});
								return
							}
						} else if (buttonInfo.operate_type === '列表跳转') {
							if (buttonInfo.operate_params && Array.isArray(buttonInfo.operate_params
									.condition)) {
								let viewTemp = {};
								let condition = []
								if (buttonInfo.service_name ===
									'srvhealth_store_vaccination_appoint_record_select') {
									viewTemp = {
										title: 'customer_name',
										footer: 'customer_phone',
										tip: 'customer_birth_day',
										img: 'person_image',
									}
								} else if (buttonInfo.service_name ===
									'srvhealth_store_vaccination_appointment_select') {
									// 预约列表
									viewTemp = {
										title: 'app_date',
										footer: 'app_desc',
										price: 'app_count',
										tip: 'appoint_name',
									}
									// condition = [{
									// 	colName:'app_date',
									// 	ruleType:'ge',

									// }]
								}
								let labels = ['customer_birth_day', 'app_date', 'app_count', 'app_desc']
								uni.navigateTo({
									url: `/publicPages/list/list?pageType=list&label=${JSON.stringify(labels)}&serviceName=${buttonInfo.service_name}&cond=${	JSON.stringify(buttonInfo.operate_params.condition) }&viewTemp=${JSON.stringify(viewTemp)}`
								});
							}
							return
						}
					} catch (e) {
						console.error(e);
						//TODO handle the exception
					}
				}

				if (this.pageType === 'proc') {
					if (data.button && data.button.button_type === 'edit' && data.row.proc_instance_no) {
						uni.navigateTo({
							url: '/publicPages/procDetail/procDetail?proc_instance_no=' + data.row
								.proc_instance_no
						});
					}
				} else {
					this.onButtonToUrl(data, this.appName).then(res => {
						if (data.button && data.button.button_type === 'delete') {
							if (res.state === 'SUCCESS') {
								this.$refs.bxList.onRefresh();
							}
						}
						if (data.button && data.button.button_type === 'detail') {
							let row = res.row;
							let btn = res.button;
							let params = {
								type: 'detail',
								condition: [{
									colName: 'id',
									ruleType: 'in',
									value: row.id
								}],
								serviceName: btn.service_name,
								defaultVal: row
							};
							let url = `/pages/public/formPage/formPage?params=${JSON.stringify(params)}`
							if (this.appName) {
								url += `&appName=${this.appName}`
							}
							uni.navigateTo({
								url: url
							});
						} else if (data.button && data.button.button_type === 'customize') {
							// 自定义按钮
							let moreConfig = data.button.more_config;
							if (moreConfig && typeof moreConfig === 'string') {
								try {
									moreConfig = JSON.parse(moreConfig);
								} catch (e) {
									//TODO handle the exception
									console.log(e);
								}
							}
							if (data.button.servcie_type === 'add') {
								let params = {
									type: 'add',
									serviceName: data.button.service_name,
									defaultVal: data.row,
									eventOrigin: data.button
								};
								uni.navigateTo({
									url: '/pages/public/formPage/formPage?params=' + JSON.stringify(
										params)
								});
							} else if (data.button.servcie_type === 'select') {
								let params = {
									type: 'select',
									serviceName: data.button.service_name,
									defaultVal: data.row,
									eventOrigin: data.button
								};
								if (data.button.operate_params && Array.isArray(data.button.operate_params
										.condition)) {
									let viewTemp = {};
									if (data.button.service_name ===
										'srvhealth_store_vaccination_appoint_record_select') {
										viewTemp = {
											title: 'customer_name',
											img: 'person_image',
										}
									}
									uni.navigateTo({
										url: '/publicPages/list/list?pageType=list&serviceName=' +
											data.button.service_name +
											'&cond=' +
											JSON.stringify(data.button.operate_params.condition) +
											'&viewTemp=' +
											JSON.stringify(viewTemp)
									});
								}
							} else if (data.button.servcie_type === 'update') {
								let params = {
									type: 'update',
									serviceName: data.button.service_name,
									defaultVal: data.row,
									eventOrigin: data.button
								};
								let fieldsCond = [];
								if (Array.isArray(this.condition)) {
									fieldsCond = this.condition.map(item => {
										return {
											column: item.colName,
											value: item.value,
											display: false
										};
									});
								}
								let condition = data?.button?.operate_params?.condition
								let defaultVal = data?.button?.operate_params?.data
								if (Array.isArray(defaultVal) && defaultVal.length > 0) {
									let obj = defaultVal[0]
									if (this.iObject(obj)) {
										Object.keys(obj).forEach(key => {
											fieldsCond.push({
												column: key,
												value: obj[key]
											})
										})
									}
								}
								if (Array.isArray(condition) && condition.length > 0) {
									condition.forEach(cond => {
										fieldsCond.push({
											column: cond.colName,
											value: cond.value
										})
									})
								}
								let otherParams = this.handleSpecialClickEvent(res)
								if (otherParams && otherParams.otherFieldsCond) {
									if (Array.isArray(otherFieldsCond)) {
										fieldsCond = [...fieldsCond, ...otherFieldsCond]
									}
								}
								let url =
									`/publicPages/newForm/newForm?service=${data.button.service}&serviceName=${data.button.service_name}&type=${data.button.servcie_type}&fieldsCond=` +
									encodeURIComponent(JSON.stringify(fieldsCond));
								if (this.appName) {
									url += `&appName=${this.appName}`
								}
								if (otherParams && otherParams.hideColumn) {
									url += `&hideColumn=${JSON.stringify(otherParams.hideColumn)}`
								}
								uni.navigateTo({
									url: url
								});
							}
						} else if (data.button && data.button.button_type === 'duplicate') {
							let fieldsCond = []
							if (Array.isArray(self.condition)) {
								self.condition.forEach(item => {
									fieldsCond.push({
										column: item.colName,
										value: item.value,
										display: false
									})
								})
							}
							Object.keys(data.row).forEach(key => {
								if (!['id', 'modify_user_disp', 'modify_user', 'modify_time',
										'create_user_disp', 'create_user', 'create_time'
									].includes(key)) {
									fieldsCond.push({
										column: key,
										value: data.row[key],
									})
								}
							})

							let url =
								`/publicPages/newForm/newForm?serviceName=${data.button.service_name}&type=add&fieldsCond=${JSON.stringify(fieldsCond)}`;
							if (self.appName) {
								url += `&appName=${self.appName}`
							}
							uni.navigateTo({
								url: url
							});
						} else if (data.button.servcie_type === 'add') {
							let params = {
								type: 'add',
								serviceName: res.button.service_name,
								defaultVal: res.row,
								eventOrigin: res.button
							};
							uni.navigateTo({
								url: '/pages/public/formPage/formPage?params=' + JSON.stringify(params)
							});
						} else if (data.button && data.button.operate_type === '流程申请') {
							uni.navigateTo({
								url: '/pages/public/proc/apply/apply?serviceName=' + data.button
									.operate_service
							});
						}
					});
				}
				console.log('clickFootBtn:', data);
			},
			async getListV2() {
				let app = this.appName || uni.getStorageSync('activeApp');
				let self = this;
				let colVs = await this.getServiceV2(this.serviceName, 'list', this.pageType === 'proc' ? 'proclist' :
					'list', app);
				colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1 || item.in_list === 2);
				if (!this.navigationBarTitle) {
					uni.setNavigationBarTitle({
						title: colVs.service_view_name
					});
				}
				console.log('colVs', colVs);
				if (colVs.more_config) {
					try {
						colVs.moreConfig = JSON.parse(colVs.more_config)
					} catch (e) {
						//TODO handle the exception
						console.info(e)
					}
				}
				this.listConfig = colVs;
				if (this.pageType === 'proc') {
					this.showFootBtn = false;
				}
				this.publicButton = colVs.gridButton.filter(item => {
					if (item.permission === true) {
						switch (item.button_type) {
							case 'add':
							case 'apply':
								this.showAdd = true;
								return item;
								break;
							case 'select':
								this.showSearchBar = true;
								// #ifdef MP-WEIXIN
								this.listTop = 100;
								// #endif
								return item;
								break;
							case 'customize':
								if (item.application === 'zhxq' && item.button_name === '住户录入') {
									if (self.queryOption && self.queryOption.hasOwnProperty('showAdd')) {
										self.showAdd = self.queryOption.showAdd === 'false' ? false : self
											.queryOption.showAdd == 'true' ? true : self.queryOption.showAdd;
									} else {
										self.showAdd = true;
									}
									return item;
								}
						}
					}
				});
				return colVs;
			}
		}
	};
</script>

<style lang="scss">
	.cu-modal {
		z-index: 666;
		.cu-dialog {
			background-color: transparent;
		}
	}

	.page-wrap {
		position: absolute;
	}

	.search-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100vw;

		// height: 100px;
		.search-form {
			transition: all .5s ease-in-out;
		}

		.action {
			margin-right: 20rpx;

			.cu-btn {
				font-size: 40rpx;
				padding: 0 20rpx;

				&.bg-cyan {
					background-color: #0bc99d;
				}
			}
		}
	}

	.add-button {
		position: fixed;
		bottom: 100upx;
		left: calc(50% - 50upx);
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		background-color: #0bc99d;
		z-index: 100;

		&::before {
			position: absolute;
			width: 8upx;
			height: 60upx;
			left: calc(50% - 4upx);
			top: 20upx;
			content: '';
			background-color: #fff;
		}

		&::after {
			position: absolute;
			width: 60upx;
			height: 8upx;
			content: '';
			top: calc(50% - 4upx);
			left: 20upx;
			background-color: #fff;
		}

		&:active {
			transform: rotate(45deg);
			transition: all 0.2s;
		}
	}
</style>
