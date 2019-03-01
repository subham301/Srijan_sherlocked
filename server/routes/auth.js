const express = require('express');
const router = express.Router();
const User = require('../models/User');
const admin = require('../middlewares/admin');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ "login": "provide the login-id and password" });

    User.findOne({ email, password })
        .then(user => {
            if (!user){
                res.status(400).json({ "login": "Invalide login or password" });
                return null;
            }
            
            return User.findOneAndUpdate({email}, {
                $set: {started: Date.now()}
            }, {new: true})
        })
        .then(result => {
            if(!result) return;
            res.setHeader('x-auth', result.getToken());
            return res.send("OK");
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

router.post('/register', admin, (req, res) => {
    const { email, password, teamLeader } = req.body;
    if (!email || !password || !teamLeader)
        return res.status(400)
            .json({ "register": "login, password and team-Leader fields are required!" });

    User.findOne({ email })
        .then(result => {
            if (result)
                return res.status(400).json({ "register": "user already exists!" });

            const user = new User({
                email,
                password,
                score: 0,
                penalty: 0,
                countLastAttempt: 0,
                lastAttemptTime: Date.now()
            });
            user.save()
                .then(result => {
                    res.setHeader('x-auth', user.getToken()),
                        res.send("Registered");
                })
                .catch(err => {
                    res.status(500).send("save: " + err);
                });
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

module.exports = router;