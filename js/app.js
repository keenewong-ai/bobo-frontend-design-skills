(function () {
  const DATA_URLS = [
    'data/skills.json',
    '../data/skills.json',
    '/bobo-frontend-design-skills/data/skills.json'
  ];

  function qs(sel, el) { return (el || document).querySelector(sel); }
  function qsa(sel, el) { return Array.from((el || document).querySelectorAll(sel)); }

  async function loadCatalog() {
    let lastErr;
    for (const url of DATA_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(url + ' ' + res.status);
        return await res.json();
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('skills.json not found');
  }

  function skillHref(id, base) {
    // Prefer pretty path when on Pages / local static tree
    if (base === 'pretty') return 'skills/' + encodeURIComponent(id) + '/';
    if (base === 'up') return '../skills/' + encodeURIComponent(id) + '/';
    return 'skill.html?id=' + encodeURIComponent(id);
  }

  function renderList(catalog) {
    const grid = qs('#skill-grid');
    const empty = qs('#empty');
    const search = qs('#search');
    const filters = qs('#filters');
    if (!grid) return;

    const skills = catalog.skills || [];
    const categories = Array.from(new Set(skills.map(s => s.category))).sort();
    let activeCat = 'all';
    let query = '';

    filters.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'filter-btn';
    allBtn.textContent = '全部';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.dataset.cat = 'all';
    filters.appendChild(allBtn);
    categories.forEach(cat => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'filter-btn';
      const label = (skills.find(s => s.category === cat) || {}).categoryLabel || cat;
      b.textContent = label;
      b.dataset.cat = cat;
      b.setAttribute('aria-pressed', 'false');
      filters.appendChild(b);
    });

    function paint() {
      const q = query.trim().toLowerCase();
      const list = skills.filter(s => {
        if (activeCat !== 'all' && s.category !== activeCat) return false;
        if (!q) return true;
        const blob = [s.id, s.title, s.description, s.summary, ...(s.tags || [])].join(' ').toLowerCase();
        return blob.includes(q);
      });
      grid.innerHTML = '';
      if (!list.length) {
        empty.hidden = false;
        return;
      }
      empty.hidden = true;
      list.forEach(s => {
        const a = document.createElement('a');
        a.className = 'card';
        a.href = skillHref(s.id, 'pretty');
        const tags = (s.tags || []).slice(0, 4).map(t =>
          '<span class="tag">' + escapeHtml(t) + '</span>'
        ).join('');
        const pri = s.priority ? '<span class="tag priority">priority</span>' : '';
        a.innerHTML =
          '<div class="id">' + escapeHtml(s.id) + '</div>' +
          '<h2>' + escapeHtml(s.title) + '</h2>' +
          '<p class="desc">' + escapeHtml(s.description) + '</p>' +
          (s.summary ? '<p class="desc" style="color:#b7c9d1">' + escapeHtml(s.summary) + '</p>' : '') +
          '<div class="tags">' + pri + tags + '</div>';
        grid.appendChild(a);
      });
    }

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeCat = btn.dataset.cat;
      qsa('.filter-btn', filters).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      paint();
    });
    if (search) {
      search.addEventListener('input', () => { query = search.value || ''; paint(); });
    }
    paint();
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function listBlock(title, purpose, items, extraClass) {
    if (!items || !items.length) return '';
    const lis = items.map(i => '<li>' + escapeHtml(typeof i === 'string' ? i : JSON.stringify(i)) + '</li>').join('');
    return (
      '<section class="block ' + (extraClass || '') + '">' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        (purpose ? '<p class="purpose">' + escapeHtml(purpose) + '</p>' : '') +
        '<ul>' + lis + '</ul>' +
      '</section>'
    );
  }

  function objectBlock(title, purpose, obj) {
    if (!obj || typeof obj !== 'object') return '';
    const lis = Object.keys(obj).map(k =>
      '<li><strong>' + escapeHtml(k) + '：</strong>' + escapeHtml(String(obj[k])) + '</li>'
    ).join('');
    return (
      '<section class="block">' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        (purpose ? '<p class="purpose">' + escapeHtml(purpose) + '</p>' : '') +
        '<ul>' + lis + '</ul>' +
      '</section>'
    );
  }

  function variantsBlock(s) {
    const variants = s.variants || [];
    if (!variants.length) return '';
    const purpose = (s.sections && s.sections.variants) || '';
    const body = variants.map(v =>
      '<div class="variant"><span class="vid">' + escapeHtml(v.id || '') + '</span>' +
      '<strong>' + escapeHtml(v.name || '') + '</strong>' +
      '<div style="margin-top:6px;font-size:14px;color:var(--muted)">' + escapeHtml(v.description || '') + '</div></div>'
    ).join('');
    return (
      '<section class="block">' +
        '<h2>Variants</h2>' +
        (purpose ? '<p class="purpose">' + escapeHtml(purpose) + '</p>' : '') +
        body +
      '</section>'
    );
  }

  function renderDetail(catalog, id) {
    const root = qs('#skill-detail');
    if (!root) return;
    const skill = (catalog.skills || []).find(s => s.id === id);
    if (!skill) {
      root.innerHTML = '<p class="empty">搵唔到 skill：<code>' + escapeHtml(id) + '</code>。<a href="../../index.html">返回列表</a></p>';
      return;
    }
    document.title = skill.title + ' · BoBo Front-end Design Skills';
    const sec = skill.sections || {};
    const demoPath = skill.demo
      ? (location.pathname.includes('/skills/') ? '../../' + skill.demo : skill.demo)
      : null;
    const backHref = location.pathname.includes('/skills/') ? '../../index.html' : 'index.html';

    root.innerHTML =
      '<p class="crumb"><a href="' + backHref + '">← Skills</a> / ' + escapeHtml(skill.categoryLabel || skill.category) + '</p>' +
      '<div class="detail-head">' +
        '<div class="id">' + escapeHtml(skill.id) + '</div>' +
        '<h1>' + escapeHtml(skill.title) + '</h1>' +
        '<p class="lead">' + escapeHtml(skill.description) + '</p>' +
        (skill.summary ? '<p class="lead" style="color:var(--muted);font-size:14px">' + escapeHtml(skill.summary) + '</p>' : '') +
        '<div class="meta">' +
          '<span class="chip">' + escapeHtml(skill.categoryLabel || skill.category) + '</span>' +
          (skill.priority ? '<span class="chip active">Priority #1</span>' : '') +
          (skill.tags || []).map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join('') +
        '</div>' +
      '</div>' +
      listBlock('When to apply', sec.whenToApply, skill.whenToApply) +
      listBlock('Mechanism', sec.mechanism, skill.mechanism) +
      objectBlock('Visual spec', sec.visualSpec, skill.visualSpec) +
      listBlock('Steps', '實作步驟（suggested）', skill.steps) +
      listBlock('CSS / interaction 要點', sec.cssNotes, skill.cssNotes) +
      variantsBlock(skill) +
      listBlock('唔好做咩', sec.dontDo, skill.dontDo, 'dont') +
      (demoPath
        ? ('<section class="block"><h2>Demo</h2>' +
           '<p class="purpose">互動示範（self-contained）</p>' +
           '<div class="demo-frame"><iframe title="demo" src="' + escapeHtml(demoPath) + '" loading="lazy"></iframe></div>' +
           '<a class="demo-link" href="' + escapeHtml(demoPath) + '" target="_blank" rel="noopener">開新分頁睇 demo →</a></section>')
        : '') +
      (skill.source
        ? ('<section class="block"><h2>Source</h2><p style="margin:0;font-size:14px;color:var(--muted)">' +
           escapeHtml(skill.source) + '</p></section>')
        : '');
  }

  function getDetailId() {
    if (window.SKILL_ID) return window.SKILL_ID;
    const params = new URLSearchParams(location.search);
    if (params.get('id')) return params.get('id');
    const hash = (location.hash || '').replace(/^#/, '');
    if (hash) return hash;
    const m = location.pathname.match(/\/skills\/([^\/]+)\/?$/);
    if (m) return decodeURIComponent(m[1]);
    return null;
  }

  async function main() {
    const mode = document.body.dataset.page;
    try {
      const catalog = await loadCatalog();
      if (mode === 'list') renderList(catalog);
      if (mode === 'detail') {
        const id = getDetailId();
        if (!id) {
          qs('#skill-detail').innerHTML = '<p class="empty">缺 id。用 <code>skill.html?id=…</code> 或 <code>/skills/&lt;id&gt;/</code>。</p>';
          return;
        }
        renderDetail(catalog, id);
      }
    } catch (err) {
      const el = qs('#skill-grid') || qs('#skill-detail');
      if (el) el.innerHTML = '<p class="empty">載入 skills.json 失敗：' + escapeHtml(err.message || err) + '</p>';
      console.error(err);
    }
  }

  main();
})();
