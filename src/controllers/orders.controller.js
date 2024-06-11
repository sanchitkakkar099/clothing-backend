const axios = require('axios'); 
const API_KEY =process.env.APIKEY;
const API_PASSWORD =process.env.APIPASSWORD;
const SHOP_DOMAIN = 'parenttesting'; 
const API_VERSION = '2022-01'; // Adjust the API version as needed  
   
const fetchOrdersController = async (req, res) => {
  try {
    console.log("apikey",process.env.APIKEY);
    console.log("process.env.APIPASSWORD",process.env.APIPASSWORD);
    // Construct the URL for fetching orders
    const url = `https://${SHOP_DOMAIN}.myshopify.com/admin/api/${API_VERSION}/orders.json`;

    // Set up the authentication headers
    const authHeader = {
      Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_PASSWORD}`).toString('base64')}`,
    };

    // Make the GET request to fetch orders
    const response = await axios.get(url, { headers: authHeader });   

    // Extract orders from the response data
    const orders = response.data.orders;        

    // Send the orders as the response
    res.status(200).json({ orders });
  } catch (error) {
    // Handle errors
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

module.exports = { fetchOrdersController };
