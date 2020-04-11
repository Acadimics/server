var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstitutionSchema = new Schema(
    {
        name: { type: String, required: true },
        locations: [{ type: String, required: true }],
        logo: { type: String },
    },
    { collection: "Institutions" }
);

module.exports = mongoose.model('Institution', InstitutionSchema);