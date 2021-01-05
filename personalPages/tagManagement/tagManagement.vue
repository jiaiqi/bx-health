<template>
	<view class="manager-tag">
		<view class="selectedTag">
			<view class="tag-item" @click="checkeTag(item)" v-for="item in curTags" :class="{ active: item.label_no === activeTagNo }">
				<text>{{ item.label_name }}</text>
				<text class="cuIcon-delete margin-left-xs" @click.stop="cancelCheckTag(item)" v-if="item.label_no === activeTagNo"></text>
			</view>
			<input class="input tag-item" type="text" placeholder="添加标签" v-model="curTag" @confirm="createTag" />
		</view>
		<view class="button-box"><button class="cu-btn bg-blue" type="primary" v-if="curTag" @click="createTag({detail:{value:curTag}})">添加</button></view>
		<view class="tag-list" v-if="curTag">
			<!-- <view class="title">所有标签</view> -->
			<view class="tag-item" @click="insertTag(item)" :class="{ checked: curTags.find(tag => tag.label_no === item.label_no) }" v-for="item in keyTags" :key="item.label_no">
				{{ item.label_name }}
			</view>
		</view>
		<view class="tag-list" v-if="!curTag">
			<view class="title">所有标签</view>
			<view class="tag-item" @click="insertTag(item)" :class="{ checked: curTags.find(tag => tag.label_no === item.label_no) }" v-for="item in tagList" :key="item.label_no">
				{{ item.label_name }}
			</view>
		</view>
		<view class="button-box"><button class="cu-btn bg-cyan" v-if="!curTag" @click="saveUserTag">保存</button></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			tagList: [],
			curTag: '',
			curTags: [],
			curTagsCopy: [],
			activeTagNo: '',
			manager_no: '',
			customer_no: ''
		};
	},
	computed: {
		keyTags() {
			let tags = this.deepClone(this.tagList);
			return tags.filter(item => item.label_name.indexOf(this.curTag) !== -1);
		},
		...mapState({
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize,
			doctorInfo: state => state.app.doctorInfo
		})
	},
	methods: {
		checkeTag(item) {
			// 在已选tags中选中tag
			this.activeTagNo = item.label_no;
		},
		cancelCheckTag(tag) {
			// 在已选tags中取消选中tag
			if (this.curTags.find(item => item.label_no === tag.label_no)) {
				this.curTags.splice(this.curTags.findIndex(item => item.label_no === tag.label_no), 1);
			}
		},
		insertTag(tag) {
			// 给该用户添加标签(临时)
			if (!this.curTags.find(item => item.label_no === tag.label_no)) {
				this.curTags.push(tag);
			} else {
				if (this.curTags.find(item => item.label_no === tag.label_no).label_no === this.activeTagNo) {
					this.activeTagNo = '';
				}
				this.curTags.splice(this.curTags.findIndex(item => item.label_no === tag.label_no), 1);
			}
		},
		saveUserTag() {
			// 给该用户添加标签
			if (!this.doctorInfo || !this.doctorInfo.row_no) {
				return;
			}
			let url = this.getServiceUrl('health', 'srvhealth_user_label_set_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_user_label_set_add',
					condition: []
					// data: [{ dp_no: this.doctorInfo.row_no, manager_no: this.manager_no, customer_no: this.customer_no, label_no: tag.label_no, label_name: tag.label_name }]
				}
			];
			let self = this;
			let tags = this.curTags;
			req[0].data = tags
				.filter(item => {
					return !self.curTagsCopy.find(tag => tag.label_no === item.label_no);
				})
				.map(tag => {
					return { dp_no: this.doctorInfo.row_no, manager_no: this.manager_no, customer_no: this.customer_no, label_no: tag.label_no, label_name: tag.label_name };
				});
			if (!Array.isArray(req[0].data) || req[0].data.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '用户标签未发生改变'
				});
				return;
			}
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					uni.$emit('tagsUpdate', this.curTags);
					uni.showModal({
						title: '提示',
						content: '保存成功，即将返回上一级页面',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateBack({});
							}
						}
					});
				}
			});
		},
		createTag(e) {
			// 新建标签
			if (e.detail.value) {
				let url = this.getServiceUrl('health', 'srvhealth_user_label_mgmt_add', 'operate');
				let req = [{ serviceName: 'srvhealth_user_label_mgmt_add', condition: [], data: [{ label_name: e.detail.value }] }];
				if (this.tagList.find(item => item.label_name === e.detail.value)) {
					// 如果已有此标签
					this.curTags.push(this.tagList.find(item => item.label_name === e.detail.value));
				} else {
					// 没有 新建
					this.$http.post(url, req).then(res => {
						if (res.data.state === 'SUCCESS') {
							if (
								Array.isArray(res.data.response) &&
								res.data.response.length > 0 &&
								res.data.response[0].response &&
								Array.isArray(res.data.response[0].response.effect_data) &&
								res.data.response[0].response.effect_data.length > 0
							) {
								let resultData = res.data.response[0].response.effect_data;
								console.log(resultData);
								if (Array.isArray(resultData)) {
									this.curTags = [...this.curTags, ...resultData];
									// this.curTagsCopy = this.deepClone(this.curTags);
								}
							}
							this.selectTagList();
						}
					});
				}
				this.curTag = '';
			}
		},
		selectCurrentTags() {
			let url = this.getServiceUrl('health', 'srvhealth_user_label_set_select', 'select');
			let req = {
				serviceName: 'srvhealth_user_label_set_select',
				colNames: ['*'],
				condition: [{ colName: 'dp_no', ruleType: 'eq', value: this.doctorInfo.row_no }]
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.curTags = res.data.data;
					this.curTagsCopy = this.deepClone(this.curTags);
				}
			});
		},
		selectTagList() {
			let url = this.getServiceUrl('health', 'srvhealth_user_label_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_user_label_mgmt_select',
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 20 }
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.tagList = res.data.data;
				}
			});
		}
	},
	onLoad(option) {
		if (option.manager_no && option.customer_no) {
			this.manager_no = option.manager_no;
			this.customer_no = option.customer_no;
		}
		this.selectCurrentTags();
		this.selectTagList();
	}
};
</script>

<style lang="scss">
.manager-tag {
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	display: flex;
	flex-direction: column;
}
.tag-item {
	display: inline-block;
	background-color: #fff;
	border: 1rpx solid #f1f1f1;
	min-width: 100rpx;
	margin: 10rpx 10rpx 0 0;
	border-radius: 50rpx;
	padding: 10rpx 30rpx;
	height: auto;
	transition: all 0.4s;
	&.checked {
		border-color: #0bc99d;
		color: #0bc99d;
	}

	&:active {
		transform: scale(1.1);
	}
}
.selectedTag {
	padding: 20rpx;
	display: flex;
	flex-wrap: wrap;
	.input {
		width: 200rpx;
		border: 1px dashed #ccc;
		// pointer-events: ;
	}
	.tag-item {
		&.active {
			border-color: #0bc99d;
			color: #0bc99d;
			background-color: rgba(11, 201, 157, 0.1);
			&:active {
				transform: scale(1);
			}
		}
	}
}
.tag-list {
	border-top: 1rpx solid #ccc;
	margin: 0 20rpx;
	padding: 20rpx 0;
	flex: 1;
	.title {
		color: #666;
	}
}
.button-box {
	padding: 20rpx;
	.cu-btn {
		width: 45%;
		margin: 20rpx auto;
	}
}
</style>
