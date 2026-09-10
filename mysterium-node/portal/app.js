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
  window.scrollTo({top:0,behavior:'smooth'});
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

const earningsData={
  '7d':{title:'Last 7 days',change:'+8.2%',heights:[44,61,53,72,66,88,100,100,100,100,100,100],values:['0.21','0.29','0.25','0.34','0.31','0.41','0.47','0.47','0.47','0.47','0.47','0.47'],labels:['Aug 29','Aug 31','Sep 2','Sep 4']},
  '30d':{title:'Last 30 days',change:'+12.4%',heights:[32,46,38,59,51,74,63,81,69,93,84,100],values:['0.21','0.31','0.26','0.40','0.35','0.50','0.43','0.55','0.47','0.63','0.57','0.68'],labels:['Aug 6','Aug 13','Aug 20','Aug 27','Sep 4']},
  '90d':{title:'Last 90 days',change:'+19.7%',heights:[22,30,41,36,48,55,62,58,71,79,91,100],values:['1.10','1.48','2.04','1.79','2.39','2.74','3.09','2.89','3.54','3.94','4.53','4.98'],labels:['Jun 7','Jul 1','Aug 1','Sep 4']},
  'all':{title:'Lifetime earnings',change:'+24.82 MYST',heights:[10,16,23,31,39,47,56,64,73,82,91,100],values:['0.42','0.78','1.24','1.86','2.71','3.88','5.22','7.06','9.81','13.42','18.11','24.82'],labels:['First session','30 days','60 days','Today']}
};

function renderEarnings(range){
  const data=earningsData[range];
  document.getElementById('earningsRangeTitle').textContent=data.title;
  document.getElementById('earningsChange').textContent=data.change;
  document.querySelectorAll('#earningsBars i').forEach((bar,index)=>{bar.style.height=data.heights[index]+'%';bar.dataset.value=data.values[index]+' MYST';bar.setAttribute('aria-label',data.values[index]+' MYST');});
  document.getElementById('earningsLabels').innerHTML=data.labels.map(label=>'<span>'+label+'</span>').join('');
}

document.querySelectorAll('[data-earnings-range]').forEach(button=>button.addEventListener('click',()=>renderEarnings(button.dataset.earningsRange)));
renderEarnings('30d');

document.querySelectorAll('.session-row.expandable').forEach(row=>{const toggle=()=>{const record=row.closest('.session-record');const open=record.classList.toggle('open');row.setAttribute('aria-expanded',String(open));};row.addEventListener('click',toggle);row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});});

document.getElementById('sessionFilter').addEventListener('change',event=>{let visible=0;document.querySelectorAll('.session-record').forEach(record=>{const show=event.target.value==='all'||record.dataset.service===event.target.value;record.hidden=!show;if(show)visible++;});document.getElementById('sessionEmpty').style.display=visible?'none':'flex';});
