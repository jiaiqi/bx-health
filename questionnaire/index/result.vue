<template>
  <view class="result-container">
    <view class="header">
      <!-- <view class="title">峥嵘岁月 光辉历程</view>
      <view class="subtitle">红色延安的故事</view> -->
      <view
        v-if="customTitleImage"
        class="title-image"
      >
        <image
          :src="customTitleImage"
          mode="scaleToFill"
        />
        <view
          class="title"
          v-if="formData"
        >
          {{ formData.title }}
        </view>
      </view>
    </view>

    <view class="content">
      <view class="activity-title">
        {{ questionInfo.title || '' }}
        <!-- 云长征"互动答题"追寻长征足迹 共绘青春华章"第二届新时代青年"重走长征路"徒步活动 -->
      </view>

      <view class="score-section">
        <view class="score">{{ correctScore }}</view>
        <view class="total-score">总分{{ totalScore }}</view>
      </view>

      <view class="answer-summary">
        <view class="summary-item">
          <view class="summary-label">答对</view>
          <view class="summary-value">{{ correctList.length }}题</view>
          <view class="summary-total">共{{ resultList.length }}题</view>
        </view>
      </view>

      <view class="answer-detail">
        <view
          class="question-item"
          v-for="item in questionList"
        >
          <view class="question-header">
            <view class="question-number">{{ item.item_seq }}.</view>
            <view class="question-title">{{ item.item_title }}</view>
          </view>

          <view class="options">
            <view
              class="option "
              v-for="op in item.option_data"
              :class="{
                correct: op.answer === '是' && op.option_value === resultListMap[item.item_no].svalue,
                wrong: op.answer !== '是' && op.option_value === resultListMap[item.item_no].svalue,
              }"
            >
              <view class="option-marker">
                <view
                  class="checkbox"
                  :class="{
                    'checked':
                      resultListMap[item.item_no].svalue === op.option_value,
                    'wrong': op.answer !== '是'
                  }"
                ></view>
              </view>
              <view class="option-text">{{ op.option_view_no || '' }}. {{ op.option_value }}</view>
            </view>
          </view>

          <view class="answer-result wrong">
            <view
              class="result-icon"
              :class="{
                'correct-icon': isRight(item),
                'wrong-icon': !isRight(item),
              }"
            >
              {{ isRight(item) ? '✓' : '✘' }}
            </view>
            <view class="result-text">回答{{ isRight(item) ? '正确' : '错误' }}
            </view>
            <view class="score-change">+{{ isRight(item) ? item.points + '分' : '0分' }}</view>
          </view>

          <view class="correct-answer">
            <view class="correct-label">正确答案：</view>
            <view class="correct-value">
              {{ getRightOption(item).option_view_no || '' }}
              :
              {{ getRightOption(item).option_value || '' }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      fill_batch_no: '', //回答记录编号
      activity_no: '',// 问卷编号
      questionInfo: {},// 问卷信息
      resultList: [],
      score: 20,
    };
  },
  computed: {
    customTitleImage() {
      if (this.questionInfo.activity_image) {
        return this.getImagePath(this.questionInfo.activity_image, true)
      }
    },
    totalScore() { // 总分
      return this.questionList.reduce((acc, q) => acc + q.points, 0)
    },
    correctScore() { // 答对得分
      return this.correctList.reduce((acc, q) => acc + q.score, 0)
    },
    correctList() { // 回答正确列表
      return this.resultList.filter(q => q.result === '正确')
    },
    questionList() {
      return this.questionInfo?.item_data || []
    },
    resultListMap() {
      return this.resultList.reduce((acc, cur) => {
        acc[cur.item_no] = cur
        return acc
      }, {})
    },
  },
  onLoad(options) {
    this.activity_no = options.activity_no || ''
    this.fill_batch_no = options.fill_batch_no || ''
    if (this.activity_no) {
      this.getSurveyInfo()
    }
    if (this.fill_batch_no) {
      this.loadResult()
    }
  },
  methods: {
    getRightOption(item) {
      return item.option_data.find(op => op.answer === '是') || {}
    },
    isRight(item) {
      const rightValue = item.option_data.find(op => op.answer === '是')?.option_value
      const checkedValue = this.resultListMap[item.item_no].svalue
      return rightValue && checkedValue === rightValue
    },
    async getSurveyInfo() {
      const url = this.getServiceUrl('daq', 'srvdaq_init_view_select', 'select');
      const req = {
        "serviceName": "srvdaq_init_view_select", "colNames": ["*"],
        "order": [{ "colName": "item_seq", "orderType": "asc" }],
        "condition": [{ "colName": "activity_no", "ruleType": "eq", "value": this.activity_no },
        { "colName": "type", "ruleType": "eq", "value": "use" }]
      }
      const res = await this.$http.post(url, req)
      if (res.data?.state === 'SUCCESS') {
        if (res.data?.data?.length) {
          this.questionInfo = res.data.data[0]
        } else {
          uni.showToast({
            title: '问卷信息不存在',
            icon: 'none'
          })
        }
      } else if (res.data?.resultMessage) {
        uni.showToast({
          title: res.data?.resultMessage,
          icon: 'none'
        })
      }
    },
    async loadResult() {
      const req = {
        "serviceName": "srvdaq_record_reply_merge_select",
        "colNames": ["*"],
        "condition": [
          {
            "colName": "fill_batch_no",
            "ruleType": "eq",
            "value": this.fill_batch_no
          }
        ],
        "page": { "pageNo": 1, "rownumber": 100 },
      }
      const url = this.getServiceUrl('daq', 'srvdaq_record_reply_merge_select', 'select');
      const res = await this.$http.post(url, req)
      if (res.data?.state === 'SUCCESS') {
        this.resultList = res.data.data
      } else if (res.data?.resultMessage) {
        uni.showToast({
          title: res.data?.resultMessage,
          icon: 'none'
        })
      }
    },
  }
};
</script>

