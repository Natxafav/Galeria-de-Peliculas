import { API_KEY } from './env.js';

const apiKey = API_KEY;
let pagina = 1;
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-Es&page=`;

const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const navbar = document.querySelector('.navbar');

btnSiguiente.addEventListener('click', () => {
  if (pagina < 1000) {
    pagina += 1;
    cargarPeliculas();
  }
});

btnAnterior.addEventListener('click', () => {
  if (pagina > 1) {
    pagina -= 1;
    cargarPeliculas();
  }
});

// Consulta web
async function consultaWeb() {
  try {
    const response = await fetch(`${apiUrl}${pagina}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
}

// Barra de navegación y carga datos filtrados
async function cargarGeneros() {
  const apiUrl1 = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es`;
  
  try {
    //hacemos la consulta a la api
    const response = await fetch(apiUrl1);
    const data = await response.json();
    const generos = data.genres;
//iteramos por los datos obtenidos
    generos.forEach(element => {
      //creamos un contenedor para cada género obtenido
      const divNavIndiv = document.createElement('div');
      divNavIndiv.className = 'divNavIndiv';
      divNavIndiv.textContent = element.name;
//Añadimos un evento al hacer click
      divNavIndiv.addEventListener('click', async () => {
        const datosObtenidos = await consultaWeb();
        const id = element.id;
//filtramos los datos por id del género
        const peliculasFiltradas = datosObtenidos.filter(item => {
          return item.genre_ids.includes(Number(id));
        });

//borramos  los datos del contenedor
        const contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '';

//añadimos los contenedores y los datos de las películas
        peliculasFiltradas.forEach(item => {
          const div = document.createElement('div');
          div.className = 'pelicula';

          const poster = document.createElement('img');
          poster.className = 'poster';
          poster.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
          div.appendChild(poster);

          const title = document.createElement('h2');
          title.className = 'titulo';
          title.textContent = item.title;
          div.appendChild(title);

          cargarTrailerDescripcion(item, div);

          contenedor.appendChild(div);
        });
      });

      navbar.appendChild(divNavIndiv);
    });
  } catch (error) {
    console.log(error);
  }
}

//! Función para cargar trailer de la película
function cargarTrailerDescripcion(datos, div) {
  const apiUrl2 = `https://api.themoviedb.org/3/movie/${datos.id}/videos?api_key=${apiKey}&language=es-ES`;

  // Se verifica si ya existe un div de trailer, si es así, se elimina
  const trailerExistente = document.querySelector('.reproductorVideo');
  if (trailerExistente) {
    trailerExistente.remove();
  }
//se hace la consulta por la key de la pelicula
  fetch(apiUrl2)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const trailerKey = data.results[0].key;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${trailerKey}`;
        iframe.allowFullscreen = true;
        iframe.frameborder = 0;
        iframe.className = 'reproductorVideo';

        //Creamos un párrafo
        const descripcion = document.createElement('p');
        descripcion.className = 'descripcion';
        //Le asignamos el contenido
        descripcion.textContent = datos.overview;

        // Creamos un contenedor para el tráiler y descripción
        const divTrailerDescripcion = document.createElement("div");
        divTrailerDescripcion.className = "divTrailerDescripcion";
        divTrailerDescripcion.appendChild(iframe);
        divTrailerDescripcion.appendChild(descripcion);

        div.addEventListener('mouseenter', () => {
          div.appendChild(divTrailerDescripcion);
        });

        // Eliminamos al retirar el ratón
        div.addEventListener('mouseleave', () => {
          divTrailerDescripcion.remove();
        });
      }

    })
    .catch(error => {
      console.error(error);
    });
}

async function cargarPeliculas() {
  try {
    const datosObtenidos = await consultaWeb();
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = '';
    cargarGeneros(); // Cargar géneros una vez al inicio

    datosObtenidos.forEach(item => {
      const div = document.createElement('div');
      div.className = 'pelicula';

      const poster = document.createElement('img');
      poster.className = 'poster';
      poster.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
      div.appendChild(poster);

      const title = document.createElement('h2');
      title.className = 'titulo';
      title.textContent = item.title;
      div.appendChild(title);

      contenedor.appendChild(div);
      cargarTrailerDescripcion(item, div);
    });
  } catch (error) {
    console.log(error);
  }
}

cargarPeliculas();