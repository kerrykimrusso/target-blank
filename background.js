const background = (function init(utils) {
  let options = {
    relative: 'same-tab',
    absolute: 'new-tab',
    tab: 'right',
    expiration: 0,
    whitelist: [],
  };

  // Saves options to chrome.storage.sync.
  function saveOptions(newOptions, sendResponse) {
    chrome.storage.sync.set(newOptions, () => {
      options = Object.assign({}, options, newOptions);

      sendResponse({
        type: 'OPTIONS_SAVED',
        payload: newOptions,
      });
    });
  }

  function saveOptionsWithCallback(newOptions, callback) {
    chrome.storage.sync.set(newOptions, () => {
      options = Object.assign({}, options, newOptions);

      if (callback) callback(options);
    });
  }

  function restoreOptions() {
    chrome.storage.sync.get(null, (curOptions) => {
      options = Object.assign({}, options, curOptions);
    });
  }

  function getNewTabIndex(tab, val) {
    switch (val) {
      case 'start':
        return 0;
      case 'end':
        return Number.MAX_SAFE_INTEGER;
      case 'left':
        return tab.index;
      default: // 'right'
        return tab.index + 1;
    }
  }

  function openInSameTab(url) {
    chrome.tabs.update({
      url,
    });
  }

  function openInNewTab(url) {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      chrome.tabs.create({
        url,
        active: true,
        index: getNewTabIndex(tabs[0], options.tab),
      });
    });
  }

  function onLinkClicked({ anchorType, anchorUrl }) {
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

  // TODO: incomplete
  function setSleepTimer(duration) {
    const expiration = Date.now() + duration;
    chrome.storage.sync.set({ expiration }, () => {
      chrome.runtime.sendMessage({
        type: 'SLEEP_TIMER_SET',
        payload: expiration,
      });
    });
  }

  function sendMessageToActiveTab(msg) {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }

  function addToWhitelist(url) {
    const origin = utils.getOriginOfUrl(url);
    const newOptions = {
      whitelist: [...options.whitelist, origin],
    };

    saveOptionsWithCallback(newOptions, (updatedOptions) => {
      sendMessageToActiveTab({
        type: 'OPTIONS_UPDATED',
        payload: updatedOptions,
      });
    });
  }

  function removeFromWhitelist(url) {
    const origin = utils.getOriginOfUrl(url);
    const newOptions = {
      whitelist: options.whitelist.filter(whitelistedUrl => whitelistedUrl !== origin),
    };

    saveOptionsWithCallback(newOptions, (updatedOptions) => {
      sendMessageToActiveTab({
        type: 'OPTIONS_UPDATED',
        payload: updatedOptions,
      });
    });
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // map message type to handler
    const messageHandlers = {
      LINK_CLICKED: onLinkClicked,
      SAVE_OPTIONS_BTN_CLICKED: saveOptions,
      SET_SLEEP_TIMER: setSleepTimer,
      ADD_TO_WHITELIST: addToWhitelist,
      REMOVE_FROM_WHITELIST: removeFromWhitelist,
    };

    messageHandlers[msg.type](msg.payload, sendResponse);
  });

  restoreOptions();
}(window.utils));
