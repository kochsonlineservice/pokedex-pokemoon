import { getPokemonCardTemplate } from "./js/template.js";
import {
  findSearchResults,
  showSearchPokemon,
  showSearchResults,
} from "./js/search.js";

let currentIndex = 0;
let dialogRef = null;
let pokemonList = [];
let searchInput = null;
let evolutionCache = {};
let pokemonLimit = 21;
let pokemonOffset = 0;
let loadMoreButton = null;

const YEAR_PREFIX = "© Developer Akademie ";

// List of all Pokémon types
let pokemonTypes = [
  "grass",
  "fire",
  "water",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
  "normal",
];

function init() {
  loadPokemon();
  initDialog();
  initSearch();
  setFooterYear();
  initLoadMore();
}

// Render the header
function renderHeader() {
  document.getElementById("header").innerHTML = getHeaderTemplate();
}

// Show all loaded Pokémon again
function showAllPokemon() {
  let pokemonListRef = document.getElementById("pokemon-list");
  pokemonListRef.innerHTML = "";

  for (let index = 0; index < pokemonList.length; index++) {
    renderPokemonCard(pokemonList[index], index);
  }
}

async function loadPokemon() {
  showLoadingSpinner();

  let startIndex = pokemonList.length;

  let responseAsJson = await fetchPokemonList();

  await loadPokemonDetails(responseAsJson.results);

  renderNewPokemon(startIndex);

  hideLoadingSpinner();
}

function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "block";
}

async function fetchPokemonList() {
  let url = getPokemonUrl();
  let response = await fetch(url);
  return await response.json();
}

function getPokemonUrl() {
  return `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=${pokemonOffset}`;
}

async function loadPokemonDetails(results) {
  for (let index = 0; index < results.length; index++) {
    let response = await fetch(results[index].url);
    let pokemonDetails = await response.json();
    pokemonList.push(pokemonDetails);
  }
}

function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

async function loadMorePokemon() {
  loadMoreButton.disabled = true;
  loadMoreButton.innerText = "Loading...";
  pokemonOffset += 20;
  await loadPokemon();
  loadMoreButton.disabled = false;
  loadMoreButton.innerText = "Load More";
}

function renderPokemonCard(pokemon, index) {
  let cardTemplate = getPokemonCardTemplate(pokemon, index);
  document.getElementById("pokemon-list").innerHTML += cardTemplate;
}

function initDialog() {
  dialogRef = document.getElementById("dialog");
  dialogRef.addEventListener("click", handleDialogClick);
  addDialogButtonListeners();
}

function addDialogButtonListeners() {
  let closeButton = document.querySelector(".btn_close");
  let prevButton = document.querySelector(".btn_left");
  let nextButton = document.querySelector(".btn_right");

  closeButton.addEventListener("click", closeDialog);
  prevButton.addEventListener("click", prevImage);
  nextButton.addEventListener("click", nextImage);
}

function openDialog(index) {
  currentIndex = index;
  updateDialogContent();
  dialogRef.showModal();
  dialogRef.classList.add("opened");
  loadEvolution(pokemonList[currentIndex].id);
  document.body.classList.add("dialog-open");
}

function updateDialogContent() {
  let pokemon = pokemonList[currentIndex];
  updateDialogImage(pokemon);
  updateDialogText(pokemon);
  updateDialogStats();
  updateDialogBackground();
}

function updateDialogImage(pokemon) {
  const imageRef = document.getElementById("grossesBild");
  imageRef.src = pokemon.sprites.other["official-artwork"].front_default;
  imageRef.alt = pokemon.name;
}

function updateDialogText(pokemon) {
  const textRef = document.getElementById("bildText");
  const typeRef = document.getElementById("pokemonType");
  textRef.innerText = pokemon.name;
  typeRef.innerText = getPokemonTypeText(pokemon);
}

function getPokemonTypeText(pokemon) {
  let pokemonType = pokemon.types[0].type.name;

  if (pokemon.types.length > 1) {
    pokemonType += " / " + pokemon.types[1].type.name;
  }

  return pokemonType;
}

function updateDialogStats() {
  const stats = pokemonList[currentIndex].stats;
  setDialogStat("pokemonHp", "HP: ", stats[0].base_stat);
  setDialogStat("pokemonAttack", "Attack: ", stats[1].base_stat);
  setDialogStat("pokemonDefense", "Defense ", stats[2].base_stat);
}

function setDialogStat(id, label, value) {
  document.getElementById(id).innerText = label + value;
}

function prevImage() {
  currentIndex = getPrevIndex();
  updateDialogContent();
  loadEvolution(pokemonList[currentIndex].id);
}

// Calculate the previous Pokémon index
function getPrevIndex() {
  return (currentIndex - 1 + pokemonList.length) % pokemonList.length;
}

// Show the next Pokémon
function nextImage() {
  currentIndex = getNextIndex();
  updateDialogContent();
  loadEvolution(pokemonList[currentIndex].id);
}

