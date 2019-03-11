require('dotenv').config();
const express = require('express');
const app = require('./src/express.js');

app.listen(process.env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`API started on port ${process.env.API_PORT}`);
});

// Serve static files from the main build directory
app.use(express.static(__dirname + '/poly'));

// Render index.html on the main page, specify the root
app.get('/', function(req, res){
  res.sendFile("index.html", {root: '.'});
});

module.exports = app;
