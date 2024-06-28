<template>
  <view class="page-wrap" :style="{
			'--global-text-font-size': globalTextFontSize + 'px',
		}">
    <view class="to-history" v-if="configCols && configCols.length > 0" @click="toHistory">点击查看历史提交</view>
    <view class="content" style="padding:30upx 30upx 0;" v-if="formData.remark">
      <view class="desc" style="text-align: justify;">
        <view class="text-content-text text-black">
          <view v-html="JSON.parse(JSON.stringify(formData.remark).replace(/\<img/gi, '<img width=100%  '))">
          </view>
        </view>
        <!-- 	<view class="date-box">
					<text v-if="formData.start_time">开始时间：{{ formData.start_time.slice(0, 10) }}</text>
					<text v-if="formData.end_time">结束时间：{{ formData.end_time.slice(0, 10) }}</text>
				</view> -->
      </view>
    </view>
    <view class="content form-wrap" style="box-sizing: border-box;">
      <bxform ref="bxform" :fields="configCols" label-position="top" option-mode="normal" pageType="add"
        @value-blur="saveValue"></bxform>
    </view>
    <view class="content" style="padding:30upx;" v-if="formData.end_remark">
      <view class="desc">
        <view class="text-content-text">
          <view v-html="JSON.parse(JSON.stringify(formData.end_remark).replace(/\<img/gi, '<img width=100%'))">
          </view>
        </view>
      </view>
    </view>
    <view class="button-box"
      v-if="formType === 'form' && configCols && configCols.length > 0 && (formData['user_state'] === '未完成' || formData['answer_times'] === '多次')">
      <button class="button" type="" @click="submitForm()">提交</button>
    </view>
    <view class="button-box"
      v-if="formType === 'detail' && configCols && configCols.length > 0 && formData.info_collect_type === '评估' && formData.user_state === '完成' && fill_batch_no">
      <button class="button cu-btn" type="" @click="seeReport()">查看评估结果</button>
    </view>
    <view class="button-box"
      v-if="formType === 'detail' && configCols && configCols.length > 0 && formData.info_collect_type === '自测' && formData.user_state === '完成' && fill_batch_no">
      <button class="button cu-btn" type="" @click="seeScore"
        v-if="!scoreInfo.score && scoreInfo.score !== 0">查看分数</button>
      <view class="score-box" v-if="scoreInfo.score || scoreInfo.score === 0">
        得分：
        <view class="score">{{ scoreInfo.score === 0 ? '0' : scoreInfo.score }}</view>
      </view>
    </view>
    <view class="button-box" v-if="showNextBtn"><button class="button cu-btn" @click="toNextPages">下一步</button>
    </view>
  </view>
</template>

