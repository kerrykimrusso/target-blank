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
  }
}

module.exports = factory;