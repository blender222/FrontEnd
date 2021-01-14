// 自定義圖片
(function () {
  const setImg = document.querySelector(".setting .box_custom-img .setImg");
  const url = document.querySelector(".setting .box_custom-img .url");
  const cells = document.querySelectorAll(".box .cell");
  setImg.addEventListener("click", function () {
    console.log(cells);
    cells.forEach(element => {
      element.style["background-image"] = `url(${url.value})`;
      console.log("setting");
    });
  });
})();

"https://picsum.photos/600/600/?random=1";
