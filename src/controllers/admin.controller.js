const HelperUtils = require("../utils/helper")

const db = require("../utils/mongooseMethods")
const dbModels = require("../utils/modelName")
const constants = require("../utils/const")
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createAdmin = async (req, res) => {
    try {
        let checkemailvalid = await db.findOne({
            collection: dbModels.User,
            query: { 
                email: req.body.email.toLowerCase(),
                storename:req?.body?.storename,
             }
        })
        if (checkemailvalid) return HelperUtils.errorRes(res, `Email with store name ${checkemailvalid?.storename} Already Exists`, {}, 400);
        const salt = await bycrypt.genSalt(10);
        req.body.password = await bycrypt.hash(req.body.password, salt)
        req.body.email = req.body.email.toLowerCase()
        let admin = await db.insertOne({
            collection: dbModels.User,
            document: req.body
        })
        res.send(HelperUtils.success("Account Created Successfully",{admin}));
        return;
    } catch (error) {
        HelperUtils.errorRes(res, "Internal Server Error", {}, 400)
        return
    }
}


exports.adminlogin = async (req, res) => {
    try {
        let emailvalid = await db.findOne({
            collection: dbModels.User,
            query: { email: req?.body?.email.toLowerCase(),storename:req?.body?.storename.trim(),isdel:false},
            project: { email: 1, lname: 1, password:1 ,fname: 1,role: 1, storename: 1, appInfoSubmitted: 1, isAppapproved: 1, isAppinstall: 1}
        })
        if (!emailvalid) return HelperUtils.errorRes(res, `Email with store name ${req?.body?.storename.trim()} not found`, {})
        let passwordvalid = await HelperUtils.bycryptpassverify(req.body.password, emailvalid.password)
        if (!passwordvalid) return HelperUtils.errorRes(res, "Invalid password", {},)
        let token = await HelperUtils.jwtSign(emailvalid);
        delete emailvalid.password
        let { password, ...userDetails } = emailvalid;
        res.send(HelperUtils.success("Successfully login", { token, ...userDetails }))
        return;
    } catch (error) {
        console.log(error)
        HelperUtils.errorRes(res, "internal Server Error", error.message, 400);
        return
    }
}

exports.VendorLogin = async (req, res) => {
    try {
        let staff = await db.findOne({
            collection: dbModels.User,
            query: { _id: req.body.staffById},
            project: { email: 1, lname: 1, fname: 1, password: 1, role: 1 }
        })
        let token = await HelperUtils.jwtSign(staff);
        delete staff.password
        res.send(HelperUtils.success("Successfully login", { token, ...staff }))
        return;
    } catch (error) {
        console.log(error)
        HelperUtils.errorRes(res, "internal Server Error", error.message, 400);
        return
    }
}   