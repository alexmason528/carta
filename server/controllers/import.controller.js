const fs = require('fs')
const csv = require('fast-csv')
const path = require('path')

const Element = require('../models/element')
const TypeCategory = require('../models/typeCategory')
const DescriptiveCategory = require('../models/descriptiveCategory')
const TypeDescriptiveRelation = require('../models/typeDescriptiveRelation')
const ElementTypeRelation = require('../models/elementTypeRelation')
const ElementDescriptiveRelation = require('../models/elementDescriptiveRelation')

/**
 * Import elements
 */

exports.importElements = (req, res) => {
  Element.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(__dirname, '../csv/elements.csv')
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let element = new Element(data)
        element.save()
      })
      .on('end', () => {
        return res.send('Importing elements finished')
      })
  })
}

/**
 * Import type categories
 */

exports.importTypeCategories = (req, res) => {
  TypeCategory.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(__dirname, '../csv/type_categories.csv')
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let typeCategory = new TypeCategory(data)
        typeCategory.save()
      })
      .on('end', () => {
        return res.send('Importing type categories finished')
      })
  })
}

/**
 * Import descriptive categories
 */

exports.importDescriptiveCategories = (req, res) => {
  DescriptiveCategory.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(__dirname, '../csv/descriptive_categories.csv')
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let descriptiveCategory = new DescriptiveCategory(data)
        descriptiveCategory.save()
      })
      .on('end', () => {
        return res.send('Importing descriptive categories finished')
      })
  })
}

/**
 * Import type descriptive relations
 */

exports.importTypeDescriptiveRelations = (req, res) => {
  TypeDescriptiveRelation.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(
      __dirname,
      '../csv/type_descriptive_relations.csv'
    )
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let typeDescriptiveRelation = new TypeDescriptiveRelation(data)
        typeDescriptiveRelation.save()
      })
      .on('end', () => {
        return res.send('Importing type descriptive relations finished')
      })
  })
}

/**
 * Import element type relations
 */

exports.importElementTypeRelations = (req, res) => {
  ElementTypeRelation.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(__dirname, '../csv/element_type_relations.csv')
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let elementTypeRelation = new ElementTypeRelation(data)
        elementTypeRelation.save()
      })
      .on('end', () => {
        return res.send('Importing element type relations finished')
      })
  })
}

/**
 * Import element descriptive relations
 */

exports.importElementDescriptiveRelations = (req, res) => {
  ElementDescriptiveRelation.remove({}, err => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    const csvPath = path.join(
      __dirname,
      '../csv/element_descriptive_relations.csv'
    )
    const stream = fs.createReadStream(csvPath)
    csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        let elementDescriptiveRelation = new ElementDescriptiveRelation(data)
        elementDescriptiveRelation.save()
      })
      .on('end', () => {
        return res.send('Importing element descriptive relations finished')
      })
  })
}
