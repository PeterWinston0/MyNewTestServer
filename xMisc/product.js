const router = require("express").Router();
const product = require("../models/product");
const { verifyToken } = require("../validation");


// CRUD operations

// Create product (post)
router.post("/", verifyToken, (req, res) => {
//router.post("/", (req, res) => {
    data = req.body;
    product.insertMany( data )
    .then(data => { res.status(201).send(data) })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});

// Read all products (get)
router.get("/", (req, res) => {   
    product.find()
    .then(data => { 
        res.send(mapArray(data)) 
    })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});


//Read all products in stock (get)
router.get("/instock/:status", (request, response) => {   
    product.find({ inStock: request.params.status})
    .then(data => { response.send(mapArray(data)) })
    .catch (err => { 
        response.status(500).send( { message: err.message } )
    })
});


// GET products/price/lt/1000
router.get("/price/:operator/:price",(req, res) => {

    const operator = req.params.operator;
    const price = req.params.price;

    if (operator != "gt" && operator != "lt")
        res.status(400).send({ message: "Wrong operator input" })
    else
    {
        let filterExpression;

        if (operator == "lt") //less than
        {
            filterExpression = { $lte: price }
        }
        else if (operator == "gt") {
            filterExpression = { $gte: price }
        }

        product.find({ price: filterExpression })
            .then(data => { 
                res
                .status(200)
                .send(mapArray(data))
            })
            .catch(err => {
                res
                .status(500)
                .send({ message: err.message })
            })
    }
});


//Read all documents based on variable field and value
router.get("/:field/:value", (request, response) => {   
    
    const field = request.params.field;
    const value = request.params.value;
    
    product.find({ [field]: { $regex: request.params.value, $options:'i' } })
    .then (data => { response.send(data) })  
    .catch (err => { 
        response.status(500).send( { message: err.message } )
    })
});


//Read random document
router.get("/random", (request, response) => {   
    // Get number of all documents in collection
    product.countDocuments({})
    .then(count => {

        // Get a random number
        let random = Math.floor(Math.random() * count);
        
        // Query all documents, but skip (fetch) only one with the offset of "random"
        product.findOne().skip(random)
        .then(data => { response.send(data) })  
        .catch (err => { 
            response.status(500).send( { message: err.message } )
        })
    })   
});

//Read specific product based on id (get)
router.get("/:id", (req, res) => {   
    product.findById(req.params.id)
    .then(data => { res.send(mapData(data)) })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});
// Test the route ordering...



// Update specific product (put)
router.put("/:id", verifyToken, (req, res) => {   
    
    const id = req.params.id;
    product.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if (!data) {
            res.status(404).send({message: "Cannot update product with id=" + id + ". Maybe the product was not found!"});
        }
        else {
            res.send({ message: "Product was successfully updated."});
        }
    })
    .catch (err => { 
        res.status(500).send( { message: "Error updating product with id=" + id } )
    })
});

// Delete specific product (delete)
router.delete("/:id", verifyToken, (req, res) => {   
    
    const id = req.params.id;
    product.findByIdAndDelete(id)
    .then(data => { 
        if (!data) {
            res.status(404).send({message: "Cannot delete product with id=" + id + ". Maybe the product was not found!"});
        }
        else {
            res.send({ message: "Product was successfully deleted."});
        }
    })
    .catch (err => { 
        res.status(500).send( { message: "Error deleting product with id=" + id } )
    })
});

function mapArray(inputArray) {

    // do something with inputArray
    let outputArray = inputArray.map(element => (        
        mapData(element)        
    ));

    return outputArray;
}

function mapData(element) {
    let outputObj = {
        id: element._id,
        name: element.name,
        description: element.description,
        price: element.price,
        inStock: element.inStock,

        // add uri (HATEOAS) for this specific resource
        uri: "/api/products/" + element._id
    }

    return outputObj;
} 

module.exports = router;