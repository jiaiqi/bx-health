<template>
	<view>
	<!-- 	<bx-radio-group v-model="radioValue">
			<bx-radio v-for="item in options" :key="item.id" :name="item.value" :serial-char="item.option_view_no">{{ item.label }}</bx-radio>
		</bx-radio-group> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			radioValue:'',
			options: [
				{
					id: 1646,
					option_no: '20201117095322001311',
					option_seq: 1,
					option_value: '没有或很少时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'A',
					value: '没有或很少时间',
					showimg: false,
					label: '没有或很少时间'
				},
				{
					id: 1647,
					option_no: '20201117095322001312',
					option_seq: 2,
					option_value: '小部分时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'B',
					value: '小部分时间',
					showimg: false,
					label: '小部分时间'
				},
				{
					id: 1648,
					option_no: '20201117095322001313',
					option_seq: 3,
					option_value: '相当多时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'C',
					value: '相当多时间',
					showimg: false,
					label: '相当多时间'
				},
				{
					id: 1649,
					option_no: '20201117095322001314',
					option_seq: 4,
					option_value: '绝大部分或全部时间',
					answer: '否',
					option_img_explain: null,
					option_video_explain: null,
					option_view_no: 'D',
					value: '绝大部分或全部时间',
					showimg: false,
					label: '绝大部分或全部时间'
				}
			]
		};
	},
	methods: {}
};
</script>

<style></style>
