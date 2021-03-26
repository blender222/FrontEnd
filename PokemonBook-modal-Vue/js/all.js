"use strict";
// let allPokemonArray = [];

// const row = document.querySelector(".main .row");
// // 主要4按鈕
// const btn_addOne = document.querySelector("#btn_add-one");
// const btn_removeOne = document.querySelector("#btn_remove-one");
// const btn_addAll = document.querySelector("#btn_add-all");
// const btn_removeAll = document.querySelector("#btn_remove-all");
// // 卡模板
// const card = document.querySelector("#card-template");
// // modal區
// const modal = document.querySelector("#detailModal");

// const modal_X = modal.querySelector(".btn-close");
// const modal_pic = modal.querySelector(".pic");
// const modal_title = modal.querySelector(".modal-title");
// const modal_img = modal.querySelector(".pokemonImg");

// const Hp_value = modal.querySelector(".attr.Hp .value");
// const Hp_valueBar = modal.querySelector(".attr.Hp + .value-bar");
// const Attack_value = modal.querySelector(".attr.Attack .value");
// const Attack_valueBar = modal.querySelector(".attr.Attack + .value-bar");
// const Defense_value = modal.querySelector(".attr.Defense .value");
// const Defense_valueBar = modal.querySelector(".attr.Defense + .value-bar");
// const SpecialAttack_value = modal.querySelector(".attr.SpecialAttack .value");
// const SpecialAttack_valueBar = modal.querySelector(".attr.SpecialAttack + .value-bar");
// const SpecialDefense_value = modal.querySelector(".attr.SpecialDefense .value");
// const SpecialDefense_valueBar = modal.querySelector(".attr.SpecialDefense + .value-bar");
// const Speed_value = modal.querySelector(".attr.Speed .value");
// const Speed_valueBar = modal.querySelector(".attr.Speed + .value-bar");

// let globalIndex = -1;

// window.onload = function () {
//   getAllPokemon();
// };

// const getAllPokemon = function () {
//   const xhttp = new XMLHttpRequest();
//   xhttp.open("GET", "https://raw.githubusercontent.com/apprunner/pokemon.json/master/pokedex.json", true);
//   xhttp.send();
//   xhttp.addEventListener("load", function () {
//     allPokemonArray = transformText(xhttp.responseText);
//   });
// };

// const transformText = function (text) {
//   const arr = JSON.parse(text);
//   const newArr = arr.map((item) => {
//     return {
//       img: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${item.id.toString().padStart(3, "0")}.png`,
//       type: item.type,
//       id: item.id,
//       name: item.name.english,
//       Attack: item.base.Attack,
//       Defense: item.base.Defense,
//       Hp: item.base.HP,
//       "Sp. Attack": item.base["Sp. Attack"],
//       "Sp. Defense": item.base["Sp. Defense"],
//       Speed: item.base.Speed,
//     };
//   });
//   return newArr;
// };

// const addOne = function () {
//   let success;
//   if (globalIndex + 1 < allPokemonArray.length) {
//     // 加卡片
//     globalIndex++;
//     const newPokemon = allPokemonArray[globalIndex];
//     const newCard = card.content.cloneNode(true);
//     newCard.querySelector(".pokemonImg").setAttribute("src", newPokemon.img);
//     newCard.querySelector(".pokemonId").textContent = `#${newPokemon.id.toString().padStart(3, "0")}`;
//     newCard.querySelector(".pokemonName").textContent = newPokemon.name;

//     // 綁定詳細資料按鈕
//     const btn_showData = newCard.querySelector(".btn");
//     btn_showData.setAttribute("data-global-index", `${globalIndex}`);
//     // btn_showData.onclick = putData;
//     modal.addEventListener("shown.bs.modal", putData);

