import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import ProductsModel from "./products.model";
import CartsModel from "./carts.model";

const CartItemsModel = sequelize.define(
  "CartItem",
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
  },
  {
    timestamps: false,
  }
);

// Associations
CartItemsModel.belongsTo(CartsModel, { foreignKey: "cart_id", as: "cart" });
CartsModel.hasMany(CartItemsModel, { foreignKey: "cart_id", as: "items" });

CartItemsModel.belongsTo(ProductsModel, {
  foreignKey: "product_id",
  as: "productDetails",
});
ProductsModel.hasMany(CartItemsModel, {
  foreignKey: "product_id",
  as: "cartItems",
});

export default CartItemsModel;
