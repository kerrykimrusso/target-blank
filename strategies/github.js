window.strategy = (function init() {
  const matchesDomain = function matchesDomain() {
    return true;
  };

  const shouldIgnore = function shouldIgnore() {
    return false;
  };

  function shouldTreatAsAbsolute(a) {
    return /\/raw\//i.test(a.href);
  }

  return {
    matchesDomain,
    shouldIgnore,
    shouldTreatAsAbsolute,
  };
}());
