/* Read-only dashboard calculations. No payment, identity or runtime mutations. */
(function(root){
'use strict';
const finite=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
function fresh(meta,name,seconds,now=Date.now()/1000){const t=Number(meta?.snapshots?.[name]);return Number.isFinite(t)&&t>0&&now>=t-30&&now-t<=seconds;}
function readiness({status,meta,services,monitoring,identity},now=Date.now()/1000){
 const checks=[];const add=(name,ok,detail)=>checks.push({name,ok,detail});
 const local=['healthcheck','services','identity'].every(n=>fresh(meta,n,180,now));
 add('Local collector',local,local?'Runtime snapshots are current.':'Local snapshots are missing or older than 3 minutes. Check the collector; payment handling is unaffected.');
 add('Node runtime',status?.mysterium==='Healthy','The node must respond to its local health check.');
 add('Identity registration',String(identity?.registration_status).toLowerCase()==='registered','Registration is managed in the official Node UI.');
 const running=(Array.isArray(services)?services:[]).filter(s=>String(s.status).toLowerCase()==='running'&&String(s.type).toLowerCase()!=='monitoring');
 add('Traffic services',running.length>0,running.length+' traffic services reported running. Manage services in the official Node UI.');
 const monitored=fresh(meta,'monitoring-status',1800,now);const passed=['success','passed'].includes(String(monitoring?.status).toLowerCase());
 add('External monitoring',monitored&&passed,monitored?('Mysterium reports '+(monitoring?.status||'unknown')+'. A passed check does not guarantee customer demand.'):'Monitoring is missing or older than 30 minutes. The provider refreshes about every 15 minutes.');
 return {ready:checks.every(c=>c.ok),stale:!local||!monitored,checks,label:checks.every(c=>c.ok)?'Provider checks passed':!local?'Status is stale':status?.mysterium!=='Healthy'?'Node needs attention':'Provider check needed'};
}
function series(data,days,now=Date.now()){
 if(!Array.isArray(data?.data))return [];
 const floor=Math.floor(now/86400000)*86400000-(days-1)*86400000, end=floor+days*86400000;
 return data.data.map(x=>{const t=x.timestamp!==undefined?Number(x.timestamp)*1000:Date.parse(x.date);return {time:t,value:finite(x.value)?Number(x.value):null};}).filter(x=>Number.isFinite(x.time)&&x.time>=floor&&x.time<end).sort((a,b)=>a.time-b.time);
}
function tokenValue(v){const n=v?.human??v?.ether??v;return finite(n)?Number(n):null;}
function revenuePerGB(earnings,bytes){return finite(earnings)&&finite(bytes)&&Number(bytes)>0?Number(earnings)/(Number(bytes)/1e9):null;}
root.MystInsights={fresh,readiness,series,tokenValue,revenuePerGB};
if(typeof module!=='undefined')module.exports=root.MystInsights;
})(typeof window==='undefined'?globalThis:window);
