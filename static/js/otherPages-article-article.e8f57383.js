(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["otherPages-article-article"],{"0ec7":function(t,e,n){"use strict";(function(t){var r=n("4ea4");n("d81d"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("96cf");var i=r(n("1da1")),a=r(n("b863")),o={components:{articleList:a.default},data:function(){return{currentNav:3,pageInfo:{pageNo:1,rownumber:10,total:0},navList:[{iconPath:"home",selectedIconPath:"home-fill",text:"首页",isDot:!0,customIcon:!1},{iconPath:"heart",selectedIconPath:"heart-fill",text:"健康",customIcon:!1},{iconPath:"https://cdn.uviewui.com/uview/common/min_button.png",selectedIconPath:"https://cdn.uviewui.com/uview/common/min_button_select.png",text:"记录",midButton:!0,customIcon:!1},{iconPath:"grid",selectedIconPath:"grid-fill",text:"发现",customIcon:!1},{iconPath:"account",selectedIconPath:"account-fill",text:"我的",isDot:!1,customIcon:!1}],keyword:"",showType:0,tabList:[]}},computed:{},methods:{clickListItem:function(e){t.log(e),uni.navigateTo({url:"/pages/articleDetail/articleDetail?content_no="+e.content_no})},getTabList:function(){var t=this;return(0,i.default)(regeneratorRuntime.mark((function e(){var n,r,i,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n="daq",r=t.getServiceUrl(n,"srvdaq_page_item_tablist_select","select"),i={serviceName:"srvdaq_page_item_tablist_select",colNames:["*"],page:{pageNo:1,rownumber:5}},e.next=5,t.$http.post(r,i);case 5:a=e.sent,"SUCCESS"===a.data.state&&(t.tabList=a.data.data.map((function(t){return{title:t.tablist_name,no:t.no}})));case 7:case"end":return e.stop()}}),e)})))()},searchWithKeywords:function(){var t={keyword:this.keyword,cond:[{colName:"no",ruleType:"eq",value:this.tabList[this.showType].no}]};this.$refs["articleList"][this.showType].getListData(1,t)},switchNav:function(t){return 0===t||(1===t?uni.redirectTo({url:"/pages/home/home",fail:function(){uni.navigateTo({url:"/archivesPages/old-home/old-home"})}}):2===t||3===t&&uni.redirectTo({url:"/pages/article/article"})),!0},changeShowType:function(t){this.showType=t},onChange:function(t){var e={keyword:"",cond:[{colName:"no",ruleType:"eq",value:this.tabList[this.showType].no}]};this.showType=t.detail.current,this.$refs["articleList"][t.detail.current].getListData(1,e)}},mounted:function(){this.getTabList()},onLoad:function(){}};e.default=o}).call(this,n("5a52")["default"])},"112d":function(t,e,n){var r=n("24fb");e=r(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uview样式 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.u-badge[data-v-4d072e0b]{display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;line-height:%?24?%;padding:%?4?% %?8?%;-webkit-border-radius:%?100?%;border-radius:%?100?%;z-index:9}.u-badge--bg--primary[data-v-4d072e0b]{background-color:#2979ff}.u-badge--bg--error[data-v-4d072e0b]{background-color:#fa3534}.u-badge--bg--success[data-v-4d072e0b]{background-color:#19be6b}.u-badge--bg--info[data-v-4d072e0b]{background-color:#909399}.u-badge--bg--warning[data-v-4d072e0b]{background-color:#f90}.u-badge-dot[data-v-4d072e0b]{height:%?16?%;width:%?16?%;-webkit-border-radius:%?100?%;border-radius:%?100?%;line-height:1}.u-badge-mini[data-v-4d072e0b]{-webkit-transform:scale(.8);transform:scale(.8);-webkit-transform-origin:center center;transform-origin:center center}.u-info[data-v-4d072e0b]{background-color:#909399;color:#fff}',""]),t.exports=e},1846:function(t,e,n){"use strict";var r=n("aff4"),i=n.n(r);i.a},"1deb":function(t,e,n){var r=n("24fb");e=r(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uview样式 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */uni-view[data-v-bec4b458],\r\nuni-scroll-view[data-v-bec4b458]{-webkit-box-sizing:border-box;box-sizing:border-box}[data-v-bec4b458]::-webkit-scrollbar,[data-v-bec4b458]::-webkit-scrollbar,[data-v-bec4b458]::-webkit-scrollbar{display:none;width:0!important;height:0!important;-webkit-appearance:none;background:transparent}.u-scroll-box[data-v-bec4b458]{position:relative}uni-scroll-view[data-v-bec4b458]  ::-webkit-scrollbar{display:none;width:0!important;height:0!important;-webkit-appearance:none;background:transparent}.u-scroll-view[data-v-bec4b458]{width:100%;white-space:nowrap;position:relative}.u-tab-item[data-v-bec4b458]{position:relative;display:inline-block;text-align:center;-webkit-transition-property:background-color,color;transition-property:background-color,color}.u-tab-bar[data-v-bec4b458]{position:absolute;bottom:0}.u-tabs-scorll-flex[data-v-bec4b458]{\r\ndisplay:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;\r\n-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between}',""]),t.exports=e},"23c0":function(t,e,n){var r=n("112d");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var i=n("4f06").default;i("70328093",r,!0,{sourceMap:!1,shadowMode:!1})},"48a5":function(t,e,n){"use strict";n("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r={name:"u-badge",props:{type:{type:String,default:"error"},size:{type:String,default:"default"},isDot:{type:Boolean,default:!1},count:{type:[Number,String]},overflowCount:{type:Number,default:99},showZero:{type:Boolean,default:!1},offset:{type:Array,default:function(){return[20,20]}},absolute:{type:Boolean,default:!0},fontSize:{type:[String,Number],default:"24"},color:{type:String,default:"#ffffff"},bgColor:{type:String,default:""},isCenter:{type:Boolean,default:!1}},computed:{boxStyle:function(){var t={};return this.isCenter?(t.top=0,t.right=0,t.transform="translateY(-50%) translateX(50%)"):(t.top=this.offset[0]+"rpx",t.right=this.offset[1]+"rpx",t.transform="translateY(0) translateX(0)"),"mini"==this.size&&(t.transform=t.transform+" scale(0.8)"),t},showText:function(){return this.isDot?"":this.count>this.overflowCount?"".concat(this.overflowCount,"+"):this.count},show:function(){return 0!=this.count||0!=this.showZero}}};e.default=r},"48e7":function(t,e,n){"use strict";n.r(e);var r=n("48a5"),i=n.n(r);for(var a in r)"default"!==a&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=i.a},5757:function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.show?n("v-uni-view",{staticClass:"u-badge",class:[t.isDot?"u-badge-dot":"","mini"==t.size?"u-badge-mini":"",t.type?"u-badge--bg--"+t.type:""],style:[{top:t.offset[0]+"rpx",right:t.offset[1]+"rpx",fontSize:t.fontSize+"rpx",position:t.absolute?"absolute":"static",color:t.color,backgroundColor:t.bgColor},t.boxStyle]},[t._v(t._s(t.showText))]):t._e()},a=[]},6409:function(t,e,n){"use strict";n.r(e);var r=n("7395"),i=n("fe5c");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("74f4");var o,c=n("f0c5"),s=Object(c["a"])(i["default"],r["b"],r["c"],!1,null,"8a7f004a",null,!1,r["a"],o);e["default"]=s.exports},7395:function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var r={uTabs:n("cec5").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"article-wrap"},[n("v-uni-view",{staticClass:"header"},[t.tabList.length>1?n("v-uni-view",{staticClass:"title"},[n("u-tabs",{attrs:{name:"title",list:t.tabList,"is-scroll":!0,current:t.showType},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.changeShowType.apply(void 0,arguments)}}})],1):t._e()],1),n("v-uni-swiper",{staticClass:"container",attrs:{current:t.showType},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChange.apply(void 0,arguments)}}},t._l(t.tabList,(function(e,r){return n("v-uni-swiper-item",{key:r,staticClass:"swiper-item"},[n("article-list",{ref:"articleList",refInFor:!0,staticClass:"article-list",attrs:{tabNo:e.no},on:{touchmove:function(e){e.stopPropagation(),e.preventDefault(),arguments[0]=e=t.$handleEvent(e)},clickListItem:function(e){arguments[0]=e=t.$handleEvent(e),t.clickListItem.apply(void 0,arguments)}}})],1)})),1)],1)},a=[]},"74f4":function(t,e,n){"use strict";var r=n("b15d"),i=n.n(r);i.a},"7a46":function(t,e,n){var r=n("24fb");e=r(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uview样式 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.article-wrap[data-v-8a7f004a]{width:100%;height:100vh}.article-wrap .header[data-v-8a7f004a]{height:%?150?%;width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#fff;border:1px solid #f1f1f1;overflow-y:hidden;padding-top:%?10?%}.article-wrap .header .u-search[data-v-8a7f004a]{width:95%;margin:0 auto}.article-wrap .header .title[data-v-8a7f004a]{width:100%;display:-webkit-box;display:-webkit-flex;display:flex;overflow-y:scroll}.article-wrap .header .title .u-tabs[data-v-8a7f004a]{width:calc(100vw - %?40?%);margin:0 auto}.article-wrap .header .title .tab-item[data-v-8a7f004a]{-webkit-box-flex:1;-webkit-flex:1;flex:1;margin-right:%?10?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;padding:%?10?% 0;min-width:%?120?%}.article-wrap .header .title .tab-item .activeTitle[data-v-8a7f004a]{color:#0081ff}.article-wrap .header .title .tab-item .hr[data-v-8a7f004a]{border:2px solid #fff;margin:%?5?%;width:%?30?%}.article-wrap .header .title .tab-item .activeHr[data-v-8a7f004a]{border:2px solid #0081ff}.article-wrap uni-swiper[data-v-8a7f004a]{width:100%;height:calc(100vh - %?260?%);background:#fff}.article-wrap uni-swiper-item[data-v-8a7f004a]{width:100%;height:100%}',""]),t.exports=e},aff4:function(t,e,n){var r=n("1deb");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var i=n("4f06").default;i("09dfd66d",r,!0,{sourceMap:!1,shadowMode:!1})},b15d:function(t,e,n){var r=n("7a46");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var i=n("4f06").default;i("433ccb50",r,!0,{sourceMap:!1,shadowMode:!1})},b9e0:function(t,e,n){"use strict";n.r(e);var r=n("c883"),i=n.n(r);for(var a in r)"default"!==a&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=i.a},c616:function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var r={uBadge:n("d7a0").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"u-tabs",style:{background:t.bgColor}},[n("v-uni-view",{attrs:{id:t.id}},[n("v-uni-scroll-view",{staticClass:"u-scroll-view",attrs:{"scroll-x":!0,"scroll-left":t.scrollLeft,"scroll-with-animation":!0}},[n("v-uni-view",{staticClass:"u-scroll-box",class:{"u-tabs-scorll-flex":!t.isScroll}},[t._l(t.list,(function(e,r){return n("v-uni-view",{key:r,staticClass:"u-tab-item u-line-1",style:[t.tabItemStyle(r)],attrs:{id:"u-tab-item-"+r},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.clickTab(r)}}},[n("u-badge",{attrs:{count:e[t.count]||e["count"]||0,offset:t.offset,size:"mini"}}),t._v(t._s(e[t.name]||e["name"]))],1)})),t.showBar?n("v-uni-view",{staticClass:"u-tab-bar",style:[t.tabBarStyle]}):t._e()],2)],1)],1)],1)},a=[]},c883:function(t,e,n){"use strict";var r=n("4ea4");n("a9e3"),n("ac1f"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("96cf");var i=r(n("1da1")),a={name:"u-tabs",props:{isScroll:{type:Boolean,default:!0},list:{type:Array,default:function(){return[]}},current:{type:[Number,String],default:0},height:{type:[String,Number],default:80},fontSize:{type:[String,Number],default:30},duration:{type:[String,Number],default:.5},activeColor:{type:String,default:"#2979ff"},inactiveColor:{type:String,default:"#303133"},barWidth:{type:[String,Number],default:40},barHeight:{type:[String,Number],default:6},gutter:{type:[String,Number],default:30},bgColor:{type:String,default:"#ffffff"},name:{type:String,default:"name"},count:{type:String,default:"count"},offset:{type:Array,default:function(){return[5,20]}},bold:{type:Boolean,default:!0},activeItemStyle:{type:Object,default:function(){return{}}},showBar:{type:Boolean,default:!0},barStyle:{type:Object,default:function(){return{}}},itemWidth:{type:[Number,String],default:"auto"}},data:function(){return{scrollLeft:0,tabQueryInfo:[],componentWidth:0,scrollBarLeft:0,parentLeft:0,id:this.$u.guid(),currentIndex:this.current,barFirstTimeMove:!0}},watch:{list:function(t,e){var n=this;t.length!==e.length&&(this.currentIndex=0),this.$nextTick((function(){n.init()}))},current:{immediate:!0,handler:function(t,e){var n=this;this.$nextTick((function(){n.currentIndex=t,n.scrollByIndex()}))}}},computed:{tabBarStyle:function(){var t={width:this.barWidth+"rpx",transform:"translate(".concat(this.scrollBarLeft,"px, -100%)"),"transition-duration":"".concat(this.barFirstTimeMove?0:this.duration,"s"),"background-color":this.activeColor,height:this.barHeight+"rpx","border-radius":"".concat(this.barHeight/2,"px")};return Object.assign(t,this.barStyle),t},tabItemStyle:function(){var t=this;return function(e){var n={height:t.height+"rpx","line-height":t.height+"rpx","font-size":t.fontSize+"rpx","transition-duration":"".concat(t.duration,"s"),padding:t.isScroll?"0 ".concat(t.gutter,"rpx"):"",flex:t.isScroll?"auto":"1",width:t.$u.addUnit(t.itemWidth)};return e==t.currentIndex&&t.bold&&(n.fontWeight="bold"),e==t.currentIndex?(n.color=t.activeColor,n=Object.assign(n,t.activeItemStyle)):n.color=t.inactiveColor,n}}},methods:{init:function(){var t=this;return(0,i.default)(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$uGetRect("#"+t.id);case 2:n=e.sent,t.parentLeft=n.left,t.componentWidth=n.width,t.getTabRect();case 6:case"end":return e.stop()}}),e)})))()},clickTab:function(t){t!=this.currentIndex&&this.$emit("change",t)},getTabRect:function(){for(var t=uni.createSelectorQuery().in(this),e=0;e<this.list.length;e++)t.select("#u-tab-item-".concat(e)).fields({size:!0,rect:!0});t.exec(function(t){this.tabQueryInfo=t,this.scrollByIndex()}.bind(this))},scrollByIndex:function(){var t=this,e=this.tabQueryInfo[this.currentIndex];if(e){var n=e.width,r=e.left-this.parentLeft,i=r-(this.componentWidth-n)/2;this.scrollLeft=i<0?0:i;var a=e.left+e.width/2-this.parentLeft;this.scrollBarLeft=a-uni.upx2px(this.barWidth)/2,1==this.barFirstTimeMove&&setTimeout((function(){t.barFirstTimeMove=!1}),100)}}},mounted:function(){this.init()}};e.default=a},cec5:function(t,e,n){"use strict";n.r(e);var r=n("c616"),i=n("b9e0");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("1846");var o,c=n("f0c5"),s=Object(c["a"])(i["default"],r["b"],r["c"],!1,null,"bec4b458",null,!1,r["a"],o);e["default"]=s.exports},d7a0:function(t,e,n){"use strict";n.r(e);var r=n("5757"),i=n("48e7");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("da89");var o,c=n("f0c5"),s=Object(c["a"])(i["default"],r["b"],r["c"],!1,null,"4d072e0b",null,!1,r["a"],o);e["default"]=s.exports},da89:function(t,e,n){"use strict";var r=n("23c0"),i=n.n(r);i.a},fe5c:function(t,e,n){"use strict";n.r(e);var r=n("0ec7"),i=n.n(r);for(var a in r)"default"!==a&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=i.a}}]);