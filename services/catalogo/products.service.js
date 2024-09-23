const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../../libs/sequelize');

class ProductsService {
    async find(query) {
        const { limit, offset, search, sortColumn, sortDirection, filterField, filterType, filterValue } = query;

        const options = {
            where: {},
            include: [
              
                {
                    model: models.Subcategory,
                    as: 'subcategory',
                    attributes: ['name']
                },
                {
                    model: models.Unit,
                    as: 'unit',
                    attributes: ['symbol']
                },
              
            ],
            order: [(sortColumn) ? [sortColumn, sortDirection] : ['id', 'DESC']]
        }
        const optionsCount = {};

        if (limit && offset) {
            options.limit = limit;
            options.offset = offset;
        }

        if (search) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }

            optionsCount.where = {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }

        if (filterField && filterType && filterValue) {
            const data = this.addFilter(filterField, filterType, filterValue);
            if (data != null) {
                options.where = {
                    ...options.where,
                    [filterField]: data
                }
                optionsCount.where = {
                    ...optionsCount.where,
                    [filterField]: data
                }
            }
        }

        const products = await models.Product.findAll(options);
        const total = await models.Product.count(optionsCount);

        return { products, total };
    }

    addFilter(filterField, filterType, filterValue) {
        switch (filterField) {
            case 'cost':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseFloat(filterValue)
                    }
                }
                return null;
            case 'price':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseFloat(filterValue)
                    }
                }
                return null;
            case 'stockMin':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseInt(filterValue)
                    }
                }
                return null;
            case 'stock':
                if (filterType != "iLike" && !isNaN(filterValue)) {
                    return {
                        [Op[filterType]]: parseInt(filterValue)
                    }
                }
                return null;
            case 'status':
                if (filterType == 'iLike') {
                    if ((filterValue.toLowerCase()) === 'activo') {
                        return {
                            [Op.eq]: 1
                        }
                    } else if ((filterValue.toLowerCase()) === 'inactivo') {
                        return {
                            [Op.eq]: 2
                        }
                    }
                }
                return null;
            default:
                return null;
        }
    }

    async search(query) {
        const { limit, offset, search } = query;

        const options = {
            where: {},
            include: [
                
                {
                    model: models.Subcategory,
                    as: 'subcategory',
                    attributes: ['name']
                },
                {
                    model: models.Unit,
                    as: 'unit',
                    attributes: ['symbol']
                },
                
            ],
            order: [['name', 'DESC']]
        }

        if (limit && offset) {
            options.limit = limit;
            options.offset = offset;
        }

        if (search) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }

        const products = await models.Product.findAll(options);

        return products;
    }

    async create(data) {
        const product = await models.Product.create(data);
      
        return product;
    }

    async findOne(id) {
        const product = await models.Product.findByPk(id);
        if (!product) {
            throw boom.notFound('No se encontro ningun product');
        }
        return product;
    }

    async update(id, changes) {
        let product = await this.findOne(id);
        product = await product.update(changes);
       
        return product;
    }

    async delete(id) {
        const product = await this.findOne(id);
        await product.destroy();
        return { id };
    }

    async findUnits() {
        const units = await models.Unit.findAll();
        return units;
    }
}

module.exports = ProductsService;