// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token'];

// 保存变量到本地存储中
const savePersistData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('persistData');
		// 第一次打开APP，不存在persistData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的persistData对象中
		uni.setStorageSync('persistData', tmp);
	}
}

const setItem = (key, value) => {
	let persistData = uni.getStorageSync('persistData') ? uni.getStorageSync('persistData') : {};
	persistData[key] = value
	uni.setStorageSync('persistData', persistData)
}

const getItem = (key) => {
	let persistData = uni.getStorageSync('persistData') ? uni.getStorageSync('persistData') : {};
	if (persistData[key]) {
		return persistData[key]
	} else {
		return undefined
	}
}

export {
	savePersistData,
	setItem,
	getItem
}
