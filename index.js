const Unsplash = require("unsplash-js").default;
const PAGE_SIZE = 5;

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
   $li.appendChild($img);
   $fragment.appendChild($li);
  });
  $ul.appendChild($fragment);
 }

 document.addEventListener("DOMContentLoaded", () => {
  getPhotos(++currentPage).then((photos) => {
   render(photos);
  });
 });
})(Unsplash, PAGE_SIZE);
