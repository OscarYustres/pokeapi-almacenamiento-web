


async function buscarPersonajes() {
    try {
        console.log("Buscando Pokémon...");
        
        // URL de la API de Pokémon
        const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const data = await response.json();
        console.log(data);
        
        console.log("Pokémon encontrados:", data.results);
        
        // Obtener detalles de cada Pokémon
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

function crearTarjetas(informacionDePersonajes) {
    const containerTarjetas = document.querySelector('.container-tarjetas');

    for(let personaje of informacionDePersonajes){
        let tarjeta = document.createElement('div');
        tarjeta.innerHTML = `
        <div class="simpson-tarjeta">
                    <img src="${personaje.image}" alt="image${personaje.name}">
                    <p class="nombre">${personaje.name}</p>
                    
                </div>`
        containerTarjetas.append(tarjeta); 
    }
}



const listaPersonajes = await buscarPersonajes();

crearTarjetas(listaPersonajes);

const botonBuscar = document.getElementById('boton-buscar');

botonBuscar.addEventListener('click', buscarPersonaje);

function buscarPersonaje(){
    console.log("Hola buscar pokemon");
    
    const inputBusqueda = document.getElementById('nombre-personaje');
    console.log("Se ejecuto el evento correctamente");

    console.log(inputBusqueda.value);

    const textoIngresado = inputBusqueda.value.trim().toLowerCase();

    if(textoIngresado != ""){

        const personajesEncontrados = listaPersonajes.filter(personaje => 
            personaje.name?.toLowerCase().includes(textoIngresado));

            console.log(personajesEncontrados);

            crearTarjetaPersonajeEncontrado(personajesEncontrados);

    }else{
        console.log("No se ingreso ningun nombre de personaje");
        
    }
        
}

function crearTarjetaPersonajeEncontrado(listaPersonajes){
    const containerResultadosBusqueda = document.getElementById('container-tarjetas-busqueda');
    containerResultadosBusqueda.innerHTML = ""; // Limpia búsquedas previas

    for (let personaje of listaPersonajes) {
        let tarjeta = document.createElement('div');

        tarjeta.style.position = "relative";

        tarjeta.innerHTML = `
        <div class="simpson-tarjeta-busqueda">
                    <button class="btn-corazon" style="position: absolute; top: 10px; right: 10px; background: white; border: 1px solid black; border-radius: 50%; font-size: 20px; cursor: pointer; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; z-index: 10;">
                        🤍
                    </button>
                    <img src="${personaje.image}" alt="image${personaje.name}">
                    <p class="nombre">${personaje.name}</p>
                    
                </div>`

        containerResultadosBusqueda.append(tarjeta);

        // >>> CORRECCIÓN AQUÍ: Moví este bloque adentro del ciclo para que reconozca la tarjeta que se acaba de crear.
        const botonCorazon = tarjeta.querySelector('.btn-corazon');
        botonCorazon.addEventListener('click', () => {
            guardarEnFavoritos(personaje, botonCorazon);
        });
    }

}

const botonBorrarResultado = document.getElementById('boton-borrar-resultados');


botonBorrarResultado.addEventListener('click', limpiarResultados);

function limpiarResultados(){
    const listaTarjetasBusqueda = document.querySelectorAll('.simpson-tarjeta-busqueda');
    
    listaTarjetasBusqueda.forEach(tarjeta => {
        tarjeta.remove();
    })

}

function guardarEnFavoritos(pokemon,boton) {
    let favoritosActuales = JSON.parse(localStorage.getItem('pokemonFavoritos')) || [];
    const existe = favoritosActuales.some(fav => fav.id === pokemon.id);

    if (!existe) {
        favoritosActuales.push(pokemon);
        localStorage.setItem('pokemonFavoritos', JSON.stringify(favoritosActuales));
        boton.textContent = "❤️"; // Cambia el icono a relleno al guardar
        console.log(`${pokemon.name} guardado en favoritos.`);
    
        const contenedorFavoritos = document.getElementById('favs');

        contenedorFavoritos.innerHTML = "";

        favoritosActuales.forEach(pokemon => {
            let tarjeta = document.createElement('div');

             tarjeta.innerHTML = `
            <div class="simpson-tarjeta">
                <img src="${pokemon.image}" alt="image${pokemon.name}">
                <p class="nombre">${pokemon.name}</p>
                
            </div>`

            contenedorFavoritos.append(tarjeta);
        });
    } else {
        console.log(`${pokemon.name} ya está en favoritos.`);
        favoritosActuales = favoritosActuales.filter(fav => fav.id !== pokemon.id);
        localStorage.setItem('pokemonFavoritos', JSON.stringify(favoritosActuales));
        boton.textContent = "🤍";
    }

}