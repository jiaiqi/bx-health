### field.type: 表单元素类型
[x] input `String` 
[x] digit `Float`  `//在字段的more_config中配置了max和min，并且slider属性配置为true之后,填写方式将不再是吊起键盘，而是使用滑块操作(可以长按)`
[x] number `Integer` `//在字段的more_config中配置了max和min，并且slider属性配置为true之后,填写方式将不再是吊起键盘，而是使用滑块操作(可以长按)`
[x] image 
```js
 /**
	* 单选多选默认展示为按钮样式(圆角按钮样式)
	* 当在表单上绑定option-mode属性值为`normal`时显示为普通单选按钮(选中状态为圆圈中间有个点)/普通多选按钮(选中状态为圆角矩形中间有个对号)
	* 当多checkbox-group/radio-group上绑定了serialChar(序号)字段时，单选/多选按钮的圆圈/圆角矩形中心会显示对应选项序号字段的值
	*/
```
[x] radio  
[x] radioFk
[ ] checkbox `max:最多勾选数量，多选按钮组配置max则已选达到max时显示提示，继续选不会选中；`
[x] checkboxFk
[x] set `Selector`
[x] richText `textarea` 暂时使用textarea弹窗
- treeSelector
[x] date `YYYY-MM-DD`
- dateTime `YYYY-MM-DD hh:mm:ss`
[x] time `hh:mm:ss`
- Time `hh:mm`
- file
- fileList
- 