"use strict";
(function() {
  // global variable
  const now = new Date();
  const obj_today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const body = document.querySelector("body");
  const tableBody = document.querySelector(".table-body");
  const row_title = document.querySelector(".row_title")
  const row_date = document.querySelector(".row_date");
  const monthName = row_title.querySelector(".month-name");
  const yearName = row_title.querySelector(".year-name");
  const editorCheck = document.querySelector("#editor-check");
  const editor = document.querySelector("#editor");
  const editorWindow = editor.querySelector(".editor-window");
  const matterBox = editor.querySelector(".matter-box");
  const timeCheck = document.querySelector("#time-picker-check");
  const timeWindow = document.querySelector("#time-picker");
  const clockCircle = timeWindow.querySelector(".clock");
  const btn_ampm = timeWindow.querySelector(".ampm");
  const displayBox = timeWindow.querySelector(".display-box");
  const displayHour = displayBox.querySelector(".hour");
  const displayMinute = displayBox.querySelector(".minute");
  const monthNameArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const nowY = obj_today.getFullYear();
  const nowM = obj_today.getMonth();
  const nowD = obj_today.getDate();
  let monthOffset = 0;
  let dateArray = [];

  //#region localStorage
  // 檢測是否支援
  if (typeof Storage === "undefined") {
    alert("您的瀏覽器不支援local Storage，無法使用本行事曆");
  }
  // localStorage.removeItem("allMatter");
  if (localStorage.getItem("allMatter") === null) {
    localStorage.setItem("allMatter", "[]");
  }
  // 讀出行程 造訪過的紀錄
  const arr_allMatter = JSON.parse(localStorage.getItem("allMatter"));
  //#endregion localStorage

  // function
  const stopBubble = function(event) {
    event.stopPropagation();
  };
  const filterToClass = function(target, className) {
    while (!target.classList.contains(className)) {
      target = target.parentElement;
    }
    return target;
  };
  const fadeOut = function(ele, time, start, end) {
    ele.animate([{
      opacity: start,
    }, {
      opacity: end,
    }], {
      duration: time,
    })
  };
  const openEditor = function(event) {
    // 過濾event.target為父層col，避免冒泡影響
    const thisCol = filterToClass(event.target, "col");
    // 清空matter-box
    matterBox.innerHTML = "";
    // 載入matter
    const thisD = thisCol.myDate.getDate();
    const thisM = thisCol.myDate.getMonth();
    const thisY = thisCol.myDate.getFullYear();
    arr_allMatter.forEach((m) => {
      if (thisD == m.date && thisM == m.month && thisY == m.year) {
        loadMatter(m);
      }
    });
    // 定位
    const dateRect = thisCol.getBoundingClientRect();
    // -先處理y值
    let editorWindowY = dateRect.y - 120;
    // -分側
    const isRight = dateRect.x >= 0.5 * window.innerWidth;
    let editorWindowX = isRight ? dateRect.x - 350 - 10 : dateRect.x + dateRect.width + 10;
    // -過濾y值 top下限值 30 top上限值 screenY - 450 - 30
    editorWindowY = editorWindowY < 30 ? 30 : editorWindowY;
    editorWindowY = editorWindowY > body.clientHeight - 450 - 30 ? body.clientHeight - 450 - 30 : editorWindowY;
    editorWindow.style.top = `${editorWindowY}px`;
    editorWindow.style.left = `${editorWindowX}px`;
    // 動畫淡出
    fadeOut(editorWindow, 80, 0, 1);
  };
  const openTimePicker = function(event) {
    const obj_now = new Date();
    // 重設time picker
    displayHour.textContent = "00";
    displayMinute.textContent = "00";
    displayHour.classList.add("picking");
    // btn_ampm.isAM = obj_now.getHours() < 12;
    btn_ampm.isAM = true;
    // btn_ampm.textContent = btn_ampm.isAM ? "AM" : "PM";
    btn_ampm.textContent = "AM";
    // 儲存user打開瞬間滑鼠位置
    clockCircle.initX = event.clientX;
    clockCircle.initY = event.clientY;
    // 綁定該matter
    timeWindow.srcMatter = event.target.parentElement;
    timeWindow.srcMatter.classList.add("editing");
    // 定位
    let windowTop = event.target.getBoundingClientRect().top - 130;
    let windowLeft = event.target.getBoundingClientRect().left - 60;
    // 過濾
    windowTop = Math.max(windowTop, 10);
    windowTop = Math.min(windowTop, body.clientHeight - 300 - 10);
    windowLeft = Math.max(windowLeft, 10);
    windowLeft = Math.min(windowLeft, body.clientWidth - 300 - 10);
    timeWindow.style.top = `${windowTop}px`;
    timeWindow.style.left = `${windowLeft}px`;
    fadeOut(timeWindow, 100, 0, 1);
  };
  timeCheck.addEventListener("change", function(event) {
    // 設定clockCircle座標
    let rect = clockCircle.getBoundingClientRect();
    clockCircle.cx = rect.left + rect.width / 2;
    clockCircle.cy = rect.top + rect.height / 2;
    updateDisplayBox(event);
  });
  timeWindow.addEventListener("mouseleave", function() {
    // 關閉time picker 重設點擊狀態
    timeCheck.checked = false;
    displayBox.state = 1;
    timeWindow.srcMatter.classList.remove("editing");
  });
  clockCircle.addEventListener("mouseleave", function() {
    clockCircle.lastMark.classList.remove("hover");
    clockCircle.lastMark = body;
    switch (displayBox.state) {
      case 1:
        displayHour.textContent = "00";
        displayHour.classList.remove("picking");
        break;
      case 2:
        displayMinute.textContent = "00";
        displayMinute.classList.remove("picking");
        break;
    }
  });
  clockCircle.addEventListener("mouseenter", function() {
    switch (displayBox.state) {
      case 1:
        displayHour.classList.add("picking");
        break;
      case 2:
        displayMinute.classList.add("picking");
        break;
    }
  });
  const updateDisplayBox = function(event) {
    const angle = getAngle(
      event.clientX || clockCircle.initX,
      event.clientY || clockCircle.initY,
      clockCircle.cx,
      clockCircle.cy);
    let mapAngle = -(angle) + 105
    if (mapAngle < 0) {
      mapAngle += 360
    }
    let hour = Math.floor(mapAngle / 30)
    if (hour === 0) {
      hour = 12
    }
    // 2階段狀態
    if (!displayBox.state) displayBox.state = 1;
    switch (displayBox.state) {
      case 1:
        displayHour.textContent = `${hour.toString().padStart(2, 0)}`;
        break;
      case 2:
        let value = (hour * 5);
        value = value == 60 ? 0 : value;
        displayMinute.textContent = `${value.toString().padStart(2, 0)}`;
        break;
      default:
        break;
    }
    // 高亮刻度
    clockCircle.nowMark = clockCircle.querySelector(`.markline:nth-child(${hour})`);
    if (clockCircle.nowMark.num != clockCircle.lastMark.num) {
      clockCircle.lastMark.classList.remove("hover");
      clockCircle.nowMark.classList.add("hover");
      clockCircle.lastMark = clockCircle.nowMark;
    }
  };
  clockCircle.addEventListener("mousemove", updateDisplayBox);
  clockCircle.addEventListener("click", updateDisplayBox);
  clockCircle.addEventListener("click", function(event) {
    switch (displayBox.state) {
      case 1:
        displayBox.state++;
        displayHour.classList.remove("picking");
        displayMinute.classList.add("picking");
        updateDisplayBox(event);
        break;
      case 2:
        // 關閉面板 寫入設定 重設點擊狀態 flash提示
        timeCheck.checked = false;
        displayBox.state = 1;
        displayMinute.classList.remove("picking");
        fadeOut(timeWindow.srcMatter, 1500, 0, 1);
        // 轉換為24小時制
        let hour = parseInt(displayHour.textContent);
        let minute = parseInt(displayMinute.textContent);
        hour = hour == 12 ? 0 : hour;
        hour += btn_ampm.isAM ? 0 : 12;
        // 排序arr_allMatter並寫入localStorage
        const m = arr_allMatter.find((m) => m.id == timeWindow.srcMatter.id);
        m.hour = hour;
        m.minute = minute;
        sortAllMatter();
        localStorage.setItem("allMatter", JSON.stringify(arr_allMatter));
        // 更新editor table
        minute = minute.toString().padStart(2, 0);
        timeWindow.srcMatter.querySelector(".time-area").textContent = `${hour}:${minute}`;
        updateEditor();
        updateTable();
        break;
      default:
        console.log("error switch");
        break;
    }
  });
  const getAngle = (x, y, cx, cy) => {
    const distY = cy - y;
    const distX = cx - x;
    const dist = Math.sqrt((Math.abs(distY) ** 2) + (Math.abs(distX) ** 2));
    const val = Math.abs(distY) / dist;
    const angle = Math.asin(val) * (180 / Math.PI);
    if (distX >= 0 && distY >= 0) //2
      return 180 - angle;
    else if (distX >= 0 && distY <= 0) // 3
      return 180 + angle;
    else if (distX <= 0 && distY >= 0) // 1
      return angle;
    else if (distX < 0 && distY < 0) // 4
      return 360 - angle;
    else {
      console.log("distX or distY is NaN");
      return 180;
    }
  };
  const sortAllMatter = function() {
    arr_allMatter.sort((m1, m2) => {
      let d1 = new Date(m1.year, m1.month, m1.date, m1.hour, m1.minute);
      let d2 = new Date(m2.year, m2.month, m2.date, m2.hour, m2.minute);
      return d1 - d2;
    });
  };
  btn_ampm.addEventListener("click", function() {
    this.isAM = !this.isAM;
    this.textContent = this.isAM ? "AM" : "PM";
  });
  const highlightSelf = function(event) {
    const thisCol = filterToClass(event.target, "col");
    if (row_date.focusDate) row_date.focusDate.classList.remove("focus");
    row_date.focusDate = thisCol;
    thisCol.classList.add("focus");
  };
  // 去除高亮
  editorCheck.addEventListener("change", function() {
    if (!editorCheck.checked) {
      row_date.focusDate.classList.remove("focus");
    }
  });
  const createDateElement = function(dateObj) {
    const ele_date = document.createElement("label");
    const ele_dateNum = document.createElement("div");
    const miniMatterBox = document.createElement("div");
    ele_date.setAttribute("for", "editor-check");
    ele_date.classList.add("col");
    ele_dateNum.classList.add("date-num");
    miniMatterBox.classList.add("mini-matter-box");
    ele_dateNum.textContent = dateObj.getDate();
    ele_date.appendChild(ele_dateNum);
    ele_date.appendChild(miniMatterBox);
    ele_date.addEventListener("click", highlightSelf);
    ele_date.addEventListener("click", openEditor);
    return ele_date;
  };
  const createMiniMatter = function(m) {
    const miniMatter = document.createElement("div");
    const timeArea = document.createElement("div");
    const textArea = document.createElement("div");
    miniMatter.classList.add("mini-matter");
    timeArea.classList.add("time-area");
    textArea.classList.add("text-area");
    timeArea.textContent = `${m.hour}:${m.minute.toString().padStart(2, 0)}`;
    textArea.textContent = m.matter.length > 4 ? `${m.matter.substring(0, 4)}...` : m.matter;
    miniMatter.appendChild(timeArea);
    miniMatter.appendChild(textArea);
    return miniMatter;
  };
  const makeCurrentMonth = function(monthOffset) {
    // 生成 該月1號 最後1號
    const obj_dateFirst = new Date(nowY, nowM + monthOffset, 1);
    const obj_dateLast = new Date(nowY, nowM + monthOffset + 1, 0);
    const thisM = obj_dateFirst.getMonth();
    const thisY = obj_dateFirst.getFullYear();
    // 計算最起始號 最結束號
    const startDate = 1 - (obj_dateFirst.getDay() - 0); /* 1號的星期 - 週日的星期(0) */
    const endDate = obj_dateLast.getDate() + (6 - obj_dateLast.getDay());
    // 繪製該月
    row_date.innerHTML = "";
    dateArray = [];
    for (let i = startDate; i <= endDate; i++) {
      const obj_date = new Date(nowY, nowM + monthOffset, i);
      const ele_date = createDateElement(obj_date);
      if (i < 1 || i > obj_dateLast.getDate()) {
        ele_date.classList.add("other-month-color");
      }
      ele_date.myDate = obj_date;
      ele_date.matters = [];
      dateArray.push(ele_date);
      row_date.appendChild(ele_date);
    }
    // 載入mini matter
    const obj_startDate = new Date(thisY, thisM, startDate);
    const obj_endDate = new Date(thisY, thisM, endDate);
    arr_allMatter.filter((matter) => {
      const obj_matterDate = new Date(matter.year, matter.month, matter.date);
      return obj_startDate <= obj_matterDate && obj_matterDate <= obj_endDate;
    }).forEach(m => {
      const obj_matterDate = new Date(m.year, m.month, m.date);
      const mIndex = Math.round((obj_matterDate - obj_dateFirst) / 86400000) + 1 - startDate;
      dateArray[mIndex].querySelector(".mini-matter-box").appendChild(createMiniMatter(m));
    });
    // 高亮今天
    if (obj_dateFirst.getMonth() === nowM && obj_dateFirst.getFullYear() === nowY) {
      dateArray[nowD - startDate].classList.add("today-color");
    }
    // 更新年月
    monthName.innerHTML = `${thisM + 1}月&nbsp;&nbsp;&nbsp;${monthNameArray[thisM]}`;
    yearName.textContent = obj_dateFirst.getFullYear();
  };
  // CRUD matter
  const updateTable = function() {
    // alias
    const miniMatterBox = row_date.focusDate.querySelector(".mini-matter-box");
    const thisD = row_date.focusDate.myDate.getDate();
    const thisM = row_date.focusDate.myDate.getMonth();
    const thisY = row_date.focusDate.myDate.getFullYear();
    // 先刪除所有mini-matter
    miniMatterBox.querySelectorAll(".mini-matter").forEach((ele) => {
      ele.remove();
    });
    // 從arr_allMatter加入
    arr_allMatter.filter((m) => {
      // if日期相同就加進來
      return m.date == thisD && m.month == thisM && m.year == thisY;
    }).forEach((m) => {
      miniMatterBox.appendChild(createMiniMatter(m));
    });
  };
  const updateEditor = function() {
    // 對editor中matter依時間排序
    const matterList = [...matterBox.querySelectorAll(".matter")];
    matterList.sort((m1, m2) => {
      const time1 = m1.querySelector(".time-area").textContent.replace(":", ".");
      const time2 = m2.querySelector(".time-area").textContent.replace(":", ".");
      return time1 - time2;
    }).forEach(ele => {
      matterBox.appendChild(ele);
    });
  }
  const deleteMatter = function() {
    // 更新all_allMatter陣列
    const targetIndex = arr_allMatter.findIndex(m => m.id == this.parentElement.id);
    arr_allMatter.splice(targetIndex, 1);
    // 再寫入localStorage
    localStorage.setItem("allMatter", JSON.stringify(arr_allMatter));
    // 更新表格並刪除在editor中的自己
    updateTable();
    this.parentElement.remove();
  };
  const addMatter = function() {
    const newMatter = document.createElement("div");
    // if首次訪問，給予雙擊提示
    if (localStorage.getItem("haveVisited") != "true") {
      newMatter.setAttribute("title", "雙擊編輯");
    }
    newMatter.classList.add("matter", "editing");
    // 時間與編輯區
    const timeArea = document.createElement("div");
    const textArea = document.createElement("input");
    timeArea.classList.add("time-area");
    textArea.classList.add("text-area");
    textArea.value = "事項";
    // 圖標區
    const btn_delete = document.createElement("i");
    const btn_clock = document.createElement("label");
    btn_clock.setAttribute("for", "time-picker-check");
    btn_delete.classList.add("in-btn", "fas", "fa-trash");
    btn_clock.classList.add("in-btn", "fas", "fa-clock");
    btn_delete.addEventListener("click", deleteMatter);
    btn_clock.addEventListener("click", openTimePicker);
    // 雙擊編輯
    newMatter.addEventListener("dblclick", function() {
      newMatter.classList.add("editing");
      textArea.removeAttribute("readonly");
      textArea.select();
      // 使用者已知雙擊可編輯
      localStorage.setItem("haveVisited", "true");
    });
    // 失焦
    textArea.addEventListener("blur", function(event) {
      // 首先處理文字內容
      this.value = this.value.trim();
      // alias
      const thisDate = row_date.focusDate;
      if (this.value.length == 0) {
        // if空白時自刪
        // 從arr_allMatter中刪除
        const targetIndex = arr_allMatter.findIndex(m => m.id == newMatter.id);
        arr_allMatter.splice(targetIndex, 1);
        // 從editor上刪除
        newMatter.remove();
      } else {
        // if內容非空
        // 去除編輯狀態
        window.getSelection().removeAllRanges();
        this.setAttribute("readonly", "");
        newMatter.classList.remove("editing");
        if (this.isCreated !== true) {
          // if增matter
          // 建立 matter 物件
          const id = Date.now();
          const obj_now = new Date(id);
          const obj_matter = {
            id: id,
            year: thisDate.myDate.getFullYear(),
            month: thisDate.myDate.getMonth(),
            date: thisDate.myDate.getDate(),
            hour: obj_now.getHours(),
            minute: obj_now.getMinutes(),
            matter: this.value,
          };
          // 綁定id
          newMatter.id = id;
          // 失焦後加入時間顯示
          timeArea.textContent = `${obj_matter.hour}:${obj_matter.minute.toString().padStart(2, 0)}`;
          newMatter.insertBefore(timeArea, this);
          arr_allMatter.push(obj_matter);
          // 更新editor並排序資料
          updateEditor();
          sortAllMatter();
        } else {
          // if改matter文字內容
          const targetIndex = arr_allMatter.findIndex(m => m.id == newMatter.id);
          arr_allMatter[targetIndex].matter = this.value;
        }
      }
      // 寫進localStorage
      localStorage.setItem("allMatter", JSON.stringify(arr_allMatter));
      // 更新表格
      updateTable();
      // 最後改為已創建狀態
      this.isCreated = true;
    });
    // 按Enter結束編輯
    textArea.addEventListener("keydown", enterComplete);
    newMatter.appendChild(textArea);
    newMatter.appendChild(btn_clock);
    newMatter.appendChild(btn_delete);
    matterBox.appendChild(newMatter);
    textArea.select();
  };
  const loadMatter = function(obj_matter) {
    const newMatter = document.createElement("div");
    newMatter.classList.add("matter");
    // 重新綁定id
    newMatter.id = obj_matter.id;
    // 時間與編輯區
    const timeArea = document.createElement("div");
    const textArea = document.createElement("input");
    textArea.setAttribute("readonly", "");
    timeArea.classList.add("time-area");
    textArea.classList.add("text-area");
    textArea.value = obj_matter.matter;
    timeArea.textContent = `${obj_matter.hour}:${obj_matter.minute.toString().padStart(2, 0)}`;
    // 圖標區
    const btn_delete = document.createElement("i");
    const btn_clock = document.createElement("label");
    btn_clock.setAttribute("for", "time-picker-check");
    btn_delete.classList.add("in-btn", "fas", "fa-trash");
    btn_clock.classList.add("in-btn", "fas", "fa-clock");
    btn_delete.addEventListener("click", deleteMatter);
    btn_clock.addEventListener("click", openTimePicker);
    // 雙擊編輯
    newMatter.addEventListener("dblclick", function() {
      newMatter.classList.add("editing");
      textArea.removeAttribute("readonly");
      textArea.select();
    });
    // 失焦
    textArea.addEventListener("focusout", function(event) {
      // 首先處理文字內容
      this.value = this.value.trim();
      if (this.value.length == 0) {
        // if空白時自刪
        // 從arr_allMatter中刪除
        const targetIndex = arr_allMatter.findIndex(m => m.id == newMatter.id);
        arr_allMatter.splice(targetIndex, 1);
        // 從editor上刪除
        newMatter.remove();
      } else {
        // if內容非空 改matter
        // 去除編輯狀態
        window.getSelection().removeAllRanges();
        this.setAttribute("readonly", "");
        newMatter.classList.remove("editing");
        // 更新arr_allMatter
        const targetIndex = arr_allMatter.findIndex(m => m.id == newMatter.id);
        arr_allMatter[targetIndex].matter = this.value;
      }
      // 寫進localStorage
      localStorage.setItem("allMatter", JSON.stringify(arr_allMatter));
      // 更新表格
      updateTable();
    });
    textArea.addEventListener("keydown", enterComplete);
    newMatter.appendChild(timeArea);
    newMatter.appendChild(textArea);
    newMatter.appendChild(btn_clock);
    newMatter.appendChild(btn_delete);
    matterBox.appendChild(newMatter);
  };
  const enterComplete = function(event) {
    if (event.key == "Enter") {
      this.blur();
    }
  };
  // 點擊周圍關閉editor
  editor.addEventListener("mousedown", function() {
    editorCheck.click();
  });
  // 阻止冒泡
  editorWindow.addEventListener("mousedown", function(event) {
    event.stopPropagation();
  });
  // binding
  const changeMonth = function(event) {
    fadeOut(tableBody, 100, 0, 1);
    monthOffset += parseInt(event.target.getAttribute("data-offset"));
    makeCurrentMonth(monthOffset);
  };
  const resetMonth = function(event) {
    fadeOut(tableBody, 100, 0, 1);
    monthOffset = parseInt(event.target.getAttribute("data-offset"));
    makeCurrentMonth(monthOffset);
  };
  row_title.querySelectorAll(".arrow").forEach((ele) => {
    ele.addEventListener("click", changeMonth);
  });
  row_title.querySelector(".reset").addEventListener("click", resetMonth);
  editorWindow.querySelector(".add").addEventListener("click", addMatter);
  // 初始設定
  (function() {
    let i = 1;
    const allMark = document.querySelectorAll(".mark-group .markline");
    for (let i = 0; i < allMark.length; i++) {
      allMark[i].num = i + 1;
    }
    clockCircle.lastMark = allMark[0];
    clockCircle.lastMark.classList.add("hover");
  })();
  // 初始化本月
  makeCurrentMonth(0);
})();