const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const goals = sequelize.define(
    'goals',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

goal_type: {
        type: DataTypes.TEXT,

      },

target_reduction: {
        type: DataTypes.DECIMAL,

      },

achieved: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,

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

  goals.associate = (db) => {

    db.goals.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.goals.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return goals;
};

