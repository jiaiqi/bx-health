<template>
  <view v-if="service" class="pretty-form">
    <bx-form ref="formRef" :form-app="app" :form-service="service" :form-type="type" ui="pretty"
      :resultColumn="resultColumn" @v2-loaded="onV2Loaded"></bx-form>
    <view class="button-box" v-if="resultColumn&&showResult===false">
      <button class="button bg-green" @click="seeResult">查看结果</button>
    </view>
  </view>
</template>

<script>
  export default {
    components: {
      bxForm: () => import('@/publicPages/newForm/newForm.vue')
    },
    data() {
      return {
        service: "",
        app: "",
        type: "add",
        resultColumn: "",
        formV2: null,
        showResult: false,
      }
    },
    computed: {
      submitButton() {
        return this.formV2?.formButton?.find(item => item.button_type === 'submit' && item.service_name)
      },
    },
    methods: {
      onV2Loaded(data) {
        this.formV2 = data
      },
      seeResult() {
        if (this.submitButton) {
          this.$refs?.formRef?.seeResult(this.submitButton)
          this.showResult = true
        }
      },
    },
    onLoad(option) {
      if (option.app) {
        this.app = option.app
      }
      if (option.type) {
        this.type = option.type
      }
      if (option.service) {
        this.service = option.service
      }
      if (option.resultColumn) {
        this.resultColumn = option.resultColumn
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button {
    color: #fff;
    background-color: #0bc99d;
    height: 40px;
    line-height: 40px;
    max-width: 300px;
    min-width: 100px;
    width: 40%;
  }

  .pretty-form {
    background-color: #fff;

    .button-box {
      padding: 40px 0;
    }

    /deep/ .form {
      --page-height: auto !important;
    }

    /deep/ .form-item {
      .form-item-content .form-item-content_value .textarea-content {
        height: unset !important;
        min-height: 200rpx;

      }
    }
  }
</style>