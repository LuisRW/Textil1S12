const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(4).max(50);
const price = Joi.number().precision(2).min(Joi.ref('cost'));
const stock = Joi.number().integer().min(0);
const stockMin = Joi.number().integer().min(0);
// const imageUrl = Joi.string();

const subcategoryId = Joi.number().integer();
const unitId = Joi.number().integer();


const offset = Joi.number().integer();
const limit = Joi.number().integer();
const search = Joi.string();
const sortColumn = Joi.string();
const sortDirection = Joi.string();
const filterField = Joi.string();
const filterType = Joi.string();
const filterValue = Joi.string();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  stock: stock.required(),
  subcategoryId: subcategoryId.required(),
  unitId: unitId.required(),
  // features: features
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  stock: stock,
  subcategoryId: subcategoryId,
  unitId: unitId,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  offset,
  limit,
  search,
  sortColumn,
  sortDirection,
  filterField,
  filterType,
  filterValue
});

const searchProductSchema = Joi.object({
  offset,
  limit,
  search: search.required(),
});

module.exports = { createProductSchema, getProductSchema, queryProductSchema, updateProductSchema, searchProductSchema }