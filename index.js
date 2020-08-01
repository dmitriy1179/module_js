//1 copy
const a1 = { 
  x: 1, 
  y: 2, 
  z: [1, 2, 3], 
  u: undefined, 
  v: null, 
  w: new Date(2014, 1, 1, 12, 0, 0),
};
const b1 = copy(a1); // b1 — это отдельный объект
console.log("b1", b1)
b1.x = 10;
console.log(a1.x);// 1
b1.z.push(4);
console.log(a1.z); // [1, 2, 3]
b1.w.setFullYear(2015); 
console.log(a1.w.getFullYear()); // 2014 

function copy(obj) {
  let newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj[key] instanceof Date) {
      newObj[key] = new Date(obj[key])
    }
    else if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = copy(obj[key]);
    }
    else {
      newObj[key] = obj[key];
    }
  }
  return newObj
}

const d1 = [1, 2 , 3, a1]
const g = copy(d1)
console.log("g", g)

//2 getCount
const a = { a: 1, b: 2, c:null };
console.log(getCount(a)); // 3
console.log(getCount(a,{skipNull:true})); // 2
const b = { a: 1, b: 2, c:undefined };
console.log(getCount(b)); // 3
console.log(getCount(b,{skipUndefined:true})); // 2
const c = { a: 1, b: 2, c:undefined,d:null };
console.log(getCount(c)); // 4
console.log(getCount(c, {skipUndefined:true})); // 3
console.log(getCount(c, {skipNull:true})); // 3
console.log(getCount(c, {skipUndefined:true, skipNull:true})); // 2
const d = [undefined,null]
console.log(getCount(d)); // 2
console.log(getCount(d, {skipNull:true})); // 1
console.log(getCount(d, {skipUndefined:true})); // 1
console.log(getCount(d, {skipUndefined:true, skipNull:true})); // 0

function getCount (obj, options = {}) {
  let count = 0
  for (let key in obj) {
    if ((obj[key] === undefined && options.skipUndefined === true) || (obj[key] === null && options.skipNull === true)) {
      continue
    }
    count += 1
  }
  return count
}

//3 pluck
const pluck = (arr, value) => arr.map(obj => obj[value]);

const characters = [
  {'name': 'barney', 'age': 36},
  {'name': 'fred', 'age': 40}
];
console.log(pluck(characters, 'name')); // ['barney', 'fred']

//4 Reddit feeds
const el = document.getElementById("el");
const form = document.getElementById("form");
form.setAttribute("style", "padding: 5px; display:flex; justify-content: space-between; margin: 0 auto; width: 25%;");
const resaultConteiner = document.getElementById("resaultContainer");
const loader = document.getElementById("loader");
loader.style.fontSize = "30px";
loader.style.display = "none";
const limit = document.getElementById("limit");
const category = document.getElementById("category");
const pagin = document.getElementById("pagin");
pagin.setAttribute("style", "margin: 10px auto; display:flex; justify-content: space-around; width: 30%;");
const prev = document.getElementById("prev");
prev.setAttribute("style", "margin: 10px; font-size: 16px");
const next = document.getElementById("next");
next.setAttribute("style", "margin: 10px; font-size: 16px");

prev.style.display = "none";
next.style.display = "none";

var labelAfter = null;
var labelBefore = null;
var distCount = 0;
var count = 0;
var arrDistCount = []

