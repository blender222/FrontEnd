"use strict";
// 定義物件區
const btn_start = document.querySelector(".box_difficulty .start");
const difficulty = {
  element: document.querySelector(".box_difficulty #difficulty"),
  previewGrid: function () {
    // 設定邊長格數
    box.sideLength = parseInt(difficulty.element.value);
    // 設定畫面
    box.createCell();
  },
};
const box = {
  element: document.querySelector(".box"),
  width: 600,
  sideLength: 4,
  cellArray: [],
  nearCellArray: [],
  lastClickCell: null,
  isPlaying: false,
  getCellWidth: function () {
    return box.width / box.sideLength;
  },
  bg: "https://i.picsum.photos/id/1059/600/600.jpg?hmac=dcI2tdmoiTwbxMjmWrtO5TuRHRwPho50YlFMyIptCh8",
  clear: function () {
    box.element.innerHTML = "";
    box.cellArray = [];
  },
  createCell: function () {
    box.clear();
    for (let i = 0; i < box.sideLength ** 2; i++) {
      const cell = document.createElement("div");
      // 縮寫
      const w = box.getCellWidth();
      // 寫入下標
      cell.index = i;
      // 套上樣式
      cell.classList.add("cell");
      // 設定cell寬高
      cell.style.width = `${w}px`;
      cell.style.height = `${w}px`;
      // 設定 top left 距離
      const topUnit = Math.trunc(cell.index / box.sideLength);
      const leftUnit = Math.trunc(cell.index % box.sideLength);
      cell.style.top = `${topUnit * w}px`;
      cell.style.left = `${leftUnit * w}px`;
      // 設定背景src & background-position
      cell.style["background-image"] = `url(${box.bg})`;
      cell.style["background-position"] = `${-leftUnit * w}px ${-topUnit * w}px`;
      // 放入box與陣列
      box.element.appendChild(cell);
      box.cellArray.push(cell);
    }
  },
  start: function () {
    // 設定右下角透明
    const blankCell = box.cellArray[box.cellArray.length - 1];
    blankCell.style["opacity"] = "0.3";
    // 寫入2維座標
    for (let i = 0; i < box.sideLength; i++) {
      for (let j = 0; j < box.sideLength; j++) {
        const index = box.sideLength * i + j;
        box.cellArray[index].row = i;
        box.cellArray[index].col = j;
      }
    }
    box.setCellClick();
    // 洗牌: 設定定時器隨機點擊nearCellArray內任意一個cell
    (function () {
      // 將所有cell移到下層防止使用者點擊
      box.cellArray.forEach((element) => {
        element.classList.add("dontClick");
      });
      let i = 0;
      const shuffle = setInterval(() => {
        i++;
        // 隨幾產生相nearCellArray範圍內的下標 並點擊
        const randomIndex = Math.trunc(Math.random() * box.nearCellArray.length);
        box.nearCellArray[randomIndex].click();
        // 從nearCellArray中移除上一次點擊的cell，不回頭
        const lastIndex = box.nearCellArray.indexOf(box.lastClickCell);
        const backCell = box.nearCellArray.splice(lastIndex, 1);
        // 計數n次
        if (i >= 50) {
          // 結束後恢復到上層
          box.cellArray.forEach((element) => {
            element.classList.remove("dontClick");
          });
          // 更改遊戲狀態為遊玩中
          box.isPlaying = true;
          // 補回最後一次移除的nearCellArray
          box.nearCellArray.splice(lastIndex, 0, ...backCell);
          // n次後中止洗牌
          clearInterval(shuffle);
        }
      }, 100);
    })();
  },
  // 設定透明cell周圍可點擊
  setCellClick: function () {
    // 設定周圍按鈕前判定是否已成功(遊玩中才判定)，若成功則結束遊戲，不設定按鈕
    const nearCellArray = [];
    const blankCell = box.cellArray[box.cellArray.length - 1];
    if (box.isPlaying && box.isSuccess()) {
      // 移除nearCellArray所有cell的可點擊狀態
      box.nearCellArray.forEach((element) => {
        element.removeEventListener("click", box.changeTwoCell);
        element.removeEventListener("click", box.setCellClick);
        element.classList.remove("pointer");
      });
      // 恢復透明cell為可見
      blankCell.style["opacity"] = "1";
      // 更改遊戲狀態
      box.isPlaying = false;
      return;
    }
    for (let i = 0; i < box.cellArray.length; i++) {
      const rowDiff = blankCell.row - box.cellArray[i].row;
      const colDiff = blankCell.col - box.cellArray[i].col;
      const isNear = Math.abs(rowDiff) + Math.abs(colDiff) == 1;
      if (isNear) {
        // 綁定該cell點擊事件，交換兩個cell並重設周圍可點擊cell
        box.cellArray[i].addEventListener("click", box.changeTwoCell);
        box.cellArray[i].addEventListener("click", box.setCellClick);
        // 加上按鈕鼠標
        box.cellArray[i].classList.add("pointer");
        // 加進相鄰cell清單
        nearCellArray.push(box.cellArray[i]);
      } else {
        // 移除該cell點擊事件
        box.cellArray[i].removeEventListener("click", box.changeTwoCell);
        box.cellArray[i].removeEventListener("click", box.setCellClick);
        // 移除按鈕鼠標
        box.cellArray[i].classList.remove("pointer");
      }
    }
    // 更新相鄰cell清單
    box.nearCellArray = nearCellArray;
  },
  changeTwoCell: function () {
    const blankCell = box.cellArray[box.cellArray.length - 1];
    // 交換row col編號
    [this.row, blankCell.row] = [blankCell.row, this.row];
    [this.col, blankCell.col] = [blankCell.col, this.col];
    // 交換與透明cell的顯示位置(top, left)
    [this.style.top, blankCell.style.top] = [blankCell.style.top, this.style.top];
    [this.style.left, blankCell.style.left] = [blankCell.style.left, this.style.left];
    // 上一次點擊的cell
    box.lastClickCell = this;
    // 交換後檢查是否成功
  },
  isSuccess: function () {
    for (let i = 0; i < box.sideLength; i++) {
      for (let j = 0; j < box.sideLength; j++) {
        const index = box.sideLength * i + j;
        if (box.cellArray[index].row !== i || box.cellArray[index].col !== j) {
          console.log("not success");
          return false;
        }
      }
    }
    console.log("success");
    return true;
  },
};

// 定義函數區

// 立即執行
// 顯示設定難度網格
difficulty.previewGrid();

// 綁定
// 切換難度 生成網格
difficulty.element.addEventListener("change", difficulty.previewGrid);
// 開始按鈕 工作: 洗牌
btn_start.addEventListener("click", box.start);
