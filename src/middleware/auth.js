const HelperUtils = require("../utils/helper");
exports.auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return (HelperUtils.errorRes(res, "Access Denied No Token Found", {}, 401));
        let payload = await HelperUtils.jwtVerify(token)
        if (!payload) return (HelperUtils.errorRes(res, "Invalid Auth token", {}, 401));
        req.user = payload
        next()
    } catch (error) {
        console.log(error);
        return HelperUtils.errorRes(res, "Invalid Token", {}, 401)
    }
}

exports.AdminAuth = async (req, res, next) => {
    try {

        const token = req.header("Authorization");
        if (!token) return (HelperUtils.errorRes(res, "Access Denied No Token Found", {}, 401));
        let payload = await HelperUtils.jwtVerify(token) 
        if (!payload) return (HelperUtils.errorRes(res, "Invalid Auth token", {}, 401));
        console.log("payload",payload)
        if (payload.role !== "Admin") return (HelperUtils.errorRes(res, "Access Denied"));
        req.user = payload
        next()
    } catch (error) {
        console.log(error);
        return HelperUtils.errorRes(res, "Invalid Token", {}, 401)
    }
}


exports.VendorAuth = async (req, res, next) => {
    try {

        const token = req.header("Authorization");
        if (!token) return (HelperUtils.errorRes(res, "Access Denied No Token Found", {}, 401));
        let payload = await HelperUtils.jwtVerify(token) 
        if (!payload) return (HelperUtils.errorRes(res, "Invalid Auth token", {}, 401));
        console.log("payload",payload)
        if (payload.role !== "Vendor") return (HelperUtils.errorRes(res, "Access Denied"));
        req.user = payload
        next()
    } catch (error) {
        console.log(error);
        return HelperUtils.errorRes(res, "Invalid Token", {}, 401)
    }
}