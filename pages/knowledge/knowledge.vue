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
      <div class="menu-box" v-for="list in menus">
        <div class="left">
          {{list.name}}
        </div>
        <div class="right" v-if="list.children">
          <div class="menu-item" v-for="item in list.children" @click="navTo(item)">
            {{item.name}}
          </div>
        </div>
      </div>

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        menus: [{
            name: '中医科普',
            children: [{
              name: '中医健康科普',
              url: '/otherPages/newsList/newsList?classifyName=中医历史与文化'
            }, {
              name: '中医科普专家',
              url: '/otherPages/newsList/newsList?classifyName=中医健康科普专家'
            }]
          },
          
        ]
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