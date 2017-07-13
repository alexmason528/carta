const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const elementSchema = new Schema({
});

const Element = mongoose.model('Element', elementSchema, 'element');
module.exports = Element;
