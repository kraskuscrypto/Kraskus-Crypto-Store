(() => {
  'use strict';

  const APP_RELEASE = '2.6.11';
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
  const formatToken = value => {
    const amount = token(value);
    const digits = Math.abs(amount) > 0 && Math.abs(amount) < 0.01 ? 6 : 2;
    return amount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: digits});
  };
  const tokenText = value => value === undefined || value === null ? '— MYST' : `${formatToken(value)} MYST`;
  const compactId = value => value && value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : safe(value);
  const set = (element, value) => { if (element) element.textContent = value; };
  const natLabel = value => ({
    prcone: 'Port-restricted cone',
    restricted: 'Restricted cone',
    fullcone: 'Full cone',
    symmetric: 'Symmetric',
    open: 'Open / public',
    unknown: 'Unknown'
  }[String(value || '').toLowerCase()] || safe(value));
  const monitoringOk = value => ['success', 'passed'].includes(String(value || '').toLowerCase());
  const qualityDisplay = value => {
    const raw = number(value);
    if (!Number.isFinite(raw) || raw <= 0) return {raw: 0, percent: 0, text: 'Awaiting provider quality'};
    const percent = Math.max(0, Math.min(100, raw / 3 * 100));
    return {raw, percent, text: `${raw.toFixed(1)} / 3`};
  };
  const html = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));
  let priceSnapshot = null;
  let selectedCurrency = localStorage.getItem('mystnodes-currency') || 'USD';
  const supportedCurrencies = new Set(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);
  if (!supportedCurrencies.has(selectedCurrency)) selectedCurrency = 'USD';
  const fiatRate = () => number(priceSnapshot?.mysterium?.[selectedCurrency.toLowerCase()]);
  const fiatText = value => {
    const rate = fiatRate();
    if (!rate && rate !== 0) return 'Price unavailable';
    const amount = token(value) * rate;
    return new Intl.NumberFormat(undefined, {style: 'currency', currency: selectedCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2}).format(amount);
  };
  const estimatedFiatText = value => fiatRate() ? `≈ ${fiatText(value)}` : 'Fiat estimate unavailable';


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

  function dailySeries(sessions, days, valueOf) {
    const now = new Date();
    const rows = [];
    const byDay = new Map();
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
      const key = date.toISOString().slice(0, 10);
      byDay.set(key, 0);
      rows.push({key, date, value: 0});
    }
    for (const session of sessions || []) {
      if (!session?.started_at) continue;
      const key = String(session.started_at).slice(0, 10);
      if (!byDay.has(key)) continue;
      byDay.set(key, byDay.get(key) + number(valueOf(session)));
    }
    rows.forEach(row => { row.value = byDay.get(row.key) || 0; });
    return rows;
  }

  function setTrafficLabels(rows) {
    const labels = $$('#overview .chart-labels span');
    if (!labels.length || !rows.length) return;
    const formatter = new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric', timeZone: 'UTC'});
    labels.forEach((label, index) => {
      const pos = labels.length === 1 ? 0 : Math.round(index * (rows.length - 1) / (labels.length - 1));
      set(label, formatter.format(rows[pos].date));
    });
  }

  function renderTrafficTrend(sessions, days) {
    const rows = dailySeries(sessions, days, session => session.transferred_bytes);
    drawSeries($('#overview .chart svg'), rows.map(row => row.value), 'purple');
    setTrafficLabels(rows);
  }

  function renderEarningsFromSessions(sessions, days, title) {
    const rows = dailySeries(sessions, days, session => token(session.earnings));
    renderEarningsBars({data: rows.map(row => ({value: row.value, date: row.key}))}, title);
    const labels = $('#earningsLabels');
    if (labels) {
      labels.hidden = false;
      const nodes = [...labels.children];
      const formatter = new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric', timeZone: 'UTC'});
      nodes.forEach((label, index) => {
        const pos = nodes.length === 1 ? 0 : Math.round(index * (rows.length - 1) / (nodes.length - 1));
        set(label, formatter.format(rows[pos].date));
      });
    }
    const earned = rows.reduce((sum, row) => sum + row.value, 0);
    set($('#earningsChange'), `${formatToken(earned)} MYST · ${estimatedFiatText(earned)}`);
  }

  function drawSeries(svg, values, className) {
    if (!svg) return;
    const chart = svg.closest('.chart');
    chart?.querySelector('.chart-empty')?.remove();
    const clean = (values || []).filter(Number.isFinite);
    if (clean.length < 2 || clean.every(value => value === 0)) {
      svg.replaceChildren();
      const empty = document.createElement('div');
      empty.className = 'chart-empty';
      empty.innerHTML = `<strong>${clean.length ? 'Trend building' : 'Waiting for trend data'}</strong><span>${clean.length ? 'More reporting points are needed to draw this chart.' : 'The chart will appear after the collector reports activity.'}</span>`;
      chart?.append(empty);
      return;
    }
    const width = 720;
    const height = 145;
    const max = Math.max(...clean, 1);
    const points = clean.map((value, index) => `${index * width / Math.max(clean.length - 1, 1)},${height - (value / max * 120)}`).join(' ');
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
      row.innerHTML = `<span><i class="service-icon ${html(info.color)}">${html(info.letter)}</i> ${html(info.label)}</span><span>${html(country)}</span><span>${html(duration(session.duration_seconds))}</span><span>${html(bytes(session.transferred_bytes))}</span><span>${html(tokenText(session.earnings))}</span><span class="live"><i></i> Reported${limit ? '' : ' ›'}</span>`;
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
    set(metadata[0], identity?.registration_status || 'Unknown');
    set(metadata[1], 'Persistent volume');
    set(metadata[2], status?.updated_at ? new Date(status.updated_at).toLocaleString() : 'Awaiting snapshot');
    set(metadata[3], status?.identity === 'Protected' ? 'Files detected' : safe(status?.identity));
    set($('.account-state strong', root), 'Manage in MystNodes');
    set($('.account-state span', root), 'Claim status is not exposed by the local node API');
    const persistentIdentity = status?.identity === 'Protected';
    set($('.identity-seal span', root), persistentIdentity ? 'PERSISTED' : 'WAITING');
    set($('.identity-main .health-score', root), persistentIdentity ? 'Persistent' : 'Waiting');
    set($('.callout strong', root), persistentIdentity ? 'Identity storage is persistent' : 'Identity files not yet detected');
    set($('.callout p', root), persistentIdentity ? 'Identity files are stored outside the runtime container so normal updates and container recreation do not erase them.' : 'The persistent volume is ready; status will update after the node creates or loads an identity.');
  }

  function renderEarnings(identity, earnings, sessions30) {
    const root = $('#earnings');
    if (!root) return;
    const lifetime = identity ? token(identity.earnings_total_tokens) : null;
    const unsettled = identity ? token(identity.earnings_tokens) : null;
    const balance = identity ? token(identity.balance_tokens) : null;
    set($('.earnings-hero h2', root), lifetime === null ? '— MYST' : tokenText(lifetime));
    set($('#lifetimeFiat', root), lifetime === null ? '—' : estimatedFiatText(lifetime));
    const cards = $$('.detail-grid.thirds .metric-card', root);
    const labels = ['On-chain balance', 'Unsettled earnings', 'Lifetime earnings'];
    const values = [balance, unsettled, lifetime];
    const notes = ['Current identity balance', 'Awaiting settlement', 'All recorded earnings'];
    cards.forEach((card, index) => {
      set($('.metric-head span', card), labels[index]);
      set($(':scope > strong', card), values[index] === null ? '— MYST' : tokenText(values[index]));
      set($('.fiat-estimate', card), values[index] === null ? '—' : estimatedFiatText(values[index]));
      set($(':scope > p', card), notes[index]);
    });
    renderEarningsFromSessions(sessions30, 30, 'Last 30 days');
  }

  function renderServiceEarnings(earnings) {
    const root = $('#serviceEarnings');
    if (!root) return;
    const values = [
      earnings?.public_tokens,
      earnings?.data_transfer_tokens,
      earnings?.scraping_tokens,
      earnings?.dvpn_tokens,
      earnings?.monitoring_tokens
    ];
    $$('.service-earning-card').forEach((card, index) => {
      set($(':scope > strong', card), tokenText(values[index]));
      set($(':scope > small', card), estimatedFiatText(values[index]));
    });
  }

  function renderEarningsBars(series, title) {
    const data = series?.data || [];
    const chart = $('#earningsBars');
    if (!chart) return;
    chart.replaceChildren();
    const valuesSeries = data.map(item => number(item.value));
    const max = Math.max(...valuesSeries, 1);
    data.forEach(item => {
      const value = number(item.value);
      const bar = document.createElement('i');
      bar.style.height = `${value ? Math.max(5, value / max * 100) : 2}%`;
      bar.dataset.value = tokenText(value);
      bar.tabIndex = 0;
      bar.setAttribute('aria-label', tokenText(value));
      chart.append(bar);
    });
    chart.classList.toggle('sparse', data.length > 0 && data.length < 6);
    if (!data.length) {
      const empty = document.createElement('div');
      empty.className = 'chart-empty';
      empty.innerHTML = '<strong>No earnings history yet</strong><span>Reporting points will appear here as the runtime records them.</span>';
      chart.append(empty);
    }
    const labels = $('#earningsLabels');
    if (labels) labels.hidden = data.length < 3;
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
    const [status, healthcheck, identityList, identity, services, nat, monitoring, quality, activity, earnings, sessions1d, sessions7d, sessions30d, transfer7d, transfer30d, mystPrice] = await Promise.all([
      statusApi(), api('healthcheck'), api('identities'), api('identity'), api('services'), api('nat'), api('monitoring-status'), api('quality'), api('activity'), api('service-earnings'), api('sessions-1d'), api('sessions-7d'), api('sessions-30d'), api('transferred-7d'), api('transferred-30d'), api('myst-price')
    ]);
    if (mystPrice?.mysterium) priceSnapshot = mystPrice;
    const online = status?.mysterium === 'Healthy';
    const currentIdentity = identity || (identityList?.identities?.[0] ? {id: identityList.identities[0].id} : null);
    const sessions = Array.isArray(sessions1d?.sessions) ? sessions1d.sessions : null;
    const sessions7 = Array.isArray(sessions7d?.sessions) ? sessions7d.sessions : null;
    const sessions30 = Array.isArray(sessions30d?.sessions) ? sessions30d.sessions : null;
    const recentCount = sessions ? sessions.length : null;
    const count30 = sessions30 ? sessions30.length : null;
    const runningServices = Array.isArray(services) ? services.filter(service => String(service.status).toLowerCase() === 'running') : [];
    const trafficServices = runningServices.filter(service => String(service.type).toLowerCase() !== 'monitoring');
    const monitorHealthy = monitoringOk(monitoring?.status);
    const providerReady = online && monitorHealthy && trafficServices.length > 0;
    const providerLocation = runningServices.find(service => service?.proposal?.location)?.proposal?.location || null;
    const q = qualityDisplay(quality?.quality);
    const overviewCards = $$('#overview .metric-grid .metric-card');
    set($(':scope > strong', overviewCards[0]), tokenText(currentIdentity?.earnings_total_tokens || earnings?.total_tokens));
    set($(':scope > p', overviewCards[0]), 'Reported by the Mysterium runtime');
    set($(':scope > strong', overviewCards[1]), bytes(transfer30d?.transferred_data_bytes));
    set($(':scope > p', overviewCards[1]), '30-day aggregate reported by the runtime');
    set($('.metric-head span', overviewCards[2]), 'Recent sessions');
    set($(':scope > strong', overviewCards[2]), recentCount === null ? '—' : String(recentCount));
    set($(':scope > p', overviewCards[2]), 'Records returned for the last 24 hours');
    set($('.metric-head span', overviewCards[3]), 'Online time');
    set($(':scope > strong', overviewCards[3]), activity ? `${number(activity.online_percent).toFixed(1)}%` : safe(status?.host_uptime));
    set($(':scope > p', overviewCards[3]), activity ? 'Provider activity metric' : 'Host uptime');

    set($('#overview .status-pill'), providerReady ? '● Provider available' : online ? '● Runtime online · provider check needed' : '● Node attention needed');
    set($('#overview .hero-copy > p'), online ? 'Live data is flowing from the official Mysterium runtime through a private local collector.' : 'The dashboard is waiting for the official Mysterium runtime.');
    set($('#overview .chart-summary strong'), bytes(transfer7d?.transferred_data_bytes));
    renderTrafficTrend(sessions7, 7);
    set($('#overview .health-score'), q.raw ? `Provider quality: ${q.text}` : q.text);
    const healthRing = $('#overview .health-ring');
    if (healthRing) healthRing.style.background = `conic-gradient(var(--green) 0 ${q.percent}%, rgba(255,255,255,.06) ${q.percent}% 100%)`;
    set($('#overview .health-ring strong'), q.raw ? q.text : '—');
    set($('#overview .health-ring span'), 'quality score');
    const healthValues = $$('#overview .health-list strong');
    set(healthValues[0], online ? '● Running' : '● Offline');
    set(healthValues[1], natLabel(nat?.type));
    set(healthValues[2], status?.identity === 'Protected' ? '● Secured' : safe(status?.identity));
    set(healthValues[3], status?.updated_at ? new Date(status.updated_at).toLocaleTimeString() : 'Waiting');
    renderSessionRows($('#overview .sessions-preview'), sessions, 3);

    const nodeCards = $$('#node .detail-grid.thirds .panel');
    set($('.big-stat', nodeCards[0]), safe(status?.node_version));
    set($('h3', nodeCards[1]), 'Provider availability');
    set($('.big-stat', nodeCards[1]), providerReady ? 'Available' : online ? 'Checking' : 'Offline');
    set($('.muted-copy', nodeCards[1]), providerReady ? `${trafficServices.length} traffic services running` : online ? `Monitoring: ${safe(monitoring?.status)}` : 'Runtime unavailable');
    set($('h3', nodeCards[2]), 'NAT type');
    set($('.big-stat', nodeCards[2]), natLabel(nat?.type));
    set($('.muted-copy', nodeCards[2]), nat ? `Mysterium NAT probe · raw: ${safe(nat?.type)}` : 'Awaiting NAT probe');
    const components = $$('#node .status-table > div');
    set($('strong', components[0]), online ? 'Running' : 'Unavailable');
    set($('small', components[0]), healthcheck?.uptime ? `${healthcheck.uptime} runtime uptime` : 'Awaiting runtime uptime');
    set($('strong', components[1]), monitorHealthy ? 'Healthy' : safe(monitoring?.status));
    set($('small', components[1]), `Mysterium monitoring: ${safe(monitoring?.status)}`);
    set($('strong', components[2]), recentCount === null ? 'Waiting' : `${recentCount} reported`);
    set($('small', components[2]), 'Session records in last 24 hours');
    set($('strong', components[3]), currentIdentity ? 'Loaded' : 'Waiting');
    set($('small', components[3]), compactId(currentIdentity?.id));
    set($('#node .info-panel .health-score'), providerReady ? 'Provider available' : online ? 'Runtime online' : 'Attention needed');
    set($('#hostCpu'), safe(status?.cpu_load));
    set($('#hostMemory'), status?.memory_pct !== undefined ? `${status.memory_pct}%` : '—');
    set($('#hostDisk'), status?.disk_pct !== undefined ? `${status.disk_pct}%` : '—');
    set($('#hostDiskFree'), safe(status?.disk_free, '—'));
    set($('#providerRegion'), providerLocation ? [providerLocation.city, providerLocation.country].filter(Boolean).join(', ') : '—');
    set($('#providerIsp'), safe(providerLocation?.isp, '—'));
    set($('#providerIpType'), safe(providerLocation?.ip_type, '—'));
    set($('#providerNat'), natLabel(nat?.type));

    renderIdentity(currentIdentity, status);
    renderEarnings(currentIdentity, earnings, sessions30);
    renderServiceEarnings(earnings);
    const sessionRoot = $('#sessions');
    set($('.detail-hero .status-pill', sessionRoot), recentCount === null ? '● Waiting for session data' : `● ${recentCount} sessions reported`);
    set($('.detail-hero h2', sessionRoot), 'Recent network sessions');
    set($('.detail-hero p', sessionRoot), 'Review session metrics reported by your node during the last 24 hours.');
    const totals = $$('.session-total strong', sessionRoot);
    set(totals[0], sessions ? bytes(sessions.reduce((sum, item) => sum + number(item.transferred_bytes), 0)) : '—');
    set($('.session-total span', sessionRoot), 'Transferred in recent sessions');
    set(totals[1], recentCount === null ? '—' : String(recentCount));
    set($$('.session-total span', sessionRoot)[1], 'Sessions in the last 24 hours');
    set($('.session-detail .eyebrow', sessionRoot), 'RECENT SESSION RECORDS');
    set($('.session-detail h3', sessionRoot), 'Reported in the last 24 hours');
    renderSessionRows($('.session-detail', sessionRoot), sessions);
    const sessionStats = $$('#sessions .detail-grid.two .panel');
    set($('.big-stat', sessionStats[0]), bytes(transfer30d?.transferred_data_bytes));
    set($('.muted-copy', sessionStats[0]), '30-day aggregate reported by the runtime');
    set($('.big-stat', sessionStats[1]), count30 === null ? '—' : String(count30));
    set($('h3', sessionStats[1]), 'Session records');
    set($('.muted-copy', sessionStats[1]), 'Counted from records returned for the last 30 days');

    const runtimeLabels = $$('#settings .version-list strong');
    set(runtimeLabels[0], APP_RELEASE);
    set(runtimeLabels[1], safe(status?.node_version));
    set($('#settings .version-badge'), `Kraskus App ${APP_RELEASE}`);
    set($('#settings .account-setting h3'), 'Managed in the MystNodes dashboard');
    set($('#settings .account-setting p:last-of-type'), 'The local node API does not disclose MystNodes claim status. Open the dashboard to review or claim this node.');
    renderServices(services);
    renderLogs(status, monitoring, services);
    set($('.node-mini strong'), online ? 'Node online' : 'Node offline');
    set($('.node-mini > div > span'), `Official runtime · ${safe(status?.node_version)}`);
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
    const days = range === '7d' ? 7 : 30;
    const data = await api(`sessions-${range}`);
    const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
    renderEarningsFromSessions(sessions, days, range === '7d' ? 'Last 7 days' : 'Last 30 days');
  }));

  const trafficButtons = $$('#overview .traffic-panel .range-switch button');
  trafficButtons.forEach((button, index) => {
    if (index > 1) { button.disabled = true; button.title = 'The pinned runtime provides up to 30 days of series data'; return; }
    button.addEventListener('click', async () => {
      const range = index === 0 ? '7d' : '30d';
      const days = index === 0 ? 7 : 30;
      const [sessionData, total] = await Promise.all([api(`sessions-${range}`), api(`transferred-${range}`)]);
      const sessions = Array.isArray(sessionData?.sessions) ? sessionData.sessions : [];
      renderTrafficTrend(sessions, days);
      set($('#overview .chart-summary strong'), bytes(total?.transferred_data_bytes));
    });
  });

  $$('[data-earnings-range="90d"], [data-earnings-range="all"]').forEach(button => {
    button.disabled = true;
    button.title = 'The pinned runtime provides up to 30 days of series data';
  });

  const currencySelect = $('#currencySelect');
  if (currencySelect) {
    currencySelect.value = selectedCurrency;
    currencySelect.addEventListener('change', () => {
      selectedCurrency = supportedCurrencies.has(currencySelect.value) ? currencySelect.value : 'USD';
      localStorage.setItem('mystnodes-currency', selectedCurrency);
      refresh();
    });
  }

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
