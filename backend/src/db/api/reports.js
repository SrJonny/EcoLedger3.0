
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ReportsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const reports = await db.reports.create(
            {
                id: data.id || undefined,

        generated_on: data.generated_on
        ||
        null
            ,

        total_reduction: data.total_reduction
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return reports;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const reportsData = data.map((item, index) => ({
                id: item.id || undefined,

                generated_on: item.generated_on
            ||
            null
            ,

                total_reduction: item.total_reduction
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const reports = await db.reports.bulkCreate(reportsData, { transaction });

        return reports;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const reports = await db.reports.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.generated_on !== undefined) updatePayload.generated_on = data.generated_on;

        if (data.total_reduction !== undefined) updatePayload.total_reduction = data.total_reduction;

        updatePayload.updatedById = currentUser.id;

        await reports.update(updatePayload, {transaction});

        return reports;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const reports = await db.reports.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of reports) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of reports) {
                await record.destroy({transaction});
            }
        });

        return reports;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const reports = await db.reports.findByPk(id, options);

        await reports.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await reports.destroy({
            transaction
        });

        return reports;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const reports = await db.reports.findOne(
            { where },
            { transaction },
        );

        if (!reports) {
            return reports;
        }

        const output = reports.get({plain: true});

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

            if (filter.generated_onRange) {
                const [start, end] = filter.generated_onRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    generated_on: {
                    ...where.generated_on,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    generated_on: {
                    ...where.generated_on,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.total_reductionRange) {
                const [start, end] = filter.total_reductionRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    total_reduction: {
                    ...where.total_reduction,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    total_reduction: {
                    ...where.total_reduction,
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
            const { rows, count } = await db.reports.findAndCountAll(queryOptions);

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
                        'reports',
                        'generated_on',
                        query,
                    ),
                ],
            };
        }

        const records = await db.reports.findAll({
            attributes: [ 'id', 'generated_on' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['generated_on', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.generated_on,
        }));
    }

};

