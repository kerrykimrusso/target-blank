document.addEventListener('DOMContentLoaded', () => {
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

  function onOptionsSaved() {
    // const status = document.getElementById('status');
    // status.textContent = 'Options saved.';
    // setTimeout(() => {
    //   status.textContent = '';
    // }, 750);
  }

  function onSleepTimerSet(expirationTimeInMs) {
    const status = document.querySelector('#sleepToggleForm .status');
    const expirationDate = new Date(expirationTimeInMs);
    const timeMatches = expirationDate.toLocaleTimeString().match(/(\d+.\d+).\d+(\s+\w+)*/i);
    const [, time, meridiem] = timeMatches;
    status.textContent = `Will wake up at ${time}${meridiem || ''} tomorrow`;
  }

  function setSleepTimer(duration = 0) {
    chrome.runtime.sendMessage({
      type: 'SET_SLEEP_TIMER',
      payload: duration,
    });
  }

  chrome.storage.sync.get(null, (options) => {
    restoreOptionsForm(options);

    chrome.runtime.onMessage.addListener((msg) => {
      const messageHandlers = {
        OPTIONS_SAVED: onOptionsSaved,
        SLEEP_TIMER_SET: onSleepTimerSet,
      };

      messageHandlers[msg.type](msg.payload);
    });

    document.getElementById('optionsForm').addEventListener('change', saveOptions);
    document.getElementById('sleepTimerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      setSleepTimer(e.target.duration.value);
    });
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
});
