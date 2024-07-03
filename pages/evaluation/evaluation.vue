<template>
  <view class="page-wrap page-top bg-white">
    <view class="page-bg">
      <view class="title">
        健康评测
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
            name: '健康自我评测',
            children: [{
              name: '体重评估',
              url: '/otherPages/tool/toolTwo/toolTwo'
            }, {
              name: '睡眠质量评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240627213526000001&status=进行中'
            }, {
              name: '孕期体重评估',
              url: '/otherPages/tool/toolTwo/toolTwo'
            }, {
              name: '婴幼儿发育评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240625175248000001&status=进行中'
            }, {
              name: '中医九种体质评估',
              url: '/archivesPages/healthCompose/healthCompose'
            }, {
              name: '抑郁评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20201116145316000198&status=进行中'
            }, {
              name: '焦虑评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20201116151412000200&status=进行中'
            }]
          },
          {
            name: '慢病风险评估',
            children: [{
              name: '冠心病评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703091153000002&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_coronary_disease_select'
            }, {
              name: '脑卒中评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703092217000003&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_apoplexy_select'
            }, {
              name: '高血压评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703092255000004&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_hypertension_select'
            }, {
              name: '糖尿病评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703092326000005&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_diabetes_select'
            }, {
              name: '代谢综合征评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703092406000006&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_metabolize_select'
            }, {
              name: '肺癌评估',
              url: '/questionnaire/index/index?formType=form&activity_no=20240703083854000001&status=进行中'
              // url: '/publicPages/list/list?serviceName=srvhealth_store_report_lung_cancer_select'
            }]
          }, {
            name: '食品药品指引',
            children: [{
              name: '食物营养',
              url: '/otherPages/dietSelect/dietSelect?condType=%257B%2522type%2522%253A%2522food%2522%252C%2522serviceName%2522%253A%2522srvhealth_diet_contents_select%2522%252C%2522colName%2522%253A%2522name%2522%252C%2522imgCol%2522%253A%2522image%2522%252C%2522wordKey%2522%253A%257B%2522title%2522%253A%2522name%2522%252C%2522unit%2522%253A%2522unit%2522%252C%2522energy%2522%253A%2522unit_energy%2522%257D%252C%2522pagetType%2522%253A%2522detail%2522%257D'
            }, {
              name: '孕育营养',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS202102011156120004%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '学龄儿童',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS202101231933360001%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '办公室人群',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS202101242003140003%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '老年人',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS202101231935060002%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '糖尿病',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS2406251701030001%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '高血压',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS2406251701160002%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '痛风',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS2406251701260003%2522%252C%2522display%2522%253Afalse%257D%255D'
            }, {
              name: '肥胖',
              url: '/publicPages/newForm/newForm?type=detail&serviceName=srvhealth_diet_scheme_select&fieldsCond=%255B%257B%2522column%2522%253A%2522diet_scheme_no%2522%252C%2522value%2522%253A%2522DS2406251701390004%2522%252C%2522display%2522%253Afalse%257D%255D'
            }]
          },
          {
            name: '就医康复指引',
            children: [{
              name: '就医康复指引',
              url: '/otherPages/symptomSelect/symptomSelect'
            }]
          }
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