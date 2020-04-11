var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FieldIdSchema = new Schema(
    {
        name: { type: String, required: true },
        fieldKey: { type: String, required: true }
    },
    { collection: "FieldsId" }
);

module.exports = mongoose.model('FieldId', FieldIdSchema);