const init = (function init({ utils, strategy, location, enums }, MutationSummary) {
  let mutationObserver;

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

  const addClickHandlers = (anchors) => {
    anchors.forEach((a) => {
      a.addEventListener('click', onAnchorClicked);
    });
  };

  const removeClickHandlers = (anchors) => {
    anchors.forEach((a) => {
      a.removeEventListener('click', onAnchorClicked);
    });
  };

  utils.getOptions()
    .then((options) => {
      chrome.runtime.onMessage.addListener((msg) => {
        const messageHandlers = {
          [enums.SAVE_OPTIONS_SUCCEEDED]: (newOptions) => {
            const newPrefs = newOptions[location.hostname];
            const allAnchors = document.querySelectorAll('a');
            if (newPrefs && !utils.isSleepTimerEnabled(newPrefs.expiration, Date.now())) {
              addClickHandlers(allAnchors);
            } else {
              removeClickHandlers(allAnchors);
            }
          },
        };
        messageHandlers[msg.type](msg.payload);
      });
      const prefs = options[location.hostname];
      if (prefs && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
        addClickHandlers(document.querySelectorAll('a'));
      }

      mutationObserver = new MutationSummary({
        callback: (summaryObjects) => {
          if (prefs && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
            addClickHandlers(summaryObjects[0].added);
          }
        },
        queries: [
          { element: 'a' },
        ],
      });
    })
    .catch(console.log);
/* eslint-disable no-undef */
}(window, MutationSummary));
