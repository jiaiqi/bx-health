### DataPicker Props

| 属性名	| 类型					| 可选值		| 默认值	 | 说明|
| ----	      | ----	| ----		| ----	 | ----		|
| v-model	| String/ Number| -|-	   |绑定数据	  |
| localdata	| Array	| -		|-	   |数据，详情 |
| preload	| Boolean	| true/false | false |预加载数据 |
|step-searh	| Boolean	|true/false	|true	 |分步查询时，点击节点请求数据 |
|step-search-url| String	|	-	|-	 |分步查询时，动态加载云端数据url格式，https://xxx.com/{parentValue}(当前版本暂不支持，下版支持)	|
|self-field	|String	|	-	|-	 |分步查询时当前字段名称	 |
|parent-field	|String		|	-	|	- |分步查询时父字段名称 |
|collection			|String			|						|			 |表名。支持输入多个表名，用 , 分割	 |
|field					|String			|						|			 |查询字段，多个字段用 , 分割		 |
|where					|String			|						|			 |查询条件，内容较多，另见jql文档：详情	 |
|orderby				|String			|											 |排序字段及正序倒叙设置	 |
|popup-title	|String		|	| |弹出层标题		 |

> tip
> `collection/where/orderby` 和` <unicloud-db>` 的用法一致，[详情](https://uniapp.dcloud.net.cn/uniCloud/unicloud-db)

### DataPicker Events

| 事件称名     | 类型      |说明           |
| ----		    | ----	    | ----          |
|@change			|EventHandle|选择完成时触发 {detail: {value}}	|
|@nodeclick		|EventHandle|节点被点击时触发	|
|@stepsearch	|EventHandle|动态加载节点数据前触发(当前版本暂不支持，下版支持)	|
|@popupopened	|EventHandle|弹出层弹出时触发	|
|@popupclosed	|EventHandle|弹出层关闭时触发	|

## 基本用法

### 云端数据

> warning 注意事项
>
> - 云端数据需要关联服务空间
> - 下面示例中使用的表 opendb-city-china(中国城市省市区数据，含港澳台), 在[uniCloud控制台](https://unicloud.dcloud.net.cn/)使用opendb创建，[详情](https://gitee.com/dcloud/opendb)

```html
<template>
  <view>
    <uni-data-picker placeholder="请选择地址" popup-title="请选择城市" collection="opendb-city-china" field="code as value, name as text" orderby="value asc" :step-searh="true" :self-field="code" parent-field="parent_code"
 @change="onchange" @nodeclick="onnodeclick">
    </uni-data-picker>
  </view>
</template>
```

```js
  export default {
    data() {
      return {
      }
    },
    methods: {
      onchange(e) {
        const value = e.detail.value
      },
      onnodeclick(node) {}
    }
  }
```

### 本地数据

```html
<template>
  <view>
    <uni-data-picker :localdata="items" popup-title="请选择班级" @change="onchange" @nodeclick="onnodeclick"></uni-data-picker>
  </view>
</template>
```

```js
  export default {
    data() {
      return {
        items: [{
          text: "一年级",
          value: "1-0",
          children: [
            {
              text: "1.1班",
              value: "1-1"
            },
            {
              text: "1.2班",
              value: "1-2"
            }
          ]
        },
        {
          text: "二年级",
          value: "2-0"
        },
        {
          text: "三年级",
          value: "3-0"
        }]
      }
    },
    methods: {
      onchange(e) {
        const value = e.detail.value
      },
      onnodeclick(node) {
      }
    }
  }
```

### 自定义solt

```html
<uni-data-picker v-slot:default="{data, error, options}" popup-title="请选择所在地区">
  <view v-if="error" class="error">
    <text>{{error}}</text>
  </view>
  <view v-else-if="data.length" class="selected">
    <view v-for="(item,index) in data" :key="index" class="selected-item">
      <text>{{item.text}}</text>
    </view>
  </view>
  <view v-else>
    <text>请选择</text>
  </view>
</uni-data-picker>
```

> warning 注意事项 localdata 和 collection 同时配置时，localdata 优先

## 完整示例

``` html
<template>
    <view class="container">
        <uni-data-picker @change="onchange" @nodeclick="onnodeclick" @stepsearch="onstepsearch" @popupopened="onpopupopened"
         @popupclosed="onpopupclosed">
        </uni-data-picker>
    </view>
</template>
```

```js
    export default {
        data() {
            return {
                count: 1
            }
        },
        methods: {
            onchange(e) {
                const value = e.detail.value
            },
            onnodeclick(node) {
                // node 当前点击节点
            },
            onstepsearch(node, resolve) {
                if (node.level === 0) {
                    return resolve([{
                        text: 'region1',
                        value: 'region1'
                    }, {
                        text: 'region2',
                        value: 'region1'
                    }]);
                }

                var hasChild;
                if (node.text === 'region1') {
                    hasChild = true;
                } else if (node.text === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }

                setTimeout(() => {
                    var data;
                    if (hasChild) {
                        data = [{
                            text: 'zone' + this.count++,
                            value: 'zone' + this.count++
                        }, {
                            text: 'zone' + this.count++,
                            value: 'zone' + this.count++
                        }];
                    } else {
                        data = [];
                    }

                    resolve(data);
                }, 500);
            },
            onpopupopened() {},
            onpopupclosed() {}
        }
    }
```