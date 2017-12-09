const init = (function init({ utils, enums, constants }) {
  return () => {
    const objectifyForm = (form) => {
      const hash = utils.formToHash(form, {
        suspendSwitch: input => input.checked,
      });

      hash.expiration = hash.suspendSwitch ?
        utils.get2amTomorrowInMsFrom(new Date()) :
        0;

      return hash;
    };

    const savePrefsForHostname = (hostname, prefsForm) => (e) => {
      e.preventDefault();
      utils.sendMessage(enums.SAVE_OPTIONS_REQUESTED, {
        hostname,
        prefs: prefsForm ? objectifyForm(prefsForm) : utils.getDefaultPrefs(),
      });
    };

    const disableForHostname = hostname => () => {
      utils.sendMessage(enums.DISABLE_REQUESTED, { hostname });
    };

    const configureUI = (settings) => {
      const { hostname, prefs } = settings;

      const title = document.querySelector('#hostname');
      title.textContent = hostname;

      const optionsForm = document.querySelector('#optionsForm');
      const button = document.querySelector('#optBtn');
      if (prefs) {
        utils.setFormValues(optionsForm, prefs, {
          suspendSwitch: (input) => {
            input.checked = utils.isSleepTimerEnabled(prefs.expiration, Date.now());
          },
        });
        optionsForm.classList.remove('hidden');
        optionsForm.addEventListener('change', savePrefsForHostname(hostname, optionsForm));
        button.addEventListener('click', disableForHostname(hostname), { once: true });
        button.textContent = constants.DISABLE_BUTTON_TEXT;
      } else {
        optionsForm.classList.add('hidden');
        button.addEventListener('click', savePrefsForHostname(hostname), { once: true });
        button.textContent = constants.ENABLE_BUTTON_TEXT;
      }

      return settings;
    };

    const listenForRuntimeMessages = ({ hostname }) => {
      chrome.runtime.onMessage.addListener(({ type, payload: options }) => {
        console.log('msg.type', type);
        configureUI({
          hostname,
          prefs: options[hostname],
        });
      });
    };

    Promise.all([utils.getOptions(), utils.getActiveTabInCurrentWindow()])
      .then(([options, activeTab]) => {
        const hostname = utils.getHostnameOfUrl(activeTab.url);
        return {
          hostname,
          prefs: options[hostname],
        };
      })
      .then(configureUI)
      .then(listenForRuntimeMessages)
      .catch(console.log);
  };
}(window));

document.addEventListener('DOMContentLoaded', init);
