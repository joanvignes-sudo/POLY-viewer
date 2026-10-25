import {attachReaderManifest} from './precomputed-reader-manifest.mjs';
export function validateThermal(d){
 if(!d||d.schema!=='poly.thermal-research.v1'||d.nodes!==85||d.experimental_validation!==false||d.avatar_coupled!==false||!d.equilibrium?.numerical_stationarity_received)throw Error('Contrat thermique invalide');
 for(const step of [60,30,15]){const rows=d.series?.[step];if(!Array.isArray(rows)||rows.length!==7200/step)throw Error('Série incomplète');for(let i=0;i<rows.length;i++){const r=rows[i];if(!Array.isArray(r)||r.length!==3||!r.every(Number.isFinite)||r[0]!==step*(i+1))throw Error('Temps ou température invalide');}}return d;
}
if(typeof document!=='undefined'){
 const status=document.querySelector('#status');try{
 const r=await fetch('temperature-recherche.json');if(!r.ok)throw Error('Données indisponibles');const d=validateThermal(await r.json());
 document.querySelector('#rest').textContent=`Point fixe : peau moyenne ${d.equilibrium.skin_mean_C.toFixed(3)} °C ; sang central ${d.equilibrium.central_blood_C.toFixed(3)} °C. Résidu maximal par pas : ${d.equilibrium.max_fixed_point_residual_K.toExponential(2)} K.`;
 const svg=document.querySelector('#chart'),step=document.querySelector('#step');
 function draw(){svg.replaceChildren();const rows=d.series[step.value],ns='http://www.w3.org/2000/svg';const add=(tag,a,text)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;svg.append(e);};const X=t=>70+t/7200*880,Y=t=>350-(t-28)/10*300;
 for(let c=28;c<=38;c+=2){add('line',{x1:70,x2:950,y1:Y(c),y2:Y(c),stroke:'#365061'});add('text',{x:10,y:Y(c)+5,fill:'#eaf0f5'},`${c} °C`);}
 for(let t=0;t<=120;t+=30)add('text',{x:X(t*60),y:390,fill:'#eaf0f5','text-anchor':'middle'},`${t} min`);
 add('line',{x1:X(3600),x2:X(3600),y1:40,y2:350,stroke:'#ffd18a','stroke-dasharray':'4 5'});
 for(const [col,color]of [[1,'#52b6e8'],[2,'#90efd1']])add('polyline',{points:rows.map(r=>`${X(r[0])},${Y(r[col])}`).join(' '),fill:'none',stroke:color,'stroke-width':2});status.textContent=`Calcul préexécuté · pas de ${step.value} secondes · ${rows.length} instants`;
 }step.addEventListener('change',draw);draw();attachReaderManifest({mode:'thermal',data:d,getSelection:()=>step.value,setSelection:value=>{step.value=value;draw();},host:document.querySelector('main')});
 }catch(e){status.textContent=`Lecture impossible : ${e.message}`;}
}
