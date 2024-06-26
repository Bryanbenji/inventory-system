const db = require('../db/config');

const getAllProducts = (callback) => {
  const query = 'SELECT * FROM inventory';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getProductById = (product_id, callback) => {
  const query = 'SELECT * FROM inventory WHERE product_id = ?';
  db.query(query, [product_id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const updateStock = (product_id, newStock, callback) => {
  const query = 'UPDATE inventory SET stock = ? WHERE product_id = ?';
  db.query(query, [newStock, product_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const updateOrCreateInventory = (item, callback) => {
  const query = `
    INSERT INTO inventory (product_id, product_name, stock) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    product_name = VALUES(product_name),
    stock = VALUES(stock)
  `;
  const values = [item.product_id, item.product_name, item.stock];
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const createInvoice = (invoice, callback) => {
  const query = 'INSERT INTO invoices (customer_data, product_image, quantity, orden, product_name) VALUES (?, ?, ?, ?, ?)';
  const values = [invoice.customer_data, invoice.product_image, invoice.quantity, invoice.orden, invoice.product_name];
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const getAllInvoices = (callback) => {
  const query = 'SELECT * FROM invoices';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getInvoiceByOrderId = (order_id, callback) => {
  const query = 'SELECT * FROM invoices WHERE orden = ?';
  db.query(query, [order_id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  updateStock,
  updateOrCreateInventory,
  createInvoice,
  getAllInvoices,
  getInvoiceByOrderId,
};
