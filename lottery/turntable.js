!function(){
  var container = $('#turntable_container')
  var ctx = $('#turntable_canvas').getContext('2d')
  var btn = $('#turntable_pin')
  
  var arr
  var chance
  var rotateTime
  var waitTime
  var now
  var success
  var noChance
  var num
  var rotateDeg
  var result
  var rotating

  window.TurnTable = {
    init: init
  }
  
  function init(opt){

    arr = opt.prizes || []
    chance = opt.chance || 1
    rotateTime = opt.rotateTime || 5
    waitTime = opt.waitTime || 0
    success = opt.success || function(){alert('恭喜中奖！')}
    noChance = opt.noChance || function(){alert('您的抽奖机会已用完！')}

    num = arr.length
    rotateDeg = 0
    result = 0
    rotating = false

    draw()    

    container.style.transition = 'all ' + rotateTime + 's ease'

    btn.addEventListener('click', function(){
      now = new Date()
      
      lastTimeStamp = localStorage.getItem('lottery_timestamp') || null
      lastChance = localStorage.getItem('lottery_chance') || chance

      opt.always && opt.always()

      if(check(opt.waiting)){
        console.log(chance)
        var newResult = opt.getResult()
        rotateDeg += 360 * (newResult - result) / num + 3600
        result = newResult
        container.style.transform = 'rotate(' + rotateDeg + 'deg)'
        chance--
        rotating = true

        setTimeout(function(){
          rotating = false
          localStorage.setItem('lottery_timestamp', now.getTime())
          localStorage.setItem('lottery_chance', chance)
          success && success(result)
        }, rotateTime * 1000)
      }
    })
  }

  function $(el){return document.querySelector(el)}
  
  // 画转盘
  function draw(){
    var ul = document.createElement('ul')
    for(var i = 0; i < num; i++){
      ctx.save()
      ctx.beginPath()
      ctx.translate(150, 150)
      ctx.moveTo(0, 0)
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / num * i) * Math.PI / 180)
      // 圆弧
      ctx.arc(0, 0, 150, 0, 2 * Math.PI / num, false)
      // 颜色间隔
      if (i % 2 == 0) {
        ctx.fillStyle = '#a2d4ff';
      }else{
        ctx.fillStyle = '#fff';
      }
      ctx.fill()
      ctx.restore()
      ul.innerHTML += '<li style="transform: rotate(' + (360 / num * i) + 'deg)">' + arr[i] + '</li>'
    } 
    container.appendChild(ul)
  }

  // 检查是否可抽奖
  function check(waiting){
    // 判断正在旋转
    if (rotating) return false

    // 判断是否存在记录
    if (!lastTimeStamp) return true

    var last = new Date(+lastTimeStamp)

    if (now.getYear() === last.getYear() && now.getMonth() === last.getMonth() && now.getDate() === last.getDate()) {
      // 同一天
      chance = lastChance
      if(chance > 0){
        // 有剩余
        if (now - last < waitTime * 1000) {
          // 间隔小于设定时间
          waiting && waiting()
          return false
        } else {
          // 间隔超过设定时间
          return true
        }
      } else {
        // 剩余次数0
        noChance && noChance()
        return false
      }
      // 上次记录不是今天
    } else {
      return true
    }
  }
}()