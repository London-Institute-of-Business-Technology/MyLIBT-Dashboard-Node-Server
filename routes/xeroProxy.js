const express = require('express');
const router = express.Router();
const axios = require('axios');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
const TokenModel = require('../model/token');

router.get('/invoice', async (req, res) => {
    let refreshToken = '';
    var accessToken = '';
    var contactId = '';
    const { email } = req.query;

    const url = 'https://identity.xero.com/connect/token';
    const clientId = 'D417871336714E0B87F9918848596B39';
    const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';

    memcached.get('token', function (err, data) {
        console.log("Token in memcached : " + data);
        if (data != undefined && data != null) {
            accessToken = data;
            console.log("Invoking CONTACTS api in XERO. user :" + email);
            axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${email}"`, {
                headers: {
                    'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
                    'Authorization': `Bearer ${accessToken}`,
                    'Access-Control-Allow-Origin': '*',
                }
            })
                .then(function (response) {
                    if (response == undefined && response == null && response.data == undefined && response.data.Contacts[0] == undefined) {
                        res.status = 404;
                        res.send(JSON.stringify({ "message": "CONTACT" }));
                    } else {
                        contactId = response.data.Contacts[0].ContactID;
                        console.log("Invoking INVOICE  api in XERO. user :" + email + " contactId :" + contactId);
                        axios.get(`https://api.xero.com/api.xro/2.0/Invoices?where=Type=="ACCREC"&ContactIDs=${contactId}`, {
                            headers: {
                                'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
                                'Authorization': `Bearer ${accessToken}`,
                                'Access-Control-Allow-Origin': '*',
                            }
                        })
                            .then(function (result) {
                                if (result == undefined && result == null) {
                                    res.status = 404
                                    res.send(JSON.stringify({ "message": "INVOICE" }));
                                } else {
                                    res.status = 200;
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
        } else {
            memcached.get('refreshToken', async function (err, data) {
                console.log("Extracting refresh_token from memcached :" + JSON.stringify(data));
                if (data != undefined && data != null) {
                    console.log("refreshToken from memcached :" + data);
                    refreshToken = data
                }
                else {
                    console.log("refresh_token is null and trying to get from database :" + clientId);
                    const tokenObj = await TokenModel.findOne({ "client_id": "D417871336714E0B87F9918848596B39" });
                    if (tokenObj != null) {
                        refreshToken = tokenObj.refresh_token;
                    } else {
                        res.status = 500
                        res.send(JSON.stringify({ "message": "Error occur while creating token" }));
                    }
                }
                console.log("Invoking token generation since token is expired. refresh_token :" + refreshToken);
                return axios.post(url, {
                    'grant_type': 'refresh_token',
                    'refresh_token': refreshToken,
                    'client_id': clientId,
                    'client_secret': clientSecret
                },
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                )
                    .then(response => {
                        console.log("Token generated :" + JSON.stringify(response.data));
                        if (response.status != 200) {
                            console.log("Error occur while generating token " + response);
                            res.send(response);
                        }
                        memcached.set('token', response.data.access_token, 400, function (err) {
                            console.log("Writing accessToken to memcached :" + response.data.access_token);
                            if (err) {
                                console.log("cache updating failed :");
                            };
                        });
                        memcached.set('refreshToken', response.data.refresh_token, 120, function (err) {
                            console.log("Writing refreshToken to memcached :" + response.data.refresh_token);
                            if (err) {
                                console.log("cache updating failed :");
                            };
                        });
                        const filter = { client_id: clientId }
                        const update = { refresh_token: response.data.refresh_token }
                        TokenModel.findOneAndUpdate(filter, update, { new: true }, function (err) {
                            if (err) {
                                console.log("Token write to db failed :" + err);
                            } else {
                                console.log("Token was successfully updated")
                            }

                        });
                        accessToken = response.data.access_token;
                        console.log("Invoking xero invoices :" + email);
                        axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${email}"`, {
                            headers: {
                                'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
                                'Authorization': `Bearer ${accessToken}`,
                                'Access-Control-Allow-Origin': '*',
                            }
                        })
                            .then(function (response) {
                                // console.log(response.data.Contacts[0].ContactID);
                                if (response == undefined && response == null && response.data == undefined && response.data.Contacts[0] == undefined) {
                                    res.status = 204
                                    res.send(JSON.stringify({ "message": "No Invoice/s available " }));
                                } else {
                                    contactId = response.data.Contacts[0].ContactID;
                                    axios.get(`https://api.xero.com/api.xro/2.0/Invoices?where=Type=="ACCREC"&ContactIDs=${contactId}`, {
                                        headers: {
                                            'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
                                            'Authorization': `Bearer ${accessToken}`,
                                            'Access-Control-Allow-Origin': '*',
                                        }
                                    })
                                        .then(function (result) {
                                            if (result == undefined && result == null) {
                                                res.status = 204
                                                res.send(JSON.stringify({ "message": "No Contacts for request invoice" }));
                                            } else {
                                                res.status = 200;
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
                    .catch(function (error) {
                        console.log("Error occur while generating token :" + error);
                    })
            })
        }
    })
});


router.get('/paylink', async (req, res) => {
    let refreshToken = '';
    var accessToken = '';
    var contactId = '';
    const { invoiceId } = req.query;

    const url = 'https://identity.xero.com/connect/token';
    const clientId = 'D417871336714E0B87F9918848596B39';
    const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';

    memcached.get('token', function (err, data) {
        console.log("Token in memcached : " + data);
        if (data != undefined && data != null) {
            accessToken = data;
            console.log("Invoking OnlineInvoice api in XERO. invoiceId :" + invoiceId);
            axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
                headers: {
                    'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
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
        } else {
            memcached.get('refreshToken', async function (err, data) {
                console.log("Extracting refresh_token from memcached :" + JSON.stringify(data));
                if (data != undefined && data != null) {
                    console.log("refreshToken from memcached :" + data);
                    refreshToken = data
                }
                else {
                    console.log("refresh_token is null and trying to get from database :" + clientId);
                    const tokenObj = await TokenModel.findOne({ "client_id": "D417871336714E0B87F9918848596B39" });
                    if (tokenObj != null) {
                        refreshToken = tokenObj.refresh_token;
                    } else {
                        res.status = 500
                        res.send(JSON.stringify({ "message": "Error occur while creating token" }));
                    }
                }
                console.log("Invoking token generation since token is expired. refresh_token :" + refreshToken);
                return axios.post(url, {
                    'grant_type': 'refresh_token',
                    'refresh_token': refreshToken,
                    'client_id': clientId,
                    'client_secret': clientSecret
                },
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                )
                    .then(response => {
                        console.log("Token generated :" + JSON.stringify(response.data));
                        if (response.status != 200) {
                            console.log("Error occur while generating token " + response);
                            res.send(response);
                        }
                        memcached.set('token', response.data.access_token, 400, function (err) {
                            console.log("Writing accessToken to memcached :" + response.data.access_token);
                            if (err) {
                                console.log("cache updating failed :");
                            };
                        });
                        memcached.set('refreshToken', response.data.refresh_token, 120, function (err) {
                            console.log("Writing refreshToken to memcached :" + response.data.refresh_token);
                            if (err) {
                                console.log("cache updating failed :");
                            };
                        });
                        const filter = { client_id: clientId }
                        const update = { refresh_token: response.data.refresh_token }
                        TokenModel.findOneAndUpdate(filter, update, { new: true }, function (err) {
                            if (err) {
                                console.log("Token write to db failed :" + err);
                            } else {
                                console.log("Token was successfully updated")
                            }

                        });
                        accessToken = response.data.access_token;
                        console.log("Invoking xero OnlineInvoice :" + email);
                        axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/OnlineInvoice`, {
                            headers: {
                                'xero-tenant-id': '0b0c445d-94c2-4c66-9468-caec5fdc5ce9',
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
                    .catch(function (error) {
                        console.log("Error occur while generating token :" + error);
                    })
            })
        }
    })
});


module.exports = router;