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

        await DB.customer.createMany({ data: customers });
        customers = null;

        await DB.address.createMany({ data: addresses });
        addresses = null;

        let categories = createMock.productCategories(calcProductCategoryAmount(amount));
        let products = createMock.products(amount, categories);
        let customerIds = Array.from({ length: amount }).map((_, i) => i + 1);
        let { orders, orderItems } = createMock.orders(amount, customerIds, products, { addOrderIdToOrderItem: true, seperateOrderItems: true });

        await DB.productCategory.createMany({ data: categories });
        categories = null;

        await DB.product.createMany({ data: products });
        products = null;

        await DB.order.createMany({ data: orders });
        orders = null;
        customerIds = null;

        await DB.orderItem.createMany({ data: orderItems });
        orderItems = null;

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