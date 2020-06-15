const app = require('../index')
const request = require('supertest')

it('Test if it is possible to access the backend', async done => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    done()
})