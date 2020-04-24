const mongodb = require('mongodb');
const mongoose = require('mongoose');

ObjectID = require('mongodb').ObjectID
const Logger = require('./logger');
const Network = require('./Network.js');
const Constraint = require('./constraint');
const Institution = require('./institution');
const Field = require('./field');
const FieldId = require('./fieldId');
const Bagruts = require('./bagrut');

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


// Institutions
const createInstitution = async (newDocument) => {
	const newInstitution = new Institution();
	newInstitution.name = newDocument.name;
	newInstitution.locations = newDocument.locations;
	newInstitution.logo = newDocument.logo;
	newInstitution.type = newDocument.type;

	return await Institution.create(newInstitution);
};

const updateInstitutions = async (id, newData) => {
	Logger.debug(TAG, "updateInstitutions", `id: ${id}`, newData);
	var query = { "_id": new ObjectID(id) };

	return await Institution.updateOne(query, { $set: newData });
};

const deleteInstitutions = async (id) => {
	Logger.debug(TAG, "deleteInstitutions", `id: ${id}`);
	var query = { "_id": new ObjectID(id) };

	return await Institution.deleteOne(query, { $set: newData });
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
const createFieldKey = async (newDocument) => {
	var newFieldId = new FieldId();
	newFieldId.name = newDocument.name;
	newFieldId.fieldKey = newDocument.fieldKey;

	return await newFieldId.save();
};

const removeFieldKey = async (query) => {
	return await FieldId.deleteMany(query);
};

const createField = async (newField) => {
	const field = new Field();
	field.name = newField.name;
	field.institutionId = newField.institutionId;
	field.fieldKey = newField.fieldKey;
	field.requirements = newField.requirements;

	return await field.save();
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

	return await Field.insertMany(fieldsSchema);
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

	return await Field.updateMany(query, fieldsSchema);
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

const removeField = async (query) =>
	await Field.deleteMany(query);

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


// Bagruts
const setBagruts = async (bagruts) =>
	await Bagruts.insertMany(bagruts)

const getBagruts = () =>
	Bagruts.find({});

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

module.exports.setBagruts = setBagruts;
module.exports.getBagruts = getBagruts;