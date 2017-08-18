// chrome.storage.sync.get({}, );

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
