const router = require('express').Router();
const Images = require('../models/images-upload');
const fs = require('fs');
const { multi_file } = require('../middleware/upload');

/* получить все файлы
======================================================================================= */
router.route('/').get(async (req, res) => {
  const files = await Images.find().sort({ _id: -1 });
  return res.json(files);
});

/* добавить файлы
======================================================================================= */
router.route('/').post(multi_file, async (req, res) => {
  const images = req.files.map(field => {
    return {
      path: `${field.destination}/${field.filename}`,
      type: field.mimetype,
      size: field.size
    };
  });

  await Images.insertMany(images).then(data => {
    return res.json({ success: true, data });
  }).catch(error => {
    return res.json({ success: false });
  });
});

/* удалить файл
======================================================================================= */
router.route('/:id').delete(async (req, res) => {
  console.log(req.params.id)
  // await Images.findOneAndDelete({ _id: req.params.id }).then(file => {
  //   fs.unlink(file.path, error => {
  //     if (!error) {
  //       return res.json('файл удален');
  //     } else {
  //       return res.json(error);
  //     }
  //   });
  // });
});

/* изменить alt
======================================================================================= */
router.route('/:id').put(async (req, res) => {
  await Images.findByIdAndUpdate(req.params.id,
    { $set: { alt: req.body.alt } }
  ).then(() => {
    return res.json({ success: true });
  }).catch(err => {
    return res.status(404).json({ sucess: false });
  });
});

module.exports = router;
