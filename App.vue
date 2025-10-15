<script>
  import Vue from 'vue';
  export default {
    globalData: {
      globalTextFontSize: 18,
      globalLabelFontSize: 16,
      statusBarHeight: uni.getSystemInfoSync()['statusBarHeight'], // 获取导航栏的高度
    },
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
    mounted() {
      this.$nextTick(()=>{
        setTimeout(()=>{
          const {
            client_env
          } = this.judgeClientEnviroment();
          if(client_env=='web'){
            // #ifdef H5
            console.log(document.querySelector('uni-page-head'), '11111111111111111111111111');
            document.querySelector('uni-page-head')?.setAttribute?.('style','display:none;')
            // #endif
          }
        },100)
      })
    },
    onLaunch(options) {
      console.log('onLaunchonLaunchonLaunchonLaunchonLaunch');
      if (options.scene === 1154) {
        return
      }
      if (options?.query?.bx_auth_ticket) {
        uni.setStorageSync('bx_auth_ticket', options.query.bx_auth_ticket)
        uni.setStorageSync('isLogin', true)
        if (options?.query?.login_user_info) {
          try {
            let login_user_info = JSON.parse(options?.query?.login_user_info)
            if (login_user_info?.user_no) {
              uni.setStorageSync('login_user_info', login_user_info)
            }
          } catch (err) {
          }
        }
      }
      this.checkUpdate()
      this.checkOptionParams(options)
      console.log("launch", options)
      // #ifdef MP-WEIXIN
      uni.onMemoryWarning(function(e) {
        console.log('onMemoryWarningReceive', e)
      });
      // #endif

      uni.getSystemInfo({
        success: function(e) {
          // #ifndef MP
          Vue.prototype.StatusBar = e.statusBarHeight;
          if (e.platform == 'android') {
            Vue.prototype.CustomBar = e.statusBarHeight + 50;
          } else {
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
          }
          // #endif

          // #ifdef MP-WEIXIN
          Vue.prototype.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          Vue.prototype.Custom = custom;
          Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
          // #endif

          // #ifdef MP-ALIPAY
          Vue.prototype.StatusBar = e.statusBarHeight;
          Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
          // #endif
        }
      });
      // this.checkSubscribeStatus()
    },
    methods: {
      checkUpdate() {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate);
        });
        updateManager.onUpdateReady(function(res) {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });
        updateManager.onUpdateFailed(function(res) {
          // 新的版本下载失败
          uni.showModal({
            title: '更新提示',
            content: '版本更新失败,请检查网络状态',
            showCancel: false
          });
        });
      },
    },
    onShow: async function(options) {
      if (this.$api.singleApp) {
        uni.setStorageSync('activeApp', this.$api.appName);
      }
      console.log('App Show', options);
    },
    onHide: function() {
      console.log('App Hide');
    }
  };
</script>

<style lang="scss">
  @import "./static/iconfont.css"; //引入字体文件
  @import 'colorui/main.css';
  @import 'colorui/icon.css';
  @import '@/common/uni.css';

  /*每个页面公共css */
  // --page-height:calc(100vh - var(--window-top) - var(--window-bottom))
  #app,
  uni-page-body,
  uni-page-wrapper {
    // background: #f1f1f1 !important;
    background-color: #fff;
  }

  html,
  body {
    height: auto;
    // background: #f1f1f1 !important;
  }

  uni-page-body>uni-view {
    height: 100%;
  }

  // .page-wrap {
  //   background-color: #fff;
  //   overflow: scroll;
  //   max-width: 800px;
  //   margin: 0 auto;
  // }

  .page-top {
    $height: 538rpx;
    position: relative;
    padding-top: $height;

    .page-bg {
      width: 100%;
      height: $height;
      background-size: 100% 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-image: url('@/static/img/homePage.png');

      .title {
        font-size: 40px;
        color: #fff;
        text-align: center;
        line-height: $height;
        word-spacing: 10px;
      }

      .inner {
        width: 100%;
        height: 100%;
        background: linear-gradient(transparent 50%, #fff);
        position: absolute;
        top: 0;
        left: 0;
      }
    }

  }

  .page-main,
  .uni-scroll-view,
  .form.is-pc {
    overflow: scroll;
    max-width: 800px;
    margin: 0 auto;
    position: relative;

  }

  .is-pc .search-bar {
    position: relative !important;

    .cu-bar.search {
      background-color: #fff;
      overflow: scroll;
      max-width: 800px;
      margin: 0 auto;
    }
  }

  .button-box {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20rpx;

    .button {
      min-width: 45%;
      position: relative;
      border: 0px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0 15px;
      font-size: 14px;
      height: 32px;
      line-height: 1;
      text-align: center;
      text-decoration: none;
      overflow: visible;
      margin-left: initial;
      margin-right: initial;
    }
  }
</style>