// U radu sam se oslanjao na materijal sa: https://forum.freecodecamp.org/t/using-fetch-to-get-google-books-api/323889/20

const formSearch = document.querySelector("#form-search");
const inpTitle = document.querySelector(".input-title");
const booksList = document.querySelector(".books-list");

const request = async (e) => {
  e.preventDefault();

  var x = inpTitle.value;

  const response = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=intitle:'" + x + "'",
    {
      method: "GET",
      mode: "cors",
    }
  );

  const json = await response.json();

  let items = json.items;

  let book_html = "";
  booksList.innerHTML = "";

  items.forEach((element) => {
    let bookEl = document.createElement("div");
    bookEl.classList.add("books-list-element");
    let bookElDescrip = document.createElement("div");
    bookElDescrip.classList.add("books-element-description");
    book_html = `
   
   <h2>${element.volumeInfo.title}</h2>
   <h4>by ${element.volumeInfo.authors}</h4>
   
   `;

    try {
      bookEl.style.backgroundImage =
        "url('" + element.volumeInfo.imageLinks.thumbnail + "')";
      bookEl.style.backgroundRepeat = "no-repeat";
      bookEl.style.backgroundPosition = "center";
      bookEl.style.backgroundSize = "cover";
    } catch (err) {
      console.log("ERROR: " + err);
    }
    bookEl.style.backgroundColor = "gray";
    bookEl.innerHTML = book_html;
    bookElDescrip.innerHTML = `
    <p>Description: ${element.volumeInfo.description}</p>
    `;

    booksList.appendChild(bookEl);
    booksList.appendChild(bookElDescrip);
  });
};

formSearch.addEventListener("submit", (e) => {
  request(e);
});
