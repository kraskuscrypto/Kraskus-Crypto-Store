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
  const mainScroller=document.querySelector('.main');
  if(mainScroller)mainScroller.scrollTo({top:0,behavior:'smooth'});
  document.scrollingElement?.scrollTo({top:0,behavior:'smooth'});
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
document.querySelectorAll('.toggle').forEach(toggle=>toggle.addEventListener('click',event=>{const button=event.currentTarget;if(button.disabled)return;button.classList.toggle('active');button.setAttribute('aria-pressed',String(button.classList.contains('active')));const servicePanel=button.closest('.service-settings');if(servicePanel){const count=servicePanel.querySelectorAll('.toggle.active').length;servicePanel.querySelector('.health-score').textContent=count+' enabled';}}));

document.querySelectorAll('.identity-address button').forEach(button=>button.addEventListener('click',async()=>{const value=button.closest('.identity-address').dataset.fullIdentity;try{await navigator.clipboard.writeText(value);showToast('Complete node identity copied.');}catch{showToast('Copy unavailable in this preview.');}}));

document.querySelectorAll('[data-earnings-range]').forEach(button=>{
  const supported=button.dataset.earningsRange==='30d';
  button.disabled=!supported;
  if(!supported)button.title='The local collector currently provides a live 30-day earnings series.';
});

document.querySelectorAll('.session-row.expandable').forEach(row=>{const toggle=()=>{const record=row.closest('.session-record');const open=record.classList.toggle('open');row.setAttribute('aria-expanded',String(open));};row.addEventListener('click',toggle);row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});});

document.getElementById('sessionFilter').addEventListener('change',event=>{let visible=0;document.querySelectorAll('.session-record').forEach(record=>{const show=event.target.value==='all'||record.dataset.service===event.target.value;record.hidden=!show;if(show)visible++;});document.getElementById('sessionEmpty').style.display=visible?'none':'flex';});
