const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    api:
    {
        required: true,
        type: String
    },
    key:
    {
        required: true,
        type: String
    }

})
apiSchema.set("timestamps", true);
module.exports = mongoose.model('apiKeys', apiSchema)