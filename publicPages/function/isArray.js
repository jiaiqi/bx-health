// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}
export default isArray