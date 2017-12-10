const init = (function init({ utils, enums, constants }) {
  return () => {
    let configureUI;

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
      }, ({ payload }) => {
        configureUI({
          hostname,
          prefs: payload[hostname],
        });
      });
    };

    const disableForHostname = hostname => () => {
      utils.sendMessage(enums.DISABLE_REQUESTED, { hostname },
        ({ payload }) => {
          configureUI({
            hostname,
            prefs: payload[hostname],
          });
        });
    };

    configureUI = (settings) => {
      const { hostname, prefs } = settings;

      const title = document.querySelector('#hostname');
      title.textContent = hostname;

      const optionsForm = document.querySelector('#optionsForm');
      const button = document.querySelector('#optBtn');
      if (prefs && prefs.enabled) {
        utils.setFormValues(optionsForm, prefs, {
          suspendSwitch: (input) => {
            const status = document.querySelector('.status');
            input.checked = utils.isSleepTimerEnabled(prefs.expiration, Date.now());
            if (input.checked) {
              status.textContent = `Extension will resume at ${utils.getReadableTimeFrom(prefs.expiration)}`;
            } else {
              status.textContent = '';
            }
          },

        });
        optionsForm.addEventListener('change', savePrefsForHostname(hostname, optionsForm), { once: true });

        button.addEventListener('click', disableForHostname(hostname), { once: true });
        button.textContent = constants.DISABLE_BUTTON_TEXT;
        optionsForm.classList.remove('hidden');
      } else {
        optionsForm.classList.add('hidden');
        button.addEventListener('click', savePrefsForHostname(hostname, optionsForm), { once: true });
        button.textContent = constants.ENABLE_BUTTON_TEXT;
      }

      return settings;
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
      .catch(console.log);
  };
}(window));

document.addEventListener('DOMContentLoaded', init);
