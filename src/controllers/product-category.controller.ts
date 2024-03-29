import { Request, Response, NextFunction } from "express";
import { ICrudController } from "@core/models/controllers/crud-controller.mock";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"

class ProductCategoryController implements ICrudController {
    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.productCategory.create({
                data: req.body
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating product category", data: req.body });
                console.error(error);
            })
    }

    getOneById(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.productCategory.findUnique({
                where: {
                    id: +req.params.id
                }
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting product category" });
                console.error(error);
            })
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.productCategory.findMany({ take: 100 });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting product categories" });
                console.error(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        const { id, ...productCategory } = req.body;
        execTest(() => {
            return DB.productCategory.update({
                where: {
                    id: id
                },
                data: productCategory
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error updating product category" });
                console.error(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            const id = +req.params.id;
            await DB.productCategory.delete({
                where: {
                    id
                }
            });
            return id;
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error deleting product category" });
                console.error(error);
            })
    }
}

export const productCategoryController = new ProductCategoryController();