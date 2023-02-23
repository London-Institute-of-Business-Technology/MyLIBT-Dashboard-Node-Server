const express = require('express');
const router = express.Router();
const axios = require('axios');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzcxNzA4MzcsImV4cCI6MTY3NzE3MjYzNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRDQxNzg3MTMzNjcxNEUwQjg3Rjk5MTg4NDg1OTZCMzkiLCJzdWIiOiI5MmNiOWU5Y2EzMzQ1Yjg1YTIwMGE5NDMwYTk3ZjQyMSIsImF1dGhfdGltZSI6MTY3NzE2NDUyMSwieGVyb191c2VyaWQiOiI2NTRiYmZjMi04YTIyLTQzY2YtODA1MC1lNmZlMjJhY2RkMjkiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImFlOTNkZmFlYmY4MjRlOTBhZGQ1YzVkZGIxOTBiY2Y2Iiwic2lkIjoiYWU5M2RmYWViZjgyNGU5MGFkZDVjNWRkYjE5MGJjZjYiLCJqdGkiOiJEQzIzRDkwQzk3OTVDM0UxREJDREFDMTE0NzFEMkZBNiIsImF1dGhlbnRpY2F0aW9uX2V2ZW50X2lkIjoiZmZkNGZiNzItODZiNS00OWQ3LWEzYmMtMTk0OTQ4OGEzY2IzIiwic2NvcGUiOlsiZW1haWwiLCJwcm9maWxlIiwib3BlbmlkIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwiYWNjb3VudGluZy5jb250YWN0cy5yZWFkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.YDjIfRdRwQ98QTUR7v9hqRyocBpEoyStt3AaV0tf1cUa24ZF2lRnITC-IALnp38TdZ5GfoStG7Fwa1AD-7oahiskpLLGrHxHWsEwOSZbOBAhuGfcGlGsKxorVlnhsgctbgQqWgUYS_y1MqBVHlSU618v3AKO_-ZwOfFbsmJwWLDkJisvBynwhp7ywjh3HFq1x3KI-Y6r9586Y_JtU0z4Xg15ebqwZFT97TE7UQQtZqbUucS14MIukLQG2bUnsQg-zA3HFyJnO1oHehz3OwAxvq1Mlmjn5YMjalu4dLvpQtOtdtLYV6cOwsM6cDFxgNyGE7XCq1Kdi0H75veHN0wmKA"

router.get('/invoice', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log("mmmmmmmmmmmmmm " + memcached)
    memcached.get('token', function (err, data) {
        console.log("Token is already there in memcaced " + data);
        if (data == null) {
            console.log("Generating a token");

        }
    });
    const { email } = req.query;
    console.log("Invoking xero invoices :" + email);
    axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${email}"`, {
        headers: {
            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then(function (response) {
            console.log(response.data.Contacts[0].ContactID);
            axios.get(`https://api.xero.com/api.xro/2.0/Invoices?ContactIDs=${response.data.Contacts[0].ContactID}`, {
                headers: {
                    'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Access-Control-Allow-Origin': '*',
                }
            })
                .then(function (result) {
                    console.log(result);
                    res.send(JSON.stringify(result.data));
                }).catch(function (err) {
                    console.log("Error occur while reading invoice :" + err);
                })
        })
        .catch(function (error) {
            console.log("Error occur while reading contacts :" + error);
        });
});

router.get('/paylink', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { invoiceId } = req.query;
    console.log("Invoking xero invoices :" + invoiceId);
    axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
        headers: {
            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then(function (response) {
            console.log(response.data);
            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log("Error occur while reading contacts :" + error);
        });
});

module.exports = router;