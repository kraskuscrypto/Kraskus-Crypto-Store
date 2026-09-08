(() => {
  const API = "update-api";
  let busy = false;
  let latest = "";

  const style = document.createElement("style");
  style.textContent = `
    .myst-update-card{margin-top:18px;background:linear-gradient(145deg,rgba(18,20,33,.92),rgba(11,12,21,.92));border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.28)}
    .myst-update-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px}
    .myst-update-title{color:#f8f7ff;font-size:17px;font-weight:900}
    .myst-update-badge{font-size:10px;font-weight:900;padding:6px 9px;border-radius:999px;background:rgba(168,70,255,.12);border:1px solid rgba(168,70,255,.2);color:#d6a5ff}
    .myst-update-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .myst-update-box{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:12px}
    .myst-update-label{color:#74778b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
    .myst-update-value{margin-top:5px;color:#f8f7ff;font-size:15px;font-weight:900}
    .myst-update-status{margin-top:12px;color:#8e91a6;font-size:11px;line-height:1.4}
    .myst-update-status.good{color:#4df0a6}.myst-update-status.bad{color:#ff7187}
    .myst-update-actions{display:flex;gap:10px;margin-top:12px;align-items:center}
    .myst-update-button{min-height:42px;border:0;border-radius:11px;padding:0 16px;background:linear-gradient(100deg,#a846ff,#fa2e91);color:#fff;font-size:11px;font-weight:900;cursor:pointer}
    .myst-update-button:disabled{opacity:.5;cursor:not-allowed}
    .myst-update-note{color:#74778b;font-size:10px}
    @media(max-width:850px){.myst-update-grid{grid-template-columns:1fr}.myst-update-actions{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "myst-update-card";
  card.innerHTML = `
    <div class="myst-update-head">
      <div class="myst-update-title">Protected node runtime update</div>
      <div class="myst-update-badge" id="mystUpdateBadge">Checking…</div>
    </div>
    <div class="myst-update-grid">
      <div class="myst-update-box">
        <div class="myst-update-label">Installed</div>
        <div class="myst-update-value" id="mystCurrentVersion">…</div>
      </div>
      <div class="myst-update-box">
        <div class="myst-update-label">Latest</div>
        <div class="myst-update-value" id="mystLatestVersion">…</div>
      </div>
    </div>
    <div class="myst-update-status" id="mystUpdateStatus">Checking for updates…</div>
    <div class="myst-update-actions">
      <button class="myst-update-button" id="mystUpdateButton" disabled>Update Node</button>
      <span class="myst-update-note">Automatic backup, health check, identity check, and rollback protection.</span>
    </div>
  `;

  const anchor = document.querySelector("#settings .service-settings");
  if (anchor && anchor.parentNode) anchor.insertAdjacentElement("afterend", card);
  else return;

  const currentEl = document.getElementById("mystCurrentVersion");
  const latestEl = document.getElementById("mystLatestVersion");
  const statusEl = document.getElementById("mystUpdateStatus");
  const badgeEl = document.getElementById("mystUpdateBadge");
  const button = document.getElementById("mystUpdateButton");

  function render(data) {
    const op = data.operation || {};
    currentEl.textContent = data.current_version || "Unknown";
    latestEl.textContent = data.latest_version || "Checking…";
    latest = data.latest_version || "";

    const active = ["queued","pulling","stopping","backing_up","installing","verifying","rolling_back"].includes(op.state);
    busy = active;

    statusEl.classList.remove("good", "bad");
    if (active) {
      badgeEl.textContent = "Updating";
      statusEl.textContent = op.message || "Update in progress…";
      button.disabled = true;
      button.textContent = "Updating…";
      return;
    }

    if (op.state === "success") {
      statusEl.classList.add("good");
      statusEl.textContent = op.message || "Update completed successfully.";
    } else if (op.state === "rolled_back" || op.state === "failed" || op.state === "rollback_failed") {
      statusEl.classList.add("bad");
      statusEl.textContent = op.message || "Update failed.";
    } else if (data.update_available) {
      statusEl.textContent = `Mysterium Node ${data.latest_version} is available.`;
    } else if (data.latest_version && data.current_version === data.latest_version) {
      statusEl.classList.add("good");
      statusEl.textContent = "Your Mysterium node is up to date.";
    } else {
      statusEl.textContent = "Checking the upstream Mysterium image for updates.";
    }

    if (data.update_available) {
      badgeEl.textContent = "Update available";
      button.disabled = false;
      button.textContent = `Update to ${data.latest_version}`;
    } else {
      badgeEl.textContent = data.latest_version ? "Up to date" : "Checking…";
      button.disabled = true;
      button.textContent = "Update Node";
    }
  }

  async function refresh() {
    try {
      const r = await fetch(`${API}/status?t=${Date.now()}`, {cache:"no-store"});
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      render(await r.json());
    } catch (e) {
      badgeEl.textContent = "Unavailable";
      statusEl.classList.add("bad");
      statusEl.textContent = "Update service is unavailable.";
      button.disabled = true;
    }
  }

  button.addEventListener("click", async () => {
    if (busy || !latest) return;
    if (!window.confirm(`Update Mysterium Node to ${latest}?\n\nMystNodes will stop the node briefly, create a backup, install the verified image, run health and identity checks, and roll back if validation fails.`)) return;

    button.disabled = true;
    statusEl.textContent = `Queueing update to ${latest}…`;
    try {
      const r = await fetch(`${API}/update`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({version:latest})
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      busy = true;
      await refresh();
    } catch (e) {
      statusEl.classList.add("bad");
      statusEl.textContent = `Could not start update: ${e.message}`;
      button.disabled = false;
    }
  });

  refresh();
  setInterval(refresh, 3000);
})();
