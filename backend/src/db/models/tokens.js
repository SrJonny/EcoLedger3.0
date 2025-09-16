const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const tokens = sequelize.define(
    'tokens',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

balance: {
        type: DataTypes.INTEGER,

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

  tokens.associate = (db) => {

    db.tokens.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.tokens.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return tokens;
};

