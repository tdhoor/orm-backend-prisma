import { createMock } from "@core/functions/create-entity-mock.function";
import { DB } from "../db";
import { deleteAllEntities } from "../functions/delete-all-entities.function";
import { countEntities } from "../functions/count-entities.functions";
import { calcProductCategoryAmount } from "@core/functions/calc-product-category-amount.function";

async function seedDb(req, res, next) {
    try {
        const amount: number = +req.params.amount;
        let p1 = performance.now();

        await deleteAllEntities();

        let customers = createMock.customers(amount);
        let addresses = createMock.addresses(amount, customers);

        while (customers.length > 0) {
            await DB.customer.createMany({ data: customers.splice(0, 10000) });
        }

        while (addresses.length > 0) {
            await DB.address.createMany({ data: addresses.splice(0, 10000) });
        }

        let categories = createMock.productCategories(calcProductCategoryAmount(amount));
        let products = createMock.products(amount, categories);
        let customerIds = Array.from({ length: amount }).map((_, i) => i + 1);
        let { orders, orderItems } = createMock.orders(amount, customerIds, products, { addOrderIdToOrderItem: true, seperateOrderItems: true });

        while (categories.length > 0) {
            await DB.productCategory.createMany({ data: categories.splice(0, 10000) });
        }

        while (products.length > 0) {
            await DB.product.createMany({ data: products.splice(0, 10000) });
        }

        while (orders.length > 0) {
            await DB.order.createMany({ data: orders.splice(0, 10000) });
        }

        while (orderItems.length > 0) {
            await DB.orderItem.createMany({ data: orderItems.splice(0, 10000) });
        }

        console.log(performance.now() - p1);
        const count = await countEntities();
        res.status(200).json({ message: "DB seeded", count });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error seeding DB" });
        return;
    }
}

async function resetDb(req, res, next) {
    try {
        await deleteAllEntities();
        res.status(200).json({ message: "DB reset" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error resetting DB" });
    }
}

export default {
    seedDb,
    resetDb
}