const strategy = (function init(utils, origin) {
  function shouldIgnore(anchor) {
    return /\/messages\/t\//.test(anchor.href) || anchor.getAttribute('ajaxify');
  }

  function shouldTreatAsRelative() {
    return false;
  }

  function shouldTreatAsAbsolute() {
    return false;
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
