<template>
	<form>
		<a-form-item v-for="field in fields" :key="field.id" :field="field" :pageType="pageType"></a-form-item>
		<!-- <slot></slot> -->
	</form>
</template>

<script>
export default {
	name: 'aForm',
	props: {
		fields: {
			type: Array,
			required: true
		},
		formType: {
			type: String,
			default: 'add' //add||update
		},
		pageType: {
			type: String,
			default: 'form' //form||detail
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss"></style>
