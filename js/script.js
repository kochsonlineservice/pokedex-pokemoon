import { getHeaderTemplate, getPokemonCardTemplate } from "./template.js";

function init() {
  renderHeader();
  loadPokemon();
}

function renderHeader() {
  document.getElementById("header").innerHTML = getHeaderTemplate();
}

init();

async function loadPokemon() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=1";

  let response = await fetch(url);
  let responseAsJson = await response.json();

  for (let index = 0; index < responseAsJson.results.length; index++) {
    let pokemon = responseAsJson.results[index];

    console.log(pokemon);

    let pokemonDetailsResponse = await fetch(pokemon.url);
    let pokemonDetails = await pokemonDetailsResponse.json();

    console.log(pokemonDetails);

    let pokemonName = pokemon.name;
    let pokemonImage =
    pokemonDetails.sprites.other["official-artwork"].front_default;
    let pokemonId = pokemonDetails.id;
    let pokemonTypes = pokemonDetails.types[0].type.name;
    let pokemonTypeTwo = pokemonDetails.types[1].type.name;

    

    document.getElementById("content").innerHTML += getPokemonCardTemplate(
    pokemonName,
    pokemonImage,
    pokemonId,
    pokemonTypes,
    pokemonTypeTwo,
);
  }
}
