import {v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const Uploadoncloudinary  = async (filepath) => {
    try{
        if ( !filepath ) {
            console.log("File path not found. It is required"); 
            return null;
        }

        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        }) 
        fs.unlinkSync(filepath);
        console.log("cloudinary file upload result", result);
        return result;
    } 
    catch(error){
        fs.unlinkSync(filepath);
        console.log("cloudinary file upload error", error);
        return null;
    }
}

const deletingfilefromcloudinary = async (publicId) => {
    try {
        if ( !publicId ) {
            console.log("Public ID is required to delete a file from Cloudinary");
            return null;
        }
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
        console.log("cloudinary file deletion result", result);
        
    }
    catch(error) {
        console.log("cloudinary file deletion error", error);
    }
}

export {
 Uploadoncloudinary,
 deletingfilefromcloudinary
};