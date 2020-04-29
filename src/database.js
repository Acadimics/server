const mongodb = require('mongodb');
const mongoose = require('mongoose');

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
const createInstitution = async (newInstitution) =>
	await Institution.create(newInstitution);

const updateInstitutions = async (query, institution) =>
	await Institution.updateOne(query, institution);

const deleteInstitutions = async (id) => {
	Logger.debug(TAG, "deleteInstitutions", `id: ${id}`);
	var query = { _id: id };

	return await Institution.deleteOne(query);
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
const createFieldKey = async (newFieldId) =>
	await FieldId.create(newFieldId);

const removeFieldKey = async (query) =>
	await FieldId.deleteMany(query);

const createField = async (newField) =>
	await Field.create(newField);

const createFields = async (fieldsList) =>
	await Field.insertMany(fieldsList);

const updateFields = async (query, fieldsList) => {
	var fieldsSchema = [];
	fieldsList.forEach(element => {
		var updateField = { "$set": { "requirements": element.requirements } };
		fieldsSchema.push(updateField);
	});

	return await Field.updateMany(query, fieldsSchema);
};

const updateField = async (query, field) => {
	var updateField = {};
	if (field.requirements) {
		updateField = {
			"$set": { requirements: field.requirements }
			// "$set": { faculty: field.faculty }
		};
	}
	else {
		updateField = {
			"$set": { faculty: field.faculty }
		};
	}
	return await Field.updateMany(query, updateField)
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
const createConstraint = async (newConstraint) =>
	await Constraint.create(newConstraint);

const updateConstraint = async (query, constraint) =>
	await Constraint.updateOne(query, constraint);

const removeConstraint = async (query) =>
	await Constraint.deleteMany(query);

const getConstraintsList = async () =>
	await Constraint.find({}).sort({ description: 'asc' });


// Bagruts
const setBagruts = async (bagruts) =>
	await Bagruts.insertMany(bagruts)

const getBagruts = () =>
	Bagruts.find({});

const search = async (institution, field) => {
	return await Field.aggregate([
		// { $match: { name: { $in: arr } } },
		// { $match: { name: { $regex: query, $options: "i" } } },
		{ $match: { name: field } },
		{
			$lookup: {
				from: "Institutions",
				let: { institutionName: "$name" },
				pipeline: [
					{ $match: { name: field } }
					// { $project: { institutionName: "$institutionName" } }
				],
				// localField: "institutionId",
				// foreignField: "_id",
				as: "myJoin"
			}
		}
	]);
};

function getAllSubstrings(str) {
	var i, j, result = [];
	var newSubstring = "";

	for (i = 0; i < str.length; i++) {
		for (j = i + 1; j < str.length + 1; j++) {
			newSubstring = str.slice(i, j);
			if (newSubstring.length >= 3) {
				result.push(newSubstring);
			}
		}
	}
	return result;
}

// var theString = 'somerandomword';
// console.log(getAllSubstrings(theString));

// search("הנדס");

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

module.exports.createConstraint = createConstraint;
module.exports.updateConstraint = updateConstraint;
module.exports.removeConstraint = removeConstraint;
module.exports.getConstraintsList = getConstraintsList;

module.exports.setBagruts = setBagruts;
module.exports.getBagruts = getBagruts;

module.exports.search = search;