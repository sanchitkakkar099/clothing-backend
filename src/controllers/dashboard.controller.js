const HelperUtils = require("../utils/helper");
const db = require("../utils/mongooseMethods");
const dbModels = require("../utils/modelName");

exports.appStatus = async (req,res) => {
    try{
         const {isAppinstall,storename,isAppUpdate} = req?.body;
         console.log("isAppUpdate",isAppUpdate);
         if(!isAppUpdate){
         const user = await db.findOne({
            collection : dbModels.User,
            query : {storename : storename},
            project: { _id:0,storename:1,email:1,isAppapproved: 1,isAppinstall: 1 },
         })
         if (user.length === 0) {
            return res.status(404).send(HelperUtils.error(`App status not found for the store ${storename}`, {}));
          }
          res.status(200).send(HelperUtils.success("Successfully fetched User app status",user ));
          console.log("users", user);
        }else{
            console.log("isAppinstall",isAppinstall);
            const AppStatusupdated = await db.findOneAndUpdate({
                collection: dbModels.User,
                query: { storename:storename},
                update: { $set: { isAppinstall:isAppinstall} },
                project: { _id:0,storename:1,email:1,isAppapproved: 1,isAppinstall: 1 },
                options: { new: true },
              });
              res.status(200).send(HelperUtils.success("Successfully updated app status", AppStatusupdated));
              console.log("Updated user", AppStatusupdated);
          }
    }catch(error){
       console.log("error",error);
       res.status(500).send(HelperUtils.error("Server error", { details: error.message }));
    }
}
