chrome.runtime.onConnect.addListener( port => {
    console.log(port);

    port.onMessage.addListener( info => {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, tabs => {
          console.log(tabs)
          chrome.tabs.create({ url: info.url, active: true, index: tabs[0].index + 1 });
        })
        // console.log(info);
        // chrome.tabs.create({ url: info.url, active: false, index: 0 })
    });
})