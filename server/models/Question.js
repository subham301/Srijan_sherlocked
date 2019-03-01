const mongoose = require('mongoose');

const inputFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
});

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    inputFiles: {
        type: [inputFileSchema],
        required: true
    },
    serialNumber: {
        type: Number,
        required: true
    },
    nextFilePassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('questions' ,questionSchema);