(function () {
  var FF = {
    '--gold-deep': '#075985',
    '--gold-main': '#159DEB',
    '--gold-mid': '#46B7F5',
    '--gold-light': '#8BD8FF',
    '--gold-glow': '#FFFFFF',
    '--gold-deep-rgb': '7, 89, 133',
    '--gold-main-rgb': '21, 157, 235',
    '--gold-mid-rgb': '70, 183, 245',
    '--gold-light-rgb': '139, 216, 255',
    '--gold-glow-rgb': '255, 255, 255',
    '--gold-shadow-rgb': '3, 105, 161',
    '--border-gold': 'rgba(139,216,255, 0.4)',
    '--bg': '#09090B',
    '--bg-2': '#111113',
    '--bg-primary': '#09090B',
    '--btn-ink': '#09090B'
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
  var root = document.documentElement;
  root.setAttribute('data-brand', brand);
  Object.keys(FF).forEach(function (key) {
    root.style.setProperty(key, FF[key]);
  });

  window.__BRAND__ = brand;
  window.__BRAND_NAME__ = 'Fee Finders';
  window.__BRAND_CALENDLY__ = '159deb';
})();
