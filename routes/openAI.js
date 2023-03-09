const express = require('express');
const openAI = express.Router();
const axios = require('axios');
const apiKey = require('../model/apiKeys');

const { Configuration, OpenAIApi } = require("openai");

openAI.post("/", async (req, res) => {
    //const { prompt } = JSON.stringify(req.body.prompt);
    const key =await  apiKey.findOne({ "api": "openai" });
    console.log(key);
    const configuration = new Configuration({
        apiKey: key.key,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0,
        prompt: `Give 3 recomended books for ${JSON.stringify(req.body.prompt)} with Amazon buy links. Convert the result to JSON and put into an array`,
    });
     res.send(completion.data.choices[0].text);
});

module.exports = openAI;