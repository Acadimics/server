var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConstraintSchema = new Schema(
    {
        description: { type: String, required: true },
        scoop: { type: String, required: true },
        name: { type: String }
    },
    { collection: "Constraints" }
);

module.exports = mongoose.model('Constraint', ConstraintSchema);