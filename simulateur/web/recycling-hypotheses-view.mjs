import {HYPOTHESES,runRecyclingHypotheses,restoreRecyclingHypotheses} from './recycling-hypotheses-core.mjs';
export function mountRecyclingHypotheses(host,onChange){
 let receipt=null;const $=id=>host.querySelector('#'+id);
 host.innerHTML=`<details id="recycling-panel" class="case-references"><summary>Simulations comparées · recyclage du glutamate</summary>
 <p>Trois scénarios de flux, quatre hypothèses : comparer leurs équilibres de marquage C4, puis examiner la sensibilité sur 15 valeurs de flux.</p>
 <button type="button" id="recycling-run">Calculer toute la comparaison</button> <button type="button" id="recycling-clear">Retirer la comparaison</button>
 <p id="recycling-status" class="case-status" role="status">Prêt : 60 évaluations stationnaires, sans vitesse cellulaire inventée.</p>
 <div id="recycling-output" hidden><span class="case-badge">Origine : modèle réduit · hypothèses explicites</span>
 <label>Scénario de flux Glu/Gln <select id="recycling-scenario"><option value="0.32">Centre publié · 0,32</option><option value="0.25">Sensibilité basse · 0,25</option><option value="0.39">Sensibilité haute · 0,39</option></select> µmol/g/min</label>
 <p>Les bornes sont la moyenne ± un écart-type publié, explorées séparément. Ce ne sont pas trois groupes de personnes.</p>
 <svg id="recycling-chart" viewBox="0 0 520 240" role="img" aria-label="Enrichissement neuronal C4 prédit selon quatre hypothèses ; bande descriptive moyenne plus ou moins un écart-type publiée"></svg>
 <div style="overflow:auto"><table><thead><tr><th>Hypothèse</th><th>C4 neuronal prédit</th><th>Écart à 2,9 %</th></tr></thead><tbody id="recycling-values"></tbody></table></div><p id="recycling-conclusion"></p>
 <p>Repère publié : C4 neuronal corrigé, 2,9 ± 0,9 %. Bande descriptive, pas intervalle de confiance ni probabilité d’une hypothèse. La correction neuronale dépend elle-même du modèle de compartiments.</p>
 </div><details><summary>Hypothèses, paramètres et source</summary><p>Lebon et al., 2002 : étude humaine au repos. On réduit le bilan C4 à son équilibre : Fₙ = Fq × T / (T + Vₙ). Fq = 10,4 % ; Vₙ = 0,80 µmol/g/min. T = 0 pour l’échange interne seul ; T = Vcycle pour Glu/Gln ; T = 1,1 ou 2 fois Vcycle pour les deux contributions αKG contrefactuelles. Ces poids ne sont pas des mesures.</p><p>Le bilan du traceur vérifie T × Fq = (T + Vₙ) × Fₙ. On ne calcule ni la montée temporelle, ni les réserves, ni l’ATP. Ce bilan stationnaire réduit ne reproduit pas tout le modèle de traceur de l’article. Il compare ce que les hypothèses impliquent sous les mêmes conditions ; il ne prouve pas un mécanisme universel ni la navette lactate.</p><p>Les valeurs du lactate, les états saisis et l’anatomie restent indépendants. La comparaison entière est conservée dans la séance puis recalculée à la reprise.</p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2995528/" target="_blank" rel="noopener">Étude primaire · tableaux 1 et 2</a></details></details>`;
 const colors=['#c8cdd2','#7ce3c0','#f4c16d','#c9a9ff'];
 function svg(tag,attrs,text){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;return e;}
 function show(){
  $('recycling-output').hidden=!receipt;if(!receipt){$('recycling-values').replaceChildren();$('recycling-chart').replaceChildren();return;}
  const cycle=Number($('recycling-scenario').value),rows=receipt.rows.filter(r=>r.cycle_umol_g_min===cycle),chart=$('recycling-chart'),Y=p=>207-p/6*170;
  chart.replaceChildren(svg('rect',{x:40,y:Y(3.8),width:460,height:Y(2)-Y(3.8),fill:'#51878d',opacity:.25}),svg('line',{x1:40,x2:500,y1:Y(2.9),y2:Y(2.9),stroke:'#d5f3ff','stroke-dasharray':'4 4'}));
  for(let p=0;p<=6;p+=2){chart.append(svg('text',{x:3,y:Y(p)+4,fill:'#d4e5ed','font-size':12},p+' %'),svg('line',{x1:40,x2:500,y1:Y(p),y2:Y(p),stroke:'#324955'}));}
  rows.forEach((r,i)=>{const x=85+i*125;chart.append(svg('circle',{cx:x,cy:Y(r.neuronal_C4_fraction*100),r:7,fill:colors[i]}),svg('text',{x,y:232,fill:colors[i],'text-anchor':'middle','font-size':12},['Interne','Glu/Gln','+10 % αKG','+100 % αKG'][i]));});
  $('recycling-values').replaceChildren(...rows.map((r,i)=>{const tr=document.createElement('tr');tr.style.borderLeft='4px solid '+colors[i];for(const text of [HYPOTHESES[i].label,(r.neuronal_C4_fraction*100).toFixed(3)+' %',(r.observed_difference_fraction*100).toFixed(3)+' points']){const td=document.createElement('td');td.textContent=text;tr.append(td);}return tr;}));
  $('recycling-conclusion').textContent='Lecture de toute la sensibilité : '+HYPOTHESES.map(h=>{const rr=receipt.rows.filter(r=>r.hypothesis===h.id),values=rr.map(r=>r.neuronal_C4_fraction*100);return h.label+' : '+Math.min(...values).toFixed(2)+'–'+Math.max(...values).toFixed(2)+' %';}).join(' ; ')+'. Un recouvrement ne départage pas les hypothèses.';
 }
 $('recycling-run').onclick=()=>{receipt=runRecyclingHypotheses({schema:'poly.recycling-request.v1',design:'published-sensitivity-v1'});show();onChange?.();$('recycling-status').textContent='60 équilibres calculés et bilans du traceur contrôlés · 3 scénarios principaux reçus.';};
 $('recycling-scenario').onchange=show;
 $('recycling-clear').onclick=()=>{receipt=null;show();onChange?.();$('recycling-status').textContent='Comparaison retirée ; autres résultats et états conservés.';};
 return {read:()=>receipt===null?null:restoreRecyclingHypotheses(receipt),set(value){const accepted=value===null?null:restoreRecyclingHypotheses(value);receipt=accepted;show();$('recycling-status').textContent=receipt?'Comparaison reprise : 60 équilibres recalculés.':'Aucune comparaison reçue.';}};
}