async function getRedditData(limits = limit.value, after = null, before = null) {
  prev.style.display = "none";
  next.style.display = "none";
  resaultConteiner.innerHTML = "";
  loader.style.display = "block";
  let data = await fetch(`https://www.reddit.com/r/${category.value}.json?limit=${limits}&dist=${limits}&after=${after}&count=${count}&before=${before}&count=${count}`);
  let res = await data.json();
  console.log(res)
  console.log("limits", limits)
  labelAfter = res.data.after;
  console.log("labelAfter", labelAfter)
  if (labelAfter === null) {
    next.disabled = true;
  }
  labelBefore = res.data.before;
  console.log("labelBefore", labelBefore)
  if (labelBefore === null) {
    prev.disabled = true;
  }
  distCount = res.data.dist;
  console.log("distCount", distCount)
  for (let elemArr of res.data.children) {
    const {data} = elemArr;
    const divContainer = document.createElement("div");
    divContainer.setAttribute("style", "background: #F0FFFF; padding: 3px; display:flex; justify-content: space-between; align-items:center; margin: 5px auto; width: 95%;");
    const span = document.createElement("span");
    span.setAttribute("style", "padding: 5px; font-size: 18px; width: 15%;");
    span.innerHTML = `<i>Posted by</i><br><span style="word-break: break-all">${data.author}</span>`;
    divContainer.appendChild(span);
    const titleContainer = document.createElement("div");
    titleContainer.setAttribute("style", "padding: 5px; background: #F0FFFF; display:flex; justify-content: space-between; align-items:center; width: 85%;");
    const a = document.createElement("a");
    a.setAttribute("href",`${data.url}`);
    a.setAttribute("target","_blank");
    a.setAttribute("style", "text-decoration: none; font-size: 22px; display:flex; justify-content: flex-start; align-items:center; width: 86%");
    if (data.thumbnail.includes("https:")) {
      const image = document.createElement("img");
      image.setAttribute("src", data.thumbnail);
      image.setAttribute("style", "width: auto; height: 50px;");
      a.appendChild(image);
    }
    const title = document.createElement("span");
    title.setAttribute("style", "padding-left: 10px");
    title.innerText = `${data.title}`;
    a.appendChild(title);
    titleContainer.appendChild(a);
    const createScore = document.createElement("div");
    createScore.setAttribute("style", "background: #F0FFFF; display:flex; flex-direction: column;");
    const create = document.createElement("span");
    create.innerHTML = `Created: ${new Date(data.created*1000).toLocaleDateString()}`;
    createScore.appendChild(create);
    const score = document.createElement("span");
    score.innerHTML = `Score ${data.score}`;
    createScore.appendChild(score);
    const comments = document.createElement("span");
    comments.innerHTML = `Comments: ${data.num_comments}`;
    createScore.appendChild(comments);
    titleContainer.appendChild(createScore);
    divContainer.appendChild(titleContainer);
    resaultConteiner.appendChild(divContainer);
  }
  loader.style.display = "none";
  prev.style.display = "block";
  next.style.display = "block";
}

function attachEvent (event, handler, node) {
  node.addEventListener(event, handler);
  return () => {
    node.removeEventListener(event, handler);
  };
};

function getRedditDataForForm() {
  arrDistCount = [];
  count = 0;
  getRedditData();
}
attachEvent("change", getRedditDataForForm, form)

function paginationNext() {
  prev.disabled = false;
  arrDistCount.push(distCount)
  console.log("arrDistCount", arrDistCount)
  count = arrDistCount.reduce((acc, curVal) => acc + curVal, 0);
  console.log("countNext", count)
  getRedditData(limits = limit.value, labelAfter, before = null);
}
attachEvent("click", paginationNext, next)

function paginationPrev() {
  next.disabled = false;
  getRedditData(limits = arrDistCount[arrDistCount.length-1], after = null, labelBefore)
  arrDistCount = arrDistCount.slice(0, arrDistCount.length-1);
  count = arrDistCount.reduce((acc, curVal) => acc + curVal, 0);
  console.log("countPrev", count);
  console.log("arrDistCount", arrDistCount);
}
attachEvent("click", paginationPrev, prev)

