"use strict";

window.onload = function () {
  var answer = "";
  answer = "1";
  var ul_guessResults = document.getElementById("guessResults");
  var input_userGuess = document.getElementById("userGuess");
  var btn_start = document.getElementById("start");
  var btn_restart = document.getElementById("restart");
  var btn_cheat = document.getElementById("cheat");
  var btn_guess = document.getElementById("guess");
  btn_start.onclick = start;
  btn_restart.onclick = start;

  input_userGuess.onkeyup = function (event) {
    if (event.code == "Enter" || event.code == "NumpadEnter") {
      btn_guess.click();
    }
  };

  function clearScreen() {
    ul_guessResults.innerHTML = "";
  }

  function resetButton() {
    btn_guess.onclick = answer && guessThis;
    btn_cheat.onclick = answer && cheat;
  }

  function start() {
    answer = "";

    while (answer.length < 4) {
      var number = Math.floor(Math.random() * 10).toString();

      if (answer.includes(number)) {
        continue;
      }

      answer += number;
    }

    clearScreen();
    resetButton();
  }

  function guessThis() {
    var input = input_userGuess.value;

    if (isCorrect(input)) {
      input_userGuess.value = null;
      var A = 0;
      var B = 0;

      for (var i = 0; i < answer.length; i++) {
        if (answer.includes(input[i])) {
          B++;
        }

        if (answer[i] == input[i]) {
          A++;
        }
      }

      B -= A;
      createOutput(A, B, input);

      if (A == 4) {
        answer = "";
      }
    } else {
      console.log("操作錯誤");
      return;
    }

    resetButton();
  }

  function cheat() {
    createOutput(4, 0, answer);
    answer = "";
    resetButton();
  }

  function isCorrect(userInput) {
    if (!userInput.match(/^\d{4}$/)) {
      return false;
    }

    var input = "";

    for (var i = 0; i < userInput.length; i++) {
      if (!input.includes(userInput[i])) {
        input += userInput[i];
      }
    }

    if (input.length != 4) {
      return false;
    }

    return true;
  }

  function createOutput(A, B, input) {
    var li_newResult = document.createElement("li");
    var span_NANB = document.createElement("span");
    var span_input = document.createElement("span");
    span_NANB.innerText = "".concat(A, "A").concat(B, "B");
    span_input.innerHTML = "&nbsp;".concat(input);
    li_newResult.appendChild(span_NANB);
    li_newResult.appendChild(span_input);
    ul_guessResults.appendChild(li_newResult);
    li_newResult.classList.add("list-group-item");
    span_NANB.classList.add("label", A == 4 ? "label-success" : "label-danger");
  }
};