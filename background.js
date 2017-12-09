const background = (function init({ utils, enums }) {
  const defaultOptions = {
    'www.google.com': utils.getDefaultPrefs(),
    'www.yahoo.com': utils.getDefaultPrefs(),
    'www.bing.com': utils.getDefaultPrefs(),
    'www.baidu.com': utils.getDefaultPrefs(),
    'www.duckduckgo.com': utils.getDefaultPrefs(),
    'www.wikipedia.org': utils.getDefaultPrefs({ relative: 'new-tab' }),
    'developer.mozilla.org': utils.getDefaultPrefs({ relative: 'new-tab' }),
  };

  const listenForRuntimeMessages = () => {
    chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
      const messageHandlers = {
        [enums.SAVE_OPTIONS_REQUESTED]: ({ hostname, prefs }) => {
          prefs.enabled = true;
          utils.saveOptions({ [hostname]: prefs })
            .then(utils.getOptions)
            .then((options) => {
              sendResponse({
                type: enums.SAVE_OPTIONS_SUCCEEDED,
                payload: options,
              });
            });
        },
        [enums.DISABLE_REQUESTED]: ({ hostname }) => {
          utils.saveOptions({ [hostname]: { enabled: false } })
            .then(utils.getOptions)
            .then((options) => {
              sendResponse({
                type: enums.DISABLE_SUCCEEDED,
                payload: options,
              });
            });
        },
      };
      messageHandlers[msg.type](msg.payload, sendResponse);
      return true; // allows async sendResponse call
    });
  };

  const onLinkClicked = ({ anchorType, anchorUrl }) => {
    switch (options[anchorType]) {
      case 'same-tab':
        openInSameTab(anchorUrl);
        break;
      case 'new-tab':
      default:
        openInNewTab(anchorUrl);
        break;
    }
  }

  utils.getOptions()
    .then(options => ({
      ...defaultOptions,
      ...options,
    }))
    .then(utils.saveOptions)
    .then(listenForRuntimeMessages)
    .catch(console.log);
}(window));
