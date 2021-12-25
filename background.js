const background = (function init({ utils, enums }) {
  const defaultOptions = {
    'google.com': { '*': utils.getDefaultPrefs() },
    'yahoo.com': { '*': utils.getDefaultPrefs() },
    'bing.com': { '*': utils.getDefaultPrefs() },
    'baidu.com': { '*': utils.getDefaultPrefs() },
    'duckduckgo.com': { '*': utils.getDefaultPrefs() },
    'wikipedia.org': { '*': utils.getDefaultPrefs({ relative: 'new-tab' }) },
    'mozilla.org': {
      developer: utils.getDefaultPrefs({ relative: 'new-tab' }),
    },
  };

  const listenForRuntimeMessages = () => {
    chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
      const messageHandlers = {
        [enums.SAVE_OPTIONS_REQUESTED]: ({ hostname, prefs }) => {
          prefs.enabled = true;
          utils.getOptions()
            .then((options) => {
              const [subdomain, domain] = hostname;
              return utils.updatePrefs(options, subdomain, domain, prefs);
            })
            .then(utils.saveOptions)
            .then((options) => {
              const message = {
                type: enums.SAVE_OPTIONS_SUCCEEDED,
                payload: options,
              };
              sendResponse(message);
              utils.sendMessageToAllTabsMatchingHostname(message, hostname);
            });
        },
        [enums.DISABLE_REQUESTED]: ({ hostname }) => {
          const [subdomain, domain] = hostname;
          utils.saveOptions({ [domain]: { [subdomain]: { enabled: false } } })
            .then(utils.getOptions)
            .then((options) => {
              sendResponse({
                type: enums.DISABLE_SUCCEEDED,
                payload: options,
              });
            });
        },
        [enums.LINK_CLICKED]: ({ hostname, anchorType, anchorUrl }) => {
          const [subdomain, domain] = utils.getSubDomainOfUrl(hostname);
          utils.getOptions()
            .then((options) => {
              const prefs = utils.getPrefs(options, subdomain, domain);
              if (prefs && prefs.enabled) {
                switch (prefs[anchorType]) {
                  case 'same-tab':
                    utils.openInSameTab(anchorUrl);
                    break;
                  case 'same-new-tab':
                    utils.openInSameNewTab(anchorUrl, prefs);
                    break;
                  case 'new-tab':
                  default:
                    utils.openInNewTab(anchorUrl, prefs);
                    break;
                }
              }
            });
        },
        [enums.SET_ICON]: (settings) => {
          utils.updateIcon(settings);
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
