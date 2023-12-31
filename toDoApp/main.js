const btn = document.querySelectorAll("button");
const input = document.querySelector("input");
const btnCreateToDoItem = document.querySelector(".btn-add-task");
const btnRefresh = document.querySelector(".btn-refresh");

const btnShowActive = document.querySelector(".btn-show-active");
const btnShowDone = document.querySelector(".btn-show-done");

const btnLeft = document.querySelector(".calculate-left");

const btnClearAll = document.querySelector(".clear-all");
console.log(btnClearAll);

const objTask = {
  task: input.value,
  active: true,
};

// proveravamo da li je u polju za tekst pritisnuto dugme Enter. Njegov kod je 13:
// ako jeste, pokrece se metoda za kreiranje novog ToDo itema:
const writeKeyCode = (event) => {
  if (event.keyCode === 13) {
    createToDoItem();
  }
};

// problem: kada umesto reci Done hocu da stavim sliku sa ovim: <button class="del-btn"><img src="./images/trash.svg" id="trashcan" alt=""></button>
const createToDoItem = () => {
  // proveravamo da li je pritisnuto dugme ENTER
  // ako jeste, pokrece se metoda za dodavanje novog itema
  // ako nije, izlazi se iz metode

  // validacija unosa: ne sme biti prazan string

  if (input.value == "") {
    alert("Input cannot be empty string.");
    return;
  }

  // validacija unosa: provera duplikata
  const itemDouble = localStorage.getItem(input.value);
  if (itemDouble) {
    alert("dogadjaj vec postoji");
    return;
  }

  // dodavanje dogadjaja u localStorage

  localStorage.setItem(input.value, true);

  const toDoItem = document.createElement("div");
  toDoItem.innerHTML = `
    <div>
    <button class="chk-btn"><img src="./images/checked.svg" id="checked"></button>
    <p class="par-task">${input.value}</p>
    </div>
    <div>
    <button class="del-btn"><img src="./images/trash.svg" id="trashcan"></button>
    </div>
    `;
  toDoItem.style.width = "90%";
  toDoItem.style.height = "50px";
  toDoItem.style.padding = "5px";
  toDoItem.style.background = "hsla(187, 100%, 82%, 0.85)";
  toDoItem.style.color = "black";

  document.getElementById("task-list").appendChild(toDoItem);

  const btnDelItem = document.querySelectorAll(".del-btn");
  btnDelItem.forEach((button) => {
    button.addEventListener("click", deleteToDoItem);
  });

  const btnCheck = document.querySelectorAll(".chk-btn");
  btnCheck.forEach((button) => {
    button.addEventListener("click", checkItem);
  });

  //const c1 = document.getElementsByClassName("container1");
  input.value = "";
  calculateLeft();
};

const checkItem = (event) => {
  // treba da oznacimo zadatak koji smo obavili tako sto ga precrtamo
  //console.log(event);
  // pribavi item
  // njegov p treba da dobije 'strikethrough'
  // za to samo morao da p oznacim nekom klasom, dao sam mu "par-task".
  const parentElement = event.target.parentElement.parentElement;
  console.log(parentElement);
  //console.log(parentElement.getElementsByClassName("par-task"));
  const p1 = parentElement.querySelector(".par-task");
  console.log(p1);
  //p1.textContent=p1.textContent.strike();

  // koristio materijal sa: https://stackoverflow.com/questions/9375445/javascript-strikethrough
  p1.style.setProperty("text-decoration", "line-through");
  
  const parentElem3 = event.target.parentElement.parentElement.parentElement;
  const ktu = parentElem3.querySelector(".par-task").innerText.split(" ");
  console.log(parentElem3 + "| Update key: " + ktu[0]);
  localStorage.removeItem(ktu[0]);
  localStorage.setItem(ktu[0], false);
  calculateLeft();
};

const deleteToDoItem = (event) => {
  // imao sam problem kada sam umesto teksta 'Done'  stavio svg sliku kante za djubre
  // klikom na dugme, obrisalo bi se dugme, ali ne i cela stavka.
  // logika je kao parent element tretirala dugme ali ne i stavku.
  // kako prepraviti program da tretira celu stavku. Imamo, dakle, ne roditeljski element
  // vec deda- ili pradeda-element
  // resenje sam uspeo da nadjem tako sto sam iza parentElement, dodao jos jedan parent Element

  //doradio sam zadatak tako sto sam hteo da se dugme za cekiranje i tekst pojavljuju levo a
  // dugme za brisanje desno. Zato sam dugme za cekiranje i tekst zadatka grupisao u jos jedan
  // a dugme za brisanje isto u zaseban div. Otuda toliko parentElement "vracanja u rikverc".

  const parentElem = event.target.parentElement.parentElement.parentElement;
  const ktd = parentElem.querySelector(".par-task").innerText;
  console.log(parentElem + "| Delete key: " + ktd);
  parentElem.remove();

  // brisanje dogadjaja iz ls-a
  localStorage.removeItem(ktd);

  calculateLeft();
};

