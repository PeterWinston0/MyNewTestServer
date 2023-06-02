const router = require("express").Router();
const project = require("../models/project");
const { verifyToken } = require("../validation");


// CRUD operations

// Create project (post)
router.post("/", verifyToken, (req, res) => {
//router.post("/", (req, res) => {
    data = req.body;
    project.insertMany( data )
    .then(data => { res.status(201).send(data) })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});

// Read all projects (get)
router.get("/", (req, res) => {   
  project.find()
    .then(data => { 
        res.send(mapArray(data)) 
    })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});

//Read all documents based on variable field and value
router.get("/:field/:value", (request, response) => {   
    
  const field = request.params.field;
  const value = request.params.value;
  
  project.find({ [field]: { $regex: request.params.value, $options:'i' } })
  .then (data => { response.send(data) })  
  .catch (err => { 
      response.status(500).send( { message: err.message } )
  })
});

//Read specific project based on id (get)
router.get("/:id", (req, res) => {   
  project.findById(req.params.id)
    .then(data => { res.send(mapData(data)) })
    .catch (err => { 
        res.status(500).send( { message: err.message } )
    })
});
// Test the route ordering...


// Update specific project (put)
router.put("/:id", verifyToken, (req, res) => {   
    
    const id = req.params.id;
    project.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if (!data) {
            res.status(404).send({message: "Cannot update project with id=" + id + ". Maybe the project was not found!"});
        }
        else {
            res.send({ message: "Project was successfully updated."});
        }
    })
    .catch (err => { 
        res.status(500).send( { message: "Error updating project with id=" + id } )
    })
});

// Delete specific product (delete)
router.delete("/:id", verifyToken, (req, res) => {   
    
    const id = req.params.id;
    project.findByIdAndDelete(id)
    .then(data => { 
        if (!data) {
            res.status(404).send({message: "Cannot delete project with id=" + id + ". Maybe the project was not found!"});
        }
        else {
            res.send({ message: "Project was successfully deleted."});
        }
    })
    .catch (err => { 
        res.status(500).send( { message: "Error deleting project with id=" + id } )
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
        title: element.title,
        description: element.description,

        // add uri (HATEOAS) for this specific resource
        uri: "/api/project/" + element._id
    }

    return outputObj;
} 




module.exports = router;