(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const api = name => fetch(`/live-api/${name}.json`, {cache: 'no-store'})
    .then(response => response.ok ? response.json() : null)
    .catch(() => null);
  const statusApi = () => fetch('/status.json', {cache: 'no-store'})
    .then(response => response.ok ? response.json() : null)
    .catch(() => null);
  const safe = (value, fallback = 'Unavailable') => value === undefined || value === null || value === '' ? fallback : value;
  const number = value => Number.parseFloat(value || 0) || 0;
  const token = value => number(value?.human ?? value?.ether ?? value);
  const tokenText = value => value === undefined || value === null ? '— MYST' : `${token(value).toLocaleString(undefined, {maximumFractionDigits: 6})} MYST`;
  const compactId = value => value && value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : safe(value);
  const set = (element, value) => { if (element) element.textContent = value; };
  const html = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));

  function bytes(value) {
    if (value === undefined || value === null) return '—';
    let amount = number(value);
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (amount >= 1024 && index < units.length - 1) { amount /= 1024; index += 1; }
    return `${amount.toLocaleString(undefined, {maximumFractionDigits: amount >= 10 ? 1 : 2})} ${units[index]}`;
  }

  function duration(seconds) {
    const total = Math.max(0, number(seconds));
    if (total >= 86400) return `${Math.floor(total / 86400)}d ${Math.floor((total % 86400) / 3600)}h`;
    if (total >= 3600) return `${Math.floor(total / 3600)}h ${Math.floor((total % 3600) / 60)}m`;
    if (total >= 60) return `${Math.floor(total / 60)} min`;
    return `${Math.floor(total)} sec`;
  }

  function serviceInfo(type = '') {
    const value = type.toLowerCase();
    if (value.includes('scraping')) return {key: 'scraping', label: 'B2B data scraping', letter: 'S', color: 'pink-bg'};
    if (value.includes('data_transfer')) return {key: 'data', label: 'B2B data transfer', letter: 'D', color: 'cyan-bg'};
    if (value.includes('dvpn')) return {key: 'dvpn', label: 'Mysterium VPN', letter: 'M', color: 'purple-bg'};
    if (value.includes('wireguard') || value.includes('openvpn')) return {key: 'public', label: 'Public VPN', letter: 'P', color: 'purple-bg'};
    return {key: value || 'other', label: value ? value.replaceAll('_', ' ') : 'Network service', letter: '?', color: 'cyan-bg'};
  }

  function drawSeries(svg, values, className) {
    if (!svg || !values?.length) return;
    const width = 720;
    const height = 145;
    const max = Math.max(...values, 1);
    const points = values.map((value, index) => `${index * width / Math.max(values.length - 1, 1)},${height - (value / max * 120)}`).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', points);
    path.setAttribute('class', `line ${className}`);
    svg.replaceChildren(path);
  }

  function renderSessionRows(container, sessions, limit) {
    if (!container) return;
    const header = $('.session-row.header', container);
    const empty = $('.session-empty', container);
    $$('.session-record, .session-row:not(.header)', container).forEach(row => row.remove());
    const records = (sessions || []).slice(0, limit || sessions?.length || 0);
    records.forEach(session => {
      const info = serviceInfo(session.service_type);
      const record = document.createElement(limit ? 'div' : 'div');
      record.className = limit ? 'session-row' : 'session-record';
      record.dataset.service = info.key;
      const country = safe(session.consumer_country, 'Private region');
      const row = limit ? record : document.createElement('div');
      if (!limit) {
        row.className = 'session-row expandable';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.setAttribute('aria-expanded', 'false');
      }
      row.innerHTML = `<span><i class="service-icon ${html(info.color)}">${html(info.letter)}</i> ${html(info.label)}</span><span>${html(country)}</span><span>${html(duration(session.duration_seconds))}</span><span>${html(bytes(session.transferred_bytes))}</span><span>${html(tokenText(session.earnings))}</span><span class="live"><i></i> Recorded${limit ? '' : ' ›'}</span>`;
      if (!limit) {
        const expanded = document.createElement('div');
        expanded.className = 'session-expanded';
        const started = session.started_at ? new Date(session.started_at).toLocaleString() : 'Unavailable';
        expanded.innerHTML = `<span>Session ID<strong>${html(compactId(session.id))}</strong></span><span>Started<strong>${html(started)}</strong></span><span>Service type<strong>${html(safe(session.service_type))}</strong></span><span>Traffic<strong>${html(bytes(session.transferred_bytes))}</strong></span>`;
        const toggle = () => { const open = record.classList.toggle('open'); row.setAttribute('aria-expanded', String(open)); };
        row.addEventListener('click', toggle);
        row.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
        record.append(row, expanded);
      }
      container.insertBefore(record, empty || null);
    });
    if (header) header.hidden = records.length === 0;
    if (empty) {
      empty.style.display = records.length ? 'none' : 'flex';
      set($('strong', empty), sessions ? 'No recent sessions' : 'Waiting for session data');
      set($('span', empty), sessions ? 'The node has not reported sessions in this period.' : 'The local collector has not produced a session snapshot yet.');
    }
  }

  function renderIdentity(identity, status) {
    const root = $('#identity');
    if (!root) return;
    const addressBox = $('.identity-address', root);
    const address = identity?.id;
    if (addressBox && address) addressBox.dataset.fullIdentity = address;
    set($('.identity-value', root), compactId(address));
    const metadata = $$('.identity-meta strong', root);
    set(metadata[0], identity?.registration_status ? `Registration: ${identity.registration_status}` : 'Identity detected');
    set(metadata[1], 'Persistent volume');
    set(metadata[2], status?.updated_at ? new Date(status.updated_at).toLocaleString() : 'Awaiting snapshot');
    set(metadata[3], status?.identity === 'Protected' ? 'Healthy' : safe(status?.identity));
    set($('.account-state strong', root), 'Manage in MystNodes');
    set($('.account-state span', root), 'Claim status is not exposed by the local node API');
    const protectedIdentity = status?.identity === 'Protected';
    set($('.identity-seal span', root), protectedIdentity ? 'VERIFIED' : 'WAITING');
    set($('.callout strong', root), protectedIdentity ? 'Identity protection is active' : 'Identity files not yet detected');
    set($('.callout p', root), protectedIdentity ? 'Your identity files are stored outside the container so updates will not reset your node.' : 'The persistent volume is ready; status will update after the node creates or loads an identity.');
  }

  function renderEarnings(identity, earnings, series) {
    const root = $('#earnings');
    if (!root) return;
    const lifetime = identity ? token(identity.earnings_total_tokens) : null;
    const unsettled = identity ? token(identity.earnings_tokens) : null;
    const balance = identity ? token(identity.balance_tokens) : null;
    set($('.earnings-hero h2', root), lifetime === null ? '— MYST' : `${lifetime.toLocaleString(undefined, {maximumFractionDigits: 6})} MYST`);
    const cards = $$('.detail-grid.thirds .metric-card', root);
    const labels = ['On-chain balance', 'Unsettled earnings', 'Lifetime earnings'];
    const values = [balance, unsettled, lifetime];
    const notes = ['Current identity balance', 'Awaiting settlement', 'All recorded earnings'];
    cards.forEach((card, index) => {
      set($('.metric-head span', card), labels[index]);
      set($(':scope > strong', card), values[index] === null ? '— MYST' : `${values[index].toLocaleString(undefined, {maximumFractionDigits: 6})} MYST`);
      set($(':scope > p', card), notes[index]);
    });
    renderEarningsBars(series, 'Last 30 days');
  }

  function renderEarningsBars(series, title) {
    const data = series?.data || [];
    const bars = $$('#earningsBars i');
    const valuesSeries = data.map(item => number(item.value));
    const max = Math.max(...valuesSeries, 1);
    bars.forEach((bar, index) => {
      const item = data[Math.floor(index * data.length / bars.length)];
      const value = number(item?.value);
      bar.style.height = `${value ? Math.max(5, value / max * 100) : 2}%`;
      bar.dataset.value = `${value.toLocaleString(undefined, {maximumFractionDigits: 6})} MYST`;
    });
    set($('#earningsRangeTitle'), title);
    set($('#earningsChange'), data.length ? `${data.length} reporting points` : 'Awaiting data');
  }

  function renderServices(services) {
    const root = $('#settings');
    if (!root) return;
    const running = new Set((services || []).filter(service => String(service.status).toLowerCase() !== 'stopped').map(service => service.type));
    const mappings = ['scraping', 'data_transfer', 'dvpn', 'wireguard'];
    const rows = $$('.service-toggle-grid .setting-row', root);
    rows.forEach((row, index) => {
      const enabled = mappings[index] === 'wireguard'
        ? [...running].some(type => type === 'wireguard' || type === 'openvpn')
        : running.has(mappings[index]);
      const button = $('.toggle', row);
      button?.classList.toggle('active', enabled);
      button?.setAttribute('aria-pressed', String(enabled));
      if (button) { button.disabled = true; button.title = 'Manage services in the official Node UI'; }
    });
    set($('.service-settings .health-score', root), `${rows.filter((_, index) => {
      const button = $('.toggle', rows[index]); return button?.classList.contains('active');
    }).length} running`);
    const hostToggle = $('.settings-list .toggle', root);
    if (hostToggle) { hostToggle.disabled = true; hostToggle.title = 'Managed by the app restart policy'; }
    const updateRow = $$('.settings-list .setting-row', root)[1];
    if (updateRow) {
      const copy = $('span', updateRow);
      if (copy?.firstChild) copy.firstChild.nodeValue = 'App updates';
      set($('small', updateRow), 'Installed through the 5tratumOS Store');
    }
  }

  function renderLogs(status, monitoring, services) {
    const stream = $('.log-stream');
    if (!stream) return;
    const entries = [
      ['NODE', safe(status?.mysterium), `Runtime ${safe(status?.node_version)}`],
      ['API', monitoring ? 'READY' : 'WAIT', monitoring ? `Monitoring status: ${safe(monitoring.status)}` : 'Waiting for TequilAPI snapshot'],
      ['SERV', services ? `${services.length}` : 'WAIT', services ? 'Provider services reported' : 'Waiting for service snapshot'],
      ['SYNC', status?.updated_at ? 'OK' : 'WAIT', status?.updated_at ? `Snapshot ${new Date(status.updated_at).toLocaleTimeString()}` : 'No status snapshot yet']
    ];
    stream.innerHTML = entries.map(([type, state, message]) => `<p><time>${html(type)}</time><span>${html(state)}</span>${html(message)}</p>`).join('');
    set($('#logsTitle'), 'Live status snapshot');
    set($('.logs-modal .eyebrow'), 'RUNTIME STATUS');
    set($('.logs-modal .health-score'), 'Snapshot');
  }

  async function refresh() {
    const [status, identityList, identity, services, nat, monitoring, quality, activity, earnings, sessions1d, count30d, transfer30d, dataSeries7d, earningsSeries30d] = await Promise.all([
      statusApi(), api('identities'), api('identity'), api('services'), api('nat'), api('monitoring-status'), api('quality'), api('activity'), api('service-earnings'), api('sessions-1d'), api('sessions-count-30d'), api('transferred-30d'), api('data-series-7d'), api('earnings-series-30d')
    ]);
    const online = status?.mysterium === 'Healthy';
    const currentIdentity = identity || (identityList?.identities?.[0] ? {id: identityList.identities[0].id} : null);
    const sessions = Array.isArray(sessions1d?.sessions) ? sessions1d.sessions : null;
    const recentCount = sessions ? sessions.length : null;
    const overviewCards = $$('#overview .metric-grid .metric-card');
    set($(':scope > strong', overviewCards[0]), tokenText(currentIdentity?.earnings_total_tokens || earnings?.total_tokens));
    set($(':scope > p', overviewCards[0]), 'Reported by the Mysterium runtime');
    set($(':scope > strong', overviewCards[1]), bytes(transfer30d?.transferred_data_bytes));
    set($(':scope > p', overviewCards[1]), 'Last 30 days');
    set($('.metric-head span', overviewCards[2]), 'Recent sessions');
    set($(':scope > strong', overviewCards[2]), recentCount === null ? '—' : String(recentCount));
    set($(':scope > p', overviewCards[2]), 'Reported in the last 24 hours');
    set($('.metric-head span', overviewCards[3]), 'Online time');
    set($(':scope > strong', overviewCards[3]), activity ? `${number(activity.online_percent).toFixed(1)}%` : safe(status?.host_uptime));
    set($(':scope > p', overviewCards[3]), activity ? 'Provider activity metric' : 'Host uptime');

    set($('#overview .status-pill'), online ? '● Everything looks good' : '● Node attention needed');
    set($('#overview .hero-copy > p'), online ? 'Live data is flowing from the official Mysterium runtime through a private local collector.' : 'The dashboard is waiting for the official Mysterium runtime.');
    set($('#overview .chart-summary strong'), bytes(transfer30d?.transferred_data_bytes));
    drawSeries($('#overview .chart svg'), (dataSeries7d?.data || []).map(item => number(item.value)), 'purple');
    const health = quality ? Math.round(number(quality.quality) * (number(quality.quality) <= 1 ? 100 : 1)) : 0;
    set($('#overview .health-score'), health ? `${health}% quality` : 'Awaiting quality');
    set($('#overview .health-ring strong'), health || '—');
    const healthValues = $$('#overview .health-list strong');
    set(healthValues[0], online ? '● Running' : '● Offline');
    set(healthValues[1], safe(nat?.type));
    set(healthValues[2], status?.identity === 'Protected' ? '● Secured' : safe(status?.identity));
    set(healthValues[3], status?.updated_at ? new Date(status.updated_at).toLocaleTimeString() : 'Waiting');
    renderSessionRows($('#overview .sessions-preview'), sessions, 3);

    const nodeCards = $$('#node .detail-grid.thirds .panel');
    set($('.big-stat', nodeCards[0]), safe(status?.node_version));
    set($('.big-stat', nodeCards[1]), online ? 'Online' : 'Offline');
    set($('.muted-copy', nodeCards[1]), status?.updated_at ? `Snapshot ${new Date(status.updated_at).toLocaleTimeString()}` : 'Awaiting heartbeat');
    set($('.big-stat', nodeCards[2]), safe(nat?.type));
    set($('.muted-copy', nodeCards[2]), nat ? 'Reported by Mysterium NAT probe' : 'Awaiting NAT probe');
    const components = $$('#node .status-table > div');
    set($('strong', components[0]), online ? 'Running' : 'Unavailable');
    set($('small', components[0]), safe(status?.host_uptime));
    set($('strong', components[1]), safe(monitoring?.status));
    set($('small', components[1]), 'Monitoring agent');
    set($('strong', components[2]), recentCount === null ? 'Waiting' : `${recentCount} recent`);
    set($('small', components[2]), 'Last 24 hours');
    set($('strong', components[3]), currentIdentity ? 'Identity loaded' : 'Waiting');
    set($('small', components[3]), compactId(currentIdentity?.id));

    renderIdentity(currentIdentity, status);
    renderEarnings(currentIdentity, earnings, earningsSeries30d);
    const sessionRoot = $('#sessions');
    set($('.detail-hero .status-pill', sessionRoot), recentCount === null ? '● Waiting for session data' : `● ${recentCount} sessions reported`);
    set($('.detail-hero h2', sessionRoot), 'Recent network sessions');
    set($('.detail-hero p', sessionRoot), 'Review session metrics reported by your node during the last 24 hours.');
    const totals = $$('.session-total strong', sessionRoot);
    set(totals[0], sessions ? bytes(sessions.reduce((sum, item) => sum + number(item.transferred_bytes), 0)) : '—');
    set($('.session-total span', sessionRoot), 'Transferred in recent sessions');
    set(totals[1], recentCount === null ? '—' : String(recentCount));
    set($$('.session-total span', sessionRoot)[1], 'Sessions in the last 24 hours');
    set($('.session-detail h3', sessionRoot), 'Last 24 hours');
    renderSessionRows($('.session-detail', sessionRoot), sessions);
    const sessionStats = $$('#sessions .detail-grid.two .panel');
    set($('.big-stat', sessionStats[0]), bytes(transfer30d?.transferred_data_bytes));
    set($('.muted-copy', sessionStats[0]), 'Transferred in the last 30 days');
    set($('.big-stat', sessionStats[1]), safe(count30d?.count, '—'));
    set($('.muted-copy', sessionStats[1]), 'Sessions in the last 30 days');

    const runtimeLabels = $$('#settings .version-list strong');
    set(runtimeLabels[0], safe(status?.app_version));
    set(runtimeLabels[1], safe(status?.node_version));
    set($('#settings .version-badge'), `Kraskus App ${safe(status?.app_version)}`);
    set($('#settings .account-setting h3'), 'Managed in the MystNodes dashboard');
    set($('#settings .account-setting p:last-of-type'), 'The local node API does not disclose MystNodes claim status. Open the dashboard to review or claim this node.');
    renderServices(services);
    renderLogs(status, monitoring, services);
    set($('.node-mini strong'), online ? 'Node online' : 'Node offline');
    set($('.node-mini span'), `Official runtime · ${safe(status?.node_version)}`);
  }

  $('#sessionFilter')?.addEventListener('change', event => {
    const records = $$('#sessions .session-record');
    let visible = 0;
    records.forEach(record => { const show = event.target.value === 'all' || record.dataset.service === event.target.value; record.hidden = !show; if (show) visible += 1; });
    const empty = $('#sessions .session-empty');
    if (empty) empty.style.display = visible ? 'none' : 'flex';
  });

  $$('[data-earnings-range="7d"], [data-earnings-range="30d"]').forEach(button => button.addEventListener('click', async () => {
    const range = button.dataset.earningsRange;
    renderEarningsBars(await api(`earnings-series-${range}`), range === '7d' ? 'Last 7 days' : 'Last 30 days');
  }));

  const trafficButtons = $$('#overview .traffic-panel .range-switch button');
  trafficButtons.forEach((button, index) => {
    if (index > 1) { button.disabled = true; button.title = 'The pinned runtime provides up to 30 days of series data'; return; }
    button.addEventListener('click', async () => {
      const range = index === 0 ? '7d' : '30d';
      const [series, total] = await Promise.all([api(`data-series-${range}`), api(`transferred-${range}`)]);
      drawSeries($('#overview .chart svg'), (series?.data || []).map(item => number(item.value)), 'purple');
      set($('#overview .chart-summary strong'), bytes(total?.transferred_data_bytes));
    });
  });

  $$('[data-earnings-range="90d"], [data-earnings-range="all"]').forEach(button => {
    button.disabled = true;
    button.title = 'The pinned runtime provides up to 30 days of series data';
  });

  $$('.metric-card > strong, .big-stat, .session-total strong').forEach(element => set(element, '—'));
  $$('.sessions-preview .session-row:not(.header), #sessions .session-record').forEach(element => element.remove());
  $$('#earningsBars i').forEach(bar => { bar.style.height = '2%'; bar.dataset.value = 'Awaiting live data'; });
  set($('.identity-value'), 'Waiting for identity…');
  set($('#overview .status-pill'), '● Connecting to runtime…');
  set($('[data-action="view-logs"]'), 'Live status →');
  renderServices(null);
  renderLogs(null, null, null);
  refresh();
  window.setInterval(refresh, 30000);
})();
