const init = (function init(utils, strategy, location) {
  return (options) => {
    function addClickListener(anchorTags) {
      anchorTags.forEach((a) => {
        if (utils.shouldIgnore(a, strategy)) return;

        a.addEventListener('click', (e) => {
          if (utils.isSleepTimerEnabled(options.expiration, Date.now())) return;
          if (utils.isWhitelisted(options.whitelist, utils.getOriginOfUrl(location.origin))) return;

          // ignore if middle or right click
          if (e.which > 1 && e.which < 4) return;
          if (utils.keyHeldDuringClick(e)) return;

          e.preventDefault();
          e.stopImmediatePropagation();

          chrome.runtime.sendMessage({
            type: 'LINK_CLICKED',
            payload: {
              anchorType: utils.determineAnchorType(a, location.origin, strategy),
              anchorUrl: a.href,
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

    chrome.runtime.onMessage.addListener((msg) => {
      const messageHandlers = {
        OPTIONS_UPDATED: (newOptions) => {
          options = newOptions;
        },
      };

      messageHandlers[msg.type](msg.payload);
    });
  };
}(window.utils, window.strategy, window.location));

chrome.storage.sync.get(null, init);
