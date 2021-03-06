const init = (function init({ utils, enums, constants }) {
  return () => {
    let configureUI;

    const objectifyForm = (form) => {
      const hash = utils.formToHash(form, {
        suspendSwitch: input => input.checked,
        focusSwitch: input => input.checked,
      });
      hash.expiration = hash.suspendSwitch ?
        utils.get2amTomorrowInMsFrom(new Date()) :
        0;

      return hash;
    };

    const savePrefsForHostname = (hostname, prefsForm) => (e) => {
      e.preventDefault();
      const [subdomain, domain] = hostname;
      utils.sendMessage(enums.SAVE_OPTIONS_REQUESTED, {
        hostname,
        prefs: prefsForm ? objectifyForm(prefsForm) : utils.getDefaultPrefs(),
      }, ({ payload }) => {
        const settings = {
          hostname,
          prefs: utils.getPrefs(payload, subdomain, domain),
        };
        configureUI(settings);
        utils.updateIcon(settings);
      });
    };

    const disableForHostname = hostname => () => {
      const [subdomain, domain] = hostname;
      utils.sendMessage(enums.DISABLE_REQUESTED, { hostname },
        ({ payload }) => {
          const settings = {
            hostname,
            prefs: payload[domain][subdomain],
          };

          configureUI(settings);
          utils.updateIcon(settings);
        });
    };

    configureUI = (settings) => {
      const { hostname, prefs } = settings;
      const title = document.querySelector('#hostname');
      title.textContent = hostname.filter(x => x !== '*').join('.');

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
          focusSwitch: (input) => {
            input.checked = prefs.focusSwitch;
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
        const hostname = utils.getSubDomainOfUrl(activeTab.url);
        const [subdomain, domain] = hostname;
        return {
          hostname,
          prefs: utils.getPrefs(options, subdomain, domain),
        };
      })
      .then(configureUI)
      .then(utils.updateIcon)
      .then(() => {
        const sendFeedbackLinkClicked = () => {
          utils.getActiveTabInCurrentWindow()
            .then(tab => chrome.tabs.sendMessage(tab.id, {
              type: enums.FEEDBACK_CLICKED,
              payload: true,
            }));
        };

        document
          .getElementById('feedbackLink')
          .addEventListener('click', sendFeedbackLinkClicked);
      })
      .catch(console.log);
  };
}(window));

document.addEventListener('DOMContentLoaded', init);
