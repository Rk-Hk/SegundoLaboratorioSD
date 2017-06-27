
var socket = io.connect('http://localhost:8080',{'forceNew':true});

/**
* Esta a la escucha del evento messages de parte del servidor
**/
socket.on('messages', function(data) {  
   console.log(data);
	render(data);
});

function cambiarColorTemp(valor , prueba){
	if(valor>25){
		prueba.style.color = '#fc465c';
	}	else if(valor>15 && valor<=25){
		prueba.style.color = '#fc9f00';
	}	else if(valor>10 && valor<=15){
		prueba.style.color = '#fdee00';
	}	else if(valor>10 && valor<=15){
		prueba.style.color = '#75d5ff';
	}	else {
		prueba.style.color = '#18b6f9';
	}
}


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

	var prueba = document.getElementById('val_temp_mes');
	cambiarColorTemp(val_temp, prueba);
	prueba.innerHTML=val_temp;

	var prueba2 = document.getElementById('val_temp_anual');
	cambiarColorTemp(val_temp_anual, prueba2);
	prueba.innerHTML=val_temp_anual;

	
	document.getElementById('titulo').innerHTML = titulo;
	document.getElementById('capital').innerHTML = capital;
	document.getElementById('val_mes').innerHTML = val_mes;
	document.getElementById('val_mes_p').innerHTML = val_mes;
	document.getElementById('val_prec_mes').innerHTML = val_prec;
	document.getElementById('val_prec_anual').innerHTML = val_prec_anual;


}



//Ejemplo de link para consultar por pais https://restcountries.eu/rest/v2/alpha/per?fields=name;capital
