<template>
	<view class="symptoomSelectWrap">
		<view class="symptopm-tops">
			<Thetable :list="chooseArr" @delAlltabAllansw="delAlltabAllansw" ref="tabbox" @delHtml="deltab"></Thetable>
		</view>
		<view class="symptom-bot-wrap-main"
			v-if="symptomList.length && symptomList[0].children.length > 0 && !isSearch">
			<cascader-selector @clickTag="clickTag" hideButton :srvInfo="srvInfo"></cascader-selector>
		</view>
		<!-- 		<view class="cu-modal bottom-modal" :class="{ show: showSymptomDateSelector }">
			<view class="cu-dialog" @click.stop="">
				<symptom-form @change="symptomFormChange" :form-type="from" :currentSymptom="currentSymptom"></symptom-form>
			</view>
		</view> -->
		<uni-popup ref="popup" type="bottom">
			<symptom-form @change="symptomFormChange" :form-type="from" :currentSymptom="currentSymptom"></symptom-form>
		</uni-popup>
	</view>
</template>

<script>
	import Thetable from '../components/Thetable/Thetable.vue'
	import symFrom from '../components/bx-sym-from/bx-sym-from.vue'
	import cascaderSelector from '@/components/cascader-selector/cascader-selector.vue'
	import symptomForm from './symptom-form.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			Thetable,
			symFrom,
			cascaderSelector,
			symptomForm
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		data() {
			return {
				from: '',
				showSymptomDateSelector: false,
				currentSymptom: {},
				searchValue: '',
				currentTab: 0,
				currentMenu: 0,
				isChunk: uni.getStorageSync('is_chunk') ? uni.getStorageSync('is_chunk') : true,
				TableList: [],
				poupName: null,
				mask: false,
				isSearch: false,
				scrollMenuLeft: 0,
				dataItem: [],
				oriData: [],
				serBtn: false,
				serseData: [],
				symptomTitList: [],
				symptomList: [],
				chooseArr: [],
				query: '',
				show: false,
				srvInfo: {
					column: 'no',
					showCol: 'name',
					isTree: true,
					serviceName: 'srvhealth_self_symptoms_select',
					appNo: 'health',
					key_disp_col: 'name'
				},
				checkedData: [],
				current_item: '',
				menuIsShow: false,
				activeIndex: 0,
				currentTopTab: '',
				fromTypeData: '' //表单类型和数据
			}
		},
		mounted(e) {
			if (this.query.type === 'symptom') {
				this.getSymptomTitList()
				uni.setStorageSync('is_chunk', this.isChunk)
			}
		},
		watch: {
			chooseArr: {
				handler(newval, oldval) {
					let flattArr = this.flag(this.symptomList)
					if (newval.length > 0) {
						newval.forEach(item => {
							flattArr.forEach(fal => {
								if (item.id === fal.id) {
									fal.is_checked = item.is_checked
								}
							})
						})
						this.symptomList = this.assemblyData(flattArr)
					}
				},
				deep: true,
				immediate: true
			}
		},
		onLoad(option) {
			if (option.from) {
				this.from = option.from
			}
			if (!option.term) {
				let term = {
					serviceName: 'srvhealth_self_symptoms_select',
					srvApp: 'health',
					key: 'name',
					type: 'symptom'
				}
				this.query = term
			} else {
				let query = JSON.parse(decodeURIComponent(option.term))
				this.query = query
			}
		},
		methods: {
			async symptomFormChange(e) {
				this.$refs.popup.close();
				this.showSymptomDateSelector = false
				if (e === false) {} else if (e.occur_time) {
					this.currentSymptom.occur_time = e.occur_time
					this.currentSymptom.symptoms_remark = e.symptoms_remark
					this.getCascaderValue(this.currentSymptom)
					if (this.from === 'symptom_record') {
						let req = [{
							"serviceName": "srvhealth_self_symptoms_record_add",
							"condition": [],
							"data": [{
								"info_no":this.userInfo.no,
								"user_account": this.userInfo.userno,
								"occur_time":e.occur_time,
								"symptoms_no": this.currentSymptom.no,
								"symptoms_name": this.currentSymptom.name,
								"symptoms_remark": e.symptoms_remark
							}]
						}]
						this.$fetch('operate', 'srvhealth_self_symptoms_record_add', req, 'health')
					}
				
				}
			},
			async addSymptom() {
				let data = this.currentSymptom
				let self = this
				let req = [{
					serviceName: 'srvhealth_self_symptoms_record_add',
					condition: [],
					data: []
				}]
				req[0].data = self.chooseArr.map(item => {
					return {
						info_no: self.userInfo.no,
						user_account: self.userInfo.userno,
						occur_time: item.occur_time,
						symptoms_no: item.no,
						symptoms_name: item.name,
						symptoms_remark: item.symptoms_remark
					}
				})
				let res = await this.$fetch('operate', 'srvhealth_self_symptoms_record_add', req, 'health')
				if (res.success) {
					uni.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/archivesPages/archives-history/archives-history?pageType=symptom'
								})
							}
						}
					})
				}
			},
			clickTag(e) {
				let self = this
				if (e.node_type && e.node_type !== '分类' && this.chooseArr.findIndex(item => item.no === e.no) === -1) {
					// if (this.from === 'symptom_record') {
					this.showSymptomDateSelector = true
					this.$refs.popup.open();
					this.currentSymptom = e
					// } else {
					// 	uni.showModal({
					// 		title: e.name,
					// 		content: '确认添加此症状?',
					// 		success(res) {
					// 			if (res.confirm) {
					// 				self.getCascaderValue(e)
					// 			}
					// 		}
					// 	})
					// }
				}
			},
			getCascaderValue(e) {
				e.is_checked = true
				let chooseArr = this.chooseArr
				if (chooseArr.length == 0) {
					chooseArr.push(e)
				} else {
					let isHas = false
					chooseArr.forEach(it => {
						if (it.id === e.id) {
							isHas = true
						}
					})
					if (!isHas) {
						chooseArr.push(e)
					}
				}
			},
			/*获取点击顶部菜单数据**/
			async getCurrentTabList(item) {
				let no = item.no
				let url = this.getServiceUrl(this.query.srvApp, this.query.serviceName, 'select')
				let req = {
					serviceName: this.query.serviceName,
					colNames: ['*'],
					condition: [{
						colName: 'path',
						ruleType: 'like',
						value: no
					}],
					order: [],
					page: {
						pageNo: 1,
						rownumber: 6000
					}
				}
				let res = await this.$http.post(url, req)
				let chooseData = uni.getStorageSync('symptomList')
				console.log('======>点击顶部数据', res.data.data)
				res.data.data.forEach(item => {
					item['is_checked'] = false
					if (chooseData && chooseData.length > 0) {
						chooseData.forEach(choose => {
							if (item.id === choose.id) {
								item.is_checked = true
							}
						})
					}
				})
				if (this.chooseArr.length > 0) {
					this.chooseArr.forEach(s => {
						res.data.data.forEach(o => {
							if (o.id === s.id) {
								o.is_checked = true
							}
						})
					})
				}
				let parentNodeData = this.assemblyData(res.data.data)
				this.symptomList = parentNodeData
			},
			change(index) {
				this.currentTab = index
				this.currentMenu = 0
			},

			/** 复选框事件*/
			checkedItemChange(e, item) {
				console.log(e, item)
				let self = this
				let checkedData = this.checkedData
				let data = this.fromTypeData
				if (this.checkedData.length >= 0) {
					if (checkedData.indexOf(e.name) > -1) {
						let word_index = checkedData.indexOf(e.name)
						checkedData.forEach((item, index) => {
							checkedData.splice(word_index, 1)
						})
					} else {
						checkedData.push(e.name)
					}
				}
				data.forEach((d, i) => {
					if (d.title === item.title) {
						if (checkedData.length > 0) {
							let a = checkedData.join()
							d.value = a
							self.$set(self.fromTypeData, i, d)
						} else {
							d.value = ''
							self.$set(self.fromTypeData, i, d)
						}
					}
				})
			},

			chooseItem(item) {
				let fromTypeData = item.optional_para ? JSON.parse(item.optional_para) : ''
				item.is_checked = !item.is_checked
				this.current_item = item
				if (this.chooseArr.indexOf(this.current_item)) {}
				if (fromTypeData) {
					fromTypeData.forEach(item => {
						item['value'] = ''
						item['isfail'] = false
						if (item.type === 'num') {
							item.value = 0
						}
					})
					this.fromTypeData = fromTypeData
					if (item.is_checked) {
						this.show = true
					}
				}

				console.log('----', item)
				let chooseArr = this.chooseArr
				if (item.is_checked) {
					chooseArr.push(item)
				} else {
					if (chooseArr.length > 0) {
						chooseArr.forEach((alo, i) => {
							if (item.id === alo.id) {
								chooseArr.splice(i, 1)
							}
						})
					}
				}
			},
			lookobj() {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确认提交?',
					success: res => {
						if (res.confirm) {
							if (self.from === 'symptom_record') {
								self.addSymptom()
							} else {
								if (self.query.type === 'symptom') {
									// uni.setStorageSync('symptomList', self.chooseArr)
									uni.$emit('symptomSelect', self.chooseArr)
								}
								if (self.chooseArr.length > 0) {
									// self.$store.commit('SET_SYMPTOM_ARR', self.chooseArr)
									uni.navigateTo({
										url: '/archivesPages/illnessDetaiList/illnessDetaiList'
									})
								}
							}
						}
					}
				})
			},
			async getSymptomTitList() {
				let url = this.getServiceUrl(this.query.srvApp, this.query.serviceName, 'select')
				let req = {
					serviceName: this.query.serviceName,
					colNames: ['*'],
					condition: [{
						colName: 'parent_no',
						ruleType: 'isnull'
					}],
					order: []
					// page:{pageNo: 1, rownumber: 500}
				}
				let res = await this.$http.post(url, req)
				this.symptomTitList = res.data.data
				this.getCurrentTabList(res.data.data[0])
				console.log('---标题---', this.symptomTitList)
			},
			async getSymptomList(symptomList) {
				// 请求疾病列表
				let url = this.getServiceUrl(this.query.srvApp, this.query.serviceName, 'select')
				let req = {
					serviceName: this.query.serviceName,
					colNames: ['*'],
					relation_condition: {},
					order: []
				}
				let chooseData = uni.getStorageSync('symptomList')
				let res = await this.$http.post(url, req)
				if (res.data.state === 'SUCCESS') {
					if (Array.isArray(res.data.data) && res.data.data.length > 0) {
						res.data.data.forEach(item => {
							item['is_checked'] = false
							if (chooseData && chooseData.length > 0) {
								chooseData.forEach(choose => {
									if (item.id === choose.id) {
										item.is_checked = true
									}
								})
							}
						})
						let parentNode = this.assemblyData(res.data.data)
						this.symptomList = parentNode
					}
				}
			},
			/**
			 * 扁平化数组
			 * */
			flag(arr) {
				let result = []
				for (let item of arr) {
					var res = JSON.parse(JSON.stringify(item)) // 先克隆一份数据作为第一层级的填充
					delete res['children']
					result.push(res)
					if (item.children instanceof Array && item.children.length > 0) {
						// 如果当前child为数组并且长度大于0，才可进入flag()方法
						result = result.concat(this.flag(item.children))
					}
				}
				return result
			},
			/**
			 * 对扁平化数组进行重新组装
			 * */
			assemblyData(arr) {
				let flattArr = arr
				let parentNode = flattArr.filter(item => !item.parent_no)
				parentNode.forEach(parent => {
					parent.children = []
					parent['is_show'] = false
					flattArr.forEach(item => {
						if (item.parent_no === parent.no) {
							parent.children.push(item)
						}
					})
					if (Array.isArray(parent.children) && parent.children.length > 0) {
						parent.children.forEach(child => {
							child.children = []
							flattArr.forEach(item => {
								if (item.parent_no === child.no) {
									child.children.push(item)
									parent.is_show = true
								}
							})
							if (Array.isArray(child.children)) {
								child.children.forEach(thirdChild => {
									thirdChild.children = []
									flattArr.forEach(thirdChilditem => {
										if (thirdChilditem.parent_no === thirdChild.no) {
											thirdChild.children.push(thirdChilditem)
											// parent.is_show = true;
										}
									})
								})
							}
						})
					}
				})
				return parentNode
			},
			delAlltabAllansw(type) {
				this.chooseArr = []
				// uni.setStorageSync('symptomList',this.chooseArr)
				let alls = this.symptomList
				let flattArr = this.flag(alls)
				flattArr.forEach(item => {
					item.is_checked = false
				})
				let newData = this.assemblyData(flattArr)
				this.symptomList = newData
			},
			deltab(item) {
				let allArr = this.deepClone(this.chooseArr)
				allArr.forEach((items, index) => {
					if (item.id === items.id) {
						allArr.splice(index, 1)
					}
				})
				this.chooseArr = allArr
				let flattArr = this.flag(this.symptomList)
				flattArr.forEach(flt => {
					if (flt.id === item.id) {
						flt.is_checked = false
					}
				})
				let newData = this.assemblyData(flattArr)
				this.symptomList = newData
			},
			searchStart() {
				let searchVal = this.searchValue
				let url = this.getServiceUrl('health', 'srvhealth_self_symptoms_select', 'select')
				let req = {
					serviceName: 'srvhealth_self_symptoms_select',
					colNames: ['*'],
					condition: [{
						colName: 'name',
						ruleType: 'like',
						value: searchVal
					}],
					page: {
						pageNo: 1,
						rownumber: 50
					}
				}
				if (searchVal) {
					this.$http.post(url, req).then(res => {
						this.isSearch = true
						this.serseData = res.data.data
						console.log('搜索开始----', res.data.data)
					})
				} else {
					this.isSearch = false
				}
			},
			searchEnd() {
				this.isSearch = false
			},
			cancel() {
				let currtItem = this.current_item
				this.chooseArr.forEach((item, index) => {
					if (item.id === currtItem.id) {
						this.chooseArr.splice(index, 1)
					}
				})
				let flattArr = this.flag(this.symptomList)
				flattArr.forEach(flt => {
					if (flt.id === currtItem.id) {
						flt.is_checked = false
					}
				})
				this.symptomList = this.assemblyData(flattArr)

				this.show = false
			},
			confirm() {
				let data = this.fromTypeData
				let current_item = this.current_item
				let values = []
				let fromData = []
				let isPass = false
				data.forEach(item => {
					if (item.value) {
						values.push(item.value)
					}
					if (item.required && item.value) {
						isPass = true
					} else if (item.required && !item.value) {
						isPass = false
					}
				})
				if (isPass) {
					let str = values.join()
					this.$set(current_item, 'answer', str)
					this.chooseArr.forEach(chose => {
						if (chose.id === current_item.id) {
							chose['fromTypeData'] = this.fromTypeData
						}
					})
					this.show = false
				} else {
					data.forEach(must => {
						if (must.required && !must.value) {
							must.isfail = true
						}
					})
					uni.showToast({
						title: '请完善信息',
						icon: 'none',
						duration: 1000
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.symptoomSelectWrap {
		overflow-x: hidden;
		min-height: calc(100vh - var(--window-top));
		background-color: #fff;
	}
</style>
