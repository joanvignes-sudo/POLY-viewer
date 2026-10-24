import {compareHumanLactate,restoreHumanLactate} from './human-lactate-core.mjs';
export function mountHumanLactate(host,onChange){
 let receipt=null;const $=id=>host.querySelector('#'+id);
 host.innerHTML=`<details id="human-lactate-panel" class="case-references"><summary>Calcul exploratoire · lactate sanguin</summary>
 <p>Évaluer les relations publiées chez l’humain entre lactate plasmatique, lactate cérébral régional et flux. Deux conditions saisies ; même relation statistique.</p>
 <form id="human-lactate-form"><label>Référence plasmatique (mmol/L) <input id="lactate-reference" type="number" min="0.8" max="2.8" step="any" required></label><label>Condition plasmatique (mmol/L) <input id="lactate-condition" type="number" min="0.8" max="2.8" step="any" required></label><button type="submit">Évaluer les deux conditions</button><button type="button" id="lactate-clear">Retirer ce calcul</button></form>
 <p id="human-lactate-status" class="case-status" role="status">Entrer les deux concentrations dans le domaine étudié : 0,8 à 2,8 mmol/L.</p>
 <div id="human-lactate-output" hidden><span class="case-badge">Origine : modèle · régressions publiées</span><p id="human-lactate-request"></p><div style="overflow:auto"><table><thead><tr><th>Grandeur</th><th>Référence</th><th>Condition</th><th>Différence</th></tr></thead><tbody id="human-lactate-values"></tbody></table></div><p>Affichage arrondi ; valeurs complètes conservées dans la sauvegarde.</p></div>
 <details><summary>Protocole, équations et portée</summary><p>Boumezbeur et al., 2010 : 7 volontaires sains, 9 expériences utilisées pour la cinétique ; perfusion de [3-¹³C]lactate, environ 2 h, volume spectroscopique occipito-pariétal, acquisitions de 5,3 min. Les mesures et paramètres propres aux neurones et astrocytes ne sont pas ces régressions régionales.</p><p>Pour P en mmol/L : lactate régional = 0,63 P (µmol/g) ; influx = 0,042 P ; consommation nette = 0,019 P − 0,007 (flux en µmol/g/min). Sortie dérivée = influx − consommation nette sous l’hypothèse stationnaire. Les coefficients sont ceux publiés, arrondis ; aucun réajustement par POLY.</p><p>Ce calcul ne produit ni cinétique MCT2, ni échange astrocyte–neurone, ni effet causal individuel. Les incertitudes de prédiction ne sont pas disponibles. Les couleurs saisies et l’avatar restent inchangés. La sauvegarde du chantier inclut ce calcul et le reconstitue à l’import.</p><a href="https://doi.org/10.1523/JNEUROSCI.2040-10.2010" target="_blank" rel="noopener">Publication primaire et figure 6</a></details></details>`;
 function show(){
  $('human-lactate-output').hidden=!receipt;
  if(!receipt){$('human-lactate-values').replaceChildren();return;}
  $('human-lactate-request').textContent='Calcul reçu : référence '+receipt.request.plasma_reference_mmol_L+' mmol/L ; condition '+receipt.request.plasma_condition_mmol_L+' mmol/L.';
  const rows=[['Lactate régional (µmol/g)','regional_lactate_umol_g'],['Influx (µmol/g/min)','influx_umol_g_min'],['Consommation nette (µmol/g/min)','net_consumption_umol_g_min'],['Sortie dérivée (µmol/g/min)','derived_efflux_umol_g_min']];
  $('human-lactate-values').replaceChildren(...rows.map(([label,key])=>{const tr=document.createElement('tr');for(const v of [label,...['reference','condition','condition_minus_reference'].map(part=>receipt[part][key].toPrecision(3))]){const td=document.createElement('td');td.textContent=v;tr.append(td);}return tr;}));
  $('lactate-reference').value=receipt.request.plasma_reference_mmol_L;$('lactate-condition').value=receipt.request.plasma_condition_mmol_L;
 }
 $('human-lactate-form').onsubmit=e=>{e.preventDefault();try{
  const request={schema:'poly.human-lactate-request.v1',plasma_reference_mmol_L:Number($('lactate-reference').value),plasma_condition_mmol_L:Number($('lactate-condition').value)};
  const accepted=compareHumanLactate(request);receipt=accepted;show();onChange?.();$('human-lactate-status').textContent='Deux conditions évaluées ; unités et bilan stationnaire reçus. Carte des états saisis inchangée.';
 }catch(error){$('human-lactate-status').textContent='Calcul refusé : '+error.message+' Dernier calcul reçu conservé.';}};
 $('human-lactate-form').addEventListener('input',()=>{$('human-lactate-status').textContent=receipt?'Saisie modifiée : évaluer pour remplacer le calcul reçu. Les résultats affichés gardent leurs conditions indiquées.':'Conditions à évaluer ; aucun calcul reçu.';});
 $('lactate-clear').onclick=()=>{receipt=null;show();$('lactate-reference').value='';$('lactate-condition').value='';onChange?.();$('human-lactate-status').textContent='Calcul retiré ; états de scénario conservés.';};
 return {read:()=>receipt===null?null:restoreHumanLactate(receipt),set(value){const accepted=value===null?null:restoreHumanLactate(value);receipt=accepted;show();$('human-lactate-status').textContent=receipt?'Calcul repris après réévaluation des équations publiées.':'Aucun calcul lactate reçu.';}};
}
