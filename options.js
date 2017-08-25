// Saves options to chrome.storage.sync.
function saveOptions() {
  const color = document.getElementById('color').value;
  const likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor,
  }, () => {
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
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'blue',
    likesColor: true,
  }, (items) => {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);


//    span.command-shortcut-text.onblur

//    handleBlur_: function(event) {
//       this.endCapture_(event);
//       var commandShortcut = event.target.parentElement;
//       commandShortcut.classList.remove('focused');
//     }

//   span.command-shortcut-text.onfocus
//     handleFocus_: function(event) {
//       var commandShortcut = event.target.parentElement;
//       commandShortcut.classList.add('focused');
//     }

//  span.command-shortcut-text.onkeydown
// handleKeyDown_: function(event) {
//   event = /** @type {KeyboardEvent} */(event);
//   if (event.keyCode == extensions.Key.Escape) {
//     if (!this.capturingElement_) {
//       // If we're not currently capturing, allow escape to propagate (so it
//       // can close the overflow).
//       return;
//     }
//     // Otherwise, escape cancels capturing.
//     this.endCapture_(event);
//     var parsed = this.parseElementId_('clear',
//         event.target.parentElement.querySelector('.command-clear').id);
//     chrome.developerPrivate.updateExtensionCommand({
//       extensionId: parsed.extensionId,
//       commandName: parsed.commandName,
//       keybinding: ''
//     });
//     event.preventDefault();
//     event.stopPropagation();
//     return;
//   }
//   if (event.keyCode == extensions.Key.Tab) {
//     // Allow tab propagation for keyboard navigation.
//     return;
//   }

//   if (!this.capturingElement_)
//     this.startCapture_(event);

//   this.handleKey_(event);
// }

// span.command-shortcut-text.onkeyup
//     handleKeyUp_: function(event) {
//   event = /** @type {KeyboardEvent} */(event);
//   if (event.keyCode == extensions.Key.Tab ||
//       event.keyCode == extensions.Key.Escape) {
//     // We need to allow tab propagation for keyboard navigation, and escapes
//     // are fully handled in handleKeyDown.
//     return;
//   }

//   // We want to make it easy to change from Ctrl+Shift+ to just Ctrl+ by
//   // releasing Shift, but we also don't want it to be easy to lose for
//   // example Ctrl+Shift+F to Ctrl+ just because you didn't release Ctrl
//   // as fast as the other two keys. Therefore, we process KeyUp until you
//   // have a valid combination and then stop processing it (meaning that once
//   // you have a valid combination, we won't change it until the next
//   // KeyDown message arrives).
//   if (!this.currentKeyEvent_ ||
//       !extensions.isValidKeyCode(this.currentKeyEvent_.keyCode)) {
//     if (!event.ctrlKey && !event.altKey ||
//         ((cr.isMac || cr.isChromeOS) && !event.metaKey)) {
//       // If neither Ctrl nor Alt is pressed then it is not a valid shortcut.
//       // That means we're back at the starting point so we should restart
//       // capture.
//       this.endCapture_(event);
//       this.startCapture_(event);
//     } else {
//       this.handleKey_(event);
//     }
//   }
// }

// command-shortcut-text.onmouseup
//  startCapture_: function(event) {
//   if (this.capturingElement_)
//     return;  // Already capturing.

//   chrome.developerPrivate.setShortcutHandlingSuspended(true);

//   var shortcutNode = event.target;
//   this.oldValue_ = shortcutNode.textContent;
//   shortcutNode.textContent =
//       loadTimeData.getString('extensionCommandsStartTyping');
//   shortcutNode.parentElement.classList.add('capturing');

//   var commandClear =
//       shortcutNode.parentElement.querySelector('.command-clear');
//   commandClear.hidden = true;

//   this.capturingElement_ = /** @type {HTMLElement} */(event.target);
// }
