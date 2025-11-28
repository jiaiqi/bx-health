<template>
  <view class="result-container">
    <!-- 顶部横幅区域 -->
    <view class="header">
      <view
        v-if="customTitleImage"
        class="title-image"
      >
        <image
          :src="customTitleImage"
          mode="scaleToFill"
        />
        <!-- <view
          class="title"
          v-if="questionInfo"
        >{{ questionInfo.title }}</view> -->
      </view>
      <view
        v-else
        class="default-header"
      >
        <view class="title">您的答题结果已生成</view>
        <view class="subtitle">感谢参与本次问卷调查</view>
      </view>
    </view>

    <view class="content">
      <!-- 活动标题 -->
      <view class="activity-title">
        {{ questionInfo.title || '' }}
      </view>

      <!-- 得分/完成状态区域 -->
      <view class="score-section">
        <view class="completion-message">
          恭喜您完成了本次问卷！
        </view>
        <view class="score">{{ correctScore }}</view>
        <view class="total-score">总分{{ totalScore }}</view>
      </view>

      <!-- 答题概况 -->
      <view class="answer-summary">
        <view class="summary-item">
          <view class="summary-label">答对</view>
          <view class="summary-value">{{ correctList.length }}题</view>
          <view class="summary-total">共{{ resultList.length }}题</view>
        </view>
      </view>

      <!-- 答题详情展示区 -->
      <view class="answer-detail">
        <view
          class="question-item"
          v-for="(item, index) in questionList"
          :key="item.item_no"
        >
          <view class="question-header">
            <view class="question-number">Q{{ item.item_seq }}:</view>
            <view class="question-title">{{ item.item_title }}</view>
          </view>

          <view class="options">
            <view
              class="option"
              v-for="op in item.option_data"
              :key="op.option_value"
              :class="{
                'correct': op.answer === '是',
                'selected': op.option_value === resultListMap[item.item_no].svalue,
                'wrong-selected': op.answer !== '是' && op.option_value === resultListMap[item.item_no].svalue
              }"
            >
              <view class="option-marker">
                <view
                  class="checkbox"
                  :class="{
                    'un-checked': op.option_value !== resultListMap[item.item_no].svalue,
                    'checked': op.option_value === resultListMap[item.item_no].svalue,
                    'correct': op.answer === '是',
                    'wrong': op.answer !== '是' && op.option_value === resultListMap[item.item_no].svalue
                  }"
                >
                  <template v-if="op.option_value === resultListMap[item.item_no].svalue">
                    <!-- {{ isRight(item) ? '' : '❌' }} -->
                    <text
                      class="cuIcon-check"
                      v-if="isRight(item)"
                    ></text>
                    <text
                      class="cuIcon-close"
                      v-else
                    ></text>
                  </template>
                </view>
              </view>
              <view class="option-text">
                {{ op.option_view_no || '' }}. {{ op.option_value }}
              </view>
            </view>
          </view>

          <view
            class="answer-result"
            :class="isRight(item) ? 'correct' : 'wrong'"
          >
            <view class="result-icon">
              <text
                class="cuIcon-check"
                v-if="isRight(item)"
              ></text>
              <text
                class="cuIcon-close"
                v-else
              ></text>
              <!-- {{ isRight(item) ? '✅' : '❌' }} -->
            </view>
            <view class="result-text">
              回答{{ isRight(item) ? '正确' : '错误' }}
            </view>
            <view class="score-change">
              +{{ isRight(item) ? item.points + '分' : '0分' }}
            </view>
          </view>

          <view class="correct-answer">
            <view class="correct-label">正确答案：</view>
            <view class="correct-value">
              {{ getRightOption(item).option_view_no || '' }}. {{ getRightOption(item).option_value || '' }}
            </view>
            <view
              class="explanation"
              v-if="item.explanation"
            >
              {{ item.explanation }}
            </view>
          </view>

          <!-- 视觉分隔线 -->
          <view
            class="divider"
            v-if="index < questionList.length - 1"
          ></view>
        </view>
      </view>

      <!-- 底部操作区 -->
      <!-- <view class="bottom-actions">
        <button class="action-button primary" @click="goHome">返回首页</button>
        <button class="action-button secondary" @click="restart">重新测试</button>
        <button class="action-button secondary" @click="share">分享结果</button>
      </view> -->
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
    // 返回首页
    goHome() {
      uni.switchTab({
        url: '/pages/home/home'
      })
    },
    // 重新测试
    restart() {
      uni.navigateTo({
        url: `/questionnaire/index/index?activity_no=${this.activity_no}`
      })
    },
    // 分享结果
    share() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  }
};
</script>

