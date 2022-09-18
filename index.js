"use strict";

const btn = document.querySelector(".btn");
//Get the container we need to push HTML into
const container = document.querySelector(".con");

//Fetch the data on click
const getCard = (name) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((response) => response.json())
    .then((data) => {
      //Clean previous HTML
      container.innerHTML = "";
      //Render as many cards as objects
      data.meals.map((ele) => renderCard(ele));
    });
};

//Render a recipe card
const renderCard = (data) => {
  const html = `
  <article class="meal">
    <img class="meal__img" src="${data.strMealThumb}" />
    <div class="meal__data">
      <h3 class="meal__name">${data.strMeal}</h3>
      <h4 class="meal__region">ORIGIN: ${data.strArea}</h4>
      <button class="btn" onclick="renderRecipe(${JSON.stringify(data)
        .split('"')
        .join("&quot;")})">Recipe</button>
    </div>
  </article>
  `;

  container.insertAdjacentHTML("beforeend", html);
  container.style.opacity = 1;
};

//Render recipe cards according to the search input value
const searchForm = () => {
  let input = document.querySelector("#searchInput").value;
  getCard(input);
};

//Render cooking instructions card on click
const renderRecipe = (obj) => {
  container.innerHTML = "";
  const html = `
  <article class="recipe">
    <img class="recipe__img" src="${obj.strMealThumb}" />
    <div class="meal__data">
      <h3 class="meal__name">${obj.strMeal}</h3>
      <h4 class="meal__region">ORIGIN: ${obj.strArea}</h4>
      <h4 class="meal__region">Ingredients:</h4>
      <div class="ingredients">${getIngredients(obj)}</div>
      <h4 class="meal__region">Instructions:</h4>
      <div>${obj.strInstructions}</div>
      <button class="search-btn" onclick="getCard(${JSON.stringify(
        obj.strCategory
      )
        .split('"')
        .join("&quot;")})">Back to category ${obj.strCategory}</button>
      <button class="search-btn" onclick="backToMain()">Back to main</button>
    </div>
  </article>
  `;

  container.insertAdjacentHTML("beforeend", html);
  container.style.opacity = 1;
};

//Function for the button Back to main
const backToMain = () => (container.innerHTML = "");

//Get ingredients and their measures from object
const getIngredients = (obj) => {
  //get ingredients array
  const ingredientsArr = getArr(obj, /strIngredient/gi);

  //get measures  array
  const measuresArr = getArr(obj, /strMeasure/gi);

  //Zip the ingredients and measures arrays together
  const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
  const zippedArr = zip(measuresArr, ingredientsArr);

  //return a list
  return `<ul>${zippedArr
    .map((ele) => `<li>${ele.join(" ")}</li>`)
    .join("")}</ul>`;
};

//Function to get ingredients/measures from object
const getArr = (obj, matchStr) => {
  const keys = Object.keys(obj).filter((entry) => entry.match(matchStr));
  let arr = [];
  keys.forEach((ele) => {
    if (obj[ele] !== "" && obj[ele] !== null && obj[ele] !== " ") arr.push(obj[ele]);
  });
  return arr;
};
