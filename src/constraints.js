const express = require('express');
const constraints = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const TAG = "Constraints";
constraints.use(bodyParser.json());

function getConstraintsList(req, res) {
    var body = req.body;
    Logger.debug(TAG, "getInstitutionsList", body);
    db.getConstraintsList(
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

constraints.post('/getConstraints', getConstraintsList);

module.exports = constraints;
