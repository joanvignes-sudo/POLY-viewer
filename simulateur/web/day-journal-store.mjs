import {validateDay,defaultDay,summarizeDay} from './day-model.js?v=audit-o-1';
export const DAY_STORAGE_KEY='poly.day.v1',MAX_JOURNAL_BYTES=1048576,MAX_JOURNAL_FILE_BYTES=3*MAX_JOURNAL_BYTES;
const bytes=text=>new TextEncoder().encode(text).byteLength;
export function validateJournal(day){
 validateDay(day);
 if(day.biological_prediction!==undefined&&day.biological_prediction!==false)throw Error('Ce journal ne calcule pas de prédiction biologique');
 if(day.title!==undefined&&typeof day.title!=='string')throw Error('Titre de journal invalide');
 if(day.events.length>1000||day.experiences.length>1000||bytes(JSON.stringify(day))>MAX_JOURNAL_BYTES)throw Error('Journal au-delà de la limite de consultation (1 Mio, 1000 activités et 1000 événements)');
 return day;
}
export function createDayJournalStore(storage,{newBackupKey=()=>('poly.day.backup.v1.'+crypto.randomUUID()),now=()=>new Date().toISOString()}={}){
 let raw=null,known=false,draft=null,source='not_loaded',dirty=false,revision=0,lastBackup=null,error=null;
 function load(){
  revision++;dirty=false;draft=null;error=null;known=false;
  try{raw=storage.getItem(DAY_STORAGE_KEY);known=true;}catch{source='unavailable';error='Lecture du stockage local indisponible';return state();}
  if(raw===null){source='absent';return state();}
  try{if(bytes(raw)>MAX_JOURNAL_BYTES)throw Error('Journal enregistré trop volumineux ; copie brute conservée');draft=structuredClone(validateJournal(JSON.parse(raw)));source='stored';}
  catch(e){source='invalid';error=e.message;}
  return state();
 }
 function state(){let conflict=false,accessible=known,readError=null;if(known)try{conflict=changed();}catch(e){accessible=false;readError=e.message;}return {source,dirty,revision,error:readError??error,has_raw:known&&raw!==null,storage_read:accessible,last_backup:lastBackup,conflict};}
 function changed(){try{return storage.getItem(DAY_STORAGE_KEY)!==raw;}catch{throw Error('Lecture du stockage local indisponible ; journal enregistré non remplacé');}}
 function stage(value,label){draft=structuredClone(validateJournal(value));dirty=true;source=label;error=null;revision++;return state();}
 function update(edit){if(!draft)throw Error('Aucun journal modifiable');const next=structuredClone(draft);edit(next);return stage(next,'draft');}
 function save(){
  if(!draft)throw Error('Aucun journal à enregistrer');if(!known)throw Error('Relire le stockage avant tout enregistrement');
  validateJournal(draft);if(changed())throw Error('Le journal enregistré a changé dans une autre page ; exporter ce brouillon ou relire la version enregistrée');
  if(!dirty)return {saved:false,backup_key:null};
  const next={...structuredClone(draft),biological_prediction:false};
  if(Object.hasOwn(next,'summary'))next.summary=summarizeDay(next,1440);
  const text=JSON.stringify(next);if(bytes(text)>MAX_JOURNAL_BYTES)throw Error('Journal trop volumineux');
  let backup=null;
  if(raw!==null){
   backup=newBackupKey();if(typeof backup!=='string'||!backup.startsWith('poly.day.backup.v1.')||storage.getItem(backup)!==null)throw Error('Copie de sauvegarde indisponible ; journal précédent conservé');
   storage.setItem(backup,raw);lastBackup=backup;
  }
  // localStorage has no cross-tab CAS: detect changes again after the backup.
  if(changed())throw Error('Une autre page a changé le journal pendant la sauvegarde ; version enregistrée conservée');
  storage.setItem(DAY_STORAGE_KEY,text);raw=text;draft=next;dirty=false;source='stored';error=null;revision++;return {saved:true,backup_key:backup};
 }
 return {load,state,get day(){return draft?structuredClone(draft):null;},update,save,
  prepareExample:()=>stage(defaultDay,'example_draft'),
  importText(text){if(typeof text!=='string'||bytes(text)>MAX_JOURNAL_FILE_BYTES)throw Error('Fichier d’import limité à 3 Mio');const {summary,...source}=JSON.parse(text);return stage(source,'import_draft');},
  exportText(){if(!draft)throw Error('Aucun journal à exporter');validateJournal(draft);const text=JSON.stringify({...structuredClone(draft),biological_prediction:false,summary:summarizeDay(draft,1440),exported_at:now()});if(bytes(text)>MAX_JOURNAL_FILE_BYTES)throw Error('Export au-delà de 3 Mio');return text;},
  rawText(){if(!known||raw===null)throw Error('Aucune copie brute lue');return raw;},
 };
}
