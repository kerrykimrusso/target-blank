const utils = (function() {
  
  const isSubdomain = function isSubdomain(a, b) {
    const regex = /(?:\w+\.)*(\w+\.\w+)/,
    matchA = a.match(regex),
    matchB = b.match(regex);
    return matchA && matchB && matchA[1] === matchB[1];
  }

  return {
    isSubdomain,
  }
})()