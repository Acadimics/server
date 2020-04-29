const express = require('express');
const Search = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const db = require('./database.js');
const Network = require('./Network.js');
const TAG = "Search";
Search.use(bodyParser.json());


const search = (req, res) => {
    const body = req.body;
    const institution = body.institution;
    const field = body.field;

    db.search(institution, field)
        .then((docs) => {
            // Logger.debug(TAG, "search", docs);
            res.send({
                count: docs.length,
                items: docs
            });
        })
        .catch((err) => {
            Logger.error(TAG, "search", err);
            res.send(err);
        });
};


Search.post('/search', search);

module.exports = Search;