import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import fs from 'fs';






export const sendImageToCloudinary = async (imageName: string, path: string): Promise<Record<string, unknown>> => {
    try {
        cloudinary.config({
            cloud_name: config.cloudinary_cloud_name,
            api_key: config.cloudinary_api_key,
            api_secret: config.cloudinary_api_secret
        });

        // Upload image
        const uploadResult = await cloudinary.uploader.upload(path, {
            public_id: imageName,
        });

        console.log('Cloudinary Upload Result:', uploadResult);

        // Delete local file after successful upload
        fs.unlink(path, (error) => {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted successfully:', path);
            }
        });

        return uploadResult.secure_url; // Return the secure URL
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })