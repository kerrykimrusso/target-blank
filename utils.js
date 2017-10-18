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
    if (hasSameDomain(anchor.origin, windowOrigin)) return 'relative';
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

  return {
    hasSameDomain,
    shouldntAddListener,
    determineAnchorType,
    isSleepTimerEnabled,
    shouldDoOppositeTabAction,
  };
}());

try {
  module.exports = utils;
} catch (err) {
  window.utils = utils;
}
