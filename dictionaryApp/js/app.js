// stao si na 46. minutu drugog dela...

const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchForm = document.querySelector(".search-form");
const wordInput = document.querySelector(".word-input");
const content = document.querySelector(".content");
let audios = [];
let audioBtns = [];
let audioObjs = [];
let h = document.html;

const getWord = async (event) => {
  event.preventDefault();

  content.innerHTML = "";
  let msg = "";

  if (!wordInput.value) {
    // validacija unosa
    msg = "Please, enter a valid word.";
    return;
  }

  const wordData = await fetchWord();

  renderHtml(wordData);
};

const renderHtml = (wd) => {
  if (wd) {
    content.innerHTML = "";
  }
  if (!wd[0]) {
    content.innerHTML = `<h3>Word not found.</h3>`;
  } else {
    content.innerHTML = `<p>${wd.length} word(s) found.</p>`;
  }

  let html = "";

  html = `
  <div class="word-header">
    <div class="left">
    <div class="my-word">
      <h1>${wd[0].word}</h1>
      </div>

  `;

  // ispisivanje nadjene reci iteracijom
  // pribavljanje njene vrste

  for (let i = 0; i < wd.length; i++) {
    html += `<hr class="separator1">`;
    html += `<h1 class="word-found">"${wd[i].word}"</h1>`;
    html += `<h3 class="pronunciation">Pronunciation: ${wd[i].phonetic}</h3>`;

    // pribavljanje zvuka
    let numAudios = 0;
    let numPhonetics = wd[i].phonetics.length;

    for (let l = 0; l < numPhonetics; l++) {
      if (wd[i].phonetics[l].audio) {
        numAudios++;
        html += `<button class="audio-button"><img src="../images/icons8-sound-100.png" class="speaker-image"/><audio class="audio" src=${wd[i].phonetics[l].audio}></audio></button>`;
      }
    }

    // istrazivanje znacenja
    let numMeanings = wd[i].meanings.length;

    html += `<br><h3 class="word-meaning">Meanings: </h3>`;
    for (let j = 0; j < numMeanings; j++) {
      html += `<h3>${j + 1}) ${wd[i].meanings[j].partOfSpeech}</h3>`;

      html += `<div class="definitions">`;

      html += `<ul class="ul-defs">`;
      for (m of wd[i].meanings[j].definitions) {
        html += `<li class="p-definition">${m.definition}</li>`;
      }
      html += `</ul>`;
      html += `<br>`;
      html += `</div>`;
    }

    html += `</div>
        </div>
  `;
  }

  content.innerHTML += html;

  // funkcionalnost dugmeta za audio
  // pretraga nam moze vratiti vise rezultata
  // smestio sam ih u nizove
  audios = document.querySelectorAll(".audio");
  audioBtns = document.querySelectorAll(".audio-button");

  // Hvala Igoru za pomoc.
  const playAudio = (event) => {
    let audioElement = event.currentTarget.querySelector(".audio");
    audioElement.play();
  };

  audioBtns.forEach((element) => {
    element.addEventListener("click", playAudio);
  });
};

const fetchWord = async () => {
  content.innerHTML = `<p style="text-align: center" >Please, wait...</p>`;
  try {
    const resp = await fetch(`${apiUrl}${wordInput.value}`);
    const data = await resp.json();
    return data;
  } catch (err) {
    content.innerHTML = `<p style="text-align: center">GRESKA: ${err}</p>`;
  }
};

const changingFont = (fontstyle) => {
  document.getElementsByTagName("html")[0].className =
    "text-center " + fontstyle.value;
  document.querySelector(".word-input").style.fontFamily = fontstyle.value;
};

searchForm.addEventListener("submit", getWord);

// ovo je dodatak za dugme
// materijal je sa https://github.com/devmode-on/Animated-Dark-Mode-Button/blob/main/js/main.js

const body = document.querySelector("body");
const btn = document.querySelector(".btn");
const icon = document.querySelector(".btn__icon");

//to save the dark mode use the object "local storage".

//function that stores the value true if the dark mode is activated or false if it's not.
const store = (value) => {
  localStorage.setItem("darkmode", value);
};

//function that indicates if the "darkmode" property exists. It loads the page as we had left it.
const load = () => {
  const darkmode = localStorage.getItem("darkmode");

  //if the dark mode was never activated
  if (!darkmode) {
    store(false);
    icon.classList.add("fa-sun");
  } else if (darkmode == "true") {
    //if the dark mode is activated
    body.classList.add("darkmode");
    icon.classList.add("fa-moon");
  } else if (darkmode == "false") {
    //if the dark mode exists but is disabled
    icon.classList.add("fa-sun");
  }
};

load();

btn.addEventListener("click", () => {
  body.classList.toggle("darkmode");
  icon.classList.add("animated");

  //save true or false
  store(body.classList.contains("darkmode"));

  if (body.classList.contains("darkmode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  setTimeout(() => {
    icon.classList.remove("animated");
  }, 500);
});
