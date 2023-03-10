const express = require('express');
const brightcamp = express.Router();
const axios = require('axios');
const log = require('../services/loggerService');

brightcamp.get("/", async (req, res) => {

    axios.get('https://brightcamp.org/api/courses/v1/courses/')
        .then(response => {
            log.info(response.data);
            res.send(response.data);
        })
        .catch(error => {
            log.error(error);
        });

});

module.exports = brightcamp;