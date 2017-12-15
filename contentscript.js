const init = (function init( // eslint-disable-line no-unused-vars
  {
    utils,
    strategy,
    location,
    enums,
  },
  MutationSummary,
) {
  let mutationObserver; // eslint-disable-line no-unused-vars

  const onAnchorClicked = (e) => {
    const a = e.currentTarget;
    if (utils.shouldIgnore(a, strategy)) return;
    if (e.which > 1 && e.which < 4) return;

    e.preventDefault();
    e.stopImmediatePropagation();

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
          [enums.FEEDBACK_CLICKED]: () => {
            const feedbackAnchor = document.createElement('a');
            feedbackAnchor.setAttribute('href', 'mailto:targetdashblank@gmail.com');
            feedbackAnchor.setAttribute('target', '_blank');
            feedbackAnchor.click();
          },
        };
        messageHandlers[msg.type](msg.payload);
      });
      const prefs = options[location.hostname];
      if (prefs && prefs.enabled && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
        addClickHandlers(document.querySelectorAll('a'));
        utils.sendMessage(enums.SET_ICON, { prefs }, () => console.log('prefs sent'));
      }

      mutationObserver = new MutationSummary({
        callback: (summaryObjects) => {
          if (prefs && prefs.enabled && !utils.isSleepTimerEnabled(prefs.expiration, Date.now())) {
            addClickHandlers(summaryObjects[0].added);
          }
        },
        queries: [
          { element: 'a' },
        ],
      });
    })
    .catch(console.log);
}(window, MutationSummary)); // eslint-disable-line no-undef
