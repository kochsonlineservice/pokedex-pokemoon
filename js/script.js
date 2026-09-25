import {
  getHeaderTemplate,
  getPokemonCardTemplate,
  getFooterTemplate,
} from "./template.js";

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
    document.getElementById("content").innerHTML =
        '<ul id="pokemon-list"></ul>';
    loadPokemon();
}

init();

// Load Pokémon from the API
async function loadPokemon() {
  document.getElementById("loading-spinner").style.display = "block";
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=${pokemonOffset}`;

  let response = await fetch(url);
  let responseAsJson = await response.json();

  // Loop through the Pokémon list
  for (let index = 0; index < responseAsJson.results.length; index++) {
    let pokemon = responseAsJson.results[index];
    document.getElementById("loading-spinner").style.display = "none";

    // Load the Pokémon details
    let pokemonDetailsResponse = await fetch(pokemon.url);
    let pokemonDetails = await pokemonDetailsResponse.json();

    pokemonList.push(pokemonDetails);

    // Render the Pokémon card
   renderPokemonCard(pokemonDetails, pokemonList.length - 1);
  }
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
    let pokemonName = pokemon.name;
    let pokemonImage =
        pokemon.sprites.other["official-artwork"].front_default;
    let pokemonId = pokemon.id;
    let pokemonTypes = pokemon.types[0].type.name;
    let pokemonTypeTwo = "";

    if (pokemon.types.length > 1) {
        pokemonTypeTwo = " / " + pokemon.types[1].type.name;
    }

    document.getElementById("pokemon-list").innerHTML += getPokemonCardTemplate(
        index,
        pokemonName,
        pokemonImage,
        pokemonId,
        pokemonTypes,
        pokemonTypeTwo,
    );
}

// Initialize the dialog
function initDialog() {
  dialogRef = document.getElementById("dialog");
  dialogRef.addEventListener("click", handleDialogClick);

  let closeButton = document.querySelector(".btn_close");
  closeButton.addEventListener("click", closeDialog);

  let prevButton = document.querySelector(".btn_left");
  prevButton.addEventListener("click", prevImage);

  let nextButton = document.querySelector(".btn_right");
  nextButton.addEventListener("click", nextImage);
}

// Open the dialog for the selected Pokémon
function openDialog(index) {
  currentIndex = index;
  updateDialogContent();
  dialogRef.showModal();
  dialogRef.classList.add("opened");

  let pokemonId = pokemonList[currentIndex].id;
  loadEvolution(pokemonId);

  document.body.classList.add("dialog-open");
}

// Update the dialog content
function updateDialogContent() {
  const imageRef = document.getElementById("grossesBild");
  const textRef = document.getElementById("bildText");
  const typeRef = document.getElementById("pokemonType");

  imageRef.src =
    pokemonList[currentIndex].sprites.other["official-artwork"].front_default;

  imageRef.alt = pokemonList[currentIndex].name;
  textRef.innerText = pokemonList[currentIndex].name;

  let pokemonType = pokemonList[currentIndex].types[0].type.name;

  // Add the second type if available
  if (pokemonList[currentIndex].types.length > 1) {
    pokemonType += " / " + pokemonList[currentIndex].types[1].type.name;
  }

  typeRef.innerText = pokemonType;

  updateDialogStats();
  updateDialogBackground();
}

// Update the Pokémon stats in the dialog
function updateDialogStats() {
  const hpRef = document.getElementById("pokemonHp");
  const attackRef = document.getElementById("pokemonAttack");
  const defenseRef = document.getElementById("pokemonDefense");

  let hp = pokemonList[currentIndex].stats[0].base_stat;
  let attack = pokemonList[currentIndex].stats[1].base_stat;
  let defense = pokemonList[currentIndex].stats[2].base_stat;

  hpRef.innerText = "HP: " + hp;
  attackRef.innerText = "Attack: " + attack;
  defenseRef.innerText = "Defense " + defense;
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

    let notFound = document.createElement("p");
    notFound.classList.add("not-found");
    notFound.setAttribute("data-id", "not-found");
    notFound.innerText = "No Pokémon found.";

    content.appendChild(notFound);
let closeButton = document.createElement("button");
closeButton.innerText = "Close";
closeButton.classList.add("close-search");
closeButton.setAttribute("aria-label", "Close search results");
closeButton.addEventListener("click", showAllPokemon);

content.appendChild(closeButton);
}

// Initialize the search
function initSearch() {
  searchInput = document.getElementById("search-input");

  const suchfeld = document.getElementById("search-button");

  suchfeld.addEventListener("click", searchPokemon);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchPokemon();
    }
  });
}

// Search for a Pokémon
function searchPokemon() {
  const searchTerm = searchInput.value;

  if (searchTerm.length >= 3) {
    for (let index = 0; index < pokemonList.length; index++) {
      let pokemon = pokemonList[index];

      if (pokemon.name.includes(searchTerm)) {
        console.log(pokemon.name);
        showSearchPokemon(pokemon, index);
        return;
      }
    }

    showNoResults();
  } else {
    showNoResults();
  }
}

// Show the no-results message
function showNoResults() {
  renderNotFound();
}

// Show the found Pokémon as a card
function showSearchPokemon(pokemon, index) {
  let pokemonName = pokemon.name;

  document.getElementById("pokemon-list").innerHTML = "";

  let pokemonImage =
    pokemon.sprites.other["official-artwork"].front_default;

  let pokemonId = pokemon.id;
  let pokemonTypes = pokemon.types[0].type.name;
  let pokemonTypeTwo = "";

  // Check if the Pokémon has a second type
  if (pokemon.types.length > 1) {
    pokemonTypeTwo = " / " + pokemon.types[1].type.name;
  }

  document.getElementById("pokemon-list").innerHTML = getPokemonCardTemplate(
    index,
    pokemonName,
    pokemonImage,
    pokemonId,
    pokemonTypes,
    pokemonTypeTwo,
  );
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

  // Add the first evolution
  if (chain.evolves_to.length > 0) {
    evolutionName += " → " + chain.evolves_to[0].species.name;

    // Add the second evolution
    if (chain.evolves_to[0].evolves_to.length > 0) {
      evolutionName +=
        " → " + chain.evolves_to[0].evolves_to[0].species.name;
    }
  }

  evolutionRef.innerText = "Evolution: " + evolutionName;
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

  // Remove all previous type classes
  for (let index = 0; index < pokemonTypes.length; index++) {
    dialog.classList.remove(pokemonTypes[index]);
  }

  // Add the current Pokémon type
  dialog.classList.add(pokemonType);
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

window.openDialog = openDialog;