// ova metoda je iz originalnog resenja. prikazuje sve zapise:
const refreshList = () => {
  console.log("refresh list");

  //  obrisi postojeci spisak
  document.querySelector("#task-list").innerHTML = "";

  for (const key of Object.keys(localStorage)) {
    let k = key;
    let val1 = localStorage.getItem(key);
    console.log(k, val1);

    const toDoItem = document.createElement("div");
    toDoItem.innerHTML = `
      <div>
      <button class="chk-btn"><img src="./images/checked.svg" id="checked"></button>
      <p class="par-task">${k} | ${val1}</p>
      </div>
      <div>
      <button class="del-btn"><img src="./images/trash.svg" id="trashcan"></button>
      </div>
      `;
    toDoItem.style.width = "90%";
    toDoItem.style.height = "50px";
    toDoItem.style.padding = "5px";
    toDoItem.style.background = "hsla(187, 100%, 82%, 0.85)";
    toDoItem.style.color = "black";

    if (val1 !== "true") {
      console.log("this item is true");
      toDoItem.style.setProperty("text-decoration", "line-through");
    }

    document.getElementById("task-list").appendChild(toDoItem);

    const btnDelItem = document.querySelectorAll(".del-btn");
    btnDelItem.forEach((button) => {
      button.addEventListener("click", deleteToDoItem);
    });

    const btnCheck = document.querySelectorAll(".chk-btn");
    btnCheck.forEach((button) => {
      button.addEventListener("click", checkItem);
    });
  }
};

const refreshListVer2 = (f) => {
  document.querySelector("#task-list").innerHTML = "";

  for (const key of Object.keys(localStorage)) {
    let k = key;
    let val1 = localStorage.getItem(key);
    console.log(k, val1);

    if (val1 === "false" && f === "done") {
      console.log("eliminisemo uradjeno, prikazujemo samo aktivno");
      continue;
    }

    if (val1 !== "false" && f === "active") {
      console.log("eliminisemo aktivno, prikazujemo samo uradjeno");
      continue;
    }

    const toDoItem = document.createElement("div");

    toDoItem.innerHTML = `
      <div>
      <button class="chk-btn"><img src="./images/checked.svg" id="checked"></button>
      <p class="par-task">${k}</p>
      </div>
      <div>
      <button class="del-btn"><img src="./images/trash.svg" id="trashcan"></button>
      </div>
      `;
    toDoItem.style.width = "90%";
    toDoItem.style.height = "50px";
    toDoItem.style.padding = "5px";
    toDoItem.style.background = "hsla(187, 100%, 82%, 0.85)";
    toDoItem.style.color = "black";

    if (val1 !== "true") {
      console.log("this item is true");
      toDoItem.style.setProperty("text-decoration", "line-through");
    }

    document.getElementById("task-list").appendChild(toDoItem);

    const btnDelItem = document.querySelectorAll(".del-btn");
    btnDelItem.forEach((button) => {
      button.addEventListener("click", deleteToDoItem);
    });

    const btnCheck = document.querySelectorAll(".chk-btn");
    btnCheck.forEach((button) => {
      button.addEventListener("click", checkItem);
    });
  }
};

const calculateLeft = () => {
  var notDone = 0;
  for (const key of Object.keys(localStorage)) {
    let val1 = localStorage.getItem(key);

    val2 = JSON.parse(val1);

    if (val2 === true) {
      notDone++;
    }
  }

  document.querySelector(".num-left-tasks").innerText = "Left: " + notDone;
};

const clearAll = () => {
  const answer = window.confirm(
    "This operation cannot be undone! Are you sure?"
  );
  if (answer == true) {
    localStorage.clear();
    refreshListVer2("all");
  }
  calculateLeft();
};

btnCreateToDoItem.addEventListener("click", createToDoItem);

btnRefresh.addEventListener("click", () => {
  refreshListVer2("all");
});
btnShowActive.addEventListener("click", () => {
  refreshListVer2("done");
});
btnShowDone.addEventListener("click", () => {
  refreshListVer2("active");
});
input.addEventListener("keydown", writeKeyCode);

btnClearAll.addEventListener("click", () => {
  clearAll();
});
