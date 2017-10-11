(function init(utils, strategy) {
  const { shouldntAddListener, determineAnchorType } = utils;

  function addClickListener(anchorTags) {
    anchorTags.forEach((a) => {
      if (shouldntAddListener(a)) return;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        const origin = window.location.origin;
        chrome.runtime.connect().postMessage({
          type: 'LINK_CLICKED',
          anchorType: determineAnchorType(a, origin, strategy),
          anchorUrl: a.getAttribute('href'),
          windowOrigin: origin,
        });
        return false;
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
