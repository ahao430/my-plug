(function (name, factory) {
  if (typeof define === 'function' && define.amd) {
    define([name], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory; // Node
  } else {
    window[name] = factory(); // Browser global
  }
})('LoadMore', function(){
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
  function load(footer,cb){
    var seeHeight = document.documentElement.clientHeight;
    var footer = document.querySelector(footer)
    var footerTop = footer.offsetTop
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    
    footerTop = footer.offsetTop
    if(scrollTop > footerTop - seeHeight - 80){
      console.log('load')
      cb&&cb()
    }
  }

  return function(footer, cb){
    window.addEventListener('scroll', throttle(function(){load(footer, cb)}, 300, 1000), false);
  }
})