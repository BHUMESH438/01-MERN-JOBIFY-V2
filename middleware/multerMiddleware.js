import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); //file path
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName); // file name
  }
});
const upload = multer({ storage });
export default upload;
