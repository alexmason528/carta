const fs = require('fs')
const csv = require('fast-csv')
const path = require('path')

const Element = require('../models/element')
const Descriptive = require('../models/descriptive')
const Type = require('../models/type')
const Category = require('../models/category')
/**
 * Import elements
 * @param null
 * @returns void
 */

const importElements = (req, res) => {
  Element.remove({}, (err) => {
    if (err) throw err

    const csvPath = path.join(__dirname, '../csv/elements.csv')
    const stream = fs.createReadStream(csvPath)
    csv
    .fromStream(stream, { headers: true })
    .on('data', (data) => {
      let element = new Element(data)
      element.save()
    })
    .on('end', () => {
      res.send('Importing elements finished')
    })
  })
}

/**
 * Import descriptive characteristics
 * @param null
 * @returns void
 */

const importDescriptives = (req, res) => {
  Descriptive.remove({}, (err) => {
    if (err) throw err

    const csvPath = path.join(__dirname, '../csv/descriptives.csv')
    const stream = fs.createReadStream(csvPath)
    csv
    .fromStream(stream, { headers: true })
    .on('data', (data) => {
      let descriptive = new Descriptive(data)
      descriptive.save()
    })
    .on('end', () => {
      res.send('Importing descriptives finished')
    })
  })
}

/**
 * Import type characteristics
 * @param null
 * @returns void
 */

const importTypes = (req, res) => {
  Type.remove({}, (err) => {
    if (err) throw err

    const csvPath = path.join(__dirname, '../csv/types.csv')
    const stream = fs.createReadStream(csvPath)
    csv
    .fromStream(stream, { headers: true })
    .on('data', (data) => {
      let type = new Type(data)
      type.save()
    })
    .on('end', () => {
      res.send('Importing types finished')
    })
  })
}

/**
 * Import categories
 * @param null
 * @returns void
 */

const importCategories = (req, res) => {
  Category.remove({}, (err) => {
    if (err) throw err

    const csvPath = path.join(__dirname, '../csv/categories.csv')
    const stream = fs.createReadStream(csvPath)
    csv
    .fromStream(stream, { headers: true })
    .on('data', (data) => {
      let category = new Category(data)
      category.save()
    })
    .on('end', () => {
      res.send('Importing categories finished')
    })
  })
}

module.exports.importElements = importElements
module.exports.importDescriptives = importDescriptives
module.exports.importTypes = importTypes
module.exports.importCategories = importCategories
