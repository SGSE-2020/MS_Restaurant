const path = require('path')
const mali = require('mali')
const express = require('express')
const mongo = require('mongodb')
const grpc_module = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const cookieParser = require('cookie-parser')

const REST_PORT = 8080
const GRPC_PORT = 50051
const DB_URL = 'mongodb://localhost'

const DB_RESTAURANTS = 'restaurants'

const USER_PROTO = path.resolve(__dirname, './proto/user.proto')
const USER_PACKAGE_DEFINITION = protoLoader.loadSync(
    USER_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const USR_PCKG_DEF_OBJ = grpc_module.loadPackageDefinition(USER_PACKAGE_DEFINITION)
const user_route = USR_PCKG_DEF_OBJ.user

const BANK_PROTO = path.resolve(__dirname, './proto/account.proto')
const BANK_PACKAGE_DEFINITION = protoLoader.loadSync(
    BANK_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const BANK_PCKG_DEF_OBJ = grpc_module.loadPackageDefinition(BANK_PACKAGE_DEFINITION)
const account_route = BANK_PCKG_DEF_OBJ.account

const PARKING_PROTO = path.resolve(__dirname, './proto/parkplatz.proto')
const PARKING_PACKAGE_DEFINITION = protoLoader.loadSync(
    PARKING_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const PARKING_PCKG_DEF_OBJ = grpc_module.loadPackageDefinition(PARKING_PACKAGE_DEFINITION)
const parking_route = PARKING_PCKG_DEF_OBJ.parkplatz

const grpc = new mali(path.resolve(__dirname, './proto/restaurants.proto'), 'AppointmentCollision')
const rest = express()
const mongo_client = mongo.MongoClient;

function mongo_connect(res, callback) {
    mongo_client.connect(DB_URL, (err, db) => {
        if (err) {
            res.status(500).send({'error': err})
            console.error(err)
        }
        else {
            callback(err, db.db('ms-restaurants'))
            db.close()
        }
    })
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

rest.use(cookieParser())

rest.use(express.json())

rest.use((req, res, next) => {
    if (req.hostname == 'localhost') {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    }
    next()
})

rest.use('/restaurant', (req, res, next) => {
    if (res.cookies && res.cookies.uid) {
        res.status(400).send({'error': 'uid cookie not allowed'})
    } else {
        if (req.originalUrl.endsWith('/menu') || req.originalUrl.split('/').length == 3) {
            next()
        } else if (req.hostname == 'localhost') {
            req.cookies.uid = "TBOsX50VgedWgaAtNUc1Ic1CXGH2"
            next()
        } else {
            user_token = {
                token: req.cookies.token
            }
            conn = new user_route.UserService('ms-buergerbuero:50051', grpc_module.credentials.createInsecure())
            conn.verifyUser(user_token, (err, feature) => {
                if (err) {
                    res.status(401).send({'error': err})
                } else {
                    if (feature.uid && feature.uid != "") {
                        req.cookies.uid = feature.uid
                        next()
                    } else {
                        res.status(401).send({'error': 'Benutzerverifizierung fehlgeschlagen'})
                    }
                }
            })
        }
    }
})

rest.use('/restaurants', (req, res, next) => {
    if (res.cookies && res.cookies.uid) {
        res.status(400).send({'error': 'uid cookie not allowed'})
    } else {
        if (req.originalUrl == '/restaurants/isowner') {
            if (req.hostname == 'localhost') {
                req.cookies.uid = "TBOsX50VgedWgaAtNUc1Ic1CXGH2"
                next()
            } else {
                user_token = {
                    token: req.cookies.token
                }
                conn = new user_route.UserService('ms-buergerbuero:50051', grpc_module.credentials.createInsecure())
                conn.verifyUser(user_token, (err, feature) => {
                    if (err) {
                        res.status(401).send({'error': err})
                    } else {
                        if (feature.uid && feature.uid != "") {
                            req.cookies.uid = feature.uid
                            next()
                        } else {
                            res.status(401).send({'error': 'Benutzerverifizierung fehlgeschlagen'})
                        }
                    }
                })
            }
        } else {
            next()
        }
    }
})

rest.use('/restaurant/admin', (req, res, next) => {
    if (res.cookies && res.cookies.restaurant_id) {
        res.status(400).send({'error': 'restaurant_id cookie not allowed'})
    } else {
        next()
    }
})

rest.get('/restaurants', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).find({}).toArray((err, result) => {
            var result_list = []
            for(var i of result) {
                result_list.push({'restaurantID': i.restaurantID, 'logo': i.logo, 'name': i.name, 'description': i.description})
            }
            res.send(result_list)
        })
    })
})

