export function getHeaderTemplate() {
  return `
        <div class="header-content">
            <header>
                <h1>Pokédex</h1>

                <img
                    class="header-monster"
                    src="./assets/icons/poke-header.svg"
                    alt=""
                >

                <input
                    type="text"
                    id="search-input"
                    placeholder="Search Pokémon"
                >

                <img
                    class="header-monster"
                    src="./assets/icons/poke-header.svg"
                    alt=""
                >

                <button
                    id="search-button"
                    type="button"
                >
                    Search
                </button>
            </header>
        </div>
    `;
}
export function getPokemonCardTemplate(
  pokemonName,
  pokemonImage,
  pokemonId,
  pokemonTypes,
  pokemonTypeTwo,
) {
  
 let html = `
        <div class="pokemon-card ${pokemonTypes}">
            <button class="btn-card" data-id="card">

                <span class="pokemon-name">
                    #${pokemonId} ${pokemonName}
                </span>

                <img
                    class="img-card"
                    data-id="card-image"
                    src="${pokemonImage}"
                    alt=""
                >

                <span class="pokemon-type">
                    Type: ${pokemonTypes} / ${pokemonTypeTwo}
                </span>

            </button>
        </div>
    `;

  return html;
}
