(function () {

  const anchors = document.querySelectorAll("a");

  anchors.forEach(a => {
    let href = a.getAttribute('href');

    // check for null href or page anchors (since a # could just be a placeholder)
    if (!href || href.startsWith('#') || !!a.onclick) return;

    a.addEventListener('click', e => {

      // if the user is holding the cmd key or the href is a full path, load in the same window
      if (e.metaKey || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) {
        // if( true /*check user setting for cmd + clicks*/) window.location = href;
      } else {
        e.preventDefault();
        chrome.runtime.connect().postMessage({
          "url": href
        });
      }
    });
  });
})();