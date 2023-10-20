const express = require('express');
const cors =  require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./router');
const swaggerjsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerJson = require('./openapi.json');

app.use(express.json());
app.use(cors())
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerJson))
app.use('/api/v1', router);

app.get('*', (req, res) => {
    return res.status(400).json({
        message: "Not Found"
    })
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})