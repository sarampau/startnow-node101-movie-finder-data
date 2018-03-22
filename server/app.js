const path = require('path');
const express = require('express');
const logger = require('morgan');
const axios = require('axios');

const app = express();
const cache = {};

app.use(logger('dev'));

// route handler for requests to /data
app.get('/', function (req, res) {
  if (cache[req.url]) {
    return res.json(cache[req.url].data);
  }

  return axios.get('http://www.omdbapi.com' + req.url + '&apikey=8730e0e')
    .then(response => {
      cache[req.url] = {
        timestamp: Date.now(),
        data: response.data
      };
      return res.json(response.data);
    })
    .catch(e => {
      console.log(e);
      return res.json('not ok');
    });
});

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;