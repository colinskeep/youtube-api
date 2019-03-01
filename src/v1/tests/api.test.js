const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../../api.js');

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/v1/health/check', () => {
    it('should return OK', (done) => {
      request(app)
          .get('/api/v1/health/check/')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.text).to.equal('OK');
            done();
          })
          .catch(done);
    });
  });
});
