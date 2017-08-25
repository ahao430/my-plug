(function (name, factory) {
  if (typeof define === 'function' && define.amd) {
    define([name], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory; // Node
  } else {
    window[name] = factory(); // Browser global
  }
})('Util', function(){
  var obj = {}

  obj.clone = function(oldObj){
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var i in oldObj) {
      newObj[i] = obj.clone(oldObj[i]);
    }
    return newObj;
  }
  obj.extend = function(){
    var args = arguments;
    if (args.length < 2) return;
    var temp = obj.clone(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
      for (var i in args[n]) {
        temp[i] = args[n][i];
      }
    }
    return temp;
  }

  var toastDefaults = {
    msg: '',
    type: 'normal',
    duration: 1000,
    from: 'top',
    speed: 500,
    opacity: 0.9,
    fontSize: '16px',
    padding: '10px',
    callback: null
  }
  obj.toast = function(opt) {
    var defaults = toastDefaults

    opt = obj.extend(defaults, opt)
    // console.log(obj.lastToastOpt, opt)
    if (JSON.stringify(opt) === JSON.stringify(obj.lastToastOpt)) return false

    obj.lastToastOpt = opt

    var bg
    switch (opt.type) {
      case 'success':
        bg = 'rgba(0,0,0,' + opt.opacity + ')'
        break
      case 'warn':
        bg = 'rgba(160,137,100,' + opt.opacity + ')'
        break
      case 'error':
        bg = 'rgba(255,0,0,'+ opt.opacity +')'
        break
      default:
        bg = 'rgba(0,0,0,'+ opt.opacity +')'
    }

    var startPos
    if (opt.from === 'top') {
      startPos = 'top: -100%;'
    } else {
      startPos = 'bottom: -100%;'
    }

    var div = document.createElement('div')
    div.style.cssText = 'background: rgba(0,0,0,0.5);position: fixed; z-index: 10000;' + startPos + ' margin: 0 auto; left: 50%; transform: translateX(-50%); font-size: ' + opt.fontSize +'; padding: '+ opt.padding +'; line-height: 1.3; transition: all ' + (opt.speed/1000) + 's ease-in-out; border-radius: 10px; color: #fff; background:' + bg + ';'
    div.innerHTML = opt.msg;
    document.body.appendChild(div)

    var timer1, timer2, timer3

    if (opt.duration === 0) {
      show()
    } else {
      setTimeout(function(){
        show()
      }, 0);
    }



    function show(){
      if (opt.from === 'top') {
        div.style.top = '100px'
      } else {
        div.style.bottom = '100px'
      }
      div.style.opacity = 1

      timer1 = setTimeout(function(){
        // 进入过渡结束
        timer1 = null
        if (opt.duration !== 0) {
          timer2 = setTimeout(function(){
            // 显示结束
            if (opt.from === 'top') {
              div.style.top = '-100%';
            } else {
              div.style.bottom = '-100%';
            }
            timer2 = null
            timer3 = setTimeout(function(){
              // 消失过度结束，清除div
              document.body.removeChild(div);
              timer3 = null
              obj.lastToastOpt = null
              if(typeof(opt.callback) === 'function'){
                opt.callback()
              }
            }, opt.speed)
          }, opt.duration)
        } else {
          div.addEventListener('click', function(){
            document.body.removeChild(div)
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            obj.lastToastOpt = null
            if(typeof(opt.callback) === 'function'){
              opt.callback()
            }
            // console.log(obj.lastToastOpt)
          })
        }
      }, opt.speed)
    }
  }
  obj.toast.setDefaults = function(def){
    toastDefaults = Object.assign(toastDefaults, def)
  }
  obj.toast.defaults = function(){
    return toastDefaults
  }

  /* 性能，节流函数*/
  obj.debounce = function(fn, wait){
    var timeoutID = null;

    return function() {
      clearTimeout(timeoutID);

      var args = arguments;
      timeoutID = setTimeout(function() {
        fn.apply(this, args);
      }, wait);
    };
  }
  obj.throttle = function(fn, wait) {
    var last = 0;
    return function(){
      var curr = +new Date()
      if (curr - last > wait){
        fn.apply(this, arguments)
        last = curr
      }
    }
  };

  /* url */
  obj.getUrlParam = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
       return decodeURIComponent(r[2]);
    } else {
       return null;
    }
  }

  /* cookie */
  obj.setCookie = function(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
  }
  obj.getCookie = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
  }
  obj.delCookie = function(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
  }

  /* 操作class */
  obj.hasClass = function(el, cls){
    return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  obj.addClass = function(el, cls){
    if (!obj.hasClass(el, cls)) el.className += " " + cls;
  }
  obj.removeClass = function(el, cls){
    if (obj.hasClass(el, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
  obj.toggleClass = function(el,cls){
    if(obj.hasClass(el,cls)){
      obj.removeClass(el, cls);
    }else{
      obj.addClass(el, cls);
    }
  }
  obj.toggleActive = function(ul, cls){
    cls = cls || 'active'
    ul.addEventListener('click', function(e){
      var li = e.target
      if (li.parentNode = ul) {
        if (obj.hasClass(li, cls)) return;
        Array.prototype.forEach.call(ul.children, function(li){
          obj.removeClass(li, cls)
        })
        obj.addClass(li, cls)
      }
    })
  }

  /* formatDate */
  obj.formatDate = function(date, fmt){
    var o = {
      "M+" : this.getMonth()+1, //月份
      "d+" : this.getDate(), //日
      "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
      "H+" : this.getHours(), //小时
      "m+" : this.getMinutes(), //分
      "s+" : this.getSeconds(), //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S" : this.getMilliseconds() //毫秒
    };
    var week = {
      "0" : "/u65e5",
      "1" : "/u4e00",
      "2" : "/u4e8c",
      "3" : "/u4e09",
      "4" : "/u56db",
      "5" : "/u4e94",
      "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }

  /* 事件 */
  obj.Event = function(){
    this._listener = {};
  }
  obj.Event.prototype = {
    constructor: obj.Event,
    add: function(name, fn){
      if(typeof name === 'string' && typeof fn === 'function'){
        //如果不存在name，就新建一个
        if(typeof this._listener[name] === 'undefined'){
          this._listener[name] = [fn];
        }
        //否则，直接往相应actinoName里面塞
        else{
          this._listener[name].push(fn);
        }
      }
    },
    trigger: function(name){
      var arr = this._listener[name];
      //触发一系列name里的函数
      if(arr instanceof Array){
        for(var i = 0, len = arr.length; i < len; i++){
          if(typeof arr[i] === 'function'){
            arr[i]();
          }
        }
      }
      arr = null;
    },
    remove: function(name, fn){
      var arr = this._listener[name];
      if(typeof name === 'string' && arr instanceof Array){
        if(typeof fn === 'function'){
          //清除name中对应的fn方法
          for(var i=0, len = arr.length; i < len; i++){
            if(arr[i] === fn){
              this._listener[name].splice(i,1);
            }
          }
        }
      }
      arr = null;
    },
    removeAll: function(name, fn){
      var arr = this._listener[name]
      if(typeof name === 'string' && arr instanceof Array){
        this._listener[name] = []
      }
      arr = null
    }
  };

  return obj
})
