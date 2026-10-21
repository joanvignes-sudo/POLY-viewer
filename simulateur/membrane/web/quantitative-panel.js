/* Local, read-only comparison. No state is written to the documentary session. */
(()=>{'use strict';
 const $=x=>document.getElementById(x);let data=null,current=null;
 const hash=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',x))).map(b=>b.toString(16).padStart(2,'0')).join('');
 const jsonHash=x=>hash(new TextEncoder().encode(JSON.stringify(x)));
 function fail(e){data=null;$('quant-content').hidden=true;$('quant-amplitude').replaceChildren();$('quant-chart').replaceChildren();$('quant-metrics').textContent='';$('quant-provenance').textContent='';$('quant-status').textContent='Résultats indisponibles : '+e.message;$('quantitative-panel').dataset.status='error';}
 function context(s){current=s;if(data)$('quant-context').textContent='Document : '+s.event.id+' · horloges non alignées';}
 function draw(){
  if(!data)return;const s=data.traces.find(x=>String(x.result.stimulus.current_uA_cm2)===$('quant-amplitude').value);if(!s)throw Error('Trace absente');
  const rows=s.result.rows,svg=$('quant-chart'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();
  const add=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);};
  const X=t=>60+t/40*675,Y=v=>255-(v+90)/150*225;
  for(const v of [-80,-40,0,40]){add('line',{x1:60,x2:735,y1:Y(v),y2:Y(v),stroke:'#d7e2e8'});add('text',{x:12,y:Y(v)+5,fill:'#304c5d'},String(v));}
  for(const t of [0,10,20,30,40])add('text',{x:X(t)-5,y:280,fill:'#304c5d'},String(t));
  add('text',{x:12,y:18,fill:'#304c5d'},'mV');add('text',{x:680,y:296,fill:'#304c5d'},'temps (ms)');
  add('path',{d:rows.map((r,i)=>(i?'L':'M')+X(r.t_ms).toFixed(2)+','+Y(r.voltage_mV).toFixed(2)).join(' '),fill:'none',stroke:'#087b87','stroke-width':2});
  $('quant-metrics').textContent='Pic simulé : '+s.result.metrics.peak_voltage_mV.toFixed(2)+' mV · franchissements de 0 mV : '+s.result.metrics.positive_zero_crossings;
  $('quant-provenance').textContent='Empreinte du résultat : '+s.provenance.result_sha256;
  $('quantitative-panel').dataset.amplitude=String(s.result.stimulus.current_uA_cm2);
  $('quantitative-panel').dataset.traceHash=s.provenance.result_sha256;
 }
 async function init(){
  const r=await fetch('../data/quantitative-traces.json',{cache:'no-store'});if(!r.ok)throw Error('fichier de traces absent');const candidate=await r.json();
  const [source,reference]=await Promise.all([fetch('../core/hh.js'),fetch('../source/hh_variant01.cellml')]);
  if(!source.ok||!reference.ok)throw Error('source du modèle absente');
  const modelHash=await hash(await source.arrayBuffer()),refHash=await hash(await reference.arrayBuffer());
  if(candidate.schema!=='poly.quantitative.collection/1'||candidate.traces?.length!==5)throw Error('collection invalide');
  const amplitudes=new Set();
  for(const s of candidate.traces){
   const q=s.result;
   if(s.schema!=='poly.quantitative.sidecar/1'||s.evidence_class!=='SIMULATED'||s.species!=='squid'||s.empirical_validation!==false||s.human_transfer_validated!==false||s.spatial_registration!==null||s.causal_documentary_links?.length!==0||s.clock?.aligned_to_documentary_events!==false||
    q?.species!=='squid'||q.human_transfer_validated!==false||q.params?.temperature_C!==6.3||q.anatomical_position!=='none'||q.biological_timing!=='model_computed_not_experimental'||q.scientific_validation!=='NUMERICAL_TESTED_NOT_INDEPENDENTLY_EMPIRICALLY_VALIDATED'||q.units?.time!=='ms'||q.units?.voltage!=='mV'||q.units?.current_density!=='uA/cm^2'||q.units?.gates!=='dimensionless'||s.provenance.implementation_sha256!==modelHash||s.provenance.reference_sha256!==refHash||await jsonHash(q)!==s.provenance.result_sha256)throw Error('portée scientifique ou intégrité invalide');
   if(!Array.isArray(q.rows)||q.rows.length!==1601||q.rows[0].t_ms!==0||q.rows.at(-1).t_ms!==40)throw Error('durée invalide');
   q.rows.forEach((x,i)=>{if(!['t_ms','voltage_mV','m','h','n','current_uA_cm2'].every(k=>Number.isFinite(x[k]))||(i&&x.t_ms<=q.rows[i-1].t_ms)||['m','h','n'].some(k=>x[k]<0||x[k]>1))throw Error('trace invalide');});
   const amp=q.stimulus.current_uA_cm2;if(![0,2,6,10,20].includes(amp)||amplitudes.has(amp))throw Error('amplitude invalide');amplitudes.add(amp);
  }
  data=candidate;$('quant-amplitude').replaceChildren();for(const s of data.traces){const o=document.createElement('option');o.value=String(s.result.stimulus.current_uA_cm2);o.textContent=o.value+' µA/cm²';$('quant-amplitude').append(o);}
  $('quant-amplitude').value='10';$('quant-amplitude').addEventListener('change',()=>{try{draw();}catch(e){fail(e);}});
  $('quant-status').textContent='Calculs vérifiés · validation expérimentale non établie';$('quant-content').hidden=false;$('quantitative-panel').dataset.status='ready';draw();if(current)context(current);
 }
 window.addEventListener('poly-documentary-render',e=>context(e.detail));
 init().catch(fail);
})();