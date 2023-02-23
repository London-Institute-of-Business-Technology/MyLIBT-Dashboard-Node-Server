const express = require('express');
const router = express.Router();
const axios = require('axios');

const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzcxNDUwMzgsImV4cCI6MTY3NzE0NjgzOCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRDQxNzg3MTMzNjcxNEUwQjg3Rjk5MTg4NDg1OTZCMzkiLCJzdWIiOiI5MmNiOWU5Y2EzMzQ1Yjg1YTIwMGE5NDMwYTk3ZjQyMSIsImF1dGhfdGltZSI6MTY3NzA5ODI1OSwieGVyb191c2VyaWQiOiI2NTRiYmZjMi04YTIyLTQzY2YtODA1MC1lNmZlMjJhY2RkMjkiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6IjEwNzg1NDRlZTk5MjQ1MWZiZWJmNzJhOTg4M2MxOTU3Iiwic2lkIjoiMTA3ODU0NGVlOTkyNDUxZmJlYmY3MmE5ODgzYzE5NTciLCJqdGkiOiIzRDg2OTJFRkE2NTMyNzg4MTYyMDA5Rjc2NTc2OUY3NiIsImF1dGhlbnRpY2F0aW9uX2V2ZW50X2lkIjoiMDg1ZTg3ZTUtNDQ0OS00MTk1LWFmZGQtZjQ0MjM0NGEwMzY0Iiwic2NvcGUiOlsiZW1haWwiLCJwcm9maWxlIiwib3BlbmlkIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwiYWNjb3VudGluZy5jb250YWN0cy5yZWFkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.F2OOVm98A9fgBLc1p2ZocFOc2Z1bTyY2h2PkfxpgngKKichAtwqViPCCIMKlq3jldphkTncJn2t1L2npOi1YYqrDcanFqf1plQK2mT1vzEDeSAq5bG-Y8GufwMN5y3Vip2B38b454_4oEyHRC9mF6xBjHLd8N48N-JhlDupWx_11jCIJU-UDU6DXbVQRWXxcEGrfyv_QmPhSkGjupacU_c2puSVRkaERoXZBn19Q4zO2ggvJLjZc8rDD4ZmAL6_T1zwPjYIlfWU48qndMSuLRqHI9ulyQJoO2NgKf3bKdIy1V2pb7A3jZVEfGi7PzFPoizSgh5sF4h9W4NJlIOWRig"

router.get('/invoice', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
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