var AudioPlayer = (function(){
  // 配置项
  var defaults= {
    el: null,
    src: '',
    name: '未知歌曲',
    author: '佚名',
    path: ''
  }

  // 修改默认配置项, 私有属性
  function _setDefaults (newDefaults) {
    defaults = Object.assign(defaults, newDefaults)
  }

  function _formatTime (time) {
    time = Math.floor(time)
    let min = Math.floor(time / 60)
    let second = time % 60
    if (min < 10) min = '0' + min
    if (second < 10) second = '0' + second
    return min + ':' + second
  }

  function Player (opt) {

    var _self = this  

    if (typeof(opt) === 'object') {
      if (!opt.el || !opt.src || !opt.path) return; 
      opt = Object.assign(defaults, opt)
    } else {
      console.error('未配置参数或格式错误，使用默认配置')
      opt = defaults
    }

    this.opt = opt
    this.audioFrame = document.querySelector(opt.el)

    this._addDom = function () {
      
      var str = '<div class="my-audio-player">' +
                  '<div class="player-left">' + 
                    '<div class="player-btn"><img class="player-btn-img" src="' + opt.path + '/play.png" alt=""/></div>' + 
                  '</div>' +
                  '<div class="player-right">' + 
                    '<p class="audio-name">' + opt.name + '</p>' +
                    '<p class="audio-author">Max</p>' +
                    '<input type="range" class="player-time-bar" min="0" max="100" value="0">' +
                    '<div class="player-time">' +
                      '<span class="audio-start-time">00:00</span>' +
                      '<span class="audio-end-time">00:00</span>' +
                    '</div>' +
                  '</div>' +
                  '<audio src="' + opt.src + '" class="real-audio" controls="controls" style="display: none;"></audio>' +
                '</div>'
      _self.audioFrame.innerHTML = str

      _self.audio = _self.audioFrame.getElementsByClassName('real-audio')[0]
      
      _self.audio.addEventListener('canplay', function(){
        _self._addEvent()
      })

    }

    this._addEvent = function () {
      _self.btn = _self.audioFrame.getElementsByClassName('player-btn')[0]
      _self.btnImg = _self.audioFrame.getElementsByClassName('player-btn-img')[0]
      _self.timebar = _self.audioFrame.getElementsByClassName('player-time-bar')[0]
      _self.start = _self.audioFrame.getElementsByClassName('audio-start-time')[0]
      _self.end = _self.audioFrame.getElementsByClassName('audio-end-time')[0]
      
      _self.end.innerText = _formatTime(_self.audio.duration)

      // 播放/暂停事件
      _self.btn.addEventListener('click', function(){
        console.log(opt.el + 'clicked')
        if (_self.audio.paused) {
          play()
        } else {
          pause()
        }
      })

      // 拖动时间滑块
      _self.timebar.addEventListener('change', function(e){
        console.log(opt.el + 'dragging')

        // if (!_self.dragging) _self.dragging = true

        var time = Math.floor(_self.audio.duration * this.value / 100)
        _self.audio.currentTime = time
        _self.start.innerText = _formatTime(time)
        _self._setRangeColor(this.value)

      })

      // _self.timebar.addEventListener('change', function(e){
      //   console.log(opt.id + 'dragged')

      //   setTimeout(function(){
      //     _self.dragging = false
      //   }, 500)
      // })

      function play(){
        _self.audio.play()
        _self.btnImg.src = opt.path + '/pause.png'
        _self.timer = setInterval(function(){
          // if (_self.dragging) return false;
          var time = _self.audio.currentTime
          var value = time * 100 / _self.audio.duration
          _self.timebar.value = value
          _self.start.innerText = _formatTime(time)
           _self._setRangeColor(value)
        }, 500)
      }
      function pause(){
        _self.audio.pause()
        _self.btnImg.src = opt.path + '/play.png'
        clearInterval(_self.timer)
        _self.timer = null
      }
    }

    // 设置已播放进度条颜色
    this._setRangeColor = function(value){
      _self.timebar.style.background = 'linear-gradient(to right, #5dca87, #5dca87 ' + value + '%, #fff ' + value + '%, #fff)'
    }

    
    this._addDom()
  }

  var instance

  var _obj = {
    init: function(opt){
      if (instance === undefined) {
        instance = new Player(opt)
      }
      return instance
    }
  }

  return _obj
})()
