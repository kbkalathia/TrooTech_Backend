import { ProductPayload } from "../interfaces/products.interface";
import ProductsModel from "../models/products.model";

class ProductServiceClass {
  async getAllProducts() {
    const products = await ProductsModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    return {
      products,
    };
  }

  async addProduct(payload: ProductPayload) {
    const product = await ProductsModel.create({ ...payload });

    return {
      product,
    };
  }

  async updateProduct(productId: number, payload: ProductPayload) {
    const [updatedCount, [updatedProduct]] = await ProductsModel.update(
      payload,
      {
        where: { id: productId },
        returning: true,
      }
    );

    return {
      product: {
        ...updatedProduct.dataValues,
      },
    };
  }

  async removeProduct(productId: number) {
    await ProductsModel.destroy({
      where: {
        id: productId,
      },
    });

    return;
  }
}

const ProductService = new ProductServiceClass();
export default ProductService;
