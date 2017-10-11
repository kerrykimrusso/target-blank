let tabCount = 0;

const defaultOptions = {
  key: 'command',
  relative: 'same-tab',
  absolute: 'new-tab',
  tab: 'right',
  expiration: 0,
  whitelist: [],
};

options = Object.assign({}, defaultOptions, options);

function getPosition(tabs, val) {
  switch (val) {
    case 'start':
      return 0;
    case 'end':
      return tabCount;
    case 'left':
      return tabs[0].index;
    default: // 'right'
      return tabs[0].index + 1;
  }
}

chrome.runtime.onConnect.addListener((port) => {
  const messageHandlers = {
    LINK_CLICKED: ({ anchorType, anchorUrl, windowOrigin }) => {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, (tabs) => {
        chrome.tabs.create({
          url: payload.url,
          active: true,
          index: getPosition(tabs, payload.options.tab),
        });
      });
    },
  };

  port.onMessage.addListener((info) => {
    messageHandlers[info.type](info.payload);
  });
});

function getTabCount() {
  chrome.tabs.query({
    currentWindow: true,
  }, (tabs) => {
    tabCount = tabs.length;
  });
}

chrome.windows.onFocusChanged.addListener(getTabCount);
chrome.tabs.onCreated.addListener(getTabCount);
chrome.tabs.onRemoved.addListener(getTabCount);

function tabOption(anchor, strategy) {
  const type = anchorType(anchor, strategy);

  switch (options[type]) {
    case 'new-tab':
      return (e) => {
        // if there the sleep timer is running
        if (hasSleepTimer()) return;

        // ignore if middle or right click
        if (e.which > 1 && e.which < 4) return;

        if (shouldDoOpposite(e)) {
          openInSameTab();
        } else {
          e.preventDefault();
          openInNewTab(anchor.href);
        }
      };

    case 'same-tab':
      anchor.target = '';
      return (e) => {
      // if there the sleep timer is running
        if (hasSleepTimer()) return;

        // ignore if middle or right click
        if (e.which > 1 && e.which < 4) return;

        if (shouldDoOpposite(e)) {
          e.preventDefault();
          openInNewTab(anchor.href);
        } else {
          openInSameTab();
        }
      };

    default:
      return () => true;
  }

  function openInSameTab() {
    return true;
  }

  function openInNewTab(href) {
    chrome.runtime.connect().postMessage({
      type: 'NEW_TAB',
      payload: {
        url: href,
        options,
      },
    });
  }
}
