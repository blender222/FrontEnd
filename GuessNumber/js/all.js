window.onload = function () {
  let answer = "";
  answer = "1";
  const ul_guessResults = document.getElementById("guessResults");
  const input_userGuess = document.getElementById("userGuess");

  const btn_start = document.getElementById("start");
  const btn_restart = document.getElementById("restart");
  const btn_cheat = document.getElementById("cheat");
  const btn_guess = document.getElementById("guess");

  btn_start.onclick = start;

  input_userGuess.onkeyup = function (event) {
    if (event.code == "Enter" || event.code == "NumpadEnter") {
      btn_guess.click();
    }
  };

  function clearScreen() {
    ul_guessResults.innerHTML = "";
  }

  function resetButton() {
    if (answer == "") {
      // 停止狀態
      enableBtn(btn_start, start);
      disableBtn(btn_restart);
      disableBtn(btn_cheat);
      disableBtn(btn_guess);
    } else {
      // 遊戲中狀態
      disableBtn(btn_start);
      enableBtn(btn_restart, start);
      enableBtn(btn_cheat, cheat);
      enableBtn(btn_guess, guessThis);
    }
  }
  function enableBtn(btn, enabledFunction) {
    btn.onclick = enabledFunction;
    btn.classList.remove("disabled");
  }
  function disableBtn(btn) {
    btn.onclick = null;
    btn.classList.add("disabled");
  }

  function start() {
    answer = "";
    while (answer.length < 4) {
      let number = Math.trunc(Math.random() * 10).toString();
      if (answer.includes(number)) {
        continue;
      }
      answer += number;
    }
    clearScreen();
    resetButton();
  }

  function guessThis() {
    console.log(answer);
    let input = input_userGuess.value;
    if (isCorrect(input)) {
      input_userGuess.value = null;
      let A = 0;
      let B = 0;
      for (let i = 0; i < answer.length; i++) {
        // 如果包含
        if (answer.includes(input[i])) {
          // 則檢測位置對不對
          if (answer[i] == input[i]) {
            A++;
          } else {
            B++;
          }
        }
      }

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
    let tempArr = userInput.split("");
    for (let i = 0; i < userInput.length; i++) {
      const lastNum = tempArr.pop();
      if (tempArr.includes(lastNum)) {
        console.log(`tempArr: ${tempArr}`);
        return false;
      }
    }
    return true;
  }

  function createOutput(A, B, input) {
    let li_newResult = document.createElement("li");
    let span_NANB = document.createElement("span");
    let span_input = document.createElement("span");

    span_NANB.innerText = `${A}A${B}B`;
    span_input.innerHTML = `&nbsp;${input}`;

    li_newResult.appendChild(span_NANB);
    li_newResult.appendChild(span_input);

    ul_guessResults.appendChild(li_newResult);

    li_newResult.classList.add("list-group-item");
    span_NANB.classList.add("label", A == 4 ? "label-success" : "label-danger");
  }
};
