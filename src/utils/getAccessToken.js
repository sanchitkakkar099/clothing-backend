const db = require("./mongooseMethods")
const dbModels = require("./modelName")


const accessToken = async(storeDomain) => {
    try{
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
    console.log("accessToken",accessToken);
    return accessToken
    }catch(error){
        
    }
}

module.exports = {
    accessToken
  };
  