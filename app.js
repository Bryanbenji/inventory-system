const express = require('express');
const cors = require('cors');
const app = express();
const inventoryRoutes = require('./routes/inventoryRoutes');

app.use(cors());
app.use(express.json());
app.use('/api', inventoryRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
