<template>
	<view>
		<!-- <view class="search-bar" v-if="showSearchBar">
      <view class="cu-bar search bg-white fixed">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="searchBarFocus" @blur="serachBarBlur" :adjust-position="false" type="text" v-model="searchVal" :placeholder="placeholder" confirm-type="search" />
        </view>
        <view class="action"><button class="cu-btn bg-blue shadow-blur round" @click="toSearch">搜索</button></view>
      </view>
      <view style="height: 100upx;width: 100%;">占位</view>
    </view> -->
		<bx-list
			ref="bxList"
			:serviceName="serviceName"
			:condition="condition"
			:pageType="pageType"
			:listType="'list'"
			:showTab="false"
			:viewTemp="viewTemp"
			:listConfig="listConfig"
			:fixed="false"
			:top="0"
			:searchWords="searchVal"
			:searchColumn="keyColumn"
			:rownumber="10"
			:showFootBtn="showFootBtn"
			@click-list-item="clickItem"
			@list-change="listChange"
			@clickFootBtn="clickFootBtn"
			@loadEnd="loadEnd"
		></bx-list>
		<view class="public-button-box"><view class="add-button" @click="clickAddButton" v-if="showAdd"></view></view>
	</view>
</template>

<script>
import bxList from '@/publicPages/components/bx-list/bx-list.vue';
export default {
	components: { bxList },
	data() {
		return {
			serviceName: '',
			pageType: '',
			placeholder: '输入搜索关键词',
			listConfig: {},
			srv_cols: [],
			condition: [],
			pattern: { color: '#7A7E83', backgroundColor: '#fff', selectedColor: '#007AFF', buttonColor: '#007AFF' },
			fabContent: [],
			fabHorizontal: 'left',
			fabVertical: 'bottom',
			fabDirection: 'horizontal',
			viewTemp: {
				// title: 'name',
				// tip: 'desc',
				// img: 'img',
				// price: 'current_price',
				// footer: 'shop_name'
			},
			publicButton: [],
			searchVal: '',
			keyColumn: '',
			showAdd: false,
			noData: false,
			showSearchBar: false,
			showFootBtn: true
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
			// this.getListV2();
			this.$refs.bxList.onRefresh();
		}
	},
	onLoad(option) {
		if (option.viewTemp) {
			let viewTemp = this.getDecodeUrl(option.viewTemp);
			this.viewTemp = JSON.parse(viewTemp);
			if (this.viewTemp.title) {
				this.keyColumn = this.viewTemp.title;
			}
			if (option.destApp) {
				uni.setStorageSync('activeApp', option.destApp);
			}
		}
		if (option.cond) {
			try {
				let cond = JSON.parse(this.getDecodeUrl(option.cond));
				if (Array.isArray(cond)) {
					cond.forEach(item => {
						if ((item.colName === 'create_user'||item.colName === 'userno'||item.colName === 'user_no') && item.value === 'user_no') {
							item.value = uni.getStorageSync('login_user_info').user_no;
						}
					});
					this.condition = cond;
				}
			} catch (e) {
				//TODO handle the exception
			}
			// this.condition = JSON.parse(this.getDecodeUrl(option.cond));
		}
		if (option.hasOwnProperty('serviceName') && option.hasOwnProperty('pageType')) {
			console.log('list option:', option);
			this.serviceName = option.serviceName;
			this.pageType = option.pageType;
			this.getListV2();
		} else {
			// uni.showToast({
			// 	title:"无效页面",
			// 	icon:"Error"
			// })
			// setTimeout(()=>{
			// 	uni.hideToast()
			// 	uni.navigateBack()
			// },2000)
		}
	},
	methods: {
		toSearch() {
			let keywords = this.searchVal;
			this.$refs.bxList.toSearch();
		},
		loadEnd(e) {
			this.noData = true;
		},
		clickAddButton() {
			console.log('你点击了添加按钮:');
			if (this.pageType === 'proc') {
				this.publicButton.map(item => {
					if (item.button_type === 'add' || item.button_type === 'apply') {
						// uni.navigateTo({
						//   url: '/pages/public/proc/apply/apply?serviceName=' + item.service_name +'&cond='+decodeURIComponent(JSON.stringify(this.condition))
						// });
					}
				});
			} else {
				this.publicButton.map(item => {
					if (item.button_type === 'add') {
						let params = {
							type: 'add',
							condition: [],
							serviceName: item.service_name,
							service_view_name: item.service_view_name
						};
						if (this.serviceName === 'srvhealth_person_info_select') {
							params.condition = [
								{
									colName: 'userno',
									ruleType: 'eq',
									value: ''
								}
							];
						}
						uni.navigateTo({
							url: '/publicPages/form/form?serviceName=' + item.service_name + '&type=add&cond=' + decodeURIComponent(JSON.stringify(this.condition))
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
				// uni.navigateTo({
				//   url:'/pages/public/proc/procDetail/procDetail?proc_instance_no='+e.proc_instance_no
				// })
			} else {
				let req = {
					button: {
						button_name: '详情',
						button_type: 'detail',
						service_name: this.serviceName
					},
					row: e
				};
				this.onButtonToUrl(req).then(res => {
					console.log('clickItem :', res);
				});
			}
			console.log('click-list-item:', e);
		},
		clickFootBtn(data) {
			if (this.pageType === 'proc') {
				if (data.button && data.button.button_type === 'edit' && data.row.proc_instance_no) {
					// uni.navigateTo({
					//   url:'/pages/public/proc/procDetail/procDetail?proc_instance_no='+data.row.proc_instance_no
					// })
				}
			} else {
				this.onButtonToUrl(data).then(res => {
					console.log('footBTN :', res);
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
							condition: [
								{
									colName: 'id',
									ruleType: 'in',
									value: row.id
								}
							],
							serviceName: btn.service_name,
							defaultVal: row
						};
						console.log('点击了【有效】的公共编辑按钮', row);
						uni.navigateTo({
							url: '/publicPages/form/form?params=' + JSON.stringify(params)
						});
					}
				});
			}
			console.log('clickFootBtn:', data);
		},
		async getListV2() {
			let app = uni.getStorageSync('activeApp');
			let colVs = await this.getServiceV2(this.serviceName, 'list', this.pageType === 'proc' ? 'proclist' : 'list', app);
			colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1);
			console.log('colVs', colVs);
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
							return item;
							break;
					}
				}
			});
			return colVs;
		}
	}
};
</script>

<style lang="scss" scoped>
.search-bar {
	// height: 100px;
}
.add-button {
	position: fixed;
	bottom: 100upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: #007aff;
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
