const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const CONTEST_TIME_IN_MINUTES = 75;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 50
    },
    score: {
        type: Number,
        get: (x) => Math.round(x),
        set: x => Math.round(x)
    },
    penalty: {
        type: Number,
        get: x => Math.round(x),
        set: x => Math.round(x),
        required: true
    },
    countLastAttempt: {
        type: Number,
        required: true,
        get: x => Math.round(x),
        set: x => Math.round(x)
    },
    started: {
        type: Number,   // for the timestamp
        required: true,
        default: Date.now()
    },
    lastAttemptTime: {
        type: Number,
        required: true
    },
    codeFilesAccessed: {
        type: Number,
        get: x => Math.round(x),
        set: x => Math.round(x),
        required: true,
        default: 0
    },
    totalTimeTaken: {
        type: Number,
        default: 0     // Event_time_duration
    }
});

userSchema.methods.getToken = function () {
    const payload = {
        email: this.email,
        lastAttemptTime: this.lastAttemptTime
    };
    const token = jwt.sign({
        data: payload,
        exp: Math.floor(Date.now() / 1000) + CONTEST_TIME_IN_MINUTES * 60
    }, "jwtPrivateKey");
    return token;
}

const User = mongoose.model('user', userSchema);

module.exports = User;