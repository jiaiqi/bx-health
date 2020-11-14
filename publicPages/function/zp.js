// 对大于零小于10的数字补零
function zp(val) {
	// zero padding 补零
	if (val > 0 && val < 10) {
		return `0${val}`
	} else {
		return val
	}
}

export default zp