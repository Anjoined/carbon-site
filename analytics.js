// Analytics Integration - Simplified for Static Pages

// Google Analytics 4 (GA4) configuration -适合静态页面的简化配置
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // 请替换为您的 GA4 测量 ID

// Function to initialize Google Analytics - 简化版本
function initializeGoogleAnalytics() {
    if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('Google Analytics is not configured. Please replace G-XXXXXXXXXX with your measurement ID.');
        return;
    }

    // 创建 GA4 脚本标签
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // 初始化 GA4
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID);

    console.log('Google Analytics initialized');
}

// Hotjar configuration - 暂时禁用，因为需要额外的配置
const HOTJAR_ENABLED = false;
const HOTJAR_ID = 1234567;
const HOTJAR_VERSION = 6;

// Function to initialize Hotjar - 简化版本，默认禁用
function initializeHotjar() {
    if (!HOTJAR_ENABLED || !HOTJAR_ID || HOTJAR_ID === 1234567) {
        console.warn('Hotjar is disabled or not properly configured.');
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=${HOTJAR_VERSION}`;
    document.body.appendChild(script);

    console.log('Hotjar initialized');
}

// Track page views
function trackPageView(url = window.location.pathname) {
    // Google Analytics
    if (typeof gtag === 'function') {
        gtag('config', GA4_MEASUREMENT_ID, {
            'page_path': url
        });
    }

    // Hotjar automatically tracks page views
}

// Track events
function trackEvent(category, action, label = null, value = null) {
    if (typeof gtag === 'function') {
        const eventData = {
            'event_category': category,
            'event_label': label,
            'value': value
        };
        // Remove properties with null values
        Object.keys(eventData).forEach(key => {
            if (eventData[key] === null) {
                delete eventData[key];
            }
        });
        gtag('event', action, eventData);
    }
}

// Track calculator usage
function trackCalculatorCalculation(totalFootprint, breakdown) {
    trackEvent('Calculator', 'Calculation Complete', null, totalFootprint);

    // Track category breakdown
    if (breakdown) {
        Object.keys(breakdown).forEach(category => {
            trackEvent('Calculator', 'Category Footprint', category, breakdown[category]);
        });
    }
}

// Track article views
function trackArticleView(title, category, readTime) {
    trackEvent('Article', 'View', category, readTime);
}

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics providers
    initializeGoogleAnalytics();
    initializeHotjar();

    // Track initial page view
    trackPageView();

    // Track calculator usage if on calculator page
    if (window.location.pathname.includes('calculator')) {
        // Track calculator page view
        trackEvent('Page View', 'Calculator');

        // Add calculation tracking
        const form = document.getElementById('calc-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                // We'll track after calculation completes
            });
        }
    }

    // Track article view if on article page
    if (window.location.pathname.includes('articles')) {
        // Get article information
        const titleElement = document.querySelector('.article-page h1');
        const metaElement = document.querySelector('.article-meta');
        if (titleElement) {
            trackArticleView(
                titleElement.textContent,
                metaElement ? metaElement.textContent.split(' · ')[0] : 'Unknown',
                metaElement ? parseInt(metaElement.textContent.match(/(\d+) min read/)?.[1] || 0) : 0
            );
        }
    }

    // Track link clicks
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href) {
                // Track internal vs external links
                if (href.startsWith('#') || href.startsWith('/')) {
                    trackEvent('Link', 'Internal Click', href);
                } else {
                    trackEvent('Link', 'External Click', href);
                }
            }
        }
    });
});

// Expose tracking functions to the global scope
window.trackPageView = trackPageView;
window.trackEvent = trackEvent;
window.trackCalculatorCalculation = trackCalculatorCalculation;
window.trackArticleView = trackArticleView;
