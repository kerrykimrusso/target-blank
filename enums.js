const enums = Object.freeze({
  SAVE_OPTIONS_REQUESTED: 'save options requested',
  SAVE_OPTIONS_SUCCEEDED: 'save options successful',
  DISABLE_REQUESTED: 'disable requested',
  DISABLE_SUCCEEDED: 'disabled succeeded',
  LINK_CLICKED: 'link clicked',
  FEEDBACK_CLICKED: 'feedback clicked',
  SET_ICON: 'set icon'
});

try {
  module.exports = enums;
} catch (err) {
  window.enums = enums;
}
