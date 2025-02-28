const mongoose = require("mongoose");

const StoreProfileSchema = new mongoose.Schema({
  shop_name: { type: String, required: true },
  store_description: { type: String, required: true },
  store_email: { type: String, required: true },
  store_contact: { type: String, required: true },
  store_domain: { type: String, required: true },
  store_facbookId: { type: String, required: true },
  store_InstaId: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  country: { type: String },
  brand_image_url: { type: String },
  brand_logo: { type: String },
  total_products: { type: Number },
  timings: {
    Monday: {
      open: { type: String },
      close: { type: String },
    },
    Tuesday: {
      open: { type: String },
      close: { type: String },
    },
    Wednesday: {
      open: { type: String },
      close: { type: String },
    },
    Thursday: {
      open: { type: String },
      close: { type: String },
    },
    Friday: {
      open: { type: String },
      close: { type: String },
    },
    Saturday: {
      open: { type: String },
      close: { type: String },
    },
    Sunday: {
      open: { type: String },
      close: { type: String },
    },
  }
}, { timestamps: true });

exports.StoreProfileSchema = StoreProfileSchema;