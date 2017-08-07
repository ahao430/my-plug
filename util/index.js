;var Util = (function(){

  var obj

  /* 提示框 */

  function tip (html, type, time) {
    var tipid = 'tipMessage';

    if (lastTip = document.getElementById(tipid)) {
      clearTimeout(_self.timer1);
      clearTimeout(_self.timer2);
      clearTimeout(_self.timer3);
      document.body.removeChild(lastTip);
    }
    
    var delay = time || 1000
    var tip = document.createElement('div')
    var color = '#fff';
    if (type) {
      if (type === 'success') {
        color = '#33FD00';
      } else if (type === 'fail') {
        color = '#f00';
      }
    }
    tip.style.cssText = 'background: rgba(0,0,0,0.5);position: fixed; top: -100%; margin: 0 auto; left: 50%; transform: translateX(-50%); font-size: 16px; padding: 10px; line-height: 1.3; transition: all 0.5s linear; border-radius: 10px; color:' + color + ';';
    tip.id = tipid;
    tip.innerHTML = html;
    document.body.appendChild(tip);
    _self.timer1 = setTimeout(function(){
      tip.style.top = '100px';
      _self.timer1 = null;
    }, 1);
    _self.timer2 = setTimeout(function(){
      tip.style.top = '-100%';
      _self.timer2 = null;
      _self.timer3 = setTimeout(function(){
        document.body.removeChild(tip);
        _self.timer3 = null;
      }, 200);
    }, delay);

    tip.addEventListener('click', function(){
      document.body.removeChild(tip);
      clearTimeout(_self.timer1);
      clearTimeout(_self.timer2);
      clearTimeout(_self.timer3);
    })
  }
  obj.successTip = function (html, time) {
    tip(html, 'success', time)
  }
  obj.failTip = function (html, time) {
    tip(html, 'fail', time)
  },
  obj.tip = function (html, time) {
    tip(html, 'normal', time)
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

  return obj;
})();