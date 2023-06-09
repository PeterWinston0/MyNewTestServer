process.env.NODE_ENV = 'test';

const Project = require('../models/project');
//const Product = require('../models/product');
const User = require('../models/user');


//clean up the database before and after each test
beforeEach((done) => { 
    Project.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    User.deleteMany({}, function(err) {});
    Project.deleteMany({}, function(err) {});
    done();
});

//clean up the database before and after each test
// beforeEach((done) => { 
//     Product.deleteMany({}, function(err) {});
//     User.deleteMany({}, function(err) {});
//     done();
// });

// afterEach((done) => {
//     User.deleteMany({}, function(err) {});
//     Product.deleteMany({}, function(err) {});
//     done();
// });