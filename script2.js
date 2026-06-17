console.log("Hola");

// =========================================================================
// 1. OBTENER LOS 151 POKÉMON DE LA API
// =========================================================================
async function buscarPersonajes() {
    try {
        console.log("Buscando Pokémon...");
        const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const data = await response.json();
        
        const pokemonesConDetalles = await Promise.all(
            data.results.map(async (pokemon) => {
                const detallesResponse = await fetch(pokemon.url);
                const detalles = await detallesResponse.json();
                return {
                    name: pokemon.name,
                    image: detalles.sprites.other["official-artwork"].front_default || detalles.sprites.front_default,
                    id: detalles.id,
                    types: detalles.types.map(t => t.type.name).join(', '),
                    height: detalles.height,
                    weight: detalles.weight
                };
            })
        );
        
        return pokemonesConDetalles;
        
    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        return [];
    }
}

// =========================================================================
// 2. PINTAR LAS TARJETAS DE LA LISTA INICIAL (ABAJO)
// =========================================================================
function crearTarjetas(informacionDePersonajes) {
    const containerTarjetas = document.querySelector('.container-tarjetas');
    if (!containerTarjetas) return;
    containerTarjetas.innerHTML = ""; 

    for(let personaje of informacionDePersonajes){
        let tarjeta = document.createElement('div');
        tarjeta.innerHTML = `
        <div class="pokemon-tarjeta">
            <img src="${personaje.image}" alt="image${personaje.name}">
            <p class="nombre">${personaje.name}</p>
        </div>`;
        containerTarjetas.append(tarjeta); 
    }
}

// ARRANQUE DE LA APLICACIÓN
const listaPersonajes = await buscarPersonajes();
crearTarjetas(listaPersonajes);
actualizarSeccionFavoritos(); // Carga los favoritos del LocalStorage al iniciar

// =========================================================================
// 3. EVENTO DE BÚSQUEDA
// =========================================================================
const botonBuscar = document.getElementById('boton-buscar');
botonBuscar.addEventListener('click', buscarPersonaje);

function buscarPersonaje(){
    const inputBusqueda = document.getElementById('nombre-personaje');
    const textoIngresado = inputBusqueda.value.trim().toLowerCase();

    if(textoIngresado != ""){
        const personajesEncontrados = listaPersonajes.filter(personaje => 
            personaje.name?.toLowerCase().includes(textoIngresado));
            
        crearTarjetaPersonajeEncontrado(personajesEncontrados);
    } else {
        console.log("No se ingreso ningun nombre de personaje");
    }
}

// =========================================================================
// 4. PINTAR LOS RESULTADOS DE BÚSQUEDA (CON BOTÓN DE FAVORITO CONECTADO)
// =========================================================================
function crearTarjetaPersonajeEncontrado(listaPersonajes){
    const containerResultadosBusqueda = document.getElementById('container-tarjetas-busqueda');
    containerResultadosBusqueda.innerHTML = ""; 

    let favoritosActuales = JSON.parse(localStorage.getItem('pokemonFavoritos')) || [];

    for (let personaje of listaPersonajes) {
        let tarjeta = document.createElement('div');
        tarjeta.className = "pokemon-tarjeta-busqueda";
        tarjeta.style.position = "relative";

        const yaEsFavorito = favoritosActuales.some(fav => fav.id === personaje.id);
        const iconoCorazon = yaEsFavorito ? "❤️" : "🤍";

        tarjeta.innerHTML = `
            <button class="btn-corazon" style="position: absolute; top: 10px; right: 10px; background: white; border: 1px solid black; border-radius: 50%; font-size: 20px; cursor: pointer; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; z-index: 100;">
                ${iconoCorazon}
            </button>
            <img src="${personaje.image}" alt="image${personaje.name}">
            <p class="nombre">${personaje.name}</p>
        `;

        containerResultadosBusqueda.append(tarjeta);

        const botonCorazon = tarjeta.querySelector('.btn-corazon');
        botonCorazon.addEventListener('click', () => {
            guardarEnFavoritos(personaje, botonCorazon);
        });
    }
}

// =========================================================================
// 5. MANEJAR ACCIÓN DE GUARDAR / ELIMINAR FAVORITOS
// =========================================================================
function guardarEnFavoritos(pokemon, boton) {
    let favoritosActuales = JSON.parse(localStorage.getItem('pokemonFavoritos')) || [];
    const existe = favoritosActuales.some(fav => fav.id === pokemon.id);

    if (!existe) {
        favoritosActuales.push(pokemon);
        localStorage.setItem('pokemonFavoritos', JSON.stringify(favoritosActuales));
        boton.textContent = "❤️"; 
        actualizarSeccionFavoritos();
    } else {
        favoritosActuales = favoritosActuales.filter(fav => fav.id !== pokemon.id);
        localStorage.setItem('pokemonFavoritos', JSON.stringify(favoritosActuales));
        boton.textContent = "🤍";
        
        // Refresca la ventana inmediatamente si desmarcamos para limpiar la sección
        window.location.reload();
    }
}

// Helper para pintar la sección de favoritos de forma independiente
function actualizarSeccionFavoritos() {
    const contenedorFavoritos = document.getElementById('favs');
    if (!contenedorFavoritos) return;
    
    let favoritosActuales =
