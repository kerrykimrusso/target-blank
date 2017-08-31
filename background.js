let tabCount = 0;

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
    NEW_TAB: (payload) => {
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
