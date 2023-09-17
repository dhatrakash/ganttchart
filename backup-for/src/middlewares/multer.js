const multer = require('multer');

// multer storage and upload setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
}).fields([
  { name: 'machinePhoto', maxCount: 1 },
  { name: 'controllerPhoto', maxCount: 1 },
]);

module.exports = upload;
