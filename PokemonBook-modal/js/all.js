"use strict";
let allPokemonArray = [];

const row = document.querySelector(".main .row");
// 主要4按鈕
const btn_addOne = document.querySelector("#btn_add-one");
const btn_removeOne = document.querySelector("#btn_remove-one");
const btn_addAll = document.querySelector("#btn_add-all");
const btn_removeAll = document.querySelector("#btn_remove-all");
// 卡模板
const card = document.querySelector("#card-template");
// modal區
const modal = document.querySelector("#detailModal");

const modal_X = modal.querySelector(".btn-close");
const modal_pic = modal.querySelector(".pic");
const modal_title = modal.querySelector(".modal-title");
const modal_img = modal.querySelector(".pokemonImg");

const Hp = modal.querySelector(".attr.Hp");
const Hp_valueBar = modal.querySelector(".attr.Hp + .value-bar");
const Attack = modal.querySelector(".attr.Attack");
const Attack_valueBar = modal.querySelector(".attr.Attack + .value-bar");
const Defense = modal.querySelector(".attr.Defense");
const Defense_valueBar = modal.querySelector(".attr.Defense + .value-bar");
const SpecialAttack = modal.querySelector(".attr.SpecialAttack");
const SpecialAttack_valueBar = modal.querySelector(".attr.SpecialAttack + .value-bar");
const SpecialDefense = modal.querySelector(".attr.SpecialDefense");
const SpecialDefense_valueBar = modal.querySelector(".attr.SpecialDefense + .value-bar");
const Speed = modal.querySelector(".attr.Speed");
const Speed_valueBar = modal.querySelector(".attr.Speed + .value-bar");

let globalIndex = -1;

window.onload = function () {
  getAllPokemon();
};

const getAllPokemon = function () {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://raw.githubusercontent.com/apprunner/pokemon.json/master/pokedex.json", true);
  xhttp.send();
  xhttp.addEventListener("load", function () {
    allPokemonArray = transformText(xhttp.responseText);
  });
};

const transformText = function (text) {
  const arr = JSON.parse(text);
  const newArr = arr.map((item) => {
    return {
      img: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${item.id.toString().padStart(3, "0")}.png`,
      type: item.type,
      id: item.id,
      name: item.name.english,
      Attack: item.base.Attack,
      Defense: item.base.Defense,
      Hp: item.base.HP,
      "Sp. Attack": item.base["Sp. Attack"],
      "Sp. Defense": item.base["Sp. Defense"],
      Speed: item.base.Speed,
    };
  });
  return newArr;
};

btn_addOne.onclick = addOne;
btn_removeOne.onclick = removeOne;
btn_addAll.onclick = addAll;
btn_removeAll.onclick = removeAll;
modal.addEventListener("hide.bs.modal", resetModal);

function addOne() {
  let success;
  if (globalIndex + 1 < allPokemonArray.length) {
    // 加卡片
    globalIndex++;
    const newPokemon = allPokemonArray[globalIndex];
    const newCard = card.content.cloneNode(true);

    newCard.querySelector(".pokemonImg").setAttribute("src", newPokemon.img);
    newCard.querySelector(".pokemonId").innerText = `#${newPokemon.id.toString().padStart(3, "0")}`;
    newCard.querySelector(".pokemonName").innerText = newPokemon.name;

    // 綁定詳細資料按鈕
    const btn_showData = newCard.querySelector(".btn");
    btn_showData.setAttribute("data-global-index", `${globalIndex}`);
    // btn_showData.onclick = putData;
    modal.addEventListener("shown.bs.modal", putData);

    row.appendChild(newCard);
    success = true;
  } else {
    console.log("已達上限");
    success = false;
  }
  return success;
}
function removeOne() {
  if (globalIndex >= 0) {
    globalIndex--;
    console.log(row.lastElementChild);
    row.removeChild(row.lastElementChild);
  } else {
    console.log("已達下限");
  }
}
function addAll() {
  removeAll();
  while (addOne()) {}
  console.log("addAllOver");
}
function removeAll() {
  globalIndex = -1;
  row.innerHTML = "";
}
function putData(event) {
  const thisPokemon = allPokemonArray[event.relatedTarget.getAttribute("data-global-index")];
  // data
  modal_img.src = thisPokemon.img;
  modal_title.innerText = thisPokemon.name;
  Hp.innerText = `HP: ${thisPokemon["Hp"]}`;
  Attack.innerText = `Attack: ${thisPokemon["Attack"]}`;
  Defense.innerText = `Defense: ${thisPokemon["Defense"]}`;
  SpecialAttack.innerText = `Special Attack: ${thisPokemon["Sp. Attack"]}`;
  SpecialDefense.innerText = `Special Defense: ${thisPokemon["Sp. Defense"]}`;
  Speed.innerText = `Speed: ${thisPokemon["Speed"]}`;
  // types
  const tagBox = document.createElement("div");
  tagBox.classList.add("tagBox");
  thisPokemon.type.forEach((item) => {
    const tag = document.createElement("span");
    tag.classList.add("pokemonType", `${item}`);
    tag.innerText = item;
    tagBox.appendChild(tag);
  });
  modal_pic.appendChild(tagBox);
  // value bar
  const ratioBase = 190;
  Hp_valueBar.style.width = `${(thisPokemon["Hp"] / ratioBase) * 100}%`;
  Attack_valueBar.style.width = `${(thisPokemon["Attack"] / ratioBase) * 100}%`;
  Defense_valueBar.style.width = `${(thisPokemon["Defense"] / ratioBase) * 100}%`;
  SpecialAttack_valueBar.style.width = `${(thisPokemon["Sp. Attack"] / ratioBase) * 100}%`;
  SpecialDefense_valueBar.style.width = `${(thisPokemon["Sp. Defense"] / ratioBase) * 100}%`;
  Speed_valueBar.style.width = `${(thisPokemon["Speed"] / ratioBase) * 100}%`;
}
function resetModal() {
  modal.querySelectorAll(".value-bar").forEach((item) => {
    item.style.width = 0;
  });
  modal.querySelector(".tagBox").remove();
}
