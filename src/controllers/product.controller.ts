import { Request, Response, NextFunction } from "express";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"
import { IProductController } from "@core/models/controllers/product-controller.model";
import { countEntities } from "src/functions/count-entities.functions";
import { Prisma, Product } from "@prisma/client";

class ProductController implements IProductController {
    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            const args: Prisma.ProductCreateArgs = {
                data: req.body
            }
            if (req.body.productCategory) {
                args.data.productCategory = {
                    connect: {
                        id: req.body.productCategory.id
                    }
                }
            }
            return DB.product.create(args);
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
                },
                include: {
                    productCategory: true
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
                include: {
                    productCategory: true
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
            const product: Product = req.body;
            return DB.product.update({
                where: { id: product.id },
                data: req.body
            })
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
                where: { id: +req.params.id }
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
}

export const productController = new ProductController();