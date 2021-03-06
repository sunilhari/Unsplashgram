const Unsplash = require("unsplash-js").default;
const PAGE_SIZE = 30;
const LIST_SIZE = 20;
(function (Unsplash, pageSize, listSize) {
 //DataStore
 const unsplash = new Unsplash({ accessKey: `${process.env.ACCESS_KEY}` });
 let DB = [];

 let topY = 0;
 let bottomY = 0;
 let topYRatio = 0;
 let bottomYRatio = 0;

 let currentIndex = 0;
 let $root;

 function getNumFromStyle(numStr) {
  return Number(numStr.substring(0, numStr.length - 2));
 }

 function adjustPaddings(isScrollDown) {
  const currentPaddingTop = getNumFromStyle($root.style.paddingTop);
  const currentPaddingBottom = getNumFromStyle($root.style.paddingBottom);
  const remPaddingsVal = 100 * (listSize / 2);
  if (isScrollDown) {
   $root.style.paddingTop = currentPaddingTop + remPaddingsVal + "px";
   $root.style.paddingBottom =
    currentPaddingBottom === 0
     ? "0px"
     : currentPaddingBottom - remPaddingsVal + "px";
  } else {
   $root.style.paddingBottom = currentPaddingBottom + remPaddingsVal + "px";
   $root.style.paddingTop =
    currentPaddingTop === 0 ? "0px" : currentPaddingTop - remPaddingsVal + "px";
  }
 }

 function render(firstIndex) {
  console.log("Render", { firstIndex });
  for (let i = 0; i < listSize; i++) {
   const index = firstIndex + i;
   const { alt_description, urls } = DB[index];
   const id = `list-item-${i}`;
   const $img = document.querySelector(`#${id} img`);
   $img.setAttribute("src", `${urls.small || ""}`);
   $img.setAttribute("alt", `${alt_description || "photos"}`);
  }
 }
 function getFirstIndex(isScrollingDown) {
  const inc = listSize / 2;
  let firstIndex = 0;
  if (isScrollingDown) {
   firstIndex = currentIndex + inc;
  } else {
   firstIndex = currentIndex - inc;
  }
  return firstIndex <= 0 ? 0 : firstIndex;
 }
 function onTopItemIntersect(item) {
  if (currentIndex === 0) {
   $root.style.paddingTop = "0px";
   $root.style.paddingBottom = "0px";
  }
  const Y = item.boundingClientRect.top;
  const { intersectionRatio, isIntersecting } = item;
  const isScrollingUp =
   Y > topY &&
   isIntersecting &&
   intersectionRatio >= topYRatio &&
   currentIndex !== 0;
  if (isScrollingUp) {
   const firstIndex = getFirstIndex(false);
   adjustPaddings(false);
   render(firstIndex);
   currentIndex = firstIndex;
  }
  topY = Y;
  topYRatio = intersectionRatio;
 }

 function onBottomItemIntersect(item) {
  /* if (currentIndex === DB.length - listSize) {
   return;
  } */
  const Y = item.boundingClientRect.top;
  const { intersectionRatio, isIntersecting } = item;
  const isScrollingDown =
   Y < bottomY && intersectionRatio > bottomYRatio && isIntersecting;
  console.log({
   isScrollingDown,
   details: {
    Y,
    bottomY,
    intersectionRatio,
    bottomYRatio,
    isIntersecting
   }
  });
  if (isScrollingDown) {
   const firstIndex = getFirstIndex(true);
   currentIndex = firstIndex;
   adjustPaddings(true);
   bottomY = Y;
   bottomYRatio = intersectionRatio;
   fetchData(() => {
    render(firstIndex);
   });
  }
 }
 function addObserver() {
  const startItem = "list-item-4";
  const lastItem = `list-item-${listSize - 4}`;
  function observed(items) {
   items.forEach((item) => {
    const { id } = item.target;
    if (id === startItem) {
     onTopItemIntersect(item);
     console.log("First Item");
    } else if (id === lastItem) {
     console.log("Last Item");
     onBottomItemIntersect(item);
    }
   });
  }
  const observer = new IntersectionObserver(observed, { root: $root });
  observer.observe(document.querySelector(`#${startItem}`));
  observer.observe(document.querySelector(`#${lastItem}`));
 }
 function getPhotos(page) {
  return unsplash.photos
   .listPhotos(page, pageSize, "latest")
   .then((data) => data.json());
 }
 function createList(count) {
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
 function onDOMReady() {
  $root = document.querySelector("#photos");
  createList(listSize);
  addObserver();
  fetchData(() => {
   render(currentIndex);
  });
 }

 function fetchData(cb) {
  const shouldFetch = currentIndex >= DB.length / listSize;
  console.log({ shouldFetch, currentIndex, DB, length: DB.length });
  if (!shouldFetch) {
   cb && cb();
   return;
  }
  const index = currentIndex === 0 ? 0 : (DB.length % PAGE_SIZE) + 1;
  console.log({ index });
  getPhotos(index).then((photos) => {
   DB = [...DB, ...photos];
   cb && cb();
   return;
  });
 }
 document.addEventListener("DOMContentLoaded", onDOMReady);
})(Unsplash, PAGE_SIZE, LIST_SIZE);
