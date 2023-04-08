import { Request, Response, NextFunction } from "express";
import { ICrudController } from "@core/models/controllers/crud-controller.mock";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"

class OrderController implements ICrudController {
    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.order.create({
                data: {
                    ...req.body,
                    orderItems: {
                        create: req.body.orderItems
                    }
                },
                include: {
                    orderItems: true
                }
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating order" });
                console.error(error);
            })
    }

    getOneById(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.order.findUnique({
                where: {
                    id: +req.params.id
                },
                include: {
                    orderItems: true
                }
            })
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting order" });
                console.error(error);
            })
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.order.findMany({
                include: {
                    orderItems: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting orders" });
                console.error(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        const { id, ...order } = req.body;
        execTest(() => {
            return DB.order.update({
                where: {
                    id
                },
                data: order
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error updating order" });
                console.error(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            const id = +req.params.id;
            await DB.order.delete({
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
                res.status(500).json({ msg: "Error deleting order" });
                console.error(error);
            })
    }
}

export const orderController = new OrderController();