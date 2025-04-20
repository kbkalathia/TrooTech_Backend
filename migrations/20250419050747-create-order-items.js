"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "OrderItems",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          order_id: {
            type: DataTypes.INTEGER,
            references: {
              model: "Orders",
              key: "id",
            },
            onDelete: "CASCADE",
          },
          product_id: {
            type: DataTypes.INTEGER,
            references: {
              model: "Products",
              key: "id",
            },
            onDelete: "CASCADE",
          },
          quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("OrderItems", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
