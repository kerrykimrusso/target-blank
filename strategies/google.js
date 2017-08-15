window.strategy = (function() {
  
  const matchesDomain = function matchesDomain(windowLocationOrigin){
    return true;
  }
  const shouldIgnore = function shouldIgnore(a){
    return /^Google (apps|Account)/.test(a.title);
  }
  
  
  return {
    matchesDomain,
    shouldIgnore
  }
})();