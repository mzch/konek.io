const multer = require('multer');


const useInMemory = multer.memoryStorage();
const uploadInMemory = multer({useInMemory})



module.exports = uploadInMemory;