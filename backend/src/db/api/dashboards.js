
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class DashboardsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const dashboards = await db.dashboards.create(
            {
                id: data.id || undefined,

        weekly_emissions: data.weekly_emissions
        ||
        null
            ,

        monthly_emissions: data.monthly_emissions
        ||
        null
            ,

        points: data.points
        ||
        null
            ,

        badges: data.badges
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return dashboards;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const dashboardsData = data.map((item, index) => ({
                id: item.id || undefined,

                weekly_emissions: item.weekly_emissions
            ||
            null
            ,

                monthly_emissions: item.monthly_emissions
            ||
            null
            ,

                points: item.points
            ||
            null
            ,

                badges: item.badges
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const dashboards = await db.dashboards.bulkCreate(dashboardsData, { transaction });

        return dashboards;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const dashboards = await db.dashboards.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.weekly_emissions !== undefined) updatePayload.weekly_emissions = data.weekly_emissions;

        if (data.monthly_emissions !== undefined) updatePayload.monthly_emissions = data.monthly_emissions;

        if (data.points !== undefined) updatePayload.points = data.points;

        if (data.badges !== undefined) updatePayload.badges = data.badges;

        updatePayload.updatedById = currentUser.id;

        await dashboards.update(updatePayload, {transaction});

        return dashboards;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const dashboards = await db.dashboards.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of dashboards) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of dashboards) {
                await record.destroy({transaction});
            }
        });

        return dashboards;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const dashboards = await db.dashboards.findByPk(id, options);

        await dashboards.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await dashboards.destroy({
            transaction
        });

        return dashboards;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const dashboards = await db.dashboards.findOne(
            { where },
            { transaction },
        );

        if (!dashboards) {
            return dashboards;
        }

        const output = dashboards.get({plain: true});

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

                if (filter.badges) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'dashboards',
                            'badges',
                            filter.badges,
                        ),
                    };
                }

            if (filter.weekly_emissionsRange) {
                const [start, end] = filter.weekly_emissionsRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    weekly_emissions: {
                    ...where.weekly_emissions,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    weekly_emissions: {
                    ...where.weekly_emissions,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.monthly_emissionsRange) {
                const [start, end] = filter.monthly_emissionsRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    monthly_emissions: {
                    ...where.monthly_emissions,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    monthly_emissions: {
                    ...where.monthly_emissions,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.pointsRange) {
                const [start, end] = filter.pointsRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    points: {
                    ...where.points,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    points: {
                    ...where.points,
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
            const { rows, count } = await db.dashboards.findAndCountAll(queryOptions);

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
                        'dashboards',
                        'user',
                        query,
                    ),
                ],
            };
        }

        const records = await db.dashboards.findAll({
            attributes: [ 'id', 'user' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['user', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.user,
        }));
    }

};

