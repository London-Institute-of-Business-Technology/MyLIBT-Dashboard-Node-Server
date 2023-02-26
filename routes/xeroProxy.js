const express = require('express');
const router = express.Router();
const axios = require('axios');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
const TokenModel = require('../model/token');

const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2NzcxNzA4MzcsImV4cCI6MTY3NzE3MjYzNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiRDQxNzg3MTMzNjcxNEUwQjg3Rjk5MTg4NDg1OTZCMzkiLCJzdWIiOiI5MmNiOWU5Y2EzMzQ1Yjg1YTIwMGE5NDMwYTk3ZjQyMSIsImF1dGhfdGltZSI6MTY3NzE2NDUyMSwieGVyb191c2VyaWQiOiI2NTRiYmZjMi04YTIyLTQzY2YtODA1MC1lNmZlMjJhY2RkMjkiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6ImFlOTNkZmFlYmY4MjRlOTBhZGQ1YzVkZGIxOTBiY2Y2Iiwic2lkIjoiYWU5M2RmYWViZjgyNGU5MGFkZDVjNWRkYjE5MGJjZjYiLCJqdGkiOiJEQzIzRDkwQzk3OTVDM0UxREJDREFDMTE0NzFEMkZBNiIsImF1dGhlbnRpY2F0aW9uX2V2ZW50X2lkIjoiZmZkNGZiNzItODZiNS00OWQ3LWEzYmMtMTk0OTQ4OGEzY2IzIiwic2NvcGUiOlsiZW1haWwiLCJwcm9maWxlIiwib3BlbmlkIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwiYWNjb3VudGluZy5jb250YWN0cy5yZWFkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.YDjIfRdRwQ98QTUR7v9hqRyocBpEoyStt3AaV0tf1cUa24ZF2lRnITC-IALnp38TdZ5GfoStG7Fwa1AD-7oahiskpLLGrHxHWsEwOSZbOBAhuGfcGlGsKxorVlnhsgctbgQqWgUYS_y1MqBVHlSU618v3AKO_-ZwOfFbsmJwWLDkJisvBynwhp7ywjh3HFq1x3KI-Y6r9586Y_JtU0z4Xg15ebqwZFT97TE7UQQtZqbUucS14MIukLQG2bUnsQg-zA3HFyJnO1oHehz3OwAxvq1Mlmjn5YMjalu4dLvpQtOtdtLYV6cOwsM6cDFxgNyGE7XCq1Kdi0H75veHN0wmKA"

