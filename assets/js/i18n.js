/* ==========================================================================
   Basel Buddhist Vihara — i18n / Language Switcher
   Supported languages: de (default), en, si
   ========================================================================== */

(function () {
  'use strict';

  var SUPPORTED_LANGS = ['de', 'en', 'si'];
  var DEFAULT_LANG = 'de';
  var STORAGE_KEY = 'bbv_lang';
  var TRANSLATIONS_URL = 'data/translations.json';

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
        var lang = getStoredLang() || DEFAULT_LANG;
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
