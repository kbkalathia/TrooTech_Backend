import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import UsersModel from "./users.model";

const OrdersModel = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Associations
OrdersModel.belongsTo(UsersModel, { foreignKey: "user_id", as: "user" });
UsersModel.hasMany(OrdersModel, { foreignKey: "user_id", as: "orders" });

export default OrdersModel;
