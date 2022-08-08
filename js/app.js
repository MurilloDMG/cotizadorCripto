const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector('#resultado');
const objBusqueda = {
   moneda: '',
   criptomoneda: ''
}
//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
   resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
   consultarCriptomoneda();
   formulario.addEventListener('submit', submitFormulario);
   criptomonedasSelect.addEventListener('change', leerValor);
   monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomoneda() {
   const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

   fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => obtenerCriptomonedas(resultado.Data))
      .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
   criptomonedas.forEach(cripto => {
      const { FullName, Name } = cripto.CoinInfo;
      const option = document.createElement('option');
      option.value = Name;
      option.textContent = FullName;
      criptomonedasSelect.appendChild(option);

   });
}

function leerValor(e) {

   objBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e) {
   e.preventDefault();
   //Validar
   const { moneda, criptomoneda } = objBusqueda;
   if (moneda === '' || criptomoneda === '') {
      mostrarAlerta('Ambos campos son obligatorios');
      return;
   }
    
   //Consultar la API con los resultados
   consultarApi();

}

function mostrarAlerta(msg) {
   const existeError = document.querySelector('.error');
   if (!existeError) {
      const divMnesaje = document.createElement('div');
      divMnesaje.classList.add('error');

      //Mnesaje de error
      divMnesaje.textContent = msg;

      formulario.appendChild(divMnesaje);

      setTimeout(() => {
         divMnesaje.remove();
      }, 1000);
   }

}

function consultarApi(){
   const {moneda, criptomoneda} = objBusqueda;
   
   const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostarSpinner();

   fetch(url)
        .then (respuesta=> respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda]);

        })

        function mostrarCotizacionHtml(cotizacion){

         limpiarHTML();
           const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
            
           const precio = document.createElement('p');
           precio.classList.add('precio');
           precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

           const precioAlto = document.createElement('p');
           precioAlto.innerHTML = `El Precio mas alto del dia: <span>${HIGHDAY}</span>`;

           const precioBajo = document.createElement('p');
           precioBajo.innerHTML = `El Precio mas bajo del dia: <span>${LOWDAY}</span>`;
           
           const ultimasHoras = document.createElement('p');
           ultimasHoras.innerHTML = `Variacion las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;
           
           const ultimaActualizacion = document.createElement('p');
           ultimaActualizacion.innerHTML = `Ultima Actualizacion: <span>${LASTUPDATE}</span>`;


           resultado.appendChild(precio);
           resultado.appendChild(precioAlto);
           resultado.appendChild(precioBajo);
           resultado.appendChild(ultimasHoras);
           resultado.appendChild(ultimaActualizacion);
           
        }


}

function limpiarHTML(){
   while (resultado.firstChild) {
      resultado.removeChild(resultado.firstChild);
   }
}

function mostarSpinner (){
   limpiarHTML();
   const spinner = document.createElement('div');
   spinner.classList.add('spinner');

   spinner.innerHTML = `
   <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
   
   `;

   resultado.appendChild(spinner);
}