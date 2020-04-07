const Unsplash = require("unsplash-js").default;
const PAGE_SIZE = 10;

(function (Unsplash, pageSize) {
  const unsplash = new Unsplash({ accessKey: `${process.env.ACCESS_KEY}` });

  const renderStore = [];
  let currentPage = 0;

  function getPhotos(page) {
    return unsplash.photos
      .listPhotos(page, pageSize, "latest")
      .then((data) => data.json());
  }

  function render(store) {
    const $ul = document.getElementById("photos");
    const $fragment = document.createDocumentFragment();
    store.map(({ description, alt_description, urls, links, color }) => {
      const $li = document.createElement("li");
      const $img = document.createElement("img");
      $li.className = `list-item`;
      $img.setAttribute("src", `${urls.regular || ""}`);
      $img.setAttribute("alt", `${alt_description || "photos"}`);
      $img.setAttribute("loading", "lazy");
      $li.appendChild($img);
      $fragment.appendChild($li);
    });
    $ul.appendChild($fragment);
  }
  function registerEvents() {
    const $ul = document.getElementById("photos");
    let scrollTop = window.pageYOffset;
    $ul.addEventListener("scroll", (event) => {
      const st = window.pageYOffset || $ul.scrollTop;
      if (st > scrollTop) {
        console.log("Down");
      } else {
        console.log("Up");
      }
      scrollTop = st <= 0 ? 0 : st;
    });
  }
  function initRender(count) {
    const $ul = document.getElementById("photos");
    const $fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const $li = document.createElement("li");
      const $img = document.createElement("img");
      $li.className = `list-item`;
      $li.id = `list-item-${i}`;
      $img.setAttribute("src", ``);
      $img.setAttribute("alt", `placeholders`);
      $img.setAttribute("loading", "lazy");
      $li.appendChild($img);
      $fragment.appendChild($li);
    }
    $ul.appendChild($fragment);
  }
  function registerObserver() {
    const options = {
      root: document.getElementById("photos"),
    };
  }
  document.addEventListener("DOMContentLoaded", () => {
    registerEvents();
    initRender(20); // setting up placeholders
    getPhotos(++currentPage).then((photos) => {
      // render(photos);
    });
  });
})(Unsplash, PAGE_SIZE);
