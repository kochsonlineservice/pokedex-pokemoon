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
