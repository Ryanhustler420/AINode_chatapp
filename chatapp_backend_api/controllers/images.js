const cloudinary = require ('cloudinary');
const httpStatus = require ('http-status-codes');

const User = require ('../models/userModal');

cloudinary.config ({
  cloud_name: 'dcalvdelc',
  api_key: '376372284163297',
  api_secret: 'i1E9ZLJVEnQguz9UdhRj7VUmVuY',
});

module.exports = {
  UploadImage (req, res) {
    // console.log (req.body);
    cloudinary.uploader.upload (
      req.body.image,
      async result => {
        console.log (result);

        await User.update (
          {
            _id: req.user._id,
          },
          {
            $push: {
              images: {
                imageId: result.public_id,
                imageVersion: result.version,
              },
            },
          }
        )
          .then (() => {
            res
              .status (httpStatus.OK)
              .json ({message: 'Image uploaded successfully'});
          })
          .catch (err => {
            res
              .status (httpStatus.INTERNAL_SERVER_ERROR)
              .json ({message: 'Error occured'});
          });
      },
      {
        folder: 'Chatapp-nodejs-ng',
        use_filename: true,
      }
    );
  },
  async SetDefaultImage (req, res) {
    const {imageId, imageVersion} = req.body;

    await User.update (
      {
        _id: req.user._id,
      },
      {
        picId: imageId,
        picVersion: imageVersion,
      }
    )
      .then (() => {
        res
          .status (httpStatus.OK)
          .json ({message: 'Default Image Successfully Set'});
      })
      .catch (err => {
        res
          .status (httpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'});
      });
  },
};
