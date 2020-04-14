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

// var startTime;

// ConstraintSchema.pre("find", (x) => {
//     startTime = Date.now();
// });

// ConstraintSchema.post('find', () => {
//     console.log(`${Date.now() - startTime}ms`);
// });

module.exports = mongoose.model('Constraint', ConstraintSchema);