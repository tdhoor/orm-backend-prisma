import { Request, Response, NextFunction } from "express";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"
import { IProductController } from "@core/models/controllers/product-controller.model";
import { countEntities } from "../functions/count-entities.functions";

class ProductController implements IProductController {
    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.create({
                data: req.body
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating product" });
                console.error(error);
            })
    }

    getOneById(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.findUnique({
                where: {
                    id: +req.params.id
                }
            })
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting product" });
                console.error(error);
            })
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.findMany({
                orderBy: {
                    name: "asc"
                },
                take: 100
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting products" });
                console.error(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        const product = req.body;
        const id = product.id;
        delete product.id;
        execTest(() => {
            return DB.product.update({
                where: {
                    id
                },
                data: product
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error updating product" });
                console.error(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            const id = +req.params.id;
            await DB.product.delete({
                where: {
                    id
                }
            });
            return id;
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error deleting product" });
                console.error(error);
            })
    }

    getProductsFromCategory(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.findMany({
                where: {
                    productCategory: {
                        name: req.params.name
                    }
                },
                orderBy: {
                    name: "asc"
                },
                take: 100
            })
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting product from category" });
                console.error(error);
            })
    }
}

export const productController = new ProductController();