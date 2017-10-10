const utils = (function initUtils() {
  const isSubdomain = function isSubdomain(a, b) {
    const regex = /(?:\w+\.)*(\w+\.\w+)/;
    const matchA = a.match(regex);
    const matchB = b.match(regex);
    return matchA && matchB && matchA[1] === matchB[1];
  };

  return {
    isSubdomain,
  };
}());
