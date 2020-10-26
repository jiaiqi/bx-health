<template>
  <view>
    <bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="fields" :moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"></bxform>
    <bxButtons :buttons="buttons" @on-button-change="onButton($event)"></bxButtons>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
import bxButtons from '@/components/bx-buttons/bx-buttons.vue';
export default {
  components: { bxform, bxButtons },
  props: {},
  data() {
    return {
      fields: [],
      loadedType: 'srvV2',
      colsV2Data: null,
      type: '',
      serviceName: '',
      condition: [],
      defaultCondition: [],
      params: {}
    };
  },
  computed: {
    buttons: function() {
      let buttons = [];
      if (this.colsV2Data && this.colsV2Data._buttonInfo) {
        buttons = this.colsV2Data._buttonInfo;
        // return this.colsV2Data._buttonInfo;
      } else if (this.colsV2Data && this.colsV2Data._formButtons) {
        buttons = this.colsV2Data._formButtons;
        // return this.colsV2Data._formButtons;
      }
      let data = {};
      this.fields.forEach(item => {
        data[item['column']] = item['value'];
      });
      let fieldModel = data;
      console.log(data, 'getDetailfieldModel');

      buttons.forEach(btn => {
        if (btn.disp_exps) {
          btn['display'] = eval(btn.disp_exps);
        }
        if (btn.operate_params) {
          let fieldData = btn.operate_params['data'];
          if (fieldData && Array.isArray(fieldData) && fieldData.length > 0) {
            fieldData = fieldData[0];
            let newData = {};
            Object.keys(fieldData).forEach(data_item => {
              let item = fieldData[data_item];
              if (item.value_type && item.value_type === 'rowData') {
                newData[data_item] = fieldModel[item.value_key];
              }
            });
            btn['requestData'] = newData;
            btn['requestCondition'] = this.condition;
          }
        }
      });
      return buttons;
    }
  },
  created() {
    const destApp = this.$route.query.destApp;
    if (destApp) {
      uni.setStorageSync('activeApp', destApp);
    }
  },
  onLoad(option) {
    const destApp = option.destApp;
    if (destApp) {
      uni.setStorageSync('activeApp', destApp);
    }
    if (option.params) {
      this.params = JSON.parse(decodeURIComponent(option.params));
    }
    if (option.cond) {
      this.defaultCondition = JSON.parse(option.cond);
    }
    if (option.hasOwnProperty('loadedType')) {
      this.loadedType = option.loadedType;
    } else if (option.hasOwnProperty('params')) {
      this.serviceName = this.params.serviceName;
      this.type = this.params.type;
      this.condition = this.params.condition;
      this.defaultVal = this.params.defaultVal;
      this.getFieldsV2();
    } else if (option.serviceName && option.type) {
      this.serviceName = option.serviceName;
      this.type = option.type;
      this.getFieldsV2();
    } else {
      uni.showToast({
        title: '加载错误',
        icon: 'none'
      });
    }
  },

  methods: {
    getFieldsV2: async function() {
      let app = uni.getStorageSync('activeApp');
      let colVs = await this.getServiceV2(this.serviceName, this.type, this.type, app);
      this.colsV2Data = colVs;
      switch (this.type) {
        case 'update':
          this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
          break;
        case 'add':
          if (this.defaultCondition && Array.isArray(this.defaultCondition) && colVs._fieldInfo && Array.isArray(colVs._fieldInfo)) {
            console.log('this.defaultCondition', this.defaultCondition, colVs._fieldInfo);
            let arr = [];
            this.defaultCondition.forEach(cond => {
              colVs._fieldInfo.forEach(field => {
                if (cond.colName === field.column) {
                  field['value'] = cond['value'];
                  field['disabled'] = true;
                }
              });
            });
          }
          this.fields = colVs._fieldInfo;
          break;
        case 'detail':
          this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
          break;
        default:
          break;
      }
    },
    async onButton(e) {
      let req = this.$refs.bxForm.getFieldModel();
	  for(let key in req){
	  		 if(!req[key]){
	  			 delete req[key]
	  		 }		  
	  }
      console.log(e, req);
      switch (e.button_type) {
        case 'edit':
          if (e.page_type === '详情') {
            // this.
            // this.type = 'update'
          } else {
            if (req) {
              req = [{ serviceName: e.service_name, data: [req], condition: this.condition }];
              let app = uni.getStorageSync('activeApp');
              let url = this.getServiceUrl(app, e.service_name, 'add');
              this.onRequest('update', e.service_name, req).then(res => {
                console.log('res:' + e.service_name, res);
                if (res.data.state === 'SUCCESS') {
                  let resData = this.getResData(res.data.response);
                  console.log('resData', resData);
                  uni.navigateBack();
                }
              });
            }
          }
          break;
        case 'submit':
          if (req) {
            req = [{ serviceName: e.service_name, data: [req] }];
            let app = uni.getStorageSync('activeApp');
            let url = this.getServiceUrl(app, e.service_name, 'add');
            console.log(url, e);
            let res = await this.$http.post(url, req);
            console.log(url, res.data);
            if (res.data.state === 'SUCCESS') {
              uni.showModal({
                title: '提示',
                content: '添加成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    uni.navigateBack();
                  }
                }
              });
            }
          }
          break;
        case 'reset':
          this.$refs.bxForm.onReset().then(res => {
            if (res) {
              uni.showToast({
                title: '已重置'
              });
            } else {
              uni.showToast({
                title: '无效操作'
              });
            }
          });
          break;
        case 'customize':
          if(e.application&&e.operate_service){
            const url = this.getServiceUrl(e.application, e.operate_service, 'operate');
            const req = [
              {
                data: [e.requestData],
                serviceName: e.operate_service,
                srvApp: e.application
              }
            ];
            let res = await this.$http.post(url, req);
            if(res.data.state==="SUCCESS"){
              uni.showModal({
                title: '提示',
                content: e.tip_msg?e.tip_msg:res.data.resultMessage,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    uni.navigateBack();
                  }
                }
              });
              
            }else{
                uni.showToast({
                  title:res.data.resultMessage,
                  mask:false,
                  icon:'none'
                })
              }
          }
          break;
        default:
          uni.showToast({
            title: e.button_name
          });
          break;
      }
    }
  }
};
</script>

<style></style>
