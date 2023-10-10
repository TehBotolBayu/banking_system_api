const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./router')
// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient();

app.use(express.json())
app.use('/api/v1', router)

// app.get('/', (req, res) => {
//     console.log('tes');
//     return res.json({
//         message: "Hello World"
//     })
// })

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})