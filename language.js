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

    function createBackToTop() {
        var btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', isZhPage() ? '回到顶部' : 'Back to top');
        btn.textContent = '↑';
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
        return btn;
    }

    function init() {
        var nav = document.querySelector('.nav-inner');
        if (!nav) return;

        // Inject language switcher
        var switcher = createSwitcher();
        nav.appendChild(switcher);

        // Inject back-to-top button
        document.body.appendChild(createBackToTop());

        // First-visit prompt: if user previously chose Chinese, redirect
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
