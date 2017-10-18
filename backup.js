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
        'shouldTreatAsAbsolute' in strategy &&
        strategy.shouldTreatAsAbsolute(anchor)) {
        return 'absolute';
      } else if (fullPath.startsWith(`http://${window.location.host}`) || fullPath.startsWith(`https://${window.location.host}`) ||
      (strategy && 'shouldTreatAsRelative' in strategy && strategy.shouldTreatAsRelative(anchor))) {
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


/**
   * OPTIONS.JS
   */

let sleepTimerInterval;

function formatFinalCountdown(timeRemaining) {
  const hours = Math.floor(timeRemaining / 3600000);
  const minutes = Math.floor((timeRemaining % 3600000) / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  const padStart = String.prototype.padStart;

  let formatted = hours > 0 ? `${hours}:` : '';
  formatted += hours > 0 || minutes > 0 ? `${padStart.call(minutes, 2, '0')}:` : '';
  formatted += hours > 0 || minutes > 0 || seconds > 0 ? `${padStart.call(seconds, 2, '0')}` : '';
  return formatted;
}


function initFinalCountdown(expiration) {
  function onSleepTimerInterval() {
    const timeRemaining = expiration - Date.now();
    if (timeRemaining <= 0) {
      clearInterval(sleepTimerInterval);
    } else {
      const finalCountdown = document.getElementById('finalCountdown');
      finalCountdown.textContent = formatFinalCountdown(timeRemaining);
    }
  }

  sleepTimerInterval = setInterval(onSleepTimerInterval, 1000);
  onSleepTimerInterval();
}


function setSleepTimer(e) {
  e.preventDefault();

  if (sleepTimerInterval) clearInterval(sleepTimerInterval);

  const duration = parseInt(e.target.duration.value, 10);
  const expiration = Date.now() + duration;

  chrome.storage.sync.set({ expiration }, () => {
    initFinalCountdown(expiration);
  });
}

function cancelSleepTimer(e) {
  e.preventDefault();
  const finalCountdown = document.getElementById('finalCountdown');

  chrome.storage.sync.set({ expiration: 0 }, () => {
    if (sleepTimerInterval) {
      clearInterval(sleepTimerInterval);
      finalCountdown.textContent = 'Resuming extension...';
      setTimeout(() => {
        finalCountdown.textContent = '';
      }, 1000);
    }
  });
}

document.getElementById('sleepTimerForm').addEventListener('submit', setSleepTimer);
document.getElementById('cancelSleeptimer').addEventListener('click', cancelSleepTimer);
