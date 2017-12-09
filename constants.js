const constants = Object.freeze({
  ENABLE_BUTTON_TEXT: 'Enable',
  DISABLE_BUTTON_TEXT: 'Disable',
});

try {
  module.exports = constants;
} catch (err) {
  window.constants = constants;
}
