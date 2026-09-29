import {
  getHeaderTemplate,
  getPokemonCardTemplate,
  getFooterTemplate,
} from "./js/template.js";

function init() {
  renderHeader();
  loadPokemon();
  renderFooter();
  initDialog();
  initSearch();
  setFooterYear();
  initLoadMore();
}

let currentIndex = 0;
let dialogRef = null;
let pokemonList = [];
let searchInput = null;
let evolutionCache = {};
let pokemonLimit = 21;
let pokemonOffset = 0;
let loadMoreButton = null;

const YEAR_PREFIX = "© Developer Akademie ";

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



// Load Pokémon from the API
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

// Load more Pokémon when the button is clicked
async function loadMorePokemon() {
  loadMoreButton.disabled = true;
  loadMoreButton.innerText = "Loading...";
  pokemonOffset += 20;
  await loadPokemon();
  loadMoreButton.disabled = false;
  loadMoreButton.innerText = "Load More";
}

// Create and render a Pokémon card
function renderPokemonCard(pokemon, index) {
 
  let cardTemplate = getPokemonCardTemplate(pokemon, index);
  document.getElementById("pokemon-list").innerHTML += cardTemplate;
}



// Initialize the dialog
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

// Open the dialog for the selected Pokémon
function openDialog(index) {
  currentIndex = index;
  updateDialogContent();
  dialogRef.showModal();
  dialogRef.classList.add("opened");
  loadEvolution(pokemonList[currentIndex].id);
  document.body.classList.add("dialog-open");
}

// Update the dialog content
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

// Update the Pokémon stats in the dialog
function updateDialogStats() {
  const stats = pokemonList[currentIndex].stats;
  setDialogStat("pokemonHp", "HP: ", stats[0].base_stat);
  setDialogStat("pokemonAttack", "Attack: ", stats[1].base_stat);
  setDialogStat("pokemonDefense", "Defense ", stats[2].base_stat);
}

function setDialogStat(id, label, value) {
  document.getElementById(id).innerText = label + value;
}

// Show the previous Pokémon
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

// Close the dialog when clicking outside the content
function handleDialogClick(event) {
  if (event.target === dialogRef) {
    closeDialog();
  }
}

// Close the dialog with animation
function closeDialog() {
  dialogRef.classList.remove("opened");
  document.body.classList.remove("dialog-open");

  setTimeout(() => {
    dialogRef.close();
  }, 400);
}

// Render the footer
function renderFooter() {
  document.getElementById("footer").innerHTML = getFooterTemplate();
}

// Show a message when no Pokémon was found
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

    let clearSearchButton =
        document.getElementById("clear-search-button");

    clearSearchButton.style.display = "none";

    showAllPokemon();
    loadMoreButton.style.display = "block";
}

function resetSearchIfEmpty() {
    const clearSearchButton =
        document.getElementById("clear-search-button");

    if (searchInput.value === "") {
        clearSearchButton.style.display = "none";
        resetSearch();
    } else {
        clearSearchButton.style.display = "block";
    }
}


// Initialize the search
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
        let searchResults = [];

        for (let index = 0; index < pokemonList.length; index++) {
            let pokemon = pokemonList[index];

            if (pokemon.name.includes(searchTerm)) {
                searchResults.push({
                    pokemon: pokemon,
                    index: index,
                });
            }
        }

        if (searchResults.length > 0) {
            showSearchResults(searchResults);
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

function findSearchResults(searchTerm) {
  let searchResults = [];

  for (let index = 0; index < pokemonList.length; index++) {
   if (pokemonList[index].name.includes(searchTerm)){
      searchResults.push({
        pokemon: pokemonList[index],
        index: index,
      });
    }
  }

  return searchResults;
}

function showSearchResultsOrMessage(searchResults) {
  if (searchResults.length > 0) {
    showSearchResults(searchResults);
  } else {
    showNoResults();
  }
}

function showSearchResults(searchResults) {
  let pokemonListRef = document.getElementById("pokemon-list");
  pokemonListRef.innerHTML = "";
  loadMoreButton.style.display = "none";
  renderSearchResults(searchResults);
}

function renderSearchResults(searchResults) {
  for (let index = 0; index < searchResults.length; index++) {
    let result = searchResults[index];
    showSearchPokemon(result.pokemon, result.index);
  }
}

// Show the no-results message
function showNoResults() {
  renderNotFound();
}

// Show the found Pokémon as a card
function showSearchPokemon(pokemon, index) {
    let cardTemplate = getPokemonCardTemplate(pokemon, index);
    document.getElementById("pokemon-list").innerHTML += cardTemplate;
}

// Load the evolution data for a Pokémon
async function loadEvolution(pokemonId) {
  if (evolutionCache[pokemonId]) {
    showEvolution(evolutionCache[pokemonId]);
    return;
  }

  let evolutionData = await fetchEvolutionData();
  evolutionCache[pokemonId] = evolutionData;
  showEvolution(evolutionData);
}

// Fetch the evolution chain from the API
async function fetchEvolutionData() {
  let speciesUrl = pokemonList[currentIndex].species.url;
  let response = await fetch(speciesUrl);
  let responseAsJson = await response.json();
  let evolutionUrl = responseAsJson.evolution_chain.url;
  let evolutionResponse = await fetch(evolutionUrl);

  return await evolutionResponse.json();
}

// Display the evolution chain
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

// Update the dialog background according to the Pokémon type
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

// Initialize the Load More button
function initLoadMore() {
  loadMoreButton = document.getElementById("load-more-button");
  loadMoreButton.addEventListener("click", loadMorePokemon);
}

// Set the current year in the footer
function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = YEAR_PREFIX + year;
}

window.init = init;
window.openDialog = openDialog;
