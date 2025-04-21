import CartItemsModel from "../models/cartItems.model";
import CartsModel from "../models/carts.model";
import ProductsModel from "../models/products.model";

class CartServiceClass {
  async userCartDetails(userId: number) {
    const userCartExist: any = await CartsModel.findOne({
      where: { user_id: userId },
    });

    if (!userCartExist) {
      return {
        noCart: true,
      };
    }

    const cartItems = await CartItemsModel.findAll({
      where: { cart_id: userCartExist.id },
      include: [
        {
          model: ProductsModel,
          as: "productDetails",
        },
      ],
        order: [["createdAt", "DESC"]],
    });

    return {
      cartItems,
    };
  }

  async addToCart(
    userId: number,
    payload: { productId: number; quantity: number }
  ) {
    const { productId, quantity } = payload;

    // Fetch product to check stock
    const product: any = await ProductsModel.findByPk(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    // Get or create cart
    let cart: any = await CartsModel.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await CartsModel.create({ user_id: userId });
    }

    // Check if item already in cart
    let cartItem: any = await CartItemsModel.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (cartItem) {
      const stockAdjustment = quantity - cartItem.quantity;

      if (quantity === 0) {
        // Remove item from cart and restock
        await CartItemsModel.destroy({
          where: {
            cart_id: cart.id,
            product_id: productId,
          },
        });

        await product.increment("stock", { by: cartItem.quantity });
        return { removed: true };
      } else {
        if (stockAdjustment > product.stock) {
          throw new Error("Not enough stock to update quantity...");
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        await product.decrement("stock", { by: stockAdjustment });
      }
    } else {
      // New item in cart
      if (quantity === 0) {
        return { ignored: true }; // don't add zero quantity
      }

      await CartItemsModel.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });

      await product.decrement("stock", { by: quantity });
    }

    return { item: cartItem, product };
  }

  async deleteUserCart(cartId: number) {
    await CartsModel.destroy({
      where: { id: cartId },
    });

    return;
  }
}

const CartService = new CartServiceClass();
export default CartService;
