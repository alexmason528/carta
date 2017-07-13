const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characteristicSchema = new Schema({
});

module.exports = mongoose.model('Characteristic', characteristicSchema, 'characteristic');
