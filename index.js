const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

const xero = require('./routes/xeroProxy');

app.use('/api/xero', xero);