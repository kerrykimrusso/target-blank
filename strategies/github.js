window.strategy = (function init(utils, origin) {
  function matchesDomain() {
    return true;
  }

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
    matchesDomain,
    shouldIgnore,
    shouldTreatAsRelative,
    shouldTreatAsAbsolute,
  };
}(window.utils, window.location.origin));
