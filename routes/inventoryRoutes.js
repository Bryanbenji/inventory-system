const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/products', inventoryController.getProducts); // Definir la ruta para obtener productos
router.post('/upload-csv-data', inventoryController.uploadCsvData);

module.exports = router;
