/**Creamos un servidor para usarlo con express**/

var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var mysql = require('mysql');

var minVal = 1, maxval = 178;
var meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

var val_prec= null, val_mes, val_temp, val_prec_anual, val_temp_anual, val_pais;

var query_result;

var conexion = mysql.createPool({
	connectionLimit: 100,
	host		: 'localhost',
	user		: 'root',
	password	: 'Mprintfricardo8.',
	database	: 'countryweather',
	debug		: false
});

function numeroAleatorio(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getDataMonth(idpais, mes){
	conexion.query("SELECT nom_pais, dpc_"+meses[mes]+" , dpc_anual, dtc_"+meses[mes]+" , dtc_anual FROM data_prec_country, data_temp_country, paises WHERE id_dpc=id_pais and id_dtc=id_pais and id_dpc = id_dpc and id_pais = (?)", idpais, function(err, results , fields){
		if(err){
			throw err;
		}
		
		val_pais = results[0].nom_pais,
		val_mes = mes,
		val_prec = results[0]['dpc_'+meses[mes]],
		val_prec_anual = results[0].dpc_anual,
		val_temp = results[0]['dtc_'+meses[mes]],
		val_temp_anual = results[0].dtc_anual
		//console.log(query_result);
	});
}


setInterval(function(){
		getDataMonth(numeroAleatorio(minVal,maxval),numeroAleatorio(0,11));
	},5000);

app.use(express.static('public'));	

app.get('/websockets.html',function(req,res){
	res.status(200).send('Hello World :3');
	//res.sendFile(__dirname + '/index.html');
});

/**Funcion on esta a la escucha de la  llegada del mensaje conection.
 * Si llega conection desde un cliente (Navegador), realizara la funcion.
**/
function enviarData(socket){
	socket.emit('messages', {		
			pais			: val_pais,
			mes			: val_mes,
			temp			: val_temp,
			temp_anual	: val_temp_anual,
			prec			: val_prec,
			prec_anual	: val_prec_anual
		});
}

io.on('connection', function(socket) {
   console.log('Un cliente se ha conectado');
	setInterval(function(){
		enviarData(socket);
	},5000);
	//creamos messages, con un objeto que contienne id,text y autor.Esto sera enviado al cliente
	
});

/*Funcion serverlisten dejamos alfinal del fichero como ultima operacion a realizar*/
server.listen(8080,function(){
	console.log('servidor corriendo en http://localhost:8080');
});
