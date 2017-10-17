var SwipePage = (function(){
  var defaults = {
    canLeft: true,
    canRight: true,
    curIndex: 0,
    navLength: 1,
    dom: 'body',
    prevCallback: null,
    nextCallback: null,
    firstCallback: null,
    lastCallback: null,
    transition: 'all 0.3s linear'
  }

  function throttle (fn, wait) {
    var last = 0;
    return function(){
      var curr = +new Date()
      if (curr - last > wait){
        fn.apply(this, arguments)
        last = curr
      }
    }
  }

  function Swipe (opt) {
    var _self = this


    if (typeof(opt) === 'object') {
      for(var i in defaults){
        if(!(i in opt)){
          opt[i] = defaults[i]
        }
      }
    } else {
      console.log('未配置参数或格式错误，使用默认配置')
      opt = defaults
    }

    this.opt = opt

    this._swipe = function (opt) {
      var startX, startY, startTime, lastX, lastY, endX, endY, endTime;
      var dom = document.querySelector(opt.dom)
      var body = document.body
      var direction = null

      dom.addEventListener('touchstart', function(e){
          // console.log(e.touches[0])
          startX = lastX = e.touches[0].screenX;
          startY = lastY = e.touches[0].screenY;
          startTime = new Date().getTime();
          direction = null
      });
      dom.addEventListener('touchmove', throttle(function(e){
          // console.log(e.changedTouches[0])
          var x = e.changedTouches[0].screenX;
          var y = e.changedTouches[0].screenY;
          // console.log(x,y)
          var deltaX = x - lastX;
          var deltaY = y - lastY;
          var absX = Math.abs(deltaX);
          var absY = Math.abs(deltaY);
          var newDirection = null

          lastX = x
          lastY = y

          if(!direction){
            if(absY > absX){
              newDirection = 'vertical'
              body.style.overflowX = 'hidden'
            }else{
              newDirection = 'horizental'
              body.style.overflowY = 'hidden'
            }

            direction = newDirection
          }else if(direction !== newDirection) {
            return
          }

          if (deltaX > 0) {
            if (!opt.canRight) return;
          }
          if (deltaX < 0) {
            if (!opt.canLeft) return;
          }

          dom.style.transform = 'translateX(' + (x - startX) +'px)';
      },100));
      dom.addEventListener('touchend', function(e){
        // console.log(e.changedTouches[0]);

        endX = e.changedTouches[0].screenX;
        endY = e.changedTouches[0].screenY;
        endTime = new Date().getTime();

        deltaX = endX - startX;
        deltaY = endY - startY;
        absX = Math.abs(deltaX);
        absY = Math.abs(deltaY);

        body.style.overflow = 'auto'

        deltaTime = endTime - startTime;

        // 判断快速滑动还是慢速
        if (deltaTime <= 100) {
          _self._changePage(opt);
        } else {
          var screenWidth = screen.width;
          if (absX >= screenWidth/3) {
            _self._changePage(opt);
          } else {
            dom.style.transform = 'translateX(' + 0 +'px)';
            body.style.overflow = 'auto'
          }

        }
      })
    }

    this._changePage = function(opt) {
      var dom = document.querySelector(opt.dom)
      // console.log(deltaX)
      // console.log(opt.curIndex)
      if (absX > absY && absX >= 50) {
        // 左滑，下一页
        if (deltaX < 0 && opt.canLeft) {
          if (opt.curIndex === opt.navLength - 1) {
            opt.curIndex
            opt.lastCallback && opt.lastCallback()
            dom.style.transform = 'translateX(' + 0 +'px)';
          } else {
            opt.curIndex++
            dom.style.transform = 'translateX(' + 0 +'px)';
            opt.nextCallback && opt.nextCallback()
          }
        } else if (deltaX > 0 && opt.canRight){
        // 右滑，上一页
          if (opt.curIndex === 0) {
            opt.firstCallback && opt.firstCallback()
            dom.style.transform = 'translateX(' + 0 +'px)';
          } else {
            opt.curIndex--
            dom.style.transform = 'translateX(' + 0 +'px)';
            opt.prevCallback && opt.prevCallback()
          }
        }
      }
    }

    this._setTransition = function (opt) {
      // console.log(opt)
      var dom = document.querySelector(opt.dom)
      var transition = opt.transition
      dom.style.transition = transition
    }


    window.addEventListener('load', function(){
      _self._setTransition(opt)
      _self._swipe(opt)

    })
  }

  var instance

  var _obj = {
    init: function(opt){
      if (instance === undefined) {
        instance = new Swipe(opt)
      }
      return instance
    }
  }

  return _obj.init
})()
