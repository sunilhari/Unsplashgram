const Unsplash = require("unsplash-js").default;
const PAGE_SIZE = 10;

(function (Unsplash, pageSize) {
 const unsplash = new Unsplash({ accessKey: `${process.env.ACCESS_KEY}` });

 const listSize = 20;
 let currentPage = 0;

 function getPhotos(page) {
  return unsplash.photos
   .listPhotos(page, pageSize, "latest")
   .then((data) => data.json());
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
   root: document.querySelector("#photos")
  };
  const startItemId = "list-item-0";
  // const middleItem;
  const lastItemId = `list-item-${listSize - 1}`;
  const callback = (entries) => {
   entries.forEach((entry) => {
    switch (entry.target.id) {
     case startItemId:
      console.log("Reached Top");
      break;
     case lastItemId:
      console.log("Reached Bottom");
      break;
     default:
      console.log("Default Case");
    }
   });
  };
  const observer = new IntersectionObserver(callback, options);
  observer.observe(document.querySelector(`#${startItemId}`));
  observer.observe(document.querySelector(`#${lastItemId}`));
 }
 document.addEventListener("DOMContentLoaded", () => {
  initRender(listSize); // setting up placeholders
  registerObserver();
  getPhotos(++currentPage).then((photos) => {
   // render(photos);
  });
 });
})(Unsplash, PAGE_SIZE);

/**
 * function registerEvents() {
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
 */

/**
  * function render(store) {
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
  */
