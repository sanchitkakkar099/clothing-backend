const db = require("./mongooseMethods")
const dbModels = require("./modelName")
 const productsCheckParent = async(products) => {
    try{
        for (const product of products)
        {
            const foundProduct = await db.findOne({
                collection: dbModels.Product,
                query: {vendorProductId: product?.id, isDelParentProduct: false}
            });
            product.isParentCreated = !!foundProduct;
        }
        return products;
    } catch (error) {
        console.error("Error checking parent status:", error);
        throw error;
    }
}

module.exports = {
    productsCheckParent
};