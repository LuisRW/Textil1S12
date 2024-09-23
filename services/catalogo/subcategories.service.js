const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { models } = require('../../libs/sequelize');

class SubcategoriesService {
    async find(query) {
        const { limit, offset, search, sortColumn, sortDirection } = query;
        const options = {
            include: ['category'],
            order: [(sortColumn) ? [sortColumn, sortDirection] : ['id', 'DESC']]
        }
        const optionsCount = {};

        if (limit && offset) {
            options.limit = limit;
            options.offset = offset;
        }

        if (search) {
            options.where = {
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

        const subcategories = await models.Subcategory.findAll(options);
        const total = await models.Subcategory.count(optionsCount);

        return { subcategories, total };
    }

    async create(data) {
        const subcategory = await models.Subcategory.create(data);

      
        return subcategory;
    }

    async findOne(id) {
        const subcategory = await models.Subcategory.findByPk(id, {
            include: [
                
                {
                    model: models.Category,
                    as: 'category',
                }
            ]
        });
        if (!subcategory) {
            throw boom.notFound('No se encontro ninguna subcategoria');
        }
        return subcategory;
    }

    async update(id, changes) {
        let subcategory = await this.findOne(id);
        
        subcategory = await subcategory.update(changes);
        
        return subcategory;
    }

    async delete(id) {
        const subcategory = await this.findOne(id);
        await subcategory.destroy();
        return { id };
    }
}

module.exports = SubcategoriesService;