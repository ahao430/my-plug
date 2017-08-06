// (function(){
  var Player = function(opt){

    var _self = this

    // 配置项
    var defaults= {
      id: null,
      src: '',
      name: '未知歌曲',
      author: '佚名',
      path: ''
    }

    // 检测是否已初始化
    if (typeof this.init !== 'function') {

      console.log('初始化')

      Player.prototype.defaults = defaults     

    }

    this.opt = Object.assign(this.defaults, opt)
    this.dragging = false

    // 入口函数
    this.init = function() {
      
      if (!_self.opt.id || !_self.opt.src || !_self.opt.path) return console.error('请填入正确配置！')

      _self.audioFrame = document.getElementById(_self.opt.id)

      _self._addDom()

    }  

    Player.prototype._formatTime = function (time) {
      time = Math.floor(time)
      let min = Math.floor(time / 60)
      let second = time % 60
      if (min < 10) min = '0' + min
      if (second < 10) second = '0' + second
      return min + ':' + second
    }
    
    this._addDom = function () {
      
      var str = '<div class="my-audio-player">' +
                  '<div class="player-left">' + 
                    '<div class="player-btn"><img class="player-btn-img" src="' + _self.opt.path + '/play.png" alt=""/></div>' + 
                  '</div>' +
                  '<div class="player-right">' + 
                    '<p class="audio-name">' + _self.opt.name + '</p>' +
                    '<p class="audio-author">Max</p>' +
                    '<input type="range" class="player-time-bar" min="0" max="100" value="0">' +
                    '<div class="player-time">' +
                      '<span class="audio-start-time">00:00</span>' +
                      '<span class="audio-end-time">00:00</span>' +
                    '</div>' +
                  '</div>' +
                  '<audio src="' + _self.opt.src + '" class="real-audio" controls="controls" style="display: none;"></audio>' +
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
      
      _self.end.innerText = _self._formatTime(_self.audio.duration)

      // 播放/暂停事件
      _self.btn.addEventListener('click', function(){
        console.log(_self.opt.id + 'clicked')
        if (_self.audio.paused) {
          play()
        } else {
          pause()
        }
      })

      // 拖动时间滑块
      _self.timebar.addEventListener('change', function(e){
        console.log(_self.opt.id + 'dragging')

        // if (!_self.dragging) _self.dragging = true

        var time = Math.floor(_self.audio.duration * this.value / 100)
        _self.audio.currentTime = time
        _self.start.innerText = _self._formatTime(time)
        _self._setRangeColor(this.value)

      })

      // _self.timebar.addEventListener('change', function(e){
      //   console.log(_self.opt.id + 'dragged')

      //   setTimeout(function(){
      //     _self.dragging = false
      //   }, 500)
      // })

      function play(){
        _self.audio.play()
        _self.btnImg.src = _self.opt.path + '/pause.png'
        _self.timer = setInterval(function(){
          // if (_self.dragging) return false;
          var time = _self.audio.currentTime
          var value = time * 100 / _self.audio.duration
          _self.timebar.value = value
          _self.start.innerText = _self._formatTime(time)
           _self._setRangeColor(value)
        }, 500)
      }
      function pause(){
        _self.audio.pause()
        _self.btnImg.src = _self.opt.path + '/play.png'
        clearInterval(_self.timer)
        _self.timer = null
      }
    }

    // 设置已播放进度条颜色
    this._setRangeColor = function(value){
      _self.timebar.style.background = 'linear-gradient(to right, #5dca87, #5dca87 ' + value + '%, #fff ' + value + '%, #fff)'
    }

    // 修改默认配置项, 私有属性
    Player._setDefaults = function(newDefaults){
      Player.prototype.defaults = Object.assign(defaults, newDefaults)
    }

    return this
  }

  // 暴露函数
  window.AudioPlayer = function(opt){
    return new Player(opt)
  }
  window.AudioPlayer.setDefaults = function(opt){
    Player._setDefaults(opt)
  }
// })()
