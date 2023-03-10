const express = require('express');
const brightcamp = express.Router();
const axios = require('axios');

brightcamp.get("/", async (req, res) => {
    console.log('adooooo')

    axios.get('https://brightcamp.org/api/courses/v1/courses/')
        .then(response => {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });

});

module.exports = brightcamp;