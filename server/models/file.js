"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const FileSchema = new Schema({
    FileArray:{
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


const File = mongoose.model('File', FileSchema);

module.exports = File;

