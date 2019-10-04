const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb(null, '../public/assets/upload');
    cb(null, './upload');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const single_file = upload.single('file');

const multi_file = upload.array('file', 10); // max multi file save once request

module.exports = {
  single_file,
  multi_file
};
