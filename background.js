chrome.storage.sync.get({}, data => console.log(data))

chrome.runtime.onConnect.addListener(port => {

  port.onMessage.addListener(info => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      console.log(tabs)
      chrome.tabs.create({
        url: info.url,
        active: true,
        index: tabs[0].index + 1
      });
    });
  });
});