window.strategy = (function init(utils, origin) {
  function matchesDomain() {
    return true;
  }

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
    matchesDomain,
    shouldIgnore,
    shouldTreatAsRelative,
    shouldTreatAsAbsolute,
  };
}(window.utils, window.location.origin));
