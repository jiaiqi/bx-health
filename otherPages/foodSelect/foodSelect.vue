<template>
  <view class="food-select">
    <view class="top">
      <view class="search-bar cu-bar  bg-white">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="请输入食物名称" confirm-type="search" />
        </view>
        <view class="action"><text class="cuIcon-scan"></text></view>
      </view>
      <view class="cu-bar bg-white">
        <view class="action">
          <text class="cuIcon-list margin-left" @click="showType = !showType"></text>
          <text class="text-xl text-bold" @click="showType = !showType">筛选</text>
          <text class="lg text-gray padding-sm" :class="{ 'cuIcon-triangledownfill': !showType, 'cuIcon-triangleupfill': showType }" @click="showType = !showType"></text>
          <view class="collect"><view class="cu-btn bg-red sm ">炒菜</view></view>
        </view>
      </view>
      <view class="type" v-if="showType">
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">炒菜</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">烧烤</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">火锅</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">面食</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">谷类</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">薯类</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">水果</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">蔬菜</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">肉类</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">蛋类</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">奶类</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">水产品</view>
        </view>
        <view class="type-item">
          <view class="item-img cu-avatar sm round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
            <label class="check-box">
              <checkbox />
              <text></text>
            </label>
          </view>
          <view class="item-label">饮料</view>
        </view>
      </view>
      <view class="sort-box">
        <view class="cu-bar bg-white">
          <view class="action">
            <text class="cuIcon-order margin-left" @click="showOrder = !showOrder"></text>
            <text class="text-xl text-bold" @click="showOrder = !showOrder">排序</text>
            <text class="lg text-gray  padding-sm" :class="{ 'cuIcon-triangledownfill': !showOrder, 'cuIcon-triangleupfill': showOrder }" @click="showOrder = !showOrder"></text>
            <view class="collect">
              <text>
                升糖指数[
                <text class="text-red">高</text>
                ]
              </text>
            </view>
          </view>
        </view>
        <view class="sort-type" v-if="showOrder">
          <view class="type-item">
            <view class="title text-red">升糖指数(GI)</view>
            <view class="item-box">
              <button class="item cu-btn sm bg-red">高</button>
              <button class="item cu-btn sm bg-yellow">中</button>
              <button class="item cu-btn sm bg-green">低</button>
            </view>
          </view>
          <view class="type-item">
            <view class="title text-green">营养成分</view>
            <view class="item-box">
              <text class="item cu-btn sm bg-orange">
                热量
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                碳水
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                蛋白
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                脂肪
                <text class="cuIcon-down"></text>
              </text>
            </view>
          </view>
          <view class="type-item">
            <view class="title text-green">维生素</view>
            <view class="item-box">
              <text class="item cu-btn sm bg-grey">
                A
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                B
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                E
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                K
                <text class="cuIcon-down"></text>
              </text>
            </view>
          </view>
          <view class="type-item">
            <view class="title text-green">矿物质</view>
            <view class="item-box">
              <text class="item cu-btn sm bg-grey">
                钙
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                锌
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                碘
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                硒
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                镁
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                钾
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                钠
                <text class="cuIcon-down"></text>
              </text>
              <text class="item cu-btn sm bg-grey">
                磷
                <text class="cuIcon-down"></text>
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="food-list center">
        <view class="list-item" v-for="i in 10" :key="i" @click="clickFood">
          <view class="img-box">
            
          </view>
          <view class="info">
            <view class="name">米饭</view>
            <text class="infomation">
             <text class="text-red calorie">116</text>千卡/100克
            </text>
          </view>
          <view class="status bg-green">
            
          </view>
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="{'show':showBottomModal}">
    	<view class="cu-dialog">
    		<view class="cu-bar bg-white">
    			<view class=" text-cyan button" @tap="showBottomModal = false">取消</view>
          <view class=" text-cyan button">确定</view>
        </view>
    		<view class="content">
    			<view class="food-list">
    			    <view class="list-item" >
    			      <view class="img-box">
    			      </view>
    			      <view class="info">
    			        <view class="name">米饭</view>
    			        <text class="infomation">
    			         <text class="text-red calorie">116</text>千卡/100克
    			        </text>
    			      </view>
    			      <view class="status bg-green">
    			      </view>
    			  </view>
    			</view>
          <view class="calculate">
            <view class="weight">100 <text class="unit">克</text></view>
            <view class="amount">
              <view class="number">
                1.0
              </view>
              <view class="unit">
                盘
              </view>
            </view>
            <view class="calorie">300千卡</view>
          </view>
          <view class="input-box">
            <div class="digit">1</div>
            <div class="digit">2</div>
            <div class="digit">3</div>
            <div class="digit">4</div>
            <div class="digit">5</div>
            <div class="digit">6</div>
            <div class="digit">7</div>
            <div class="digit">8</div>
            <div class="digit">9</div>
            <div class="digit">.</div>
            <div class="digit">0</div>
            <div class="digit"><text class="cuIcon-delete"></text></div>
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
      showType: false, //是否显示分类菜单
      curType: '', //当前选择的分类
      showOrder: false,
      showBottomModal:false
    };
  },
  methods: {
    clickFood() {
      this.showBottomModal = true
    }
  },
};
</script>

