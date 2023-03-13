const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');
var Memcached = require('memcached');
var memcached = new Memcached();
const cron = require("node-cron");
const lib = require("./services/scheduleService");
const logger = require('./services/loggerService');
const expressPinoLogger = require('express-pino-logger');



const mongoString = process.env.DATABASE_URL

memcached.connect('localhost:11211', function (err, conn) {
    if (err) {
        console.log(conn.server, 'error while memcached connection!!');
    } else {
        console.log("memcache connected !")
    }
});

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

cron.schedule("* * * */30 * *", function () {
    console.log("running a task every 60 seconds");
    lib.updateRefeshToken();

});

app.use(express.json());

const loggerMidlleware = expressPinoLogger({
    logger: logger,
    autoLogging: true,
});

app.use(loggerMidlleware);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

const xero = require('./routes/xeroProxy');
const openAI = require('./routes/openAI');
const brightcamp = require('./routes/brightcamp');

app.use('/api/xero', xero);
app.use('/api/openAI', openAI);
app.use('/api/brightcamp', brightcamp);