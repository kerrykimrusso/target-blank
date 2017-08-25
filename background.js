// chrome.storage.sync.get({}, );
let tabCount = 0;

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((info) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      chrome.tabs.create({
        url: info.url,
        active: true,
        index: tabs[0].index + 1,
      });
    });
  });
});

function getTabCount() {
  chrome.tabs.query({
    currentWindow: true,
  }, (tabs) => {
    tabCount = tabs.length;
    console.log(tabCount);
  });
}

chrome.windows.onFocusChanged.addListener(getTabCount);
chrome.tabs.onCreated.addListener(getTabCount);
chrome.tabs.onRemoved.addListener(getTabCount);
