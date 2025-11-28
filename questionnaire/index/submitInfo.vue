<template>
  <view class="submit-info-container">
    <view class="header">
      <view class="title">峥嵘岁月 光辉历程</view>
      <view class="subtitle">红色延安的故事</view>
    </view>

    <view class="content">
      <view class="activity-title">
        云长征"互动答题"追寻长征足迹 共绘青春华章"第二届时代青年"重走长征路"徒步活动
      </view>

      <view class="form">
        <view class="form-item">
          <view class="label">
            所属单位
            <span class="required">*</span>
          </view>
          <input
            class="input"
            type="text"
            placeholder="请输入"
            v-model="formData.company"
          />
        </view>

        <view class="form-item">
          <view class="label">
            姓名
            <span class="required">*</span>
          </view>
          <input
            class="input"
            type="text"
            placeholder="请输入"
            v-model="formData.user_name"
          />
        </view>

        <view class="form-item">
          <view class="label">
            联系电话
            <span class="required">*</span>
          </view>
          <input
            class="input"
            type="number"
            placeholder="请输入"
            v-model="formData.user_phone"
          />
        </view>
      </view>

      <view
        class="button-container"
        v-if="activity_no"
      >
        <button
          class="next-button"
          @click="handleNext"
        >下一步</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activity_no: '',
      options: {},
      formData: {
        company: '',
        user_name: '',
        user_phone: '',
        nickname: ''
      }
    };
  },
  methods: {
    handleNext() {
      // 验证表单
      if (!this.formData.company) {
        uni.showToast({
          title: '请输入所属单位',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.user_name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      this.formData.nickname = this.formData.user_name
      if (!this.formData.user_phone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
        return;
      }
      // 验证电话号码格式
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.formData.user_phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return;
      }
      // 保存表单数据，跳转到下一步
      let url = `/questionnaire/index/index?submitInfo=${encodeURIComponent(JSON.stringify(this.formData))}`
      Object.keys(this.options).forEach(key => {
        url += `&${key}=${this.options[key]}`
      })
      uni.setStorageSync('submitInfo', this.formData);
      uni.navigateTo({
        url: url
      });
    }
  },
  onLoad(options) {
    this.activity_no = options.activity_no;
    this.options = options;
  }
}
</script>

<style
  lang="scss"
  scoped
>
.submit-info-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 40rpx 0;
  background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
  color: white;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
}

.content {
  background-color: white;
  border-radius: 10rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  flex: 1;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.required {
  color: #e63946;
  margin-left: 5rpx;
  font-size: 28rpx;
}

.input {
  height: 80rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 5rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.button-container {
  margin-top: 50rpx;
  margin-bottom: 50rpx;
  display: flex;
  justify-content: center;
}

.next-button {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(135deg, #e63946 0%, #EB1A1A 100%);
  color: white;
  border: none;
  border-radius: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>