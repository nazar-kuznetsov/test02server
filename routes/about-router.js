const router = require('express').Router();
const About = require('../models/about');

/* получить все файлы
======================================================================================= */
router.route('/:id').get(async (req, res) => {
    const files = await About.findOne({ locale: req.params.id });
    return res.json(files);
});


module.exports = router;
