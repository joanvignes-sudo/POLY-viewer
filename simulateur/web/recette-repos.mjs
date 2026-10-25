const $=id=>document.getElementById(id);
try {
 const response=await fetch('recette-repos.json');if(!response.ok)throw Error('Bilan indisponible');const d=await response.json();
 const raw=await fetch('../data/poly-canonical-scaffold-v1.json');if(!raw.ok)throw Error('Registre indisponible');
 const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await raw.arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');
 const current=digest===d.registry_sha256;$('fresh').textContent=current?'Le registre chargé correspond exactement au contrôle.':'Registre modifié depuis le contrôle : recette à refaire.';
 $('hash').textContent=d.registry_sha256;
 const names={bones:'Os',muscle_surfaces:'Surfaces musculaires BodyParts3D',hra_structures:'Structures HRA',nerve_routes:'Routes nerveuses schématiques'};
 const table=document.createElement('table');for(const [key,n] of Object.entries(d.counts)){const tr=table.insertRow();tr.insertCell().textContent=names[key]||key;tr.insertCell().textContent=n;}$('counts').append(table);
 $('result').textContent=current&&d.technical_checks_passed?`${d.unique_identifiers} identités uniques, ${d.finite_display_anchors} repères d’affichage finis ; aucune incohérence détectée dans le périmètre contrôlé.`:'Le résultat technique ne peut pas être reçu : consulter le détail et refaire le contrôle.';
}catch(e){$('fresh').textContent='Contrôle indisponible : '+e.message;}
