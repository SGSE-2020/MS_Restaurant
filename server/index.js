const path = require('path')
const mali = require('mali')
const express = require('express')
const mongo = require('mongodb')

const REST_PORT = 8081
const GRPC_PORT = 50051
const DB_URL = 'mongodb://' + process.env.DATABASE_USERNAME + ':' + process.env.DATABASE_PASSWORD + '@'
               + process.env.DATABASE_HOSTNAME + ':' + process.env.DATABASE_PORT + '/' + process.env.DATABASE_NAME

const grpc = new mali(path.resolve(__dirname, './proto/restaurants.proto'), 'RestaurantsService')
const rest = express()
const mongo_client = mongo.MongoClient;

function mongo_connect(res, callback) {
    mongo_client.connect(DB_URL, (err, db) => {
        if (err) {
            res.status(500).send({'error': 'Unable to connect to database.'})
            console.error(err)
        }
        else {
            callback(err, db.db(process.env.DATABASE_NAME))
            db.close()
        }
    })
}

rest.use(express.json())

rest.get('/restaurants', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection('restaurants').find({}).toArray((err, result) => {
            res.send(result)
        })
    })
})

rest.get('/restaurant/:id', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection('restaurants').findOne({id: req.params.id}).toArray((err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' not found'})
            } else {
                res.send(result)
            }
        })
    })
})

rest.get('/restaurant/:id/menu', (req, res) => {

})

function main() {
    grpc.start('0.0.0.0:' + GRPC_PORT)
    rest.listen(REST_PORT, () => {
        console.log('Rest Server started on port ' + REST_PORT)
    })
    console.log(DB_URL)
}

main()
