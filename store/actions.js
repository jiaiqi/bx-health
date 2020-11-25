// 创建驱动actions可以使方法启动
export default {
	setSrvCol: ({
		commit
	}, payload) => {
		commit('setSrvCol', payload)
	}
}
