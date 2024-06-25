<template>
  <view>
    <grid-table :table-data="tableData"></grid-table>
  </view>
</template>

<script>
  import gridTable from './grid-table/index.vue'
  export default {
    components: {
      gridTable
    },
    data() {
      return {
        tableData: {
          thead: [{
            name: '序号'
          }, {
            name: '姓名'
          }, {
            name: '年龄'
          }, {
            name: '专业'
          }],
          tbody: [{
              value: '1',
              color: 'red',
              bgColor: '#ace',
              align: 'left'
            },
            {
              value: '张牧之'
            },
            {
              value: '25'
            },
            {
              value: ''
            },
            {
              value: '2'
            },
            {
              value: '赵坤明'
            },
            {
              value: '33'
            },
            {
              value: '打篮球,三分贼强~',
              gridArea: '2/4/4/4'
            },
            {
              value: '3'
            },
            {
              value: '张牧之'
            },
            {
              value: '25'
            },
            {
              value: ''
            },
            {
              value: '4'
            },
            {
              value: '赵坤明'
            },
            {
              value: '33'
            },
            {
              value: '踢足球，倒挂金钩！',
              gridArea: '4/4/6/4',
              isFlex: true
            },
          ]
        }
      }
    },
    methods: {

    }
  }
</script>

<style>

</style>