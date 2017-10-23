const factory = {
  anchor: function () {
    return {
      setAttribute: function(name, value) { this[name] = value },
      getAttribute: function(name) { return this[name] }
    }
  },
  event: function() {
    return {
      metaKey: false,
      altKey: false,
    }
  },
  strategy: function(relativeBool, absoluteBool, shouldIgnoreBool) {
    return {
      shouldTreatAsRelative: function(anchor) { return relativeBool },
      shouldTreatAsAbsolute: function(anchor) { return absoluteBool },
      shouldIgnore: function(anchor) { return shouldIgnoreBool },
    }
  }
}

module.exports = factory;
