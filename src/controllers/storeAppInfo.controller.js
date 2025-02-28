const HelperUtils = require("../utils/helper");
const db = require("../utils/mongooseMethods");
const dbModels = require("../utils/modelName");
const { fetchproductsController } = require("./products.controller");
const {fetchProductCount} = require("./products.controller");
const {fetchOrdersController} = require("../utils/vendorOrders");
const {accessToken} = require("../utils/getAccessToken");

exports.createStoreAppInfo = async (req, res) => {
  try {
    const storename = req?.body?.storeDomain.toLowerCase().trim();
    // Check if storeDomain already exists in the database
    let existingStore = await db.findOne({
      collection: dbModels.StoreAppInfo,
      query: {
        storeDomain: storename,
      },
    });

    if (existingStore) {
      return HelperUtils.errorRes(
        res,
        `Store App Info ${existingStore?.storeDomain} already exists.`,
        {},
        400
      );
    }

    // Prepare the data for saving
    req.body.storeDomain = storename;
    req.body.apiKey = req?.body?.apiKey.trim();
    req.body.apiSecreatKey = req?.body?.apiSecreatKey.trim();
    req.body.accessToken = req?.body?.accessToken.trim();
    let storeAppInfo = await db.insertOne({
      collection: dbModels.StoreAppInfo,
      document: req.body,
    });

    let updateInfostatus = await db.updateOne({
      collection: dbModels.User,
      query: { storename: storename },
      update: { $set: { appInfoSubmitted: true } },
      options: { new: true },
    });

    // Respond with success
    res.send(
      HelperUtils.success("Successfully saved store app information", {
        storeAppInfo,
      })
    );
    return;
  } catch (error) {
    // Handle errors
    console.error("Error in createStoreAppInfo:", error);
    HelperUtils.errorRes(res, "Internal Server Error", {}, 500);
    return;
  }
};

exports.storeInfoList = async (req, res) => {
  try {
    // console.log("Request Body:", req?.body);

    // Extract storeDomain from the request body
    const storeDomain = req?.body?.storeDomain?.toLowerCase();
    console.log("Store Domain:", storeDomain);


    const Token = await accessToken(storeDomain);
    console.log("Token",Token);
    const {products, nextPage,prevPage,} = await fetchproductsController(storeDomain,Token,req?.body?.pageInfo );
    
    if (!products) {
      return HelperUtils.errorRes(
        res,
        "Failed to fetch products from Shopify",
        {},
        500
      );
    }

    res.status(200).send({
      message: "Products fetched successfully",
      products,
      nextPage,
      prevPage
    });
  } catch (error) {
    console.error("Error in storeInfoList:", error);
    HelperUtils.errorRes(res, "Internal Server Error", {}, 500);
  }
};


exports.storeProductCount = async (req,res) => {
  try{
    const storeDomain = req?.body?.storename?.toLowerCase();
    console.log("Store Domain:", storeDomain);

    if (!storeDomain) {
      return HelperUtils.errorRes(res, "Store domain is required", {}, 400);
    }

    // Find the store info from the database
    const storeInfo = await db.findOne({
      collection: dbModels.StoreAppInfo,
      query: { storeDomain },
    });

    // console.log("Store Info:", storeInfo);

    if (!storeInfo) {
      return HelperUtils.errorRes(
        res,
        `Store with domain ${storeDomain} not found`,
        {},
        404
      );
    }

    const accessToken = storeInfo?.accessToken;
    const {productCount} = await fetchProductCount(storeDomain, accessToken);
    if (!productCount) {
      return HelperUtils.errorRes(
        res,
        "Failed to fetch product count from Shopify",
        {},
        500
      );
    }

    res.status(200).send({
      message: "Product count fetched successfully",
      productCount,
    });
  }catch(error){
    res.status(500).json({ error: "Failed to fetch product count" });
  }
}


exports.storeOrders = async (req,res) => {
  try{
    const storeDomain = req?.body?.storename?.toLowerCase();
    console.log("Store Domain:", storeDomain);

    if (!storeDomain) {
      return HelperUtils.errorRes(res, "Store domain is required", {}, 400);
    }
 
    const shopNameBeforeDomain = storeDomain.split(".myshopify.com")[0].replace(/[^a-zA-Z0-9]/g, "");
    const response = await fetchOrdersController(shopNameBeforeDomain);
    const orderData = response?.orders;
    console.log("order response",response);
    if (!response.success) {
      return HelperUtils.errorRes(
        res,
        response?.message,
        {},
        400
      );
    }
    res.status(200).send({
      message: "Product count fetched successfully",
      orderData,
    });
  }catch(error){
    console.log("error",error);
    res.status(500).json({ error: "Failed to fetch Orders" });
  }
}


exports.StoreProfile = async(req,res) => {
   console.log("req body",req?.body);
  try {
    const storeProfile = {
      shop_name: req?.body?.shop_name,
      store_description: req?.body?.store_description,
      store_email: req?.body?.store_email,
      store_contact: req?.body?.store_contact,
      store_domain: req?.body?.store_domain, 
      store_facbookId: req?.body?.store_facbookId,
      store_InstaId: req?.body?.store_InstaId,
      address1: req?.body?.address1,        
      address2: req?.body?.address2,        
      city: req?.body?.city,               
      country: req?.body?.country,
      brand_image_url: req?.body?.brandImage,
      brand_logo: req?.body?.brandLogo,     
      total_products: req?.body?.total_products, 
      timings: req?.body?.timings, 
    };


    const SavestoreData = await db.insertOne({
      collection : dbModels.StoreProfile,
      document:storeProfile,
   });
    console.log("SavestoreData",SavestoreData);
    res.send(HelperUtils.success("Store profile saved successfully!",SavestoreData));
  } catch (error) {
    console.log("error",error);
    HelperUtils.errorRes(res, "Error saving store profile", error);
  }
}