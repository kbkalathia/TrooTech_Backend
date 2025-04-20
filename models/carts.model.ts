import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import UsersModel from "./users.model";

const CartsModel = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);

// Associations
CartsModel.belongsTo(UsersModel, { foreignKey: "user_id", as: "user" });
UsersModel.hasMany(CartsModel, { foreignKey: "user_id", as: "carts" });

export default CartsModel;
