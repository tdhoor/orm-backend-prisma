import { Request, Response, NextFunction } from "express";
import { ICustomerController } from "@core/models/controllers/customer-controller.model";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"

class CustomerController implements ICustomerController {
    createMany(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.customer.createMany({
                data: req.body
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating customers" });
                console.error(error);
            })
    }

    getCustomerOrders(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.order.findMany({
                where: {
                    customerId: +req.params.id
                },
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
                res.status(500).json({ msg: "Error getting customer orders" });
                console.error(error);
            })
    }

    getCustomerProducts(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.product.findMany({
                where: {
                    orderItems: {
                        some: {
                            order: {
                                customer: {
                                    id: +req.params.id
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    name: "asc"
                },
                take: 100
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting customer products" });
                console.error(error);
            })
    }

    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.customer.create({
                data: {
                    ...req.body,
                    address: {
                        create: req.body.address
                    }
                },
                include: {
                    address: true
                }
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating customers" });
                console.error(error);
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
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting customer" });
                console.error(error);
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
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting customers" });
                console.error(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        const { id, ...customer } = req.body;
        if (!customer.address) {
            delete customer.address;
        }
        execTest(() => {
            return DB.customer.update({
                where: {
                    id
                },
                data: customer
            });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error updating customer" });
                console.error(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            const id = +req.params.id;
            await DB.customer.delete({
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
                res.status(500).json({ msg: "Error deleting customer" });
                console.error(error);
            })
    }

}

export const customerController = new CustomerController();