const strategy = (function init(utils, origin) {
  function shouldIgnore(anchor) {
    return /^Google (apps|Account)/.test(anchor.title);
  }

  function shouldTreatAsRelative(anchor) {
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
  window.utils = strategy;
}
