const helperUtils = require("../utils/helper");
const { ERROR_MSG } = require("../utils/const");
const db = require("../utils/mongooseMethods");
const models = require("../utils/modelName");


exports.installAppDataList = async (req, res) => {
    try {
        // Query the MongoDB collection to get install app data
        const installAppData = await db.find({
          collection: models.InstallApp,
          query: {} // You can specify additional query parameters here if needed
        });
        // Send the install app data as a response
        res.json(installAppData);
      } catch (error) {
        // Handle errors
        console.error("Error fetching install app data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}