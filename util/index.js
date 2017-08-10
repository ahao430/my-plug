(function (name, factory) {
  if (typeof define === 'function' && define.amd) {
    define([name], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory; // Node
  } else {
    factory(window[name]); // Browser global
  }
})('util', function(){
  var tip = function(html, type, time) {
    var tipid = 'tipMessage';
    var timer1, timer2, timer3

    if (lastTip = document.getElementById(tipid)) {
      clearTimeout(obj.timer1);
      clearTimeout(obj.timer2);
      clearTimeout(obj.timer3);
      document.body.removeChild(lastTip);
    }
    
    var delay = (time + 600) || 3600
    var tip = document.createElement('div')
    var color = '#fff';
    if (type) {
      if (type === 'success') {
        color = '#33FD00';
      } else if (type === 'fail') {
        color = '#f00';
      }
    }
    tip.style.cssText = 'background: rgba(0,0,0,0.5);position: fixed; top: -100%; margin: 0 auto; left: 50%; transform: translateX(-50%); font-size: 16px; padding: 10px; line-height: 1.3; transition: all 0.3s linear; border-radius: 10px; color:' + color + ';';
    tip.id = tipid;
    tip.innerHTML = html;
    document.body.appendChild(tip);
    timer1 = setTimeout(function(){
      tip.style.top = '100px';
      timer1 = null;
    }, 1);
    timer2 = setTimeout(function(){
      tip.style.top = '-100%';
      timer2 = null;
      timer3 = setTimeout(function(){
        document.body.removeChild(tip);
        timer3 = null;
      }, 300);
    }, delay);

    tip.addEventListener('click', function(){
      document.body.removeChild(tip);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    })
  }

  /* 性能，节流函数*/
  var debounce = function(fn, wait){
    var timeoutID = null;

    return function() {
      clearTimeout(timeoutID);

      var args = arguments;
      timeoutID = setTimeout(function() {
        fn.apply(this, args);
      }, wait);
    };
  }
  var throttle = function(fn, wait) {
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
  function getUrlParam(name){  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) {
       return decodeURIComponent(r[2]); 
    } else {
       return null; 
    }
  }

  /* cookie */
  function setCookie(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
  }
  function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
  }
  function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
  }

  /* 操作class */
  function hasClass(el, cls){ 
    return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')); 
  } 
  function addClass(el, cls){ 
    if (!this.hasClass(el, cls)) el.className += " " + cls; 
  }  
  function removeClass(el, cls){ 
    if (hasClass(el, cls)) { 
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'); 
      el.className = el.className.replace(reg, ' '); 
    } 
  } 
  function toggleClass(el,cls){ 
    if(hasClass(el,cls)){ 
      removeClass(el, cls); 
    }else{ 
      addClass(el, cls); 
    } 
  } 

  /* formatDate */
  function formatDate(date, fmt){
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

  return {
    successTip: function(html, time) {
      tip(html, 'success', time)
    },
    failTip: function (html, time) {
      tip(html, 'fail', time)
    },
    tip: function(html, time) {
      tip(html, 'normal', time)
    },
    debounce: debounce,
    throttle: throttle,
    getUrlParam: getUrlParam,
    setCookie: setCookie,
    getCookie: getCookie,
    delCookie: delCookie,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    formatDate: formatDate
  }
}) 

  


  