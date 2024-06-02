import { upload } from "../utils/MulterConfig";
import multer from "multer";

export class ImageService {
    static async uploadFile(req: any) {
        return new Promise((resolve, reject) => {
            upload.single('image')(req, {} as any, function (err: any) {
                if (err instanceof multer.MulterError) {
                    console.log('ád11111111111111111111')
                    reject(err);
                } else if (err) {
                    console.log('ádsadddddddddddddddddddddddddđ')
                    reject(err);
                } else if (!req.file) {
                    console.log('áds2222222222222222ddddddddddddđ')
                    reject(new Error('No file uploaded'));
                } else {
                    const url = req.protocol + '://' + req.get('host') + '/public/uploads/' + req.file.filename;

                    resolve(url);
                }
            });
        });
    }
}