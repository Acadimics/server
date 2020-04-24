const express = require('express');
const constraints = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const TAG = "Constraints";
constraints.use(bodyParser.json());

function addConstraint(req, res) {
    var body = req.body;
    Logger.debug(TAG, "addConstraint", body);

    var newConstraint = {};
    newConstraint.description = body.description;
    newConstraint.scoop = body.scoop;
    newConstraint.subjectId = body.subjectId;

    db.addConstraint(newConstraint).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.send(err);
    });
};

function updateConstraint(req, res) {
    var body = req.body;
    Logger.debug(TAG, "updateConstraint", body);

    var query = { "_id": body._id };

    var newConstraint = {};
    newConstraint.description = body.description;
    newConstraint.scoop = body.scoop;
    newConstraint.subjectId = body.subjectId;
    newConstraint.name = body.name;

    db.updateConstraint(query, newConstraint).then(() => {
        res.send(body);
    }).catch((err) => {
        res.send(err);
    });
};

function removeConstraint(req, res) {
    var body = req.body;
    Logger.debug(TAG, "removeConstraint", body);

    var query = { "_id": body._id };

    db.removeConstraint(query).then(() => {
        res.send(body);
    }).catch((err) => {
        res.send(err);
    });
};

function getConstraintsList(req, res) {
    var body = req.body;
    Logger.debug(TAG, "getInstitutionsList", body);

    db.getConstraintsList().then((docs) => {
        var response = {
            "count": docs.length,
            "items": docs
        };

        res.status(Network.CODE_OK);
        res.send(response);
    }).catch((err) => {
        res.status(Network.CODE_ERROR);
        res.send(err);
    });
};

constraints.post('/addConstraint', addConstraint);
constraints.post('/removeConstraint', removeConstraint);
constraints.post('/updateConstraint', updateConstraint);
constraints.post('/getConstraints', getConstraintsList);

module.exports = constraints;
