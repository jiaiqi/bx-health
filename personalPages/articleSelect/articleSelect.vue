<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form radius">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" @input="searchVal" v-model="key" type="text" placeholder="搜索文章" confirm-type="search"></input>
			</view>
			<view class="action">
				<button type="primary" class="cu-btn sm bg-blue " @click="changeMode"
					v-if="!checkedList">{{mode==='单选'?"多选":"单选"}}</button>
				<button type="primary" class="cu-btn sm bg-blue " @click="sendArticle" v-else>发送</button>
			</view>
		</view>
		<view class="article-list" v-if="mode ==='多选'">
			<bx-checkbox-group :width="'100%'" v-model="checkedList">
				<bx-checkbox class="article-item" v-model="item.checked" v-for="item in list" :key="item.content_no"
					:name="item.content_no">
					<text class="">{{ item.title }}</text>
				</bx-checkbox>
			</bx-checkbox-group>
			<!-- 			<checkbox-group @change="checkboxChange">
				<label class="article-item" v-for="item in list" :key="item.id">
					<checkbox :value="item.title" :checked="item.checked" />
					<text class="margin-left">{{item.title}} </text>
				</label>
			</checkbox-group> -->
		</view>
		<view class="article-list" v-else>
			<view class="article-item" v-for="item in list" :key="item.id" @click="sendArticle(item)">
				<view class="title">
					<text> {{item.title}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		data() {
			return {
				mode: "单选",
				queryOption: {},
				storeInfo: {},
				list: [],
				key:'',
				checkedList: "",
				loadStatus: 'more', //noMore loading
				page: {
					pageNo: 1,
					rownumber: 20
				},
				tabs: []
			}
		},
		methods: {
			searchVal(){
				let condition = []
				if(this.key){
					condition = [{
						colName:'title',
						ruleType:'like',
						value:this.key
					}]
				}
				this.page.pageNo = 1
				this.getArticle('refresh',condition)
			},
			sendArticle(e) {
				let val = e && e.content_no ? e.content_no : this.checkedList;
				if (val) {
					let url = '/personalPages/chat/chat?'
					for (let item in this.queryOption) {
						if (item) {
							url += `${item}=${this.queryOption[item]}&`
						}
					}
					let data = this.list.filter(item => val.indexOf(item.content_no) !== -1).map(item => {
						return {
							title: item.title,
							content_no: item.content_no
						}
					})
					url += `articleList=${JSON.stringify(data)}`
					uni.redirectTo({
						url
					})
					// uni.navigateBack().then(_ => {
					// 	uni.$emit('send-article', data)
					// })
				}
			},
			changeMode() {
				if (this.mode === '单选') {
					this.mode = '多选'
				} else {
					this.mode = '单选'
				}
			},
			getArticle(type = 'refresh',condition) {
				let req = {
					condition: [
						// 	{
						// 	colName: 'no',
						// 	ruleType: 'in',
						// 	value: this.tabs.toString()
						// },
						{
							colName: 'content_status',
							ruleType: 'eq',
							value: '发布'
						},
					],
					order: [{
							colName: 'seq',
							orderType: "asc"
						},
						{
							colName: "create_time",
							orderType: "desc"
						}
					],
					page: {
						pageNo: this.page.pageNo,
						rownumber: this.page.rownumber
					}
				};
				if(condition){
					req.condition = [...req.condition,...condition]
				}
				this.loadStatus = 'loading'
				this.$fetch('select', 'srvdaq_cms_content_select', req, 'daq').then(res => {
					if (res.success) {
						res.data = res.data.map(item => {
							item.checked = false
							return item
						})
						if (type === 'refresh') {
							this.list = res.data;
						} else {
							this.list = [...this.list, ...res.data];
						}
						if (res.page) {
							let page = res.page
							if (page.total <= page.rownumber * page.pageNo) {
								this.loadStatus = 'noMore'
							} else {
								this.page.pageNo++
								this.loadStatus = 'more'
							}
						}
					}
				});
			},
		},
		onReachBottom() {
			if (this.loadStatus === 'more') {
				this.getArticle('loadmore')
			}
		},
		onPullDownRefresh() {
			this.page.pageNo = 1
			this.getArticle('refresh')
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		},
		onLoad(option) {
			if (option.queryOption) {
				this.queryOption = option.queryOption
				try {
					this.queryOption = JSON.parse(option.queryOption)
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		created() {
			this.getArticle('refresh')
		}
	}
</script>

<style scoped lang="scss">
	.radius {
		border-radius: 10rpx;
		overflow: hidden;
	}

	.article-list {
		min-height: calc(100vh - var(--window-top) - var(--window-bottom) - 50px - 30px);

		.article-item {
			width: 100%;
			padding: 0 40rpx;
			font-weight: bold;
			border-bottom: 1px solid #f9f9f9;
			min-height: 100rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			::v-deep .bx-checkbox__label {
				flex: 1;
				margin-left: 20px;
			}
		}
	}
</style>
