<template>
  <view class="page-wrap page-top">
    <view class="page-bg">
      <view class="title">
        中医科普
      </view>
      <view class="inner">

      </view>
    </view>
    <view class="page-main">
      <view class="box">
        <view class="box-item" v-for="item in menus" @click="navTo(item)">
          <view class="bg">
            <image :src="require('@/static/img/'+item.bg+'.jpg')" mode=""></image>
          </view>
          <view class="name">{{item.name}}</view>
        </view>
      </view>
      <!--      <div class="menu-box" v-for="list in menus">
        <div class="left">
          {{list.name}}
        </div>
        <div class="right" v-if="list.children">
          <div class="menu-item" v-for="item in list.children" @click="navTo(item)">
            {{item.name}}
          </div>
        </div>
      </div> -->

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        menus: [{
          name: '中医健康科普',
          bg:'a',
          url: '/otherPages/newsList/newsList?classifyName=中医历史与文化'
        }, {
          name: '中医科普专家',
          bg:'b',
          url: '/otherPages/newsList/newsList?classifyName=中医健康科普专家'
        }]
      }
    },
    methods: {
      navTo(item) {
        if (item.url) {
          uni.navigateTo({
            url: item.url
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .box{
    display: flex;
    justify-content: center;
    align-items: center;
    // flex-direction: column;
    gap: 50px;
    padding-top: 50px;
    &-item{
      // width: 300px;
      // height: 200px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      width: 800rpx;
      height: 372rpx;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      border: 1px solid #ebeef5;
      transition: all 0.3s;
      &:active{
        transform: translate(1px,1px);
      }
      &:hover .bg{
        transform: scale(1.1);
      }
      .bg{
        width: 800rpx;
        height: 372rpx;
        position: absolute;
        left: 0;
        right: 0;
        transition: all 0.3s;
        uni-image,.uni-image{
          width: 100%;
          height: 100%;
        }
      }
      .name{
        font-size: 24px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
        text-align: center;
      }
    }
  }
  .menu-box {
    display: flex;

    .left {
      width: 150px;
      font-size: 20px;
      font-weight: bold;
      padding-top: 40px;
    }

    .right {
      display: flex;
      flex-wrap: wrap;
      padding-top: 2px;
      flex: 1;

      .menu-item {
        width: 25%;
        font-size: 18px;
        min-height: 100px;
        line-height: 100px;
        cursor: pointer;
        text-align: center;
      }
    }
  }
</style>