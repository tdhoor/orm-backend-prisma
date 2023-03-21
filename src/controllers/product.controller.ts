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
                res.status(500).send(error);
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
                res.status(500).send(error);
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
                res.status(500).send(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.update({
                where: {
                    id: +req.body.id
                },
                data: req.body
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            return DB.product.delete({
                where: {
                    id: +req.params.id
                }
            })
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).send(error);
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
                res.status(500).send(error);
            })
    }
}

export const productController = new ProductController();