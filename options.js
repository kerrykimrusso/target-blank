const init = (function init(utils) {
  return () => {
    function saveOptions(e) {
      e.preventDefault();

      const options = {};
      const form = e.currentTarget;
      // subtract 1 from form length so we do not iterate over save button
      for (let i = 0, el; i < form.length; i += 1) {
        el = form[i];
        options[el.name] = el.value;
      }

      chrome.runtime.sendMessage({
        type: 'SAVE_OPTIONS_BTN_CLICKED',
        payload: options,
      });
    }

    function restoreOptionsForm(options) {
      // looping over keys works for now if we're sticking to all dropdown lists
      Object.keys(options).forEach((key) => {
        const el = document.querySelector(`select[name=${key}]`);
        if (el) el.namedItem(options[key]).setAttribute('selected', true);
      });
    }

    function displaySleepTimerStatus(expirationTimeFormatted) {
      const status = document.querySelector('#sleepToggleForm .status');
      status.textContent = `Will wake up at ${expirationTimeFormatted} tomorrow`;
    }

    function clearSleepTimerStatus() {
      const status = document.querySelector('#sleepToggleForm .status');
      status.textContent = '';
    }

    function formatSleepTimer(expirationTimeInMs) {
      const expirationDate = new Date(expirationTimeInMs);
      const timeMatches = expirationDate.toLocaleTimeString().match(/(\d+.\d+).\d+(\s+\w+)*/i);
      const [, time, meridiem] = timeMatches;
      return `${time}${meridiem || ''}`;
    }

    function onSleepTimerSet(expirationTimeInMs) {
      if (utils.isSleepTimerEnabled(expirationTimeInMs, Date.now())) {
        displaySleepTimerStatus(formatSleepTimer(expirationTimeInMs));
      } else {
        clearSleepTimerStatus();
      }
    }

    function setSleepTimer(duration = 0) {
      chrome.runtime.sendMessage({
        type: 'SET_SLEEP_TIMER',
        payload: duration,
      });
    }

    function restoreSleepTimerForm(options) {
      const el = document.querySelector('#sleepToggleForm').toggle;
      if (utils.isSleepTimerEnabled(options.expiration, Date.now())) {
        el.setAttribute('checked', 1);
        onSleepTimerSet(options.expiration);
      }
    }

    function restoreWhitelistButton(options) {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, (tabs) => {
        const origin = utils.getOriginOfUrl(tabs[0].url);
        function toggleWhitelist(e) {
          e.preventDefault();
          const type = utils.isWhitelisted(options.whitelist || [], origin) ? 'REMOVE_FROM_WHITELIST' : 'ADD_TO_WHITELIST';
          chrome.runtime.sendMessage({
            type,
            payload: origin,
          });
        }

        const btn = document.querySelector('#whitelist');
        btn.removeAttribute('disabled');
        btn.textContent = utils.isWhitelisted(options.whitelist || [], origin) ? 'Remove From Whitelist' : 'Add To Whitelist';
        btn.addEventListener('click', toggleWhitelist, { once: true });
      });
    }

    function onOptionsUpdated(options) {
      restoreOptionsForm(options);
      restoreSleepTimerForm(options);
      restoreWhitelistButton(options);
    }

    chrome.storage.sync.get(null, (options) => {
      restoreOptionsForm(options);
      restoreSleepTimerForm(options);
      restoreWhitelistButton(options);

      chrome.runtime.onMessage.addListener((msg) => {
        const messageHandlers = {
          SLEEP_TIMER_SET: onSleepTimerSet,
          OPTIONS_UPDATED: onOptionsUpdated,
        };

        messageHandlers[msg.type](msg.payload);
      });

      document.getElementById('optionsForm').addEventListener('change', saveOptions);
      document.querySelector('#sleepToggleForm').toggle.addEventListener('change', (e) => {
        e.preventDefault();

        if (e.target.checked) {
          const today = new Date();
          const expirationDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 2, 0, 0);
          setSleepTimer(expirationDate - today);
        } else {
          setSleepTimer();
        }
      });
    });
  };
}(window.utils));

document.addEventListener('DOMContentLoaded', init);
