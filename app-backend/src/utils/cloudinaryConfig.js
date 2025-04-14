const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if (!localFilePath) return null;

        //ulpoad the file to cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // console.log("File is uploaded to cloudinary", result);
        fs.unlinkSync(localFilePath) //delete the temp file
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath) //delete the temp file
        return error;
    }
}


module.exports = uploadOnCloudinary