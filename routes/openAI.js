const express = require('express');
const openAI = express.Router();
const axios = require('axios');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);


openAI.post("/", async (req, res) => {
    //const { prompt } = JSON.stringify(req.body.prompt);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0,
        prompt: `Give 3 recomended books for ${JSON.stringify(req.body.prompt)} with Amazon buy links. Convert the result to JSON and put into an array`,
    });
    //console.log(JSON.parse(completion.data.choices[0].text))
    res.send(completion.data.choices[0].text);
});

module.exports = openAI;