rest.get('/db', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).find({}).toArray((err, result) => {
            res.send(result)
        })
    })
})

rest.delete('/removedb', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).remove()
        res.send()
    })
})

rest.get('/restaurant/:id', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).findOne({restaurantID: req.params.id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' not found'})
            } else {
                delete result.orders
                delete result.tables
                delete result.menu
                delete result._id
                res.send(result)
            }
        })
    })
})

rest.get('/restaurant/:id/menu', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).findOne({restaurantID: req.params.id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' not found'})
            } else {
                res.send(result.menu)
            }
        })
    })
})

rest.post('/restaurant/:id/order', (req, res) => {
    let price = 0
    for (var dish of req.body.orders) {
        price += dish.price
    }
    conn = new account_route.AccountService('ms-bank:50051', grpc_module.credentials.createInsecure())
    user_id = {
        user_id: req.cookies.uid
    }
    conn.getIban(user_id, (err, feature) => {
        if (err) {
            res.status(401).send({'error': err})
        } else {
            mongo_connect(res, (err, db) => {
                db.collection(DB_RESTAURANTS).findOne({restaurantID: req.params.id}, (err, result) => {
                    if (err || result == null) {
                        res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' not found'})
                    } else {
                        owner_id = {
                            user_id: result.owner
                        }
                        conn.getIban(owner_id, (err, feature_owner) => {
                            if (err) {
                                res.status(400).send({'error': err})
                            } else {
                                transfer_data = {
                                    user_id: req.cookies.uid,
                                    iban: feature.iban,
                                    purpose: 'Bezahlung der Restaurantbestellung',
                                    dest_iban: feature_owner.iban,
                                    amount: price.toFixed(2)
                                }
                                conn.transfer(transfer_data, (err, feature_transfer) => {
                                    if (err) {
                                        res.status(400).send({'error': err})
                                    } else {
                                        if (feature_transfer.status == '200') {
                                            order_data = req.body
                                            order_data.id = uuidv4()
                                            order_data.uid = req.cookies.uid
                                            mongo_connect(res, (err, db) => {
                                                db.collection(DB_RESTAURANTS).updateOne(
                                                    {
                                                        restaurantID: req.params.id
                                                    },
                                                    {
                                                        $addToSet: {
                                                            'orders': order_data
                                                        }
                                                    }
                                                )
                                                res.send({status: 'ok', price: price})
                                            })
                                        } else {
                                            res.status(400).send({'error': 'Money transfer failed on the banks side.', 'msg': feature_transfer, 'transfer_data': transfer_data, 'owner_data': owner_id})
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    })
})

rest.post('/restaurant/:id/reservate', (req, res) => {
    console.log(req.body)
    if (req.body.person_count <= 0 || !req.body.date || req.body.date == '' || !req.body.time || !req.body.time.includes(':')) {
        res.status(400).send({'error': 'Invalid information'})
    } else {
        mongo_connect(res, (err, db) => {
            db.collection(DB_RESTAURANTS).findOne({restaurantID: req.params.id}, (err, result) => {
                if (err || result == null) {
                    res.status(404).send({'error': 'Restaurant with id ' + req.params.id + ' does not have a table with size ' + req.body.person_count})
                } else {
                    var size_count = 0
                    for (var table of result.tables) {
                        if (table.size >= req.body.person_count) {
                            size_count += table.count
                        }
                    }
                    var occupied = 0
                    for (var reservation of result.reservations) {
                        if (reservation.person_count >= req.body.person_count) {
                            if (reservation.date == req.body.date) {
                                var hour = req.body.time.split(':')[0]
                                if (reservation.time.startsWith(hour)
                                || reservation.time.startsWith((parseInt(hour) + 1).toString())
                                || reservation.time.startsWith((parseInt(hour) + 2).toString())) {
                                    occupied += 1
                                }
                            }
                        }
                    }
                    if (occupied < size_count) {
                        if (req.body.reservate_parking) {
                            reservation_request = {
                                areaId: result.parking_id,
                                userId: req.cookies.uid,
                                startDateTime: (new Date(req.body.date + 'T' + req.body.time + ':00').getTime() - (2*60*60*1000)) / 1000,
                                endDateTime: new Date(req.body.date + 'T' + req.body.time + ':00').getTime() / 1000 // Adding 2 hours
                            }
                            conn = new parking_route.Parkplatz('ms-parkplatz:50051', grpc_module.credentials.createInsecure())
                            conn.reservation(reservation_request, (err, feature) => {
                                if (err || !feature.reservationId || feature.reservationId == '') {
                                    if (err) {
                                        res.status(400).send({'error': err})
                                    } else {
                                        res.status(400).send({'error': feature})
                                    }
                                } else {
                                    mongo_connect(res, (err, db) => {
                                        new_reservation = req.body
                                        new_reservation.id = uuidv4()
                                        new_reservation.uid = req.cookies.uid
                                        new_reservation.parkingID = feature.reservationId
                                        db.collection(DB_RESTAURANTS).updateOne(
                                            {
                                                restaurantID: req.params.id
                                            },
                                            {
                                                $addToSet:{'reservations': new_reservation}
                                            }
                                        )
                                        res.send({'status': 'ok'})
                                    })
                                }
                            })
                        } else {
                            mongo_connect(res, (err, db) => {
                                new_reservation = req.body
                                new_reservation.id = uuidv4()
                                new_reservation.uid = req.cookies.uid
                                new_reservation.parkingID = ""
                                db.collection(DB_RESTAURANTS).updateOne(
                                    {
                                        restaurantID: req.params.id
                                    },
                                    {
                                        $addToSet:{'reservations': new_reservation}
                                    }
                                )
                                res.send({'status': 'ok'})
                            })
                        }
                    } else {
                        res.send({'error': 'Alle möglichen Tische sind bereits belegt'})
                    }
                }
            })
        })
    }
})

rest.get('/restaurants/isowner', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).findOne({owner: req.cookies.uid}, (err, result) => {
            if (err) {
                res.status(404).send({'error': 'Unable to check the possession of a restaurant'})
            } else if (result == null) {
                res.send({'owner': false})
            } else {
                res.send({'owner': true})
            }
        })
    })
})

rest.post('/restaurant/create', (req, res) => {

})

rest.put('/restaurant/admin/update', (req, res) => {

})

rest.post('/restaurant/admin/menu/item', (req, res) => {

})

rest.put('/restaurant/admin/menu/item', (req, res) => {
    
})

rest.delete('/restaurant/admin/menu/item', (req, res) => {
    
})

rest.get('/restaurant/admin/orders', (req, res) => {
    
})

rest.put('/restaurant/admin/order/:id/accept', (req, res) => {
    
})

rest.put('/restaurant/admin/order/:id/finish', (req, res) => {
    
})

rest.post('/restaurant/admin/publish_deal', (req, res) => {
    
})

rest.get('/setupDB', (req, res) => {
    restaurant = {
        "restaurantID": "45f2xh-d46v421-2an3fz",
        "owner": "TBOsX5OVgedWgaAtNUc1Ic1CXGH2",
        "logo": "",
        "name": "Pizzeria Bolognese",
        "parking_id": "4cf079cd-907a-4885-ada7-314d4fa19945",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est.",
        "ordersAllowed": true,
        "reservationsAllowed": true,
        "orders": [
            {
                "customerID": "123456789-abcdefgh",
                "dishes": [
                    {
                    'id': '2',
                    'name': 'Pizza Salami',
                    'price': 9.95,
                    'count': 2
                    }
                ]
            }
        ],
        "tables": [
            {
                "size": 4,
                "count": 1
            },
            {
                "size": 2,
                "count": 2
            }
        ],
        "reservations": [

        ],
        "openingHours": [
            {
                "from": "12:00",
                "to": "21:00"
            },
            {
                "from": "12:00",
                "to": "21:00"
            },
            {
                "from": "12:00",
                "to": "21:00"
            },
            {
                "from": "12:00",
                "to": "21:00"
            },
            {
                "from": "12:00",
                "to": "21:00"
            },
            {
                "from": "15:00",
                "to": "24:00"
            },
            {
                "from": "15:00",
                "to": "24:00"
            }
        ],
        "menu": [
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
                        'id': '11',
                        'name': 'Pizza Gyros',
                        'priceL': 11.95,
                        'priceXL': 14.95,
                        'description': 'Mit Tomate, Käse und Gyros'
                    }
                ]
            }
        ]
    }
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).insertOne(restaurant, (err, db_res) => {
            if (err) {
                res.status(500).send({'error': err})
            } else {
                res.send()
            }
        })
    })
})

rest.get('/health', (req, res) => {
    res.send({'health': 'ok'})
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

module.exports = rest
