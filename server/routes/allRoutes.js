const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Question = require('../models/Question');
const User = require('../models/User');
const Code = require('../models/Codes');
const admin = require('../middlewares/admin');

const MAXIMUM_CODE_FILE_ACCESSIBLE = 3;

router.get('/question/:name/:inputFile/:output', auth, (req, res) => {
    const { name, inputFile, output } = req.params;
    const questionPromise = Question.findOne({
        name,
        inputFiles: { $elemMatch: { name: inputFile, output } }
    });
    const userPromise = User.findOne({ email: req.user.email });

    Promise.all([questionPromise, userPromise])
        .then(([question, user]) => {
            // attempt to solve the next question before the current one!
            if (question && user.score !== question.serialNumber - 1) question = null;
            const penalty = (user.countLastAttempt === 2 && !question) ? user.penalty + 1 : user.penalty;
            let countLastAttempt = (!question) ? user.countLastAttempt + 1 : 0;
            if (countLastAttempt === 3) countLastAttempt = 0;
            const score = (!question) ? user.score : user.score + 1;

            let totalTimeTaken = user.totalTimeTaken;
            if(score !== user.score) totalTimeTaken = (Date.now() - user.started)/1000;

            //console.log(totalTimeTaken);
            User.findOneAndUpdate({ email: req.user.email }, {
                $set: {
                    penalty,
                    countLastAttempt,
                    score,
                    totalTimeTaken
                }
            })
                .then(result => {
                    if (!question)
                        return res.status(400)
                            .json({ "question": "Invalid input File name or output OR invalid question attempted" });

                    return res.json({
                        score,
                        nextFilePassword: question.nextFilePassword
                    });
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/codes/:name', auth, (req, res) => {
    const userPromise = User.findOne({ email: req.user.email });
    const codesPromise = Code.findOne({ name: req.params.name });

    Promise.all([userPromise, codesPromise])
        .then(([user, code]) => {
            if (!code)
                return res.status(400).json({ "codeFile": "No such file found!" });

            if (user.codeFilesAccessed === MAXIMUM_CODE_FILE_ACCESSIBLE)
                return res.status(400).json({ "error": "You have already reached the limit!" });

            User.findOneAndUpdate({ email: req.user.email }, {
                $inc: { codeFilesAccessed: 1 }
            }, { new: true })
                .then(result => {
                    return res.json({
                        remainingAccess: MAXIMUM_CODE_FILE_ACCESSIBLE - result.codeFilesAccessed,
                        password: code.password
                    });
                })
                .catch(err => {
                    return res.status(500).send(err);
                });
        })
        .catch(err => {
            return res.status(400).send(err);
        });
});

router.post('/question/add', admin, (req, res) => {
    const { name, inputFiles, serialNumber, nextFilePassword } = req.body;
    if (!name || !inputFiles || !serialNumber || !nextFilePassword || !inputFiles.length)
        return res.status(400).json({ "error": "Not all the neccessary details" });

    Question.findOne({ name })
        .then(result => {
            if (result) {
                res.status(400).json({ "name": "question with same name already exists!" });
                return null;
            }

            const question = new Question({
                name,
                inputFiles,
                serialNumber,
                nextFilePassword
            });

            return question.save();
        })
        .then(result => {
            if (!result) return;
            res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post('/codes/add', admin, (req, res) => {
    const { name, password } = req.body;
    if (!name || !password)
        return res.status(400).json({ "error": "Not all the neccessary details are provided!" });

    Code.findOne({ name })
        .then(result => {
            if (result) {
                res.status(400).json({ "name": "code with same name already exists!" });
                return null;
            }
            const code = new Code({
                name, password
            });
            return code.save();
        })
        .then(result => {
            if (!result) return;
            res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/codes', auth, (req, res) => {
    Code.find({}, { _id: 0, name: 1 })
        .then(codes => {
            const result = [];
            for (let code of codes) result.push(code.name);
            return res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/question', auth, (req, res) => {
    Question.find({}, { name: 1, _id: 0 })
        .then(questions => {
            const result = [];
            for (let question of questions) result.push(question.name);
            return res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/info', auth, (req, res) => {
    User.findOne({email: req.user.email})
        .then(user => {
            if(!user) 
                return res.status(400).json({"user": "User not found!"});
            return res.json({
                score: user.score,
                attemptsLeft: MAXIMUM_CODE_FILE_ACCESSIBLE - user.codeFilesAccessed
            });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;