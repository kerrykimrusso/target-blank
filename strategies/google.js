window.strategy = (function init() {
  const matchesDomain = function matchesDomain() {
    return true;
  };

  const shouldIgnore = function shouldIgnore(a) {
    return /^Google (apps|Account)/.test(a.title);
  };

  return {
    matchesDomain,
    shouldIgnore,
  };
}());
