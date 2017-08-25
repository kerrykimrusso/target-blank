(function init() {
  const anchors = document.querySelectorAll('a');

  anchors.forEach((a) => {
    const href = a.getAttribute('href');

    // check for null href or page anchors (since a # could just be a placeholder)

    if (!href || href.startsWith('#') || !!a.onclick || href.startsWith(window.origin)) return;

    if (window.strategy && window.strategy.matchesDomain(window.location.origin)) {
      if (window.strategy.shouldIgnore(a)) return;
    }

    a.addEventListener('mousedown', (e) => {
      // if the user is holding the cmd key or the href is a full path, load in the same window
      if (e.metaKey || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) {
        // if( true /*check user setting for cmd + clicks*/) window.location = href;
      } else {
        e.preventDefault();
        chrome.runtime.connect().postMessage({
          url: href,
        });
      }
    });
  });
}());
