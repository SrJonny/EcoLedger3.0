const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const dashboards = sequelize.define(
    'dashboards',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

weekly_emissions: {
        type: DataTypes.DECIMAL,

      },

monthly_emissions: {
        type: DataTypes.DECIMAL,

      },

points: {
        type: DataTypes.INTEGER,

      },

badges: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  dashboards.associate = (db) => {

    db.dashboards.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.dashboards.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return dashboards;
};

