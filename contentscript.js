(function init(utils, strategy) {
  const { shouldntAddListener, determineAnchorType } = utils;

  function addClickListener(anchorTags) {
    anchorTags.forEach((a) => {
      if (shouldntAddListener(a)) return;

      a.addEventListener('click', (e) => {
        // TODO check for sleep timer

        // ignore if middle or right click
        if (e.which > 1 && e.which < 4) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const origin = window.location.origin;

        let keyPressed = '';
        if (e.metaKey) keyPressed = 'command';
        else if (e.altKey) keyPressed = 'alt';

        chrome.runtime.sendMessage({
          type: 'LINK_CLICKED',
          payload: {
            anchorType: determineAnchorType(a, origin, strategy),
            anchorUrl: a.getAttribute('href'),
            keyPressed,
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
}(window.utils, window.strategy));
