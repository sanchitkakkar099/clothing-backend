const HelperUtils = require("../utils/helper");
const db = require("../utils/mongooseMethods");
const dbModels = require("../utils/modelName");
const { fetchproductsController } = require("./products.controller");
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
    console.log("Request Body:", req?.body);

    // Extract storeDomain from the request body
    const storeDomain = req?.body?.storeDomain?.toLowerCase();
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

    const accessToken = storeInfo.accessToken;
    const {products,productCount} = await fetchproductsController(storeDomain, accessToken);
     console.log("productCount",productCount);
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
    });
  } catch (error) {
    console.error("Error in storeInfoList:", error);
    HelperUtils.errorRes(res, "Internal Server Error", {}, 500);
  }
};
