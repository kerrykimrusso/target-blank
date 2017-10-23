const factory = require('./factory');
const utils = require('../utils.js');
const yahooStrategy = require('../strategies/yahoo')(utils, 'yahoo.com');
const googleStrategy = require('../strategies/google')(utils, 'google.com');
const githubStrategy = require('../strategies/github')(utils, 'github.com');
const facebookStrategy = require('../strategies/facebook')(utils, 'facebook.com');
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
      it('should return true if url starts with http(s)*://www.google.com/url?', () => {
        anchor.setAttribute('href', 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=12&cad=rja&uact=8&ved=0ahUKEwiCnKHHl_vWAhUFySYKHVlPAwoQFgiPATAL&url=http%3A%2F%2Fwww.nbcsports.com%2Fphiladelphia%2Fflyers&usg=AOvVaw1I9rW2y-rz3zMuAgNxH0Gu');
        expect(googleStrategy.shouldTreatAsAbsolute(anchor)).to.be.true;
      })

      it('should return false if url does not start with http(s)*://www.google.com/url?', () => {
        anchor.setAttribute('href', 'https://www.nhl.com/');
        expect(googleStrategy.shouldTreatAsAbsolute(anchor)).to.be.false;
      })
    })
  });

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
  });

  describe('facebook', () => {
    const anchor = factory.anchor();

    describe('#shouldIgnore', () => {
      it('should return true for a link to a facebook message', () => {
        anchor.setAttribute('href', 'https://www.facebook.com/messages/t/323234')
        expect(facebookStrategy.shouldIgnore(anchor)).to.be.true;
      });
    })
    describe('#shouldTreatAsRelative', () => {
      it('should return false', () => {
        expect(facebookStrategy.shouldTreatAsRelative()).to.be.false;
      })
    })
    describe('#shouldTreatAsAbsolute', () => {

      it('should return false', () => {
        expect(facebookStrategy.shouldTreatAsAbsolute()).to.be.false;
      })
    })
  });
});
