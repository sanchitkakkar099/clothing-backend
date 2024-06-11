// webhookController.js
const nodemailer = require('nodemailer');

// Function to handle the product update webhook
const handleProductUpdate = async (req, res) => {
    const product = req.body;
    console.log("Product update webhook received:", product);

    // if (product.status === 'active' && product.published_at) {
    //     const vendor = await getVendorByProductId(product.id);
    //     if (vendor) {
    //         await notifyVendor(vendor, product);
    //     }
    // }

    res.sendStatus(200);
};

// Function to get vendor by product ID
const getVendorByProductId = async (productId) => {
    // Replace this with your actual logic to get vendor details
    return {
        email: 'vendor@example.com',
        name: 'Vendor Name'
    };
};

// Function to notify vendor
const notifyVendor = async (vendor, product) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: vendor.email,
        subject: 'Your Product is Now Active',
        text: `Hello ${vendor.name},\n\nYour product "${product.title}" is now active on the store.\n\nBest regards,\nYour Company`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent to vendor');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = {
    handleProductUpdate
};
