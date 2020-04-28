const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fields = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const FieldId = require('./fieldId');

const TAG = "Fields";

fields.use(bodyParser.json());

function createFields(req, res) {
    var body = req.body;
    Logger.debug(TAG, "createFields", body);

    if (!body['fieldKey']) {
        var name = body.name
        var institutions = body.institutions
        var fieldKey = uuidv4();

        const newFieldId = new FieldId();
        newFieldId.name = name;
        newFieldId.fieldKey = fieldKey;

        db.createFieldKey(newFieldId)
            .then(() => {
                var fieldsList = [];
                institutions.forEach((item) => {
                    const newField = new Field();
                    newField.name = name;
                    newField.institutionId = item.institutionId;
                    newField.fieldKey = fieldKey;
                    newField.requirements = item.requirements;
                    newField.faculty = item.faculty;

                    fieldsList.push(newField);
                });

                db.createFields(arr).then(() => {
                    res.send({
                        "fieldKey": fieldKey
                    });
                }).catch((err) => { res.send(err) });
            }).catch((err) => {
                res.send(err);
            })
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
    var faculty = body.faculty;
    var updateInstitutions = body.updateInstitutions;

    if (!fieldKey) {
        res.code = Network.ERROR_NO_FIELD_KEY;
        res.send("ERROR - Field already created");
        return;
    }

    if (updateInstitutions) {
        var institutionsNotToRemoveList = [];

        institutions.forEach((item) => {
            var updateField = {};
            var query = {};
            query['institutionId'] = item.institutionId;
            query['fieldKey'] = fieldKey;

            updateField.requirements = item.requirements;
            updateField.faculty = faculty;

            db.updateField(query, updateField)
                .then((doc) => {
                    Logger.debug(TAG, "updateFields", doc._id);
                })
                .catch((err) => {
                    Logger.error(TAG, "updateFields", err);
                });

            institutionsNotToRemoveList.push(item.institutionId);
        });

        db.removeFieldInstitutions(fieldKey, institutionsNotToRemoveList);
    } else {
        var query = {};
        query['fieldKey'] = fieldKey;

        var updateField = {};
        updateField.faculty = faculty;

        db.updateField(query, updateField)
            .then((doc) => {
                Logger.debug(TAG, "updateFields");
            })
            .catch((err) => {
                Logger.error(TAG, "updateFields", err);
            });
    }

    var response = {
        "fieldKey": fieldKey
    }
    res.send(response);
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
