export function getHeaderTemplate() {
  // Create the header
  return `
        <div class="header-content">
            <header>
                <a href="./index.html">
                    <h1>Pokédex</h1>
                </a>

                <img
                    class="header-monster"
                    src="./assets/icons/header-icon.svg"
                    alt=""
                >

                <input
                    type="text"
                    id="search-input"
                    data-id="search-input"
                    placeholder="Search Pokémon"
                >

                <img
                    class="header-monster"
                    src="./assets/icons/header-icon.svg"
                    alt=""
                >

                <button
                        id="search-button"
                        data-id="search-button"
                        type="button"
                            >
                        Search
                </button>
            </header>
        </div>
    `;
}

export function getPokemonCardTemplate(
  index,
  pokemonName,
  pokemonImage,
  pokemonId,
  pokemonTypes,
  pokemonTypeTwo,
) {
  // Create the Pokémon card
  let html = `
        <div class="pokemon-card ${pokemonTypes}">
            <button
                class="btn-card"
                data-id="card"
                onclick="openDialog(${index})"
            >
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
                    Type: ${pokemonTypes} ${pokemonTypeTwo}
                </span>
            </button>
        </div>
    `;

  return html;
}

export function getFooterTemplate() {
  // Create the footer
  return `
        <footer class="footer">
            <a href="#">Impressum</a>
            <br>

            <br>

            <span id="year" class="footer-span">
                @ Developer Akademie 2026
            </span>
        </footer>
    `;
}
