const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');
var Memcached = require('memcached');
var memcached = new Memcached();

memcached.connect('localhost:11211', function (err, conn) {
    if (err) {
        console.log(conn.server, 'error while memcached connection!!');
    } else {
        console.log("memcache connected !")
    }
});

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

const xero = require('./routes/xeroProxy');

app.use('/api/xero', xero);