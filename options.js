let sleepTimerInterval;

function formatFinalCountdown(timeRemaining) {
  const hours = Math.floor(timeRemaining / 3600000);
  const minutes = Math.floor((timeRemaining % 3600000) / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  const padStart = String.prototype.padStart;

  let formatted = hours > 0 ? `${hours}:` : '';
  formatted += hours > 0 || minutes > 0 ? `${padStart.call(minutes, 2, '0')}:` : '';
  formatted += hours > 0 || minutes > 0 || seconds > 0 ? `${padStart.call(seconds, 2, '0')}` : '';
  return formatted;
}


function initFinalCountdown(expiration) {
  function onSleepTimerInterval() {
    const timeRemaining = expiration - Date.now();
    if (timeRemaining <= 0) {
      clearInterval(sleepTimerInterval);
    } else {
      const finalCountdown = document.getElementById('finalCountdown');
      finalCountdown.textContent = formatFinalCountdown(timeRemaining);
    }
  }

  sleepTimerInterval = setInterval(onSleepTimerInterval, 1000);
  onSleepTimerInterval();
}

// Saves options to chrome.storage.sync.
function saveOptions(e) {
  e.preventDefault();

  const newOptions = {};

  const form = e.target;
  // subtract 1 from form length so we do not iterate over save button
  for (let i = 0, el; i < form.length - 1; i += 1) {
    el = form[i];
    newOptions[el.name] = el.value;
  }

  chrome.storage.sync.set(newOptions, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  const defaultOptions = {
    key: 'command',
    relative: 'same-tab',
    absolute: 'new-tab',
    tab: 'right',
    expiration: 0,
  };

  chrome.storage.sync.get(defaultOptions, (curOptions) => {
    // update options.html
    // looping over keys works for now if we're sticking to all dropdown lists
    Object.keys(curOptions).forEach((key) => {
      const el = document.querySelector(`select[name=${key}]`);
      if (el) el.namedItem(curOptions[key]).setAttribute('selected', true);
    });

    initFinalCountdown(curOptions.expiration);
  });
}

function setSleepTimer(e) {
  e.preventDefault();

  if (sleepTimerInterval) clearInterval(sleepTimerInterval);

  const duration = parseInt(e.target.duration.value, 10);
  const expiration = Date.now() + duration;

  chrome.storage.sync.set({ expiration }, () => {
    initFinalCountdown(expiration);
  });
}

function cancelSleepTimer(e) {
  e.preventDefault();

  chrome.storage.sync.set({ expiration: 0 }, () => {
    if (sleepTimerInterval) clearInterval(sleepTimerInterval);
    const finalCountdown = document.getElementById('finalCountdown');
    finalCountdown.textContent = '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('optionsForm').addEventListener('submit', saveOptions);
document.getElementById('sleepTimerForm').addEventListener('submit', setSleepTimer);
document.getElementById('cancelSleeptimer').addEventListener('click', cancelSleepTimer);
