"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TextSchema = new Schema({
    TextArray:{
        type: Array,
        uploadDate: {
            type: Date,
            default: Date.now
        },
    },

    SessionId: {
        type: Schema.Types.ObjectId, ref: 'Session',
        required: true
    }
});


const Text = mongoose.model('Text', TextSchema);

module.exports = Text;

