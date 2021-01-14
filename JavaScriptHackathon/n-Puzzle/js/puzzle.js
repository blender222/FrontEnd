"use strict";
const blankCell = document.querySelector(".box .cell.blank");

const box = {
  element: document.querySelector(".box"),
  totalWidth: 600,
  totalHeight: 600,
  cells: 3,
  quantity: this.cells ** 2,
  gridCell: [],
  blankCell: null,
  // generatePuzzle: function () {
  //   for (let i = 0; i < this.puzzleQuantity; i++) {
  //     const cell = document.createElement("div");
  //     cell.classList.add("cell");
  //     this.allCell.push(cell);
  //   }
  // },
};
// 分割成2維陣列
(function () {
  const allCell = [...document.querySelectorAll(".box .cell")];
  for (let i = 0; i < box.cells; i++) {
    const row = allCell.slice(box.cells * i, box.cells * (i + 1));
    box.gridCell.push(row);
  }
})();
// 設定每個cell的background-position & top left & x y 座標
(function () {
  const cellWidth = box.totalWidth / box.cells;
  const cellHeight = box.totalHeight / box.cells;
  for (let i = 0; i < box.gridCell.length; i++) {
    for (let j = 0; j < box.gridCell[i].length; j++) {
      box.gridCell[i][j].style["background-position"] = `${-cellWidth * j}px ${-cellHeight * i}px`;
      box.gridCell[i][j].style["left"] = `${cellWidth * j}px`;
      box.gridCell[i][j].style["top"] = `${cellHeight * i}px`;
      box.gridCell[i][j].x = j;
      box.gridCell[i][j].y = i;
    }
  }
  // 設定空白元素
  box.blankCell = box.gridCell[box.cells - 1][box.cells - 1];
})();
// 設定每個cell的按鈕
const setAllCell = function () {
  const cellWidth = box.totalWidth / box.cells;
  const cellHeight = box.totalHeight / box.cells;
  for (let i = 0; i < box.gridCell.length; i++) {
    for (let j = 0; j < box.gridCell[i].length; j++) {
      const cell = box.gridCell[i][j];
      const blankCell = box.blankCell;
      const xDiff = blankCell.x - cell.x;
      const yDiff = blankCell.y - cell.y;
      const isNear = Math.abs(xDiff) + Math.abs(yDiff) == 1;
      if (isNear) {
        cell.onclick = function () {
          // console.log(box.gridCell[i][j], box.gridCell[blankCell.y][blankCell.x]);
          // 交換二維陣列位置
          [box.gridCell[i][j], box.gridCell[blankCell.y][blankCell.x]] = [box.gridCell[blankCell.y][blankCell.x], box.gridCell[i][j]];
          // console.log(box.gridCell[i][j], box.gridCell[blankCell.y][blankCell.x]);
          // 交換 x y
          [this.x, blankCell.x] = [blankCell.x, this.x];
          [this.y, blankCell.y] = [blankCell.y, this.y];
          // 交換 top left 位置
          this.style.left = `${parseInt(this.style.left) + cellWidth * xDiff}px`;
          this.style.top = `${parseInt(this.style.top) + cellHeight * yDiff}px`;
          blankCell.style.left = `${parseInt(blankCell.style.left) - cellWidth * xDiff}px`;
          blankCell.style.top = `${parseInt(blankCell.style.top) - cellHeight * yDiff}px`;

          setAllCell();
        };
        cell.style.cursor = "pointer";
      } else {
        cell.onclick = null;
        cell.style.cursor = "default";
      }
    }
  }
};
setAllCell();

