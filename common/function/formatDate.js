import zp from '@/common/function/zp.js'
/**
 * 格式化日期时间
 * @param {Date} date 
 * @param {String} rule 返回时间的格式
 * @param {String} separator 年月日之间的间隔符
 */
function formateDate(date, rule, separator) {
	let result = ''
	let sep = separator || '-'
	let o = {
		'YY': date.getFullYear(),
		'MM': zp(date.getMonth() + 1),
		'DD': zp(date.getDate()),
		'HH': zp(date.getHours()),
		'mm': zp(date.getMinutes()),
		'ss': zp(date.getSeconds())
	};
	switch (rule) {
		case 'YYYY-MM-DD':
			result = `${o.YY}${sep}${o.MM}${sep}${o.DD}`
			break;
		case '年月日':
			result = `${o.YY}年${o.MM}月${o.DD}日`
			break;
		case 'YYYY-MM-DD HH:mm:ss':
			result = `${o.YY}${sep}${o.MM}${sep}${o.DD} ${o.HH}:${o.mm}:${o.ss}`
			break;
		default:
			result = `${o.YY}${sep}${o.MM}${sep}${o.DD}`
			break;
	}
	return result
}

export default formateDate
