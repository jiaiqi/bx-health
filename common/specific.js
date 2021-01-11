export default {
	install(Vue, options) {
		Vue.prototype.getLocation = async ()=>{
			let result = await uni.getLocation({
				type: 'wgs84',
				altitude:true
			})
			debugger
		}
		
		Vue.prototype.getFoodsDetail = async (dietRecord) => {
			// 根据饮食记录得到食物编号查找食物详细数据
			if (Array.isArray(dietRecord) && dietRecord.length > 0) {
				let mixDietList = dietRecord.filter(item => item.diret_type === 'mixed_food');
				let basicDietList = dietRecord.filter(item => item.diret_type === 'diet_contents');
				let condition1 = [{
					colName: 'meal_no',
					ruleType: 'in',
					value: mixDietList.map(item => item.mixed_food_no).toString()
				}];
				let condition2 = [{
					colName: 'food_no',
					ruleType: 'in',
					value: basicDietList.map(item => item.diet_contents_no).toString()
				}];
				let mix = await Vue.prototype.getFoodType(condition1, 'srvhealth_mixed_food_nutrition_contents_select');
				let basic = await Vue.prototype.getFoodType(condition2);
				let foodType = [...mix, ...basic];
				return foodType;
			}
		}
		Vue.prototype.getFoodType = async (cond, serv) => {
			// 食物类型
			let serviceName = 'srvhealth_diet_contents_select';
			if (serv) {
				serviceName = serv;
			}
			let url = Vue.prototype.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				order: []
			};
			if (cond) {
				req.condition = cond;
			}
			let res = await Vue.prototype.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0 && !serv) {
				console.log(res.data.data);
			}
			return res.data.data ? res.data.data : [];
		}
		
		Vue.prototype.updateUserProfile = async (profile_url, user_no) => {
			// 更新用户微信头像
			const url = Vue.prototype.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			const req = [{
				serviceName: 'srvhealth_person_info_update',
				condition: [{
					colName: 'no',
					ruleType: 'eq',
					value: user_no
				}],
				data: [{
					profile_url: profile_url
				}]
			}];
			let res = await Vue.prototype.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showToast({
					title: '头像更新成功！'
				});
				return true
			}
		}
		
		Vue.prototype.getUserImage = (item) => {
			// 查找用户头像
			if (item) {
				if (item.user_image) {
					return Vue.prototype.getImagePath(item.user_image);
				} else if (item.profile_url) {
					return Vue.prototype.getImagePath(item.profile_url);
				}
			}
		}
	}
}
