async function buscarPersonajes() {

    try{

        const response = await fetch('https://thesimpsonsapi.com/api');
        
        if(!response.ok) throw new Error('Error al conectar con API');
        const data = await response.json()

        const responsePersonajes = await fetch(data.characters);

        if(!responsePersonajes.ok) throw new Error('Error al buscar los personajes');
        
        const listaPersonajes = await responsePersonajes.json();
        
        return listaPersonajes.results;
        

    }catch(error){
        console.log('Hubo un error al buscar los personajes');
        return [];
    }
    
}

function crearTarjetas(informacionDePersonajes) {
    const containerTarjetas = document.querySelector('.container-tarjetas');

    for(let personaje of informacionDePersonajes){
        let tarjeta = document.createElement('div');
        tarjeta.innerHTML = `
        <div class="simpson-tarjeta">
                    <img src="https://cdn.thesimpsonsapi.com/200${personaje.portrait_path}" alt="image${personaje.name}">
                    <p class="nombre">${personaje.name}</p>
                    <p class="ocupacion">${personaje.occupation}</p>
                    <p class="frase">${personaje.phrases.length != 0 ? personaje.phrases[0] : 'No tengo frase'}</p>
                </div>`
        containerTarjetas.append(tarjeta); 
    }
}



const listaPersonajes = await buscarPersonajes();

crearTarjetas(listaPersonajes);

const botonBuscar = document.getElementById('boton-buscar');

botonBuscar.addEventListener('click', buscarPersonaje);

function buscarPersonaje(){
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
                    <img src="https://cdn.thesimpsonsapi.com/200${personaje.portrait_path}" alt="image${personaje.name}">
                    <p class="nombre">${personaje.name}</p>
                    <p class="ocupacion">${personaje.occupation}</p>
                    <p class="frase">${personaje.phrases.length != 0 ? personaje.phrases[0] : 'No tengo frase'}</p>
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