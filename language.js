// Language Support Functionality

// Language data structure
const languageData = {
    'en': {
        'nav': {
            'calculator': 'Calculator',
            'articles': 'Articles',
            'about': 'About'
        },
        'hero': {
            'tag': 'Data-Driven Climate Action',
            'title': 'Know Your Footprint.<br>Reduce It Effectively.',
            'desc': 'The average person emits about 4 tonnes of CO₂ per year. Find out your number, and learn which actions actually make a difference.',
            'btn1': 'Calculate My Footprint',
            'btn2': 'See Top Actions'
        },
        'features': {
            'calculate': 'Calculate',
            'calculateDesc': 'Find out your annual carbon footprint across transport, food, housing, and consumption.',
            'prioritize': 'Prioritize',
            'prioritizeDesc': 'Not all actions are equal. We rank them by actual CO₂ reduction potential.',
            'act': 'Act',
            'actDesc': 'Practical guides for every lifestyle — apartments, families, students, remote workers.'
        },
        'latestArticles': 'Latest Articles'
    },
    'zh': {
        'nav': {
            'calculator': '计算器',
            'articles': '文章',
            'about': '关于'
        },
        'hero': {
            'tag': '数据驱动的气候行动',
            'title': '了解你的碳足迹.<br>有效减少它.',
            'desc': '平均每人每年排放约 4 吨 CO₂。找出你的数字，并了解哪些行动真正起作用。',
            'btn1': '计算我的碳足迹',
            'btn2': '查看最佳行动'
        },
        'features': {
            'calculate': '计算',
            'calculateDesc': '找出您在交通、食物、住房和消费方面的年度碳足迹。',
            'prioritize': '优先',
            'prioritizeDesc': '并非所有行动都是平等的。我们按实际的 CO₂ 减排潜力对它们进行排名。',
            'act': '行动',
            'actDesc': '适合各种生活方式的实用指南——公寓、家庭、学生、远程工作者。'
        },
        'latestArticles': '最新文章'
    }
};

// Get current language from URL or browser preference
function getCurrentLanguage() {
    // Check for language in URL query parameter (e.g., ?lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['en', 'zh'].includes(langParam)) {
        return langParam;
    }

    // Check for language in localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang && ['en', 'zh'].includes(storedLang)) {
        return storedLang;
    }

    // Check browser language preference
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'zh'].includes(browserLang)) {
        return browserLang;
    }

    // Default to English
    return 'en';
}

// Set current language
function setLanguage(lang) {
    if (!['en', 'zh'].includes(lang)) {
        lang = 'en';
    }

    localStorage.setItem('language', lang);

    // Update language in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (lang === 'en') {
        urlParams.delete('lang');
    } else {
        urlParams.set('lang', lang);
    }

    // Change language without reload if possible
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
    if (window.history.replaceState) {
        window.history.replaceState(null, null, newUrl);
    }

    // Apply language to UI
    applyLanguage(lang);
}

// Apply language to UI
function applyLanguage(lang) {
    const translations = languageData[lang];

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length >= 3) {
        navLinks[0].textContent = translations.nav.calculator;
        navLinks[1].textContent = translations.nav.articles;
        navLinks[2].textContent = translations.nav.about;
    }

    // Update hero section
    const heroTag = document.querySelector('.hero-tag');
    const heroTitle = document.querySelector('.hero h1');
    const heroDesc = document.querySelector('.hero-desc');
    const heroButtons = document.querySelectorAll('.hero-actions .btn');

    if (heroTag) heroTag.textContent = translations.hero.tag;
    if (heroTitle) heroTitle.innerHTML = translations.hero.title;
    if (heroDesc) heroDesc.textContent = translations.hero.desc;
    if (heroButtons.length >= 2) {
        heroButtons[0].textContent = translations.hero.btn1;
        heroButtons[1].textContent = translations.hero.btn2;
    }

    // Update features section
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length >= 3) {
        const features = [
            { title: translations.features.calculate, desc: translations.features.calculateDesc },
            { title: translations.features.prioritize, desc: translations.features.prioritizeDesc },
            { title: translations.features.act, desc: translations.features.actDesc }
        ];

        featureCards.forEach((card, index) => {
            if (index < features.length) {
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                if (h3) h3.textContent = features[index].title;
                if (p) p.textContent = features[index].desc;
            }
        });
    }

    // Update latest articles section
    const latestArticlesTitle = document.querySelector('.latest h2');
    if (latestArticlesTitle) {
        latestArticlesTitle.textContent = translations.latestArticles;
    }

    // Update page title if necessary
    document.documentElement.lang = lang;
}

// Create language switcher element
function createLanguageSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
        <select id="language-select">
            <option value="en">English</option>
            <option value="zh">中文</option>
        </select>
    `;

    const select = switcher.querySelector('#language-select');
    select.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    return switcher;
}

// Initialize language support
document.addEventListener('DOMContentLoaded', function() {
    // Get current language
    const currentLang = getCurrentLanguage();

    // Apply language to UI
    applyLanguage(currentLang);

    // Add language switcher to navigation if it doesn't exist
    const nav = document.querySelector('.nav-inner');
    if (nav && !document.querySelector('.language-switcher')) {
        const languageSwitcher = createLanguageSwitcher();
        nav.appendChild(languageSwitcher);

        // Set initial selected language
        const select = languageSwitcher.querySelector('#language-select');
        select.value = currentLang;
    }

    // Load language switcher styles (can also be added to CSS)
    if (!document.getElementById('language-styles')) {
        const style = document.createElement('style');
        style.id = 'language-styles';
        style.textContent = `
            .language-switcher {
                margin-left: 16px;
            }
            .language-switcher select {
                padding: 6px 12px;
                border: 1px solid var(--border);
                border-radius: 4px;
                background: var(--surface);
                font-size: 0.9rem;
                font-family: inherit;
                cursor: pointer;
            }
            .language-switcher select:focus {
                outline: none;
                border-color: var(--accent);
                box-shadow: 0 0 0 3px var(--accent-light);
            }

            @media (max-width: 640px) {
                .language-switcher {
                    margin: 8px 0 0 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
