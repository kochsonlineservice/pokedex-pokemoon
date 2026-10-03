import { getPokemonCardTemplate } from "./template.js";

export function findSearchResults(pokemonList, searchTerm) {
  let searchResults = [];

  for (let index = 0; index < pokemonList.length; index++) {
    if (pokemonList[index].name.includes(searchTerm)) {
      searchResults.push({
        pokemon: pokemonList[index],
        index: index,
      });
    }
  }

  return searchResults;
}

export function showSearchPokemon(pokemon, index) {
  let cardTemplate = getPokemonCardTemplate(pokemon, index);
  document.getElementById("pokemon-list").innerHTML += cardTemplate;
}

export function showSearchResults(searchResults,loadMoreButton) {
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