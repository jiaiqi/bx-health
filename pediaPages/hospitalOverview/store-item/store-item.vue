<template>
	<view class="store-item" v-if="storeInfo&&storeInfo.store_no">
		<slide-list v-if="pageItem.type==='轮播图'" ref="swiperList" :storeInfo="storeInfo" :userInfo="userInfo"
			:pageItem='pageItem'></slide-list>
		<store-info :storeInfo="storeInfo" :userInfo="userInfo" :bindUserInfo="bindUserInfo" @bindUser="bindStore"
			v-if="pageItem.type==='店铺信息'" :isBind="isBind" :pageItem='pageItem' @setHomePage="setHomePage"
			@addToStore="addToStore" @toConsult="toConsult"></store-info>
		<button-list :pageItem="pageItem" :userInfo="userInfo" :bindUserInfo="bindUserInfo" :storeInfo="storeInfo"
			@addToStore="addToStore" v-if="pageItem.type==='按钮组'" ref="buttonGroup"></button-list>
		<goods-list v-if="pageItem.type==='商品列表'&&goodsListData.length > 0" :storeNo="storeNo" image="goods_img"
			name="goods_name" desc="goods_desc" ref="goodsList"></goods-list>
		<vaccine-list v-if="pageItem.type==='疫苗列表'" ref='vaccineList'></vaccine-list>
		<staff-manage :storeNo="storeNo" :pageItem="pageItem" v-if="pageItem.type==='人员列表'"
			@toDoctorDetail="toDoctorDetail" ref="staffList">
		</staff-manage>
		<news-list :website_no="storeInfo&&storeInfo.website_no" ref='articleList'
			:article-style="pageItem.article_style" :rownumber="pageItem.row_number" :cateNo="pageItem.category_no"
			:storeInfo="storeInfo" v-if="pageItem.type==='文章列表'">
		</news-list>
	</view>
</template>

<script>
	import slideList from '../slide-picture/slide-picture.vue'
	import storeInfo from '../store-info/store-info.vue'
	import buttonList from '../button-group/button-group.vue'
	import goodsList from '../goods-list/goods-list.vue';
	import vaccineList from '../vaccine-list/vaccine-list.vue'
	import newsList from '../news-list/news-list.vue'
	import staffManage from '../staff-manage/staff-manage.vue'
	export default {
		components: {
			slideList,
			storeInfo,
			buttonList,
			goodsList,
			vaccineList,
			staffManage,
			newsList
		},
		props: {
			pageItem: {
				type: Object
			},
			storeInfo: {
				type: Object
			},
			userInfo: {
				type: Object
			},
			bindUserInfo: {
				type: Object
			},
			mainMenuList: {
				type: Array
			},
			goodsListData: {
				type: Array
			}
		},
		computed: {
			storeNo() {
				return this.storeInfo && this.storeInfo.store_no ? this.storeInfo.store_no : ''
			},
			isBind() {
				return this.bindUserInfo && this.bindUserInfo.id ? true : false
			},
		},
		data() {
			return {}
		},
		created() {
			uni.$on('updateStoreItemData', () => {
				this.onRefresh()
			})
		},
		methods: {
			setHomePage(){
				this.$emit('setHomePage')
			},
			addToStore() {
				this.$emit('addToStore')
			},
			toConsult() {
				this.$emit('toConsult')
			},
			bindStore() {
				this.$emit('bindStore')
			},
			toDoctorDetail(e) {
				this.$emit('toDoctorDetail', e)
			},
			onRefresh() {
				if (this.pageItem) {
					switch (this.pageItem.type) {
						case '按钮组':
							if (this.$refs.buttonGroup && this.$refs.buttonGroup.getButtons) {
								this.$refs.buttonGroup.getButtons()
							}
							break;
						case '人员列表':
							if (this.$refs && this.$refs.staffList && this.$refs.staffList.getStoreUserList) {
								this.$refs.staffList.getStoreUserList()
							}
							break;
						case '文章列表':
							if (this.$refs && this.$refs.articleList && this.$refs.articleList.getTabs) {
								this.$refs.articleList.getTabs()
							}
							break;
						case '疫苗列表':
							if (this.$refs && this.$refs.vaccineList && this.$refs.vaccineList.getVaccineList) {
								this.$refs.vaccineList.getVaccineList()
							}
							break;
						case '轮播图':
							if (this.$refs && this.$refs.swiperList && this.$refs.swiperList.getSwiperList) {
								this.$refs.swiperList.getSwiperList()
							}
							// this.getSwiperList()
							break;
						case '商品列表':
							if (this.$refs && this.$refs.goodsList && this.$refs.goodsList.getGoodsListData) {
								this.$refs.goodsList.getGoodsListData()
							}
							break;
					}
				}
			},

		},
	}
</script>

<style>

</style>
