const { Readable } = require('stream');
const csvParser = require('csv-parser');
const inventoryModel = require('../models/inventoryModel');

const getProducts = (req, res) => {
  inventoryModel.getAllProducts((err, products) => {
    if (err) return res.status(500).json({ error: 'Error fetching products' });
    res.status(200).json(products);
  });
};

const getProductById = (req, res) => {
    const { productId } = req.params;
    inventoryModel.getProductById(productId, (err, product) => {
      if (err) return res.status(500).json({ error: 'Error fetching product' });
      res.status(200).json(product);
    });
  };

const uploadCsvData = (req, res) => {
  const { csvData } = req.body;

  if (!csvData) {
    return res.status(400).json({ error: 'No CSV data provided' });
  }

  const results = [];
  const stream = Readable.from(csvData);

  stream
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const item of results) {
          const { PRODUCT_ID, QUANTITY } = item;

          await new Promise((resolve, reject) => {
            inventoryModel.getProductById(PRODUCT_ID, (err, product) => {
              if (err) return reject(err);

              if (product) {
                const newStock = product.stock - QUANTITY;

                inventoryModel.updateStock(PRODUCT_ID, newStock, (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                });
              } else {
                reject(new Error(`Product with ID ${PRODUCT_ID} not found`));
              }
            });
          });
        }
        res.status(200).json({ message: 'Inventory updated successfully' });
      } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ error: 'Error updating inventory' });
      }
    });
};

module.exports = {
  getProducts,
  uploadCsvData,
  getProductById
};
