const expected={"thermal-step-study-t29.json": "e12ba9e62835d8c0c25a61aedf45a57a19bfabd28635c16c8952630c6424385d", "thermal-step-pair-15-t29.json": "daedeaf0bd80386448f22bf9eb5b2cebab2b26fe3a1e13afea6e1e1108291483"};
const section=document.getElementById('thermal-step-study');
if(section){
 const status=document.createElement('p');status.setAttribute('role','status');status.id='thermal-study-download-status';section.append(status);
 for(const link of section.querySelectorAll('a[download]'))link.addEventListener('click',async event=>{
  event.preventDefault();const name=link.getAttribute('href');if(!expected[name])return;
  status.textContent='Préparation du fichier…';
  try{
   const response=await fetch(name,{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw Error('Fichier indisponible.');
   const bytes=await response.arrayBuffer();
   const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
   if(sha!==expected[name])throw Error('Le fichier ne correspond pas à la version reçue.');
   const url=URL.createObjectURL(new Blob([bytes],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Fichier vérifié et transmis au navigateur.';
  }catch(e){status.textContent='Téléchargement impossible : '+e.message;}
 });
}
