/* ReferTRM Academy — glossary hear engine (vocabularyMm drawer).
   Progressive enhancement only: if the device cannot speak, the buttons
   stay hidden and the drawer reads complete without them.
   Voice is the learner's own device (SpeechSynthesis) — no network, 3G-safe.
   iOS: speak() right after cancel() is swallowed, so we delay + resume,
   and we never pin a voice object on iOS. */
(function () {
  'use strict';
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  var IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);

  var current = null; /* the button currently speaking */

  function clearSpeaking() {
    if (current) { current.classList.remove('speaking'); current = null; }
  }

  function speak(text, btn) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var go = function () {
      var u;
      try {
        u = new SpeechSynthesisUtterance(text);
      } catch (e) { return; }
      u.rate = 0.95;
      u.lang = 'en-US';
      u.onstart = function () {
        clearSpeaking();
        current = btn;
        btn.classList.add('speaking');
      };
      u.onend = u.onerror = function () {
        if (current === btn) clearSpeaking();
      };
      try { window.speechSynthesis.speak(u); } catch (e) {}
      if (IS_IOS) { try { window.speechSynthesis.resume(); } catch (e) {} }
    };
    if (IS_IOS) { setTimeout(go, 60); } else { go(); }
  }

  var btns = document.querySelectorAll('#vocab .vhear[data-say]');
  if (!btns.length) return;
  Array.prototype.forEach.call(btns, function (b) {
    b.removeAttribute('hidden');
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      speak(b.getAttribute('data-say'), b);
    });
  });
})();
