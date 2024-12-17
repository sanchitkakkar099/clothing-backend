// import { error, success } from "./utils/helper.js";
const HelperUtils = require("../utils/helper");
const db = require("../utils/mongooseMethods");
const dbModels = require("../utils/modelName");
const {error} =require("../utils/helper");

const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const ACCESS_TOKEN =process.env.APIPASSWORD;

exports.createProduct = async (req, res) => {
    console.log("req body data",req?.body);
     const {Products,storename,selectedCategory} = req?.body
      console.log("products and store data",Products,storename,selectedCategory);
     try {
        const appData = await db.findOne({
          collection: dbModels.User,
          query: {storename: storename },
          project: { _id:0,storename:1,email:1,isAppapproved: 1,isAppinstall: 1 }
        });
       console.log("appData",appData);
        if (!appData?.isAppinstall) {
            return HelperUtils.errorRes(res,"App is deactivated,Please activate the app to Continue",{},401);
        } 
        const createresponse =  await productCreator(Products,storename,selectedCategory);
        if (!createresponse) {
            console.log("createresponse",createresponse);
            return HelperUtils.errorRes(res,"Failed to Create ",{},500);
          }
          console.log("createresponse",createresponse);
      } catch (error) {
        console.error("Error In creating Products:", error);
        return HelperUtils.errorRes(res, error?.message, {}, 500);
      }
      res.send(Products);
}

 const productCreator = async (Products,shop_name,selectedCategory) => {
    const results = [];
    console.log("products going to create", Products,selectedCategory);
    for (const product of Products) {
      let productData = {
        vendorProductId: product?.id,
        shop_name: shop_name,
        isDelParentProduct: false,
      };
      console.log("productData",productData,selectedCategory);
      try {
        if (product?.image === null) {
          console.log("image verification");
          throw error(`Add an image for the product "${product?.title}".`);
        } else if (product?.body_html === "" || product?.body_html === "<!---->") {
          console.log("description verification");
          throw error(
            `Add a description for the product "${product?.title}" and check the other products if selected.`
          );
        } else if (product?.variants[0]?.title === "Default Title") {
          console.log("variants verification");
            // return HelperUtils.errorRes(res,`Add variants for the product "${product?.title}", such as Size or Color.`,{ product },400);
              throw error(
          `Add Varinats for ${product.title} like Size or Color`
        );
        } else {
          let hasSizeOrColor = false;
          product?.options.map((option) => {
            console.log("options values", option?.name);
            if (option?.name === "Size" || option?.name === "Color") {
              hasSizeOrColor = true;
            }
          });
          if (!hasSizeOrColor) {
            throw error(
              `Add Size Or Color Variants for product ${product.title} and also check for Other products`
            );
          }
        }
        console.log("productData after verification",productData);
        const result = await createProduct(product,selectedCategory);
        console.log("product after creation", result);
        productData.parentProductId = result?.product?.id;
        const productObj = await db.findOne({
          collection: dbModels.Product,
          query: { vendorProductId: product?.id, isDelVendorProduct: false },
        });
        if (!productObj) {
          let newProduct = await db.insertOne({
            collection: dbModels.Product,
            document: productData,
          });
          console.log("newProduct",newProduct);
        } else {
          let updateProduct = await db.findOneAndUpdate({
            collection: dbModels.Product,
            query: { vendorProductId: product?.id },
            update: productData,
            options: { new: true },
          });
        }
        results.push(result);
      } catch (error) {
        console.error("Error in product creation:", error);
        throw error;
      }
    }
    return results;
};

async function createProduct(product,selectedCategory) {
    const url = `https://${SHOP_DOMAIN}/admin/api/2023-04/products.json`;
    const body = {
      product: {
        title: product?.title,
        body_html: product?.body_html,
        vendor: product?.vendor,
        tags: getTags(product?.tags,selectedCategory),
        status: "draft",
        variants: product?.variants?.map((variant) => ({
          title: variant?.title,
          price: variant?.price,
          sku: variant?.sku,
          option1: variant?.option1,
          option2: variant?.option2,
          option3: variant?.option3,
          inventory_policy: 'continue',
          inventory_management: variant?.inventory_management,
          inventory_quantity: variant?.inventory_quantity,
        })),
        options: product?.options?.map((option) => ({
          name: option?.name,
          values: option?.values,
        })),
        images: product?.images?.map((image) => ({
          src: image?.src,
        })),
      },
    };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const errorInfo = await response.json();
      console.error("Failed to create product:", errorInfo);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const responseData = await response.json();
    console.log("responseData after product creation", responseData);
    return responseData;
  }
  
  function getTags(tags, selectedCategory) {
    if (!tags) {
      return selectedCategory || ""; // Return selectedCategory if tags is undefined or null
    }
    if (Array.isArray(tags)) {
      return tags.includes(selectedCategory)
        ? tags.join(",") // Join tags if selectedCategory already exists
        : `${selectedCategory},${tags.join(",")}`; // Prepend selectedCategory if it doesn't exist
    }
    return tags.includes(selectedCategory)
      ? String(tags) // Return tags as-is if selectedCategory already exists
      : `${selectedCategory},${String(tags)}`; // Prepend selectedCategory if it doesn't exist
  }
