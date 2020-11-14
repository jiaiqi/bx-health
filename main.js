import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import api from '@/common/api.js' // 导入api清单
import common from '@/common/common.js' // 公共方法
import bxUtil from '@/common/util.js' // 公共方法
import fly from '@/common/http.js' // fly 请求拦截
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$dev = true // 是否本地开发
Vue.use(common) // 老版公共方法,最终要抛弃
Vue.use(bxUtil) // 新版公共方法
Vue.prototype.$http = fly
Vue.prototype.$api = api

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

app.$mount()
