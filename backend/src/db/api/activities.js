
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ActivitiesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const activities = await db.activities.create(
            {
                id: data.id || undefined,

        activity_type: data.activity_type
        ||
        null
            ,

        date: data.date
        ||
        null
            ,

        emissions: data.emissions
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return activities;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const activitiesData = data.map((item, index) => ({
                id: item.id || undefined,

                activity_type: item.activity_type
            ||
            null
            ,

                date: item.date
            ||
            null
            ,

                emissions: item.emissions
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const activities = await db.activities.bulkCreate(activitiesData, { transaction });

        return activities;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const activities = await db.activities.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.activity_type !== undefined) updatePayload.activity_type = data.activity_type;

        if (data.date !== undefined) updatePayload.date = data.date;

        if (data.emissions !== undefined) updatePayload.emissions = data.emissions;

        updatePayload.updatedById = currentUser.id;

        await activities.update(updatePayload, {transaction});

        return activities;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const activities = await db.activities.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of activities) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of activities) {
                await record.destroy({transaction});
            }
        });

        return activities;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const activities = await db.activities.findByPk(id, options);

        await activities.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await activities.destroy({
            transaction
        });

        return activities;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const activities = await db.activities.findOne(
            { where },
            { transaction },
        );

        if (!activities) {
            return activities;
        }

        const output = activities.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.activity_type) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'activities',
                            'activity_type',
                            filter.activity_type,
                        ),
                    };
                }

            if (filter.dateRange) {
                const [start, end] = filter.dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    date: {
                    ...where.date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    date: {
                    ...where.date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.emissionsRange) {
                const [start, end] = filter.emissionsRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    emissions: {
                    ...where.emissions,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    emissions: {
                    ...where.emissions,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.activities.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'activities',
                        'activity_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.activities.findAll({
            attributes: [ 'id', 'activity_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['activity_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.activity_type,
        }));
    }

};