//5 Hamburger
const SIZE = Symbol("size");
const STUFFING = Symbol("stuffing");
const TOPPING = Symbol("topping");
/**
* Класс, объекты которого описывают параметры гамбургера.
*
* @constructor
* @param size Размер
* @param stuffing Начинка
* @throws {HamburgerException} При неправильном использовании
*/
class Hamburger {
  constructor(size, stuffing) {
    if (arguments.length < 2 ) {
      throw new HamburgerException("not all parameters are specified")
    }
    if ((size === Hamburger.SIZE_SMALL) || (size === Hamburger.SIZE_LARGE)) {
      this[SIZE] = size;
    }
    else {
      throw new HamburgerException("invalid size")
    }
    if (!Object.values(Hamburger).includes(stuffing) || stuffing.propertysType !== "stuffing") {
      throw new HamburgerException("invalid stuffing")
    }
    this[STUFFING] = stuffing;
    this[TOPPING] = [];
  }
}
/* Размеры, виды начинок и добавок */
Hamburger.SIZE_SMALL = "small";
Hamburger.SIZE_LARGE = "large";
Hamburger.STUFFING_CHEESE = {
  "propertysType": "stuffing",
  "name": "cheese",
  "price": "10",
  "calories": "20"
};
Hamburger.STUFFING_SALAD = {
  "propertysType": "stuffing",
  "name": "salad",
  "price": "20",
  "calories": "5"
};
Hamburger.STUFFING_POTATO = {
  "propertysType": "stuffing",
  "name": "potato",
  "price": "15",
  "calories": "10"
};
Hamburger.TOPPING_MAYO = {
  "propertysType": "topping",
  "name": "mayo",
  "price": "20",
  "calories": "5"
};
Hamburger.TOPPING_SPICE = {
  "propertysType": "topping",
  "name": "spice",
  "price": "15",
  "calories": "0"
};
/**
* Добавить добавку к гамбургеру. Можно добавить несколько
* добавок, при условии, что они разные.
*
* @param topping Тип добавки
* @throws {HamburgerException} При неправильном использовании
*/
Hamburger.prototype.addTopping = function (topping) {
  if (!Object.values(Hamburger).includes(topping) || topping.propertysType !== "topping") {
    throw new HamburgerException("invalid topping")
  }
  if (this[TOPPING].includes(topping)) {
    throw new HamburgerException(`duplicate topping: ${topping.name}`)
  }
  this[TOPPING].push(topping)
}
/**
* Убрать добавку, при условии, что она ранее была
* добавлена.
*
* @param topping Тип добавки
* @throws {HamburgerException} При неправильном использовании
*/
Hamburger.prototype.removeTopping = function (topping) {
  if (!Object.values(Hamburger).includes(topping) || topping.propertysType !== "topping") {
    throw new HamburgerException("invalid topping")
  }
  if (!this[TOPPING].includes(topping)) {
    throw new HamburgerException(`topping ${topping.name} was not added`)
  }
  for (let i = 0; i < this[TOPPING].length; i++) {
    if (this[TOPPING][i] === topping) {
      this[TOPPING].splice(i, 1)
    }
  }
}
/**
* Получить список добавок.
*
* @return {Array} Массив добавленных добавок, содержит константы
* Hamburger.TOPPING_*
*/
Hamburger.prototype.getToppings = function () {
  return this[TOPPING]
}
/**
* Узнать размер гамбургера
*/
Hamburger.prototype.getSize = function () {
  return this[SIZE];
}
/**
* Узнать начинку гамбургера
*/
Hamburger.prototype.getStuffing = function () {
  return this[STUFFING];
}
/**
* Узнать цену гамбургера
* @return {Number} Цена в тугриках
*/
Hamburger.prototype.calculatePrice = function () {
  let hamburgerPrice = (this[SIZE] === "large" ? 100 : 50);
  hamburgerPrice += +this[STUFFING].price;
  for (let {price} of this[TOPPING]) {
    hamburgerPrice += +price
  }
  return hamburgerPrice
}
/**
* Узнать калорийность
* @return {Number} Калорийность в калориях
*/
Hamburger.prototype.calculateCalories = function () {
  let hamburgerCalories = (this[SIZE] === "large" ? 40 : 20);
  hamburgerCalories += +this[STUFFING].calories;
  for (let {calories} of this[TOPPING]) {
    hamburgerCalories += +calories
  }
  return hamburgerCalories
}
/**
* Представляет информацию об ошибке в ходе работы с гамбургером.
* Подробности хранятся в свойстве message.
* @constructor
*/
class HamburgerException {
  constructor(message) {
    this.name = "HamburgerException";
    this.message = message || "Unknown error";
  }
} 

// маленький гамбургер с начинкой из сыра
const hamburger = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
// добавка из майонеза
hamburger.addTopping(Hamburger.TOPPING_MAYO);
// спросим сколько там калорий
console.log("Calories: %f", hamburger.calculateCalories());
// сколько стоит
console.log("Price: %f", hamburger.calculatePrice());
// я тут передумал и решил добавить еще приправу
hamburger.addTopping(Hamburger.TOPPING_SPICE);
// А сколько теперь стоит?
console.log("Price with sauce: %f", hamburger.calculatePrice());
// Проверить, большой ли гамбургер?
console.log("Is hamburger large: %s", hamburger.getSize() === Hamburger.SIZE_LARGE);
// -> false
// Убрать добавку
hamburger.removeTopping(Hamburger.TOPPING_SPICE);
console.log("Have %d toppings", hamburger.getToppings().length); // 1