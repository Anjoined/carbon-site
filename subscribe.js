/**
 * Carbon Simple — Subscribe Form Handler
 *
 * Handles email subscription form submission.
 * POSTs to Cloudflare Worker endpoint.
 */

(function () {
    'use strict';

    // Replace with your deployed Worker URL
    var WORKER_URL = 'YOUR_WORKER_URL';

    function init() {
        var forms = document.querySelectorAll('.subscribe-form');
        forms.forEach(function (form) {
            form.addEventListener('submit', handleSubmit);
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        var form = e.target;
        var input = form.querySelector('input[type="email"]');
        var btn = form.querySelector('button');
        var msg = form.parentElement.querySelector('.subscribe-msg');

        var email = (input.value || '').trim();

        if (!email) {
            showMsg(msg, 'Please enter your email.', 'error');
            return;
        }

        // Prevent double submit
        if (btn.disabled) return;
        btn.disabled = true;
        btn.textContent = 'Subscribing...';

        fetch(WORKER_URL + '/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.error) {
                    showMsg(msg, data.error, 'error');
                } else {
                    showMsg(msg, data.message || 'Subscribed successfully!', 'success');
                    input.value = '';
                }
            })
            .catch(function () {
                showMsg(msg, 'Something went wrong. Please try again.', 'error');
            })
            .finally(function () {
                btn.disabled = false;
                btn.textContent = 'Subscribe';
            });
    }

    function showMsg(el, text, type) {
        el.textContent = text;
        el.className = 'subscribe-msg subscribe-msg-' + type;
        el.style.display = 'block';

        // Auto-hide success after 5s
        if (type === 'success') {
            setTimeout(function () {
                el.style.display = 'none';
            }, 5000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
