window.strategy = (function() {
  
  const matchesDomain = function matchesDomain(windowLocationOrigin){
    return true;
  }
  const shouldIgnore = function shouldIgnore(a){
    return a.href.startsWith(window.location.origin)
  }
  
  
  return {
    matchesDomain,
    shouldIgnore
  }
})();