import { createMock } from "@core/functions/create-entity-mock.function";
import { DB } from "../db";
import { deleteAllEntities } from "../functions/delete-all-entities.function";
import { countEntities } from "src/functions/count-entities.functions";

async function seedDb(req, res, next) {
    try {
        const amount: number = +req.params.amount;
        let p1 = performance.now();

        await deleteAllEntities();

        let customers = createMock.customers(amount);
        let addresses = createMock.addresses(amount);
        let categories = createMock.productCategories((amount / 1000) < 100 ? 100 : (amount / 1000));
        let products = createMock.products(amount, categories);
        let { orders, orderItems } = createMock.orders(amount, 0, products, false);


        await DB.customer.createMany({ data: customers });
        console.log("customers created");

        await DB.address.createMany({ data: addresses });
        console.log("addresses created");

        await DB.productCategory.createMany({ data: categories });
        console.log("categories created");

        await DB.product.createMany({ data: products });
        console.log("products created");

        await DB.order.createMany({ data: orders });
        console.log("orders created");

        await DB.orderItem.createMany({ data: orderItems });
        console.log("orderItems created");

        console.log(performance.now() - p1);
        const count = await countEntities();
        console.log('====================================');
        res.status(200).json({ message: "DB seeded", count });
        console.log('====================================');
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error seeding DB" });
        return;
    }
}

export default {
    seedDb
}