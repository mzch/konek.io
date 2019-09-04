const multer = require('multer');


const useInMemory = multer.memoryStorage();
const uploadInMemory = multer({
    useInMemory,
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    },
    limits: {
        fileSize: 50 * 1024 * 1024 
    }
})

const upload = uploadInMemory.single('sessionFile');

function uploadFile(req, res, next){
    return upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(501).json({message: 'Unable to process: File might be too large '})
          } else if (err) {
            return res.status(501).json({message: 'Unknown network error'})
          }
          
          next()
    })
}

module.exports = uploadFile;