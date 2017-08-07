var SwipePage = (function(){
  var defaults = {
    canLeft: true,
    canRight: true,
    curIndex: 0,
    dom: 'body',
    prevCallback: null,
    nextCallback: null,
    transition: 'all 0.3s linear'
  }

  function Swipe (opt) {
    var _self = this
  
    if (typeof(opt) === 'object') {
      opt = Object.assign(defaults, opt)
    } else {
      console.log('未配置参数或格式错误，使用默认配置')
      opt = defaults
    }

    this.opt = opt

    this._swipe = function (opt) {
      var startX, startY, startTime, endX, endY, endTime;
      var dom = document.querySelector(opt.dom)

      dom.addEventListener('touchstart', function(e){
          console.log(e.touches[0])
          startX = e.touches[0].screenX;
          startY = e.touches[0].screenY;
          startTime = new Date().getTime();
      });
      dom.addEventListener('touchmove', Util.throttle(function(e){
          // console.log(e.changedTouches[0])
          var x = e.changedTouches[0].screenX;
          var y = e.changedTouches[0].screenY;
          // console.log(x,y)
          var deltaX = x - startX;
          var deltaY = y - startY;
          var absX = Math.abs(deltaX);
          var absY = Math.abs(deltaY);

          if (absY >= absX) return;
          if (deltaX > 0) {
            if (curNavIndex === 0) return;
            if (!opt.canRight) return;
          }
          if (deltaX < 0) {
            if (curNavIndex === navLength - 1) return;
            if (!opt.canLeft) return;
          }

          dom.style.transform = 'translateX(' + deltaX +'px)';
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
          }
           
        }
      })
    }

    this._changePage = function(opt) {
      if (absX > absY && absX >= 50) {
        if (deltaX < 0 && opt.canLeft) {
          opt.prevCallback && opt.prevCallback()
        } else if (deltaX > 0 && opt.canRight){
          opt.nextCallback && opt.nextCallback()
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

  return _obj
})()
