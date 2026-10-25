import {validateProtocolReference,protocolReferenceAvailable} from './protocol-heart-reference.mjs';
const contextKey=c=>JSON.stringify([c.identity,c.edge_id,c.reading_progress,c.time_kind]);
export class GenericReferenceSession{
 #context=null;
 open(context){if(!protocolReferenceAvailable(context?.group_id,context?.node_id)||context.schema!=='poly.documentary-view-bridge.v1'||context.identity!=='documentary:HASSANPOUR:HASS-BODY'||!Number.isFinite(context.reading_progress)||context.reading_progress<0||context.reading_progress>1||context.time_kind!=='graphical reading fraction, not physiological seconds'||context.physiological_time_s!==undefined&&context.physiological_time_s!==null)throw Error('Contexte générique non disponible pour cette étape.');if(this.#context)throw Error('Une référence est déjà ouverte.');this.#context=structuredClone(context);return this.read();}
 same(context){return Boolean(this.#context)&&contextKey(this.#context)===contextKey(context);}
 read(){return this.#context?structuredClone(this.#context):null;}
 close(){const prior=this.read();this.#context=null;return prior;}
}
export function mountGenericHeartView({meta,getContext,allowed,begin,end,setMode,isReferenceOpen,host}){
 const panel=document.createElement('section');panel.id='generic-heart-view';panel.hidden=true;panel.style.cssText='position:absolute;left:12px;right:12px;bottom:100px;max-height:160px;overflow:auto;z-index:9;background:#102736f5;border:2px solid #ffd18b;border-radius:10px;padding:12px;color:#fff';
 panel.innerHTML='<strong style="position:sticky;top:0;display:block;background:#102736;z-index:1">Cœur HRA de référence · aucune donnée du participant</strong><p id="generic-heart-identity"></p><p>Contexte documentaire générique proposé par POLY. 14 surfaces HRA, sans localisation de capteur, registration individuelle, activité ou effet calculé. Temps physiologique inconnu.</p><button id="generic-heart-isolated" aria-pressed="true">Vue isolée</button><button id="generic-heart-body" aria-pressed="false">Corps et contexte</button><button id="generic-heart-close">Revenir à la même étape documentaire</button><p id="generic-heart-status" role="status"></p>';
 host.append(panel);let contract,saved,active=false;const session=new GenericReferenceSession();
 for(const mode of ['isolated','body'])panel.querySelector('#generic-heart-'+mode).onclick=()=>{if(!active)return;try{setMode(mode,contract,saved);for(const value of ['isolated','body'])panel.querySelector('#generic-heart-'+value).setAttribute('aria-pressed',String(value===mode));status(mode==='body'?'Corps entier conservé ; seuls les occultants échantillonnés sont atténués. Les 14 surfaces du cœur restent intactes.':'Cœur isolé de référence ; aucune donnée individuelle.');}catch(e){status(e.message);}};
 const status=message=>panel.querySelector('#generic-heart-status').textContent=message;
 function close(restore=true){if(!active)return;active=false;const before=session.close();end(saved,restore);saved=null;panel.hidden=true;if(restore&&contextKey(before)!==contextKey(getContext()))throw Error('Le contexte documentaire a changé.');}
 panel.querySelector('#generic-heart-close').onclick=()=>{try{close(true);}catch(e){status(e.message);panel.hidden=false;}};
 window.addEventListener('poly-generic-heart-open',()=>{
  const bridgeStatus=document.getElementById('bridge-status');
  try{
   if(active)return;if(!contract)throw Error('Contrat de contexte générique indisponible.');if(!allowed())throw Error('Utiliser Anatomie HRA, debout en pause et hors vue spécialisée.');
   const context=getContext();session.open(context);
   try{saved=begin(contract);}catch(e){session.close();throw e;}
   active=true;panel.hidden=false;for(const mode of ['isolated','body'])panel.querySelector('#generic-heart-'+mode).setAttribute('aria-pressed',String(mode==='isolated'));panel.querySelector('#generic-heart-identity').textContent=`Étape conservée : ${context.identity} · progression documentaire ${(context.reading_progress*100).toFixed(1)} %.`;
   status('Référence générique ouverte ; les mesures restent dans leur protocole. Fermer cette vue avant de reprendre ou exporter un manifeste documentaire.');
   if(bridgeStatus)bridgeStatus.textContent='Vue HRA générique : aucune correspondance individuelle ni propagation calculée.';
  }catch(e){if(bridgeStatus)bridgeStatus.textContent='Ouverture de référence refusée : '+e.message;}
 });
 fetch('protocol-heart-reference.json').then(r=>{if(!r.ok)throw Error('Contrat indisponible');return r.json();}).then(c=>{contract=validateProtocolReference(c,meta);}).catch(()=>{contract=null;});
 return {update(){if(active&&(!session.same(getContext())||!isReferenceOpen()))close(false);},get active(){return active;}};
}
