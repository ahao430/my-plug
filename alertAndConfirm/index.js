/**
 * 自定义alert
 */
function iAlert(option) {
  var defaults = {
    msg: '',
    callback: null,
    confirmText: '确定',
    fontSize: '16px',
    width: '50%',
    align: 'center'
  };
  var opt;
  if ((typeof option === 'undefined' ? 'undefined' : typeof(option)) === "object") {
    opt = Object.assign({}, defaults, option);
  } else {
    opt = Object.assign({}, defaults, { msg: option });
  }

  var mask = document.createElement('div');
  mask.style.cssText = '\n    position: fixed;\n    z-index: 100000;\n    background: rgba(0,0,0,0.5);\n    top: 0; bottom: 0; left: 0; right: 0;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  ';
  var box = document.createElement('div');
  box.style.cssText = '\n    flex: 0 0 none;\n    background: #fff;\n    text-align: center;\n    box-sizing: border-box;\n    border-radius: 10px;\n    width: ' + opt.width + ';\n  ';
  var p = document.createElement('p');
  p.style.cssText = '\n    border-bottom: 1px solid #ccc;\n    color: #000;\n    padding: 10px;\n    line-height: 1.5;\n    font-size: ' + opt.fontSize + ';\n    text-align: ' + opt.align + ';\n  ';
  p.innerText = opt.msg;

  var btn = document.createElement('button');
  btn.style.cssText = '\n    display: inline-block;\n   border: none;\n   color: #00f;\n    background: transparent;\n    padding: 10px;\n    font-size: 16px;\n    width: 100%;\n    box-sizing: border-box;\n  ';
  btn.innerText = opt.confirmText;

  box.appendChild(p);
  box.appendChild(btn);
  mask.appendChild(box);
  document.body.appendChild(mask);

  btn.addEventListener('click', confirmEvent);

  function confirmEvent() {
    btn.removeEventListener('click', confirmEvent);
    document.body.removeChild(mask);
    opt.callback && opt.callback();
  }
}
// 自定义confirm
function iConfirm(option) {
  var defaults = {
    msg: '',
    confirmText: '确定',
    cancelText: '取消',
    confirmCallback: null,
    cancelCallback: null,
    fontSize: '16px',
    width: '50%',
    align: 'center'
  };
  var opt;
  if ((typeof option === 'undefined' ? 'undefined' : typeof(option)) === "object") {
    opt = Object.assign({}, defaults, option);
  } else {
    opt = Object.assign({}, defaults, { msg: option });
  }

  var mask = document.createElement('div');
  mask.style.cssText = '\n    position: fixed;\n    z-index: 100000;\n    background: rgba(0,0,0,0.5);\n    top: 0; bottom: 0; left: 0; right: 0;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  ';
  var box = document.createElement('div');
  box.style.cssText = '\n    flex: 0 0 none;\n    background: #fff;\n    text-align: center;\n    box-sizing: border-box;\n    border-radius: 10px;\n    width: ' + opt.width + ';\n    text-align: ' + opt.align + ';\n  ';
  var p = document.createElement('p');
  p.style.cssText = '\n    border-bottom: 1px solid #ccc;\n    color: #000;\n    padding: 10px;\n    line-height: 1.5;\n    font-size: ' + opt.fontSize + ';\n  ';
  p.innerText = opt.msg;

  var btn1 = document.createElement('button');
  btn1.style.cssText = '\n    display: inline-block;\n   border: none;\n     color: #f00;\n    background: transparent;\n    padding: 10px 20px;\n    font-size: 16px;\n    width: 50%;\n    box-sizing: border-box;\n  ';
  btn1.innerText = opt.cancelText;

  var btn2 = document.createElement('button');
  btn2.style.cssText = '\n    display: inline-block;\n   border: none;\n     color: #00f;\n    background: transparent;\n    padding: 10px 20px;\n    font-size: 16px;\n    width: 50%;\n    box-sizing: border-box;\n  ';
  btn2.innerText = opt.confirmText;

  box.appendChild(p);
  box.appendChild(btn1);
  box.appendChild(btn2);
  mask.appendChild(box);
  document.body.appendChild(mask);

  btn1.addEventListener('click', confirmEvent);

  btn2.addEventListener('click', cancelEvent);

  function confirmEvent() {
    btn1.removeEventListener('click', confirmEvent);
    btn2.removeEventListener('click', cancelEvent);
    document.body.removeChild(mask);
    opt.cancelCallback && opt.cancelCallback();
  }
  function cancelEvent() {
    btn1.removeEventListener('click', confirmEvent);
    btn2.removeEventListener('click', cancelEvent);
    document.body.removeChild(mask);
    opt.confirmCallback && opt.confirmCallback();
  }
}