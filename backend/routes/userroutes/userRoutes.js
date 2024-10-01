const express = require('express')
const router = express.Router()
const Users = require('../../models/user')
const jwt = require('jsonwebtoken')

//registration endpoint
router.post('/signup',async(req,res)=>{
    let {name, email, password} = req.body

    let check = await Users.findOne({email:email}) //check if email was previously registered
    if (check){
        return res.status(400).json({
            success: false,
            errors: "existing user found with same email address"
        })
    }

    let cart = {}
    for (let index = 0; index < 300; index++) {
        cart[index] = 0        
    }

    const user = new Users({
        name,
        email,
        password,
        cartData: cart
    })

    await user.save()

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom')

    res.json({
        success: true,
        token
    })
})

//user login
router.post('/login',async(req,res)=> {
    let user = await Users.findOne({email:req.body.email})

    //check if user exists
    if (user) {
        const passCompare = req.body.password === user.password
        //confirm if the password is correct
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }

            const token = jwt.sign(data,'secret_ecom') //creating the jwt token
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                error: 'Incorrect password'
            })
        }
    } else {
        res.json({
            success: false,
            error: 'User does not exist confirm email'
        })
    }
})

module.exports = router