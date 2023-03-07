import { DB } from "src/db";

export async function countEntities() {
    return {
        address: await DB.address.count(),
        customer: await DB.customer.count(),
        order: await DB.order.count(),
        orderItem: await DB.orderItem.count(),
        product: await DB.product.count(),
        productCategory: await DB.productCategory.count(),
    }
}