<script>
  import bxform from '@/components/a-form/a-form.vue';
  import {
    mapState
  } from 'vuex';

  export default {
    name: 'questionnaire', //问卷答题页面
    components: {
      bxform
    },
    data() {
      return {
        appName: 'daq',
        emptyText: '', //无数据时提示文字
        formType: 'form', // 表单类型 预览:detail 正常:form
        activity_no: '', // 问卷编号
        playNo: '',
        status: '未开始',
        target: '',
        configCols: [],
        formData: {
          title: '', // 标题
          remark: '', //欢迎语
          end_remark: '' //结束语
        },
        // userInfo: {}, // 登录用户信息
        wxUserInfo: {}, // 微信用户信息
        questionData: {},
        fill_batch_no: '', //活动批次编号
        scoreInfo: {}, // 得分情况
        params: {},
        showNextBtn: false
      };
    },
    props: {
      activityNo: {
        type: String,
        default: ''
      },
      comfromType: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo,
        globalTextFontSize: state => state.app['globalTextFontSize']
      })
    },
    watch: {
      activityNo(newValue, oldValue) {
        if (this.activityNo) {
          this.emptyText = '正在请求问卷配置数据';
          setTimeout(() => {
            this.emptyText = '未找到问卷配置数据';
          }, 3000);
          this.formType = this.comfromType;
          this.status = '进行中';
          this.activity_no = this.activityNo;
          this.getQuestionnaireData();
        }
      }
    },
    methods: {
      toNextPages() {
        let params = this.deepClone(this.params);
        let fieldsCond = params.fieldsCond;
        if (this.planNo) {
          fieldsCond.push({
            column: 'ps_no',
            display: false,
            value: this.planNo
          })
        } else {
          fieldsCond.push({
            column: 'ps_no',
            display: false
          })
        }
        fieldsCond[fieldsCond.findIndex(item => item.column === 'report_daq_survey_ack_no')].value = params
          .fill_batch_no;
        let url = `${params.to}&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`;
        if (this.planNo) {
          url += `&planNo=${this.planNo}`;
        }
        uni.redirectTo({
          url: url
        });
      },
      toHistory() {
        uni.navigateTo({
          url: '/questionnaire/history/history?activity_no=' + this.activity_no + '&title=' + this
            .formData.title
        });
      },
      seeScore() {
        // 自测题 查看分数
        let fill_batch_no = this.fill_batch_no;
        let activity_no = this.activity_no;
        const serviceName = 'srvdaq_record_reply_select';
        const url = this.getServiceUrl(this.appName ? this.appName : 'daq', serviceName, 'select');
        const req = {
          serviceName: serviceName,
          colNames: ['*'],
          condition: [{
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            },
            {
              colName: 'fill_batch_no', // 批次号
              ruleType: 'eq',
              value: this.fill_batch_no
            }
          ]
        };
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
            this.scoreInfo = res.data.data[0];
          }
        });
      },
      async seeReport() {
        // 查看评估结果
        uni.navigateTo({
          url: `/questionnaire/assessmentResult/assessmentResult?activity_no=${this.activity_no}&fill_batch_no=${this.fill_batch_no}`
        });
      },
      toFeedback() {
        // 跳转到意见反馈问卷
        uni.redirectTo({
          url: '/questionnaire/index/index?formType=form&activity_no=20200309125000000100&status=进行中'
        });
      },
      saveValue(e) {
        let self = this;
        if (e.value && this.status === '进行中') {
          let itemData = [{
            item_no: e.column,
            option_data: [e.value]
          }];
          if (e.type === 'checkbox') {
            itemData = [{
              item_no: e.column,
              option_data: e.value
            }];
          }
          if (Array.isArray(e.value)) {
            itemData = [{
              item_no: e.column,
              option_data: e.value.filter(i => i && i)
            }];
          }
          const serviceName = 'srvdaq_activity_result_save';
          const url = this.getServiceUrl('daq', serviceName, 'operate');
          let req = [{
            serviceName: serviceName,
            data: [{
              activity_no: this.activity_no,
              item_data: itemData
            }]
          }];
          if (self.fill_batch_no) {
            req[0].data[0].fill_batch_no = self.fill_batch_no;
          }
          self.$http.post(url, req).then(res => {
            if (res.data.state === 'SUCCESS') {
              console.log(res.data.response[0].response);
              let data = res.data.response[0].response;
              if (data.fill_batch_no && !self.fill_batch_no) {
                self.fill_batch_no = data.fill_batch_no;
                uni.setStorageSync('fill_batch_no', self.fill_batch_no);
              }
            } else {
              console.log(res);
            }
          });
        }
      },
      submitForm() {
        let self = this;
        let itemData = self.$refs.bxform.getFieldModel();
        if (itemData !== false) {
          uni.showModal({
            title: '提示',
            content: '确认提交问卷?',
            success: function(res) {
              if (res.confirm) {
                if (self.status !== '进行中') {
                  uni.showToast({
                    title: '状态非进行中的问卷不支持提交',
                    icon: 'none'
                  });
                } else {
                  console.log('itemData', itemData);
                  let resultData = [];
                  Object.keys(itemData).forEach(item => {
                    let obj = {
                      item_no: item,
                      option_data: [itemData[item]]
                    };
                    if (Array.isArray(itemData[item])) {
                      obj.option_data = itemData[item].filter(i => i && i);
                    }
                    if (itemData[item]) {
                      resultData.push(obj);
                    }
                  });
                  let serviceName = 'srvdaq_activity_result_submit';
                  const url = self.getServiceUrl(self.appName ? self.appName : 'daq',
                    serviceName, 'operate');
                  let req = [{
                    serviceName: serviceName,
                    data: [{
                      fill_batch_no: self.fill_batch_no,
                      activity_no: self.activity_no,
                      item_data: resultData
                    }]
                  }];
                  console.log('resultData', resultData);
                  self.$http.post(url, req).then(res => {
                    if (res.data.state === 'SUCCESS') {
                      if (res.data.resultCode === 'SUCCESS') {
                        uni.showToast({
                          title: '提交成功',
                          icon: 'none'
                        });

                        self.formType = 'detail';
                        self.getQuestionnaireData(self.formData);
                        if (Array.isArray(res.data.response) && res.data
                          .response.length > 0 && res.data.response[0]
                          .response && res.data.response[0].response
                          .fill_batch_no) {
                          self.params.fill_batch_no = res.data.response[0]
                            .response.fill_batch_no;
                        }
                        if (self.params.to && self.params.fill_batch_no) {
                          self.showNextBtn = true;
                        } else if (self.target && self.target === 'health') {
                          let data = {
                            from: '饮食',
                            data: req[0].data[0],
                            result: {
                              origin: self.$route.query.origin,
                              scope: 10,
                              remark: '饮食习惯良好'
                            }
                          };
                          uni.redirectTo({
                            url: '/pages/specific/health/home/home?result=' +
                              JSON.stringify(data)
                          });
                        } else {
                          if (self.params.fill_batch_no) {
                            // const url =
                            //   `/questionnaire/index/index?formType=detail&activity_no=${self.activity_no}&status=完成&fill_batch_no=${self.params.fill_batch_no}`
                            // uni.redirectTo({
                            //   url
                            // })
                            self.fill_batch_no = self.params.fill_batch_no
                            self.formType = 'detail';
                            self.questionData = {
                              fill_batch_no: self.params.fill_batch_no,
                              activity_no: self.activity_no
                            };

                            if (self.formData.info_collect_type === '评估') {
                              const url =
                                `/questionnaire/assessmentResult/assessmentResult?activity_no=${self.activity_no}&fill_batch_no=${self.fill_batch_no}`
                              uni.redirectTo({
                                url
                              })
                              return
                            }

                            self.getQuestionnaireData(self.questionData);
                            return
                          }

                          uni.showModal({
                            title: '提示',
                            content: '您的测评信息已提交，我们将会由专业人员为您评估！',
                            showCancel: false,
                            success(res) {
                              if (res.confirm) {
                                // uni.navigateBack()
                              }
                            }
                          })
                        }
                      }
                    } else {
                      uni.showToast({
                        title: res.data.resultMessage,
                        icon: 'none'
                      });
                    }
                    console.log(res);
                  });
                }
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
      },
      getQuestionnaireData(questionData) {
        // 获取问卷数据
        let that = this;
        const serviceName = 'srvdaq_init_view_select';
        const url = this.getServiceUrl(this.appName ? this.appName : 'daq', serviceName, 'select');
        const req = {
          serviceName: serviceName,
          colNames: ['*'],
          order: [{
            colName: 'item_seq',
            orderType: 'asc'
          }],
          condition: [{
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            },
            {
              colName: 'type', // 查看视图初始化
              ruleType: 'eq',
              value: 'use'
            }
          ]
        };
        if (this.status === '未开始') {
          req.condition = [{
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            },
            {
              colName: 'biz_type',
              ruleType: 'eq',
              value: 'cfg'
            }
          ];
        }
        if (questionData && questionData.fill_batch_no) {
          req.condition = [{
              colName: 'activity_no',
              ruleType: 'eq',
              value: questionData.activity_no
            },
            {
              colName: 'type',
              ruleType: 'eq',
              value: 'use'
            },
            {
              colName: 'fill_batch_no',
              ruleType: 'eq',
              value: questionData.fill_batch_no
            }
          ];
        }
        if (this.activity_no && this.fill_batch_no) {
          req.condition = [{
              colName: 'activity_no',
              ruleType: 'eq',
              value: this.activity_no
            },
            {
              colName: 'type',
              ruleType: 'eq',
              value: 'use'
            },
            {
              colName: 'fill_batch_no',
              ruleType: 'eq',
              value: this.fill_batch_no
            }
          ];
        }
        this.$http.post(url, req).then(res => {
          if (res.data.state === 'SUCCESS') {
            const data = res.data.data[0];
            this.activity_no = data.activity_no;
            let configCols = [];
            data.item_data.forEach(item => {
              configCols.push(this.getConfig(item));
            });
            if (data.logo) {
              this.getPicture(data.logo).then(url => {
                this.$set(this.formData, 'fileUrl', url);
              });
            }
            if (data.user_data) {
              if (this.params && this.params.emptyValue) {
                // 不填充默认值
              } else {
                configCols.forEach(item => {
                  if (this.formType === 'detail') {
                    item.disabled = true;
                  }
                  item.options = item.options.map(op => {
                    op.checked = false
                    return op
                  })
                  data.user_data.forEach(items => {
                    if (item.column === items.item_no) {
                      if (item.item_type_attr && item.item_type_attr
                        .radioType === 'multi') {
                        item.value = items.option_data ? items.option_data
                          .toString() : '';
                        item.options = item.options.map(op => {
                          if (item.value.indexOf(op.value) !== -
                            1) {
                            op.checked = true
                          }
                          return op
                        })
                      } else {
                        item.value = items.option_data[0];
                      }
                    }
                  });
                });
              }
            }
            this.formData = data;
            if (data.title) {
              uni.setNavigationBarTitle({
                title: data.title
              });
            }
            if (data.user_state === '完成' && data.answer_times !== '多次') {
              this.formType = 'detail';
            }
            configCols.forEach((item, index) => {
              item.iconSize = 28;
              item.itemIndex = index + 1;
              if (item.label && item.label.slice(0, 1) != (index + 1).toString() && item
                .label.slice(0, 2) != (index + 1).toString()) {
                item.label = (index + 1).toString() + '.' + item.label;
              }
              if (item.type === 'digit' && item.item_type_attr.decimal && item.value) {
                item.value = Number(item.value).toFixed(item.item_type_attr.decimal);
              } else if (item.type === 'digit' && !item.item_type_attr.decimal && item
                .value) {
                item.value = Number(item.value).toFixed(1);
              } else if (item.type === 'number' && item.value) {
                item.value = parseInt(item.value).toString() !== 'NaN' ? parseInt(item
                  .value) : 0;
              }
            });
            this.configCols = configCols;
            this.getUserInfo();
          } else if (res.data.resultCode === '0011') {
            uni.showToast({
              title: '未登录',
              icon: 'none'
            });
          } else if (res.data.resultCode === 'FAILURE') {
            uni.showToast({
              title: res.data.resultMessage,
              icon: 'none'
            });
            if (res.data.resultMessage === '活动已结束') {
              this.updateState().then(response => {
                uni.showModal({
                  title: '提示',
                  content: res.data.resultMessage + ',即将跳转到列表页面',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      uni.navigateBack({
                        animationDuration: 2000
                      });
                    }
                  }
                });
              });
            }
          }
        });
      },
      async updateState(e) {
        let reqData = [{
          status: '已结束'
        }];
        let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_activity_cfg_update',
          'operate');
        let req = [{
          serviceName: 'srvdaq_activity_cfg_update',
          data: reqData,
          condition: [{
            colName: 'activity_no',
            ruleType: 'eq',
            value: this.activity_no
          }]
        }];
        let response = await this.$http.post(url, req);
        return response;
      },
      async getUserInfo() {
        // 获取微信账号信息
        let url = this.$api.getUserInfo;
        let req = {
          serviceName: 'srvwx_basic_user_info_select',
          colNames: ['*'],
          condition: [{
            colName: 'app_no',
            ruleType: 'eq',
            value: this.$api.appNo.wxh5
          }]
        };
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
          const userInfo = res.data.data[0];
          this.wxUserInfo = userInfo;
          uni.setStorageSync('wxUserInfo', userInfo);
        } else {
          uni.showToast({
            title: '未获取到当前微信用户信息',
            icon: 'none'
          });
        }
      },
      async getPicture(file_no) {
        const serviceName = 'srvfile_attachment_select';
        const url = this.getServiceUrl('file', serviceName, 'select');
        const req = {
          serviceName: serviceName,
          colNames: ['*'],
          condition: [{
            colName: 'file_no',
            value: file_no,
            ruleType: 'eq'
          }]
        };
        if (file_no !== null && file_no !== '' && file_no !== undefined) {
          let res = await this.$http.post(url, req);
          if (res.data.state === 'SUCCESS') {
            const data = res.data.data[0];
            if (data) {
              const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
              return fileurl;
            }
          }
        }
      },
      getConfig(e) {
        let config = {
          label: e.item_title,
          column: e.item_no,
          srvInfo: {
            serviceName: 'srvdaq_activity_result_submit',
            appNo: this.appName ? this.appName : 'daq'
          },
          value: e.value,
          type: e.item_type,
          isRequire: e.is_require === '是' ? true : false,
          isShowExp: [],
          options: [],
          item_type_attr: e.item_type_attr,
          display: true,
          points: e.points,
          answer: e.answer,
          option_img_explain: e.option_img_explain,
          _rawData: e,
          option_list_v2: e.option_list_v2
        };
        if (this.formType === 'detail') {
          config.disabled = true;
        }
        switch (e.item_type) {
          case '文本':
            // config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
            config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'text';
            break;
          case '图片':
            config.type = 'images';
            config['fileNum'] = e.item_type_attr['fileNum'];
            break;
          case '选项':
            config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkboxFk' :
              'radioFk';
            config.options = e.option_data.map((item, optIndex) => {
              item.color = '#0bc99d';
              item.value = item.option_value;
              item.showimg = false;
              item.checked = false
              item.label = item.option_value;
              if (item.option_view_no) {
                item.serialChar = item.option_view_no;
              } else if (item.option_seq) {
                item.serialChar = item.option_seq;
              } else {
                item.serialChar = optIndex;
              }
              return item;
            });
            break;
          case '时间日期':
            config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'date';
            // config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
            break;
          case '数字':
            config.type = e.item_type_attr.numberType ? e.item_type_attr.numberType : 'number';
            break;
          case '地址':
            config.type = 'cascader';
            config.srvInfo = {
              serviceName: 'srvconfig_area_adj_select',
              appNo: 'config',
              isTree: true,
              column: 'no',
              showCol: 'path_name' //要展示的字段
            };
            break;
          case '引用':
            config.type = 'Selector';
            // config.type = 'treeSelector';
            config.option_list_v2 = {
              refed_col: e.item_type_attr.refed_col,
              srv_app: e.item_type_attr.srv_app,
              serviceName: e.item_type_attr.serviceName,
              key_disp_col: e.item_type_attr.key_disp_col
            };
            break;
          default:
            config.type = e.item_type;
            break;
        }
        return config;
      },
      saveShareRecord(share_type) {
        let url = this.$api.saveShareRecord;
        let req = [{
          serviceName: 'srvdaq_record_share_add',
          data: [{
            biz_no: this.activity_no,
            biz_type: this.appName ? this.appName : 'daq',
            share_url: window.location.href,
            from_user: this.userInfo.user_no,
            share_type: share_type ? share_type : '朋友圈'
          }]
        }];
        this.$http.post(url, req).then(res => {
          console.log(res);
        });
      },
      getParams(name) {
        let str = window.location.href;
        str = str.split('?')[1];
        let arr = str.split('&');
        let obj = {};
        arr.forEach(item => {
          obj[item.split('=')[0]] = item.split('=')[1];
        });
        if (obj[name]) {
          return obj[name];
        } else {
          return false;
        }
      }
    },
    beforeDestroy() {
      uni.setStorageSync('fill_batch_no', '');
    },
    mounted() {
      if (this.activityNo) {
        this.emptyText = '正在请求问卷配置数据';
        setTimeout(() => {
          this.emptyText = '未找到问卷配置数据';
        }, 3000);
        this.formType = this.comfromType;
        this.status = '进行中';
        this.activity_no = this.activityNo;
        this.getQuestionnaireData();
      }
    },
    onShareAppMessage() {
      let path =
        `/questionnaire/index/index?formType=form&activity_no=${this.activity_no}&status=进行中`;
      this.saveSharerInfo(this.userInfo, path);
      return {
        title: this.formData.title,
        path: path
      };
    },
    onLoad(option) {
      // #ifdef MP-WEIXIN
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage']
      });
      // #endif
      if (option.bx_auth_ticket) {
        uni.setStorageSync('bx_auth_ticket', option.bx_auth_ticket)
      }
      if (option.planNo) {
        this.planNo = option.planNo;
      }
      if (option.params) {
        this.params = JSON.parse(decodeURIComponent(option.params));
      }
      this.emptyText = '正在请求问卷配置数据';
      setTimeout(() => {
        this.emptyText = '未找到问卷配置数据';
      }, 3000);
      if (option.formType && option.formType === 'detail') {
        this.formType = option.formType;
      } else {
        this.formType = 'form';
      }
      if (option.from) {
        this.target = option.from;
      }
      if (option.fill_batch_no) {
        this.fill_batch_no = option.fill_batch_no;
      }
      let questionData = option.questionData;
      if (questionData) {
        questionData = JSON.parse(decodeURIComponent(option.questionData));
      }
      if (questionData && questionData.fill_batch_no) {
        this.formType = 'detail';
        this.questionData = questionData;
        this.getQuestionnaireData(this.questionData);
      } else {
        if (option.status) {
          this.status = decodeURIComponent(option.status);
          console.log('status', this.status);
        }
        if (option.activity_no) {
          this.activity_no = option.activity_no;
          this.getQuestionnaireData();
        } else if (this.questionData.activity_no) {
          this.status = '已完成';
          this.activity_no = this.questionData.activity_no;
          this.getQuestionnaireData();
        } else {
          uni.showModal({
            title: '提示',
            content: '未知的问卷编号，即将返回上个页面',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                uni.navigateBack({});
              }
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page-wrap {
    background-color: #fff;
    overflow: scroll;
    max-width: 800px;
    margin: 0 auto;
  }

  .content {
    width: 100%;

    .desc {
      width: 100%;
    }

    .date-box {
      color: #0bc99d;
      padding: 20rpx 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .to-history {
    text-align: center;
    color: #0bc99d;
    position: relative;
    margin: 20rpx 0 0;

    &::before {
      content: '';
      position: absolute;
      width: 25%;
      height: 1px;
      background-color: #0bc99d;
      top: 50%;
      left: 50rpx;
    }

    &::after {
      content: '';
      position: absolute;
      width: 25%;
      height: 1px;
      background-color: #0bc99d;
      top: 50%;
      right: 50rpx;
    }
  }

  .button-box {
    display: flex;
    justify-content: center;
    padding: 30rpx;

    .button {
      color: #fff;
      background-color: #0bc99d;
      height: 60rpx;
      line-height: 60rpx;
      min-width: 45%;
    }
  }

  .question-title {
    min-height: 100rpx;
    color: #333;
    font-weight: 700;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-button {
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20rpx 0 40rpx;

    .foot-btn {
      color: #0bc99d;
      height: 40upx;
      line-height: 40upx;
      border-bottom: 1px solid #0bc99d;
    }
  }

  .text-content-text {
    color: #666;
    width: 100%;
    min-height: 100rpx;
    height: auto;
    margin: 0;
    display: flex;
    flex-direction: column;
    color: #666;
    padding: 20rpx;
    border-left: 4px solid #cbcbcb;
    background-color: #f8f8f8;
    font-size: 30rpx;
    color: #666;
  }

  .cu-modal.bottom-modal {
    color: #333;

    .cu-dialog {
      height: auto;
    }
  }

  .score-box {
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;

    .score {
      padding: 0 20rpx;
      font-size: 60rpx;
      font-weight: 700;
    }
  }

  .u-empty {
    height: 100%;
  }
</style>