console.log("Hola");


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

    for (let personaje of listaPersonajes) {
        let tarjeta = document.createElement('div');

        tarjeta.innerHTML = `
        <div class="simpson-tarjeta-busqueda">
                    <img src="${personaje.image}" alt="image${personaje.name}">
                    <p class="nombre">${personaje.name}</p>
                    
                </div>`

        containerResultadosBusqueda.append(tarjeta);
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