# Util常用函数封装
...
## toast
    Util.toast({
      msg: '',
      type: 'normal',
      duration: 1000,
      from: 'top',
      speed: 500,
      opacity: 0.7
    })
### 配置项
#### msg
设置内容字符串，可以包含html标签，默认空
#### type
设置toast类型，默认normal。success成功绿色背景，warn棕色警告，error红色错误，其他为灰色背景
#### duration
设置toast存在时间，默认1000ms，设置0不自动消失，需手动点击消失
#### from
设置从上方还是下方飞入，默认top。duration为0时不飞入，直接显示和消失
#### speed
设置toast元素的transition时间，默认500ms
#### opacity
设置背景不透明度，默认0.7
### 修改默认配置
    Util.toast.setDefaults(def)
### 查看当前默认配置
    Util.toast.defaults()
...
## debounce和throttle
简单实现防抖和节流
    Util.debounce(function, wait)
    Util.throttle(function, wait)
...
## url操作
    Util.getUrlParam(name)
...
## cookie操作
    Util.setCookie(name, value)
    Util.getCookie(name, value)
    Util.delCookie(name)
...
## class操作 
    Util.hasClass(el, className)
    Util.addClass(el, className)
    Util.removeClass(el, className)
    Util.toggleClass(el, className)
    Util.toggleActive(ul, activeClass) 
    设置ul子元素点击选中active，其他取消active，不填写activeClass默认'active'
...
## 日期时间格式化
    Util.formatDate(date, format)
### 日期格式
M：月
d：日
h：时（12小时制）
H：时（24小时制）
m：分
s：秒
q：季度
S：毫秒
   

