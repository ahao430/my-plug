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

  obj.toast = function(opt) {
    var defaults = {
      msg: '',
      type: 'normal',
      duration: 1000,
      from: 'top',
      speed: 500,
      opacity: 0.7
    }
    opt = Object.assign(defaults, opt)
    // console.log(obj.lastToastOpt, opt)
    if (JSON.stringify(opt) === JSON.stringify(obj.lastToastOpt)) return false

    obj.lastToastOpt = opt

    var bg
    switch (opt.type) {
      case 'success':
        bg = 'rgba(0,255,0,' + opt.opacity + ')'
        break;
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
    div.style.cssText = 'background: rgba(0,0,0,0.5);position: fixed; ' + startPos + ' margin: 0 auto; left: 50%; transform: translateX(-50%); font-size: 16px; padding: 10px; line-height: 1.3; transition: all ' + (opt.speed/1000) + 's ease-in-out; border-radius: 10px; color: #fff; background:' + bg + ';'
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
            }, opt.speed)
          }, opt.duration)
        } else {
          div.addEventListener('click', function(){
            document.body.removeChild(div)
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            obj.lastToastOpt = null
            // console.log(obj.lastToastOpt)
          })
        }
      }, opt.speed)
    }
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
    if (!this.hasClass(el, cls)) el.className += " " + cls;
  }
  obj.removeClass = function(el, cls){
    if (hasClass(el, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
  obj.toggleClass = function(el,cls){
    if(hasClass(el,cls)){
      removeClass(el, cls);
    }else{
      addClass(el, cls);
    }
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

  return obj
})
