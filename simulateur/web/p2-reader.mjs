import {CausalKernel as Kernel} from './p2-core/causal-kernel.mjs';
const definitions=[{id:'départ',next:[{target:'A',delay:2},{target:'B',delay:4}]},{id:'A',set:{a:true}},{id:'B',set:{b:true}},{id:'réunion A + B',when:{a:true,b:true},set:{joined:true}}];
const $=id=>document.getElementById(id);
 let kernel, checkpoint;
const labels={completed:'terminé',pending:'en attente',cancelled:'annulé',invalidated:'invalidé',skipped:'condition non satisfaite'};
const aside=document.querySelector('main > aside');
const pending=document.createElement('p');pending.setAttribute('aria-live','polite');$('trace').after(pending);
const transfer=document.createElement('section');transfer.innerHTML='<h2>Sauvegarde vérifiée</h2><p>Reprise par relecture du journal causal. Les fichiers restent sur cet ordinateur.</p><button id="p2-export">Exporter le checkpoint</button><label style="display:block;margin:12px 0">Reprendre un fichier JSON <input id="p2-import" type="file" accept="application/json,.json"></label>';
aside.append(transfer);
function draw(){
 $('clock').textContent=`Temps synthétique : ${kernel.now} ticks`;
 $('trace').replaceChildren(...kernel.trace.map(e=>{const li=document.createElement('li'); const instance=kernel.events.find(i=>i.id===e.id);li.textContent=`${e.time} · ${e.id} · ${instance.definitionId} · ${labels[e.status]} · causes : ${instance.parents.join(', ')||'origine'}`;return li;}));
 pending.textContent='En attente : '+(kernel.events.filter(e=>e.status==='pending').map(e=>`${e.id} (${e.definitionId}, tick ${e.at}, causes ${e.parents.join(' + ')||'origine'})`).join(' ; ')||'aucun événement');
 $('finish').disabled=kernel.now>=6;
 $('cancel').disabled=!kernel.events.some(e=>e.definitionId==='A'&&e.status==='pending');
}
function reset(){kernel=new Kernel(definitions);kernel.schedule('départ',0);kernel.run(0);kernel.join('branches-ab','réunion A + B',['e1','e2'],1);checkpoint=undefined;$('restore').disabled=true;$('notice').textContent='A au tick 2, B au tick 4 ; réunion au tick 5, avec les deux causes requises.';draw();}
function act(fn){try{$('notice').textContent='Action terminée sur le scénario synthétique.';fn();draw();}catch(e){$('notice').textContent='Action refusée : vérifier le temps demandé et les limites du scénario.';}}
const actions={step:()=>kernel.run(kernel.now+1),finish:()=>kernel.run(6),cancel:()=>{const e=kernel.events.find(e=>e.definitionId==='A'&&e.status==='pending');if(e)kernel.cancel(e.id);},save:()=>{checkpoint=kernel.save();$('restore').disabled=false;$('notice').textContent='Checkpoint conservé en mémoire pour cette page.';},restore:()=>{if(checkpoint){kernel=Kernel.resume(checkpoint);$('notice').textContent='État et trace restaurés.';}},reset};
for(const [id,fn]of Object.entries(actions)) $(id).addEventListener('click',()=>act(fn));
$('p2-export').addEventListener('click',()=>act(()=>{const url=URL.createObjectURL(new Blob([kernel.save()],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='POLY_P2_checkpoint_synthetique.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('notice').textContent='Checkpoint exporté : réseau purement synthétique.';}));
$('p2-import').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(file.size>16000000)throw Error('Fichier trop volumineux');const next=Kernel.resume(await file.text());kernel=next;checkpoint=next.save();$('restore').disabled=false;$('notice').textContent='Checkpoint vérifié par relecture du journal et repris.';draw();}
 catch(error){$('notice').textContent='Import refusé : sauvegarde incohérente, incompatible ou trop volumineuse. Le scénario courant est conservé.';}
 finally{event.target.value='';}
});
reset();

import {mountResearchChannels} from './p2-research-channels.mjs';
mountResearchChannels(aside);

import {mountThermalRuntime} from './p2-thermal-runtime.mjs';
mountThermalRuntime(aside);
