// const multer = require('multer')
// const path = require('path')
// const { FileDirectoryType, AllowedFileType } = require('../utils/const')

// const storageData = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (
//             req.query.type &&
//             FileDirectoryType[req.query.type]
//         ) {
//             cb(null, './uploads' + FileDirectoryType[req.query.type])
//         } else {
//             cb('Invalid file type', null)
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
//     }
// })

// const uploadad = multer({ storage: storageData })

// module.exports = uploadad
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadFileToS3 = async (file, shop_name,image_type) => {
    console.log("file in multer",file);
    console.log("shopname",shop_name);
    try {
      console.log("Initializing S3 Client...");
      
      const s3 = new S3Client({
        region: process.env.DO_SPACES_REGION,
        endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
        credentials: {
          accessKeyId: process.env.DO_SPACES_KEY,
          secretAccessKey: process.env.DO_SPACES_SECRET
        }
      });
  
      console.log("S3 Client Initialized");
  
      // Sanitize shop name
      const sanitizedShopName = shop_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 15);
      const fileExtension = file?.originalname.split('.').pop();
      const fileKey = `${image_type}/${sanitizedShopName}_${timestamp}.${fileExtension}`;
  
      console.log("File Key Generated:", fileKey);
  
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype
      };
  
      console.log("Uploading file to S3 with params:", params);
  
      await s3.send(new PutObjectCommand(params));
  
      const fileUrl = `https://${process.env.SPACE_NAME}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${fileKey}`;
      
      console.log("File uploaded successfully to:", fileUrl);
      
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Error uploading file to S3");
    }
  };
  
  module.exports = uploadFileToS3;