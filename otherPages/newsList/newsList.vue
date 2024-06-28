<template>
  <view class="page-main" :class="{'is-pc':isPC}">
    <view class="list-view">
      <view class="list-item" v-for="item in list" :key="item.uid" @click="goDetails(item)">
        <view class="left" v-if="item.node_image">
          <image :src="getImagePath(item.node_image)"></image>
        </view>
        <view class="left avatar" v-if="item.expert_pic">
          <image mode="aspectFill" :src="getImagePath(item.expert_pic)"></image>
        </view>
        <view class="right">
          <view class="title">
            <view class="titleName">{{item.node_name || item.expert_name || ''}}</view>
          </view>
          <view class="from-and_date">
            <text v-if="item.origin">{{item.origin}}|</text>
            <text v-if="item.expert_title">{{item.expert_title}}|</text>
            <text v-else>{{item.modify_time}}</text>
            <text v-if="item.expert_org">{{item.expert_org}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="isOver" v-if="isOver">{{ overText }}</view>
  </view>
</template>

<script>
  export default {
    computed: {
      isPC() {
        // #ifdef H5
        if (window.navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
          )) {
          return false; // 移动端
        } else {
          return true; // PC端
        }
        // #endif
        return false
      },
    },
    data() {
      return {
        tabSelected: "最新",
        queryForm: {
          columnRecommendation: '是'
        },
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        isOver: false,
        overText: '---我是有底线的---',
        list: [],
        classify: "",
        classifyObj: {
          '头条资讯': 'fd41bbf8a61345bc8a22b499c9dcd046',
          '直播': '0b0a342d55a74c70ac53854a028b7803',
          '电视': '959930f21ddf443d9694a1b79168da4a',
          '广播': 'fa6b29bca3fa47a2919df7bc1b30b992',
        },
        codeObj: {
          '头条资讯': '1-TouTiaoZiXun',
          '健康陕西': '2-JKSX',
          '百姓健康栏目': '3-bxjkxllm',
          '健康知识': '4-jkzs',
          '科普资料': '5',
          '宣传活动': '6',
          '直播': '6-5',
          '电视': '3-3-dslm',
          '广播': '3-6-gb',
        },
        localdata: [],
        classes: undefined,
        map: {
          text: 'classifyName',
          value: 'uid'
        },
      }
    },
    onLoad(e) {
      this.classify = e.classifyName
      this.getList()
    },
    onReady() {
      uni.setNavigationBarTitle({
        title: this.classify
      })
    },
    methods: {
      getList() {
        const serviceMap = {
          '中医健康科普专家': 'srvhealth_chinese_medicine_expert_select',
          '中医历史与文化': 'srvhealth_knowledge_node_select'
        }
        const service = serviceMap[this.classify]
        const url = this.getServiceUrl('health', service, 'select');
        const req = {
          "serviceName": service,
          "colNames": ["*"],
          "condition": [],
          "page": {
            "pageNo": this.pageIndex,
            "rownumber": this.pageSize
          }
        }
        if (this.classify === '中医历史与文化') {
          req.condition.push({
            "colName": "parent_no",
            "value": "KN2406210001",
            "ruleType": "eq"
          })
        }
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            this.list = [...this.list, ...res.data.data]
            this.total = res.data.page.total
            if (this.pageIndex * this.pageSize >= this.total) {
              this.isOver = true;
            }
          }
        })
      },
      goDetails(data) {
        uni.navigateTo({
          url: `/otherPages/details/details?id=${ data.id}&classifyName=${this.classify}`
        })
      },
      removeEmptyChildren(node) {
        node.map(item => {
          if (!item.children || item.children.length === 0) {
            delete item.children
          } else {
            let res = item.children
            this.removeEmptyChildren(res)
          }
        })
        return node
      },
    },
    // 下拉
    onReachBottom() {
      if (this.pageIndex * this.pageSize >= this.total) {
        this.isOver = true;
        return;
      } else {
        this.pageIndex++
        this.getList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  html{
    background-color: #f7f7f7;
  }
  .page-main{
    &.is-pc{
      width: 100%;
      background-color: #fff;
      
    }
  }
  page {
    background: white;
    display: flex;
    flex-direction: column;
  }

  .top-tab-view {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30rpx;

    .left-tab {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .tab-item {
        width: 140rpx;
        height: 48rpx;
        margin-left: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        border-radius: 10rpx;
        background: #FAFAFA;
        color: #CCCCCC;
      }

      .tab-selected {
        background: #DAFCF6;
        color: #27A280;
      }
    }

    .right-btn {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #CCCCCC;

      image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 30rpx;
        margin-left: 10rpx;
      }
    }
  }


  .list-view {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    box-sizing: border-box;

    .list-item {
      width: 100%;
      display: flex;
      padding: 30rpx 0;
      border-bottom: solid 1rpx #F5F7F7;

      .left {
        image {
          width: 180rpx;
          height: 135rpx;
          border-radius: 16rpx;
        }

        &.avatar image {
          width: 100rpx;
          height: 150rpx;
          border-radius: 16rpx;
        }
      }

      .right {
        flex: 1;
        margin-left: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          width: 480rpx;
          color: #666666;
          font-size: 30rpx;
          font-weight: 500;
          display: flex;
          align-items: center;

          .play-icon {
            width: 26rpx;
            height: 20rpx;
            margin-right: 20rpx;
          }

          .titleName {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .from-and_date {
          color: #999999;
          font-size: 24rpx;
        }
      }
    }
  }

  ::v-deep .input-value-border {
    border: none;
  }

  .isOver {
    text-align: center;
    font-size: 12px;
    color: #bbb;
    height: 60rpx;
    line-height: 60rpx;
  }
</style>