<style
  lang="scss"
  scoped
>
/* 整体容器 */
.result-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部横幅区域 */
.header {
  text-align: center;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  /* padding: 40rpx 20rpx; */
  margin-bottom: 0;
  overflow: hidden;

  .default-header {
    padding: 20rpx 0;
  }

  .title-image {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 100%;
      max-height: 300rpx;
      object-fit: cover;
    }

    .title {
      padding: 20rpx 40rpx;
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
    color: white;
  }

  .subtitle {
    font-size: 28rpx;
    opacity: 0.9;
  }
}

/* 内容区域 */
.content {
  background-color: white;
  border-radius: 0;
  padding: 30rpx 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 200rpx);
}

/* 活动标题 */
.activity-title {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
  line-height: 1.5;
  color: #333;
  font-weight: 600;
  padding: 0 20rpx;
}

/* 得分/完成状态区域 */
.score-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 30rpx 0;
  background-color: #f1f5f9;
  border: 1rpx solid #e2e8f0;
  border-radius: 15rpx;
  color: #334155;
  margin: 0 20rpx 30rpx;

  .completion-message {
    font-size: 28rpx;
    margin-bottom: 15rpx;
    color: #64748b;
  }

  .score {
    font-size: 96rpx;
    font-weight: bold;
    color: #334155;
    color: #FF9110;
    text-shadow: none;
  }

  .total-score {
    font-size: 28rpx;
    color: #64748b;
    margin-top: 10rpx;
    /* background-color: rgba(148, 163, 184, 0.2); */
    padding: 8rpx 20rpx;
    border-radius: 25rpx;
    backdrop-filter: none;
    background-color: #FEF3BE;
  }
}

/* 答题概况 */
.answer-summary {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}

.summary-item {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  background-color: #f0f9ff;
  padding: 20rpx 30rpx;
  border-radius: 10rpx;
  border: 1rpx solid #bae6fd;
}

.summary-label {
  font-size: 28rpx;
  color: #0284c7;
  font-weight: 600;
}

.summary-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #0369a1;
}

.summary-total {
  font-size: 28rpx;
  color: #64748b;
}

/* 答题详情展示区 */
.answer-detail {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 20rpx;
}

/* 问题项 */
.question-item {
  border-bottom: 1rpx solid #e2e8f0;
  padding: 30rpx 0;
  background-color: white;
  position: relative;
}

.question-item:last-child {
  border-bottom: none;
}

/* 问题头部 */
.question-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
  gap: 10rpx;
}

.question-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #334155;
  min-width: 50rpx;
  flex-shrink: 0;
}

.question-title {
  font-size: 28rpx;
  color: #334155;
  font-weight: 600;
  flex: 1;
  line-height: 1.5;
}

/* 选项容器 */
.options {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

/* 选项样式 */
.option {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 20rpx;
  background-color: #f8fafc;
  border: 2rpx solid #e2e8f0;
  border-radius: 10rpx;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }

  &.correct {
    background-color: #f0fdf4;
    border-color: #22c55e;
    color: #22c55e;
  }

  /* &.selected {
    border-color: #3b82f6;
    background-color: #eff6ff;
  } */

  &.wrong-selected {
    background-color: #fef2f2;
    border-color: #ef4444;
    color: #ef4444;
  }
}