// Calculate the next Pokémon index
function getNextIndex() {
  return (currentIndex + 1) % pokemonList.length;
}

function handleDialogClick(event) {
  if (event.target === dialogRef) {
    closeDialog();
  }
}

function closeDialog() {
  dialogRef.classList.remove("opened");
  document.body.classList.remove("dialog-open");

  setTimeout(() => {
    dialogRef.close();
  }, 400);
}

function renderFooter() {
  document.getElementById("footer").innerHTML = getFooterTemplate();
}

function renderNotFound() {
  let content = document.getElementById("content");
  content.innerHTML = '<ul id="pokemon-list"></ul>';

  content.appendChild(createNotFoundMessage());
  content.appendChild(createCloseSearchButton());
}

function createNotFoundMessage() {
  let notFound = document.createElement("p");
  notFound.classList.add("not-found");
  notFound.setAttribute("data-id", "not-found");
  notFound.innerText = "No Pokémon found.";

  return notFound;
}

function createCloseSearchButton() {
  let closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.classList.add("close-search");
  closeButton.setAttribute("aria-label", "Close search results");
  closeButton.addEventListener("click", resetSearch);

  return closeButton;
}
function resetSearch() {
  searchInput.value = "";

  let clearSearchButton = document.getElementById("clear-search-button");

  clearSearchButton.style.display = "none";

  showAllPokemon();
  loadMoreButton.style.display = "block";
}

function resetSearchIfEmpty() {
  const clearSearchButton = document.getElementById("clear-search-button");

  if (searchInput.value === "") {
    clearSearchButton.style.display = "none";
    resetSearch();
  } else {
    clearSearchButton.style.display = "block";
  }
}

function initSearch() {
  searchInput = document.getElementById("search-input");

  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", searchPokemon);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchPokemon();
    }
  });

  const clearSearchButton = document.getElementById("clear-search-button");

  clearSearchButton.addEventListener("click", resetSearch);
  clearSearchButton.style.display = "none";

  searchInput.addEventListener("input", resetSearchIfEmpty);
}

function searchPokemon() {
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm.length >= 3) {
    let searchResults = findSearchResults(pokemonList, searchTerm);

    if (searchResults.length > 0) {
      showSearchResults(searchResults,loadMoreButton);
    } else {
      showNoResults();
    }
  } else {
    showAllPokemon();
    loadMoreButton.style.display = "block";
  }
}

function renderNewPokemon(startIndex) {
  for (let index = startIndex; index < pokemonList.length; index++) {
    renderPokemonCard(pokemonList[index], index);
  }
}

function showSearchResultsOrMessage(searchResults) {
  if (searchResults.length > 0) {
    showSearchResults(searchResults);
  } else {
    showNoResults();
  }
}

function showNoResults() {
  renderNotFound();
}

async function loadEvolution(pokemonId) {
  if (evolutionCache[pokemonId]) {
    showEvolution(evolutionCache[pokemonId]);
    return;
  }

  let evolutionData = await fetchEvolutionData();
  evolutionCache[pokemonId] = evolutionData;
  showEvolution(evolutionData);
}

async function fetchEvolutionData() {
  let speciesUrl = pokemonList[currentIndex].species.url;
  let response = await fetch(speciesUrl);
  let responseAsJson = await response.json();
  let evolutionUrl = responseAsJson.evolution_chain.url;
  let evolutionResponse = await fetch(evolutionUrl);

  return await evolutionResponse.json();
}

function showEvolution(evolutionData) {
  let evolutionRef = document.getElementById("pokemonEvolution");
  let chain = evolutionData.chain;
  let evolutionName = chain.species.name;

  evolutionName = addFirstEvolution(chain, evolutionName);
  evolutionName = addSecondEvolution(chain, evolutionName);
  evolutionRef.innerText = "Evolution: " + evolutionName;
}

function addFirstEvolution(chain, evolutionName) {
  if (chain.evolves_to.length > 0) {
    return evolutionName + " → " + chain.evolves_to[0].species.name;
  }

  return evolutionName;
}

function addSecondEvolution(chain, evolutionName) {
  if (chain.evolves_to[0]?.evolves_to.length > 0) {
    return (
      evolutionName + " → " + chain.evolves_to[0].evolves_to[0].species.name
    );
  }

  return evolutionName;
}

function updateDialogBackground() {
  let pokemonType = pokemonList[currentIndex].types[0].type.name;
  let dialog = document.getElementById("dialog");

  removeTypeClasses(dialog);
  dialog.classList.add(pokemonType);
}

function removeTypeClasses(dialog) {
  for (let index = 0; index < pokemonTypes.length; index++) {
    dialog.classList.remove(pokemonTypes[index]);
  }
}

function initLoadMore() {
  loadMoreButton = document.getElementById("load-more-button");
  loadMoreButton.addEventListener("click", loadMorePokemon);
}

function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = YEAR_PREFIX + year;
}

window.init = init;
window.openDialog = openDialog;
