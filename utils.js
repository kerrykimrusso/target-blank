const utils = (function initUtils() {
  function getDefaultPrefs(options) {
    return Object.assign({},
      {
        relative: 'same-tab',
        absolute: 'new-tab',
        tab: 'right',
        expiration: 0,
        enabled: true,
        focus: false
      },
      options);
  }

  const ORIGIN_REGEX = /(?:\w+\.)*(\w+\.\w+)/i;
  function hasSameDomain(a, b) {
    const matchA = a.match(ORIGIN_REGEX);
    const matchB = b.match(ORIGIN_REGEX);
    return matchA && matchB && matchA[1] === matchB[1];
  }

  const HOSTNAME_REGEX = /(\w+\.)*(\w+\.\w+)/i;

  function getHostnameOfUrl(url) {
    const matches = url.match(HOSTNAME_REGEX);
    return matches ? matches[0] : null;
  }

  function hasSameHostname(a, b) {
    const matchA = this.getHostnameOfUrl(a);
    const matchB = this.getHostnameOfUrl(b);
    return matchA && matchB && matchA[0] === matchB[0];
  }

  function isSleepTimerEnabled(expirationTimeInMs, curTimeInMs) {
    return expirationTimeInMs > curTimeInMs;
  }

  function get2amTomorrowInMsFrom(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return Date.parse(new Date(year, month, day + 1, 2, 0, 0));
  }

  function getReadableTimeFrom(timeInMs) {
    const expirationDate = new Date(timeInMs);
    const timeMatches = expirationDate.toLocaleTimeString().match(/(\d+.\d+).\d+(\s+\w+)*/i);
    const [, time, meridiem] = timeMatches;
    return `${time}${meridiem || ''}`;
  }

  function determineAnchorType(anchor, windowOrigin, strategy) {
    if (strategy) {
      if (strategy.shouldTreatAsAbsolute(anchor)) return 'absolute';
      if (strategy.shouldTreatAsRelative(anchor)) return 'relative';
    }
    if (this.hasSameHostname(anchor.origin, windowOrigin)) return 'relative';
    return 'absolute';
  }

  function formToHash(form, getters) {
    const hash = {};
    for (let i = 0, el; i < form.length; i += 1) {
      el = form[i];
      hash[el.name] = getters && getters[el.name] ?
        getters[el.name](el) :
        el.value;
    }
    return hash;
  }

  function setFormValues(form, values, setters) {
    for (let i = 0, el; i < form.length; i += 1) {
      el = form[i];
      if (setters && setters[el.name]) {
        setters[el.name](el);
      } else {
        el.value = values[el.name];
      }
    }
  }

  function shouldIgnore(anchor, strategy) {
    let href = anchor.getAttribute('href');
    // href will be null if there is no attribute on the anchor.
    href = href ? href.trim().toLowerCase() : href;
    return !href || href.includes('#') || href.startsWith('javascript') || !!anchor.onclick || (!!strategy && strategy.shouldIgnore(anchor));
  }

  function sendMessage(type, payload, responseHandler) {
    chrome.runtime.sendMessage({
      type,
      payload,
    }, responseHandler);
  }

  function getActiveTabInCurrentWindow() {
    return new Promise((resolve) => {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, tabs => resolve(tabs[0]));
    });
  }

  function updateIcon(settings) {
    const { prefs } = settings;
    utils.getActiveTabInCurrentWindow()
      .then((tab) => {
        let path;
        if (prefs) {
          if (prefs.suspendSwitch) {
            path = 'icons/icon_suspended.png';
          } else if (prefs.enabled) {
            path = 'icons/icon_enabled.png';
          } else {
            path = 'icons/icon_disabled.png';
          }
        }
        chrome.browserAction.setIcon({
          path,
          tabId: tab.id,
        });
      });
  }

  function sendMessageToAllTabsMatchingHostname(message, hostname) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && utils.hasSameHostname(tab.url, hostname)) {
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    });
  }

  function getOptions() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (storedOptions) => {
        resolve(storedOptions);
      });
    });
  }

  function saveOptions(newOptions) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newOptions, () => {
        resolve(newOptions);
      });
    });
  }

  function removeFromOptions(...keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(keys, () => {
        resolve();
      });
    });
  }

  function openInSameTab(url) {
    chrome.tabs.update({
      url,
    });
  }

  function getNewTabIndex(tabIndex, val) {
    switch (val) {
      case 'start':
        return 0;
      case 'end':
        return 9999;
      case 'left':
        return tabIndex;
      default: // 'right'
        return tabIndex + 1;
    }
  }

  function createNewTab(url, newTabPref) {
    return tab => chrome.tabs.create({
      url,
      active: newTabPref.focusSwitch,
      index: getNewTabIndex(tab.index, newTabPref.tab),
    });
  }

  function openInNewTab(url, newTabPref) {
    this.getActiveTabInCurrentWindow()
      .then(createNewTab(url, newTabPref));
  }

  return {
    getDefaultPrefs,
    hasSameDomain,
    shouldIgnore,
    determineAnchorType,
    isSleepTimerEnabled,
    getHostnameOfUrl,
    get2amTomorrowInMsFrom,
    getReadableTimeFrom,
    hasSameHostname,
    formToHash,
    setFormValues,
    sendMessage,
    sendMessageToAllTabsMatchingHostname,
    getActiveTabInCurrentWindow,
    getOptions,
    saveOptions,
    removeFromOptions,
    openInSameTab,
    openInNewTab,
    getNewTabIndex,
    updateIcon,
  };
}());

try {
  module.exports = utils;
} catch (err) {
  window.utils = utils;
}
