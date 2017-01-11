'use strict';

/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const RpiDht = require('rpi-dht-sensor');

module.exports = NodeHelper.create({
  	start: function () {
		console.log("Starting helper: " + this.name);
	},

  	socketNotificationReceived: function(notification, payload) {
	      	const self = this;
	      	this.config = payload;

	      	this.dht = new RpiDht.DHT11(this.config.sensorPIN);
		
		setInterval(function() {
			self.checkTemperature();
		}, this.config.updateInterval);
  	},

	checkTemperature: function(){
		const self = this;

		var values = this.dht.read();
		var temp = values.temperature.toFixed(1);
		var hum = values.humidity.toFixed(1);

		console.log("T: " + temp + " H: " + hum);				
		
		if(temp > 0){
			self.sendSocketNotification('DHT_TEMPERATURE', temp);
		}
		if(hum > 0){
			self.sendSocketNotification('DHT_HUMIDITY', hum);
		}
	}
});
