<template>
  <view>
    <a-form-item :showResult="showResult" :procData="procData" :labelPosition="labelPosition" :optionMode="optionMode"
      @on-value-change="onValChange" @on-value-blur="onValBlur" @chooseLocation="chooseLocation"
      v-for="field in allField" :key="field.id" :field="field" :pageType="pageType" :ui="ui" ref="fitem"></a-form-item>
    <!-- <slot></slot> -->
  </view>
</template>

<script>
  import evaluatorTo from '@/common/evaluator.js';
  export default {
    name: 'aForm',
    props: {
      ui: String,
      fields: {
        type: Array,
        required: true
      },
      formType: {
        type: String,
        default: 'add' //add||update
      },
      pageType: {
        type: String,
        default: 'form'
      },
      procData: {
        type: Object,
        default () {
          return {};
        }
      },
      labelPosition: {
        type: String,
        default: 'left' //left|top
      },
      optionMode: {
        type: String,
        default: 'button' //选项的样式 normal | button
      },
      moreConfig: {
        type: Object,
        default () {
          return {};
        }
      },
      showResult:false,//显示表内计算结果
    },
    data() {
      return {
        allField: [],
        oldField: [],
        fieldModel: {},
        oldFieldModel: {},
        more_config: {
          col_relation: []
        }
      };
    },
    methods: {
      getFieldModel() {
        let valid = 0;
        let showsNum = 0;
        this.allField.map((item, index) => {
          let valids = this.$refs.fitem[index].getValid();
          console.log('字段校验', valids, item);
          if (item.display) {
            showsNum++;
            if (valids.valid) {
              valid++;
            }
          }
        });
        if (valid === showsNum) {
          console.log('表单校验通过', showsNum, valid, this.fieldModel);
          let model = {};
          switch (this.pageType) {
            case 'update':
              for (let key in this.fieldModel) {
                if (this.oldFieldModel[key] !== this.fieldModel[key]) {
                  model[key] = this.fieldModel[key];
                }
              }
              break;
            case 'add':
              for (let key in this.fieldModel) {
                if (this.fieldModel[key] === '' && key !== 'openid') {
                  delete this.fieldModel[key];
                }
              }
              model = this.fieldModel;
              break;
            default:
              model = this.fieldModel;
              break;
          }
          if (Object.keys(model).length > 0) {
            return model;
          } else {
            uni.showToast({
              title: '没有需要提交的数据',
              icon: 'none'
            });
            return false;
          }
        } else {
          console.log('表单校验失败', showsNum, valid, this.fieldModel);
          uni.showToast({
            title: '请填写完信息后，再尝试提交',
            icon: 'none'
          });
          return false;
        }
      },
      onValChange(e) {
        // 保存已经发生变化的字段值
        if (e.type === 'number' || e.type === 'digit') {
          e.value = Number(e.value);
        }
        this.fieldModel[e.column] = e.value;
        // console.log(e, this.deepClone(this.allField));
        const fieldModel = this.deepClone(this.fieldModel);
        this.allField = this.allField.map((item, index) => {
          // #ifdef H5
          if (item.redundant && item.redundant.func) {
            if (typeof item.redundant.func === 'string' && item.redundant.func.indexOf(e.column)) {
              const func = item.redundant.func
              const data = this.fieldModel
              const result = eval(`(${func})(data)`)
              // console.log(result,fieldModel);
              // console.log(func);
              this.$set(item, 'value', result)
              this.$set(this.fieldModel, item.column, result)
            }
          }
          // #endif
          item.display = item.isShowExp && item.isShowExp.length > 0 ? this.colItemShowExps(item, this
            .fieldModel) : item.display === false ? false : true;
          if (item.column === e.column) {
            item.value = e.value;
            if (item.type === 'Set') {
              item.option_list_v2 = e.option_list_v2;
            }
          }
          if (item.formulaShow) {
            let isIfShow = evaluatorTo(fieldModel, item.formulaShow);
            item.display = isIfShow;
          }
          if (!item.value && this.pageType === 'filter') {
            item.value = '全部'
          }
          return item;
        });
        if (e.bx_col_type === 'fk' && e.colData && typeof e.colData === 'object' && Array.isArray(e.colData) !==
          true && Object.keys(e.colData).length > 0) {
          //冗余
          this.allField = this.allField.map(item => {
            if (item.redundant && typeof item.redundant === 'object' && item.redundant.dependField ===
              e.column) {
              if (item.redundant.trigger === 'always') {
                item.value = e.colData[item.redundant.refedCol];
              } else if (item.redundant.trigger === 'isnull') {
                if (!item.value) {
                  item.value = e.colData[item.redundant.refedCol];
                }
              }
              this.fieldModel[item.column] = item.value;
              this.$emit('value-blur', this.fieldModel[item.column], this.fieldModel);
            }
            return item;
          });
        }
        this.$emit('value-blur', this.fieldModel);
      },
      onValBlur(e) {
        if (e.hasOwnProperty('value')) {
          this.fieldModel[e.column] = e.value;
          this.$emit('value-blur', e, this.fieldModel);
        }
      },
      chooseLocation(e) {
        this.allField = this.allField.map((item, index) => {
          if (item.column === 'latitude' && e.latitude) {
            item.value = e.latitude;
          }
          if (item.column === 'longitude' && e.longitude) {
            item.value = e.longitude;
          }
          this.fieldModel[item.column] = item.value;
          this.$set(this.allField, index, item);
          return item;
        });
        this.$emit('value-blur', this.fieldModel);
      },
      onReset() {
        if (Array.isArray(this.oldField) && this.oldField.length > 0) {
          this.allField = this.oldField.map((item, index) => {
            this.$refs.fitem[index].fieldData.value = item.value;
            if (this.pageType === 'filter') {
              item.value = '全部'
            }
            if (item.type === 'Set') {
              this.$refs.fitem[index].initSetOptions()
            }
            this.$set(this.allField, index, item);
            return item;
          });
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      fields: {
        deep: true,
        immediate: true,
        handler(newValue, oldValue) {
          if (Array.isArray(newValue) && newValue.length > 0) {
            if (this.allField.length === 0) {
              this.oldField = this.deepClone(newValue);
            }
            this.allField = newValue.map(item => {
              if (!item.value && this.pageType === 'filter') {
                item.value = '全部'
              }
              return item
            });
          }
        }
      },
      moreConfig: {
        handler(newValue, oldValue) {
          if (newValue) {
            this.more_config = this.deepClone(newval);
          }
        }
      }
    }
  };
</script>