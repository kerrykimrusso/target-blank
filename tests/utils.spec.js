const utils = require('../utils.js');
const chai = require('chai');

const expect = chai.expect;

describe('Test util functions', () => {
  it('#hasSameDomain', () => {
    expect(utils.hasSameDomain('http://google.com', 'http://drive.google.com')).to.be.true;
  });
});
