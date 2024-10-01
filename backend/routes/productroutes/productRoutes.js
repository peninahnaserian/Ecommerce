const express = require('express')
const router = express.Router()
const Product = require('../../models/product')
const Users = require('../../models/user')
const jwt = require('jsonwebtoken')

//creating a product
router.post('/addproduct',async(req,res)=>{
    
    const {name, image, category, new_price, old_price} = req.body

    let products = await Product.find({})
    let id

    if(products.length>0){
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id + 1
    }else {
        id = 1
    }

    const product = new Product({
        id,
        name,
        image,
        category,
        new_price,
        old_price
    })

    await product.save()
    res.json({
        success: true,
        name
    })
    
})

//deleting products
router.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    res.json({
        success: true,
        name: req.body.name
    })
    
})

//getting all products
router.get('/allproducts',async(req, res)=>{
    let products = await Product.find({})
    res.send(products)
    
})

//new collection data endpoint
router.get('/newcollections',async(req,res)=>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8) //get the recently added products
    res.send(newcollection)
    
})

//popular in women endpoint
router.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category: 'women'})
    let popular_in_women = products.slice(0,4)
    res.send(popular_in_women)
    
})

//middleware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token')
    if (!token){
        res.status(401).send({errors: 'Please authenticate'})
    } else {
        try{
            const data = jwt.verify(token,'secret_ecom')
            req.user = data.user
            next()
        } catch (error){
            res.status(401).send({error:'Please authenticate using a valid token'})
        }
    }
}

//adding products in cartData
router.post('/addtocart',fetchUser,async(req,res)=>{
    let itemId = Number(req.body.itemId)
    
    let userData = await Users.findOne({_id:req.user.id})
        userData.cartData[itemId] += 1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send({message:"Added"})
})

//remove product in carData
router.post('/removefromcart',fetchUser,async(req,res)=>{
    let itemId = Number(req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id})
    if(userData.cartData[itemId] > 0){
        userData.cartData[req.body.itemId] -= 1
        await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
        res.send({message:"Removed"})
    }else{
        res.send({message:'Product quantity is 0'})
    }
})

//get cart data
router.post('/getcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id})
    
    res.json(userData.cartData)
})

module.exports = router