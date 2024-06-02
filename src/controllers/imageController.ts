import { File } from "../database/models/File";
import { ImageService } from "../services/ImageService"
import { AppDataSource } from "../database/data-source";
export class ImageController {
    static async uploadFile(req: any, res: any) {
        try {
            const url = await ImageService.uploadFile(req);

            if (!req.file || typeof req.file.originalname !== 'string') {
                throw new Error('Invalid file data');
            }

            // Tạo một bản ghi mới của entity File
            const fileRepository = AppDataSource.getRepository(File);
            const newFile = new File();
            newFile.filename = req.file.originalname;
            newFile.filetype = req.file.mimetype as string;
            newFile.user = req?.user;
            // Kiểm tra đường dẫn có tồn tại và có phải kiểu string không
            if (typeof url !== 'string') {
                throw new Error('Invalid file path');
            }
            newFile.filepath = url;

            // Lưu bản ghi mới vào cơ sở dữ liệu
            await fileRepository.save(newFile);

            // Trả về phản hồi
            return res.status(200).json({ message: "Upload file thành công", filePath: url.replace('/public', '') })
        } catch (error: any) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ message: "Lỗi khi upload file", error: error });
        }
    }
}
