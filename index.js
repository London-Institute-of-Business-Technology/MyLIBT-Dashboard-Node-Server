const express = require('express');
require('dotenv').config();
const app = express();
const axios = require('axios');

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

const routes = require('./routes/xeroProxy');

app.get('/api/xero/invoices', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log("Invoking xero invoices");
    axios.get('https://api.xero.com/api.xro/2.0/Invoices', {
        headers: {
            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzcwODk5MTQsImV4cCI6MTY3NzA5MTcxNCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRDQxNzg3MTMzNjcxNEUwQjg3Rjk5MTg4NDg1OTZCMzkiLCJzdWIiOiI5MmNiOWU5Y2EzMzQ1Yjg1YTIwMGE5NDMwYTk3ZjQyMSIsImF1dGhfdGltZSI6MTY3NjkxMzg2OCwieGVyb191c2VyaWQiOiI2NTRiYmZjMi04YTIyLTQzY2YtODA1MC1lNmZlMjJhY2RkMjkiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImY4YzJmMDQ4NDA1MjRlMWQ5N2VkYWJlMTNiZGJlZjAyIiwic2lkIjoiZjhjMmYwNDg0MDUyNGUxZDk3ZWRhYmUxM2JkYmVmMDIiLCJqdGkiOiJGMEFCQTk1NjMwNkU4QjMxMENCRTYyMDQ5NkRDRjA0NCIsImF1dGhlbnRpY2F0aW9uX2V2ZW50X2lkIjoiYzZjNzZiYTYtMWFiMi00NWNmLTlmYmQtNGMzYzNmYzY2N2ZjIiwic2NvcGUiOlsiZW1haWwiLCJwcm9maWxlIiwib3BlbmlkIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwiYWNjb3VudGluZy5jb250YWN0cy5yZWFkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.ElRD-WSTRGt922YdInDtv0SBURIbhGKH6yvsZbnPBL9WLGrbx93x_9yZK4et2k5Bwk6xe3GwRHK3GD4d7k_CmkUThZtpTe0SCkb0jBrNnAme1_5uLcj3g19-uDLNw0oQUR2phGfNZKrB1j4YaHgw-fSJwXSGEtQEQ8gc5Goi3qB9XEUjwhlIGtcRwk0ftUMGgy737Cn1Iqcq4-HY41yEKBD9tXjgPx6gZBN_SxS3p_vzs_x0sYd0TRsiC1LqKlRs5d8QmoaeDvurMPNcXhO0F6I98D6_jeDOEXXBk_BysWKwZFOySwxTBOYIAQIs3OcEgTGHTjdEj3NxgzNgcSVc6A',
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then(function (response) {
            console.log(response)
            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
            res.send(JSON.stringify(response.data));
        });
})

getToken = function () {

}
