import {rigGLSL,deformPosition,smooth} from './rig.js';

export function createRegionalRig(){
  const uniforms=Object.fromEntries(['hipR','hipL','kneeR','kneeL','ankR','ankL','bob',
    'armSwingR','armSwingL','rootTilt'].map(k=>[k,{value:0}]));
  uniforms.rootShift={value:{x:0,y:0,z:0}};
  uniforms.eatShoulder={value:{x:0,y:0,z:0,w:1}};
  uniforms.eatForearm={value:{x:0,y:0,z:0,w:1}};
  return {uniforms,
    reset(){for(const k of ['hipR','hipL','kneeR','kneeL','ankR','ankL','bob','armSwingR','armSwingL','rootTilt'])uniforms[k].value=0;
      Object.assign(uniforms.rootShift.value,{x:0,y:0,z:0});
      for(const k of ['eatShoulder','eatForearm'])Object.assign(uniforms[k].value,{x:0,y:0,z:0,w:1});},
    bind(material){
      material.onBeforeCompile=shader=>{
        Object.assign(shader.uniforms,uniforms);
        shader.vertexShader=rigGLSL+'\n'+shader.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\ntransformed=polyDeform(position);');
      };
      material.customProgramCacheKey=()=> 'poly-regional-historical-rig-v1';
    },
    deform:point=>deformPosition(point,uniforms),
  };
}

// Preserve the historical display loop and its final 160 ms crossfade.
// This is a graphical transfer of OpenSim kinematics to a different atlas, not measured HRA gait.
export function createWalkSampler(motion,scale){
  const rows=motion?.rows,columns=Object.fromEntries((motion?.columns??[]).map((k,i)=>[k,i]));
  const keys=['hip_flexion_r','hip_flexion_l','knee_angle_r','knee_angle_l','ankle_angle_r','ankle_angle_l','pelvis_ty'];
  if(!Array.isArray(rows)||rows.length<67||!Number.isFinite(scale)||scale<=0||
    keys.some(k=>!Number.isInteger(columns[k]))||
    rows.some((r,i)=>!Array.isArray(r)||!r.every(Number.isFinite)||keys.some(k=>!Number.isFinite(r[columns[k]]))||(i>0&&r[0]<=rows[i-1][0])))
    throw Error('Cinématique de référence invalide');
  const start=rows[0][0],duration=1.08;
  if(rows.at(-1)[0]<start+duration)throw Error('Cinématique trop courte');
  function value(t,key){
    const i=Math.max(0,Math.min(rows.length-2,Math.floor((t-start)*60)));
    const a=rows[i],b=rows[i+1],f=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));
    const v=a[columns[key]]+(b[columns[key]]-a[columns[key]])*f;
    return v+(rows[0][columns[key]]-v)*smooth(t,start+duration-.16,start+duration);
  }
  return {duration,apply(elapsed,uniforms){
    if(!Number.isFinite(elapsed)||elapsed<0)throw Error('Temps de lecture invalide');
    const t=start+elapsed%duration,rad=Math.PI/180;
    for(const [u,k]of [['hipR','hip_flexion_r'],['hipL','hip_flexion_l'],['kneeR','knee_angle_r'],
      ['kneeL','knee_angle_l'],['ankR','ankle_angle_r'],['ankL','ankle_angle_l']])uniforms[u].value=-value(t,k)*rad;
    uniforms.bob.value=(value(t,'pelvis_ty')-rows[0][columns.pelvis_ty])*scale;
    // Historical walking activities use contralateral arm swing.
    uniforms.armSwingR.value=uniforms.hipL.value*.55;
    uniforms.armSwingL.value=uniforms.hipR.value*.55;
  }};
}
