var express = require('express');
var staticRoutes = require('./static');
var docRoutes = require('./doc');
var patientRoutes = require('./patient');

var initRoutes = function(app) {
	console.log("Initializing Routes...");

	app.use('/', staticRoutes); // Static + Home + Auth + Search
	app.use('/doctor', docRoutes); // Static + Home + Auth + Search
	app.use('/patient', patientRoutes); // Static + Home + Auth + Search

	// Ending Routes
	console.log('Finished Initializing Routes...');
}

module.exports = initRoutes;
