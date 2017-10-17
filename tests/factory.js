const factory = {
  anchor: function () {
    return {
      setAttribute: function(name, value) { this[name] = value },
      getAttribute: function(name) { return this[name] }
    }
  }
}

module.exports = factory;