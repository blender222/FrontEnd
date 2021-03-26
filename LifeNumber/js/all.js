const btn_getResult = document.querySelector("#btn_get-result");
const input_date = document.querySelector("#input_date");
const resultBox = document.querySelector(".result-box");

const arr_constellation = [
  {
    chinese: "水瓶",
    english: "Aquarius",
    start: "1.21",
    end: "2.19",
  },
  {
    chinese: "雙魚",
    english: "Pisces",
    start: "2.20",
    end: "3.20",
  },
  {
    chinese: "牡羊",
    english: "Aries",
    start: "3.21",
    end: "4.19",
  },
  {
    chinese: "金牛",
    english: "Taurus",
    start: "4.20",
    end: "5.20",
  },
  {
    chinese: "雙子",
    english: "Gemini",
    start: "5.21",
    end: "6.21",
  },
  {
    chinese: "巨蟹",
    english: "Cancer",
    start: "6.22",
    end: "7.22",
  },
  {
    chinese: "獅子",
    english: "Leo",
    start: "7.23",
    end: "8.22",
  },
  {
    chinese: "處女",
    english: "Virgo",
    start: "8.23",
    end: "9.22",
  },
  {
    chinese: "天秤",
    english: "Libra",
    start: "9.23",
    end: "10.23",
  },
  {
    chinese: "天蠍",
    english: "Scorpio",
    start: "10.24",
    end: "11.21",
  },
  {
    chinese: "射手",
    english: "Sagittarius",
    start: "11.22",
    end: "12.20",
  },
  {
    chinese: "魔羯",
    english: "Capricorn",
    start: "12.21",
    end: "13.20",
  },
];

const getResult = function () {
  const inputArr = getCharArray();
  const userLifeNumber = calcNumber(inputArr);
  const userConstellation = calcConstellation();
  showInfo(userConstellation, userLifeNumber);
};
const getCharArray = function () {
  return input_date.value.split("").filter((char) => char !== "-");
};
const calcNumber = function (inputArr) {
  let lifeNumber = 0;
  do {
    lifeNumber = inputArr.reduce((all, next) => all + Number(next), 0).toString();
    inputArr = lifeNumber.split("");
  } while (lifeNumber.length > 1);
  return Number(lifeNumber);
};
const calcConstellation = function () {
  const arr_birthday = input_date.value.split("-");
  let userDate = Number(`${arr_birthday[1]}.${arr_birthday[2]}`);
  userDate = userDate <= 1.2 ? userDate + 12 : userDate;

  for (let i = 0; i < arr_constellation.length; i++) {
    if (userDate >= arr_constellation[i].start && userDate <= arr_constellation[i].end) {
      arr_constellation[i].index = i;
      return arr_constellation[i];
    }
  }
  console.log("error");
};
const showInfo = function (userConstellation, userLifeNumber) {
  $.ajax({
    type: "GET",
    url: `https://buildschoolapi.azurewebsites.net/api/number/GetNumerology?constellation=${userConstellation.english}&number=${userLifeNumber}`,
    success: function (result) {
      resultBox.querySelector(".constellation .value").textContent = `${userConstellation.chinese}座`;
      resultBox.querySelector(".life-number .value").textContent = userLifeNumber;
      resultBox.querySelector(".result .value").textContent = result;
      resultBox.querySelector(".constellation .value").style.color = `hsl(${userConstellation.index * 30}, 100%, 50%)`;
    },
  });
};

btn_getResult.addEventListener("click", getResult);
btn_getResult.addEventListener("click", function () {
  resultBox.querySelectorAll(".value").forEach((ele) => {
    let start = null;
    ele.flashID = requestAnimationFrame(flash);
    function flash(t, duration = 1000) {
      if (!start) start = t;
      let progress = t - start;
      ele.style.opacity = Math.min(progress / duration, 1);
      if (progress <= duration) {
        requestAnimationFrame(flash);
      }  
    }
  });
});
