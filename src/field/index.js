var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FieldSchema = new Schema(
    {
        institutionId: { type: String, required: true },
        name: { type: String, required: true },
        fieldKey: { type: String, required: true },
        faculty: { type: String },
        requirements: {
            constraints: [{
                constraintId: { type: String, required: true },
                value: { type: String, required: true }
            }]
        }
    },
    { collection: "Fields" }
);


module.exports = mongoose.model('Field', FieldSchema);