(function () {
  var FF = {
    '--gold-deep': '#4B5563',
    '--gold-main': '#9CA3AF',
    '--gold-mid': '#D1D5DB',
    '--gold-light': '#E5E7EB',
    '--gold-glow': '#FFFFFF',
    '--gold-deep-rgb': '75, 85, 99',
    '--gold-main-rgb': '156, 163, 175',
    '--gold-mid-rgb': '209, 213, 219',
    '--gold-light-rgb': '229, 231, 235',
    '--gold-glow-rgb': '255, 255, 255',
    '--gold-shadow-rgb': '55, 65, 81',
    '--border-gold': 'rgba(229, 231, 235, 0.4)',
    '--bg': '#09090B',
    '--bg-2': '#111113',
    '--bg-primary': '#09090B',
    '--btn-ink': '#09090B'
  };
  var WEN = {
    '--gold-deep': '#B8860B',
    '--gold-main': '#D4AF37',
    '--gold-mid': '#E5B83B',
    '--gold-light': '#F0C75E',
    '--gold-glow': '#F5D77E',
    '--gold-deep-rgb': '184, 134, 11',
    '--gold-main-rgb': '212, 175, 55',
    '--gold-mid-rgb': '229, 184, 59',
    '--gold-light-rgb': '240, 199, 94',
    '--gold-glow-rgb': '245, 215, 126',
    '--gold-shadow-rgb': '140, 109, 15',
    '--border-gold': 'rgba(240, 199, 94, 0.4)',
    '--bg': '#09090F',
    '--bg-2': '#0E0E16',
    '--bg-primary': '#09090F',
    '--btn-ink': '#1a1408'
  };

  function host() {
    return String(location.hostname || '').replace(/^www\./i, '').toLowerCase();
  }

  function detectBrand() {
    try {
      var q = new URLSearchParams(location.search).get('brand');
      if (q === 'ff' || q === 'wen') return q;
    } catch (e) {}
    var h = host();
    if (h === 'feefinders.xyz' || h.endsWith('.feefinders.xyz')) return 'ff';
    if (h === 'wholesalingelitenetwork.com' || h.endsWith('.wholesalingelitenetwork.com')) return 'wen';
    return 'ff';
  }

  var brand = detectBrand();
  var theme = brand === 'wen' ? WEN : FF;
  var root = document.documentElement;
  root.setAttribute('data-brand', brand);
  Object.keys(theme).forEach(function (key) {
    root.style.setProperty(key, theme[key]);
  });

  window.__BRAND__ = brand;
  window.__BRAND_NAME__ = brand === 'wen' ? 'Wholesale Elite Network' : 'Fee Finders';
  window.__BRAND_CALENDLY__ = brand === 'wen' ? 'e3b505' : 'd1d5db';

  function applyDom() {
    var name = window.__BRAND_NAME__;
    if (brand === 'wen') {
      document.title = document.title.replace(/Fee Finders/g, name);
      document.querySelectorAll('img[src*="fee-finders-logo"]').forEach(function (img) {
        img.src = '/images/logo-256.png?v=4';
        img.alt = name;
      });
      document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href.indexOf('favicon.webp') !== -1) link.href = '/images/wen-favicon.webp?v=4';
        else if (href.indexOf('favicon-32') !== -1) link.href = '/images/wen-favicon-32.png?v=4';
        else if (href.indexOf('favicon-16') !== -1) link.href = '/images/wen-favicon-16.png?v=4';
        else if (href.indexOf('apple-touch-icon') !== -1) link.href = '/images/wen-apple-touch-icon.png?v=4';
      });
      document.querySelectorAll('img[src*="placehold.co"]').forEach(function (img) {
        img.src = img.src.replace(/151517\/E5E7EB/g, '0f0f18/D4AF37');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDom);
  } else {
    applyDom();
  }
})();
