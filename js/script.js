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
}


let currentIndex = 0;
let dialogRef = null;
let pokemonList = [];


function renderHeader() {
  document.getElementById("header").innerHTML = getHeaderTemplate();
}


init();


async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=9";

  let response = await fetch(url);
  let responseAsJson = await response.json();

  for (let index = 0; index < responseAsJson.results.length; index++) {
    let pokemon = responseAsJson.results[index];

    console.log(pokemon);

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


function openDialog(index) {
  currentIndex = index;
  updateDialogContent();
  dialogRef.showModal();
  dialogRef.classList.add("opened");
}


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

function updateDialogBackground() {
    let pokemonType = pokemonList[currentIndex].types[0].type.name;

    let dialog = document.getElementById("dialog");

    dialog.classList.remove("grass", "fire", "water");

    dialog.classList.add(pokemonType);

    
}


function handleDialogClick(event) {
  if (event.target === dialogRef) {
    closeDialog();
  }
}

function prevImage() {
  currentIndex = getPrevIndex();
  updateDialogContent();
}

function getPrevIndex() {
  return (currentIndex - 1 + pokemonList.length) % pokemonList.length;
}

function nextImage() {
  currentIndex = getNextIndex();
  updateDialogContent();
}

function getNextIndex() {
  return (currentIndex + 1) % pokemonList.length;
}

/**
 * Closes the dialog with animation.
 */
function closeDialog() {
  dialogRef.classList.remove("opened");

  setTimeout(() => {
    dialogRef.close();
  }, 400); // muss zur CSS duration passen!
}

function renderFooter() {
  document.getElementById("footer").innerHTML = getFooterTemplate();
}

const YEAR_PREFIX = "© Developer Akademie ";

function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = YEAR_PREFIX + year;
}

function renderNotFound() {
  let notFound = document.createElement("p");

  notFound.setAttribute("data-id", "not-found");
  notFound.innerText = "No Pokémon found.";

  document.getElementById("content").appendChild(notFound);
}

window.openDialog = openDialog;
