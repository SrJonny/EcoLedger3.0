
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class GoalsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const goals = await db.goals.create(
            {
                id: data.id || undefined,

        goal_type: data.goal_type
        ||
        null
            ,

        target_reduction: data.target_reduction
        ||
        null
            ,

        achieved: data.achieved
        ||
        false

            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return goals;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const goalsData = data.map((item, index) => ({
                id: item.id || undefined,

                goal_type: item.goal_type
            ||
            null
            ,

                target_reduction: item.target_reduction
            ||
            null
            ,

                achieved: item.achieved
            ||
            false

            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const goals = await db.goals.bulkCreate(goalsData, { transaction });

        return goals;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const goals = await db.goals.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.goal_type !== undefined) updatePayload.goal_type = data.goal_type;

        if (data.target_reduction !== undefined) updatePayload.target_reduction = data.target_reduction;

        if (data.achieved !== undefined) updatePayload.achieved = data.achieved;

        updatePayload.updatedById = currentUser.id;

        await goals.update(updatePayload, {transaction});

        return goals;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const goals = await db.goals.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of goals) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of goals) {
                await record.destroy({transaction});
            }
        });

        return goals;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const goals = await db.goals.findByPk(id, options);

        await goals.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await goals.destroy({
            transaction
        });

        return goals;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const goals = await db.goals.findOne(
            { where },
            { transaction },
        );

        if (!goals) {
            return goals;
        }

        const output = goals.get({plain: true});

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

                if (filter.goal_type) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'goals',
                            'goal_type',
                            filter.goal_type,
                        ),
                    };
                }

            if (filter.target_reductionRange) {
                const [start, end] = filter.target_reductionRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    target_reduction: {
                    ...where.target_reduction,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    target_reduction: {
                    ...where.target_reduction,
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

            if (filter.achieved) {
                where = {
                    ...where,
                achieved: filter.achieved,
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
            const { rows, count } = await db.goals.findAndCountAll(queryOptions);

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
                        'goals',
                        'goal_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.goals.findAll({
            attributes: [ 'id', 'goal_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['goal_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.goal_type,
        }));
    }

};

