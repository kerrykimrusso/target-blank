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
          utils.removeFromOptions(hostname)
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
