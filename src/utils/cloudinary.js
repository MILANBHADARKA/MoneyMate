import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath);
        if(!localFilePath) return null

        //upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        //file has been upload succesfully
        console.log("file is uploaded on cloudinary", response);
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath)    //remove the loaclly saved tamparry file as the upload operation failed
    }
}

export { uploadOnCloudinary }
