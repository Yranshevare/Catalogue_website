import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



  // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRETE 
});


const uploadOnCloudinary = async (localFilePath:any) => {       //where tho store the file in server
    // console.log("into Uploading cloudinary")
    // console.log(localFilePath)
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"        //cloudinary will decide what file has been pass to it
        })
        //file uploaded successfully
        // console.log("file is uploaded in cloudinary",response.url)
        fs.unlinkSync(localFilePath)
        // console.log("file is uploaded successfully")
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)        //remove the locally save temp file 
        return null
    }
}

export {uploadOnCloudinary}