import {traceC4Parents} from './c4-lineage.mjs';
import {createC4VoxelLineage} from './c4-voxel-lineage.mjs';

export function mountC4Lineage(host,onVoxelChange){
 host.innerHTML='<details id="c4-lineage"><summary>Pourquoi ce résultat ? Remonter le bilan</summary><p>Filiation des termes du modèle : elle explique le calcul et ses hypothèses. Ce journal ne compte pas les réactions moléculaires et ne démontre pas une causalité expérimentale.</p><label>Résultat à expliquer <select id="c4-lineage-focus"><option value="net">Variation instantanée</option><option value="retained">Marquage retenu</option><option value="difference">Écart à Glu/Gln</option><option value="voxel">Part d’un voxel virtuel</option></select></label><label>Voxel virtuel (0 à 1 727) <input id="c4-voxel-index" type="number" min="0" max="1727" step="1" value="942"></label><p id="c4-voxel-info"></p><p id="c4-lineage-status" role="status"></p><ol id="c4-lineage-parents"></ol><button type="button" id="c4-lineage-export">Préparer le journal de cet instant</button><textarea id="c4-lineage-json" rows="5" readonly hidden aria-label="Journal de filiation à conserver"></textarea></details>';
 const $=id=>host.querySelector('#'+id);let source=null,engine=null,current=null,selection=null,voxelIndex=942,lastRender=null;
 const back=document.createElement('button');back.type='button';back.textContent='Revenir au résultat choisi';$('c4-lineage-focus').parentElement.after(back);back.onclick=()=>{selection=null;paint();};
 const note=document.createElement('p');note.textContent='Le journal ci-dessous conserve le voxel choisi. La sauvegarde de séance v3 conserve le modèle C4 et son curseur, sans cet indice de consultation.';$('c4-voxel-info').after(note);
 const origins={model_derived:'calcul du modèle',analyst_hypothesis:'hypothèse du scénario',model_parameter:'paramètre du modèle'};
 const units={'1':'sans unité',fraction:'fraction marquée','normalized pool fraction':'fraction du pool normalisé','fraction/tau':'fraction par τ'};
 function explanation(n){
  if(n.key==='spatial:placement')return 'Position et graine choisies dans un cube virtuel ; aucune cellule mesurée.';
  if(n.key==='spatial:weight')return 'Poids de répartition normalisé : la somme des 1 728 poids vaut un.';
  if(n.key==='spatial:selected')return 'Poids du voxel × marquage du pool sélectionné.';
  if(n.key==='spatial:reference')return 'Même poids du voxel × marquage du pool Glu/Gln.';
  if(n.key==='spatial:difference')return 'Écart entre les deux parts, aux mêmes coordonnées et au même instant réduit.';
  if(n.key==='pulse')return 'Marquage imposé de 10,4 % entre τ = 0 et τ = 2, puis zéro.';
  if(n.key==='source')return 'Valeur du programme imposé à cet instant ; à τ = 2, la source est arrêtée.';
  if(n.key.endsWith(':ratio'))return 'Rapport entre le transfert du scénario et le flux neuronal de référence.';
  if(n.key.endsWith(':initial'))return 'Le scénario commence sans marquage neuronal.';
  if(n.key.endsWith(':in'))return 'Traceur entré depuis le début, intégré par la solution analytique reçue.';
  if(n.key.endsWith(':out'))return 'Traceur sorti ou dilué depuis le début, intégré par la même solution.';
  if(n.key.endsWith(':retained'))return 'Marquage initial + entrée cumulée − sortie cumulée.';
  if(n.key==='entry')return 'Rapport de transfert × fraction marquée de la source.';
  if(n.key==='exit')return '(1 + rapport de transfert) × marquage retenu.';
  if(n.key==='net')return 'Entrée instantanée − sortie instantanée.';
  return 'Marquage du scénario − marquage Glu/Gln, au même instant réduit.';
 }
 function paint(){
  if(!current)return;
  const root=current.roots[$('c4-lineage-focus').value];
  const rows=traceC4Parents(current,selection??root),list=$('c4-lineage-parents');list.replaceChildren();
  $('c4-lineage-status').textContent='τ '+current.tau.toFixed(2)+' · '+(current.phase==='input_on'?'source active':'source arrêtée')+' · liens de dépendance du calcul, sans durée humaine.';
  for(const n of rows){
   const li=document.createElement('li'),b=document.createElement('button'),p=document.createElement('p');b.type='button';b.textContent=n.label+(n.value===null?'':' : '+Number(n.value.toPrecision(7))+' '+(units[n.unit]??n.unit));b.onclick=()=>{selection=n.id;paint();};
   p.textContent=explanation(n)+' Origine : '+origins[n.origin]+'.';li.append(b,p);list.append(li);
  }
 }
 $('c4-voxel-index').oninput=$('c4-voxel-index').onchange=()=>{const raw=$('c4-voxel-index').value,n=Number(raw);if(!raw.trim()||!Number.isInteger(n)||n<0||n>1727){$('c4-voxel-info').textContent='Choisir un indice entier entre 0 et 1 727 ; le dernier voxel reçu est conservé.';return;}voxelIndex=n;if(onVoxelChange)onVoxelChange(n);else if(lastRender)render(...lastRender);};
 $('c4-lineage-focus').onchange=()=>{selection=null;paint();};
 $('c4-lineage').addEventListener('toggle',()=>{if($('c4-lineage').open)paint();});
 $('c4-lineage-export').onclick=()=>{if(!current)return;const area=$('c4-lineage-json');area.value=JSON.stringify(current,null,2);area.hidden=false;};
 function render(receipt,index,hypothesis){
  if(receipt!==source){engine=createC4VoxelLineage(receipt);source=receipt;}
  lastRender=[receipt,index,hypothesis];current=engine.snapshot(index,hypothesis,voxelIndex);selection=null;$('c4-lineage-json').hidden=true;
  const v=current.spatial;$('c4-voxel-info').textContent='Voxel '+v.index+' · coordonnées virtuelles ('+v.position.map(x=>x.toFixed(3)).join(', ')+') · poids '+v.weight.toExponential(3)+' · graine '+v.seed+'. Le repère jaune indique ce voxel. Les valeurs sont des parts du pool, pas des concentrations locales.';
  if($('c4-lineage').open)paint();
 }
 return {render,voxelIndex:()=>voxelIndex};
}
