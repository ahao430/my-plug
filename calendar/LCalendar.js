window.LCalendar = (function() {
    var MobileCalendar = function() {
        this.gearDate;
        this.minY = 2010;
        this.minY2 = 2010;
        this.minM = 1;
        this.minM2 = 1;
        this.minD = 1;
        this.minD2 = 1;
        this.maxY = 2099;
        this.maxY2 = 2099;
        this.maxM = 12;
        this.maxM2 = 12;
        this.maxD = 31;
        this.maxD2 = 31;
        this.curIndex = 0;
        this.startDate = '';
        this.endDate = '';
        this.callback = null;
        this.startX = null;
        this.startY = null;
    }
    MobileCalendar.prototype = {
        init: function(params) {
            this.type = params.type;
            this.trigger = document.querySelector(params.trigger);
            if (this.trigger.getAttribute("data-lcalendar") != null) {
                var arr = this.trigger.getAttribute("data-lcalendar").split(',');
                var minArr = arr[0].split('-');
                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];
                var maxArr = arr[1].split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
            }
            if (params.minDate) {
                var minArr = params.minDate.split('-');
                this.minY = ~~minArr[0];
                this.minY2 = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minM2 = ~~minArr[1];
                this.minD = ~~minArr[2];
                this.minD2 = ~~minArr[2];
            }
            if (params.maxDate) {
                var maxArr = params.maxDate.split('-');
                this.maxY = ~~maxArr[0];
                this.maxY2 = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxM2 = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
                this.maxD2 = ~~maxArr[2];
            }
            if (params.callback) {
                this.callback = params.callback
            }
            this.bindEvent(this.type);
        },
        bindEvent: function(type) {
            var _self = this;
            //呼出日期插件
            function popupDate(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                // console.log(_self.params)
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                        '<div class="date_btn_box date">' +
                            '<div class="date_btn start_date active">开始日期</div>' +
                            '<div class="date_btn end_date">结束日期</div>' +
                        '</div>' +
                        '<div class="date_roll_mask">' +
                            '<div class="date_roll">' +
                                '<div>' +
                                    '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                                    '<div class="date_grid">' +
                                        '<div>年</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div>' +
                                    '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                                    '<div class="date_grid">' +
                                        '<div>月</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div>' +
                                    '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                                    '<div class="date_grid">' +
                                        '<div>日</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="date_btn_box">' +
                            '<div class="date_btn lcalendar_finish">确定</div>' +
                            // '<div class="date_btn lcalendar_cancel">取消</div>' +
                        '</div>' +
                    '</div>';
                document.body.appendChild(_self.gearDate);
                dateCtrlInit();
                // var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                _self.gearDate.addEventListener('click', closeMobileCalendar);
                _self.gearDate.querySelector('.date_ctrl').addEventListener('click', function(e){
                    e.stopPropagation()
                })

                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('click', confirmDate);
                var start_date_btn = _self.gearDate.querySelector(".start_date");
                start_date_btn.addEventListener('click', selectStart);
                var end_date_btn = _self.gearDate.querySelector(".end_date");
                end_date_btn.addEventListener('click', selectEnd);

                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var date_dd = _self.gearDate.querySelector(".date_dd");
                date_yy.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_dd.addEventListener('touchstart', gearTouchStart);
                date_yy.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_dd.addEventListener('touchmove', gearTouchMove);
                date_yy.addEventListener('touchend', gearTouchEnd);
                date_mm.addEventListener('touchend', gearTouchEnd);
                date_dd.addEventListener('touchend', gearTouchEnd);
            }
            //初始化年月日插件默认值
            function dateCtrlInit() {
                var date = new Date();
                var dateArr = {
                    yy: date.getFullYear(),
                    mm: date.getMonth(),
                    dd: date.getDate() - 1
                };
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(_self.trigger.value)) {
                    rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                    dateArr.yy = rs[0] - _self.minY;
                    dateArr.mm = rs[1].replace(/-/g, "") - 1;
                    dateArr.dd = rs[2].replace(/-/g, "") - 1;
                } else {
                    dateArr.yy = dateArr.yy - _self.minY;
                }
                _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
                _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
                _self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
                setDateGearTooth();
            }
            
            //重置日期节点个数
            function setDateGearTooth() {
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                var passY = maxYY - minYY + 1;
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var itemStr = "";
                if (date_yy && date_yy.getAttribute("val")) {
                    //得到年份的值
                    var yyVal = parseInt(date_yy.getAttribute("val"));
                    //p 当前节点前后需要展示的节点个数
                    for (var p = 0; p <= passY - 1; p++) {
                        itemStr += "<div class='tooth'>" + (minYY + p) + "</div>";
                    }
                    date_yy.innerHTML = itemStr;
                    var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
                    if (!isNaN(top)) {
                        top % 2 == 0 ? (top = top) : (top = top + 1);
                        top > 8 && (top = 8);
                        var minTop = 8 - (passY - 1) * 2;
                        top < minTop && (top = minTop);
                        date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
                        date_yy.setAttribute('top', top + 'em');
                        yyVal = Math.abs(top - 8) / 2;
                        date_yy.setAttribute("val", yyVal);
                    } else {
                        date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
                        date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
                    }
                } else {
                    return;
                }
                var date_mm = _self.gearDate.querySelector(".date_mm");
                if (date_mm && date_mm.getAttribute("val")) {
                    itemStr = "";
                    //得到月份的值
                    var mmVal = parseInt(date_mm.getAttribute("val"));
                    var maxM = 11;
                    var minM = 0;
                    //当年份到达最大值
                    if (yyVal == passY - 1) {
                        maxM = maxMM - 1;
                    }
                    //当年份到达最小值
                    if (yyVal == 0) {
                        minM = minMM - 1;
                    }
                    //p 当前节点前后需要展示的节点个数
                    for (var p = 0; p < maxM - minM + 1; p++) {
                        itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
                    }
                    date_mm.innerHTML = itemStr;
                    if (mmVal > maxM) {
                        mmVal = maxM;
                        date_mm.setAttribute("val", mmVal);
                    } else if (mmVal < minM) {
                        mmVal = maxM;
                        date_mm.setAttribute("val", mmVal);
                    }
                    date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
                    date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
                } else {
                    return;
                }
                var date_dd = _self.gearDate.querySelector(".date_dd");
                if (date_dd && date_dd.getAttribute("val")) {
                    itemStr = "";
                    //得到日期的值
                    var ddVal = parseInt(date_dd.getAttribute("val"));
                    //返回月份的天数
                    var maxMonthDays = calcDays(yyVal, mmVal);
                    //p 当前节点前后需要展示的节点个数
                    var maxD = maxMonthDays - 1;
                    var minD = 0;
                    //当年份月份到达最大值
                    if (yyVal == passY - 1 && maxMM == mmVal + 1) {
                        maxD = maxDD - 1;
                    }
                    //当年、月到达最小值
                    if (yyVal == 0 && minMM == mmVal + 1) {
                        minD = minDD - 1;
                    }
                    for (var p = 0; p < maxD - minD + 1; p++) {
                        itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
                    }
                    date_dd.innerHTML = itemStr;
                    if (ddVal > maxD) {
                        ddVal = maxD;
                        date_dd.setAttribute("val", ddVal);
                    } else if (ddVal < minD) {
                        ddVal = minD;
                        date_dd.setAttribute("val", ddVal);
                    }
                    date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
                    date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
                } else {
                    return;
                }
            }
            //求月份最大天数
            function calcDays(year, month) {
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                if (month == 1) {
                    year += minYY;
                    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
                        return 29;
                    } else {
                        return 28;
                    }
                } else {
                    if (month == 3 || month == 5 || month == 8 || month == 10) {
                        return 30;
                    } else {
                        return 31;
                    }
                }
            }
            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                _self.startX = e.touches[0].clientX
                _self.startY = e.touches[0].clientY

                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if (e.targetTouches[0].screenY < 1) {
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {
                e.preventDefault();
                var endX = e.changedTouches[0].clientX
                var endY = e.changedTouches[0].clientY
                if(endX === _self.startX && endY === _self.startY) {
                    return
                }

                var target = e.target;
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }

                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                var passY = maxYY - minYY + 1;
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 8) {
                        pos = 8;
                        setDuration();
                    }
                    switch (target.dataset.datetype) {
                        case "date_yy":
                            var minTop = 8 - (passY - 1) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                setDuration();
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                                finishMobileDate()
                            }
                            break;
                        case "date_mm":
                            var date_yy = _self.gearDate.querySelector(".date_yy");
                            //得到年份的值
                            var yyVal = parseInt(date_yy.getAttribute("val"));
                            var maxM = 11;
                            var minM = 0;
                            //当年份到达最大值
                            if (yyVal == passY - 1) {
                                maxM = maxMM - 1;
                            }
                            //当年份到达最小值
                            if (yyVal == 0) {
                                minM = minMM - 1;
                            }
                            var minTop = 8 - (maxM - minM) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                setDuration();
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2 + minM;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                                finishMobileDate()
                            }
                            break;
                        case "date_dd":
                            var date_yy = _self.gearDate.querySelector(".date_yy");
                            var date_mm = _self.gearDate.querySelector(".date_mm");
                            //得到年份的值
                            var yyVal = parseInt(date_yy.getAttribute("val"));
                            //得到月份的值
                            var mmVal = parseInt(date_mm.getAttribute("val"));
                            //返回月份的天数
                            var maxMonthDays = calcDays(yyVal, mmVal);
                            var maxD = maxMonthDays - 1;
                            var minD = 0;
                            //当年份月份到达最大值
                            if (yyVal == passY - 1 && maxMM == mmVal + 1) {
                                maxD = maxDD - 1;
                            }
                            //当年、月到达最小值
                            if (yyVal == 0 && minMM == mmVal + 1) {
                                minD = minDD - 1;
                            }
                            var minTop = 8 - (maxD - minD) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                setDuration();
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2 + minD;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                                finishMobileDate()
                            }
                            break;
                        default:
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                if (/date/.test(target.dataset.datetype)) {
                    setDateGearTooth();
                } else {
                    setTimeGearTooth();
                }
            }
            // 选择开始日期
            function selectStart(e){
                e.preventDefault();
                _self.curIndex = 0
                _self.gearDate.querySelector(".start_date").className = "date_btn start_date active"
                _self.gearDate.querySelector(".end_date").className = "date_btn end_date"
                _self.gearDate.querySelector(".end_date").innerHTML = '结束日期'
                _self.endDate = ''
            }
            // 选择结束日期
            function selectEnd(e){
                e.preventDefault();
                _self.curIndex = 1
                _self.gearDate.querySelector(".start_date").className = "date_btn start_date"
                _self.gearDate.querySelector(".end_date").className = "date_btn end_date active"

            }
            //取消
            function closeMobileCalendar(e) {
                // console.log(e)
                e.preventDefault();
                var evt;
                try {
                    evt = new CustomEvent('input');
                } catch (e) {
                    //兼容旧浏览器(注意：该方法已从最新的web标准中删除)
                    evt = document.createEvent('Event');
                    evt.initEvent('input', true, true);
                }
                _self.trigger.dispatchEvent(evt);
                document.body.removeChild(_self.gearDate);
                _self.gearDate=null;
            }
            //日期确认
            function finishMobileDate(e) {
                var maxYY, maxMM, maxDD, minYY, minMM, minDD
                if (_self.curIndex === 0){
                    maxYY = _self.maxY
                    maxMM = _self.maxM
                    maxDD = _self.maxD
                    minYY = _self.minY
                    minMM = _self.minM
                    minDD = _self.minD
                }else{
                    maxYY = _self.maxY2
                    maxMM = _self.maxM2
                    maxDD = _self.maxD2
                    minYY = _self.minY2
                    minMM = _self.minM2
                    minDD = _self.minD2
                }
                var passY = maxYY - minYY + 1;
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
                date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
                var start_date_btn = _self.gearDate.querySelector(".start_date");
                var end_date_btn = _self.gearDate.querySelector(".end_date");
                if(_self.curIndex === 0){
                    _self.startDate = (date_yy % passY + minYY) + "-" + date_mm + "-" + date_dd;
                    _self.minY2 = (date_yy % passY + minYY)
                    _self.minM2 = date_mm
                    _self.minD2 = date_dd
                    start_date_btn.innerHTML = _self.startDate
                }else{
                    _self.endDate = (date_yy % passY + minYY) + "-" + date_mm + "-" + date_dd;
                    end_date_btn.innerHTML = _self.endDate
                }
            }
            
            // 回传数据
            function confirmDate(e){
                if (!_self.startDate || !_self.endDate) {
                    // alert('请完整选择')
                    // _self.callback && _self.callback(false)
                    return false
                }
                _self.callback && _self.callback(true, _self.startDate, _self.endDate)
                _self.curIndex = 0
                _self.startDate = null
                _self.endDate = null
                closeMobileCalendar(e)
            }
            _self.trigger.addEventListener('click', {
                "date": popupDate
            }[type]);
        }
    }
    return MobileCalendar;
})()
