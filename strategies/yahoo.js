window.strategy = (function init(utils, origin) {
  function matchesDomain() {
    return true;
  }

  function shouldIgnore() {
    return false;
  }

  function shouldTreatAsRelative(anchor) {
    return utils.isSubdomain(origin, anchor.origin);
  }

  function shouldTreatAsAbsolute() {
    return false;
  }

  return {
    matchesDomain,
    shouldIgnore,
    shouldTreatAsRelative,
    shouldTreatAsAbsolute,
  };
}(window.utils, window.location.origin));
