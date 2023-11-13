import fs from "node:fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // GET ALL
  getAll = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      return {
        status: "server error",
        error: `500 Server error - ${error.message}`,
      };
    }
  };

  // GET BY ID
  getById = async (id) => {
    try {
      const products = await this.getProducts();
      if (!products.length) return { status: "error", error: "404 Not Found" };

      const productFound = products.find((product) => {
        return product.id === id;
      });
      if (!productFound) return { status: "error", error: "404 Not Found" };

      return productFound;
    } catch (error) {
      return {
        status: "server error",
        error: `500 Server error - ${error.message}`,
      };
    }
  };

  // ADD
  create = async ({
    title,
    description,
    price,
    thumbnail = [],
    code,
    stock,
    status = true,
  }) => {
    const producto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    };
    // Validacion de campos
    if (!title || !description || !price || !code || !stock) {
      return {
        status: "error",
        error: "The product was not created, all fields are required",
      };
    }

    try {
      const products = await this.getProducts();

      if (!products.length) {
        producto.id = 1;
      } else {
        producto.id = products[products.length - 1].id + 1;
      }
      // CODE único
      const productCode = products.find((product) => product.code === code);
      if (productCode) {
        return {
          status: "error",
          error: `Already exists a product with this code`,
        };
      }
      products.push(producto);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return producto;
    } catch (error) {
      return {
        status: "server error",
        error: `500 Server error - ${error.message}`,
      };
    }
  };

  // UPDATE
  update = async (
    id,
    { title, description, price, thumbnail = [], code, stock, status = true }
  ) => {
    const producto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    };
    // Validacion de campos

    if (!id) {
      return { status: "error", error: "Id is not defined" };
    }
    if (!producto) {
      return { status: "error", error: "Cannot update with an empty product" };
    }

    try {
      const products = await this.getProducts();
      const productFound = await this.getProductById(id);
      if (productFound.error) {
        return { status: "error", error: productFound.error };
      }
      const productCode = products.find((product) => product.code === code);
      if (productCode && productCode.id !== id) {
        return {
          status: "error",
          error: "A product already exists with this code",
        };
      }

      products.forEach((product) => {
        if (product.id == id) {
          Object.entries(producto).map(([key, value]) => {
            if (key != "id") {
              product[key] = value;
              productFound[key] = value;
            }
          });
        }
      });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return productFound;
    } catch (error) {
      return {
        status: "server error",
        error: `500 Server error - ${error.message}`,
      };
    }
  };

  // DELETE
  delete = async (id) => {
    if (!id) {
      return { status: "error", error: "Id is not defined" };
    }

    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);

      if (!products.length || index === -1) {
        return { status: "error", error: "404 Not Found" };
      }
      if (index === 0) {
        products.splice(index, index + 1);
      } else {
        products.splice(index, index);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return { products };
    } catch (error) {
      return {
        status: "server error",
        error: `500 Server error - ${error.message}`,
      };
    }
  };
}
