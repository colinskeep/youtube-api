require('dotenv').config();
const express = require('express');
const app = require('./src/express.js');

app.listen(process.env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`API started on port ${process.env.API_PORT}`);
});

app.use(express.static(__dirname + '/poly'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: '.'});
});

module.exports = app;
