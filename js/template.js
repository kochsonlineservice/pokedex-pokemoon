export function getHeaderTemplate() {
  // Create the header
  return `
        <div class="header-content">
            <header>
                <a href="./index.html">
                    <h1>Pokédex</h1>
                </a>

               

                <div class="search-container">
                    <input
                        type="text"
                        id="search-input"
                        data-id="search-input"
                        placeholder="Search Pokémon"
                        
                    >
                    <button
                        id="clear-search-button"
                        type="button"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>

                    <button
                    id="search-button"
                    data-id="search-button"
                    type="button"
                    aria-label="Search Pokémon"
                >
                    Search
                </button>
                    
                </div>

               

                
            </header>
        </div>
    `;
}

export function getPokemonCardTemplate(pokemon, index) {
  // Create the Pokémon card

  let pokemonType = pokemon.types[0].type.name;

if (pokemon.types.length > 1) {
    pokemonType += " / " + pokemon.types[1].type.name;
}
  let html = `
        <li>
           <div class="pokemon-card ${pokemon.types[0].type.name}">
                <button
                    class="btn-card"
                    data-id="card"
                    onclick="openDialog(${index})"
                >
                    <span class="pokemon-name">
                      #${pokemon.id} ${pokemon.name}
                    </span>

                    <img
                        class="img-card"
                        data-id="card-image"
                       src="${pokemon.sprites.other["official-artwork"].front_default}"
                        alt=""
                    >

                    <span class="pokemon-type">
    Type: ${pokemonType}
</span>
                </button>
            </div>
        </li>
    `;

  return html;
}

export function getFooterTemplate() {
  // Create the footer
  return `
        <footer class="footer">
           
            <br>

            <br>

            <span id="year" class="footer-span"></span>
        </footer>
    `;
}
