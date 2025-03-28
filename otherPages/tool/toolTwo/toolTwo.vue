<template>
  <view class="wrap page-main ">
    <!-- #ifdef H5 -->
    <!--    <view class="page-wrap page-top" v-if="!isMobile">
      <view class="page-bg">
        <view class="title">
          BMI计算
        </view>
        <view class="inner">

        </view>
      </view>
    </view> -->
    <!-- #endif -->
    <view class="page-main bg-white">
      <view class="result-box ">
        <view class="result-item">
          <view class="label">BMI:</view>
          <view class="value"
            :class="{ 'text-blue': bmi <= 18.5, 'text-cyan': bmi > 18.5 && bmi < 24, 'text-orange': bmi >= 24 && bmi < 28, 'text-red': bmi >= 28 }">
            {{ bmi || 0 }}
          </view>
        </view>
        <view class="result-item">
          <view class="label">基础代谢:</view>
          <view class="value"
            :class="{ 'text-blue': bmi <= 18.5, 'text-cyan': bmi > 18.5 && bmi < 24, 'text-orange': bmi >= 24 && bmi < 28, 'text-red': bmi >= 28 }">
            <text v-if="basicOut">{{ basicOut}}</text>
            <text class="unit" v-if="basicOut">千卡</text>
            <text v-else class="tipText">待完善信息</text>
          </view>
        </view>
      </view>
      <view class="bmi-box">
        <bmi-weight-bar :height="info.height" :weight="info.weight"></bmi-weight-bar>
      </view>
      <view class="text-center text-cyan text-bold">请输入您的基本信息</view>
      <view class="item-list">
        <view class="item-list-top">
          <text>*</text>
          <text>体重(千克)</text>
          <text class="margin-left-xs">{{ info.weight }}kg</text>
        </view>
        <slider-number show-input :show-value="false" v-model="info.weight" :max="200" :min="0"
          :step="0.1"></slider-number>
      </view>
      <view class="item-list">
        <view class="item-list-top">
          <text>*</text>
          <text>身高(厘米)</text>
          <text class="margin-left-xs">{{ info.height }}cm</text>
        </view>
        <slider-number show-input :show-value="false" v-model="info.height" :max="250" :min="0"
          :step="0.1"></slider-number>
      </view>
      <view class="item-list">
        <view class="item-list-top">
          <text>*</text>
          <text>年龄</text>
          <text class="margin-left-xs">{{ info.age }}</text>
        </view>
        <slider-number show-input :show-value="false" v-model="info.age" :max="100" :min="0"
          :step="[1, 10]"></slider-number>
      </view>
      <view class="item-list">
        <view class="item-list-top">
          <text>*</text>
          <text class="margin-right">性别</text>
          <bx-radio-group v-model="info.sex" mode="button">
            <bx-radio class="radio" color="#2979ff" v-for="(item, i) in ['男', '女']" :key="item"
              :name="item">{{ item }}</bx-radio>
          </bx-radio-group>
        </view>
      </view>
      <view class="desc-box margin-top-lg" v-if="bmiResult&&bmi">
        <view class="padding-tb-sm text-center" v-if="bmiResult.msg">
          <text :class="[bmiResult.class]" class="text-bold text-lg">{{bmiResult.msg}}</text>
        </view>
        <view class="padding-tb-sm" v-if="bmiResult.target">
          <text class="text-bold">
            运动目的:
          </text>
          <text>
            {{bmiResult.target}}
          </text>
        </view>
        <view class="padding-tb-sm" v-if="bmiResult.way">
          <text class="text-bold">
            运动方式:
          </text>
          <text>
            {{bmiResult.way}}
          </text>
        </view>
        <view class="padding-tb-sm" v-if="bmiResult.strength">
          <text class="text-bold">
            运动强度:
          </text>
          <text>
            {{bmiResult.strength}}
          </text>
        </view>
        <view class="text-center padding-tb-sm text-gray" v-if="bmi&&bmiResult.target">
          来源：体重管理指导原则（2024年版）—国家卫生健康委办公厅印发
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    computed: {
      isMobile() {
        // #ifdef H5
        if (window.navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
          )) {
          return true; // 移动端
        } else {
          return false; // PC端
        }
        // #endif
        return false
      },
      bmi() {
        // 体重（kg）/身高*身高（m）
        if (this.info.weight && this.info.height) {
          if (Array.isArray(this.historyRecord) && this.historyRecord.length > 0) {
            if (this.historyRecord[0].weight) {
              return Number(((this.historyRecord[0].weight * 10000) / this.info.height ** 2).toFixed(1));
            }
          } else {
            return Number(((this.info.weight * 10000) / this.info.height ** 2).toFixed(1));
          }
        }
      },
      bmiScale() {
        let result = 0;
        if (this.bmi) {
          let bmi = Number(this.bmi);
          if (bmi < 18.5) {
            result = bmi / 18.5;
          } else if (bmi >= 18.5 && bmi <= 24) {
            result = (bmi - 18.5) / 5.5;
          } else if (bmi > 24 && bmi <= 28) {
            result = (bmi - 24) / 4;
          } else if (bmi > 28) {
            result = (bmi - 28) / 18.5;
          }
          result = result * 150 - 24;
        }
        if (result > 100) {
          result = 100;
        }
        return `${result}rpx`;
      },
      bmiResult() {
        let val = this.bmi
        if (val < 18.5) {
          return {
            "key": "BMI<18.5kg/m2",
            "msg": "体重过低 ",
            "target": '增加瘦体重而不是体脂。',
            "way": "推荐抗阻运动。",
            "strength": "建议重量选取为该肌群 一次最大重量（1RM）6的65%~85%，每组练习重复次数6~12次，重复3~5组，组间间歇休息2分钟；每次持续运动 60分钟；每周至少 3 次；每个肌肉群 每周可训练1~2次（后续可增至3次），同一肌肉群训练间隔在48 小时以上。",
            "class":"text-green"
          }
        } else if (val >= 18.5 && val < 24) {
          return {
            "msg": "🎉BMI维持的很棒，请继续坚持！",
            "class":"text-cyan"
          }
        } else if (val >= 24 && val < 37.5) {
          return {
            "key": "24kg/m2≤BMI<37.5kg/m2",
            "msg": "超重、轻中度肥胖",
            "target": '增加瘦体重而不是体脂。',
            "way": "推荐抗阻运动。",
            "strength": "建议重量选取为该肌群 一次最大重量（1RM）6的65%~85%，每组练习重复次数6~12次，重复3~5组，组间间歇休息2分钟；每次持续运动 60分钟；每周至少 3 次；每个肌肉群 每周可训练1~2次（后续可增至3次），同一肌肉群训练间隔在48 小时以上。",
            "class":"text-orange"
          }
        } else if (val >= 37.5) {
          return {
            "key": "24kg/m2≤BMI<37.5kg/m2",
            "msg": "⚠️重度肥胖",
            "target": '降低体脂肪含量。另外，应重视根据个人兴趣选取运动形式，提高依从性，并进行生活方式干预，矫正引发过度进食或身体活动不足的行为习惯。',
            "way": "注意减少久坐时间，增加日常身体活动消耗量。建议以有氧运动作为减重主要运动方式。如果有关节活动障碍，需先进行功能康复训练或治疗，待症状消失后再开始减脂训练。",
            "strength": "建议根据个体体能基础，从低强度有氧运动开始，循序渐进地增加身体活 动量（频率、强度、持续时间）。初始阶段应避免剧烈运动，在有监督的环境下开始低强度有氧运动，最佳强度为最大脂肪氧化强度运动，持续训练 时间从 30 分钟开始，逐渐增加至60~120 分钟。随着体能的提高，可增 加抗阻运动，甚至高强度有氧运动。 但重度肥胖患者在开始高强度运动前应进行全面的医学评估，以帮助确定是否存在参与高强度运动的禁忌证。",
            "class":"text-red"
          }
        }
        return {

        }
      },
      weightForBmi() {
        let bmiList = [18.5, 24, 28];
        let weightList = [];
        if (this.bmi && this.info && this.info.height) {
          bmiList.forEach(bmi => {
            let weight = ((bmi * this.info.height ** 2) / 10000).toFixed(1) + 'kg';
            weightList.push({
              bmi,
              weight
            });
          });
        }
        return weightList;
      },
      basicOut() {
        // 基础代谢
        let result = 0;
        if (this.info.sex === '男') {
          if (this.info.height >= 60) {
            result = this.info.weight * 13.4 + 490;
          } else if (this.info.height >= 31 && this.info.height < 60) {
            result = this.info.weight * 11.5 + 830;
          } else {
            result = this.info.weight * 15.2 + 600; //<31
          }
        } else if (this.info.sex === '女') {
          if (this.info.height >= 60) {
            result = this.info.weight * 10.4 + 600;
          } else if (this.info.height >= 31 && this.info.height <= 60) {
            result = this.info.weight * 8.6 + 830;
          } else {
            result = this.info.weight * 14 + 450; //<31
          }
        }
        return Number(result.toFixed(1));
      }
    },
    data() {
      return {
        info: {
          weight: 0,
          age: 0,
          sex: '',
          height: 0
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  .wrap {
    background-color: #fff;
    min-height: calc(100vh - var(--window-top));
    padding: 20rpx;
  }

  .result-box {
    position: relative;
    background-color: #f8f8f8;
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    padding: 20px 40rpx;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

    .result-item {
      text-align: center;
      display: flex;
      align-items: center;

      .label {
        margin-right: 10px;
      }

      .value {
        font-size: 50rpx;
        font-weight: bold;
        display: flex;
        align-items: center;

        .unit {
          font-size: 14px;
          margin-left: 5px;
        }

        .tipText {
          font-size: 16px;
          color: #666;
        }
      }
    }
  }

  .bmi-box {
    width: 100%;
    display: flex;
    padding: 0 20rpx;
    background-color: #fff;
    margin: 20rpx 0 50px;
    border-radius: 20rpx;
    justify-content: center;

    .bmi-box-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      margin: 20rpx 0;
      height: 100rpx;

      .title {
        color: #999;
        font-size: 24rpx;
        font-weight: normal;
      }

      .digit {
        color: #333;
        font-weight: 700;
        font-size: 30rpx;

        &.bmi {
          font-size: 60rpx;
        }
      }
    }

    .bmi-bar-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      align-items: center;
      font-weight: normal;

      .last-data {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        .create-time {
          width: 100%;
        }

        .unit {
          font-size: 32rpx;
          color: #666;
          margin-left: 5rpx;
        }
      }

      .bmi-label {
        display: flex;
        position: relative;
        width: 500rpx;
        height: 40rpx;
        line-height: 40rpx;
        color: #666;
        font-size: 24rpx;

        .label {
          position: absolute;
          left: -80rpx;
        }

        .value {
          flex: 1;
        }
      }

      .bmi-bar {
        padding: 40rpx 0 20rpx;
        display: flex;
        width: 100%;
        justify-content: center;

        .bar-box {
          width: 150rpx;
          position: relative;
          margin-top: 10rpx;

          .scale {
            position: absolute;
            top: -25px;
            font-size: 50rpx;
            left: 0;
            transition: left 2s ease;

            .tip-bmi {
              font-size: 14px;
              position: absolute;
              font-weight: bold;
              // top: -5px;
              // left: 0;
            }
          }

          .bar {
            height: 60rpx;
            line-height: 60rpx;
            color: #f1f1f1;
          }
        }

        .bar1 {
          margin-right: 4rpx;

          .bar {
            background-color: #40c0fd;
            border-top-left-radius: 50rpx;
            border-bottom-left-radius: 50rpx;
          }

          .active-label {
            background-color: #40c0fd;
          }
        }

        .bar2 {
          margin-right: 4rpx;

          .bar {
            background-color: #4acdba;
          }

          .active-label {
            background-color: #4acdba;
          }
        }

        .bar3 {
          margin-right: 4rpx;

          .bar {
            background-color: #fad650;
          }

          .active-label {
            background-color: #fad650;
          }
        }

        .bar4 {
          .bar {
            background-color: #f7b235;
            border-top-right-radius: 50rpx;
            border-bottom-right-radius: 50rpx;
          }

          .active-label {
            background-color: #f7b235;
          }
        }
      }
    }
  }

  .item-list {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    text {
      color: #5e5e5e;
      margin-bottom: 10upx;
      font-weight: 700;
    }

    .number-change {
      display: flex;
      padding: 20rpx;
      justify-content: center;

      .operate {
        padding: 2px 10px;
        background-color: #dff5f5;
        color: #0bc99d;

        &+.operate {
          margin-left: 10rpx;
        }
      }

      .value {
        flex: 1;
        border: 1rpx solid #f1f1f1;
        margin: 0 20rpx;
        border-radius: 10rpx;
        overflow: hidden;
      }
    }

    .item-list-top {
      display: flex;
      align-items: center;

      text {
        &:first-child {
          color: red;
          margin-right: 8rpx;
        }
      }

      ::v-deep .bx-radio.button-mode {
        margin-bottom: 0;
      }

      .value {
        flex: 1;
        font-weight: bold;
        margin-left: 20px;
        display: flex;
        color: #0bc99d;

        .picker {}
      }
    }

    .item-list-bot {
      border: 1px solid #ccc;
      padding: 10rpx;
    }

    .weight-radio-group {
      display: flex;
      margin-bottom: 10rpx;

      .weight-radio-group-item {
        margin-right: 20rpx;
        display: flex;
        align-items: center;

        ::v-deep .uni-radio-input {
          transform: scale(0.8);

          .uni-radio-input-checked {
            background-color: rgb(0, 122, 255) !important;
          }
        }

        .title {
          margin-right: 4rpx;
        }
      }
    }
  }
  .desc-box{
    // border: 1px solid #f1f1f1;
    padding: 20rpx;
    border-radius: 16rpx;
  }
</style>