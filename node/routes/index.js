var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');
var soap = require('soap');

router.get('/api/getWeather', function (req, res, next) {

	res.header("Access-Control-Allow-Origin", "*");

	if (!req.query.lat || !req.query.lon) {
		res.status(422);
		res.send({
			'error': 'lat and lon parameters is required'
		});
	} else {
		var baseUri = 'http://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl';
		var endpoint = 'https://graphical.weather.gov:443/xml/SOAP_server/ndfdXMLserver.php';
		var numDays = 3;
		var startDay = new Date();
		var lat = req.query.lat;
		var lon = req.query.lon;
		var response = [];

		soap.createClient(baseUri, {endpoint: endpoint}, function (err, client) {
			if (err) {
				console.error(err)
			} else {
				var args = {
					latitude: lat,
					longitude: lon,
					startDate: startDay,
					numDays: numDays,
					Unit: 'e',
					format: '24 hourly'

				};

				client.NDFDgenByDay(args, function (err, result) {

					if (err) {
						res.status(400);
						res.send({
							error: 'There was error during fetching weather'
						});
					} else {
						xml2js.parseString(result.dwmlByDayOut.$value, function (err, json) {

							var temperatures = json.dwml.data[0].parameters[0].temperature;
							var icons = json.dwml.data[0].parameters[0]['conditions-icon'][0]['icon-link'];
							var day = {};

							for (var i = 0; i < numDays; i++) {

								day.highTemp = getTemperature(temperatures, 'maximum', i);
								day.minTemp = getTemperature(temperatures, 'minimum', i);
								day.icon = icons[i];
								day.date = getDate(startDay, i);

								response.push(day);
								day = {};
							}

							res.send({
								'response': response,
							});
						});
					}
				});
			}
		});
	}
});

function getTemperature(temperatures, type, day) {
	var value = false;
	temperatures.forEach(function (temp) {
		if (temp['$'].type === type) {
			value = temp.value[day];
		}
	});

	return value;
}

function getDate(startDay, day) {
	return new Date(startDay.setDate(startDay.getDate() + day)).toDateString()
}


module.exports = router;
