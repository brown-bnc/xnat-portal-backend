const request = require('supertest')
const fetch = require('jest-fetch-mock')

/* eslint-env jest */
jest.setMock('node-fetch', fetch)
const app = require('../app.js')

describe('Test Endpoint', () => {
  let server, agent
  jest.setTimeout(30000)

  beforeEach((done) => {
    server = app.listen(4002, (err) => {
      if (err) return done(err)

      agent = request.agent(server) // since the application is already listening, it should use the allocated port
      done()
    })
  })

  afterEach((done) => {
    return server && server.close(done)
  })

  test('description', async () => {
    const projects = { ResultSet: { Result: [{ pi_firstname: '', secondary_ID: 'XYZS', pi_lastname: '', name: 'XYZ', description: '', ID: 'XYZ', URI: '/data/projects/XYZ' }], totalRecords: '1' } }
    fetch.mockResponse(JSON.stringify(projects))

    // use agent instead of manually calling `request(app)` each time
    const res = await agent.get('/projects/xyz')
    expect(JSON.parse(res.text)).toEqual(projects)
  })
})
