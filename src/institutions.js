const express = require('express');
const institutions = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const Institution = require('./institution');
const TAG = "Institutions";
institutions.use(bodyParser.json());

const createInstitution = (req, res) => {
    var body = req.body;

    const newInstitution = new Institution();
    newInstitution.name = body.name;
    newInstitution.locations = body.locations;
    newInstitution.logo = body.logo;
    newInstitution.type = body.type;

    Logger.debug(TAG, "createInstitution", newInstitution);
    db.createInstitution(newInstitution)
        .then((doc) => {
            res.send({
                _id: doc._id
            });
        }).catch((err) => {
            res.status(Network.CODE_ERROR);
            res.send(err);
        });
};

function updateInstitutions(req, res) {
    var body = req.body;
    Logger.debug(TAG, "updateInstitutions", body);

    var query = { _id: body.id };

    var newData = {};
    newData['name'] = body.name;
    newData['locations'] = body.locations;
    newData['logo'] = body.logo;
    newData['type'] = body.type;

    db.updateInstitutions(query, newData)
        .then(() => {
            res.status(Network.CODE_OK);
            res.send({ _id: body.id });
        }).catch((err) => {
            res.status(Network.CODE_ERROR);
            res.send(err);
        });
};

function deleteInstitutions(req, res) {
    var body = req.body;
    Logger.debug(TAG, "deleteInstitutions", body);

    db.deleteInstitutions(body.id)
        .then(() => {
            Logger.debug(TAG, "deleteInstitutions:then");
            res.status(Network.CODE_OK);
            res.send({
                id: body.id
            });
        }).catch((err) => {
            Logger.debug(TAG, "deleteInstitutions:err", err);
            res.status(Network.CODE_ERROR);
            res.send(err);
        })
};

function getInstitutions(req, res) {
    var body = req.body;
    Logger.debug(TAG, "getInstitutions", body);
    db.getInstitutionsList(body,
        (list) => {
            var response = {
                "count": list.length,
                "items": list
            };

            res.status(Network.CODE_OK);
            res.send(response);
        },
        (err) => {
            res.status(Network.CODE_ERROR);
            res.send("ERROR");
        }
    );
};

function test(req, res) {
    console.log("Testing Module");
    res.send(req.body);
};

institutions.post('/createInstitution', createInstitution);
institutions.post('/getInstitutions', getInstitutions);
institutions.post('/updateInstitutions', updateInstitutions);
institutions.post('/deleteInstitutions', deleteInstitutions);

institutions.post('/test', test);
institutions.post('/', test);

module.exports = institutions;
