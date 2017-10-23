const utils = (function initUtils() {
  function hasSameDomain(a, b) {
    const regex = /(?:\w+\.)*(\w+\.\w+)/;
    const matchA = a.match(regex);
    const matchB = b.match(regex);
    return matchA && matchB && matchA[1] === matchB[1];
  }

  function isSleepTimerEnabled(expirationTimeInMs, curTimeInMs) {
    return expirationTimeInMs > curTimeInMs;
  }

  function determineAnchorType(anchor, windowOrigin, strategy) {
    if (strategy) {
      if (strategy.shouldTreatAsAbsolute(anchor)) return 'absolute';
      if (strategy.shouldTreatAsRelative(anchor)) return 'relative';
    }
    if (this.hasSameDomain(anchor.origin, windowOrigin)) return 'relative';
    return 'absolute';
  }

  function shouldIgnore(anchor, strategy) {
    const href = anchor.getAttribute('href');
    return !href || href.includes('#') || href.startsWith('javascript') || !!anchor.onclick || (!!strategy && strategy.shouldIgnore(anchor));
  }

  function keyHeldDuringClick(event) {
    if (event.metaKey && !event.altKey) return 'command';
    if (event.altKey && !event.metaKey) return 'alt';

    return null;
  }

  return {
    hasSameDomain,
    shouldIgnore,
    determineAnchorType,
    isSleepTimerEnabled,
    keyHeldDuringClick,
  };
}());

try {
  module.exports = utils;
} catch (err) {
  window.utils = utils;
}
