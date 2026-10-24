// Sauvegarde d'une séance de consultation, jamais un état physiologique du corps.
export const LIGHT_LEVELS=[5.3,5.8,7.3,9.6,13.3];
export function createSession({mode,thermal,light}){
 const payload={schema:'poly.atelier-session.v1',mode,thermal,light,
   clocks:{thermal:'native_model_elapsed_s',light:'subject-01/sn2_recording_s',world_time_s:null},
   biological_coupling:false,avatar_write:false,physiological_validation:false,
   scope:'Preferences and selection only; not a physiological simulation or source measurement'};
 return validateSession(payload);
}
export function validateSession(p){
 if(!p||p.schema!=='poly.atelier-session.v1'||!['thermal','light','chains'].includes(p.mode)||
  p.clocks?.thermal!=='native_model_elapsed_s'||p.clocks?.light!=='subject-01/sn2_recording_s'||
  p.clocks.world_time_s!==null||p.biological_coupling!==false||
  p.avatar_write!==false||p.physiological_validation!==false)throw Error('Contrat de séance refusé');
 const t=p.thermal,l=p.light;
 if(!t||![15,30,60].includes(t.step_s)||![60,300,600].includes(t.speed_s)||
   !Number.isInteger(t.time_s)||t.time_s<t.step_s||t.time_s>7200||t.time_s%t.step_s!==0)
  throw Error('Temps thermique non compatible');
 if(!l||!LIGHT_LEVELS.includes(l.level_lux)||![1,3,5].includes(l.duration_s)||![0,.1,.2].includes(l.delay_s))
  throw Error('Scénario lumière non reçu');
 return p;
}