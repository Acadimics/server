var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const scoopsValidator = (v) => ["Bagrout", "Psychometry"].indexOf(v) !== -1

var ConstraintSchema = new Schema(
    {
        subjectId: { type: Number, required: true },
        description: { type: String, required: true },
        scoop: {
            type: String, required: true,
            validate: { validator: scoopsValidator }
        }
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