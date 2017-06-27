var map;
var geoJSON;
var request;
var gettingData = false;
var openWeatherMapKey = "437f2ce40e5e9a47b1385c412901cc89";

/**Iniciamos los valores para el mapa*/
function initialize() {
	var mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(-16.290154, -63.588653),
		mapTypeControl: false,
		streetViewControl: false,
		scaleControl: false
	};

	function crearLineaInformativa(clave, valor, unidad, padre) {
		var hijo = document.createElement('p');
		hijo.innerHTML = clave + ': ' + valor+ ' '+unidad;
		padre.appendChild(hijo);
	}

	function removeAllChilds(a) {
		while (a.hasChildNodes())
			a.removeChild(a.firstChild);
	}

	/**Instanciamos en map el div map-canvas*/
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	checkIfDataRequested();

	map.data.addListener('click', function (event) {
		var titulo = document.getElementById('titulo_card');
		titulo.style.visibility='visible';
		titulo.innerHTML = event.feature.getProperty("city");
		document.getElementById('btn_historico').disabled = false;
		var div_desc = document.getElementById('descripcion');
		removeAllChilds(div_desc);
		crearLineaInformativa('Descripcion', event.feature.getProperty("description"), ' ', div_desc);
		crearLineaInformativa('Temperatura', event.feature.getProperty("temperature"), '°C',div_desc);
		crearLineaInformativa('Humedad', event.feature.getProperty("humidity"), '%',div_desc);
		crearLineaInformativa('Presión', event.feature.getProperty("pressure"), 'hpa',div_desc);
/**
		infowindow.setContent(
			"<img src=" + event.feature.getProperty("icon") + ">" +
			"<br /><strong>" + event.feature.getProperty("city") + "</strong>" +
			"<br />" + event.feature.getProperty("temperature") + "&deg;C" +
			"<br />" + event.feature.getProperty("description") + "<br/>" +
			" Humedad: " + event.feature.getProperty("humidity") + " % <br/>" +
			" Presión: " + event.feature.getProperty("pressure") + " hpa <br/>" +
			"<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal'> + Más información</button>"
		);

		infowindow.setOptions({
			position: {
				lat: event.latLng.lat(),
				lng: event.latLng.lng()
			},
			pixelOffset: {
				width: 0,
				height: -15
			}
		});
*/
		$(function () {
			console.log(event.feature.getProperty("city"));
			var request1;
			var gettingData1 = false;
			var results1;
			var datosX = new Array;
			var datosY = new Array;
			var datosZ = new Array;
			var dias = new Array;

			var getWeather1 = function () {
				gettingData1 = true;
				var requestString = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + event.feature.getProperty("id") + "&mode=json&units=metric&cnt=12&lang=es&appid=437f2ce40e5e9a47b1385c412901cc89";
				request = new XMLHttpRequest();
				request.onload = proccessResults1;
				request.open("get", requestString, true);
				request.send();
			};

			var proccessResults1 = function () {
				console.log(this);
				results1 = JSON.parse(this.responseText);
				console.log(results1);
				for (var i = 0; i < results1.list.length; i++) {
					datosX[i] = results1.list[i].temp.morn;
					datosY[i] = results1.list[i].temp.eve;
					datosZ[i] = results1.list[i].temp.night;
					var fecha = new Date(results1.list[i].dt * 1000);
					dias[i] = fecha.getDate() + '/' + (fecha.getMonth() + 1);
				}

				Highcharts.chart('container', {
					chart: {
						type: 'spline'
					},
					credits: {
						enabled: false
					},
					title: {
						text: results1.city.name
					},
					subtitle: {
						text: 'SouthMapWeather'
					},
					xAxis: {
						categories: dias
					},
					yAxis: {
						title: {
							text: 'Temperatura'
						},
						labels: {
							formatter: function () {
								return this.value + '°';
							}
						}
					},
					tooltip: {
						crosshairs: true,
						shared: true
					},
					plotOptions: {
						spline: {
							marker: {
								radius: 4,
								lineColor: '#666666',
								lineWidth: 1
							}
						}
					},
					series: [{
						name: 'Mañana',
						marker: {
							symbol: 'square'
						},
						data: datosX

                }, {
						name: 'Tarde',
						marker: {
							symbol: 'diamond'
						},
						data: datosY
                }, {
						name: 'Noche',
						marker: {
							symbol: 'square'
						},
						data: datosZ
                }]
				});


			};

			getWeather1();
		});

		//infowindow.open(map);

	});

}

var checkIfDataRequested = function () {
	if (gettingData === true) {
		request.abort();
		gettingData = false;
	}
	getWeather();
};

var getWeather = function () {
	gettingData = true;
	var requestString = "http://api.openweathermap.org/data/2.5/group?id=3871336,3936456,3435910,3688689,3646738,3657509,3469058,3441575,3439389,3911925,3652462,3378644,3382160,3383330,3947322,3696183,3451190,3941584,3903987&units=metric&lang=es&APPID=437f2ce40e5e9a47b1385c412901cc89";
	request = new XMLHttpRequest();
	request.onload = proccessResults;
	request.open("get", requestString, true);
	request.send();
};

var proccessResults = function () {
	console.log(this);
	var results = JSON.parse(this.responseText);
	if (results.list.length > 0) {
		resetData();
		for (var i = 0; i < results.list.length; i++) {
			geoJSON.features.push(jsonToGeoJson(results.list[i]));
		}
		drawIcons(geoJSON);
	}

};
var infowindow = new google.maps.InfoWindow();

var jsonToGeoJson = function (weatherItem) {
	var feature = {
		type: "Feature",
		properties: {
			id: weatherItem.id,
			city: weatherItem.name,
			weather: weatherItem.weather[0].main,
			description: weatherItem.weather[0].description,
			temperature: weatherItem.main.temp,
			min: weatherItem.main.temp_min,
			max: weatherItem.main.temp_max,
			humidity: weatherItem.main.humidity,
			pressure: weatherItem.main.pressure,
			windSpeed: weatherItem.wind.speed,
			windDegrees: weatherItem.wind.deg,
			windGust: weatherItem.wind.gust,
			icon: "http://openweathermap.org/img/w/" +
				weatherItem.weather[0].icon + ".png",
			coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
		},
		geometry: {
			type: "Point",
			coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
		}
	};
	// Set the custom marker icon
	map.data.setStyle(function (feature) {
		return {
			icon: {
				url: feature.getProperty('icon'),
				anchor: new google.maps.Point(25, 25),
			},
			title: ':)' + feature.getProperty('city')
		};
	});
	// returns object
	return feature;
};
// Add the markers to the map
var drawIcons = function (weather) {
	map.data.addGeoJson(geoJSON);
	// Set the flag to finished
	gettingData = false;
};
// Clear data layer and geoJSON
var resetData = function () {
	geoJSON = {
		type: "FeatureCollection",
		features: []
	};
};

google.maps.event.addDomListener(window, 'load', initialize);
