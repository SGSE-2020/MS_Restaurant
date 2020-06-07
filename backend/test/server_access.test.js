const app = require('../index')
const request = require('supertest')

it('Test if it is possible to access the server', async done => {
    const response = await request(app).get('/restaurants')

    expect(response.status).toBe(200)
    done()
})