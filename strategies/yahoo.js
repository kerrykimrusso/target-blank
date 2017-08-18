window.strategy = (function init() {
  const matchesDomain = function matchesDomain() {
    return true;
  };

  const shouldIgnore = function shouldIgnore(a) {
    return a.href.startsWith(window.location.origin);
  };

  return {
    matchesDomain,
    shouldIgnore,
  };
}());
