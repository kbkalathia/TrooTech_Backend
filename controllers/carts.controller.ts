import { HttpStatusCode } from "axios";
import { SendResponse } from "../utils/helpers";
import { Messages } from "../utils/messages";
import CartService from "../services/carts.service";

class CartsControllerClass {
  async getUserCart(req: any, res: any) {
    try {
      const userId = req.params.userId;

      const data = await CartService.userCartDetails(userId);

      if (data?.noCart) {
        return SendResponse({
          res,
          status: HttpStatusCode.Ok,
          message: Messages.Carts.NOT_FOUND,
          data: {},
        });
      }

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Carts.CART_DETAILS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error fetching cart details: " + error.message,
      });
    }
  }

  async addToCart(req: any, res: any) {
    try {
      const userId = req.params.userId;
      const { productId, quantity } = req.body;

      const data = await CartService.addToCart(userId, {
        productId,
        quantity,
      });

      return SendResponse({
        res,
        status: HttpStatusCode.Created,
        message: Messages.Carts.UPDATE_SUCCESS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error adding item to cart: " + error.message,
      });
    }
  }

  async deleteUserCart(req: any, res: any) {
    try {
      const cartId = req.params.cartId;

      await CartService.deleteUserCart(cartId);

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Carts.DELETE_SUCCESS,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error clearing cart: " + error.message,
      });
    }
  }
}

const CartsController = new CartsControllerClass();
export default CartsController;
