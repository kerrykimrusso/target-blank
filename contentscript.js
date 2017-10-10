(function init() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, resolve);
  });
}())
  .then((options) => {
    const defaultOptions = {
      key: 'command',
      relative: 'same-tab',
      absolute: 'new-tab',
      tab: 'right',
      expiration: 0,
      whitelist: [],
    };

    options = Object.assign({}, defaultOptions, options);

<<<<<<< HEAD
    function isWhitelisted(url) {
      if (options.whitelist) {
        for (let i = 0; i < options.whitelist.length; i += 1) {
          if (url.indexOf(options.whitelist[i]) > -1) return true;
        }
      }

      return false;
    }

    if (isWhitelisted(location.origin)) {
      chrome.runtime.connect().postMessage({
        type: 'WHITELISTED',
        payload: {
          options,
        },
      });

      return;
    }

=======
>>>>>>> add default options
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

    function onOptionsChanged(changes) {
      Object.keys(changes).forEach((key) => {
        options[key] = changes[key].newValue;
      });
    }

    function anchorType(anchor, strategy) {
      const href = anchor.getAttribute('href');
      const fullPath = anchor.href;

      if (!href || href.startsWith('#') || href.startsWith('javascript') || !!anchor.onclick) return 'button';

      if (strategy &&
        ('shouldTreatAsAbsolute' in strategy) &&
        strategy.shouldTreatAsAbsolute(anchor)) {
        return 'absolute';
      } else if (fullPath.startsWith(`http://${window.location.host}`) || fullPath.startsWith(`https://${window.location.host}`)) {
        return 'relative';
      }
      return 'absolute';
    }

    function hasSleepTimer() {
      return !!options.expiration && options.expiration > Date.now();
    }

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
    }

    function attachLinkBehavior(anchors) {
      anchors.forEach((anchor) => {
        if (window.strategy && window.strategy.matchesDomain(window.location.origin)) {
          if (window.strategy.shouldIgnore(anchor)) return;
        }

        anchor.addEventListener('mousedown', tabOption(anchor, window.strategy));
      });
    }

    const anchors = document.querySelectorAll('a');
    attachLinkBehavior(anchors);

    const observer = new MutationSummary({
      callback: (summaryObjects) => {
        attachLinkBehavior(summaryObjects[0].added);
      },
      queries: [
        { element: 'a' },
      ],
    });

    chrome.storage.onChanged.addListener(onOptionsChanged);
  });
