(function (name, factory) {
  if (typeof define === 'function' && define.amd) {
    define([name], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory; // Node
  } else {
    window[name] = factory(); // Browser global
  }
})('LazyLoad', function(){
  // 截流
  function throttle(fn, delay, atleast) {
    var timeout = null,
      startTime = new Date();
    return function() {
      var curTime = new Date();
      clearTimeout(timeout);
      if(curTime - startTime >= atleast) {
        fn();
        startTime = curTime;
      }else {
        timeout = setTimeout(fn, delay);
      }
    }
  }
  // class操作
  function hasClass(el, cls){
    return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  function addClass(el, cls){
    if (!hasClass(el, cls)) el.className += " " + cls;
  }
  function removeClass(el, cls){
    if (hasClass(el, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
  // 对象操作
    function cloneObj(oldObj){
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var i in oldObj) {
      newObj[i] = cloneObj(oldObj[i]);
    }
    return newObj;
  }
  function extendObj () {
    var args = arguments;
    if (args.length < 2) return;
    var temp = cloneObj(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
      for (var i in args[n]) {
        temp[i] = args[n][i];
      }
    }
    return temp;
  }

  // 配置
  var defaults = {
    el: '.lazy', // 元素， class或tag
    iframe: false, // 可选择iframe加载防盗链图片
    bottom: 0, // 底部距离，预加载图片, 0或负值
    offsetParent: null, // 图片向上定位次数, 当offsetTop不相对body时
    iframeWidth: null, // 可设置iframe宽度，否则为图片默认宽度
    imgWidth: null, // 图片宽度
    imgHeight: null, // 图片高度
    iframeCallback: null // iframe回调函数，参数为iframe元素，可用parent.document向上取值
  }
  // 加载
  function lazyload(opt) {
    var images = document.querySelectorAll(opt.el);
    var len    = images.length;
    var seeHeight = document.documentElement.clientHeight;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    opt = extendObj(defaults, opt)
    for(var i = 0; i < len; i++) {
      var pic = images[i]
      var offsetNode = pic
      var num = opt.offsetParent
      if(num){
        while(num--){
          offsetNode = offsetNode.parentNode
        }
      }
      var imgSize = 'max-width: 100%;'
      if(opt.imgWidth){
        imgSize += 'width: ' + opt.imgWidth + ';'
      }
      if(opt.imgHeight){
        imgSize += 'height: ' + opt.imgHeight + ';'
      }
      if(offsetNode.offsetTop + parseInt(opt.bottom) < seeHeight + scrollTop ) {
        if(opt.iframe === true){
          var realsrc = pic.dataset.src
          var picWidth = pic.width
          var frameid = 'frameimg' + Math.random()
          window.img = '<img id="img" style="' + imgSize + '" src=\'' + realsrc + '\'/>';
          window.img += '<style>html,body{margin: 0; padding: 0;} body img{box-sizing: border-box; width: 100%;}></style>';
          window.img += '<script>window.onload = function(){' +
            'parent.document.getElementById(\'' + frameid+ '\').width = document.getElementById(\'img\').width + \'px\';' +
            'parent.document.getElementById(\'' + frameid+ '\').height = document.getElementById(\'img\').height + \'px\'; '
          if(opt.iframeCallback){
            window.img += 'var cb = ' + opt.iframeCallback.toString() + '; cb(parent.document.getElementById(\'' + frameid + '\'));'
          }
          window.img += '}</script>'
          var iframe = document.createElement('iframe')
          iframe.className = "img_frame"
          iframe.id = frameid
          iframe.src = "javascript:parent.img;"
          iframe.scrolling="no"
          iframe.frameBorder="0"
          if(opt.iframeWidth){
            iframe.style.width = opt.iframeWidth
          }
          removeClass(pic, 'lazy')
          pic.parentNode.appendChild(iframe)
          pic.parentNode.removeChild(pic)
        }else{
          pic.src = pic.dataset.src
          removeClass(pic, 'lazy')
        }
      }
    }
  }

  return function(option){
    lazyload(option)
    window.addEventListener('scroll', throttle(function(){lazyload(option)}, 500, 1000), false);
  };
})
