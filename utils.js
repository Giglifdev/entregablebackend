import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const productsFilePath = join(__dirname, "./files/productos.json");
export const cartsFilePath = join(__dirname, "./files/carts.json");
