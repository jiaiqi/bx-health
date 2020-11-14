/**
 * 去空格
 * @param {String} str -需要去空格的字符串
 * @param {String} position both-开头和末尾 left-开头 right-末尾 all-去除字符串中的所有空格
 */
function trim(str, position = 'both') {
	if (position == 'both') {
		return str.replace(/^\s+|\s+$/g, "");
	} else if (position == "left") {
		return str.replace(/^\s*/, '');
	} else if (position == 'right') {
		return str.replace(/(\s*$)/g, "");
	} else if (position == 'all') {
		return str.replace(/\s+/g, "");
	} else {
		return str;
	}
}

export default trim
