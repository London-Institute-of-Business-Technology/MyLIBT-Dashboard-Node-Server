const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    client_id:
    {
        required: true,
        type: String
    },
    refresh_token: 
    {
        required: true,
        type: String
    }
    
})
tokenSchema.set("timestamps", true);
module.exports = mongoose.model('token', tokenSchema)