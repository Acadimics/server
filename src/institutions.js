const express = require('express');
const institutions = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const TAG = "Institutions";
institutions.use(bodyParser.json());

function createInstitution(req, res) {
    var body = req.body;
    Logger.debug(TAG, "createInstitution", body);

    var query = {};
    query['name'] = body.name;

    db.createInstitution(query, body,
        (code, id) => {
            res.status(code);
            res.send({
                "id": id
            });
        },
        (err) => {
            res.status(Network.CODE_ERROR);
            res.send(err);
        });
};

function updateInstitutions(req, res) {
    var body = req.body;
    Logger.debug(TAG, "updateInstitutions", body);

    var newData = {};
    newData['name'] = body.name;
    newData['locations'] = body.locations;
    newData['logo'] = body.logo;

    db.updateInstitutions(body.id, newData,
        () => {
            res.status(Network.CODE_OK);
            res.send({});
        },
        (err) => {
            res.status(Network.CODE_ERROR);
            res.send(err);
        });
};

function deleteInstitutions(req, res) {
    var body = req.body;
    Logger.debug(TAG, "deleteInstitutions", body);

    db.deleteInstitutions(body.id,
        () => {
            res.status(Network.CODE_OK);
            res.send({});
        },
        (err) => {
            res.status(Network.CODE_ERROR);
            res.send(err);
        });
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
