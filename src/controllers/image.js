const { randomNumber } = require('../helpers/lib');
const path = require('path');
const fs = require('fs-extra');
const ctrl = {};

ctrl.index = (req, res) => {
};

ctrl.create = async (req, res) => {
    const imgUrl = randomNumber();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const imageTempPath = req.file.path;
    const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
    console.log(req.file);
    if(ext === '.jpg' || ext === '.png' || ext === '.svg' || ext === '.jpeg' || ext === '.gif'){
        await fs.rename(imageTempPath, targetPath);
    }
    res.send('funciona');
};

ctrl.like = (req, res) => {
};

ctrl.comment = (req, res) => {
};

ctrl.remove = (req, res) => {
};

module.exports = ctrl;