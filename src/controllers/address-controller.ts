import { Request, Response, NextFunction } from "express";
import { ICrudController } from "@core/models/controllers/crud-controller.mock";
import { execTest } from "@core/functions/exec-test.function";
import { DB } from "../db"

class AddressController implements ICrudController {
    createOne(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.address.create({
                data: req.body
            })
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error creating addresss" });
                console.error(error);
            })
    }

    getOneById(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.address.findUnique({
                where: {
                    id: +req.params.id
                }
            })
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting address" });
                console.error(error);
            })
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        execTest(() => {
            return DB.address.findMany({ take: 100 });
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json({ msg: "Error getting addresses" });
                console.error(error);
            })
    }

    updateOne(req: Request, res: Response, next: NextFunction) {
        const { id, ...address } = req.body;
        execTest(() => {
            return DB.address.update({
                where: {
                    id
                },
                data: address
            });

        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(500).json("Error updating address")
                console.error(error);
            })
    }

    deleteOneById(req: Request, res: Response, next: NextFunction) {
        execTest(async () => {
            const id = +req.params.id;
            await DB.address.delete({
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
                res.status(500).json({ msg: "Error deleting address" });
                console.error(error);
            })
    }
}

export const addressController = new AddressController();