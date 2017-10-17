const strategy = (function init(utils, origin) {
  function shouldIgnore(anchor) {
    return false;
  }

  function shouldTreatAsRelative(anchor) {
    return false;
  }

  function shouldTreatAsAbsolute(anchor) {
    return /\/raw\//i.test(anchor.href);
  }

  return {
    shouldIgnore,
    shouldTreatAsRelative,
    shouldTreatAsAbsolute,
  };
});

if (module) module.exports = strategy;
