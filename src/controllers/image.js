const { randomNumber } = require('../helpers/lib');
const path = require('path');
const fs = require('fs-extra');
const { Image } = require('../models');

const ctrl = {};

ctrl.index = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    res.render('image', {image});
};

ctrl.create = (req, res) => {
    const saveImg = async () => {
        const imgUrl = randomNumber();
        const images = Image.find({filename: imgUrl});
        if(images.length > 0){
            saveImg();
        }else{
            const ext = path.extname(req.file.originalname).toLowerCase();
            const imageTempPath = req.file.path;
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
            console.log(req.file);
            if(ext === '.jpg' || ext === '.png' || ext === '.svg' || ext === '.jpeg' || ext === '.gif'){
                await fs.rename(imageTempPath, targetPath);
                const newImage = new Image({
                    title: req.body.title,
                    description: req.body.description,
                    filename: imgUrl + ext
                });
                const imageSaved = await newImage.save();
                res.redirect('/images/' + imgUrl);
            }else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error: 'Only images are allowed'});
            }
        }  
    }

    saveImg();
}

ctrl.like = (req, res) => {
};

ctrl.comment = (req, res) => {
};

ctrl.remove = (req, res) => {
};

module.exports = ctrl;