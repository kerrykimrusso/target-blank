const utils = (function initUtils() {
  function hasSameDomain(a, b) {
    const regex = /(?:\w+\.)*(\w+\.\w+)/;
    const matchA = a.match(regex);
    const matchB = b.match(regex);
    return matchA && matchB && matchA[1] === matchB[1];
  }

  function isSleepTimerEnabled(expirationTimeInMs, curTimerInMs) {
    return expirationTimeInMs > curTimerInMs;
  }

  function determineAnchorType(anchor, windowOrigin, strategy) {
    if (strategy) {
      if (strategy.shouldTreatAsAbsolute(anchor)) return 'absolute';
      if (strategy.shouldTreatAsRelative(anchor)) return 'relative';
    }
    if (this.hasSameDomain(anchor.origin, windowOrigin)) return 'relative';
    return 'absolute';
  }

  function shouldntAddListener(anchor) {
    const href = anchor.getAttribute('href');
    if (!href || href.includes('#') || href.startsWith('javascript') || !!anchor.onclick) return true;
    return false;
  }

  function shouldDoOppositeTabAction(keyPressed, oppositeKey) {
    return keyPressed === oppositeKey;
  }

  function keyHeldDuringClick(event) {
    if (event.metaKey && !event.altKey) return 'command';
    if (event.altKey && !event.metaKey) return 'alt';

    return '';
  }

  return {
    hasSameDomain,
    shouldntAddListener,
    determineAnchorType,
    isSleepTimerEnabled,
    shouldDoOppositeTabAction,
    keyHeldDuringClick,
  };
}());

try {
  module.exports = utils;
} catch (err) {
  window.utils = utils;
}
