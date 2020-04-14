const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fields = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');

const TAG = "Fields";

fields.use(bodyParser.json());

function createFields(req, res) {
    var body = req.body;
    Logger.debug(TAG, "createFields", body);

    if (!body['fieldKey']) {
        var name = body.name
        var institutions = body.institutions
        var fieldKey = uuidv4();

        var newDocument = {
            'name': name,
            'fieldKey': fieldKey
        };

        db.createFieldKey(newDocument,
            () => {
                var arr = [];
                institutions.forEach((item) => {
                    var newField = {};
                    newField.name = name;
                    newField.institutionId = item.institutionId;
                    newField.fieldKey = fieldKey;
                    newField.requirements = item.requirements;

                    arr.push(newField);
                });

                db.createFields(arr).then(() => {
                    var response = {
                        "fieldKey": fieldKey
                    }
                    res.send(response);
                }).catch((err) => { res.send(err) });
            },
            (err) => {
                res.send(err);
            }
        );
    } else {
        res.code = Network.ERROR_FIELD_ALREAD_CREATED;
        res.send("ERROR - Field already created");
    }
};

function updateFields(req, res) {
    var body = req.body;
    Logger.debug(TAG, "updateFields", body);
    var fieldKey = body.fieldKey;
    var institutions = body.institutions;

    if (fieldKey) {
        var institutionsNotToRemoveList = [];

        institutions.forEach((item) => {
            var updateField = {};
            var query = {};
            query['institutionId'] = item.institutionId;
            query['fieldKey'] = fieldKey;

            updateField.requirements = item.requirements;
            db.updateField(query, updateField);

            institutionsNotToRemoveList.push(item.institutionId);
        });
        db.removeFieldInstitutions(fieldKey, institutionsNotToRemoveList);

        var response = {
            "fieldKey": fieldKey
        }
        res.send(response);
    }
    else {
        res.code = Network.ERROR_NO_FIELD_KEY;
        res.send("ERROR - Field already created");
    }

};

function removeField(req, res) {
    var body = req.body;
    var fieldKey = body.fieldKey;

    Logger.debug(TAG, "removeField", body);

    var query = { "fieldKey": fieldKey };

    db.removeField(query);
    db.removeFieldKey(query);

    res.send(query);
};

function getFields(req, res) {
    var body = req.body;
    var query = {};

    if (body.hasOwnProperty('name')) {
        query['name'] = body['name'];
    }

    if (body.hasOwnProperty('institutionId')) {
        query['institutionId'] = body['institutionId'];
    }

    if (body.hasOwnProperty('fieldKey')) {
        query['fieldKey'] = body['fieldKey'];
    }

    Logger.debug(TAG, "getFields", query);
    db.getFieldsListByKey(query,
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
            res.send(err);
        }
    );
};

function test(req, res) {
    console.log("Testing Module");
    res.send(req.body);
};

fields.post('/getFields', getFields);
fields.post('/createFields', createFields);
fields.post('/updateFields', updateFields);
fields.post('/removeField', removeField);
fields.post('/test', test);
fields.post('/', test);

module.exports = fields;
