const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path:'./.env'})

const userRoutes = require('./routes/userroutes/userRoutes')
const productRoutes = require('./routes/productroutes/productRoutes')


const app = express()

app.use(express.json())
app.use(cors())

//use route files
app.use(userRoutes)
app.use(productRoutes)


const DB = process.env.DB
const PORT = process.env.PORT

//database connection
const connectDB = async() => {
    try {
        const connection = await mongoose.connect(DB)
        console.log('Database connected');
    } catch(error){
        console.error(error.message);
        
    }
}

connectDB()

app.get('/',(req,res)=>{
    res.send('Express app is running')
})

//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage
})

//upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success: true,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})


app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`);
})

