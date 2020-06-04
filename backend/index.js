const path = require('path')
const mali = require('mali')
const express = require('express')
const mongo = require('mongodb')

const REST_PORT = 8081
const GRPC_PORT = 50051
const DB_URL = 'mongodb://' + process.env.DATABASE_USERNAME + ':' + process.env.DATABASE_PASSWORD + '@'
               + process.env.DATABASE_HOSTNAME + ':' + process.env.DATABASE_PORT + '/' + process.env.DATABASE_NAME

const grpc = new mali(path.resolve(__dirname, './proto/restaurants.proto'), 'AppointmentCollision')
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

rest.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next()
})

rest.get('/restaurants', (req, res) => {
    /*mongo_connect(res, (err, db) => {
        db.collection('restaurants').find({}).toArray((err, result) => {
            res.send(result)
        })
    })*/
    res.send([
        {
            "restaurantID": "x1a35s-as3d31-b34s34",
            "logo": "",
            "name": "Restaurant Zum Schenkel",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "45f2xh-d46v421-2an3fz",
            "logo": "",
            "name": "Pizzeria Bolognese",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "jd42xh-124v64d-mu2s3k6",
            "logo": "",
            "name": "Tofu Restaurant",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "x1a35s-as3d31-b34s35",
            "logo": "",
            "name": "Restaurant Zum Schenkel",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "45f2xh-d46v421-2an3fa",
            "logo": "",
            "name": "Pizzeria Bolognese",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "jd42xh-124v64d-mu2s3k7",
            "logo": "",
            "name": "Tofu Restaurant",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "x1a35s-as3d31-b34s38",
            "logo": "",
            "name": "Restaurant Zum Schenkel",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "45f2xh-d46v421-2an3fh",
            "logo": "",
            "name": "Pizzeria Bolognese",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        },
        {
            "restaurantID": "jd42xh-124v64d-mu2s3k6",
            "logo": "",
            "name": "Tofu Restaurant",
            "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est."
        }
    ])
})

rest.get('/restaurant/:id', (req, res) => {
    /*mongo_connect(res, (err, db) => {
        db.collection('restaurants').findOne({id: req.params.id}).toArray((err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' not found'})
            } else {
                res.send(result)
            }
        })
    })*/
    res.send({
        "restaurantID": "45f2xh-d46v421-2an3fz",
        "logo": "",
        "name": "Pizzeria Bolognese",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est.",
        "ordersAllowed": true,
        "reservationsAllowed": true,
        "openingHours": [
            {
                "day": "Monday",
                "from": "12:00",
                "to": "21:00"
            },
            {
                "day": "Tuesday",
                "from": "12:00",
                "to": "21:00"
            },
            {
                "day": "Wednesday",
                "from": "12:00",
                "to": "21:00"
            },
            {
                "day": "Thursday",
                "from": "12:00",
                "to": "21:00"
            },
            {
                "day": "Friday",
                "from": "12:00",
                "to": "21:00"
            },
            {
                "day": "Saturday",
                "from": "15:00",
                "to": "24:00"
            },
            {
                "day": "Sunday",
                "from": "15:00",
                "to": "24:00"
            }
        ]
    })
})

rest.get('/restaurant/:id/menu', (req, res) => {
    res.send([
        {
            'name': "Getränke",
            'dishes': [
                {
                    'id': '1',
                    'name': 'Wasser',
                    'priceL': 2.95,
                    'priceXL': 3.95,
                    'description': 'Sprudelndes Quellwasser aus den Alpen.'
                },
                {
                    'id': '1a',
                    'name': 'Stilles Wasser',
                    'priceL': 1.95,
                    'priceXL': 2.95,
                    'description': 'Wasser aus dem Wasserhahn.'
                },
                {
                    'id': '2',
                    'name': 'Coca Cola',
                    'priceL': 4.95,
                    'priceXL': 5.95,
                    'description': ''
                },
                {
                    'id': '3',
                    'name': 'Bier',
                    'priceL': 5.95,
                    'priceXL': 7.95,
                    'description': 'Selbstgebrautes Bier aus dem Keller. Gekühlt.'
                }
            ]
        },
        {
            'name': "Salate",
            'dishes': [
                {
                    'id': '4',
                    'name': 'Salatauswahl',
                    'priceS': 4.95,
                    'priceL': 8.95,
                    'priceXL': 12.95,
                    'description': 'Lassen Sie sich überraschen mit einer Auswahl an feinsten Salaten.'
                },
                {
                    'id': '5',
                    'name': 'Kartoffelsalat',
                    'priceL': 6.95,
                    'description': 'Hausgemachter Kartoffelsalat vom Küchenchef.'
                }
            ]
        },
        {
            'name': "Pizza",
            'dishes': [
                {
                    'id': '6',
                    'name': 'Pizza Margherita',
                    'priceL': 7.95,
                    'priceXL': 9.95,
                    'description': 'Mit Tomate und Käse'
                },
                {
                    'id': '7',
                    'name': 'Pizza Salami',
                    'priceL': 9.95,
                    'priceXL': 11.95,
                    'description': 'Mit Tomate, Käse und Salami'
                },
                {
                    'id': '8',
                    'name': 'Pizza Prosciutto & Funghi',
                    'priceL': 10.95,
                    'priceXL': 12.95,
                    'description': 'Mit Tomate, Käse, Schinken und Champignons'
                },
                {
                    'id': '9',
                    'name': 'Pizza Tonno',
                    'priceL': 10.95,
                    'priceXL': 12.95,
                    'description': 'Mit Tomate, Käse, Thunfisch und Zwiebeln'
                },
                {
                    'id': '10',
                    'name': 'Pizza Calzone',
                    'priceL': 10.95,
                    'description': 'Mit Tomate, Käse, Salami, Schinken, Champignons und Paprika'
                },
                {
                    'id': '9',
                    'name': 'Pizza Gyros',
                    'priceL': 11.95,
                    'priceXL': 14.95,
                    'description': 'Mit Tomate, Käse und Gyros'
                }
            ]
        }
    ])
})

function hasAppointmentCollision(ctx) {
    ctx.res = {
        "hasCollision": true
    }
}

grpc.use({hasAppointmentCollision})

function main() {
    grpc.start('0.0.0.0:' + GRPC_PORT)
    rest.listen(REST_PORT, () => {
        console.log('Rest Server started on port ' + REST_PORT)
    })
    console.log(DB_URL)
}

main()
