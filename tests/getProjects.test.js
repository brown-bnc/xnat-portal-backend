const fetch = require('jest-fetch-mock')

/* eslint-env jest */
jest.setMock('node-fetch', fetch)
const getProjects = require('../xnat-apis/getProjects')

describe('get-projects', () => {
  test('getProjects()', async () => {
    const projects = { ResultSet: { Result: [{ pi_firstname: '', secondary_ID: 'XYZS', pi_lastname: '', name: 'XYZ', description: '', ID: 'XYZ', URI: '/data/projects/XYZ' }], totalRecords: '1' } }
    fetch.mockResponse(JSON.stringify(projects))

    const current = await getProjects('dummyJessionId')

    expect(current).toEqual(projects)
  })
})
