// Requiring module

require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const multer = require("multer");

const app = express();
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "main",
    format: async (req, file) => "png", 
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const upload = multer({ storage });

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath: path of image which was just
  // uploaded to "uploads" folder

  return cloudinary.uploader
    .upload(locaFilePath)
    .then((result) => {


      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {


      return { error };
    });
}

const uploadMultiple = (fileKey) => {
  return function (req, res, next) {
    const uploadItem = upload.any(fileKey);
    uploadItem(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(501).send(err.message);
      } else if (err) {
        return res.status(502).send(err.message);
      }

      next();
    });
  };
};

module.exports = { uploadMultiple, uploadToCloudinary };
