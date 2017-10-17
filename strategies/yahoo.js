const strategy = (function init(utils, origin) {
  function shouldIgnore() {
    return false;
  }

  function shouldTreatAsRelative(anchor) {
    return utils.hasSameDomain(origin, anchor.origin);
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

if (module) module.exports = strategy;
