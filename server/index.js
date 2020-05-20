const path = require('path')
const mali = require('mali')
const express = require('express')

const REST_PORT = 8081

function main() {
    const grpc = new mali(path.resolve(__dirname, './proto/restaurants.proto'), 'RestaurantsService')
    const rest = express()

    grpc.start('0.0.0.0:50051')
    rest.listen(REST_PORT, () => {
        console.log('Rest Server started on port ' + REST_PORT)
    })
}

main()
