import data from '../utils/config.js';
import { filterBy } from '../components/cardTemplate.js';
import { templateButtons } from '../components/buttons.js';
import {
  searchAPI
} from './API.js';
import {
  templateAllCards,
  templateProvider
} from '../components/cardTemplate.js';

const dbObject = data.dataBase;
const {
  apiKey,
  baseURL,
  baseImageURL,
  imageSize,
  language,
  searchMulti,
  watchProviders,
} = dbObject;

let arrayMovieAndTv = [];
let arrayProviders = [];

const inputUser = document.querySelector("#search-input");

const footer = document.querySelector('#footer');
const movie = document.getElementById("movie");
const tv = document.getElementById("tv");

const getWatchProvider = (array) => {
  let arrayEmpty = []
  for (let index of array) {
    let urlProvider = `${baseURL}${index.media_type}/${index.id}/${watchProviders}${apiKey}`
    searchAPI(urlProvider)
      .then((searchReturn) => {
        arrayEmpty.push({
          id: searchReturn.id,
          results: searchReturn.results
        });
        return templateProvider(arrayProviders);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return arrayProviders=arrayEmpty
};

inputUser.addEventListener("keyup", () => {
  clearDOM()
  let inputValue = inputUser.value.toLowerCase();
  let search = `&query=${inputValue.replaceAll(' ', '%20')}`;
  let urlSearch = `${baseURL}${searchMulti}${apiKey}${language}${search}`;
  searchAPI(urlSearch)
    .then((data) => {
      footer.style.position = 'static';
      let arrayFilter = data.results
      arrayMovieAndTv = arrayFilter.filter((array) =>{
        return array.media_type !== "person";
      })
      templateAllCards(arrayMovieAndTv)
      return arrayMovieAndTv;
    })
    .then((data) => {
      return getWatchProvider(data)
  
    })
})

movie.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("clicou movie")
  clearDOM()
  templateButtons();
  filterBy(movie, arrayMovieAndTv, arrayProviders)
});

tv.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("clicou serie")
  clearDOM()
  templateButtons();
  filterBy(tv, arrayMovieAndTv, arrayProviders)
});

function clearDOM() {
  let cards = document.querySelector('#page-main')
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }
};