const HelperUtils = require("../utils/helper");
const axios = require("axios");
const { productsCheckParent } = require("../utils/productsCheck");
const fetchproductsController = async (storeDomain, accessToken,pageinfo, req, res) => {
  console.log("accessToken",accessToken)
  try {
    console.log("pagePinfo",pageinfo)
    let url = `https://${storeDomain}/admin/api/2024-01/products.json?limit=50`;
    // Axios configuration for Shopify API call

    if (pageinfo) {
      url += `&page_info=${pageinfo}`; 
    }
    const config = {
      headers: {
        "X-Shopify-Access-Token": accessToken, // Access Token from your database
        "Content-Type": "application/json",
      },
    };

    // Make the API call using axios
    console.log("url",url);
    const response = await axios.get(url, config);
    // console.log("response data", response?.data);
    // console.log("response header", response?.headers);
    // Extract products from the API response
    const linkHeader = response.headers["link"];
    let nextPage = null;
    let prevPage = null;

    if (linkHeader) {
      const matchesNext = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      const matchesPrev = linkHeader.match(/<([^>]+)>;\s*rel="previous"/);
      nextPage = matchesNext
        ? new URL(matchesNext[1]).searchParams.get("page_info")
        : null;
      prevPage = matchesPrev
        ? new URL(matchesPrev[1]).searchParams.get("page_info")
        : null;
    }
    const products = response?.data?.products;
    const updatedProducts = await productsCheckParent(products);
    if (!products) {
      return HelperUtils.errorRes(
        res,
        "Failed to fetch products from Shopify",
        {},
        500
      );
    }
    return {
      products: updatedProducts,
      nextPage,
      prevPage,
    };
  } catch (error) {
    // Handle errors
    console.error("Error fetching products:", error);
    // res.status(500).json({ error: "Failed to fetch products" });
    return HelperUtils.errorRes(
      res,
      "Failed to fetch products from Shopify",
      {},
      500
    );
  }
};

const fetchProductCount = async (storeDomain, accessToken, req, res) => {
  try {
    const shopifyCountEndpoint = `https://${storeDomain}/admin/api/2024-01/products/count.json`;

    const config = {
      headers: {
        "X-Shopify-Access-Token": accessToken, // Access Token from your database
        "Content-Type": "application/json",
      },
    };

    const countResponse = await axios.get(shopifyCountEndpoint, config);
    const productCount = countResponse?.data?.count;

    return {
      productCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
};



module.exports = { fetchproductsController, fetchProductCount };
