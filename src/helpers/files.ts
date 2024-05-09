import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
const allowedImage = ['.png', '.jpg', '.jpeg'];
const allowedFile = ['.pdf', '.csv'];
const baseURL = process.env.BASE_URL || `http://localhost:3000/`;
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const extname = path.extname(file.originalname).toLowerCase();

    if (allowedImage.includes(extname) || allowedFile.includes(extname)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = 'uploads/';
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        let uniqueID = uuidv4().substring(0, 8);
        let userId = req.params.id;
        let timestamp = new Date().valueOf();
        userId = userId.substring(0, userId.indexOf("-"));
        const fileName = `${userId}${timestamp}${uniqueID}${path.extname(file.originalname)}`;
        cb(null, fileName);
    },
});


const upload = multer({storage,fileFilter,limits: {
        fileSize: 1 * 1024 * 1024,
    },
});

async function deleteOldPhoto(oldPhotoUrl: string): Promise<void> {
    if (oldPhotoUrl) {
        const oldPhotoPath = path.join(__dirname, '../..', oldPhotoUrl.replace(baseURL, ''));
        if (fs.existsSync(oldPhotoPath)) {
            try {
                fs.unlinkSync(oldPhotoPath);
                console.log('Old photo deleted:', oldPhotoPath);
            } catch (error) {
                console.error(`Failed to delete old photo: ${error.message}`);
            }
        } else {
            console.log('Old photo file not found');
        }
    }
}

const validateUploadError = (err:any, req:any, res:any) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.error(`File too large: ${err.message}`);
            return res.status(413).json({ message: 'File too large. The maximum allowed file size is 5MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FIELD_COUNT') {
            console.log('Too many files uploaded');
            return res.status(400).json({ message: 'You can only upload one file at a time' });
        }
        console.error(`Unexpected error: ${err.message}`);
        return res.status(400).json({ message: err.message });
    }
    if (!req.files) {
        return res.status(404).json({ message: 'No file provided' });
    }
};


const validateFileType = (req:any, res:any, allowedImage:any) => {
    const file = req.files[0];
    const extname = path.extname(file.originalname).toLowerCase();
    if (!allowedImage.includes(extname)) {
        return res.status(400).json({ message: `File type not allowed: ${extname}` });
    }
    return null;
};

export { upload, deleteOldPhoto, validateUploadError,  validateFileType };
