const express = require('express');
const router = express.Router();
const axios = require('axios');

// router.get('/xero/invoices', async (req, res) => {

//     console.log("Invoking xero invoices");
//     axios.get('https://api.xero.com/api.xro/2.0/Invoices',{
//         headers: {
//             'xero-tenant-id':'2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
//             'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzcwMDY1NzQsImV4cCI6MTY3NzAwODM3NCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRDQxNzg3MTMzNjcxNEUwQjg3Rjk5MTg4NDg1OTZCMzkiLCJzdWIiOiI5MmNiOWU5Y2EzMzQ1Yjg1YTIwMGE5NDMwYTk3ZjQyMSIsImF1dGhfdGltZSI6MTY3NjkxMzg2OCwieGVyb191c2VyaWQiOiI2NTRiYmZjMi04YTIyLTQzY2YtODA1MC1lNmZlMjJhY2RkMjkiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImY4YzJmMDQ4NDA1MjRlMWQ5N2VkYWJlMTNiZGJlZjAyIiwic2lkIjoiZjhjMmYwNDg0MDUyNGUxZDk3ZWRhYmUxM2JkYmVmMDIiLCJqdGkiOiJGMEFCQTk1NjMwNkU4QjMxMENCRTYyMDQ5NkRDRjA0NCIsImF1dGhlbnRpY2F0aW9uX2V2ZW50X2lkIjoiYzZjNzZiYTYtMWFiMi00NWNmLTlmYmQtNGMzYzNmYzY2N2ZjIiwic2NvcGUiOlsiZW1haWwiLCJwcm9maWxlIiwib3BlbmlkIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwiYWNjb3VudGluZy5jb250YWN0cy5yZWFkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.mP7TF5ELcUb3HONimwsbggEWsHrV-5klufRCE6JucTBzwgYbas1W-bDbwyL2Qs3-uskjHu7FaE2QDv4y_C6GQpkt-ACw6qo3ERVeNU0-NiEIyr-vHcDXyycb9FIE4yMhOT8ab7R-A3tXbcOretA-Jz0F_atb4Tz6HdQzMjTTUQSjtB_hh6Ra6l_H3xvx2X-tTr-QHQjoqJKOnQWwMPLt_8DLHn7dOLFLhDilenZ3Qzb3lavPfX99Cv0L0LH9qJKa1V1ZlV2oK6yBBjCU0v9ub1FYXR3U4aCTdwkqH4-vQ4lCIUIC_mRXd6uup2xTwMPqpnNV4rL4a37_wnOp2dV41g',
//             'Access-Control-Allow-Origin':'*',
//           }
//     })
//     .then(function (response) {
//         console.log(response)
//         res.send(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// })