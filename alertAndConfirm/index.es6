/**
 * 自定义alert
 */
function iAlert(option){
  var defaults = {
    msg: '',
    callback: null,
    confirmText: '确定',
    fontSize: '16px',
    width: '50%',
    align: 'center'
  }
  var opt
  if(typeof(option) === "object"){
    opt = Object.assign({}, defaults, option)
  }else{
    opt = Object.assign({}, defaults, {msg: option})
  }

  var mask = document.createElement('div')
  mask.style.cssText = `
    position: fixed;
    z-index: 100000;
    background: rgba(0,0,0,0.5);
    top: 0; bottom: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  var box = document.createElement('div')
  box.style.cssText = `
    flex: 0 0 none;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    border-radius: 10px;
    width: ${opt.width};
  `
  var p = document.createElement('p')
  p.style.cssText = `
    border-bottom: 1px solid #ccc;
    color: #000;
    padding: 10px;
    line-height: 1.5;
    font-size: ${opt.fontSize};
    text-align: ${opt.align};
  `
  p.innerText = opt.msg

  var btn = document.createElement('button')
  btn.style.cssText = `
    display: inline-block;
    border: none;
    color: #00f;
    background: transparent;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  `
  btn.innerText = opt.confirmText

  box.appendChild(p)
  box.appendChild(btn)
  mask.appendChild(box)
  document.body.appendChild(mask)

  btn.addEventListener('click', confirmEvent)

  function confirmEvent(){
    btn.removeEventListener('click', confirmEvent)
    document.body.removeChild(mask)
    opt.callback && opt.callback()
  }
}
// 自定义confirm
function iConfirm(option){
  var defaults = {
    msg: '',
    confirmText: '确定',
    cancelText: '取消',
    confirmCallback: null,
    cancelCallback: null,
    fontSize: '16px',
    width: '50%',
    align: 'center'
  }
  var opt
  if(typeof(option) === "object"){
    opt = Object.assign({}, defaults, option)
  }else{
    opt = Object.assign({}, defaults, {msg: option})
  }

  var mask = document.createElement('div')
  mask.style.cssText = `
    position: fixed;
    z-index: 100000;
    background: rgba(0,0,0,0.5);
    top: 0; bottom: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  var box = document.createElement('div')
  box.style.cssText = `
    flex: 0 0 none;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    border-radius: 10px;
    width: ${opt.width};
    text-align: ${opt.align};
  `
  var p = document.createElement('p')
  p.style.cssText = `
    border-bottom: 1px solid #ccc;
    color: #000;
    padding: 10px;
    line-height: 1.5;
    font-size: ${opt.fontSize};
  `
  p.innerText = opt.msg

  var btn1 = document.createElement('button')
  btn1.style.cssText = `
    display: inline-block;
    color: #f00;
    border: none;
    background: transparent;
    padding: 10px 20px;
    font-size: 16px;
    width: 50%;
    box-sizing: border-box;
  `
  btn1.innerText = opt.cancelText

  var btn2 = document.createElement('button')
  btn2.style.cssText = `
    display: inline-block;
    color: #00f;
    border: none;
    background: transparent;
    padding: 10px 20px;
    font-size: 16px;
    width: 50%;
    box-sizing: border-box;
  `
  btn2.innerText = opt.confirmText

  box.appendChild(p)
  box.appendChild(btn1)
  box.appendChild(btn2)
  mask.appendChild(box)
  document.body.appendChild(mask)

  btn1.addEventListener('click', confirmEvent)

  btn2.addEventListener('click', cancelEvent)

  function confirmEvent(){
    btn1.removeEventListener('click', confirmEvent)
    btn2.removeEventListener('click', cancelEvent)
    document.body.removeChild(mask)
    opt.cancelCallback && opt.cancelCallback()
  }
  function cancelEvent(){
    btn1.removeEventListener('click', confirmEvent)
    btn2.removeEventListener('click', cancelEvent)
    document.body.removeChild(mask)
    opt.confirmCallback && opt.confirmCallback()
  }
}
