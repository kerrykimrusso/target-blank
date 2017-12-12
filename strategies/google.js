const strategy = (function init(utils, origin) {
  function shouldIgnore(anchor) {
    return /^Google (apps|Account)/.test(anchor.title) ||
      /noopener/.test(anchor.rel);
  }

  function shouldTreatAsRelative() {
    return false;
  }

  function shouldTreatAsAbsolute(anchor) {
    return /^https*:\/\/www\.google\.com\/url\?/.test(anchor.href);
  }

  return {
    shouldIgnore,
    shouldTreatAsRelative,
    shouldTreatAsAbsolute,
  };
});

try {
  module.exports = strategy;
} catch (err) {
  window.strategy = strategy(window.utils, window.origin);
}
