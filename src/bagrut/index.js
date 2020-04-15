var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BagrutSchema = new Schema(
    {
        SubjectID: { type: Number, required: true },
        SubjectName: { type: String, required: true },
        Year: { type: Number }
    },
    { collection: "Bagruts" }
);

module.exports = mongoose.model('Bagrut', BagrutSchema);