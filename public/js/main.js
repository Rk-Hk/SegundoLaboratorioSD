
var socket = io.connect('http://localhost:8080',{'forceNew':true});

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
	var capital = `${data.capital}`;
	var bandera = document.getElementById('val_bandera');
	bandera.style.backgroundImage = `url('${data.bandera}')`;

	var val_mes = `${data.mes}`;
	var val_prec = `${data.prec}`;
	var val_prec_anual = `${data.prec_anual}`;
	var val_temp = `${data.temp}`;
	var val_temp_anual = `${data.temp_anual}`;

	
	document.getElementById('titulo').innerHTML = titulo;
	document.getElementById('capital').innerHTML = capital;
	document.getElementById('val_mes').innerHTML = val_mes;
	document.getElementById('val_mes_p').innerHTML = val_mes;
	document.getElementById('val_prec_mes').innerHTML = val_prec;
	document.getElementById('val_prec_anual').innerHTML = val_prec_anual;
	document.getElementById('val_temp_mes').innerHTML = val_temp;
	document.getElementById('val_temp_anual').innerHTML = val_temp_anual;


}

//Ejemplo de link para consultar por pais https://restcountries.eu/rest/v2/alpha/per?fields=name;capital