//     row.appendChild(newCard);
//     return (success = true);
//   } else {
//     return (success = false);
//   }
// };
// const removeOne = function () {
//   if (globalIndex >= 0) {
//     globalIndex--;
//     row.removeChild(row.lastElementChild);
//   }
// };
// const addAll = function () {
//   removeAll();
//   while (addOne()) {}
// };
// const removeAll = function () {
//   globalIndex = -1;
//   row.innerHTML = "";
// };
// const putData = function (event) {
//   const thisPokemon = allPokemonArray[event.relatedTarget.getAttribute("data-global-index")];
//   //
//   modal_img.src = thisPokemon.img;
//   modal_title.textContent = thisPokemon.name;
//   // value
//   const allSpans = [Hp_value, Attack_value, Defense_value, SpecialAttack_value, SpecialDefense_value, Speed_value];
//   const allAttr = ["Hp", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
//   increasing(thisPokemon, allSpans, allAttr);
//   // types
//   const tagBox = document.createElement("div");
//   tagBox.classList.add("tagBox");
//   thisPokemon.type.forEach((item) => {
//     const tag = document.createElement("span");
//     tag.classList.add("pokemonType", `${item}`);
//     tag.textContent = item;
//     tagBox.appendChild(tag);
//   });
//   modal_pic.appendChild(tagBox);
//   // value bar
//   const ratioBase = 190;
//   Hp_valueBar.style.width = `${(thisPokemon["Hp"] / ratioBase) * 100}%`;
//   Attack_valueBar.style.width = `${(thisPokemon["Attack"] / ratioBase) * 100}%`;
//   Defense_valueBar.style.width = `${(thisPokemon["Defense"] / ratioBase) * 100}%`;
//   SpecialAttack_valueBar.style.width = `${(thisPokemon["Sp. Attack"] / ratioBase) * 100}%`;
//   SpecialDefense_valueBar.style.width = `${(thisPokemon["Sp. Defense"] / ratioBase) * 100}%`;
//   Speed_valueBar.style.width = `${(thisPokemon["Speed"] / ratioBase) * 100}%`;
// };
// const resetModal = function () {
//   modal.querySelectorAll(".value-bar").forEach((item) => {
//     item.style.width = 0;
//   });
//   modal.querySelector(".tagBox").remove();
// };
// const increasing = function (thisPokemon, allSpans, allAttr) {
//   const duration = 800; /* ms */
//   const times = 40;
//   for (let i = 0; i < allAttr.length; i++) {
//     let j = 0;
//     const timer = setInterval(() => {
//       allSpans[i].textContent = Math.trunc(thisPokemon[allAttr[i]] * (j / times));
//       if (j == times) {
//         window.clearInterval(timer);
//       }
//       j++;
//     }, duration / times);
//   }
// };

// btn_addOne.onclick = addOne;
// btn_removeOne.onclick = removeOne;
// btn_addAll.onclick = addAll;
// btn_removeAll.onclick = removeAll;
// modal.addEventListener("hide.bs.modal", resetModal);
import PokemonCard from './card.js';
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'
let app = new Vue({
  el: '#app',
  data: {
    pokemonData: {
      pokemonRequestUrl: 'https://raw.githubusercontent.com/apprunner/pokemon.json/master/pokedex.json',
      pokemonArray: [],
      cardArray: [],
      currentPokemon: {

      },
    },
    pageSetting: {
      index: 0
    }
  },
  created: function() {
    this.getPokemonData();
  },
  computed: {},
  methods: {
    getPokemonData() {
      axios.get(this.pokemonData.pokemonRequestUrl)
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data) && res.status == 200) {
            app.pokemonData.pokemonArray = res.data.map((item, index) => ({
              index: index,
              id: item.id.toString().padStart(3, '0'),
              name: item.name.chinese,
              hp: item.base.HP,
              attack: item.base.Attack,
              defense: item.base.Defense,
              sp_attack: item.base['Sp_Attack'],
              sp_defense: item.base['Sp_Defense'],
              speed: item.base.Speed,
              img: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${item.id.toString().padStart(3, "0")}.png`,
              type: item.type,
              evolution: item.evolution,
              genus: item.genus,
            }));
          }
          // console.log(app.pokemonData.pokemonArray);
        }).catch((err) => {
          console.log(err);
        });
    },



    showModalData(index) {

    }
  },
  components: {
    'pokemon': PokemonCard
  }
});