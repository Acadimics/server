const express = require('express');
const bagruts = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const TAG = "Bagruts";
bagruts.use(bodyParser.json());

function setBagruts(req, res) {
    const body = req.body;

    // db.setBagruts(body).then(() => {
    //     res.send("Success");
    // }).catch((err) => {
    //     console.log("Error");
    //     res.send(err);
    // });

    res.send("Don't use it just in critical time!\n Please enable it in server side.");
};

function getBagruts(req, res) {
    db.getBagruts()
        .then((docs) => {
            res.send({
                count: docs.length,
                items: docs
            });
        })
        .catch((err) => {
            res.send(err);
        });
}

bagruts.post('/setBagruts', setBagruts);
bagruts.post('/getBagruts', getBagruts);

module.exports = bagruts;