router.get('/invoice', async (req, res) => {
    let refreshToken ='';
    var accessToken = '';
    var contactId ='';
    const { email } = req.query;

    const url = 'https://identity.xero.com/connect/token';
    const clientId = 'D417871336714E0B87F9918848596B39';
    const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';
    
    memcached.get('token', function (err, data) {
        console.log("Token in memcached : " + data);
        if(data != undefined && data != null){
            accessToken = data;
            console.log("Invoking CONTACTS api in XERO. user :" + email);
            axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${email}"`, {
                headers: {
                    'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                    'Authorization': `Bearer ${accessToken}`,
                    'Access-Control-Allow-Origin': '*',
                    }
            })
            .then(function (response) {
                if(response == undefined && response == null && response.data == undefined && response.data.Contacts[0] == undefined ){
                    res.status =204
                    res.send(JSON.stringify({"message":"No Contact/s available for user :"+email}));
                } else{
                    contactId = response.data.Contacts[0].ContactID;
                    console.log("Invoking INVOICE  api in XERO. user :" + email +" contactId :"+contactId);
                    axios.get(`https://api.xero.com/api.xro/2.0/Invoices?ContactIDs=${contactId}`, {
                        headers: {
                            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                            'Authorization': `Bearer ${accessToken}`,
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then(function (result) {
                        if(result == undefined && result == null ){
                            res.status =204
                            res.send(JSON.stringify({"message":"No Contacts for request invoice"}));
                        } else{
                            res.status = 200 ;
                            res.send(JSON.stringify(result.data));
                        } 
                    })
                    .catch(function (err) {
                        console.log("Error occur while reading contacts :" + err);
                    })
                }
            })
            .catch(function (error) {
                console.log("Error occur while reading invoice :" + error);
            });
        }else{
            memcached.get('refreshToken', async function (err, data) {
                console.log("Extracting refresh_token from memcached :"+JSON.stringify(data));
                if(data != undefined && data != null){
                    console.log("refreshToken from memcached :"+data);
                    refreshToken = data
                }
                else{
                    console.log("refresh_token is null and trying to get from database :"+clientId);
                     const tokenObj =await TokenModel.findOne({"client_id":"D417871336714E0B87F9918848596B39"});
                     if(tokenObj != null){
                        refreshToken = tokenObj.refresh_token;
                     }else{
                        res.status =500
                         res.send(JSON.stringify({"message":"Error occur while creating token"}));
                     }
                }
                console.log("Invoking token generation since token is expired. refresh_token :"+refreshToken);
                return axios.post(url, {
                    'grant_type': 'refresh_token',
                    'refresh_token': refreshToken,
                    'client_id': clientId,
                    'client_secret': clientSecret
                },
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                .then(response => {
                    console.log("Token generated :"+JSON.stringify(response.data));
                    if (response.status != 200) {
                        console.log("Error occur while generating token " + response);
                        res.send(response);
                    }
                    memcached.set('token', response.data.access_token, 400, function (err) {
                        console.log("Writing accessToken to memcached :"+response.data.access_token);
                        if (err) {
                            console.log("cache updating failed :");
                        };
                    });
                    memcached.set('refreshToken', response.data.refresh_token, 120, function (err) {
                        console.log("Writing refreshToken to memcached :"+response.data.refresh_token);
                        if (err) {
                            console.log("cache updating failed :");
                        };
                    });
                    // const tokenModel = new TokenModel({
                    //     clientId:clientId,
                    //     refreshToken: response.data.refresh_token
                    // })
                    const filter = {client_id :clientId}
                    const update = {refresh_token :response.data.refresh_token}
                    TokenModel.findOneAndUpdate(filter,update,{new : true}, function(err){
                        if(err){
                            console.log("Token write to db failed :"+err);
                        }else{
                            console.log("Token was successfully updated")
                        }
                        
                    });
                    accessToken = response.data.access_token;
                    console.log("Invoking xero invoices :" + email);
                    axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${email}"`, {
                        headers: {
                            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                            'Authorization': `Bearer ${accessToken}`,
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then(function (response) {
                        // console.log(response.data.Contacts[0].ContactID);
                        if(response == undefined && response == null && response.data == undefined && response.data.Contacts[0] == undefined ){
                            res.status =204
                            res.send(JSON.stringify({"message":"No Invoice/s available "}));
                        } else {
                            contactId = response.data.Contacts[0].ContactID;
                            axios.get(`https://api.xero.com/api.xro/2.0/Invoices?ContactIDs=${contactId}`, {
                                headers: {
                                    'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Access-Control-Allow-Origin': '*',
                                }
                            })
                            .then(function (result) {
                                if(result == undefined && result == null ){
                                    res.status =204
                                    res.send(JSON.stringify({"message":"No Contacts for request invoice"}));
                                } else{
                                    res.status = 200 ;
                                    res.send(JSON.stringify(result.data));
                                } 
                            })
                            .catch(function (err) {
                                console.log("Error occur while reading contacts :" + err);
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log("Error occur while reading invoice :" + error);
                    });
                })
                .catch(function(error){
                    console.log("Error occur while generating token :" + error);
                })
            })
        }
    })
});
       

// router.get('/paylink', async (req, res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//     const { invoiceId } = req.query;
//     console.log("Invoking xero invoices :" + invoiceId);
//     axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
//         headers: {
//             'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
//             'Authorization': `Bearer ${ACCESS_TOKEN}`,
//             'Access-Control-Allow-Origin': '*',
//         }
//     })
//         .then(function (response) {
//             console.log(response.data);
//             res.send(JSON.stringify(response.data));
//         })
//         .catch(function (error) {
//             console.log("Error occur while reading contacts :" + error);
//         });
// });

router.get('/paylink', async (req, res) => {
    let refreshToken ='';
    var accessToken = '';
    var contactId ='';
    const { invoiceId } = req.query;

    const url = 'https://identity.xero.com/connect/token';
    const clientId = 'D417871336714E0B87F9918848596B39';
    const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';
    
    memcached.get('token', function (err, data) {
        console.log("Token in memcached : " + data);
        if(data != undefined && data != null){
            accessToken = data;
            console.log("Invoking OnlineInvoice api in XERO. invoiceId :" + invoiceId);
            axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
                headers: {
                    'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                    'Authorization': `Bearer ${accessToken}`,
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then(function (response) {
                console.log(response.data);
                res.send(JSON.stringify(response.data));
            })
            .catch(function (error) {
                 console.log("Error occur while reading OnlineInvoice :" + error);
            });
        }else{
            memcached.get('refreshToken', async function (err, data) {
                console.log("Extracting refresh_token from memcached :"+JSON.stringify(data));
                if(data != undefined && data != null){
                    console.log("refreshToken from memcached :"+data);
                    refreshToken = data
                }
                else{
                    console.log("refresh_token is null and trying to get from database :"+clientId);
                     const tokenObj =await TokenModel.findOne({"client_id":"D417871336714E0B87F9918848596B39"});
                     if(tokenObj != null){
                        refreshToken = tokenObj.refresh_token;
                     }else{
                        res.status =500
                         res.send(JSON.stringify({"message":"Error occur while creating token"}));
                     }
                }
                console.log("Invoking token generation since token is expired. refresh_token :"+refreshToken);
                return axios.post(url, {
                    'grant_type': 'refresh_token',
                    'refresh_token': refreshToken,
                    'client_id': clientId,
                    'client_secret': clientSecret
                },
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                .then(response => {
                    console.log("Token generated :"+JSON.stringify(response.data));
                    if (response.status != 200) {
                        console.log("Error occur while generating token " + response);
                        res.send(response);
                    }
                    memcached.set('token', response.data.access_token, 400, function (err) {
                        console.log("Writing accessToken to memcached :"+response.data.access_token);
                        if (err) {
                            console.log("cache updating failed :");
                        };
                    });
                    memcached.set('refreshToken', response.data.refresh_token, 120, function (err) {
                        console.log("Writing refreshToken to memcached :"+response.data.refresh_token);
                        if (err) {
                            console.log("cache updating failed :");
                        };
                    });
                    const filter = {client_id :clientId}
                    const update = {refresh_token :response.data.refresh_token}
                    TokenModel.findOneAndUpdate(filter,update,{new : true}, function(err){
                        if(err){
                            console.log("Token write to db failed :"+err);
                        }else{
                            console.log("Token was successfully updated")
                        }
                        
                    });
                    accessToken = response.data.access_token;
                    console.log("Invoking xero OnlineInvoice :" + email);
                    axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
                        headers: {
                            'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
                            'Authorization': `Bearer ${accessToken}`,
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then(function (response) {
                        console.log(response.data);
                        res.send(JSON.stringify(response.data));
                    })
                    .catch(function (error) {
                        console.log("Error occur while reading OnlineInvoice :" + error);
                    });
                })
                .catch(function(error){
                    console.log("Error occur while generating token :" + error);
                })
            })
        }
    })
});


// router.get('/paylink', async (req, res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//     const { invoiceId } = req.query;
//     const { email } = req.query;
//     var accessToken = '';
//     const refreshToken = '7KmieJDEXbgol7z6jpTKUFt-JoJDXvSBmK2IX5iBC6U';
//     const url = 'https://identity.xero.com/connect/token';
//     const clientId = 'D417871336714E0B87F9918848596B39';
//     const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';
//     memcached.get('token', function (err, data) {
//         console.log("Token in memcache : " + data);
//         if(data != undefined && data != null){
//             accessToken = data;
//             console.log("Invoking xero invoices :" + email);
//             axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
//                 headers: {
//                     'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Access-Control-Allow-Origin': '*',
//                 }
//             })
//             .then(function (response) {
//                 console.log(response.data);
//                 res.send(JSON.stringify(response.data));
//             })
//             .catch(function (error) {
//                  console.log("Error occur while reading contacts :" + error);
//             });
//         }else{
//             // accessToken is null
//             memcached.get('refreshToken', function (err, data) {
//                 if(data != undefined && data != null){
//                     refreshToken = data
//                 }
//                 return axios.post(url, {
//                     'grant_type': 'refresh_token',
//                     'refresh_token': refreshToken,
//                     'client_id': clientId,
//                     'client_secret': clientSecret
//                 },
//                     {
//                         headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//                     }
//                 )
//                 .then(response => {
//                     if (response.status != 200) {
//                         console.log("Error occur while generating token " + response);
//                         res.send(response);
//                     }
//                     memcached.set('token', response.data.access_token, 1680, function (err) {
//                         if (err) {
//                             console.log("cache updating failed :");
//                         };
//                     });
//                     memcached.set('refreshToken', response.data.refresh_token, 31536000, function (err) {
//                         if (err) {
//                             console.log("cache updating failed :");
//                         };
//                     });
//                     accessToken = response.data.access_token;
//                     console.log("Invoking paylink :" + email);
//                     axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
//                         headers: {
//                             'xero-tenant-id': '2eaa6688-d95e-4c8f-b76d-62fdf9fcd991',
//                             'Authorization': `Bearer ${accessToken}`,
//                             'Access-Control-Allow-Origin': '*',
//                         }
//                     })
//                     .then(function (response) {
//                         console.log(response.data);
//                         res.send(JSON.stringify(response.data));
//                     })
//                     .catch(function (error) {
//                         console.log("Error occur while reading contacts :" + error);
//                     });
//                 })
//                 .catch(function(error){
//                     console.log("Error occur while generating token :" + error);
//                 })
//             })
//         }
//     })
// });

module.exports = router;