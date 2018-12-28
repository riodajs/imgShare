const { randomNumber } = require('../helpers/lib');
const path = require('path');
const fs = require('fs-extra');
const { Image, Comment } = require('../models');
const md5 = require('md5');
const ctrl = {};

ctrl.index = async (req, res) => {
    const viewModel = { image: {}, comments: {}};
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
    if (image) {
        image.views += 1;
        viewModel.image = image;
        await image.save();
        const comments = await Comment.find({ image_id: image._id });
        viewModel.comments = comments;
        res.render('image', viewModel);
    }else{
        res.redirect('/');
    }

};

ctrl.create = (req, res) => {
    const saveImg = async () => {
        const imgUrl = randomNumber();
        const images = Image.find({ filename: imgUrl });
        if (images.length > 0) {
            saveImg();
        } else {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const imageTempPath = req.file.path;
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
            console.log(req.file);
            if (ext === '.jpg' || ext === '.png' || ext === '.svg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImage = new Image({
                    title: req.body.title,
                    description: req.body.description,
                    filename: imgUrl + ext
                });
                const imageSaved = await newImage.save();
                res.redirect('/images/' + imgUrl);
            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only images are allowed' });
            }
        }
    }

    saveImg();
}

ctrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(image){
        image.likes += 1;
        await image.save();
        res.json({like: image.likes});
    } else{
        res.status(500).json({error: 'Internal Error'});
    }
};

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
    if (image) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);
    }else{
        res.redirect('/');
    }
};

ctrl.remove = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image){
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
        await Comment.deleteOne({image_id: image._id});
        await image.remove();
        res.json(true);
    }
    console.log(req.params.image_id);
};

module.exports = ctrl;