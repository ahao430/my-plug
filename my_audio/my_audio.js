var myAudioPlayer = (function(){
  var obj = {}
  var audioFrame, audio

  var defaults = {
    id: null,
    src: '',
    name: '未知歌曲',
    author: '佚名',
    path: ''
  }

  obj.init = function(opt) {
    opt = Object.assign(defaults, opt)
    if (!opt || !opt.id || !opt.src || !opt.path) return false

    _addDom(opt)

  }

  function _addDom(opt) {
    audioFrame = document.getElementById(opt.id)
    var str = '<div class="my-audio-player">' +
                '<div class="player-left">' + 
                  '<div class="player-btn"><img class="player-btn-img" src="' + opt.path + '/play.png" alt=""/></div>' + 
                '</div>' +
                '<div class="player-right">' + 
                  '<p class="audio-name">' + opt.name + '</p>' +
                  '<p class="audio-author">Max</p>' +
                  '<input type="range" class="player-time-bar" min="0" value="0" max="100">' +
                  '<div class="player-time">' +
                    '<span class="audio-start-time">00:00</span>' +
                    '<span class="audio-end-time">00:00</span>' +
                  '</div>' +
                '</div>' +
                '<audio src="' + opt.src + '" class="real-audio" controls="controls" style="display: none;"></audio>' +
              '</div>'
    audioFrame.innerHTML = str

    audio = audioFrame.getElementsByClassName('real-audio')[0]
    
    audio.addEventListener('canplay', function(){
      _initAudio(opt)
    })

  }

  function _initAudio (opt) {
    var btn = audioFrame.getElementsByClassName('player-btn')[0]
    var btnImg = audioFrame.getElementsByClassName('player-btn-img')[0]
    var timebar = audioFrame.getElementsByClassName('player-time-bar')[0]
    var start = audioFrame.getElementsByClassName('audio-start-time')[0]
    var end = audioFrame.getElementsByClassName('audio-end-time')[0]
    
    end.innerText = timebar.max = _formatTime(audio.duration)

    btn.onclick = function(){
      if (audio.paused) {
        audio.play()
        btnImg.src = opt.path + '/pause.png'
        var timer = setInterval(function(){
          timebar.value = audio.currentTime
          start.innerText = _formatTime(audio.currentTime)
        }, 500)
      } else {
        audio.pause()
        btnImg.src = opt.path + '/play.png'
        clearInterval(timer)
      }
    }

    timebar.addEventListener('input', function(e){
      console.log(this.value)
      audio.currentTime = this.value
      start.innerText = _formatTime(this.value)
      timebar.style.background = 'linear-gradient(to right, #5dca87, #5dca87 ' + this.value + '%, #fff ' + this.value + '%, #fff)'
    })
  }

  function _formatTime (time) {
    time = Math.floor(time)
    let min = Math.floor(time / 60)
    let second = time % 60
    if (min < 10) min = '0' + min
    if (second < 10) second = '0' + second
    return min + ':' + second
  }

  return obj
})()