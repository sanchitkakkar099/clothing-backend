const fetch = require("node-fetch");
const db = require("./mongooseMethods")
const dbModels = require("./modelName")
 
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const ACCESS_TOKEN =process.env.APIPASSWORD;
 
const changeInDraf= async(product) =>{

    console.log("product in changeindraft function",product);
    const url = `https://${SHOP_DOMAIN}/admin/api/2023-04/products/${product}.json`;
    const body = {
        product: {
            status: "draft",   
        }
    };   
                
    const response = await fetch(url, {     
        method: 'PUT',         
        headers: {                      
            'Content-Type': 'application/json',                             
            'X-Shopify-Access-Token': ACCESS_TOKEN,                                           
        },                        
        body: JSON.stringify(body)                   
    });               
                 
    if (!response.ok) {                    
        const errorInfo = await response.json();     
        console.error('Failed to chnage product in draft:', errorInfo);                           
        throw new Error(`API Error: ${response.status} ${response.statusText}`);             
    }     
   
    return response.json();
}    
     
 const deleteProducts = async (product) => {
      
    const url = `https://${SHOP_DOMAIN}/admin/api/2023-04/products/${product}.json`;    
 
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
    });
     if(response.ok){   
        const updateResult = await db.findOneAndUpdate({
            collection: dbModels.Product, // Ensure correct collection is specified
            query: { parentProductId: product },
            update: { isDelParentProduct: true }
        });
     }
    if (!response.ok) {
        const errorInfo = await response.json();
        console.error('Failed to delete product:', errorInfo);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
 
}
 
 const productDelet = async(shop_name) => {
 
    const productObj = await db.find({
        collection: dbModels.Product,
        query: { shop_name: shop_name, isDelParentProduct: false }
    })
    if (productObj.length) {
        for (const product of productObj) {
            const result = await changeInDraf(product?.parentProductId)
        }
        setTimeout(async () => {
            console.log("shopname in settimeout",shop_name);
            const checkAppInstall = await db.findOne({
                collection: dbModels.User,
                query: { storename: shop_name },   
            })
            if (!checkAppInstall?.isAppinstall) {
                const productObj = await db.find({
                    collection: dbModels.Product,
                    query: { shop_name: shop_name, isDelParentProduct: false }
                })
                for (const product of productObj) {
                    const result = await deleteProducts(product?.parentProductId);
                }
            }     
        },  20*1000)
    }
}

module.exports = {
    deleteProducts,
    productDelet
};