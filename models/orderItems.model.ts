import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import OrdersModel from "./orders.model";
import ProductsModel from "./products.model";

const OrderItemsModel = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
  {
    timestamps: false,
  }
);

// Associations
OrderItemsModel.belongsTo(OrdersModel, { foreignKey: "order_id", as: "order" });
OrdersModel.hasMany(OrderItemsModel, { foreignKey: "order_id", as: "items" });

OrderItemsModel.belongsTo(ProductsModel, {
  foreignKey: "product_id",
  as: "product",
});
ProductsModel.hasMany(OrderItemsModel, {
  foreignKey: "product_id",
  as: "orderItems",
});

export default OrderItemsModel;
