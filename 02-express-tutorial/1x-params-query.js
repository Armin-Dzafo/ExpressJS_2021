const express = require('express')
const server = express()
const {products} = require('./data')

server.get('/',(req,res)=>{
    // res.json(products)
    const newProducts = products.map((product)=>{
        const {id, name, image} = product
        return {id, name, image}
    })
    res.json(newProducts)
})

server.get('/api/products/:productID',(req,res)=>{
    // console.log(req)
    const {productID} = req.params
    //console.log(productID)
    const singleProduct = products.find(
        (product) => product.id === Number(productID)
    )
    if(!singleProduct){
        return res.status(404).send('Product does not exist')
    }
    res.json(singleProduct)
})

server.listen(5000, ()=>{
    console.log('server listening on port 5000...');
})