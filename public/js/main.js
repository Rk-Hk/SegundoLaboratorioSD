var https = require('https');

var socket = io.connect('http://localhost:8080',{'forceNew':true});


var optionsget = {
    host : 'restcountries.eu', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/rest/v2/alpha/', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

/**
* Esta a la escucha del evento messages de parte del servidor
**/
socket.on('messages', function(data) {  
   console.log(data);
	render(data);
});


//Aqui incluimos la funcionalidad de renderizado en pantalla , para que paresca un chat.
function render (data){
	var titulo = `${data.pais}`;
	var html = `<div>
						<em>${data.temp_anual}</em>
						<em>${data.prec_anual}</em>
					</div>`;
	
	document.getElementById('titulo').innerHTML = titulo;
	document.getElementById('mensajes').innerHTML=html;
}

//Ejemplo de link para consultar por pais https://restcountries.eu/rest/v2/alpha/per?fields=name;capital