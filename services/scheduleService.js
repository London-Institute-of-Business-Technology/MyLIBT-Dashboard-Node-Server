const Token = require('../model/token');
const axios = require('axios');

     exports.updateRefeshToken = async function() {
        const url = 'https://identity.xero.com/connect/token';
        const clientId = 'D417871336714E0B87F9918848596B39';
        const clientSecret = 'x5pn2znr_vdng_Bir17asHzPxnbume-LGPDwbRm6_P5T7E39';

        Token.find({client_id :clientId},function(error,result){
            if(result){
                console.log(JSON.stringify(result));
                return axios.post(url, {
                    'grant_type': 'refresh_token',
                    'refresh_token': result[0].refresh_token,
                    'client_id': clientId,
                    'client_secret': clientSecret
                },
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                ).then(function (response) {
                    console.log(JSON.stringify(response.data));
                    if (response.status == 200) {
                        var refreshToken = response.data.refresh_token;
                        const filter = { client_id: clientId }
                        const update = { refresh_token: refreshToken }
                        Token.findOneAndUpdate(filter, update, { new: true }, function (err) {
                            if (err) {
                                 console.log("Token write to db failed due to :" + err);
                            } else {
                                console.log("Token was successfully updated");
                            }
                        });
                    }
                });
            }else{
                console.log("Error occur while fetching token form db")
            }
        })
        
       }
