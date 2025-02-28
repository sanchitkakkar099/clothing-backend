const router = require("express").Router();
const multer = require("multer");
const db = require("../utils/mongooseMethods");
const dbModels = require("../utils/modelName");
// const upload = require("../middleware/multer");
const path = require("path")
const HelperUtils = require("../utils/helper")
const { ERROR_MSG } = require("../utils/const")
const uploadFileToS3 = require("../middleware/multer")

const upload = multer({ storage: multer.memoryStorage() });
// const multer = require('multer')
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

/**
 * Upload Single File for System
 * @route POST /uploads
 * @consumes multipart/form-data
 * @param {file} file.formData
 * @param {number} type.query.required - file type
 *
 *  1:course,
 *  2: client,
 *  3: gallery,
 *  4: blog
 *  5: center
 *  6:course category
 *  99: default
 * @group FileUpload - File Upload operation
 * @returns {object} 200 - file path object
 * @returns {Error}  Error - Unexpected error
 */
// router.post("/", s3uploadad.single('file'), async (req, res) => {
//     try {
//         console.log("-------------", req.file)
//         // req.file.filepath = req.file.path.replace(/\\/g, '/')
//         // req.file.filepath = path.join(__dirname, "../../", req.file.filepath)
//         req.file.filepath = req.file.location
//         req.file.originalname = req.file.originalname
//         req.file.mimetype = req.file.mimetype
//         req.file.size = req.file.size

//         let file = await db.insertOne({
//             collection: dbModels.FileUpload,
//             document: req.file
//         })
//         res.send(HelperUtils.success("Successfully uploaded file", file));
//         return;

//     } catch (error) {
//         res.send(HelperUtils.error(ERROR_MSG, error.message));
//         return;
//     }

// })
/**
 * get the file data by ID
 * @route GET /uploads/{id}
 * @param {string} id.path.required - Admin Id
 * @group FileUpload - File Upload operation
 * @returns {object} 200 - file path object
 * @returns {Error}  Error - Unexpected error
 */
router.get("/:id", async (req, res) => {
    try {
        let file = await db.findOne({
            collection: dbModels.FileUpload,
            query: { _id: req.params.id }
        })
        res.send(HelperUtils.success("Successfully", file));
        return;
    } catch (error) {
        res.send(HelperUtils.error(ERROR_MSG, error.message));
        return;
    }
})


/**
 * Upload Single File for System
 * @route POST /uploads
 * @consumes multipart/form-data
 * @param {file} file.formData
 * @param {number} type.query.required - file type
 *
 *  1:course,
 *  2: client,
 *  3: gallery,
 *  4: blog
 *  5: center
 *  6:course category
 *  99: default
 * @group FileUpload - File Upload operation
 * @returns {object} 200 - file path object
 * @returns {Error}  Error - Unexpected error
 */
router.post("/", upload.single('file'), async (req, res) => {
    try {
        console.log("req?.body",req?.body);
        if (!req?.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
    
        console.log("Received file:", req?.file);
    
        const fileUrl = await uploadFileToS3(req?.file, req.body?.shop_name, req?.body?.image_type);

        const resObj = {
            fileUrl,
            image_type: req?.body?.image_type
        }
    
        res.send(HelperUtils.success("File uploaded successfully", resObj));
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    //     req.file.filepath = req.file.path.replace(/\\/g, '/')
    //     // req.file.filepath = path.join(__dirname, "../../", req.file.filepath)
    //     // req.file.filepath = req.file.location
    //    // req.file.filepath = 'http://' + process.env.HOST + "/" + req.file.filepath
    //     req.file.filepath = "http://localhost:5055/" + req.file.filepath
    //     req.file.originalname = req.file.originalname
    //     req.file.mimetype = req.file.mimetype
    //     req.file.size = req.file.size

    //     let file = await db.insertOne({
    //         collection: dbModels.FileUpload,
    //         document: req.file
    //     })
    //     res.send(HelperUtils.success("Successfully uploaded file", file));
    //     return;

    // } catch (error) {
    //     res.send(HelperUtils.error(ERROR_MSG, error.message));
    //     return;
    // }

})

router.post("/test/test", async (req, res) => {
    try {

        console.log("------------")
        let files = await db.find({
            collection: dbModels.FileUpload,
            query: {}
        })

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            var replacedURL = file.filepath.replace(/http:\/\/([^\/]+)\/uploads/, "https://admin.ducatindia.com/uploads");
            await db.updateOne({
                collection: dbModels.FileUpload,
                query: { _id: file._id },
                update: { filepath: replacedURL }
            })
        }
        res.send(files)
    } catch (error) {
        res.send(HelperUtils.error(ERROR_MSG, error.message));
        return;
    }
})

module.exports = router