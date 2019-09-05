const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const SessionSchema = new Schema({
    code: {
        type: String,
        required: true,
        default: () => Math.random().toString().slice(5,11) 
    },
});


const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;

