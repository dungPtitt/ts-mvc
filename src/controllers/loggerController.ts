const path = require('path');
const fs = require('fs');

export class LoggerController {
    static async getAllFileInFolderLog(req: any, res: any) {
        try {
            //joining path of directory 
            let fileName = req.query.file;
            console.log("fileName", fileName);
            const directoryPath = path.resolve(__dirname, '..', 'log');
            // console.log("directoryPath", directoryPath)
            //passsing directoryPath and callback function
            let listLog:any = [];
            fs.readdir(directoryPath, function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                //listing all files using forEach
                
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    // console.log("file", file)
                    if(file.endsWith('.log')) {
                        listLog.push(file)
                    }
                });
                if(fileName) {
                    fs.readFile(`${directoryPath}/${fileName}`, 'utf8', (err, textContent) => {
                        if (err) {
                            console.error('Error reading text file:', err);
                            res.status(500).send('Error reading text file');
                            return;
                        }
                        // // Chia nội dung thành các phần có độ dài tối đa là 30 dòng mỗi phần
                        // const lines = textContent.split('\n');
                        // const totalPages = Math.ceil(lines.length / 30);

                        // // Lấy số trang được yêu cầu từ query string hoặc mặc định là trang đầu tiên
                        // const requestedPage = req.query.page ? parseInt(req.query.page) : 1;
                        // const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

                        // // Tính chỉ số bắt đầu và kết thúc của dòng cho trang hiện tại
                        // const startIndex = (currentPage - 1) * 30;
                        // const endIndex = startIndex + 30;
                        // const pageContent = lines.slice(startIndex, endIndex).join('\n');
                        
                        // Render template và truyền nội dung của file text
                        // res.render("logger.ejs", { data: listLog,  currentPage: currentPage, totalPages: totalPages, pageContent: pageContent});
                        res.render("logger.ejs", { data: listLog, pageContent: textContent });
                    });
                }else {
                    // res.render("logger.ejs", { data: listLog, pageContent: null, currentPage: null, totalPages: null});
                    res.render("logger.ejs", { data: listLog, pageContent: null });
                }
                // res.render("logger.ejs", { data: listLog, textContent: null });
            });
        } catch (error: any) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ message: "Lỗi khi upload file", error: error });
        }
    }
}
