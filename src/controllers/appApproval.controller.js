const HelperUtils = require("../utils/helper")
const db = require("../utils/mongooseMethods")
const dbModels = require("../utils/modelName")

exports.fetchapprovalrequest = async (req, res) => {
    try {
      const users = await db.find({
        collection: dbModels.User,
        query: { isact: true, isAppinstall: true, role: "Vendor" },
        project: { _id:0,storename:1,email: 1, isAppapproved: 1, isAppinstall: 1 },
      });
  
      if (users.length === 0) {
        return res.status(404).send(HelperUtils.error("No users found", {}));
      }
  
      res.status(200).send(HelperUtils.success("Successfully fetched users",users ));
      console.log("users", users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send(HelperUtils.error("Server error", { details: error.message }));
    }
  };

  exports.updateApproval = async (req, res) => {
    try {
      console.log("req body",req?.body);
      const { email, isAppapproved,shopname } = req.body;
      console.log("email,isAppapproved",email,isAppapproved);
      if (!email) {
        return res.status(400).send(HelperUtils.error("Email and isAppapproved fields are required", {}));
      }
  
      const user = await db.findOne({
        collection: dbModels.User,
        query: { email: email.toLowerCase() },
      });
  
      if (!user) {
        return res.status(404).send(HelperUtils.error("User not found", {}));
      }
  
      const Approvalupdated = await db.updateOne({
        collection: dbModels.User,
        query: { email: email.toLowerCase(),storename:shopname},
        update: { $set: { isAppapproved:isAppapproved} },
        options: { new: true },
      });
  
      res.status(200).send(HelperUtils.success("Successfully updated approval status", Approvalupdated));
      console.log("Updated user", Approvalupdated);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send(HelperUtils.error("Server error", { details: error.message }));
    }
  };