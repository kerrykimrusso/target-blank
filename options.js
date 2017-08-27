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

    // TODO message the content-script with new options
    chrome.runtime.connect().postMessage({
      type: 'OPTIONS_UPDATED',
      payload: {
        options: newOptions,
      },
    });
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
  };

  chrome.storage.sync.get(defaultOptions, (curOptions) => {
    // update options.html
    // looping over keys works for now if we're sticking to all dropdown lists
    Object.keys(curOptions).forEach((key) => {
      document.querySelector(`select[name=${key}]`).namedItem(curOptions[key]).setAttribute('selected', true);
    });
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('optionsForm').addEventListener('submit', saveOptions);
