const mongodb = require('mongodb');
const mongoose = require('mongoose');

ObjectID = require('mongodb').ObjectID
const Logger = require('./logger');
const Network = require('./Network.js');
const Constraint = require('./constraint');
const Institution = require('./institution');
const Field = require('./field');
const FieldId = require('./fieldId');

const user = encodeURIComponent('admin');
const password = encodeURIComponent('a102030kh__');
const databaseURL = `mongodb://${user}:${password}@cluster0-shard-00-00-rhcp3.gcp.mongodb.net:27017,cluster0-shard-00-01-rhcp3.gcp.mongodb.net:27017,cluster0-shard-00-02-rhcp3.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
const dbName = 'AcadimicDB';
const TAG = "Database";

console.log("Connecting to Database...");
mongoose.connect(databaseURL, { useUnifiedTopology: true, useNewUrlParser: true, dbName: dbName });
// mongoose.set('debug', { color: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Database is connected!");
});

// Utils functions
function connectToCollection(collectionName, successFunc, failureFunc) {
	var client = mongodb.MongoClient;

	client.connect(databaseURL, { useUnifiedTopology: true, useNewUrlParser: true }, (err, db) => {
		if (err) {
			failureFunc(err);
			return;
		}

		var dbo = db.db(dbName);
		var collection = dbo.collection(collectionName);

		successFunc(collection);
		db.close();
	});
};

function connectToInstitutionsCollection(successFunc, failureFunc) {
	connectToCollection('Institutions', successFunc, failureFunc);
};

function connectToFieldsIdCollection(successFunc, failureFunc) {
	connectToCollection('FieldsId', successFunc, failureFunc);
};


// Institutions
function createInstitution(query, newDocument, successFunc, failureFunc) {
	var options = {
		"upsert": true
	};
	connectToInstitutionsCollection(
		(collection) => {
			collection.updateOne(query, { $set: newDocument }, options).then(
				(result) => {
					const { matchedCount, modifiedCount, upsertedId } = result;
					Logger.debug(TAG, "createInstitution", "matched", matchedCount, "modifiedCount", modifiedCount, "upsertedId", upsertedId);

					if (matchedCount) {
						Logger.info(TAG, "createInstitution", "Institution already found.");
						successFunc(Network.CODE_OK, null);
					} else {
						Logger.info(TAG, "createInstitution", "Successfully added a new institution.");
						successFunc(Network.CODE_CREATED, upsertedId._id);
					}
				},
				(err) => {
					Logger.error(TAG, "createInstitution", err);
					failureFunc(err);
				});
		},
		(err) => {
			Logger.error(TAG, "createInstitution", err);
			failureFunc(err);
		}
	);
};

function updateInstitutions(id, newData, successFunc, failureFunc) {
	Logger.debug(TAG, "updateInstitutions", `id: ${id}`, newData);
	var query = { "_id": new ObjectID(id) };
	connectToInstitutionsCollection(
		(collection) => {
			collection.updateOne(query, { $set: newData }).then(
				(result) => {
					successFunc();
				},
				(err) => {
					Logger.error(TAG, "updateInstitutions", err);
					failureFunc(err);
				});
		},
		(err) => {
			Logger.error(TAG, "updateInstitutions", err);
			failureFunc(err);
		}
	)
};

function deleteInstitutions(id, successFunc, failureFunc) {
	Logger.debug(TAG, "deleteInstitutions", `id: ${id}`);
	var query = { "_id": new ObjectID(id) };

	connectToInstitutionsCollection(
		(collection) => {
			collection.deleteOne(query).then(
				(result) => {
					successFunc();
				},
				(err) => {
					Logger.error(TAG, "deleteInstitutions", err);
					failureFunc(err);
				}
			);
		},
		(err) => {
			rror(TAG, "deleteInstitutions", err);
		}
	);
};

function getInstitutionsList(query, successFunc, failureFunc) {

	Institution.find({},
		(err, docs) => {
			if (err) {
				failureFunc(err);
			}
			else {
				successFunc(docs);
			}
		}).sort({ name: 'asc' });
};


// Fields
function createFieldKey(newDocument, successFunc, failureFunc) {
	var options = {
		"upsert": false
	};

	connectToFieldsIdCollection(
		(collection) => {
			try {
				collection.insertOne(newDocument).then(
					(result) => {
						successFunc();
					},
					(err) => {
						failureFunc(err);
					}
				);
			} catch (err) {
				failureFunc(err);
			}
		},
		(err) => {
			failureFunc(err);
		}
	);
}

const removeFieldKey = async (query) => {
	await FieldId.deleteMany(query)
};

const createField = async (newField) => {
	const field = new Field();
	field.name = newField.name;
	field.institutionId = newField.institutionId;
	field.fieldKey = newField.fieldKey;
	field.requirements = newField.requirements;

	await field.save();
};

const createFields = async (fieldsList) => {
	var fieldsSchema = [];
	fieldsList.forEach(element => {
		const newField = new Field();
		newField.name = element.name;
		newField.institutionId = element.institutionId;
		newField.fieldKey = element.fieldKey;
		newField.requirements = element.requirements;

		fieldsSchema.push(newField);
	});

	await Field.insertMany(fieldsSchema)
};

const updateFields = async (query, fieldsList) => {
	console.log("Query", query);

	var fieldsSchema = [];
	fieldsList.forEach(element => {
		// const updateField = new Field();
		// updateField.requirements = element.requirements;
		var updateField = { "$set": { "requirements": element.requirements } };
		fieldsSchema.push(updateField);
	});

	await Field.updateMany(query, fieldsSchema);
}

function updateField(query, field) {
	console.log("updateField");
	console.log(field.requirements);
	console.log("query", query);

	var updateField = { "$set": { "requirements": field.requirements } };

	Field.updateOne(query, updateField).then((docs) => {

	}).catch((err) => { console.log(err) });
};

function removeFieldInstitutions(fieldKey, institutionsNotToRemoveList) {
	var query = { institutionId: { $nin: institutionsNotToRemoveList }, fieldKey: { $eq: fieldKey } }
	console.log("Query", query);

	Field.deleteMany(query).then((result) => {

	}).catch((err) => {
		console.log(err);
	})
}

const removeField = async (query) => {
	await Field.deleteMany(query)
};

const getFieldsList = async (query) =>
	await Field.aggregate([
		{ $match: query },
		{
			$group: {
				_id: "$fieldKey",
				name: { "$first": "$name" },
				institutions: {
					$push: {
						institutionId: "$institutionId",
						requirements: "$requirements"
					}
				}
			}
		}]).sort({ name: 'asc' });

function getFieldsListByKey(query, successFunc, failureFunc) {

	FieldId.find(query, (err, docs) => {
		if (err) {
			failureFunc(err);
		}
		else {
			var items = docs.map(o => o.fieldKey);
			var query = {
				fieldKey: { $in: items }
			};

			getFieldsList(query).then(successFunc).catch(failureFunc);
		}
	});
};


// Constraints

const addConstraint = async (newConstraint) =>
	await Constraint.create(newConstraint);

const updateConstraint = async (query, constraint) =>
	await Constraint.updateOne(query, constraint);

const removeConstraint = async (query) =>
	await Constraint.deleteMany(query);

const getConstraintsList = async () => await Constraint.find({}).sort({ description: 'asc' });


// Exports
module.exports.createInstitution = createInstitution;
module.exports.getInstitutionsList = getInstitutionsList;
module.exports.updateInstitutions = updateInstitutions;
module.exports.deleteInstitutions = deleteInstitutions;

module.exports.createFieldKey = createFieldKey;
module.exports.removeFieldKey = removeFieldKey;

module.exports.createFields = createFields;
module.exports.createField = createField;
module.exports.getFieldsList = getFieldsList;
module.exports.getFieldsListByKey = getFieldsListByKey;
module.exports.updateField = updateField;
module.exports.updateFields = updateFields;
module.exports.removeField = removeField;
module.exports.removeFieldInstitutions = removeFieldInstitutions;

module.exports.addConstraint = addConstraint;
module.exports.updateConstraint = updateConstraint;
module.exports.removeConstraint = removeConstraint;
module.exports.getConstraintsList = getConstraintsList;
