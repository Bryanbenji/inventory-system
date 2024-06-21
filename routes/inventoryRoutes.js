const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const invoiceController = require('../controllers/invoiceController');

router.get('/products', inventoryController.getProducts);
router.get('/products/:productId', inventoryController.getProductById);
router.post('/upload-csv-data', inventoryController.uploadCsvData);

// Rutas para facturas
router.post('/invoices/:orderId', invoiceController.generateInvoice);
router.get('/invoices', invoiceController.getAllInvoices);

module.exports = router;
