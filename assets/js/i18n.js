/* ==========================================================================
   Basel Buddhist Vihara — i18n / Language Switcher
   Supported languages: de (default), en, si
   ========================================================================== */

(function () {
  'use strict';

  var SUPPORTED_LANGS = ['de', 'en', 'si'];
  var DEFAULT_LANG = 'de';
  var STORAGE_KEY = 'bbv_lang';

  // Resolved relative to this script's own location (assets/js/i18n.js) so it
  // still finds data/translations.json when the page lives in a subfolder
  // (e.g. monks/kalyanatissa.html).
  var TRANSLATIONS_URL = document.currentScript
    ? new URL('../../data/translations.json', document.currentScript.src).href
    : 'data/translations.json';

  var translations = null;
  var currentLang = DEFAULT_LANG;

  /**
   * Resolves a dot-notated key (e.g. "nav.home") against a translations object.
   */
  function resolveKey(obj, key) {
    return key.split('.').reduce(function (value, part) {
      return value && Object.prototype.hasOwnProperty.call(value, part)
        ? value[part]
        : undefined;
    }, obj);
  }

  function getStoredLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.indexOf(stored) !== -1 ? stored : null;
    } catch (e) {
      return null;
    }
  }

  // First visit: use the browser's preferred language if we support it
  // (e.g. an English or Sinhala phone), otherwise German.
  function detectBrowserLang() {
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.indexOf(code) !== -1) return code;
    }
    return null;
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — fail silently */
    }
  }

  function translate(key, lang) {
    if (!translations) return key;
    var langData = translations[lang] || translations[DEFAULT_LANG];
    var value = resolveKey(langData, key);
    if (value === undefined) {
      value = resolveKey(translations[DEFAULT_LANG], key);
    }
    return value !== undefined ? value : key;
  }

  /**
   * Applies the current language to every [data-i18n] element (text content)
   * and every [data-i18n-attr] element (attribute translations, e.g.
   * data-i18n-attr="placeholder:contact.email|aria-label:nav.home").
   */
  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = translate(key, lang);
    });

    // data-i18n-html: same lookup, but renders the translation as markup —
    // used where a translated sentence contains inline links (e.g. hero.description).
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = translate(key, lang);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var pairs = el.getAttribute('data-i18n-attr').split('|');
      pairs.forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var attr = parts[0].trim();
        var key = parts[1].trim();
        el.setAttribute(attr, translate(key, lang));
      });
    });

    document.documentElement.setAttribute('lang', lang);
  }

  function updateSwitcherState(lang) {
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    currentLang = lang;
    storeLang(lang);
    applyTranslations(lang);
    updateSwitcherState(lang);
    document.dispatchEvent(
      new CustomEvent('i18n:change', { detail: { lang: lang } })
    );
  }

  function bindSwitcherButtons() {
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  function loadTranslations() {
    return fetch(TRANSLATIONS_URL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to load translations: ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        translations = data;
      });
  }

  function init() {
    loadTranslations()
      .then(function () {
        var lang = getStoredLang() || detectBrowserLang() || DEFAULT_LANG;
        bindSwitcherButtons();
        setLanguage(lang);
      })
      .catch(function (err) {
        console.error('[i18n] Could not initialize translations:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API for use by main.js or other scripts
  window.i18n = {
    t: function (key) {
      return translate(key, currentLang);
    },
    setLanguage: setLanguage,
    getLanguage: function () {
      return currentLang;
    },
    supportedLanguages: SUPPORTED_LANGS
  };
})();
