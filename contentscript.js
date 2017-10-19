(function init(utils, strategy, location) {
  function addClickListener(anchorTags) {
    anchorTags.forEach((a) => {
      if (utils.shouldntAddListener(a)) return;

      a.addEventListener('click', (e) => {
        // TODO check for sleep timer
        // if(utils.isSleepTimerEnabled(, Date.now())) return;

        // ignore if middle or right click
        if (e.which > 1 && e.which < 4) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const origin = location.origin;

        chrome.runtime.sendMessage({
          type: 'LINK_CLICKED',
          payload: {
            anchorType: utils.determineAnchorType(a, origin, strategy),
            anchorUrl: a.href,
            keyPressed: utils.keyHeldDuringClick(e),
          },
        });
      });
    });
  }

  const observer = new MutationSummary({
    callback: (summaryObjects) => {
      addClickListener(summaryObjects[0].added);
    },
    queries: [
      { element: 'a' },
    ],
  });

  const anchors = document.querySelectorAll('a');
  addClickListener(anchors);
}(window.utils, window.strategy, window.location));
