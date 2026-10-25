const expected={"standing-nonuniform-t30.json": "533b5aab0b42a30d4921dc099b5714b973ee1c990c50d38ddbdc4a9b05e764a8", "standing-nonuniform-t30-contract.json": "e7a0270332a85e729444ba5e4f3bd3248ac40eb47cda44800b5e339defa092ac", "standing-nonuniform-t30-receipt.json": "5e77cfbaae1a6fa725c25d40f8c9d0409a1c7c4a20a46e2456705891c3178bb4"};
const section=document.getElementById('nonuniform-t30');
if(section){
 const status=document.createElement('p');status.setAttribute('role','status');status.id='standing-nonuniform-download-status';section.append(status);
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
