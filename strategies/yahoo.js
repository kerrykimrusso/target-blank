window.strategy = (function init() {
  const matchesDomain = function matchesDomain() {
    return true;
  };

  const shouldIgnore = function shouldIgnore() {
    return false
  };

  const shouldTreatAsRelative = function shouldTreatAsRelative(a) {
    return utils.isSubdomain(window.location.origin, a.origin);
  }

  return {
    matchesDomain,
    shouldIgnore,
    shouldTreatAsRelative
  };
}());
