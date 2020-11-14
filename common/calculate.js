/**
 * @param {Object} formData -表单数据
 * @param {Object} rule	-计算规则
 */
function calculateTo(formData,rule){
	let result = ''
	try{
		let data = JSON.parse(JSON.stringify(formData))
		let calculate = function(rule,result){
				Object.keys(rule).forEach((operator,index)=>{
					switch (operator){
						case 'add':
							
							break;
						default:
							break;
					}
				})
		}
		return calculate(rule,result)
	}catch(e){
		//TODO handle the exception
		console.warn(e)
		console.warn('请检查传入的参数格式是否正确',...arguments)
	}

}

export default calculateTo