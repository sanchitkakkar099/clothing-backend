const fetch = require("node-fetch");
const API_PASSWORD = process.env.APIPASSWORD;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const API_VERSION = process.env.API_VERSION;

const fetchOrdersController = async (shopNameBeforeDomain) => {
  try {
    // Construct the URL for fetching orders
    const url = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/orders.json`;

    // Set up the authentication headers
    const authHeader = {
      'X-Shopify-Access-Token': API_PASSWORD
    };

    // Make the GET request to fetch orders
    const response = await fetch(url, {
      method: 'GET',
      headers: authHeader
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      const errorInfo = await response.json();
      console.error('Failed to fetch orders:', errorInfo);
      return {
        success: false,
        message: `API Error: ${response.status} ${response.statusText}`,
        error: errorInfo
      };
    }

    // Extract orders from the response data
    const responseData = await response.json();
    const orders = responseData.orders;

    // Filter the orders based on the shop name
    const filteredOrders = filterVendor(orders, shopNameBeforeDomain);

    if (filteredOrders.length === 0) {
      return {
        success: false,
        message: "No orders found for the current vendor products",
        orders: []
      };
    }

    // Return the filtered orders
    return {
      success: true,
      message: "Orders fetched successfully",
      orders: filteredOrders
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: "An error occurred while fetching orders",
      error: error.message
    };
  }
};

// Function to filter orders based on the current shop name
const filterVendor = (orders, shopNameBeforeDomain) => {
  console.log("shopNameBeforeDomain:", shopNameBeforeDomain);

  const filteredOrders = orders
    ?.map((order) => {
      const filteredLineItems = order?.line_items.filter((item) => {
        const cleanedVendorName = item?.vendor.replace(/[^a-zA-Z0-9]/g, "");
        return cleanedVendorName.toLowerCase() === shopNameBeforeDomain.toLowerCase();
      });

      if (filteredLineItems.length > 0) {
        return {
          ...order,
          line_items: filteredLineItems,
        };
      }
      return null;
    })
    .filter((order) => order !== null); // Remove orders with no matching line items

  console.log("filteredOrders:", filteredOrders);
  return filteredOrders;
};

module.exports = {
  fetchOrdersController
};
