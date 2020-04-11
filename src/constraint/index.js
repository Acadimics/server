var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConstraintSchema = new Schema(
    {
        name: { type: String, required: true },
        scoop: { type: String, required: true },
        description: String
    },
    { collection: "Constraints" }
);

module.exports = mongoose.model('Constraint', ConstraintSchema);