<style lang="scss" scoped>
.food-select {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;
  .center{
    flex: 1;
    overflow-y: scroll;
  }
  .collect {
    margin-left: 30upx;
    display: flex;
    font-size: 20upx;
    width: calc(100vw - 300upx);
  }

  .type {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    padding: 20upx 0;
    margin: 0 auto;
    .type-item {
      width: 150upx;
      height: 180upx;
      margin: 0 calc((100% - 750upx) / 10);
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      flex-wrap: wrap;
      .item-img {
        width: 85%;
        height: calc(85% - 30upx);
        border-radius: 50%;
        position: relative;
        background-color: #eee;
        .check-box {
          position: absolute;
          right: -10upx;
          bottom: -10upx;
          transform: scale(0.5);
        }
      }
      .item-label {
        font-size: 12upx;
        font-weight: 700;
      }
    }
  }
  .sort-box {
    .sort-type {
      display: flex;
      flex-direction: column;
      .type-item {
        display: flex;
        padding-bottom: 10upx;
        align-items: center;
        flex-wrap: wrap;
        .title {
          width: 220upx;
          text-indent: 20upx;
        }
        .item-box {
          width: calc(100% - 230upx);
          display: flex;
          flex-wrap: wrap;
          .item {
            margin-right: 10upx;
            margin-top: 10upx;
          }
        }
      }
    }
  }
  .food-list{
    display: flex;
    flex-direction:column;
    border-top: 1upx solid #eee;
    margin-top: 50upx;
    .list-item{
      display: flex;
      width: calc(100% - 50upx);
      margin: 0 auto;
      padding: 10upx;
      align-items: center;
      border-bottom: 1upx solid #eee;
      .img-box{
        width: 100upx;
        height: 100upx;
        border-radius: 10upx;
        background-color: #eee;
      }
      .info{
        flex: 1;
        padding-left: 20upx;
        .name{
          font-weight: 700;
          font-size: 24upx;
          line-height: 40upx;
        }
        .infomation{
          font-size: 20upx;
          transform: scale(0.7);
          color: #999;
          .calorie{
            padding-right: 10upx;
          }
        }
      }
      .status{
        width: 20upx;
        height: 20upx;
        border-radius: 50%;
      }
    }
  }
  .cu-btn{
    &:active{
      transition: all 0.2s;
      transform: translate(2px, 2px)
    }
  }
  .bottom-modal{
    .cu-dialog{
      height: 800upx;
      .cu-bar{
        padding: 0 50upx;
      }
      .button{
        font-weight: 800;
      }
      .food-list{
        margin-top: 0;
        border-top: none;
        border-bottom: 1upx solid #eee;
        padding: 10upx 0;
        .list-item{
          border-bottom: none;
        }
      }
      .calculate{
        display: flex;
        justify-content: space-between;
        padding:20upx 50upx;
        min-height: 100upx;
        align-items: center;
        color: #999;
        .amount{
          color: #009688;
          font-weight: 800;
          .number{
            padding: 0 20upx;
            font-size: 34upx;
            border-bottom: 5upx solid #009688;
          }
          .unit{
            text-align: center;
            padding: 10upx 0;
          }
        }
      }
    }
  }
}
</style>
