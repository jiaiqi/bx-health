let data = [{
		title: '有机大分子',
		units: 'g/d',
		matterList: [{
				label: '蛋白',
				name: '蛋白',
				shortName: '蛋白',
				key: 'protein',
				EAR: 0.9, // 平均需要量
				UL: 0, // 可耐受最高摄入量
				value: 0 // 当前值
			},
			{
				label: '脂肪',
				name: '脂肪',
				shortName: '脂肪',
				key: 'axunge',
				EAR: 0, // 平均需要量
				UL: 0, // 可耐受最高摄入量
				value: 0 // 当前值
			},
			{
				label: '碳水',
				name: '碳水',
				shortName: '碳水',
				key: 'carbohydrate',
				EAR: 0, // 平均需要量
				UL: 0, // 可耐受最高摄入量
				value: 0 // 当前值
			}
		]
	},
	{
		title: '脂溶性维生素',
		units: 'ug/d',
		matterList: [{
				label: '维生素A',
				name: 'VA',
				shortName: 'A',
				key: 'vitamin_a',
				EAR: 560, // 平均需要量
				UL: 3000, // 可耐受最高摄入量
				value: 0 // 当前值
			},
			// {
			// 	name: 'D',
			// 	key: 'vitamin_d',
			// 	EAR: 8,
			// 	UL: 50,
			// 	value: 0
			// },
			{
				label: '维生素E',
				name: 'VE',
				shortName: 'E',
				EAR: 14,
				key: 'vitamin_e',
				UL: 700,
				value: 0
			}
			// {
			// 	name: 'K',
			// 	EAR: 50,
			// 	key: 'vitamin_k',
			// 	UL: 80,
			// 	value: 0
			// }
		]
	},
	{
		title: '水溶性维生素',
		units: 'mg/d',
		matterList: [{
				label: '维生素B1',
				name: 'VB1', //名字
				shortName: 'B1',
				key: 'vitamin_b1',
				EAR: 1.3, // 平均需要量
				UL: 0, // 可耐受最高摄入量
				value: 0 // 当前值
			},
			{
				label: '维生素B2',
				name: 'B2',
				shortName: 'B2',
				key: 'vitamin_b2',
				EAR: 1.3,
				UL: 0,
				value: 0
			},
			{
				label: '烟酸(vb3)',
				shortName: 'B3',
				name: '烟酸',
				EAR: 12,
				key: 'vitamin_b3',
				UL: 0,
				value: 0
			},
			{
				label: '叶酸',
				shortName: 'B9',
				name: '叶酸',
				EAR: 0.32,
				key: 'folic_acid',
				UL: 0,
				value: 0
			},
			{
				label: '维生素C',
				shortName: 'C',
				name: 'VC',
				EAR: 85,
				key: 'vitamin_c',
				UL: 0,
				value: 0
			}
		]
	},
	{
		title: '常量矿物质',
		units: 'mg/d',
		matterList: [{
				label: '钙',
				name: '钙', //名字
				shortName: '钙',
				EAR: 650, // 低值
				UL: 2000, // 最大值
				key: 'element_ca',
				value: 0 // 当前值
			},
			{
				label: '磷',
				name: '磷', //名字
				shortName: '磷',
				EAR: 600, // 低值
				UL: 3500, // 最大值
				key: 'element_p',
				value: 0 // 当前值
			},
			{
				label: '镁',
				name: '镁',
				shortName: '镁',
				EAR: 280,
				UL: 1000,
				key: 'element_mg',
				value: 0
			},
			{
				label: '钾',
				shortName: '钾',
				name: '钾',
				EAR: 2000,
				UL: 3600,
				key: 'element_k',
				value: 0
			}
		]
	},
	{
		title: '微量矿物质',
		units: 'mg/d',
		matterList: [{
				name: '铁', //名字
				label: '铁', //名字
				shortName: '铁',
				EAR: 12, // 低值
				UL: 50, // 最大值
				key: 'element_fe',
				value: 0 // 当前值
			},
			{
				name: '锌',
				label: '锌', //名字
				shortName: '锌',
				EAR: 12.5,
				UL: 45,
				key: 'element_zn',
				value: 0
			},
			{
				label: '硒', //名字
				name: '硒',
				shortName: '硒',
				EAR: 50,
				UL: 80,
				key: 'element_se',
				value: 0
			},
			{
				name: '铜',
				label: '铜', //名字
				shortName: '铜',
				EAR: 0.6,
				UL: 8,
				key: 'element_cu',
				value: 0
			},
			{
				label: '锰', //名字
				shortName: '锰',
				name: '锰',
				EAR: 4.5,
				UL: 11,
				key: 'element_mn',
				value: 0
			}
		]
	}
]

export default data
