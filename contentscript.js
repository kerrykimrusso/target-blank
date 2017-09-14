(function init() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, resolve);
  });
})()
.then(options => {

  const anchors = document.querySelectorAll('a');

  chrome.storage.onChanged.addListener(onOptionsChanged);

  anchors.forEach((anchor) => {
    const href = anchor.href;

    if (window.strategy && window.strategy.matchesDomain(window.location.origin)) {
      if (window.strategy.shouldIgnore(anchor)) return;
    }

    anchor.addEventListener('mousedown', tabOption(anchor));
  });

  function onOptionsChanged(changes) {
    Object.keys(changes).forEach((key) => {
      options[key] = changes[key].newValue;
    });
  }

  function anchorType(anchor) {
    const href = anchor.getAttribute('href');
    const fullPath = anchor.href;

    if (!href || href.startsWith('#') || !!anchor.onclick) return 'button';
    if (fullPath.startsWith(`http://${window.location.host}`) || fullPath.startsWith(`https://${window.location.host}`)) {
      return 'relative';
    } else {
      return 'absolute';
    }
  }

  function tabOption(anchor) {

    const type = anchorType(anchor);

    switch (options[type]) {

      case 'new-tab':
        return (e) => {
          // if the user is holding the cmd key or the href is a full path, load in the same window

          // ignore if middle or right click
          if (e.which > 1 && e.which < 4) return;

          if (shouldDoOpposite(e)) {
            openInSameTab();
          } else {
            e.preventDefault();
            openInNewTab(anchor.href);
          }
        }

      case 'same-tab':
        anchor.target = '';
        return (e) => {
          // if the user is holding the cmd key or the href is a full path, load in the same window

          // ignore if middle or right click
          if (e.which > 1 && e.which < 4) return;

          if (shouldDoOpposite(e)) {
            e.preventDefault();
            openInNewTab(anchor.href);
          } else {
            openInSameTab();
          }
        }

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

    function shouldDoOpposite(e) {
      return options.key === 'command' ? e.metaKey : e.altKey;
    }
  }

});


// Proxy link check???
// !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)