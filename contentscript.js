const init = (function init({ utils, strategy, location, enums, MutationSummary }) {

  const addClickHandlers = (prefs) => {
    const anchors = document.querySelectorAll('a');
    anchors.forEach((a) => {
      a.addEventListener('click', onAnchorClicked(prefs));
    });
  };

  utils.getOptions()
    .then((options) => {
      chrome.runtime.onMessage.addListener((msg) => {
        const messageHandlers = {
          [enums.SAVE_OPTIONS_SUCCESSFUL]: onOptionsUpdated,
        };
        messageHandlers[msg.type](msg.payload);
      });
      const prefs = options[location.hostname]
      if (prefs) {
        addClickHandlers(prefs);
      }
    })
    .catch(console.log);

  const onAnchorClicked = (prefs) => (e) => {
    if (e.which > 1 && e.which < 4) return;
    if (utils.isSleepTimerEnabled(prefs.expiration, Date.now())) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const a = e.currentTarget;
    utils.sendMessage(
      enums.LINK_CLICKED,
      {
        anchorType: utils.determineAnchorType(a, location.origin, strategy),
        anchorUrl: a.href,
      },
    );
  };

  const mutationObserver = new MutationSummary({
    callback: (summaryObjects) => {
      summaryObjects[0].added.forEach(
        a => a.addEventListener('click', onAnchorClicked),
      );
    },
    queries: [
      { element: 'a' },
    ],
  });
}({ utils: window.utils, strategy: window.strategy, location: window.location, enums: window.enums, MutationSummary }));
