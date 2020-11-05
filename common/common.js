export default {
  install (Vue, options) {
    Vue.prototype.pageTitle = '加载中…'   // 可以自定义变量
 
    Vue.prototype.getQueryString = function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    }
    Vue.prototype.colToLable = async function (serviceName, cols) {
      // 通知columns查询label(中文名)
      // let self = this
      let req = {
        serviceName: 'srvsys_service_columns_select',
        colNames: [
          'columns',
          'label'
        ],
        condition: [
          {
            'colName': 'service_name',
            'value': serviceName,
            'ruleType': 'eq'
          },
          {
            'colName': 'columns',
            'value': cols,
            'ruleType': 'in'
          }
        ],
        order: [
          {
            'colName': 'create_time',
            'orderType': 'asc'
          }
        ]
      }
      let data = await this.$http.post(this.$api.select, req)
      return data.data.data
    }
    Vue.prototype.getFooterBtns = function (e) {
      // type : "duplicate" | edit | delete | detail
      let btns = e
      let footerBtns = btns.filter((item) => item.permission === true && (item.button_type === 'edit' || item.button_type === 'delete' || item.button_type === 'deletedraft' || item.button_type === 'closeproc' || item.button_type === 'deleteproc' || item.button_type === 'startproc' || item.button_type === 'customize'))
      return footerBtns
    }
	
    Vue.prototype.selectOne = async function (srv, cond) { // 查询
      let self = this

      let req = {}
      req.serviceName = srv
      req.colNames = ['*']
      req.condition = []
      req.condition = cond
      // req.condition[1] = JSON.parse(JSON.stringify(condObj))
      req.order = [
        {
          'colName': 'id',
          'orderType': 'asc'
        }
      ]
      const response = await this.$http.post(self.$api.select, req)
      if (response.data.data) {
        return response.data.data[0]
      } else {
        return '查询失败'
      }
    }
    Vue.prototype.showLoading = function (ifShow) {
      let self = this
      if (ifShow) {
        self.$store.dispatch({
          type: 'showLoading'
        })
      } else {
        self.$store.dispatch({
          type: 'hideLoading'
        })
      }
    }
    Vue.prototype.getImageUrl = async function (fileNo) {
      let self = this
      let req = {}
      req.serviceName = 'srvsys_file_select'
      req.colNames = ['*']
      req.condition = []
      req.condition = [{
        'colName': 'file_no',
        'value': fileNo,
        'ruleType': 'eq'
      }]
      req.page = null
      req.order = null
      const response = await this.$http.post(self.$api.select, req)
      if (response.data.data) {
        let fileurl = response.data.data
        fileurl = fileurl.map((item) => {
          item._url = self.$api.getFilePath + item.fileurl
          return item
        })
        return fileurl
      } else {
        return '查询失败'
      }
    }

  
    Vue.prototype.deleteRow = async function (srv, cond) { // 删除数据
      let self = this
      let reqs = []
      let req = {}
      // [{"serviceName":"srvplm_qrcode_html_delete","condition":[{"colName":"id","ruleType":"in","value":"23"}]}]
      req.serviceName = srv
      req.condition = cond
      reqs.push(req)
      const response = await this.$http.post(self.$api.delete, reqs)
      if (response.data.state === 'SUCCESS') {
        return response.data.response
      } else {
        return '删除失败'
      }
    }
    Vue.prototype.getGridButton = function (datas, srv, conds) {
      let self = this
      let d = datas
      let headbut = {
        buttons: [],
        menus: [],
        showMenus: false
      }  // button type :  select | refresh | add | batch_delete | import | export | shrink | apply
      let newData = d.filter(item => item.permission === true && (item.button_type === 'select' || item.button_type === 'add' || item.button_type === 'apply' || item.button_type === 'import' || item.button_type === 'export') && item.client_type.indexOf('APP') !== -1)
      let butType = newData.map(item => item.button_type)
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].button_type === 'select') {
          let b = {
            type: 'search',
            url: '',
            cfg: {serviceName: self.listCfgs.serviceName, colType: 'select', pageType: 'selectlist'}
          }
          headbut.buttons.push(b)
        } else if (newData[i].button_type === 'add') {
          let b = {
            type: 'add',
            url: '',
            cfg: {
              path: '/add',
              query: {
                serviceName: self.listCfgs.serviceName,
                pageType: 'add',
                title: newData[i].service_view_name,
                foreignKey: conds
              }
            }
          }
          headbut.buttons.push(b)
        } else if (newData[i].button_type === 'apply') {
          let b = {
            type: 'add',
            url: '',
            cfg: {
              path: '/add',
              query: {
                serviceName: self.listCfgs.serviceName,
                pageType: 'apply',
                title: newData[i].service_view_name
              }
            }
          }
          headbut.buttons.push(b)
        } else {
          let b = {
            label: newData[i].button_name,
            type: 'warn',
            value: newData[i].button_type,
            url: '',
            cfg: []
          }
          headbut.menus.push(b)
        }
      }
      if (headbut.menus.length > 0) {
        headbut.showMenus = true
      } else {
        headbut.showMenus = false
      }
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: headbut
      })
      console.log(headbut, newData, butType)
    }
    Vue.prototype.toListDataCtr = async function (data, type, listType) { // 参数data:原始data; type:配置json
      // 根据表格配置 构造data
      // let self = this
      let typeCfg = type.type   // 表格类型
      let resData = data  // 原始data
      let cols = []
      let labs = []
      let req = []
      function colNamesArr (e) {
        // cols
        let list = e
        let arr = []
        for (let i in list) {
          if (list[i] !== '') {
            arr.push(list[i]) // 属性
              // arr.push(obj[i]); //值
          }
        }
        return arr.join()
      }
      cols = colNamesArr(type.content)
      // console.log('cols:')
      // console.log(cols)
      labs = await this.colToLable(type.serviceName, cols)
      // console.log(labs)
      if (typeCfg === '1') {
        // let Obj = resData.map(function (item, index) {
        let Obj = resData.map((item, index) => {
          let columnsCfg = type.content
          function colToL (c) {
            // cols
            let L = labs
            let arr = L.filter(item => item.columns === c)
            // console.log(arr)
            return arr[0] === undefined ? '' : arr[0].label
          }

          let a = {
            src: item[columnsCfg.Comp_img],
            key: item[columnsCfg.p_key],
            id: item.id,
            title: {
              value: item[columnsCfg.Comp_title],
              label: item[columnsCfg.Comp_title_label]
            },
            content: [
              [
                {
                  label: colToL(columnsCfg.Comp_subtitle),
                  value: item[columnsCfg.Comp_subtitle]
                }
              ],
              [
                {
                  label: colToL(columnsCfg.Comp_content_row_left),
                  value: item[columnsCfg.Comp_content_row_left]
                },
                {
                  label: colToL(columnsCfg.Comp_content_row_right),
                  value: item[columnsCfg.Comp_content_row_right]
                }
              ]
            ],
            footer: {
              linkText: '详情',
              columns: {
                label: colToL(columnsCfg.Comp_footer),
                value: item[columnsCfg.Comp_footer]
              }
            },
            data: item
          }
          // if(listType){
          //   if(listType === 'addchildlist'){}
          // }
          return a
        })
        req = Obj
      }
      // console.log(resData, req)
      return req
    }
    Vue.prototype.getValidators = function (vds, msg) { // 获取校验信息返回组件data
      if (vds !== null && msg !== null) {
        let str = vds
        let getStr = function (val, state, end) {
          if (val.length > state.length + end.length) {
            let s = val.indexOf(state)
            if (s === -1) {
              return ''
            } else {
              let nval = val.slice(s + state.length, val.length)
              let e = nval.indexOf(end)
              let str = nval.slice(0, e)
              if (e === -1) {
                str = nval.slice(0)
              }
              return str
            }
          } else {
            return ''
          }
        }
        let Validators = {}
        let reg = /required/gi
        Validators['max'] = getStr(str, 'ngMaxlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMaxlength=', ';')) : null
        Validators['min'] = getStr(str, 'ngMinlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMinlength=', ';')) : null
        Validators['reg'] = getStr(str, 'ngPattern=', ';')
        Validators['required'] = reg.test(str)
        Validators['msg'] = getStr(msg, 'ngPattern=', ';')
        Validators['isType'] = function (e) {
          let reg = new RegExp(getStr(str, 'ngPattern=', ';'))
          if (reg.test(e)) {
            let obj = {valid: reg.test(e)}
            return obj
          } else {
            let msgs = getStr(msg, 'ngPattern=', ';')
            msgs = msgs === '' ? '信息有误' : msgs
            let obj = {valid: reg.test(e), msg: msgs}
            return obj
          }
        }
        return Validators
      } else {
        return false
      }
    }
    Vue.prototype.getColData = async function (srv, srvType, pageType) { // 表单信息 srvType : add | update | list | detail | select
      // use_type: detail | proclist | list | treelist | detaillist | selectlist | addchildlist | updatechildlist | procdetaillist | add | update
      let self = this
      if (srv && srvType && pageType) {
        let len = srv.lastIndexOf('_')

        let serviceName = srv.slice(0, len) + '_'
        if (srvType === 'list' || srvType === 'detail') {
          serviceName += 'select'
        } else {
          serviceName += srvType
        }
        let cols = self.$store.getters.getSrvCol
        let nCols = cols.filter(item => item.service_name === serviceName && item.use_type === pageType)
        console.log('=====1', nCols)
        if (nCols.length === 0) {
          let req = this.selectRequestObjs()
          req.serviceName = 'srvsys_service_columnex_v2_select'
          req.colNames = ['*']
          req.condition = []
          let condObj = {}
          condObj['colName'] = 'service_name'
          condObj['ruleType'] = 'eq'
          condObj['value'] = serviceName
          req.condition[0] = JSON.parse(JSON.stringify(condObj))
          condObj['colName'] = 'use_type'
          condObj['ruleType'] = 'eq'
          condObj['value'] = pageType
          req.condition[1] = JSON.parse(JSON.stringify(condObj))
          req.order[0].colName = 'seq'
          req.order[0].orderType = 'asc'
          const response = await this.$http.post(self.$api.select, req)
          if (response.data.data) {
            console.log('=====2', response.data.data)
            response.data.data.use_type = pageType
            if ('rowButton' in response.data.data) {
              response.data.data._footerBtns = this.getFooterBtns(response.data.data.rowButton)
            }
            self.$store.commit('setSrvCol', response.data.data)
            // 第一次拿到，缓存
            return response.data.data
          }
        } else {
          console.log('=====3', nCols)
          return nCols[0]
        }
      } else {
        return false
      }
    }
  }
}
