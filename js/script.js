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
}

let currentIndex = 0;
let dialogRef = null;
let pokemonList = [];
let searchInput = null;

// Render the header
function renderHeader() {
  document.getElementById("header").innerHTML = getHeaderTemplate();
}

init();

// Load Pokémon from the API
async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=9";

  let response = await fetch(url);
  let responseAsJson = await response.json();

  // Loop through the Pokémon list
  for (let index = 0; index < responseAsJson.results.length; index++) {
    let pokemon = responseAsJson.results[index];

    console.log(pokemon);

    // Load the Pokémon details
    let pokemonDetailsResponse = await fetch(pokemon.url);
    let pokemonDetails = await pokemonDetailsResponse.json();

    pokemonList.push(pokemonDetails);

    let pokemonName = pokemon.name;
    let pokemonImage =
      pokemonDetails.sprites.other["official-artwork"].front_default;
    let pokemonId = pokemonDetails.id;
    let pokemonTypes = pokemonDetails.types[0].type.name;

    let pokemonTypeTwo = "";

    if (pokemonDetails.types.length > 1) {
      pokemonTypeTwo = " / " + pokemonDetails.types[1].type.name;
    }

    document.getElementById("content").innerHTML += getPokemonCardTemplate(
      index,
      pokemonName,
      pokemonImage,
      pokemonId,
      pokemonTypes,
      pokemonTypeTwo,
    );
  }
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
  
document.body.classList.add("dialog-open");

}

// Update the content of the dialog
function updateDialogContent() {
  const imageRef = document.getElementById("grossesBild");
  const textRef = document.getElementById("bildText");
  const typeRef = document.getElementById("pokemonType");

  imageRef.src =
    pokemonList[currentIndex].sprites.other["official-artwork"].front_default;

  imageRef.alt = pokemonList[currentIndex].name;
  textRef.innerText = pokemonList[currentIndex].name;

  let pokemonType = pokemonList[currentIndex].types[0].type.name;

  if (pokemonList[currentIndex].types.length > 1) {
    pokemonType += " / " + pokemonList[currentIndex].types[1].type.name;
  }

  typeRef.innerText = pokemonType;

  updateDialogStats();
  updateDialogBackground();
}

// Update the Pokémon stats
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

// Update the dialog background according to the Pokémon type
function updateDialogBackground() {
  let pokemonType = pokemonList[currentIndex].types[0].type.name;

  let dialog = document.getElementById("dialog");

  dialog.classList.remove("grass", "fire", "water");
  dialog.classList.add(pokemonType);
}

// Close the dialog when clicking outside the content
function handleDialogClick(event) {
  if (event.target === dialogRef) {
    closeDialog();
  }
}

// Show the previous Pokémon
function prevImage() {
  currentIndex = getPrevIndex();
  updateDialogContent();
}

function getPrevIndex() {
  return (currentIndex - 1 + pokemonList.length) % pokemonList.length;
}

// Show the next Pokémon
function nextImage() {
  currentIndex = getNextIndex();
  updateDialogContent();
}

function getNextIndex() {
  return (currentIndex + 1) % pokemonList.length;
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

const YEAR_PREFIX = "© Developer Akademie ";

// Set the current year in the footer
function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = YEAR_PREFIX + year;
}

// Show a message when no Pokémon was found
function renderNotFound() {
  let notFound = document.createElement("p");

  notFound.setAttribute("data-id", "not-found");
  notFound.innerText = "No Pokémon found.";

  document.getElementById("content").appendChild(notFound);
}

// Initialize the search
function initSearch() {
  searchInput = document.getElementById("search-input");

  const suchfeld = document.getElementById("search-button");

  suchfeld.addEventListener("click", searchPokemon);

 searchInput.addEventListener("keydown", function(event) {
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

function showNoResults() {
    alert("No Result");
}

// Show the found Pokémon as a card
function showSearchPokemon(pokemon, index) {
  let pokemonName = pokemon.name;

  document.getElementById("content").innerHTML = "";

  let pokemonImage = pokemon.sprites.other["official-artwork"].front_default;

  let pokemonId = pokemon.id;
  let pokemonTypes = pokemon.types[0].type.name;

  let pokemonTypeTwo = "";

  if (pokemon.types.length > 1) {
    pokemonTypeTwo = " / " + pokemon.types[1].type.name;
  }

  document.getElementById("content").innerHTML = getPokemonCardTemplate(
    index,
    pokemonName,
    pokemonImage,
    pokemonId,
    pokemonTypes,
    pokemonTypeTwo,
  );
}


document.body.classList.add("dialog-open");
document.body.classList.remove("dialog-open");

window.openDialog = openDialog;
