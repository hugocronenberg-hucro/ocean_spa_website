(function() {
    'use strict';

    var STORAGE_KEY = 'oceanSpaConsent';
    var consent = loadConsent();

    // Expose consent state globally
    window.oceanSpaConsent = consent;

    // Inject CSS
    var style = document.createElement('style');
    style.textContent = '\
/* Cookie Banner */\
.cb-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.2);z-index:99998;opacity:0;transition:opacity .3s;backdrop-filter:blur(4px)}\
.cb-overlay.cb-visible{opacity:1}\
.cb-overlay.cb-hidden{pointer-events:none;opacity:0}\
\
.cb-banner{position:fixed;bottom:0;left:0;right:0;z-index:99999;transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);font-family:"Inter",-apple-system,sans-serif}\
.cb-banner.cb-visible{transform:translateY(0)}\
\
.cb-inner{max-width:1200px;margin:0 auto;padding:28px 32px;background:#fff;border-top:1px solid #ECEEF1;box-shadow:0 -4px 24px rgba(0,0,0,0.06)}\
\
.cb-content{display:flex;align-items:flex-start;gap:28px;flex-wrap:wrap}\
\
.cb-text{flex:1;min-width:280px}\
.cb-title{font-family:"all-round-gothic",sans-serif;font-size:20px;color:#1A1A2E;margin-bottom:8px;font-weight:600}\
.cb-desc{font-size:14px;color:#6B7280;line-height:1.7}\
.cb-desc a{color:#5BA8A2;text-decoration:underline;text-underline-offset:2px}\
.cb-desc a:hover{color:#3D8A84}\
\
.cb-actions{display:flex;gap:12px;align-items:center;flex-shrink:0;flex-wrap:wrap}\
\
.cb-btn{padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;border:none;font-family:"Inter",sans-serif;white-space:nowrap}\
.cb-btn-accept{background:#5BA8A2;color:#fff}\
.cb-btn-accept:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(91,168,162,0.25);background:#3D8A84}\
.cb-btn-reject{background:#F7F8FA;color:#1A1A2E;border:1px solid #ECEEF1}\
.cb-btn-reject:hover{background:#ECEEF1;border-color:#9CA3AF}\
.cb-btn-settings{background:none;color:#5BA8A2;padding:12px 16px;text-decoration:underline;text-underline-offset:3px}\
.cb-btn-settings:hover{color:#3D8A84}\
\
/* Settings Modal */\
.cb-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);z-index:100000;width:94%;max-width:560px;max-height:85vh;overflow-y:auto;background:#fff;border-radius:20px;border:1px solid #ECEEF1;box-shadow:0 20px 60px rgba(0,0,0,0.1);padding:36px 32px;opacity:0;transition:all .3s;pointer-events:none;font-family:"Inter",-apple-system,sans-serif}\
.cb-modal.cb-visible{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}\
\
.cb-modal-title{font-family:"all-round-gothic",sans-serif;font-size:24px;color:#1A1A2E;margin-bottom:6px;font-weight:600}\
.cb-modal-sub{font-size:14px;color:#6B7280;margin-bottom:28px;line-height:1.6}\
\
.cb-category{background:#F7F8FA;border:1px solid #ECEEF1;border-radius:14px;padding:20px 22px;margin-bottom:14px}\
.cb-category:last-of-type{margin-bottom:28px}\
.cb-cat-header{display:flex;align-items:center;justify-content:space-between;gap:16px}\
.cb-cat-name{font-size:15px;font-weight:600;color:#1A1A2E}\
.cb-cat-badge{font-size:11px;color:#5BA8A2;background:#C0E3E0;padding:3px 10px;border-radius:20px;font-weight:600}\
.cb-cat-desc{font-size:13px;color:#6B7280;line-height:1.6;margin-top:8px}\
\
/* Toggle Switch */\
.cb-toggle{position:relative;width:46px;height:26px;flex-shrink:0}\
.cb-toggle input{opacity:0;width:0;height:0}\
.cb-toggle-slider{position:absolute;inset:0;background:#ECEEF1;border-radius:26px;cursor:pointer;transition:all .3s}\
.cb-toggle-slider::before{content:"";position:absolute;height:20px;width:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:all .3s}\
.cb-toggle input:checked+.cb-toggle-slider{background:#5BA8A2}\
.cb-toggle input:checked+.cb-toggle-slider::before{transform:translateX(20px)}\
.cb-toggle input:disabled+.cb-toggle-slider{opacity:0.7;cursor:not-allowed}\
\
.cb-modal-actions{display:flex;gap:12px;flex-wrap:wrap}\
.cb-modal-actions .cb-btn{flex:1;min-width:140px;text-align:center}\
\
/* Reopen Button */\
.cb-reopen{position:fixed;bottom:20px;left:20px;z-index:99997;background:#fff;border:1px solid #ECEEF1;color:#5BA8A2;padding:10px 18px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;font-family:"Inter",sans-serif;transition:all .3s;box-shadow:0 4px 16px rgba(0,0,0,0.06);opacity:0;transform:translateY(10px);pointer-events:none}\
.cb-reopen.cb-visible{opacity:1;transform:translateY(0);pointer-events:auto}\
.cb-reopen:hover{border-color:#5BA8A2;box-shadow:0 4px 16px rgba(91,168,162,0.15);transform:translateY(-2px)}\
\
/* Scrollbar for modal */\
.cb-modal::-webkit-scrollbar{width:6px}\
.cb-modal::-webkit-scrollbar-track{background:transparent}\
.cb-modal::-webkit-scrollbar-thumb{background:#ECEEF1;border-radius:3px}\
\
@media(max-width:640px){\
.cb-inner{padding:22px 20px}\
.cb-content{flex-direction:column;gap:20px}\
.cb-actions{width:100%}\
.cb-btn{flex:1;text-align:center;padding:14px 20px}\
.cb-btn-settings{flex-basis:100%;text-align:center}\
.cb-modal{padding:28px 22px;width:96%}\
.cb-modal-actions{flex-direction:column}\
.cb-modal-actions .cb-btn{min-width:auto}\
.cb-reopen{bottom:14px;left:14px;font-size:11px;padding:8px 14px}\
}';
    document.head.appendChild(style);

    // Build Banner HTML
    var banner = document.createElement('div');
    banner.className = 'cb-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML = '\
<div class="cb-inner">\
    <div class="cb-content">\
        <div class="cb-text">\
            <div class="cb-title">Ihre Privatsph\u00e4re ist uns wichtig</div>\
            <div class="cb-desc">Wir verwenden Cookies, um Ihnen die bestm\u00f6gliche Erfahrung auf unserer Website zu bieten. Einige Cookies sind f\u00fcr den Betrieb der Seite notwendig, w\u00e4hrend andere uns helfen, die Website zu verbessern. Mehr erfahren Sie in unserer <a href="datenschutz.html">Datenschutzerkl\u00e4rung</a>.</div>\
        </div>\
        <div class="cb-actions">\
            <button class="cb-btn cb-btn-accept" id="cbAcceptAll">Alle akzeptieren</button>\
            <button class="cb-btn cb-btn-reject" id="cbRejectAll">Nur notwendige</button>\
            <button class="cb-btn cb-btn-settings" id="cbOpenSettings">Einstellungen</button>\
        </div>\
    </div>\
</div>';

    // Build Overlay
    var overlay = document.createElement('div');
    overlay.className = 'cb-overlay cb-hidden';

    // Build Settings Modal
    var modal = document.createElement('div');
    modal.className = 'cb-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Cookie-Einstellungen anpassen');
    modal.innerHTML = '\
<div class="cb-modal-title">Cookie-Einstellungen</div>\
<div class="cb-modal-sub">W\u00e4hlen Sie, welche Cookies Sie zulassen m\u00f6chten. Notwendige Cookies k\u00f6nnen nicht deaktiviert werden, da sie f\u00fcr die Grundfunktionen der Website erforderlich sind.</div>\
\
<div class="cb-category">\
    <div class="cb-cat-header">\
        <div>\
            <div class="cb-cat-name">Notwendig</div>\
            <span class="cb-cat-badge">Immer aktiv</span>\
        </div>\
        <label class="cb-toggle">\
            <input type="checkbox" checked disabled>\
            <span class="cb-toggle-slider"></span>\
        </label>\
    </div>\
    <div class="cb-cat-desc">Diese Cookies sind f\u00fcr die Grundfunktionen der Website erforderlich und k\u00f6nnen nicht deaktiviert werden. Sie speichern z.\u00a0B. Ihre Cookie-Einstellungen.</div>\
</div>\
\
<div class="cb-category">\
    <div class="cb-cat-header">\
        <div class="cb-cat-name">Statistik</div>\
        <label class="cb-toggle">\
            <input type="checkbox" id="cbStatistik">\
            <span class="cb-toggle-slider"></span>\
        </label>\
    </div>\
    <div class="cb-cat-desc">Statistik-Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen. Alle Daten werden anonymisiert erfasst.</div>\
</div>\
\
<div class="cb-category">\
    <div class="cb-cat-header">\
        <div class="cb-cat-name">Marketing</div>\
        <label class="cb-toggle">\
            <input type="checkbox" id="cbMarketing">\
            <span class="cb-toggle-slider"></span>\
        </label>\
    </div>\
    <div class="cb-cat-desc">Marketing-Cookies werden verwendet, um Besuchern relevante Anzeigen und Informationen anzuzeigen.</div>\
</div>\
\
<div class="cb-modal-actions">\
    <button class="cb-btn cb-btn-accept" id="cbSaveSettings">Auswahl speichern</button>\
    <button class="cb-btn cb-btn-reject" id="cbAcceptAllModal">Alle akzeptieren</button>\
</div>';

    // Build Reopen Button
    var reopenBtn = document.createElement('button');
    reopenBtn.className = 'cb-reopen';
    reopenBtn.textContent = 'Cookie-Einstellungen';
    reopenBtn.setAttribute('aria-label', 'Cookie-Einstellungen \u00f6ffnen');

    // Append to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(banner);
    document.body.appendChild(modal);
    document.body.appendChild(reopenBtn);

    // State
    var statistikToggle = document.getElementById('cbStatistik');
    var marketingToggle = document.getElementById('cbMarketing');

    // Show/hide helpers
    function showBanner() {
        reopenBtn.classList.remove('cb-visible');
        setTimeout(function() { banner.classList.add('cb-visible'); }, 50);
    }

    function hideBanner() {
        banner.classList.remove('cb-visible');
        setTimeout(function() { reopenBtn.classList.add('cb-visible'); }, 400);
    }

    function showModal() {
        // Sync toggles with current consent
        statistikToggle.checked = consent ? consent.statistik : false;
        marketingToggle.checked = consent ? consent.marketing : false;
        overlay.classList.remove('cb-hidden');
        overlay.classList.add('cb-visible');
        modal.classList.add('cb-visible');
    }

    function hideModal() {
        modal.classList.remove('cb-visible');
        overlay.classList.remove('cb-visible');
        setTimeout(function() { overlay.classList.add('cb-hidden'); }, 300);
    }

    function saveConsent(statistik, marketing) {
        consent = { necessary: true, statistik: statistik, marketing: marketing, timestamp: Date.now() };
        window.oceanSpaConsent = consent;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch(e) {}
        hideBanner();
        hideModal();
        applyConsent();
    }

    function loadConsent() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        return null;
    }

    function applyConsent() {
        // Fire a custom event so other scripts can react
        var event;
        try { event = new CustomEvent('oceanSpaConsentUpdate', { detail: consent }); }
        catch(e) { event = document.createEvent('CustomEvent'); event.initCustomEvent('oceanSpaConsentUpdate', true, true, consent); }
        document.dispatchEvent(event);
    }

    // Event Listeners
    document.getElementById('cbAcceptAll').addEventListener('click', function() {
        saveConsent(true, true);
    });

    document.getElementById('cbRejectAll').addEventListener('click', function() {
        saveConsent(false, false);
    });

    document.getElementById('cbOpenSettings').addEventListener('click', function() {
        banner.classList.remove('cb-visible');
        setTimeout(showModal, 300);
    });

    document.getElementById('cbSaveSettings').addEventListener('click', function() {
        saveConsent(statistikToggle.checked, marketingToggle.checked);
    });

    document.getElementById('cbAcceptAllModal').addEventListener('click', function() {
        saveConsent(true, true);
    });

    overlay.addEventListener('click', function() {
        hideModal();
        if (!consent) showBanner();
    });

    reopenBtn.addEventListener('click', function() {
        showModal();
        reopenBtn.classList.remove('cb-visible');
    });

    // Init: show banner or reopen button
    if (!consent) {
        // First visit - show banner after short delay
        setTimeout(showBanner, 800);
    } else {
        // Returning visitor - show reopen button, apply consent
        reopenBtn.classList.add('cb-visible');
        applyConsent();
    }

})();