<style
  lang="scss"
  scoped
>
.result-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}


.header {
  text-align: center;
  /* background: linear-gradient(135deg, #e63946 0%, #c1121f 100%); */
  color: white;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 30rpx;

  .title-image {
    width: 100%;
    min-height: 200rpx;
    display: flex;

    image {
      width: 100%;
    }

    .title {
      padding: 20rpx 40rpx;
    }
  }
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
}

.activity-title {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.5;
  color: #e63946;
  font-size: 34rpx;

}

.score-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.score {
  font-size: 80rpx;
  font-weight: bold;
  /* color: #e63946; */
  color: #FF8D07;
}

.total-score {
  font-size: 28rpx;
  color: #C95555;
  margin-top: 10rpx;
  background-color: #FEF3BE;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
}

.answer-summary {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.summary-item {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.summary-label {
  font-size: 28rpx;
  color: #666;
}

.summary-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.summary-total {
  font-size: 28rpx;
  color: #888;
}

.answer-detail {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.question-item {
  border-bottom: 1rpx solid #e0e0e0;
  padding-bottom: 30rpx;
}

.question-item:last-child {
  border-bottom: none;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.question-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
}

.question-title {
  font-size: 28rpx;
  color: #333;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.option {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 15rpx;
  background-color: #f9f9f9;
  border-radius: 5rpx;
}

.option.correct {
  background-color: #f0f9eb;
  border: 1rpx solid #c2e7b0;
}

.option.wrong {
  background-color: #fff2f0;
  border: 1rpx solid #ff4d4f;
}

.option-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #d9d9d9;
  /* border-radius: 50%; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background-color: #52c41a;
  border-color: #52c41a;
}

.checkbox.checked.wrong {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.checkbox.checked::after {
  content: '✓';
  color: white;
  font-size: 20rpx;
  font-weight: bold;
}

.option-text {
  font-size: 26rpx;
  color: #333;
}

.answer-result {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
  padding: 10rpx 0;
}

.result-icon {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: bold;
}

.correct-icon {
  background-color: #f0f9eb;
  color: #52c41a;
}

.wrong-icon {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.result-text {
  font-size: 26rpx;
  font-weight: bold;
}

.result-text.correct {
  color: #52c41a;
}

.result-text.wrong {
  color: #ff4d4f;
}

.score-change {
  font-size: 26rpx;
  color: #fa8c16;
  margin-left: auto;
}

.correct-answer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10rpx;
  padding: 15rpx 30rpx;
  /* background-color: #f0f5ff; */
  background-color: #F6F6F6;
  border-radius: 8rpx;
  margin-top: 10rpx;
}

.correct-label {
  font-size: 26rpx;
  color: #52c41a;
  font-weight: bold;
}

.correct-value {
  font-size: 26rpx;
  /* color: #1890ff; */
}
</style>