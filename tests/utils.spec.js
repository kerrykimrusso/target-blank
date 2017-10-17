const utils = require('../utils.js');
const chai = require('chai');

const expect = chai.expect;

describe('Test util functions', () => {
  describe('#hasSameDomain', () => {
    it('matches a domain with subdomain', () => {
      expect(utils.hasSameDomain('http://google.com','http://drive.google.com')).to.be.true;
    });
    it('matches another domain with subdomain', () => {
      expect(utils.hasSameDomain('https://sports.yahoo.com', 'https://www.yahoo.com/')).to.be.true;
    });
    it('matches https domain with http', () => {
      expect(utils.hasSameDomain('https://www.russianmachineneverbreaks.com/', 'http://www.russianmachineneverbreaks.com/')).to.be.true;
    });
  });

  describe('#shouldntAddListener', () => {

    var anchor = {
      setAttribute: function(name, value) { this[name] = value },
      getAttribute: function(name) { return this[name] }
    }
    it('returns true for an empty href', () => {
      anchor.setAttribute('href', '');
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
    it('returns true for an "#" href', () => {
      anchor.setAttribute('href', '#backers');
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
    it('returns true for absolute path with page anchor', () => {
      anchor.setAttribute('href', "https://mochajs.org/#backers");
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
    it('returns true for href with "javascript"', () => {
      anchor.setAttribute('href', 'javascript:void(0)');
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
    it('returns true for anchor with onclick attribute', () => {
      anchor.setAttribute('href', 'http://www.google.com/');
      anchor.setAttribute('onclick', function() {});
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
    it('returns false for an absolute path', () => {
      anchor.setAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty');
      expect(utils.shouldntAddListener(anchor)).to.be.true;
    })
  });

  describe('#determineAnchorType', () => {

    var anchor = {
      setAttribute: function(name, value) { this[name] = value },
      getAttribute: function(name) { return this[name] }
    }

    describe('without a strategy', () => {

      anchor.setAttribute('origin', 'http://drive.google.com')


      it('returns "relative" if anchor.origin and windowOrigin match', () => {
        expect(utils.determineAnchorType(anchor, 'http://google.com')).to.eq('relative');
      })
      it('returns "absolute" if anchor.origin and windowOrigin do not match', () => {
        expect(utils.determineAnchorType(anchor, 'https://www.yahoo.com/')).to.eq('absolute');
      })
    });

    describe('with a strategy', () => {

    });
  });

  describe('#isSleepTimerEnabled', () => {
    xit('', () => {})
    xit('', () => {})
    xit('', () => {})
  });
});
