const init = (function init({ utils, strategy, location, enums, MutationSummary }) {
  let mutationObserver;
  
  const addClickHandlers = () => {
    const anchors = document.querySelectorAll('a');
    anchors.forEach((a) => {
      a.addEventListener('click', onAnchorClicked);
    });
  };

  const removeClickHandlers = () => {
    const anchors = document.querySelectorAll('a');
    anchors.forEach((a) => {
      a.removeEventListener('click', onAnchorClicked);
    });
  }

  utils.getOptions()
    .then((options) => {
      chrome.runtime.onMessage.addListener((msg) => {
        const messageHandlers = {
          [enums.SAVE_OPTIONS_SUCCEEDED]: (newOptions) => {
            const newPrefs = newOptions[location.hostname];
            if (newPrefs && !utils.isSleepTimerEnabled(newPrefs.expiration, Date.now())) {
              console.log('adding click handler...')
              addClickHandlers();
            } else {
              removeClickHandlers();
            }
          },
        };
        messageHandlers[msg.type](msg.payload);
      });
      const prefs = options[location.hostname];
      if (prefs && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
        addClickHandlers();
      }
      mutationObserver = new MutationSummary({
        callback: (summaryObjects) => {
          if (prefs && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
            summaryObjects[0].added.forEach(
              a => a.addEventListener('click', onAnchorClicked),
            );
          }
        },
        queries: [
          { element: 'a' },
        ],
      });
    })
    .catch(console.log);

  const onAnchorClicked = (e) => {
    if (e.which > 1 && e.which < 4) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    const a = e.currentTarget;
    utils.sendMessage(
      enums.LINK_CLICKED,
      {
        hostname: location.hostname,
        anchorType: utils.determineAnchorType(a, location.origin, strategy),
        anchorUrl: a.href,
      },
    );
  };
}({ utils: window.utils, strategy: window.strategy, location: window.location, enums: window.enums, MutationSummary }));
