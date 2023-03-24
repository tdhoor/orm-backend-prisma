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

        console.log('====================================');
        console.log("All entities deleted");
        console.log('====================================');
        let customers = createMock.customers(amount);

        console.log('====================================');
        console.log("Customers created1");
        console.log('====================================');
        let addresses = createMock.addresses(amount, customers);


        console.log('====================================');
        console.log("Addresses created1");
        console.log('====================================');
        while (customers.length > 0) {
            await DB.customer.createMany({ data: customers.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("Customers created");
        console.log('====================================');

        while (addresses.length > 0) {
            await DB.address.createMany({ data: addresses.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("Addresses created");
        console.log('====================================');
        let categories = createMock.productCategories(calcProductCategoryAmount(amount));
        let products = createMock.products(amount, categories);
        let customerIds = Array.from({ length: amount }).map((_, i) => i + 1);
        let { orders, orderItems } = createMock.orders(amount, customerIds, products, { addOrderIdToOrderItem: true, seperateOrderItems: true });

        while (categories.length > 0) {
            await DB.productCategory.createMany({ data: categories.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("Categories created");
        console.log('====================================');
        while (products.length > 0) {
            await DB.product.createMany({ data: products.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("Products created");
        console.log('====================================');

        while (orders.length > 0) {
            await DB.order.createMany({ data: orders.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("Orders created");
        console.log('====================================');

        while (orderItems.length > 0) {
            await DB.orderItem.createMany({ data: orderItems.splice(0, 50000) });
        }
        console.log('====================================');
        console.log("OrderItems created");
        console.log('====================================');

        console.log(performance.now() - p1);
        const count = await countEntities();

        res.status(200).json({ message: "DB seeded", count });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error seeding DB" });
        return;
    }
}

export default {
    seedDb
}