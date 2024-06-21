const axios = require('axios');
const inventoryModel = require('../models/inventoryModel');

const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Hacer una solicitud HTTP para obtener la información de la orden desde Myshopping
    const orderResponse = await axios.get(`http://localhost:3000/api/orders/${orderId}`);
    const order = orderResponse.data;
    const { customer_data, product_id, quantity, product_image } = order;

    // Obtener el nombre del producto desde la tabla de inventario
    inventoryModel.getProductById(product_id, (err, product) => {
      if (err || !product) {
        return res.status(500).json({ error: 'Error fetching product data' });
      }

      const invoice = {
        customer_data,
        product_image,
        quantity,
        orden: orderId,
        product_name: product.product_name
      };

      inventoryModel.createInvoice(invoice, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error creating invoice' });
        res.status(201).json({ message: 'Invoice created successfully', invoiceId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generating invoice' });
  }
};

const getAllInvoices = (req, res) => {
  inventoryModel.getAllInvoices((err, invoices) => {
    if (err) return res.status(500).json({ error: 'Error fetching invoices' });
    res.status(200).json(invoices);
  });
};

module.exports = {
  generateInvoice,
  getAllInvoices,
};
