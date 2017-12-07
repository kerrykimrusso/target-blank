const utils = (function initUtils() {
  const hostnameRegex = /(\w+\.)*(\w+\.\w+)/;

  function hasSameDomain(a, b) {
    const matchA = a.match(hostnameRegex);
    const matchB = b.match(hostnameRegex);
    return matchA && matchB && matchA[1] === matchB[1];
  }

  function getOriginOfUrl(url) {
    const matches = url.match(hostnameRegex);
    return matches && matches.length ? matches[0] : null;
  }

  function isSleepTimerEnabled(expirationTimeInMs, curTimeInMs) {
    return expirationTimeInMs > curTimeInMs;
  }

  function isWhitelisted(whitelist, url) {
    return whitelist.indexOf(url) > -1;
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
    let href = anchor.getAttribute('href');
    // href will be null if there is no attribute on the anchor.
    href = href ? href.trim().toLowerCase() : href;
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
    isWhitelisted,
    getOriginOfUrl,
  };
}());

try {
  module.exports = utils;
} catch (err) {
  window.utils = utils;
}
