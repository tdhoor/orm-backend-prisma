import { Request, Response, NextFunction } from "express";
import { ICustomerController } from "@core/models/controllers/customer-controller.model";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"
import { countEntities } from "src/functions/count-entities.functions";
import { Customer, Prisma } from "@prisma/client";

class CustomerController implements ICustomerController {
    createMany(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.customer.createMany({
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

    getCustomerOrders(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.order.findMany({
                where: {
                    customer: {
                        id: +req.params.id
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }

    getCustomerProducts(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.findMany({
                where: {
                    orderItems: {
                        some: {
                            order: {
                                customerId: +req.params.id
                            }
                        }
                    }
                },
                orderBy: {
                    name: "asc"
                }
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }

    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            let data: Prisma.CustomerCreateInput = req.body;

            if (req.body.address) {
                data.address = {
                    create: req.body.address
                }
            }
            return DB.customer.create({ data });
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
            return DB.customer.findUnique({
                where: {
                    id: +req.params.id
                },
                include: {
                    address: true
                }
            });
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
            return DB.customer.findMany({
                include: {
                    address: true
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
            return DB.customer.update({
                where: {
                    id: req.body.id
                },
                data: req.body,
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
            return DB.customer.delete({
                where: {
                    id: +req.params.id
                },
                include: {
                    address: true
                }
            });
        }, countEntities)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ massage: "Error deleting customer!", data: { id: req.params.id } });
            })
    }

}

export const customerController = new CustomerController();