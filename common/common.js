export default {
  install (Vue, options) {
    Vue.prototype.pageTitle = '加载中…'   // 可以自定义变量
    Vue.prototype.getQueryString = function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    }
    Vue.prototype.getFooterBtns = function (e) {
      // type : "duplicate" | edit | delete | detail
      let btns = e
      let footerBtns = btns.filter((item) => item.permission === true && (item.button_type === 'edit' || item.button_type === 'delete' || item.button_type === 'deletedraft' || item.button_type === 'closeproc' || item.button_type === 'deleteproc' || item.button_type === 'startproc' || item.button_type === 'customize'))
      return footerBtns
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
  }
}
