const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

//disk storage setup

const storage = multer.diskStorage({
    //file path setup
    destination: function (req, file, cb) {        //cb = callback 
      cb(null, './public/images/uploads')
    },
    //file name setup
    filename: function (req, file, cb) {
      crypto.randomBytes(16, function (err, name) {
        const fn = name.toString('hex') + path.extname(file.originalname);
        cb(null,fn)
      })
    }
  })
  
  const upload = multer({ storage: storage })

//export upload variable

module.exports = upload;