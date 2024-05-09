import { Connection } from "../models/database";
import path from 'path';
import { upload, deleteOldPhoto } from "../helpers/files";
const db = new Connection();
db.connect();

const baseURL = process.env.BASE_URL || `http://localhost:3000/`;
const allowedImage = ['.png', '.jpg', '.jpeg'];

async function photosProfil(req:any, res:any) {
    upload.array('files', 1)(req, res, async (err:any) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                console.log('File too large');
                return res.status(413).json({ message: 'File too large' });
            }
            return res.status(400).json({ message: err.message });
        }
        if (!req.files) {
            return res.status(404).json({ message: 'No file provided' });
        }
        const file = req.files[0];
        const extname = path.extname(file.originalname).toLowerCase();
        if (!allowedImage.includes(extname)) {
            return res.status(400).json({ message: `File type not allowed: ${extname}` });
        }
        try {
            const users:any = await db.getDataFiltered('users', { id: req.params.id }, 1);
            if (users.length > 0 && users[0].photos_url) {
                await deleteOldPhoto(users[0].photos_url);
            }
            const filePath = file.path;
            const fileName = path.basename(filePath);
            const imageUrl = `${baseURL}uploads/${fileName}`;
            await db.updateData('users', { id: req.params.id }, { photos_url: imageUrl });
            return res.status(200).json({ photos_url: imageUrl });
        } catch (error) {
            console.error(`Failed to process photo profile: ${error.message}`);
            return res.status(500).json({ message: `Internal server error: ${error.message}` });
        }
    });
}

async function deletePhotoProfil(req:any, res:any) {
    try {
        const result:any = await db.getDataFiltered('users', { id: req.params.id }, 1);
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result[0];
        await deleteOldPhoto(user.photos_url);
        await db.updateData('users', { id: req.params.id }, { photos_url: null });
        res.status(200).json({ message: 'Photo deleted and URL reset' });
    } catch (error) {
        console.log(`Failed to delete photo: ${error.message}`);
        res.status(500).json({ message: `Failed to delete photo: ${error.message}` });
    }
}


export { photosProfil, deletePhotoProfil };