

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

