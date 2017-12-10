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
              const message = {
                type: enums.SAVE_OPTIONS_SUCCEEDED,
                payload: options,
              };

              sendResponse(message);
              utils.sendMessageAllTabsMatchingHostname(message, hostname);
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
        [enums.LINK_CLICKED]: ({ hostname, anchorType, anchorUrl }) => {
          utils.getOptions()
            .then((options) => {
              const prefs = options[hostname];
              if (prefs && prefs.enabled) {
                switch (prefs[anchorType]) {
                  case 'same-tab':
                    utils.openInSameTab(anchorUrl);
                    break;
                  case 'new-tab':
                  default:
                    utils.openInNewTab(anchorUrl, prefs.tab);
                    break;
                }
              }
            });
        },
      };
      messageHandlers[msg.type](msg.payload, sendResponse);
      return true; // allows async sendResponse call
    });
  };

  utils.getOptions()
    .then(options => ({
      ...defaultOptions,
      ...options,
    }))
    .then(utils.saveOptions)
    .then(listenForRuntimeMessages)
    .catch(console.log);
}(window));
