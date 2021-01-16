"use strict";
// 定義物件區
const btn_start = document.querySelector(".setting .start");
const btn_restart = document.querySelector(".setting .restart");
const btn_goHome = document.querySelector(".setting .go-home");
const btn_changeBG = document.querySelector(".setting .change-bg");
const img_blocks = document.querySelectorAll(".img-block");
const difficulty = {
  ele: document.querySelector("#difficulty"),
  previewGrid: function() {
    // 設定邊長格數
    box.sideUnit = parseInt(difficulty.ele.value);
    // 設定畫面
    box.clearBox();
    box.createCell();
    document.getElementById("img_answer").src = box.bg;
  },
};
const box = {
  ele: document.querySelector(".box"),
  width: 600,
  sideUnit: 4,
  isPlaying: false,
  gridArray: [],
  cellArray: [],
  nearCellArray: [],
  blankCell: null,
  lastClickCell: null,
  goHomeStack: [],
  getCellWidth: function() {
    return box.width / box.sideUnit;
  },
  bg: "https://picsum.photos/600/600/?random=0",
  bgSeed: 0,
  clearBox: function() {
    box.ele.innerHTML = "";
    box.cellArray = [];
    box.gridArray = [];
  },
  createCell: function() {
    for (let i = 0; i < box.sideUnit ** 2; i++) {
      const cell = document.createElement("div");
      const w = box.getCellWidth();
      cell.index = i;
      cell.classList.add("cell");
      // 設定cell寬高
      cell.style.width = `${w}px`;
      cell.style.height = `${w}px`;
      // 設定 top left 距離
      const topUnit = Math.trunc(cell.index / box.sideUnit);
      const leftUnit = Math.trunc(cell.index % box.sideUnit);
      cell.style.top = `${topUnit * w}px`;
      cell.style.left = `${leftUnit * w}px`;
      // 設定背景src & background-position
      cell.style["background-image"] = `url(${box.bg})`;
      cell.style["background-position"] = `${-leftUnit * w}px ${-topUnit * w}px`;
      box.ele.appendChild(cell);
      box.cellArray.push(cell);
    }
    // 將一維的cellArray寫入2維座標
    for (let i = 0; i < box.sideUnit; i++) {
      for (let j = 0; j < box.sideUnit; j++) {
        const index = box.sideUnit * i + j;
        box.cellArray[index].row = i;
        box.cellArray[index].col = j;
      }
    }
    // 二維陣列
    for (let i = 0; i < box.sideUnit; i++) {
      const row = [];
      for (let j = 0; j < box.sideUnit; j++) {
        row.push(box.cellArray[i * box.sideUnit + j]);
        // 圖上顯示座標
        // box.cellArray[i * box.sideUnit + j].textContent = `${i}, ${j}`;
      }
      box.gridArray.push(row);
    }
    // gridArray寫入2維座標
    for (let i = 0; i < box.sideUnit; i++) {
      for (let j = 0; j < box.sideUnit; j++) {
        box.gridArray[i][j].row = i;
        box.gridArray[i][j].col = j;
      }
    }
    // 空白格
    const end = box.sideUnit - 1;
    box.blankCell = box.gridArray[end][end];
    box.blankCell.classList.add("blank");
  },
  start: function() {
    // 開始後設定
    difficulty.ele.setAttribute("disabled", "");
    btn_start.setAttribute("disabled", "");
    box.blankCell.classList.remove("fadeInDelay");
    box.blankCell.style["opacity"] = "0";
    // 首次設定周圍可點擊
    box.setCellClick();
    // 洗牌: 設定定時器隨機點擊nearCellArray內任意一個cell
    box.disableCellClick();
    // 開始洗牌
    let i = 0;
    const shuffleCount = box.sideUnit ** 2 * 6;
    setTimeout(() => {
      const shuffleTimer = setInterval(() => {
        i++;
        // 隨幾產生相nearCellArray範圍內的下標 並點擊
        const randomIndex = Math.trunc(Math.random() * box.nearCellArray.length);
        box.nearCellArray[randomIndex].click();
        box.goHomeStack.push(box.lastClickCell);
        // 從nearCellArray中移除上一次點擊的cell，不回頭
        const lastIndex = box.nearCellArray.indexOf(box.lastClickCell);
        const backCell = box.nearCellArray.splice(lastIndex, 1);
        // 計數n次後中止洗牌
        if (i >= shuffleCount) {
          clearInterval(shuffleTimer);
          box.enableCellClick();
          // 更改遊戲狀態為遊玩中
          box.isPlaying = true;
          btn_goHome.removeAttribute("disabled", "");
          btn_restart.removeAttribute("disabled", "");
          // 補回最後一次移除的nearCellArray
          box.nearCellArray.splice(lastIndex, 0, ...backCell);
        }
      }, 50);
    }, 300);
  },
  // 設定透明cell周圍可點擊
  setCellClick: function() {
    // 設定周圍按鈕前判定是否已成功(遊玩中才判定)，若成功則結束遊戲，不設定按鈕
    const nearCellArray = [];
    for (let i = 0; i < box.cellArray.length; i++) {
      const rowDiff = box.blankCell.row - box.cellArray[i].row;
      const colDiff = box.blankCell.col - box.cellArray[i].col;
      const isNear = Math.abs(rowDiff) + Math.abs(colDiff) == 1;
      // 將周圍cell設為可點擊
      if (isNear) {
        box.cellArray[i].addEventListener("click", box.changeTwoCell);
        box.cellArray[i].addEventListener("click", box.setCellClick);
        box.cellArray[i].classList.add("pointer");
        nearCellArray.push(box.cellArray[i]);
      } else {
        box.cellArray[i].removeEventListener("click", box.changeTwoCell);
        box.cellArray[i].removeEventListener("click", box.setCellClick);
        box.cellArray[i].classList.remove("pointer");
      }
    }
    // 更新相鄰cell清單
    box.nearCellArray = nearCellArray;
    if (box.isPlaying) {
      box.checkSuccess();
      // 去除來回點擊
      if (box.goHomeStack[box.goHomeStack.length - 1] === box.lastClickCell) {
        console.log("===");
        box.goHomeStack.pop();
      } else {
        box.goHomeStack.push(box.lastClickCell);
      }
    }
  },
  changeTwoCell: function(event) {
    const cell = event.target;
    // 交換row col編號
    [cell.row, box.blankCell.row] = [box.blankCell.row, cell.row];
    [cell.col, box.blankCell.col] = [box.blankCell.col, cell.col];
    // 交換與透明cell的顯示位置(top, left)
    [cell.style.top, box.blankCell.style.top] = [box.blankCell.style.top, cell.style.top];
    [cell.style.left, box.blankCell.style.left] = [box.blankCell.style.left, cell.style.left];
    // 上一次點擊的cell
    box.lastClickCell = cell;
  },
  checkSuccess: function() {
    if (box.isSuccess()) {
      box.resetGame();
    }
  },
  isSuccess: function() {
    for (let i = 0; i < box.sideUnit; i++) {
      for (let j = 0; j < box.sideUnit; j++) {
        if (box.gridArray[i][j].row != i || box.gridArray[i][j].col != j) {
          return false;
        }
      }
    }
    return true;
  },
  disableCellClick: function() {
    // 將所有cell移到下層防止使用者點擊
    box.gridArray.forEach(row => {
      row.forEach(ele => {
        ele.classList.add("dontClick");
      });
    });
  },
  enableCellClick: function() {
    // 恢復到上層可被點擊
    box.gridArray.forEach(row => {
      row.forEach(ele => {
        ele.classList.remove("dontClick");
      });
    });
  },
  resetGame: function() {
    // 移除nearCellArray所有cell的可點擊狀態
    box.nearCellArray.forEach((ele) => {
      ele.removeEventListener("click", box.changeTwoCell);
      ele.removeEventListener("click", box.setCellClick);
      ele.classList.remove("pointer");
    });
    // 恢復遊戲初始狀態
    box.blankCell.classList.add("fadeInDelay");
    box.blankCell.style["opacity"] = "1";
    box.isPlaying = false;
    difficulty.ele.removeAttribute("disabled", "");
    btn_start.removeAttribute("disabled", "");
    btn_restart.setAttribute("disabled", "");
    btn_goHome.setAttribute("disabled", "");
  }
};
// 定義函數區
const changeBG = function() {
  btn_start.setAttribute("disabled", "");
  box.bg = `https://picsum.photos/600/600/?random=${++box.bgSeed}`;
  // 顯示載入動畫
  img_blocks.forEach(ele => {
    const loadingBlock = ele.querySelector(".loading");
    loadingBlock.style.display = "flex";
    console.log("showing");
  });
  // 換圖的url
  img_blocks[1].querySelector("#img_answer").src = box.bg;
  box.ele.querySelectorAll(".cell").forEach(ele => {
    ele.style["background-image"] = `url(${box.bg})`;
  });
};
img_blocks[1].querySelector("#img_answer").addEventListener("load", function() {
  btn_changeBG.requestID = [];
  for (let i = 0; i < 2; i++) {
    const loadingBlock = img_blocks[i].querySelector(".loading");
    let start = null;
    const fadeOut = (timestamp, duration = 300) => {
      if (!start) start = timestamp;
      let progress = timestamp - start;
      loadingBlock.style.opacity = Math.max((duration - progress), 0) / duration;
      if (progress < duration) {
        btn_changeBG.requestID[i] = requestAnimationFrame(fadeOut);
      } else {
        loadingBlock.style.display = "none";
        loadingBlock.style.opacity = "1";
        if (!box.isPlaying) {
          btn_start.removeAttribute("disabled");
        }
      }
    };
    btn_changeBG.requestID[i] = requestAnimationFrame(fadeOut);
  }
});
const getScore = function() {
  let totalDiff = 0;
  for (let i = 0; i < box.sideUnit; i++) {
    for (let j = 0; j < box.sideUnit; j++) {
      const rDiff = Math.abs(box.gridArray[i][j].row - i);
      const cDiff = Math.abs(box.gridArray[i][j].col - j);
      totalDiff += rDiff + cDiff;
    }
  }
  return totalDiff;
};
const goHome = function() {
  // 結束遊戲狀態
  btn_goHome.setAttribute("disabled", "");
  btn_restart.setAttribute("disabled", "");
  box.disableCellClick();
  box.isPlaying = false;
  const range_speed = document.querySelector(".range-speed");
  range_speed.removeAttribute("disabled");
  // 拷貝回家堆疊並清除
  const stack = [...box.goHomeStack];
  box.goHomeStack = [];
  let t = 200;
  const popCell = () => {
    (stack.pop()).click();
    if (stack.length <= 0) {
      range_speed.setAttribute("disabled", "");
      box.resetGame();
      return;
    }
    t = -range_speed.value + 1050;
    setTimeout(popCell, t);
  }
  console.log(range_speed.value);
  setTimeout(popCell, t);
};
// binding
btn_start.addEventListener("click", box.start);
btn_goHome.addEventListener("click", goHome);
btn_changeBG.addEventListener("click", changeBG);
btn_changeBG.addEventListener("click", function() {
  img_blocks.forEach(ele => {
    const loadingBlock = ele.querySelector(".loading");
    loadingBlock.style.display = "flex";
    loadingBlock.style.opacity = "1";
  });
  for (let i = 0; i < 2; i++) {
    cancelAnimationFrame(btn_changeBG.requestID[i]);
  }
});
btn_restart.addEventListener("click", difficulty.previewGrid);
btn_restart.addEventListener("click", function() {
  box.isPlaying = false;
  box.goHomeStack = [];
  difficulty.ele.removeAttribute("disabled", "");
  btn_start.removeAttribute("disabled", "");
  btn_goHome.setAttribute("disabled", "");
  this.setAttribute("disabled", "");
});
// main
difficulty.previewGrid();
// 切換難度 生成網格
difficulty.ele.addEventListener("change", difficulty.previewGrid);