/* 选项标记 */
.option-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 复选框样式 */
.checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: white; */
  background-color: #F6F6F6;
  transition: all 0.2s ease;

  border: 2rpx solid #cbd5e1;
  color: #fff;

  &.checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  &.checked.correct {
    background-color: #22c55e;
    border-color: #22c55e;
  }

  &.checked.wrong {
    background-color: #ef4444;
    border-color: #ef4444;
  }

  text {
    font-size: 24rpx;
    font-weight: bold;
  }
}

/* 选项文本 */
.option-text {
  font-size: 26rpx;
  color: #475569;
  flex: 1;
  line-height: 1.5;
}

/* 答题结果 */
.answer-result {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 20rpx;
  padding: 15rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  background-color: #f0f9ff;
  padding: 20rpx 20rpx;
  border-radius: 10rpx;

  &.correct {
    /* color: #16a34a; */
    .result-icon{
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }
  }

  &.wrong {
    /* color: #dc2626; */
    .result-icon{
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
  }

  .result-icon {
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 28rpx;
    border-radius: 50%;
    color: #fff;
  }

  .result-text {
    flex: 1;
  }

  .score-change {
    font-size: 26rpx;
    font-weight: 600;
    color: #f59e0b;
  }
}

/* 正确答案 */
.correct-answer {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 20rpx;
  background-color: #f8fafc;
  /* border: 1rpx solid #e2e8f0; */
  border-radius: 10rpx;
  margin-top: 10rpx;

  .correct-label {
    font-size: 26rpx;
    color: #059669;
    font-weight: bold;
  }

  .correct-value {
    font-size: 26rpx;
    color: #374151;
    font-weight: 600;
  }

  .explanation {
    font-size: 24rpx;
    color: #64748b;
    line-height: 1.5;
    margin-top: 10rpx;
    padding-top: 10rpx;
    border-top: 1rpx dashed #cbd5e1;
  }
}

/* 视觉分隔线 */
.divider {
  height: 1rpx;
  background-color: #e2e8f0;
  margin: 0;
  width: 100%;
}

/* 底部操作区 */
.bottom-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 40rpx;
  padding: 20rpx;
  background-color: white;
  border-top: 1rpx solid #e2e8f0;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;

  .action-button {
    height: 80rpx;
    border: none;
    border-radius: 10rpx;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    cursor: pointer;

    &.primary {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    &.secondary {
      background-color: #f1f5f9;
      color: #334155;
      border: 2rpx solid #e2e8f0;

      &:hover {
        background-color: #e2e8f0;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

/* 响应式设计 */
@media (max-width: 375rpx) {
  .header {
    padding: 30rpx 15rpx;
  }

  .title {
    font-size: 32rpx;
  }

  .subtitle {
    font-size: 24rpx;
  }

  .score {
    font-size: 72rpx;
  }

  .options {
    padding-left: 40rpx;
  }

  .option {
    padding: 15rpx;
  }

  .question-number {
    font-size: 24rpx;
  }

  .question-title {
    font-size: 24rpx;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .result-container {
    background-color: #1e293b;
  }

  .content {
    background-color: #334155;
    color: #f8fafc;
  }

  .question-item {
    background-color: #334155;
    border-bottom-color: #475569;
  }

  .question-title {
    color: #f8fafc;
  }

  .option {
    background-color: #475569;
    border-color: #64748b;
    color: #f8fafc;

    &.correct {
      background-color: #166534;
      border-color: #22c55e;
    }

    &.wrong-selected {
      background-color: #7f1d1d;
      border-color: #ef4444;
    }
  }

  .option-text {
    color: #f8fafc;
  }

  .correct-answer {
    background-color: #475569;
    border-color: #64748b;
  }
}
</style>