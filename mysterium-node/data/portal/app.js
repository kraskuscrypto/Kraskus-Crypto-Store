const titles={overview:'Node overview',node:'Node console',identity:'Node identity',earnings:'Earnings',sessions:'Sessions',settings:'Settings'};
const navButtons=[...document.querySelectorAll('[data-tab]')];
const panels=[...document.querySelectorAll('.tab-panel')];
const modal=document.getElementById('newUserModal');
const logsModal=document.getElementById('logsModal');
const toast=document.querySelector('.toast');
const nodeUiUrl=`http://${window.location.hostname}:4449/`;

function openTab(name){
  navButtons.forEach(button=>{const active=button.dataset.tab===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
  panels.forEach(panel=>panel.classList.toggle('active',panel.id===name));
  document.getElementById('pageTitle').textContent=titles[name]||'MystNodes';
  const resetScroll=()=>{
    const mainScroller=document.querySelector('.main');
    if(mainScroller)mainScroller.scrollTop=0;
    if(document.scrollingElement)document.scrollingElement.scrollTop=0;
  };
  resetScroll();
  requestAnimationFrame(resetScroll);
}

function showToast(message){
  toast.textContent=message;toast.classList.add('show');
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2800);
}

navButtons.forEach(button=>button.addEventListener('click',()=>openTab(button.dataset.tab)));
document.querySelectorAll('[data-tab-jump]').forEach(button=>button.addEventListener('click',()=>openTab(button.dataset.tabJump)));
document.querySelectorAll('[data-action="new-user"]').forEach(button=>button.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.querySelector('.modal-close').focus();}));
document.querySelectorAll('[data-action="existing-user"]').forEach(button=>button.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');window.open(nodeUiUrl,'_blank','noopener');}));
document.querySelectorAll('[data-action="dashboard"]').forEach(button=>button.addEventListener('click',()=>window.open('https://my.mystnodes.com/','_blank','noopener')));
document.querySelectorAll('[data-action="view-logs"]').forEach(button=>button.addEventListener('click',()=>{logsModal.classList.add('open');logsModal.setAttribute('aria-hidden','false');logsModal.querySelector('[data-close-logs]').focus();}));
document.querySelector('.modal-close').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');});
modal.addEventListener('click',event=>{if(event.target===modal)document.querySelector('.modal-close').click();});
document.querySelectorAll('[data-close-logs]').forEach(button=>button.addEventListener('click',()=>{logsModal.classList.remove('open');logsModal.setAttribute('aria-hidden','true');}));
logsModal.addEventListener('click',event=>{if(event.target===logsModal)logsModal.querySelector('[data-close-logs]').click();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('open'))document.querySelector('.modal-close').click();if(event.key==='Escape'&&logsModal.classList.contains('open'))logsModal.querySelector('[data-close-logs]').click();});
document.querySelectorAll('.range-switch button').forEach(button=>button.addEventListener('click',()=>{button.parentElement.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active');}));
// Runtime switches are read-only status indicators; changes stay in the official Node UI.
document.querySelectorAll('.toggle').forEach(button=>{button.disabled=true;button.title='Manage in the official Node UI';});

async function copyIdentity(button){
 const value=button.closest('.identity-address')?.dataset.fullIdentity;
 if(!value){showToast('Identity is not available yet.');return false;}
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);showToast('Complete node identity copied.');return true;}}catch{}
 const previous=document.activeElement;const field=document.createElement('textarea');field.value=value;field.readOnly=true;field.setAttribute('aria-label','Complete node identity — select and copy');field.className='manual-copy';button.closest('.identity-address').append(field);field.focus();field.select();field.setSelectionRange(0,value.length);
 try{if(document.execCommand('copy')){field.remove();previous?.focus();showToast('Complete node identity copied.');return true;}}catch{}
 showToast('Select the identity below, then use your device’s Copy command.');return false;
}
document.querySelectorAll('.identity-address button').forEach(button=>button.addEventListener('click',()=>copyIdentity(button)));
const preference=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const savePreference=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
function applyAppearance(mode,theme){document.documentElement.dataset.mode=mode==='light'?'light':'dark';document.documentElement.dataset.theme=['kraskus','divinity','mysterium'].includes(theme)?theme:'mysterium';const toggle=document.getElementById('appearanceToggle');toggle.textContent=mode==='light'?'Dark mode':'Light mode';toggle.setAttribute('aria-label','Switch to '+(mode==='light'?'dark':'light')+' mode');document.getElementById('appearanceMode').value=document.documentElement.dataset.mode;document.getElementById('appearanceTheme').value=document.documentElement.dataset.theme;savePreference('mystnodes-mode',document.documentElement.dataset.mode);savePreference('mystnodes-theme',document.documentElement.dataset.theme);}
applyAppearance(preference('mystnodes-mode','dark'),preference('mystnodes-theme','mysterium'));
document.getElementById('appearanceToggle').addEventListener('click',()=>applyAppearance(document.documentElement.dataset.mode==='light'?'dark':'light',document.documentElement.dataset.theme));
for(const id of ['appearanceMode','appearanceTheme'])document.getElementById(id).addEventListener('change',()=>applyAppearance(document.getElementById('appearanceMode').value,document.getElementById('appearanceTheme').value));


document.querySelectorAll('[data-earnings-range]').forEach(button=>{
  const range=button.dataset.earningsRange;
  const supported=range==='7d'||range==='30d';
  button.disabled=!supported;
  if(!supported)button.title='The pinned runtime exposes session history for up to 30 days.';
});

document.querySelectorAll('.session-row.expandable').forEach(row=>{const toggle=()=>{const record=row.closest('.session-record');const open=record.classList.toggle('open');row.setAttribute('aria-expanded',String(open));};row.addEventListener('click',toggle);row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});});

document.getElementById('sessionFilter').addEventListener('change',event=>{let visible=0;document.querySelectorAll('.session-record').forEach(record=>{const show=event.target.value==='all'||record.dataset.service===event.target.value;record.hidden=!show;if(show)visible++;});document.getElementById('sessionEmpty').style.display=visible?'none':'flex';});

const collapse=document.querySelector('.collapse-button');
function setCollapsed(value){document.body.classList.toggle('nav-collapsed',value);collapse.setAttribute('aria-label',value?'Expand navigation':'Collapse navigation');collapse.setAttribute('aria-expanded',String(!value));collapse.textContent=value?'›':'‹';savePreference('mystnodes-nav-collapsed',String(value));}
collapse.addEventListener('click',()=>setCollapsed(!document.body.classList.contains('nav-collapsed')));setCollapsed(preference('mystnodes-nav-collapsed','false')==='true');

document.getElementById('checkDiagnostics').addEventListener('click',()=>{openTab('overview');document.getElementById('readinessTitle').setAttribute('tabindex','-1');document.getElementById('readinessTitle').focus();document.getElementById('readinessTitle').scrollIntoView({block:'start'});});
