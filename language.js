// Language Support — URL-based navigation
// Detects language preference and provides language switcher link

(function () {
    'use strict';

    var STORAGE_KEY = 'carbon-lang';

    function getAlternateUrl() {
        var path = window.location.pathname;
        if (path.startsWith('/zh/')) {
            return path.replace('/zh/', '/') || '/';
        }
        return '/zh' + path;
    }

    function isZhPage() {
        return window.location.pathname.startsWith('/zh/');
    }

    function createSwitcher() {
        var link = document.createElement('a');
        link.href = getAlternateUrl();
        link.className = 'lang-switch';
        link.textContent = isZhPage() ? 'English' : '中文';
        link.addEventListener('click', function () {
            localStorage.setItem(STORAGE_KEY, isZhPage() ? 'en' : 'zh');
        });
        return link;
    }

    function init() {
        var nav = document.querySelector('.nav-inner');
        if (!nav) return;

        // Inject language switcher
        var switcher = createSwitcher();
        nav.appendChild(switcher);

        // First-visit prompt: if browser language is zh and user is on English page
        // (only redirect if user previously chose Chinese)
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'zh' && !isZhPage()) {
            window.location.href = getAlternateUrl();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
