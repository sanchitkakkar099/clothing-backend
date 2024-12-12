const HelperUtils = require("../utils/helper");
const axios = require("axios");
const {productsCheckParent} = require("../utils/productsCheck")
const fetchproductsController = async (storeDomain, accessToken, req, res) => {
  try {
    // console.log("product function called",storeDomain,accessToken);
    // Shopify API endpoint to fetch products
    const shopifyEndpoint = `https://${storeDomain}/admin/api/2024-01/products.json`;
    const shopifyCountEndpoint = `https://${storeDomain}/admin/api/2024-01/products/count.json`;
    // Axios configuration for Shopify API call
    const config = {
      headers: {
        "X-Shopify-Access-Token": accessToken, // Access Token from your database
        "Content-Type": "application/json",
      },
    };

    // Make the API call using axios
    const response = await axios.get(shopifyEndpoint, config);
    // console.log("response data",response?.data);
    // Extract products from the API response
    const products = response?.data?.products;
    const updatedProducts = await productsCheckParent(products);
    const countResponse = await axios.get(shopifyCountEndpoint, config);
    const productCount = countResponse?.data?.count;
    console.log("updatedProducts and  productCount",updatedProducts,productCount);
    if (!products) {
      return HelperUtils.errorRes(res,"Failed to fetch products from Shopify",{},500);
    }
    return {
        products: updatedProducts,
        productCount,
      };
  } catch (error) {
    // Handle errors
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

module.exports = { fetchproductsController };
