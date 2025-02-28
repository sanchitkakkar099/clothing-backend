const HelperUtils = require("../utils/helper");
const axios = require("axios");
const {accessToken} = require("../utils/getAccessToken");
const { productsCheckParent } = require("../utils/productsCheck");
exports.productsByTitle  = async(req, res) => {
    try{
        console.log("req.body",req?.body);
        const storeDomain = req?.body?.storeDomain?.toLowerCase();
        const productTitle = req?.body?.search;
        console.log("Store Domain:", storeDomain);
        const Token = await accessToken(storeDomain);
        console.log("Token in getproductBy Title",Token);
        const url = `https://${storeDomain}/admin/api/2024-01/products.json?title=${productTitle}`;
        const config = {
            headers: {
              "X-Shopify-Access-Token": Token, // Access Token from your database
              "Content-Type": "application/json",
            },
          };

          console.log("url",url);
          const response = await axios.get(url, config);

          const productsByTitle = response?.data?.products;
          const updatedProducts = await productsCheckParent(productsByTitle);
          if (!updatedProducts) {
            return HelperUtils.errorRes(
              res,
              "Failed to fetch products from Shopify",
              {},
              500
            );
          }
          res.status(200).send({
            message: "Product By Title fetched successfully",
            updatedProducts,
          });
    }catch(error){
        console.error("Error in storeInfoList:", error);
        HelperUtils.errorRes(res, "Internal Server Error", {}, 500);
    }
}