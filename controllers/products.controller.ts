import { HttpStatusCode } from "axios";
import ProductService from "../services/products.service";
import { SendResponse } from "../utils/helpers";
import { Messages } from "../utils/messages";
import { io } from "..";

class ProductsControllerClass {
  async fetchProducts(req: any, res: any) {
    try {
      const data = await ProductService.getAllProducts();

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Products.LIST,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error fetching products list: " + error.message,
      });
    }
  }

  async addProduct(req: any, res: any) {
    try {
      const payload = req.body;

      const data = await ProductService.addProduct(payload);

      io.emit("product-added", data);

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Products.ADD_SUCCESS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error adding product to list: " + error.message,
      });
    }
  }

  async updateProduct(req: any, res: any) {
    try {
      const payload = req.body;
      const productId = parseInt(req.params.id);

      const data = await ProductService.updateProduct(productId, payload);

      io.emit("product-updated", { productId, ...data });

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Products.UPDATE_SUCCESS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error updating product: " + error.message,
      });
    }
  }

  async removeProduct(req: any, res: any) {
    try {
      const productId = parseInt(req.params.id);

      const data = await ProductService.removeProduct(productId);

      io.emit("product-removed", { productId });

      return SendResponse({
        res,
        status: HttpStatusCode.Ok,
        message: Messages.Products.REMOVE_SUCCESS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error removing product from list: " + error.message,
      });
    }
  }
}

const ProductsController = new ProductsControllerClass();
export default ProductsController;
