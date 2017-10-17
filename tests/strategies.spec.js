const factory = require('./factory');
const utils = require('../utils.js');
const yahooStrategy = require('../strategies/yahoo')(utils, 'yahoo.com');
const googleStrategy = require('../strategies/google')(utils, 'google.com');
const githubStrategy = require('../strategies/github')(utils, 'github.com');
const chai = require('chai');

const expect = chai.expect;

describe('Strategies', () => {
  describe('yahoo', () => {
    describe('#shouldIgnore', () => {
      it('should return false', () => {
        expect(yahooStrategy.shouldIgnore()).to.be.false;
      })
    })
    describe('#shouldTreatAsRelative', () => {
      const anchor = factory.anchor();

      it('should return true for subdomains', () => {
        anchor.setAttribute('origin', 'http://finance.yahoo.com');
        expect(yahooStrategy.shouldTreatAsRelative(anchor)).to.be.true;
      })
    })
    describe('#shouldTreatAsAbsolute', () => {
      it('should return false', () => {
        expect(yahooStrategy.shouldTreatAsAbsolute()).to.be.false;
      })
    })
  })

  describe('google', () => {
    const anchor = factory.anchor();

    describe('#shouldIgnore', () => {
      anchor.setAttribute('title', 'Google apps');

      it('should return true for link with apps in title', () => {
        expect(googleStrategy.shouldIgnore(anchor)).to.be.true;
      })

      anchor.setAttribute('title', 'Google Account');
      it('should return true for link with Account in title', () => {
        expect(googleStrategy.shouldIgnore(anchor)).to.be.true;
      })
    })
    describe('#shouldTreatAsRelative', () => {
      it('should return false', () => {
        expect(googleStrategy.shouldTreatAsRelative(anchor)).to.be.false;
      })
    })
    describe('#shouldTreatAsAbsolute', () => {
      it('should return false', () => {
        expect(googleStrategy.shouldTreatAsAbsolute()).to.be.false;
      })
    })
  })

  describe('github', () => {
    const anchor = factory.anchor();

    describe('#shouldIgnore', () => {
      it('should return false', () => {
        expect(githubStrategy.shouldIgnore()).to.be.false;
      })
    })
    describe('#shouldTreatAsRelative', () => {
      it('should return false', () => {
        expect(githubStrategy.shouldTreatAsRelative(anchor)).to.be.false;
      })
    })
    describe('#shouldTreatAsAbsolute', () => {
      anchor.setAttribute('href', '/kerrykimrusso/target-blank/raw/master/.gitignore');

      it('should return true for links to containing raw', () => {
        expect(githubStrategy.shouldTreatAsAbsolute(anchor)).to.be.true;
      })
    })
  })
});