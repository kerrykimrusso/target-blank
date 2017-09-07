(function init() {
  const options = {};
  const anchors = document.querySelectorAll('a');

  anchors.forEach((a) => {
    const href = a.getAttribute('href');

    // check for null href or page anchors (since a # could just be a placeholder)

    if (!href || href.startsWith('#') || !!a.onclick || href.startsWith(`http://${window.location.host}`) || href.startsWith(`https://${window.location.host}`)) return;

    if (window.strategy && window.strategy.matchesDomain(window.location.origin)) {
      if (window.strategy.shouldIgnore(a)) return;
    }

    a.addEventListener('mousedown', (e) => {
      // if the user is holding the cmd key or the href is a full path, load in the same window

      // ignore if middle or right click
      if (e.which > 1 && e.which < 4) return;

      if (e.metaKey || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) {
        // if( true /*check user setting for cmd + clicks*/) window.location = href;
      } else {
        e.preventDefault();
        chrome.runtime.connect().postMessage({
          type: 'NEW_TAB',
          payload: {
            url: href,
            options,
          },
        });
      }
    });
  });

  function updateOptions(onSuccess) {
    chrome.storage.sync.get(null, onSuccess);
  }

  function onOptionsRetrieved(curOptions) {
    Object.assign(options, curOptions);
  }

  function onOptionsChanged(changes) {
    Object.keys(changes).forEach((key) => {
      options[key] = changes[key].newValue;
    });
  }

  chrome.storage.onChanged.addListener(onOptionsChanged);
  updateOptions(onOptionsRetrieved);
}());
