import {
	getItem,
	setItem
} from '../utils.js'

const state = {
	orderInfo:getItem('orderInfo')?getItem('orderInfo'): {}, //订单信息
	cartInfo:getItem('cartInfo')?getItem('cartInfo'):  {}, // 购物车数据
	address:getItem('address')?getItem('address'):  {} // 下单地址
}

const mutations = {
	SET_ORDER_INO: (state, orderInfo) => {
		state.orderInfo = orderInfo
		setItem('orderInfo', orderInfo)
	},
	SET_STORE_CART: (state, cart = {
		store_no: '',
		storeInfo:{},
		list: []
	}) => {
		if (cart.storeInfo && cart.storeInfo.store_no) {
			state.cartInfo[cart.storeInfo.store_no] = {
				storeInfo: cart.storeInfo,
				cart: cart.list
			}
		} else if (cart.store_no) {
			if(!state.cartInfo[cart.store_no].cart){
				state.cartInfo[cart.store_no].cart = []
			}
			if(cart.isAdd){
				let cartList = state.cartInfo[cart.store_no].cart.map(item=>{
					cart.list.forEach((c,index)=>{
						if(c.id===item.id){
							item.car_num += c.car_num
							cart.list.splice(index,1)
						}
					})
					return item
				})
				state.cartInfo[cart.store_no].cart = [...cartList,...cart.list]
			}else{
				state.cartInfo[cart.store_no].cart = cart.list
			}
		}
		setItem('cartInfo', state.cartInfo)
	},
	SET_ADDRESS: (state, address) => {
		state.address = address
		setItem('address', address)
	}
}

export default {
	// namespaced: true,
	state,
	mutations
}
